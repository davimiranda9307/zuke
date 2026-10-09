import type { StatusMembro } from "@/lib/types";

export const STATUS_LABEL: Record<StatusMembro, string> = {
  ativa: "Ativa",
  atrasada: "Pagamento atrasado",
  cancelada: "Cancelada",
  reembolsada: "Reembolsada",
  chargeback: "Contestada (chargeback)",
};

export const FEEDBACK_LABEL = {
  sugerir_loja: "Sugestão de loja",
  link_quebrado: "Link quebrado",
  outro: "Outro",
} as const;

export function formatarData(iso: string | null | undefined, comHora = false): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(comHora ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function faixaLabel(faixa: number): string {
  return `R$${faixa.toLocaleString("pt-BR")}`;
}

/** Garante http(s) e recusa qualquer outro esquema (ex.: javascript:). */
export function linkSite(url: string | null): string | null {
  if (!url?.trim()) return null;
  const u = url.trim();
  const comEsquema = /^https?:\/\//i.test(u) ? u : `https://${u}`;
  try {
    const parsed = new URL(comEsquema);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

/** Aceita "@loja", "loja" ou a URL completa do Instagram. */
export function linkInstagram(valor: string | null): string | null {
  if (!valor?.trim()) return null;
  const v = valor.trim();
  if (/instagram\.com/i.test(v)) return linkSite(v);
  const handle = v.replace(/^@/, "").replace(/[^a-zA-Z0-9._]/g, "");
  return handle ? `https://instagram.com/${handle}` : null;
}

/** Aceita qualquer formato de telefone; assume Brasil (55) se faltar o DDI. */
export function linkWhatsApp(valor: string | null): string | null {
  if (!valor?.trim()) return null;
  let digitos = valor.replace(/\D/g, "");
  if (digitos.length === 10 || digitos.length === 11) digitos = `55${digitos}`;
  return digitos.length >= 12 ? `https://wa.me/${digitos}` : null;
}

export function linkMapa(endereco: string | null): string | null {
  if (!endereco?.trim()) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco.trim())}`;
}

/** "Plus Size, feminino ,," => ["plus size", "feminino"] */
export function normalizarTags(valor: string): string[] {
  return Array.from(
    new Set(
      valor
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  ).slice(0, 12);
}

/** Só aceita caminhos internos ("/app/..."), nunca outro domínio. */
export function caminhoSeguro(next: string | null | undefined, padrao = "/app"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return padrao;
  return next;
}
