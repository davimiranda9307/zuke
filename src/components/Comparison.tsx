import { siteConfig } from "@/config/site";

const rows = [
  {
    label: "Organização",
    whatsapp: "Mensagem solta, tudo misturado",
    zuke: "Lojas separadas por faixa de preço",
  },
  {
    label: "Achar uma loja",
    whatsapp: "Rolar o chat sem fim procurando",
    zuke: "Escolhe a faixa e vê na hora",
  },
  {
    label: "Os links",
    whatsapp: "Somem no meio das conversas",
    zuke: "Sempre no lugar, prontos pra clicar",
  },
  {
    label: "Curadoria",
    whatsapp: "Qualquer um manda qualquer coisa",
    zuke: "Seleção feita pra você não errar",
  },
  {
    label: "Acesso",
    whatsapp: "Perdeu o grupo, perdeu tudo",
    zuke: "Entra com e-mail e senha quando quiser",
  },
];

export function Comparison() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">A diferença</span>
          <h2 className="heading-xl mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Grupo de WhatsApp x {siteConfig.name}
          </h2>
          <p className="mt-4 text-lg text-muted">
            O mercado vende acesso a grupo de WhatsApp. A gente entrega uma
            plataforma organizada de verdade.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-border">
          {/* cabeçalho */}
          <div className="grid grid-cols-[1fr_1fr] bg-surface sm:grid-cols-[1.2fr_1fr_1fr]">
            <div className="hidden p-5 sm:block" />
            <div className="p-4 text-center sm:p-5">
              <span className="font-display text-base font-bold text-muted sm:text-lg">
                Grupo de WhatsApp
              </span>
            </div>
            <div className="bg-fg p-4 text-center sm:p-5">
              <span className="font-display text-base font-bold text-bg sm:text-lg">
                {siteConfig.name}
              </span>
            </div>
          </div>

          {/* linhas */}
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-[1fr_1fr] items-stretch sm:grid-cols-[1.2fr_1fr_1fr] ${
                i % 2 === 0 ? "bg-bg" : "bg-surface/50"
              }`}
            >
              <div className="col-span-2 border-t border-border px-4 pt-4 text-xs font-semibold uppercase tracking-widest text-muted sm:col-span-1 sm:border-t-0 sm:flex sm:items-center sm:px-5 sm:py-5 sm:text-sm sm:normal-case sm:tracking-normal sm:text-fg">
                {row.label}
              </div>
              <div className="flex items-start gap-2 px-4 py-4 text-sm text-muted sm:px-5">
                <IconX />
                <span>{row.whatsapp}</span>
              </div>
              <div className="flex items-start gap-2 border-l border-border bg-accent/[0.04] px-4 py-4 text-sm font-medium text-fg sm:px-5">
                <IconCheck />
                <span>{row.zuke}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IconCheck() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
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
  );
}

function IconX() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-muted/60"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M6.2 6.2a1 1 0 0 1 1.4 0L10 8.6l2.4-2.4a1 1 0 1 1 1.4 1.4L11.4 10l2.4 2.4a1 1 0 0 1-1.4 1.4L10 11.4l-2.4 2.4a1 1 0 0 1-1.4-1.4L8.6 10 6.2 7.6a1 1 0 0 1 0-1.4Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
