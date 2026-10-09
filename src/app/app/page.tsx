import Link from "next/link";
import { siteConfig } from "@/config/site";
import { exigirMembro } from "@/lib/auth";
import { faixaLabel } from "@/lib/format";
import type { Loja } from "@/lib/types";
import { LojaCard } from "@/components/app/LojaCard";

export const metadata = { title: "Início" };

function escaparLike(s: string) {
  return s.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export default async function AppHome({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { supabase, member } = await exigirMembro();
  const q = ((await searchParams).q ?? "").trim().slice(0, 80);
  const primeiroNome = member?.nome?.split(" ")[0];

  // --- Busca por nome ---
  if (q) {
    const { data } = await supabase
      .from("lojas")
      .select("*")
      .eq("ativa", true)
      .ilike("nome", `%${escaparLike(q)}%`)
      .order("nome")
      .limit(40);
    const lojas = (data ?? []) as Loja[];

    return (
      <div>
        <Busca q={q} />
        <h1 className="mt-6 font-display text-xl font-bold">
          {lojas.length ? `${lojas.length} resultado(s) pra “${q}”` : `Nada encontrado pra “${q}”`}
        </h1>
        <p className="mt-1 text-sm">
          <Link href="/app" className="text-muted underline underline-offset-2 hover:text-fg">Limpar busca</Link>
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {lojas.map((l) => <LojaCard key={l.id} loja={l} />)}
        </div>
      </div>
    );
  }

  // --- Início: faixas + novidades ---
  const seteDias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [{ data: faixasData }, { data: novidadesData }] = await Promise.all([
    supabase.from("lojas").select("faixa").eq("ativa", true),
    supabase
      .from("lojas")
      .select("*")
      .eq("ativa", true)
      .gte("created_at", seteDias)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const contagem = new Map<number, number>();
  for (const { faixa } of (faixasData ?? []) as { faixa: number }[]) {
    contagem.set(faixa, (contagem.get(faixa) ?? 0) + 1);
  }
  const novidades = (novidadesData ?? []) as Loja[];

  return (
    <div>
      <h1 className="heading-xl text-3xl">
        {primeiroNome ? `Oi, ${primeiroNome}!` : "Oi!"} Quanto você quer gastar?
      </h1>
      <p className="mt-2 text-muted">Escolha a faixa e veja as melhores lojas.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {siteConfig.priceTiers.map((tier) => {
          const n = contagem.get(tier) ?? 0;
          return (
            <Link
              key={tier}
              href={`/app/faixa/${tier}`}
              className="group rounded-2xl border border-border bg-bg p-4 shadow-soft transition-transform active:scale-[0.98] sm:hover:-translate-y-0.5"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-muted">até</span>
              <p className="font-display text-2xl font-extrabold">{faixaLabel(tier)}</p>
              <p className="mt-1 text-sm text-muted">{n === 1 ? "1 loja" : `${n} lojas`}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <Busca q="" />
      </div>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold">Novidades</h2>
          <span className="text-sm text-muted">últimos 7 dias</span>
        </div>
        {novidades.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-border p-5 text-sm text-muted">
            Nenhuma loja nova esta semana. Volte em breve!
          </p>
        ) : (
          <div className="-mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
            {novidades.map((l) => (
              <Link
                key={l.id}
                href={`/app/faixa/${l.faixa}#loja-${l.id}`}
                className="w-40 shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-bg shadow-soft"
              >
                <div className="relative aspect-square bg-surface-2">
                  {l.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.foto_url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold">{l.nome}</p>
                  <p className="text-xs text-muted">até {faixaLabel(l.faixa)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Busca({ q }: { q: string }) {
  return (
    <form action="/app" method="get" role="search" className="flex gap-2">
      <label htmlFor="q" className="sr-only">Buscar loja pelo nome</label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={q}
        placeholder="Buscar loja pelo nome…"
        className="input"
        enterKeyHint="search"
      />
      <button type="submit" className="btn-secondary shrink-0 !px-5">Buscar</button>
    </form>
  );
}
