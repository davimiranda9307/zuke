import Link from "next/link";
import type { Loja } from "@/lib/types";
import { faixaLabel, linkInstagram, linkMapa, linkSite, linkWhatsApp } from "@/lib/format";

/** Card de loja: foto, nome, faixa, por que indicamos e botões de ação. */
export function LojaCard({ loja, tagAtiva }: { loja: Loja; tagAtiva?: string }) {
  const site = linkSite(loja.site_url);
  const insta = linkInstagram(loja.instagram);
  const whats = linkWhatsApp(loja.whatsapp);
  const mapa = linkMapa(loja.endereco);

  return (
    <article id={`loja-${loja.id}`} className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-bg shadow-soft">
      <div className="relative aspect-[16/10] w-full bg-surface-2">
        {loja.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={loja.foto_url}
            alt={`Foto da loja ${loja.nome}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-display text-4xl font-extrabold text-fg/15">
            {(loja.nome.match(/[A-Za-zÀ-ÿ0-9]/)?.[0] ?? "?").toUpperCase()}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-fg/85 px-2.5 py-1 text-xs font-bold text-bg">
          até {faixaLabel(loja.faixa)}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-display text-lg font-bold leading-tight">{loja.nome}</h3>
        {loja.descricao ? (
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{loja.descricao}</p>
        ) : null}

        {loja.tags.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {loja.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/app/faixa/${loja.faixa}?tag=${encodeURIComponent(tag)}`}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    tag === tagAtiva ? "bg-fg text-bg" : "bg-surface text-muted hover:text-fg"
                  }`}
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {loja.endereco ? (
          <p className="mt-3 text-sm text-muted">
            📍{" "}
            {mapa ? (
              <a href={mapa} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-fg">
                {loja.endereco}
              </a>
            ) : (
              loja.endereco
            )}
          </p>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-2">
          {site ? (
            <a href={site} target="_blank" rel="noopener noreferrer" className="btn-primary !py-3 w-full">
              Ver loja
            </a>
          ) : null}
          {insta || whats ? (
            <div className="grid grid-cols-2 gap-2">
              {insta ? (
                <a href={insta} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-3 !py-2.5 text-sm">
                  Instagram
                </a>
              ) : null}
              {whats ? (
                <a href={whats} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-3 !py-2.5 text-sm">
                  WhatsApp
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
