import { siteConfig } from "@/config/site";
import { PhoneMockup } from "@/components/PhoneMockup";
import { CTAButton } from "@/components/CTAButton";

/* Legenda curta por faixa — ajuste os textos como quiser. */
const tierHints: Record<number, string> = {
  100: "Primeiras peças e achados em conta",
  200: "Básicos de qualidade pra usar sempre",
  300: "Marcas queridinhas e boas tramas",
  400: "Peças com acabamento melhor",
  500: "Curadoria caprichada",
  600: "Marcas intermediárias",
  700: "Looks mais elaborados",
  800: "Peças premium",
  900: "Marcas de alto padrão",
  1000: "O topo da curadoria",
};

const features = [
  "Faixas de preço no topo: você escolhe quanto quer gastar.",
  "Cards de loja com foto, nome e a faixa de cada uma.",
  "Botão “ver loja” que leva direto pra comprar pelo melhor preço.",
];

/* Bloco 04 — O que tem dentro (as faixas). Prova de volume e organização. */
export function PriceRanges() {
  return (
    <section id="faixas" className="section bg-surface">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">O que tem dentro</span>
          <h2 className="heading-xl mt-5 text-3xl sm:text-4xl lg:text-5xl">
            A curadoria mais organizada por faixa de preço.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Escolha quanto quer gastar. A gente mostra as melhores lojas daquela
            faixa e onde comprar pelo melhor preço.
          </p>
        </div>

        {/* visual do produto + como ele funciona */}
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <ul className="space-y-5">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-[17px] leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <CTAButton variant="secondary">Ver tudo por dentro</CTAButton>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <PhoneMockup />
          </div>
        </div>

        {/* todas as faixas */}
        <div className="mt-16">
          <h3 className="font-display text-xl font-bold">
            Do R$100 ao R$1.000 — tem faixa pro seu bolso:
          </h3>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {siteConfig.priceTiers.map((tier, i) => (
              <div
                key={tier}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-bg p-5 shadow-soft transition-transform duration-200 hover:-translate-y-1"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Faixa
                  </span>
                  <p className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">
                    R${tier.toLocaleString("pt-BR")}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-snug text-muted">
                  {tierHints[tier] ?? "Curadoria de lojas da faixa"}
                </p>
                <div
                  aria-hidden
                  className="mt-4 h-1 w-8 rounded-full bg-accent transition-all duration-200 group-hover:w-12"
                  style={{ opacity: 0.4 + (i / siteConfig.priceTiers.length) * 0.6 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
