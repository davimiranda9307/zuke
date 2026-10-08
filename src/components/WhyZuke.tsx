import { siteConfig } from "@/config/site";

/* Bloco 03 — Por que o Zuke (fundo claro).
   6 diferenciais, cada um atacando uma dor de quem faz do jeito antigo. */
const reasons = [
  {
    title: "Tudo organizado por faixa de preço",
    text: "Nada de rolar mil mensagens. Você escolhe quanto quer gastar, de R$100 a R$1.000, e vê as lojas na hora.",
  },
  {
    title: "Os links sempre no lugar",
    text: "No grupo de WhatsApp o link some no meio da conversa. Aqui ele fica guardado, prontinho pra clicar.",
  },
  {
    title: "Curadoria pra não cair em furada",
    text: "A gente vai até as lojas, vê as peças de perto e só indica o que passa no teste. Chega de comprar no escuro.",
  },
  {
    title: "Economiza suas horas",
    text: "Pare de abrir mil abas no Google comparando preço e frete. Está tudo reunido e comparado num lugar só.",
  },
  {
    title: "Seu acesso não se perde",
    text: "Entrou num grupo e ele sumiu? Aqui você entra com e-mail e senha quando quiser, do jeito que quiser.",
  },
  {
    title: "No celular, sem baixar nada",
    text: "O Zuke é um site. Abre no navegador do celular ou do computador — sem instalar aplicativo nenhum.",
  },
];

export function WhyZuke() {
  return (
    <section id="por-que" className="section">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">Por que o {siteConfig.name}</span>
          <h2 className="heading-xl mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Pra quem cansou de garimpar e pra quem sempre{" "}
            <span className="text-accent">cai em loja furada</span>.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              className="rounded-2xl border border-border bg-surface/60 p-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="font-display text-2xl font-extrabold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold">{reason.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{reason.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
