import Link from "next/link";
import { exigirAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatarData } from "@/lib/format";
import type { WebhookEvent } from "@/lib/types";
import { reprocessarWebhookAction } from "../actions";
import { Flash } from "@/components/admin/Flash";

export const metadata = { title: "Webhooks" };

const COR: Record<WebhookEvent["status"], string> = {
  processado: "bg-emerald-100 text-emerald-800",
  ignorado: "bg-surface-2 text-muted",
  recebido: "bg-sky-100 text-sky-800",
  processando: "bg-sky-100 text-sky-800",
  erro: "bg-red-100 text-red-800",
  rejeitado: "bg-amber-100 text-amber-900",
};

export default async function AdminWebhooks({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; email?: string; ok?: string; erro?: string }>;
}) {
  await exigirAdmin();
  const sp = await searchParams;

  let query = createAdminClient()
    .from("webhook_events")
    .select("id, provider, event_type, evento, email, order_id, subscription_id, assinatura_ok, assinatura_metodo, status, resultado, erro, tentativas, payload, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (sp.status === "problema") query = query.in("status", ["erro", "rejeitado"]);
  if (sp.email) query = query.eq("email", sp.email.toLowerCase());
  const { data } = await query;
  const eventos = (data ?? []) as WebhookEvent[];

  const volta = `/admin/webhooks?${new URLSearchParams({ ...(sp.status ? { status: sp.status } : {}), ...(sp.email ? { email: sp.email } : {}) })}`;

  return (
    <div className="space-y-5">
      <h1 className="heading-xl text-3xl">Webhooks</h1>
      <p className="text-sm text-muted">
        Todo aviso da Kiwify fica guardado aqui, mesmo os inválidos. Clique num evento pra ver o payload bruto.
      </p>
      <Flash ok={sp.ok} erro={sp.erro} />

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/webhooks" className={`chip ${!sp.status && !sp.email ? "chip-ativo" : ""}`}>Últimos 100</Link>
        <Link href="/admin/webhooks?status=problema" className={`chip ${sp.status === "problema" ? "chip-ativo" : ""}`}>
          Só com problema
        </Link>
        {sp.email ? <span className="chip chip-ativo">{sp.email}</span> : null}
      </div>

      <div className="space-y-2">
        {eventos.map((ev) => {
          const problema = ev.status === "erro" || ev.status === "rejeitado";
          return (
            <details key={ev.id} className={`card !p-0 ${problema ? "border-red-300" : ""}`}>
              <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 p-4">
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${COR[ev.status]}`}>{ev.status}</span>
                <span className="font-semibold">{ev.evento ?? ev.event_type ?? "?"}</span>
                <span className="min-w-0 break-all text-sm text-muted">{ev.email ?? "sem e-mail"}</span>
                <span className="ml-auto text-xs text-muted">{formatarData(ev.created_at, true)}</span>
              </summary>
              <div className="space-y-3 border-t border-border p-4 text-sm">
                {ev.erro ? <p className="alert-erro">{ev.erro}</p> : null}
                {ev.resultado ? <p><span className="text-muted">Resultado: </span>{ev.resultado}</p> : null}
                <p className="text-muted">
                  Tipo original: <code>{ev.event_type ?? "—"}</code> · pedido: <code>{ev.order_id ?? "—"}</code> · assinatura:{" "}
                  <code>{ev.subscription_id ?? "—"}</code> · validação: {ev.assinatura_ok ? ev.assinatura_metodo : "falhou"} ·
                  tentativas: {ev.tentativas}
                </p>
                <pre className="max-h-96 overflow-auto rounded-xl bg-fg p-4 text-xs leading-relaxed text-bg">
                  {JSON.stringify(ev.payload, null, 2)}
                </pre>
                {ev.payload !== null && ev.status !== "processando" ? (
                  <form action={reprocessarWebhookAction} className="flex flex-wrap items-center gap-3">
                    <input type="hidden" name="id" value={ev.id} />
                    <input type="hidden" name="volta" value={volta} />
                    <button type="submit" className="btn-secondary !px-4 !py-2 text-sm">Reprocessar</button>
                    {ev.status === "rejeitado" ? (
                      <span className="text-xs text-amber-800">
                        A assinatura falhou. Só reprocesse se tiver certeza que veio da Kiwify (ex.: token configurado errado na 1ª venda).
                      </span>
                    ) : null}
                  </form>
                ) : null}
              </div>
            </details>
          );
        })}
        {eventos.length === 0 ? <p className="card text-center text-muted">Nenhum evento recebido ainda.</p> : null}
      </div>
    </div>
  );
}
