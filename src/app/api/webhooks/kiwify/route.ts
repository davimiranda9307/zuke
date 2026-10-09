import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { canonicalJson, parseKiwify } from "@/lib/kiwify/parse";
import { validarAssinatura } from "@/lib/kiwify/signature";
import { processarRegistro } from "@/lib/kiwify/process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/kiwify
 *
 * 1. Valida a assinatura (inválida => 401, mas fica registrada como "rejeitado").
 * 2. Salva TODO evento válido em webhook_events (caixa-preta) antes de tudo.
 * 3. Processa de forma idempotente: reenvio do mesmo evento não duplica nada.
 * 4. Responde 200. Se o processamento falhar, responde 500 pra Kiwify
 *    reenviar — o reenvio cai no mesmo registro e é reprocessado.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const params = request.nextUrl.searchParams;

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    console.error("[webhook kiwify] Supabase não configurado:", e);
    return NextResponse.json({ ok: false, erro: "servidor não configurado" }, { status: 500 });
  }

  let payload: unknown = null;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    /* tratado abaixo */
  }
  const hash = createHash("sha256")
    .update(payload !== null ? canonicalJson(payload) : rawBody)
    .digest("hex");

  const assinatura = validarAssinatura({
    token: env.kiwifyWebhookToken(),
    rawBody,
    signature: params.get("signature") ?? request.headers.get("x-kiwify-signature"),
    tokenRecebido: params.get("token") ?? request.headers.get("x-kiwify-token"),
  });

  const ev = payload !== null ? parseKiwify(payload) : null;
  const base = {
    provider: "kiwify",
    event_type: ev?.tipoOriginal ?? null,
    evento: ev?.evento ?? null,
    email: ev?.email ?? null,
    order_id: ev?.orderId ?? null,
    subscription_id: ev?.subscriptionId ?? null,
    payload,
    raw_body: rawBody.slice(0, 100_000),
  };

  // --- Requisição inválida: registra (pra diagnóstico) e rejeita ---
  if (!assinatura.ok) {
    await admin.from("webhook_events").upsert(
      { ...base, dedupe_key: `rejeitado:${hash}`, status: "rejeitado", erro: assinatura.motivo },
      { onConflict: "dedupe_key", ignoreDuplicates: true },
    );
    return NextResponse.json({ ok: false, erro: "assinatura inválida" }, { status: 401 });
  }

  if (payload === null) {
    await admin.from("webhook_events").upsert(
      { ...base, dedupe_key: `invalido:${hash}`, status: "erro", erro: "corpo não é JSON", assinatura_ok: true },
      { onConflict: "dedupe_key", ignoreDuplicates: true },
    );
    return NextResponse.json({ ok: false, erro: "corpo não é JSON" }, { status: 400 });
  }

  // --- Caixa-preta: grava antes de processar ---
  const dedupeKey = `kiwify:${hash}`;
  const { error: errInsert } = await admin.from("webhook_events").upsert(
    { ...base, dedupe_key: dedupeKey, assinatura_ok: true, assinatura_metodo: assinatura.metodo },
    { onConflict: "dedupe_key", ignoreDuplicates: true },
  );
  if (errInsert) {
    console.error("[webhook kiwify] falha ao gravar evento:", errInsert.message);
    return NextResponse.json({ ok: false, erro: "falha ao gravar" }, { status: 500 });
  }

  const { data: registro, error: errBusca } = await admin
    .from("webhook_events")
    .select("id")
    .eq("dedupe_key", dedupeKey)
    .single<{ id: string }>();
  if (errBusca || !registro) {
    return NextResponse.json({ ok: false, erro: "falha ao localizar evento" }, { status: 500 });
  }

  // --- Processa (idempotente) ---
  try {
    const r = await processarRegistro(admin, registro.id, payload);
    if (r.duplicado) return NextResponse.json({ ok: true, duplicado: true });
    if (r.status === "erro") {
      return NextResponse.json({ ok: false, erro: r.erro }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status: r.status, resultado: r.resultado });
  } catch (e) {
    console.error("[webhook kiwify] erro inesperado:", e);
    return NextResponse.json({ ok: false, erro: "erro inesperado" }, { status: 500 });
  }
}
