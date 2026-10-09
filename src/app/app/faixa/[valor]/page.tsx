import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { exigirMembro } from "@/lib/auth";
import { faixaLabel } from "@/lib/format";
import type { Loja } from "@/lib/types";
import { LojaCard } from "@/components/app/LojaCard";

type Props = {
  params: Promise<{ valor: string }>;
  searchParams: Promise<{ tag?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { valor } = await params;
  return { title: `Lojas até R$${valor}` };
}

export default async function FaixaPage({ params, searchParams }: Props) {
  const { valor } = await params;
  const faixa = Number(valor);
  if (!siteConfig.priceTiers.includes(faixa)) notFound();

  const tag = (await searchParams).tag?.trim().toLowerCase() || undefined;
  const { supabase } = await exigirMembro();

  const { data } = await supabase
    .from("lojas")
    .select("*")
    .eq("ativa", true)
    .eq("faixa", faixa)
    .order("created_at", { ascending: false });
  const todas = (data ?? []) as Loja[];

  const tags = Array.from(new Set(todas.flatMap((l) => l.tags))).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const lojas = tag ? todas.filter((l) => l.tags.includes(tag)) : todas;

  return (
    <div>
      {/* troca rápida de faixa */}
      <nav aria-label="Faixas de preço" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {siteConfig.priceTiers.map((t) => (
          <Link key={t} href={`/app/faixa/${t}`} className={`chip shrink-0 ${t === faixa ? "chip-ativo" : ""}`}>
            {faixaLabel(t)}
          </Link>
        ))}
      </nav>

      <h1 className="heading-xl mt-6 text-3xl">Lojas até {faixaLabel(faixa)}</h1>
      <p className="mt-1 text-muted">
        {lojas.length === 1 ? "1 loja" : `${lojas.length} lojas`}
        {tag ? ` com “${tag}”` : ""}
      </p>

      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/app/faixa/${faixa}`} className={`chip ${!tag ? "chip-ativo" : ""}`}>Todas</Link>
          {tags.map((t) => (
            <Link
              key={t}
              href={`/app/faixa/${faixa}?tag=${encodeURIComponent(t)}`}
              className={`chip ${t === tag ? "chip-ativo" : ""}`}
            >
              {t}
            </Link>
          ))}
        </div>
      ) : null}

      {lojas.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="font-semibold">Ainda não tem loja aqui{tag ? " com esse filtro" : ""}.</p>
          <p className="mt-1 text-sm text-muted">Conhece uma boa? Use o botão “Sugerir loja”.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {lojas.map((l) => <LojaCard key={l.id} loja={l} tagAtiva={tag} />)}
        </div>
      )}
    </div>
  );
}
