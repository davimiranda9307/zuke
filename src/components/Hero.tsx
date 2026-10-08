import { siteConfig } from "@/config/site";
import { CTAButton } from "@/components/CTAButton";

/**
 * Bloco 02 do blueprint — Hero + VSL (fundo escuro).
 * Objetivo: prender nos primeiros segundos e levar à oferta.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-fg text-bg"
    >
      {/* brilhos sutis de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgb(255_255_255/0.06)_0%,transparent_60%)]"
      />

      <div className="container-page relative flex flex-col items-center py-16 text-center sm:py-20 lg:py-24">
        {/* etiqueta com ponto pulsante */}
        <span className="inline-flex items-center gap-2 rounded-full border border-bg/15 bg-bg/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-bg/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Plataforma no ar · acesso imediato
        </span>

        <h1 className="heading-xl mt-6 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">
          Pare de perder horas procurando loja no Google.
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bg/70">
          Mesmo que você nunca tenha achado uma loja boa na internet, já tenha
          caído em loja furada ou não saiba nem por onde começar.
        </p>

        {/* VSL / vídeo de apresentação */}
        <div className="mt-10 w-full max-w-3xl">
          <HeroVideo />
        </div>

        <div className="mt-8 flex w-full flex-col items-center gap-3">
          <CTAButton pulse className="w-full sm:w-auto">
            Quero assinar por {siteConfig.price.full}
          </CTAButton>
          <p className="text-sm text-bg/60">
            Cancele quando quiser · garantia de {siteConfig.guaranteeDays} dias
          </p>
        </div>

        {/* linha de reforço */}
        <p className="mt-10 max-w-2xl text-balance text-base text-bg/70">
          Escolha quanto quer gastar, de{" "}
          <span className="font-semibold text-bg">R$100 a R$1.000</span>, e veja
          na hora as melhores lojas — tudo reunido e organizado num lugar só.
        </p>
      </div>
    </section>
  );
}

function HeroVideo() {
  const url = siteConfig.heroVideoUrl?.trim();

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-bg/15 bg-bg/5 shadow-lift">
      {url ? (
        <iframe
          src={url}
          title={`Vídeo de apresentação — ${siteConfig.name}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bg/10">
            <svg className="h-7 w-7 text-bg/70" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <p className="text-sm font-semibold text-bg/80">
            Espaço do vídeo de apresentação (VSL)
          </p>
          <p className="max-w-xs text-xs text-bg/50">
            Cole aqui o embed do seu vídeo (ou um Reel) em{" "}
            <code className="rounded bg-bg/10 px-1">heroVideoUrl</code> no config.
          </p>
        </div>
      )}
    </div>
  );
}
