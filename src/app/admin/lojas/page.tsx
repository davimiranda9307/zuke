import Link from "next/link";
import { siteConfig } from "@/config/site";
import { exigirAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { faixaLabel, formatarData } from "@/lib/format";
import type { Loja } from "@/lib/types";
import { alternarLojaAction } from "../actions";
import { Flash } from "@/components/admin/Flash";

export const metadata = { title: "Lojas" };

export default async function AdminLojas({
  searchParams,
}: {
  searchParams: Promise<{ faixa?: string; q?: string; ok?: string; erro?: string }>;
}) {
  await exigirAdmin();
  const sp = await searchParams;
  const faixa = Number(sp.faixa) || null;
  const q = sp.q?.trim() ?? "";

  let query = createAdminClient().from("lojas").select("*").order("created_at", { ascending: false }).limit(300);
  if (faixa) query = query.eq("faixa", faixa);
  if (q) query = query.ilike("nome", `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`);
  const { data } = await query;
  const lojas = (data ?? []) as Loja[];

  const volta = `/admin/lojas?${new URLSearchParams({ ...(faixa ? { faixa: String(faixa) } : {}), ...(q ? { q } : {}) })}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="heading-xl text-3xl">Lojas</h1>
        <Link href="/admin/lojas/nova" className="btn-primary">+ Cadastrar loja</Link>
      </div>
      <Flash ok={sp.ok} erro={sp.erro} />

      <form method="get" className="flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Buscar pelo nome…" className="input max-w-xs" />
        <select name="faixa" defaultValue={faixa ?? ""} className="input w-auto">
          <option value="">Todas as faixas</option>
          {siteConfig.priceTiers.map((t) => (
            <option key={t} value={t}>{faixaLabel(t)}</option>
          ))}
        </select>
        <button type="submit" className="btn-secondary">Filtrar</button>
      </form>

      <p className="text-sm text-muted">{lojas.length} loja(s)</p>

      <div className="space-y-2">
        {lojas.map((l) => (
          <div key={l.id} className={`card flex items-center gap-4 !p-3 ${l.ativa ? "" : "opacity-60"}`}>
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-2">
              {l.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.foto_url} alt="" className="h-full w-full object-cover" loading="lazy" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{l.nome}</p>
              <p className="text-xs text-muted">
                {faixaLabel(l.faixa)} · {l.ativa ? "ativa" : "inativa"} · desde {formatarData(l.created_at)}
                {l.tags.length ? ` · ${l.tags.join(", ")}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link href={`/admin/lojas/${l.id}`} className="btn-secondary !px-4 !py-2 text-sm">Editar</Link>
              <form action={alternarLojaAction}>
                <input type="hidden" name="id" value={l.id} />
                <input type="hidden" name="ativa" value={String(l.ativa)} />
                <input type="hidden" name="volta" value={volta} />
                <button type="submit" className="btn-secondary !px-4 !py-2 text-sm">
                  {l.ativa ? "Desativar" : "Ativar"}
                </button>
              </form>
            </div>
          </div>
        ))}
        {lojas.length === 0 ? <p className="card text-center text-muted">Nenhuma loja ainda.</p> : null}
      </div>
    </div>
  );
}
