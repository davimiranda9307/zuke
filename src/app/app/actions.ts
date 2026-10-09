"use server";

import { getSessao } from "@/lib/auth";

export type EstadoFeedback = { ok?: boolean; erro?: string } | undefined;

const TIPOS = ["sugerir_loja", "link_quebrado", "outro"] as const;

/** Salva sugestão/problema. O RLS garante que só membro com acesso envia. */
export async function enviarFeedbackAction(_: EstadoFeedback, formData: FormData): Promise<EstadoFeedback> {
  const sessao = await getSessao();
  if (!sessao) return { erro: "Sua sessão expirou. Entre de novo." };

  const tipo = String(formData.get("tipo") ?? "");
  const mensagem = String(formData.get("mensagem") ?? "").trim();
  const pagina = String(formData.get("pagina") ?? "").slice(0, 300);

  if (!TIPOS.includes(tipo as (typeof TIPOS)[number])) return { erro: "Escolha o tipo." };
  if (mensagem.length < 3) return { erro: "Escreva um pouco mais pra gente entender." };
  if (mensagem.length > 2000) return { erro: "Mensagem muito longa (máx. 2000 caracteres)." };

  const { error } = await sessao.supabase.from("feedbacks").insert({
    member_id: sessao.userId,
    email: sessao.email,
    tipo,
    mensagem,
    pagina,
  });
  if (error) return { erro: "Não foi possível enviar agora. Tente de novo." };
  return { ok: true };
}
