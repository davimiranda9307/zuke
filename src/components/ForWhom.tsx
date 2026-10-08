"use client";

import { useState } from "react";
import { CTAButton } from "@/components/CTAButton";

/* Bloco 05 — Para quem é. Ajuda cada visitante a se enxergar no Zuke.
   São perfis de compra (não são números inventados). */
const profiles = [
  {
    tab: "Renovar gastando pouco",
    result: "Guarda-roupa novo sem estourar o orçamento",
    text: "Você quer peças novas, mas não quer gastar muito. Filtra pela faixa de R$100 ou R$200 e já vê as lojas que entregam mais por menos — sem rodar o Google atrás de preço.",
    faixa: "Faixas R$100–R$200",
  },
  {
    tab: "Qualidade sem pagar caro",
    result: "Boas peças, pelo preço justo",
    text: "Você se importa com tecido e caimento, mas não quer pagar o dobro pela etiqueta. Nas faixas do meio, a curadoria separa as lojas com melhor custo-benefício.",
    faixa: "Faixas R$300–R$500",
  },
  {
    tab: "Comprar pra revender",
    result: "Fornecedor bom, achado na hora",
    text: "Você compra pra revender e cada hora conta. Em vez de garimpar fornecedor no Brás por conta própria, você vê onde comprar bem por faixa e foca no que importa: vender.",
    faixa: "Todas as faixas",
  },
  {
    tab: "Peças premium",
    result: "O melhor, sem garimpar",
    text: "Você quer peças mais elaboradas e marcas de padrão mais alto. Vai direto nas faixas de cima e encontra a seleção do topo, sem perder tempo filtrando o que não é pra você.",
    faixa: "Faixas R$700–R$1.000",
  },
];

export function ForWhom() {
  const [active, setActive] = useState(0);
  const current = profiles[active];

  return (
    <section id="para-quem" className="section">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">Para quem é</span>
          <h2 className="heading-xl mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Tem um plano pro seu bolso e pro seu momento.
          </h2>
        </div>

        {/* abas */}
        <div className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {profiles.map((profile, i) => (
            <button
              key={profile.tab}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                i === active
                  ? "border-fg bg-fg text-bg"
                  : "border-border bg-bg text-muted hover:text-fg"
              }`}
            >
              {profile.tab}
            </button>
          ))}
        </div>

        {/* conteúdo da aba */}
        <div className="mt-6 grid gap-6 rounded-3xl border border-border bg-surface/60 p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              {String(active + 1).padStart(2, "0")} / {String(profiles.length).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              {current.result}
            </h3>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              {current.text}
            </p>
            <div className="mt-7">
              <CTAButton>Esse é o meu caso</CTAButton>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-bg p-6 text-center shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Onde você vai olhar
            </p>
            <p className="mt-3 font-display text-2xl font-extrabold text-accent">
              {current.faixa}
            </p>
            <p className="mt-3 text-sm text-muted">
              É só escolher a faixa e ver as lojas indicadas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
