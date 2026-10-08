import { AuthorityStats } from "@/components/AuthorityStats";

/**
 * Bloco 07/08 do blueprint — Autoridade da curadoria (fundo escuro).
 * O "quem te ensina" de um curso vira, aqui, a credibilidade de quem garimpa.
 *
 * COMO COLAR SEUS VÍDEOS:
 * Troque `embedUrl: ""` pela URL de incorporação (embed) do vídeo.
 *   - YouTube Shorts:  "https://www.youtube.com/embed/VIDEO_ID"
 *   - TikTok:          use o link do player/embed do vídeo
 *   - Instagram Reels: use a URL de embed do Reel
 * Enquanto estiver "", aparece um espaço reservado (placeholder).
 */
const videos: { title: string; embedUrl: string }[] = [
  { title: "Episódio 1", embedUrl: "" }, // COLAR EMBED AQUI
  { title: "Episódio 2", embedUrl: "" }, // COLAR EMBED AQUI
  { title: "Episódio 3", embedUrl: "" }, // COLAR EMBED AQUI
];

export function DescobrindoBras() {
  return (
    <section id="curadoria" className="section bg-fg text-bg">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-bg/15 bg-bg/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-bg/70">
            Bastidores da curadoria
          </span>
          <h2 className="heading-xl mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Descobrindo fornecedores
          </h2>
          <p className="mt-4 text-lg text-bg/70">
            A gente vai até as lojas, vê as peças de perto e só indica o que
            passa no nosso teste de qualidade. Assista como cada escolha chega
            até você.
          </p>
        </div>

        <AuthorityStats />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-bg/10 bg-bg/5"
            >
              <div className="relative aspect-[9/16] w-full">
                {video.embedUrl ? (
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <Placeholder index={i + 1} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Placeholder({ index }: { index: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bg/10">
        <svg className="h-6 w-6 text-bg/60" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <p className="text-sm font-semibold text-bg/80">Vídeo {index}</p>
      <p className="text-xs text-bg/50">Espaço reservado para o Reel / TikTok</p>
    </div>
  );
}
