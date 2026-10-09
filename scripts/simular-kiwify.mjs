/**
 * Simula TODOS os eventos da Kiwify contra a rota local do webhook e confere,
 * depois de cada um, o status e o acesso do membro no banco.
 *
 * Uso (com `npm run dev` rodando em outro terminal):
 *   npm run simular:kiwify
 *   npm run simular:kiwify -- --email=voce@gmail.com      (recebe o convite de verdade)
 *   npm run simular:kiwify -- --email=voce@gmail.com --limpar   (e apaga no fim)
 *   npm run simular:kiwify -- --manter                    (guarda o usuário de teste)
 *   npm run simular:kiwify -- --url=https://seu-site.vercel.app/api/webhooks/kiwify
 *
 * Lê as chaves do .env.local (KIWIFY_WEBHOOK_TOKEN e Supabase).
 */
import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

// ---------- argumentos ----------
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.length ? v.join("=") : true];
  }),
);

const RUN = Date.now().toString(36);
const URL_WEBHOOK = args.url || "http://localhost:3000/api/webhooks/kiwify";

// Sem --email: usa um "apelido" do seu e-mail de admin (voce+zukeXXXX@gmail.com),
// que cai na SUA caixa. Assim o teste nunca manda e-mail pra estranhos.
const admin1 = (process.env.ADMIN_EMAILS || "").split(",")[0]?.trim().toLowerCase();
const EMAIL_PADRAO = admin1?.includes("@") ? admin1.replace("@", `+zuke${RUN}@`) : `zuke.teste+${RUN}@example.com`;
const EMAIL = String(args.email || EMAIL_PADRAO).trim().toLowerCase();
// Usuário de teste gerado automaticamente é apagado no fim (use --manter pra guardar).
const LIMPAR = Boolean(args.limpar || (!args.email && !args.manter));
const TOKEN = process.env.KIWIFY_WEBHOOK_TOKEN;
const PRODUCT_ID = process.env.KIWIFY_PRODUCT_ID || "prod_teste";

const cor = { ok: "\x1b[32m", erro: "\x1b[31m", dim: "\x1b[2m", neg: "\x1b[1m", fim: "\x1b[0m" };

if (!TOKEN) {
  console.error(`${cor.erro}Falta KIWIFY_WEBHOOK_TOKEN no .env.local.${cor.fim} Rode com: npm run simular:kiwify`);
  process.exit(1);
}

const temBanco = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const db = temBanco
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })
  : null;

// ---------- payload no formato da Kiwify ----------
const SUB = `sub_${RUN}`;
const dias = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

function payload(tipo, { orderId = `ord_${RUN}_1`, orderStatus = "paid", proximoPagamento = dias(30), status = "active" } = {}) {
  const agora = new Date().toISOString().replace("T", " ").slice(0, 19);
  return {
    order_id: orderId,
    order_ref: orderId.toUpperCase(),
    order_status: orderStatus,
    webhook_event_type: tipo,
    product_type: "membership",
    payment_method: "credit_card",
    store_id: "loja_teste",
    created_at: agora,
    updated_at: agora,
    approved_date: agora,
    Product: { product_id: PRODUCT_ID, product_name: "Zuke" },
    Customer: { full_name: "Cliente Teste", first_name: "Cliente", email: EMAIL.toUpperCase(), mobile: "+5511999999999" },
    Subscription: {
      id: SUB,
      status,
      start_date: agora,
      next_payment: proximoPagamento,
      plan: { id: "plano_mensal", name: "Mensal", frequency: "monthly" },
    },
    subscription_id: SUB,
  };
}

