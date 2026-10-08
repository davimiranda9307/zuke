/**
 * Depoimentos.
 *
 * ESTÁ ESCONDIDA DE PROPÓSITO. Nada de depoimento inventado.
 * Quando você tiver depoimentos REAIS, preencha o array abaixo —
 * a seção aparece sozinha. Enquanto estiver vazio, não renderiza nada.
 */
type Testimonial = {
  name: string;
  handle?: string;
  text: string;
};

const testimonials: Testimonial[] = [
  // {
  //   name: "Nome real da cliente",
  //   handle: "@instagram",
  //   text: "Depoimento real, com permissão de uso.",
  // },
];

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="section bg-fg text-bg">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-bg/15 bg-bg/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-bg/70">
            Quem usa · e o preço vem logo a seguir
          </span>
          <h2 className="heading-xl mt-5 text-3xl sm:text-4xl lg:text-5xl">
            O que estão dizendo
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-bg/10 bg-bg/5 p-6"
            >
              <blockquote className="leading-relaxed text-bg/90">“{t.text}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-bg">
                {t.name}
                {t.handle ? (
                  <span className="font-normal text-bg/60"> · {t.handle}</span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
