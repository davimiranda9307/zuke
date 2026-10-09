import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient, createAnonClient } from "@/lib/supabase/admin";
import { normalizarEmail } from "@/lib/kiwify/parse";
import { env } from "@/lib/env";

export type ResultadoEnvio =
  | { enviado: true; tipo: "convite" | "recuperacao" }
  | { enviado: false; motivo: string };

/** Link dos e-mails: confirma o token e leva pra tela de criar senha. */
export function linkDefinirSenha(): string {
  return `${env.siteUrl()}/auth/confirm?next=/definir-senha`;
}

/**
 * Manda o e-mail certo pra pessoa entrar:
 * - nunca definiu senha (conta não confirmada) => convite "Defina sua senha";
 * - já tem senha => e-mail de recuperação ("Redefinir senha").
 */
export async function enviarParaUsuario(
  admin: SupabaseClient,
  userId: string,
  email: string,
): Promise<ResultadoEnvio> {
  const redirectTo = linkDefinirSenha();
  const { data } = await admin.auth.admin.getUserById(userId);
  const confirmado = Boolean(data?.user?.email_confirmed_at);

  if (!confirmado) {
    const { error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
    if (!error) return { enviado: true, tipo: "convite" };
    // Se o convite falhar, tenta o e-mail de recuperação (também cria a senha).
  }

  const { error } = await createAnonClient().auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return { enviado: false, motivo: error.message };
  return { enviado: true, tipo: "recuperacao" };
}

/**
 * Usado no /primeiro-acesso e no "reenviar acesso" do admin.
 * Só envia pra quem é membro E tem acesso. A tela nunca revela o resultado.
 */
export async function enviarEmailDeAcesso(emailBruto: string): Promise<ResultadoEnvio> {
  const email = normalizarEmail(emailBruto);
  if (!email) return { enviado: false, motivo: "e-mail inválido" };

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("members")
    .select("id")
    .eq("email", email)
    .maybeSingle<{ id: string }>();
  if (!member) return { enviado: false, motivo: "e-mail não é de nenhum membro" };

  const { data: temAcesso } = await admin.rpc("has_access", { p_uid: member.id });
  if (!temAcesso) return { enviado: false, motivo: "membro sem acesso ativo" };

  return enviarParaUsuario(admin, member.id, email);
}
