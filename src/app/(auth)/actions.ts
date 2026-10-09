"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAnonClient } from "@/lib/supabase/admin";
import { enviarEmailDeAcesso, linkDefinirSenha } from "@/lib/access-email";
import { normalizarEmail } from "@/lib/kiwify/parse";
import { caminhoSeguro } from "@/lib/format";

export type EstadoForm = { erro?: string; ok?: string; email?: string } | undefined;

/** Mesma mensagem sempre — nunca revela se o e-mail existe. */
const MSG_NEUTRA =
  "Pronto! Se esse e-mail tiver uma assinatura ativa, você vai receber em instantes um link pra criar sua senha. Confira também a caixa de spam e a aba Promoções.";

export async function entrarAction(_: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const email = normalizarEmail(String(formData.get("email") ?? ""));
  const senha = String(formData.get("senha") ?? "");
  const next = caminhoSeguro(String(formData.get("next") ?? ""), "/app");

  if (!email || !senha) return { erro: "Preencha seu e-mail e sua senha.", email: email ?? "" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        erro: "Você ainda não criou sua senha. Use o Primeiro acesso pra receber o link.",
        email,
      };
    }
    return { erro: "E-mail ou senha incorretos.", email };
  }

  redirect(next);
}

export async function primeiroAcessoAction(_: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const email = normalizarEmail(String(formData.get("email") ?? ""));
  if (!email) return { erro: "Digite o e-mail que você usou na compra." };

  try {
    await enviarEmailDeAcesso(email);
  } catch (e) {
    console.error("[primeiro-acesso]", e);
  }
  return { ok: MSG_NEUTRA };
}

export async function esqueciSenhaAction(_: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const email = normalizarEmail(String(formData.get("email") ?? ""));
  if (!email) return { erro: "Digite seu e-mail." };

  try {
    const r = await enviarEmailDeAcesso(email);
    // Quem não é membro ativo (ex.: admin) ainda pode redefinir a senha.
    if (!r.enviado) {
      await createAnonClient().auth.resetPasswordForEmail(email, { redirectTo: linkDefinirSenha() });
    }
  } catch (e) {
    console.error("[esqueci-senha]", e);
  }
  return {
    ok: "Pronto! Se existir uma conta com esse e-mail, você vai receber um link pra criar uma nova senha. Confira também o spam.",
  };
}

export async function definirSenhaAction(_: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const senha = String(formData.get("senha") ?? "");
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (senha.length < 8) return { erro: "A senha precisa ter pelo menos 8 caracteres." };
  if (senha !== confirmacao) return { erro: "As duas senhas não são iguais." };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) {
    return { erro: "Seu link expirou. Peça um novo no Primeiro acesso." };
  }

  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) {
    if (error.code === "same_password") return { erro: "Use uma senha diferente da anterior." };
    if (error.code === "weak_password") return { erro: "Essa senha é muito fraca. Tente uma mais longa." };
    return { erro: "Não foi possível salvar a senha. Tente de novo." };
  }

  redirect("/app");
}
