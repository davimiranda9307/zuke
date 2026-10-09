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
  "sck",
  "ref",
  "aff",
];

/**
 * Monta o link final do checkout de um plano, levando as UTMs/parâmetros de
 * rastreio que vieram na URL da landing. Se o link for inválido, devolve ele mesmo.
 *
 * @param base    link do checkout do plano (siteConfig.plans[i].checkoutUrl)
 * @param search  window.location.search (ex.: "?utm_source=ig")
 */
export function buildCheckoutUrl(base: string, search: string): string {
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
