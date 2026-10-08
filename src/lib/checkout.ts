import { siteConfig } from "@/config/site";

/**
 * Parâmetros que repassamos da URL da landing para o checkout.
 * Cobre as UTMs padrão + alguns extras comuns de anúncios/afiliados.
 */
const FORWARD_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "fbclid",
  "gclid",
  "ttclid",
  "src",
  "ref",
  "aff",
];

/**
 * Monta o link final do checkout, levando as UTMs/parâmetros de rastreio
 * que vieram na URL da landing. Se o link base for inválido, devolve ele mesmo.
 *
 * @param search  window.location.search (ex.: "?utm_source=ig")
 */
export function buildCheckoutUrl(search: string): string {
  const base = siteConfig.checkoutUrl;
  try {
    const url = new URL(base);
    const incoming = new URLSearchParams(search);
    for (const key of FORWARD_PARAMS) {
      const value = incoming.get(key);
      if (value) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return base;
  }
}
