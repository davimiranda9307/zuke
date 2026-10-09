import { siteConfig } from "@/config/site";

/**
 * Leitura das variáveis de ambiente, com mensagens claras quando faltar algo.
 * As leituras são "preguiçosas" (só na hora do uso), assim a landing continua
 * buildando e funcionando mesmo antes de você configurar o Supabase.
 */

function obrigatoria(nome: string, valor: string | undefined): string {
  if (!valor || !valor.trim()) {
    throw new Error(
      `Variável de ambiente ${nome} não configurada. Veja o arquivo .env.example.`,
    );
  }
  return valor.trim();
}

export const env = {
  // Precisam ser lidas com o nome literal pra o Next embutir no navegador.
  supabaseUrl: () =>
    obrigatoria("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: () =>
    obrigatoria("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),

  /** Chave secreta: SÓ no servidor. */
  supabaseServiceKey: () =>
    obrigatoria("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY),

  /** URL pública do site (usada nos links dos e-mails). */
  siteUrl: () =>
    (process.env.NEXT_PUBLIC_SITE_URL?.trim() || siteConfig.url).replace(/\/+$/, ""),

  kiwifyWebhookToken: () => process.env.KIWIFY_WEBHOOK_TOKEN?.trim() || undefined,

  /** Se definido, ignora webhooks de outros produtos da sua conta Kiwify. */
  kiwifyProductId: () => process.env.KIWIFY_PRODUCT_ID?.trim() || undefined,

  /** Dias de tolerância com pagamento atrasado (padrão 3). */
  diasTolerancia: () => {
    const n = Number(process.env.LATE_GRACE_DAYS);
    return Number.isFinite(n) && n >= 0 ? n : 3;
  },

  /** E-mails com acesso ao /admin, separados por vírgula. */
  adminEmails: () =>
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
};
