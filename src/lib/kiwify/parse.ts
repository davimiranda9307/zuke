/**
 * Leitura TOLERANTE do payload do webhook da Kiwify.
 *
 * O formato exato do payload de vendas não está na documentação pública,
 * então este módulo procura cada informação em vários lugares possíveis.
 * Depois da primeira compra de teste, confira o payload bruto salvo em
 * webhook_events (painel /admin/webhooks) e ajuste os caminhos abaixo se
 * algo não for reconhecido.
 *
 * Módulo puro (sem dependências), pra ser testável isoladamente.
 */

export type Evento =
  | "aprovada"
  | "renovada"
  | "atrasada"
  | "cancelada"
  | "reembolsada"
  | "chargeback"
  | "ignorado";

export type EventoKiwify = {
  /** Como o tipo veio no payload (ex.: "order_approved"). */
  tipoOriginal: string | null;
  /** Tipo normalizado que o sistema entende. */
  evento: Evento;
  email: string | null;
  nome: string | null;
  orderId: string | null;
  subscriptionId: string | null;
  productId: string | null;
  /** Fim do período pago, em ISO, quando o payload informa. */
  periodoPagoAte: string | null;
};

/** Nomes que já vimos/esperamos para cada evento (gatilhos e webhook_event_type). */
const MAPA_EVENTOS: Record<string, Evento> = {
  // compra aprovada
  compra_aprovada: "aprovada",
  order_approved: "aprovada",
  approved: "aprovada",
  // renovação
  subscription_renewed: "renovada",
  assinatura_renovada: "renovada",
  // atraso
  subscription_late: "atrasada",
  assinatura_atrasada: "atrasada",
  // cancelamento
  subscription_canceled: "cancelada",
  subscription_cancelled: "cancelada",
  assinatura_cancelada: "cancelada",
  // reembolso
  compra_reembolsada: "reembolsada",
  order_refunded: "reembolsada",
  refunded: "reembolsada",
  // chargeback
  chargeback: "chargeback",
  order_chargeback: "chargeback",
  order_chargedback: "chargeback",
  chargedback: "chargeback",
};

/** Usado só quando o payload NÃO traz o tipo do evento. */
const MAPA_ORDER_STATUS: Record<string, Evento> = {
  paid: "aprovada",
  approved: "aprovada",
  refunded: "reembolsada",
  chargedback: "chargeback",
  chargeback: "chargeback",
};

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Busca um campo aninhado ignorando maiúsculas/minúsculas nas chaves. */
function get(obj: unknown, path: string): unknown {
  let cur: unknown = obj;
  for (const part of path.split(".")) {
    if (!isObj(cur)) return undefined;
    const key = Object.keys(cur).find((k) => k.toLowerCase() === part.toLowerCase());
    if (key === undefined) return undefined;
    cur = cur[key];
  }
  return cur;
}

/** Primeiro valor não vazio entre vários caminhos, como texto. */
function pick(obj: unknown, paths: string[]): string | null {
  for (const p of paths) {
    const v = get(obj, p);
    if (typeof v === "string" && v.trim() !== "") return v.trim();
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return null;
}

/** Normaliza nomes de evento: minúsculo, espaços/hífens viram "_". */
function slug(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[\s-]+/g, "_");
}

/** E-mail sempre minúsculo e sem espaços. */
export function normalizarEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const e = email.trim().toLowerCase();
  return e.includes("@") ? e : null;
}

/**
 * Converte datas da Kiwify em ISO. Sem fuso => assume horário de Brasília.
 * Só a data (AAAA-MM-DD) => vale até o fim daquele dia.
 */
export function parseData(valor: string | null): string | null {
  if (!valor) return null;
  const v = valor.trim();
  let candidato = v;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    candidato = `${v}T23:59:59-03:00`;
  } else if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(v)) {
    candidato = `${v.replace(" ", "T")}-03:00`;
  } else if (/^\d{2}\/\d{2}\/\d{4}/.test(v)) {
    // DD/MM/AAAA [HH:MM]
    const [d, m, rest] = v.split("/");
    const [ano, hora] = rest.split(/\s+/);
    candidato = hora ? `${ano}-${m}-${d}T${hora}-03:00` : `${ano}-${m}-${d}T23:59:59-03:00`;
  }
  const t = Date.parse(candidato);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

export function parseKiwify(payload: unknown): EventoKiwify {
  const tipoOriginal = pick(payload, [
    "webhook_event_type",
    "event_type",
    "event",
    "trigger",
    "type",
  ]);

  let evento: Evento = "ignorado";
  if (tipoOriginal) {
    evento = MAPA_EVENTOS[slug(tipoOriginal)] ?? "ignorado";
  } else {
    const orderStatus = pick(payload, ["order_status", "status", "Order.status"]);
    if (orderStatus) evento = MAPA_ORDER_STATUS[slug(orderStatus)] ?? "ignorado";
  }

  const email = normalizarEmail(
    pick(payload, [
      "Customer.email",
      "customer.email",
      "buyer.email",
      "Buyer.email",
      "email",
      "customer_email",
    ]),
  );

  const nome = pick(payload, [
    "Customer.full_name",
    "Customer.name",
    "customer.full_name",
    "customer.name",
    "Customer.first_name",
    "buyer.name",
    "name",
  ]);

  const orderId = pick(payload, ["order_id", "order.id", "Order.id", "order_ref", "sale_id"]);

  const subscriptionId = pick(payload, [
    "subscription_id",
    "Subscription.id",
    "subscription.id",
    "Subscription.subscription_id",
  ]);

  const productId = pick(payload, [
    "Product.product_id",
    "Product.id",
    "product.product_id",
    "product.id",
    "product_id",
  ]);

  const periodoPagoAte = parseData(
    pick(payload, [
      "Subscription.next_payment",
      "subscription.next_payment",
      "Subscription.current_period_end",
      "Subscription.end_date",
      "Subscription.ends_at",
      "Subscription.access_until",
      "access_until",
      "subscription_end_date",
    ]),
  );

  return {
    tipoOriginal,
    evento,
    email,
    nome,
    orderId,
    subscriptionId,
    productId,
    periodoPagoAte,
  };
}

/**
 * Chave de idempotência: hash do conteúdo, independente da ordem das chaves.
 * Reenvios idênticos geram a mesma chave; eventos diferentes, chaves diferentes.
 */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (isObj(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}
