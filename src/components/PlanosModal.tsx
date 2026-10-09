"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig, type Plano } from "@/config/site";
import { buildCheckoutUrl } from "@/lib/checkout";
import { trackInitiateCheckout } from "@/lib/analytics";
import {
  EVENTO_ABRIR_PLANOS,
  economia,
  formatarReais,
  precoPorMes,
  valorNumerico,
} from "@/lib/planos";

/**
 * Modal com os planos. Abre quando a pessoa clica em QUALQUER botão de compra
 * (ver CTAButton e lib/planos.ts) ou quando a URL tem ?planos=1.
 * O plano com `destaque: true` no config fica no centro, com o botão pulsando.
 */
export function PlanosModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.__zukePlanos = true;

    const abrir = () => {
      setSearch(window.location.search); // UTMs da visita vão pro checkout
      const dialog = ref.current;
      if (dialog && !dialog.open) dialog.showModal();
    };
    window.addEventListener(EVENTO_ABRIR_PLANOS, abrir);

    // ?planos=1 abre direto (usado por quem vem da página "sem acesso").
    const params = new URLSearchParams(window.location.search);
    if (params.has("planos")) {
      params.delete("planos");
      const q = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${q ? `?${q}` : ""}${window.location.hash}`);
      abrir();
    }

    return () => {
      window.removeEventListener(EVENTO_ABRIR_PLANOS, abrir);
      window.__zukePlanos = false;
    };
  }, []);

  const fechar = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-planos"
      onClick={(e) => {
        if (e.target === ref.current) fechar(); // clique fora do card
      }}
      className="m-auto max-h-[94dvh] w-[calc(100%-1.25rem)] max-w-5xl overflow-y-auto rounded-3xl border border-border bg-surface p-0 text-fg shadow-lift backdrop:bg-fg/60 backdrop:backdrop-blur-sm open:animate-modal-in"
    >
      <div className="relative px-4 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-10">
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-fg/5 hover:text-fg"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>

        <div className="text-center">
          <h2 id="titulo-planos" className="heading-xl text-2xl sm:text-4xl">
            Escolha seu plano
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted sm:text-base">
            Acesso completo em todos. Quanto mais tempo, menos você paga por mês.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:items-center sm:gap-4">
          {siteConfig.plans.map((plano) => (
            <PlanoCard key={plano.id} plano={plano} href={buildCheckoutUrl(plano.checkoutUrl, search)} />
          ))}
        </div>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-muted sm:mt-8 sm:text-sm">
          <span>🔒 Pagamento seguro pela Kiwify</span>
          <span aria-hidden>·</span>
          <span>Garantia de {siteConfig.guaranteeDays} dias</span>
          <span aria-hidden>·</span>
          <span>Acesso pelo celular ou computador</span>
        </p>
      </div>
    </dialog>
  );
}

function PlanoCard({ plano, href }: { plano: Plano; href: string }) {
  const eco = economia(plano);
  const porMes = formatarReais(precoPorMes(plano));
  const nome = plano.nome.toLowerCase();
  const aoEscolher = () =>
    trackInitiateCheckout({
      id: plano.id,
      nome: `${siteConfig.name} ${plano.nome}`,
      valor: valorNumerico(plano.preco),
    });

  if (plano.destaque) {
    return (
      <div className="relative z-10 mt-3 rounded-3xl border-2 border-accent bg-bg p-5 pt-8 shadow-lift sm:mt-0 sm:scale-[1.06] sm:p-7 sm:pt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-accent/[0.09] to-transparent"
        />
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-accent-fg shadow-soft">
          ⭐ Mais vantajoso
        </span>

        <div className="relative text-center">
          <h3 className="font-display text-xl font-extrabold">{plano.nome}</h3>
          <p className="mt-2 leading-none">
            <span className="align-top text-lg font-bold">R$</span>
            <span className="font-display text-5xl font-extrabold tracking-tight">{plano.preco}</span>
            <span className="text-muted">/{plano.periodo}</span>
          </p>
          <p className="mt-3 text-base">
            sai por <strong>R${porMes}/mês</strong>
          </p>
          {eco > 0 ? (
            <p className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
              economize {eco}%
            </p>
          ) : null}
          <a
            href={href}
            onClick={aoEscolher}
            className="btn-primary mt-5 w-full animate-destaque whitespace-nowrap !py-4 text-lg sm:text-base"
          >
            Quero o plano {nome}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-bg p-4 sm:p-6">
      <div className="flex items-baseline justify-between gap-3 sm:block sm:text-center">
        <h3 className="font-display text-lg font-bold">{plano.nome}</h3>
        <p className="whitespace-nowrap sm:mt-2">
          <span className="font-display text-2xl font-extrabold sm:text-3xl">R${plano.preco}</span>
          <span className="text-sm text-muted">/{plano.periodo}</span>
        </p>
      </div>
      <p className="mt-1 text-sm text-muted sm:mt-2 sm:text-center">
        {plano.meses === 1 ? (
          "cobrança mês a mês"
        ) : (
          <>
            sai por R${porMes}/mês
            {eco > 0 ? (
              <>
                {" · "}
                <span className="font-semibold text-emerald-700">economize {eco}%</span>
              </>
            ) : null}
          </>
        )}
      </p>
      <a href={href} onClick={aoEscolher} className="btn-secondary mt-3 w-full !py-2.5 text-sm sm:mt-5">
        Escolher {nome}
      </a>
    </div>
  );
}
