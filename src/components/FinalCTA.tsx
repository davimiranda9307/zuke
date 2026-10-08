import { siteConfig } from "@/config/site";
import { CTAButton } from "@/components/CTAButton";

/* Bloco 12 — CTA final (fundo escuro). Última chamada pra quem rolou até aqui. */
export function FinalCTA() {
  return (
    <section className="bg-fg">
      <div className="container-page py-16 sm:py-20 lg:py-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-bg/10 bg-bg/5 px-6 py-16 text-center text-bg sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-accent/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
          />

          <span className="relative inline-flex items-center gap-2 rounded-full border border-bg/15 bg-bg/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-bg/70">
            Não perca mais tempo
          </span>

          <h2 className="heading-xl relative mx-auto mt-6 max-w-2xl text-3xl sm:text-4xl lg:text-5xl">
            Sua próxima compra pode ser sem garimpo nenhum.
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg text-bg/70">
            Acesso imediato · cerca de R${siteConfig.price.perDay} por dia ·
            suporte quando precisar · garantia de {siteConfig.guaranteeDays} dias.
          </p>
          <div className="relative mt-8 flex justify-center">
            <CTAButton pulse className="w-full sm:w-auto">
              Assinar o {siteConfig.name}
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
