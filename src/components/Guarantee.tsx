import { siteConfig } from "@/config/site";

/* Bloco 10 — Garantia (bloco próprio, como recomenda o blueprint). */
export function Guarantee() {
  return (
    <section className="section bg-surface">
      <div className="container-page">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 rounded-3xl border border-border bg-bg p-8 text-center shadow-soft sm:flex-row sm:p-10 sm:text-left">
          {/* selo */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-accent/10">
            <svg className="h-14 w-14 text-accent" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M12 2 4 5v6c0 5 3.4 9.3 8 10.5C16.6 20.3 20 16 20 11V5l-8-3Zm3.7 7-4.6 4.6a1 1 0 0 1-1.4 0L7 11a1 1 0 1 1 1.4-1.4l2 2 3.9-3.9A1 1 0 0 1 15.7 9Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="absolute -bottom-2 rounded-full bg-fg px-3 py-1 text-xs font-bold text-bg">
              {siteConfig.guaranteeDays} dias
            </span>
          </div>

          <div>
            <h2 className="heading-xl text-2xl sm:text-3xl">
              Risco zero por {siteConfig.guaranteeDays} dias.
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              Assine, use a plataforma e veja se faz sentido pra você. Se dentro
              de {siteConfig.guaranteeDays} dias não curtir, devolvemos 100% do
              valor — sem perguntas e sem letra miúda.
            </p>
            <p className="mt-3 text-sm text-muted">
              É só pedir o reembolso pelo e-mail{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-semibold text-fg underline underline-offset-2"
              >
                {siteConfig.contact.email}
              </a>{" "}
              dentro do prazo. [CONFIRMAR: confirmar o canal e o passo a passo do reembolso.]
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
