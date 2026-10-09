import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { Member } from "@/lib/types";

/** Quem está logado nesta requisição (ou null). Cacheado por requisição. */
export const getSessao = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  const email = typeof claims.email === "string" ? claims.email.toLowerCase() : null;
  return { supabase, userId: claims.sub, email };
});

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email) && env.adminEmails().includes(email!.toLowerCase());
}

/**
 * Exige login + acesso ativo. A decisão de acesso vem de has_access()
 * no banco — a MESMA função usada pelo Row Level Security.
 */
export const exigirMembro = cache(async () => {
  const sessao = await getSessao();
  if (!sessao) redirect("/entrar?next=/app");

  const [{ data: temAcesso }, { data: member }] = await Promise.all([
    sessao.supabase.rpc("has_access"),
    sessao.supabase.from("members").select("*").eq("id", sessao.userId).maybeSingle<Member>(),
  ]);

  if (!temAcesso) redirect("/sem-acesso");
  return { ...sessao, member };
});

/** Exige login com um e-mail listado em ADMIN_EMAILS. Outros recebem 404. */
export const exigirAdmin = cache(async () => {
  const sessao = await getSessao();
  if (!sessao) redirect("/entrar?next=/admin");
  if (!isAdminEmail(sessao.email)) notFound();
  return sessao;
});
