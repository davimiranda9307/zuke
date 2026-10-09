import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { caminhoSeguro } from "@/lib/format";

export const dynamic = "force-dynamic";

/**
 * GET /auth/confirm — destino dos links dos e-mails (convite e recuperação).
 * Valida o token, cria a sessão e leva pra tela de definir a senha.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const code = params.get("code");
  const padrao = type === "invite" || type === "recovery" ? "/definir-senha" : "/app";
  const next = caminhoSeguro(params.get("next"), padrao);

  const supabase = await createClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) redirect(next);
  } else if (code) {
    // Compatibilidade com links no formato PKCE (?code=...).
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) redirect(next);
  }

  redirect("/primeiro-acesso?erro=link");
}
