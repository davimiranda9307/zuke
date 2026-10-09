import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Cliente com a chave SECRETA (service role): ignora o RLS.
 * Só existe no servidor — o import de "server-only" quebra o build se
 * alguém tentar usar isto num componente do navegador.
 *
 * Use apenas no webhook, no painel admin e no envio de e-mails de acesso.
 */
export function createAdminClient() {
  return createSupabaseClient(env.supabaseUrl(), env.supabaseServiceKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Cliente "anônimo" sem cookies, pra chamadas públicas do Auth no servidor. */
export function createAnonClient() {
  return createSupabaseClient(env.supabaseUrl(), env.supabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
