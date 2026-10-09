import { siteConfig } from "@/config/site";
import { descreverPlanos } from "@/lib/planos";

/* Itens com [CONFIRMAR] têm informação que você ainda precisa definir.
   Depois de decidir, apague o trecho "[CONFIRMAR: ...]" e deixe a resposta. */
const faqs = [
  {
    q: "Como eu recebo o acesso depois de pagar?",
    a: "Assim que o pagamento é aprovado, você recebe um e-mail do Zuke com o link pra criar sua senha. É só clicar, definir a senha e pronto: você já entra na plataforma pelo navegador do celular ou do computador, sem baixar nada.\n\nNão encontrou o e-mail? Confira a caixa de spam ou acesse a página Primeiro acesso, digite o e-mail usado na compra e a gente reenvia o link na hora.",
  },
  {
    q: "Funciona no celular?",
    a: "Funciona. O Zuke foi pensado pro celular primeiro: abre no navegador do seu telefone, do tablet ou do computador. É só entrar e usar, na hora.",
  },
  {
    q: "Preciso baixar algum aplicativo?",
    a: "Não. O Zuke é um site que você acessa com seu e-mail e senha.",
  },
  {
    q: "A cobrança é recorrente?",
    a: `Sim. Você escolhe o plano — ${descreverPlanos(false)} — e a Kiwify renova a cobrança automaticamente ao fim de cada período, enquanto você quiser continuar. [CONFIRMAR: confirmar que todos os planos renovam automaticamente na Kiwify.]`,
  },
  {
    q: "Como eu cancelo?",
    a: "Você cancela quando quiser, sem multa e sem fidelidade. [CONFIRMAR: explicar o caminho exato — o cancelamento é feito pelo portal do cliente da Kiwify? por um e-mail pro suporte? em quanto tempo o acesso é encerrado?]",
  },
  {
    q: "As lojas são confiáveis?",
    a: "A gente só coloca na plataforma lojas que passam pela nossa curadoria — é pra isso que existe o quadro 'Descobrindo o Brás', em que vamos até os fornecedores conferir de perto. A ideia é exatamente te livrar da loja furada. [CONFIRMAR: quer detalhar os critérios da curadoria, ex.: qualidade, preço, atendimento?]",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section bg-surface">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">Dúvidas</span>
          <h2 className="heading-xl mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Perguntas frequentes
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-3xl border border-border bg-bg">
          {faqs.map((faq) => (
            <details key={faq.q} className="group px-5 sm:px-7">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-transform duration-200 group-open:rotate-45">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M10 4v12M4 10h12" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <div className="pb-6">
                {faq.a.split("\n\n").map((paragraph, idx) => (
                  <p
                    key={idx}
                    className={`leading-relaxed text-muted${idx > 0 ? " mt-3" : ""}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl text-center text-muted">
          Ainda com dúvida?{" "}
          {siteConfig.contact.whatsapp ? (
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-fg underline underline-offset-2"
            >
              Fala com a gente no WhatsApp
            </a>
          ) : (
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="font-semibold text-fg underline underline-offset-2"
            >
              Fala com a gente por e-mail
            </a>
          )}
          .
        </div>
      </div>
    </section>
  );
}
