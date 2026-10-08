import { siteConfig } from "@/config/site";
import { CTAButton } from "@/components/CTAButton";

const steps = [
  {
    n: "01",
    title: "Você assina",
    text: `Cria sua conta com e-mail e senha e libera o acesso por ${siteConfig.price.full}. Tudo pelo navegador, sem baixar app.`,
  },
  {
    n: "02",
    title: "Escolhe sua faixa de preço",
    text: "De R$100 a R$1.000. Você diz quanto quer gastar e o Zuke mostra as melhores lojas daquela faixa.",
  },
  {
    n: "03",
    title: "Compra direto na loja indicada",
    text: "Clica, vai pra loja certa e compra pelo melhor preço. Sem garimpo, sem aba demais, sem cair em loja furada.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">Como funciona</span>
          <h2 className="heading-xl mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Do cadastro à compra em 3 passos.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="relative">
              <span className="font-display text-5xl font-extrabold text-accent/20">
                {step.n}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <CTAButton variant="secondary">Começar agora</CTAButton>
        </div>
      </div>
    </section>
  );
}
