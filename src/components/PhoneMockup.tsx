import { siteConfig } from "@/config/site";

/* Lojas FICTÍCIAS, só para ilustrar a ideia do produto. */
const demoStores = [
  { name: "Ateliê Lua", tag: "Vestidos", gradient: "from-rose-200 to-orange-200" },
  { name: "Costa & Co.", tag: "Streetwear", gradient: "from-indigo-200 to-sky-200" },
  { name: "Nova Trama", tag: "Básicos", gradient: "from-amber-200 to-lime-200" },
];

/**
 * Mockup da plataforma: faixas de preço no topo + cards de loja
 * (foto, nome, faixa, botão "ver loja"). Tudo com dados de exemplo.
 */
export function PhoneMockup() {
  const tiers = siteConfig.priceTiers.slice(0, 5); // mostra as primeiras faixas

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      {/* brilho decorativo atrás do celular */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[3rem] bg-accent/10 blur-2xl"
      />

      {/* corpo do celular */}
      <div className="rounded-[2.75rem] border border-fg/10 bg-fg p-2.5 shadow-lift">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-bg">
          {/* notch */}
          <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-fg/90" />

          {/* conteúdo do app */}
          <div className="flex h-[560px] flex-col">
            {/* topo do app */}
            <div className="flex items-center justify-between px-5 pb-3 pt-7">
              <span className="font-display text-base font-extrabold">
                {siteConfig.name}
              </span>
              <span className="h-7 w-7 rounded-full bg-surface-2" />
            </div>

            <p className="px-5 text-[11px] font-medium text-muted">
              Quanto você quer gastar hoje?
            </p>

            {/* faixas de preço (chips) */}
            <div className="mt-2 flex gap-2 overflow-hidden px-5">
              {tiers.map((tier, i) => (
                <span
                  key={tier}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    i === 1
                      ? "bg-accent text-accent-fg"
                      : "bg-surface text-muted"
                  }`}
                >
                  R${tier}
                </span>
              ))}
            </div>

            {/* cards de loja */}
            <div className="mt-4 flex flex-1 flex-col gap-3 overflow-hidden px-5 pb-5">
              {demoStores.map((store) => (
                <div
                  key={store.name}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-surface/60 p-2.5"
                >
                  <div
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${store.gradient}`}
                  >
                    <span className="absolute bottom-0.5 left-0.5 rounded bg-fg/70 px-1 text-[7px] font-bold uppercase tracking-wide text-bg">
                      exemplo
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{store.name}</p>
                    <p className="text-[11px] text-muted">
                      {store.tag} · até R$200
                    </p>
                  </div>
                  <span className="rounded-full bg-fg px-3 py-1.5 text-[11px] font-semibold text-bg">
                    Ver loja
                  </span>
                </div>
              ))}

              <p className="mt-auto text-center text-[10px] text-muted">
                Lojas fictícias, apenas ilustração do produto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
