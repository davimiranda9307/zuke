import Link from "next/link";
import { exigirAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { FEEDBACK_LABEL, formatarData } from "@/lib/format";
import type { Feedback } from "@/lib/types";
import { alternarFeedbackAction } from "../actions";
import { Flash } from "@/components/admin/Flash";

export const metadata = { title: "Feedbacks" };

export default async function AdminFeedbacks({
  searchParams,
}: {
  searchParams: Promise<{ todos?: string; ok?: string; erro?: string }>;
}) {
  await exigirAdmin();
  const sp = await searchParams;
  const todos = sp.todos === "1";

  let query = createAdminClient().from("feedbacks").select("*").order("created_at", { ascending: false }).limit(200);
  if (!todos) query = query.eq("resolvido", false);
  const { data } = await query;
  const itens = (data ?? []) as Feedback[];
  const volta = todos ? "/admin/feedbacks?todos=1" : "/admin/feedbacks";

  return (
    <div className="space-y-5">
      <h1 className="heading-xl text-3xl">Feedbacks</h1>
      <Flash ok={sp.ok} erro={sp.erro} />
      <div className="flex gap-2">
        <Link href="/admin/feedbacks" className={`chip ${!todos ? "chip-ativo" : ""}`}>Abertos</Link>
        <Link href="/admin/feedbacks?todos=1" className={`chip ${todos ? "chip-ativo" : ""}`}>Todos</Link>
      </div>

      <div className="space-y-3">
        {itens.map((f) => (
          <div key={f.id} className={`card ${f.resolvido ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">{FEEDBACK_LABEL[f.tipo]}</span>
              <span className="break-all text-muted">{f.email ?? "—"}</span>
              <span className="ml-auto text-xs text-muted">{formatarData(f.created_at, true)}</span>
            </div>
            <p className="mt-3 whitespace-pre-wrap">{f.mensagem}</p>
            {f.pagina ? <p className="mt-2 text-xs text-muted">Enviado de: {f.pagina}</p> : null}
            <form action={alternarFeedbackAction} className="mt-3">
              <input type="hidden" name="id" value={f.id} />
              <input type="hidden" name="resolvido" value={String(f.resolvido)} />
              <input type="hidden" name="volta" value={volta} />
              <button type="submit" className="btn-secondary !px-4 !py-2 text-sm">
                {f.resolvido ? "Reabrir" : "Marcar como resolvido"}
              </button>
            </form>
          </div>
        ))}
        {itens.length === 0 ? <p className="card text-center text-muted">Nada por aqui. 🎉</p> : null}
      </div>
    </div>
  );
}