async function enviar(corpo, { assinaturaErrada = false } = {}) {
  const raw = JSON.stringify(corpo);
  const sig = assinaturaErrada ? "0".repeat(40) : createHmac("sha1", TOKEN).update(raw).digest("hex");
  const res = await fetch(`${URL_WEBHOOK}?signature=${sig}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: raw,
  });
  let json = null;
  try { json = await res.json(); } catch { /* sem corpo */ }
  return { status: res.status, json };
}

async function membro() {
  if (!db) return null;
  const { data, error } = await db.from("members").select("*, tem_acesso").eq("email", EMAIL).maybeSingle();
  if (error) throw new Error(`erro lendo membro: ${error.message}`);
  return data;
}

// ---------- roteiro ----------
let falhas = 0;
let ultimoCorpo = null;
let toleranciaOriginal = null;

const passos = [
  {
    nome: "1. Compra aprovada (e-mail com MAIÚSCULAS) → cria conta e manda convite",
    corpo: () => payload("order_approved"),
    esperado: { http: 200, status: "ativa", acesso: true },
  },
  {
    nome: "2. Kiwify REENVIA a mesma compra → não duplica nada",
    corpo: () => ultimoCorpo,
    esperado: { http: 200, duplicado: true, status: "ativa", acesso: true },
  },
  {
    nome: "3. Assinatura atrasada → mantém acesso na tolerância",
    corpo: () => payload("subscription_late", { status: "late" }),
    esperado: { http: 200, status: "atrasada", acesso: true },
    depois: (m) => { toleranciaOriginal = m?.tolerancia_ate ?? null; },
  },
  {
    nome: "4. Novo aviso de atraso → NÃO estende a tolerância",
    corpo: () => ({ ...payload("subscription_late", { status: "late" }), updated_at: "outro" }),
    esperado: { http: 200, status: "atrasada", acesso: true },
    checar: (m) => !temBanco || m?.tolerancia_ate === toleranciaOriginal || "tolerância mudou",
  },
  {
    nome: "5. Assinatura renovada → volta a ficar ativa",
    corpo: () => payload("subscription_renewed", { orderId: `ord_${RUN}_2` }),
    esperado: { http: 200, status: "ativa", acesso: true },
  },
  {
    nome: "6. Cancelada COM data de fim do período → acesso até a data",
    corpo: () => payload("subscription_canceled", { status: "canceled", proximoPagamento: dias(10) }),
    esperado: { http: 200, status: "cancelada", acesso: true },
  },
  {
    nome: "7. Cancelada SEM data → bloqueia na hora",
    corpo: () => {
      const p = payload("subscription_canceled", { status: "canceled" });
      delete p.Subscription.next_payment;
      return p;
    },
    esperado: { http: 200, status: "cancelada", acesso: false },
  },
  {
    nome: "8. Assina de novo (pedido novo) → reativa",
    corpo: () => payload("order_approved", { orderId: `ord_${RUN}_3` }),
    esperado: { http: 200, status: "ativa", acesso: true },
  },
  {
    nome: "9. Reembolso → bloqueia na hora",
    corpo: () => payload("order_refunded", { orderId: `ord_${RUN}_3`, orderStatus: "refunded" }),
    esperado: { http: 200, status: "reembolsada", acesso: false },
  },
  {
    nome: "10. Reenvio atrasado da compra JÁ reembolsada → continua bloqueado",
    corpo: () => ({ ...payload("order_approved", { orderId: `ord_${RUN}_3` }), updated_at: "reenvio-atrasado" }),
    esperado: { http: 200, status: "reembolsada", acesso: false },
  },
  {
    nome: "11. Compra nova depois do reembolso → reativa",
    corpo: () => payload("order_approved", { orderId: `ord_${RUN}_4` }),
    esperado: { http: 200, status: "ativa", acesso: true },
  },
  {
    nome: "12. Chargeback → bloqueia na hora",
    corpo: () => payload("chargeback", { orderId: `ord_${RUN}_4`, orderStatus: "chargedback" }),
    esperado: { http: 200, status: "chargeback", acesso: false },
  },
  {
    nome: "13. Pix gerado (evento sem efeito) → só registra",
    corpo: () => payload("pix_created", { orderId: `ord_${RUN}_5`, orderStatus: "waiting_payment" }),
    esperado: { http: 200, status: "chargeback", acesso: false },
  },
  {
    nome: "14. Assinatura INVÁLIDA → rejeitado com 401",
    corpo: () => payload("order_approved", { orderId: `ord_${RUN}_falso` }),
    opcoes: { assinaturaErrada: true },
    esperado: { http: 401, status: "chargeback", acesso: false },
  },
];

console.log(`\n${cor.neg}Simulando a Kiwify${cor.fim} → ${URL_WEBHOOK}`);
console.log(`${cor.dim}e-mail de teste: ${EMAIL}${temBanco ? "" : " (sem chave do Supabase: só confiro as respostas HTTP)"}${cor.fim}\n`);

try {
  await fetch(URL_WEBHOOK.replace(/\/api\/webhooks\/kiwify.*$/, "/"), { method: "HEAD" });
} catch {
  console.error(`${cor.erro}Não consegui falar com ${URL_WEBHOOK}.${cor.fim} O site está rodando? (npm run dev)`);
  process.exit(1);
}

for (const passo of passos) {
  const corpo = passo.corpo();
  ultimoCorpo = corpo;
  const r = await enviar(corpo, passo.opcoes);
  const m = await membro();
  passo.depois?.(m);

  const problemas = [];
  const e = passo.esperado;
  if (r.status !== e.http) problemas.push(`HTTP ${r.status} (esperado ${e.http})`);
  if (e.duplicado && !r.json?.duplicado) problemas.push("não foi tratado como duplicado");
  if (temBanco) {
    if (m?.status !== e.status) problemas.push(`status "${m?.status}" (esperado "${e.status}")`);
    if (m?.tem_acesso !== e.acesso) problemas.push(`acesso ${m?.tem_acesso} (esperado ${e.acesso})`);
  }
  const extra = passo.checar?.(m);
  if (typeof extra === "string") problemas.push(extra);

  const ok = problemas.length === 0;
  if (!ok) falhas++;
  console.log(`${ok ? cor.ok + "✓" : cor.erro + "✗"} ${passo.nome}${cor.fim}`);
  const detalhe = r.json?.resultado ?? r.json?.erro ?? (r.json?.duplicado ? "duplicado — ignorado com segurança" : "");
  if (detalhe) console.log(`   ${cor.dim}${detalhe}${cor.fim}`);
  if (temBanco && m) console.log(`   ${cor.dim}membro: ${m.status} · acesso: ${m.tem_acesso ? "sim" : "não"}${cor.fim}`);
  for (const p of problemas) console.log(`   ${cor.erro}→ ${p}${cor.fim}`);
}

if (temBanco) {
  const { count } = await db.from("webhook_events").select("id", { count: "exact", head: true }).eq("email", EMAIL);
  console.log(`\n${cor.dim}${count} evento(s) guardados na caixa-preta (webhook_events) pra esse e-mail.${cor.fim}`);
}

if (LIMPAR && db) {
  const m = await membro();
  await db.from("webhook_events").delete().eq("email", EMAIL);
  if (m) {
    await db.from("members").delete().eq("id", m.id);
    await db.auth.admin.deleteUser(m.id);
  }
  console.log(`${cor.dim}Dados de teste apagados.${cor.fim}`);
}

console.log(
  falhas
    ? `\n${cor.erro}${cor.neg}${falhas} passo(s) falharam.${cor.fim} Veja os detalhes em /admin/webhooks.\n`
    : `\n${cor.ok}${cor.neg}Fluxo completo funcionando! ✓${cor.fim}\n`,
);
process.exit(falhas ? 1 : 0);
