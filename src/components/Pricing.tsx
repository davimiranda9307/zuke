import { siteConfig } from "@/config/site";
import { CTAButton } from "@/components/CTAButton";

const included = [
  "Todas as faixas de preço, de R$100 a R$1.000",
  "Curadoria das melhores lojas de cada faixa",
  "Link direto pra comprar pelo melhor preço",
  "Acesso pelo celular ou computador, sem baixar app",
  "Novas lojas entrando na plataforma",
  "Cancele quando quiser, sem multa",
];

/* Bloco 09 — Oferta (#oferta). O botão abre o modal com os planos.
   Adaptado pro modelo de assinatura: sem pilha de valor nem preço riscado. */
export function Pricing() {
  return (
    <section id="oferta" className="section">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Oferta · assine agora</span>
          <h2 className="heading-xl mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Comece hoje. Cerca de{" "}
            <span className="text-accent">R${siteConfig.price.perDay} por dia.</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            Menos que o valor de um lanche por mês pra parar de perder tempo — e
            dinheiro — procurando loja.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <div className="relative overflow-hidden rounded-3xl border border-fg/10 bg-fg p-8 text-bg shadow-lift sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/30 blur-3xl"
            />

            <div className="flex items-end gap-1">
              <span className="text-2xl font-semibold">{siteConfig.price.currency}</span>
              <span className="font-display text-6xl font-extrabold leading-none">
                {siteConfig.price.amount}
              </span>
              <span className="mb-1 text-lg text-bg/70">/{siteConfig.price.period}</span>
            </div>
            <p className="mt-2 text-sm text-bg/60">
              Assinatura recorrente · pagamento seguro pela Kiwify
            </p>

            <ul className="mt-8 space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px]">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-bg/90">{item}</span>
                </li>
              ))}
            </ul>

            <CTAButton className="mt-8 w-full">
              Quero assinar por {siteConfig.price.full}
            </CTAButton>

            <div className="mt-5 flex items-center justify-center gap-2 text-center text-sm text-bg/70">
              <svg className="h-4 w-4 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M10 1.5 3 4.3v4.8c0 4 2.8 7.7 7 8.9 4.2-1.2 7-4.9 7-8.9V4.3L10 1.5Zm3.2 6-3.9 3.9a1 1 0 0 1-1.4 0L5.8 9.3a1 1 0 1 1 1.4-1.4l1.4 1.4 3.2-3.2a1 1 0 0 1 1.4 1.4Z"
                  clipRule="evenodd"
                />
              </svg>
              Pagamento seguro · garantia de {siteConfig.guaranteeDays} dias
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
