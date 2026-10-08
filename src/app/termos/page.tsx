import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: `Termos de Uso do ${siteConfig.name}.`,
  robots: { index: false, follow: true },
};

export default function TermosPage() {
  return (
    <LegalLayout title="Termos de Uso" updatedAt="[CONFIRMAR data]">
      <p>
        Estes Termos de Uso regulam o acesso e a utilização da plataforma{" "}
        {siteConfig.name}, oferecida por {siteConfig.company.legalName}, inscrita
        no CNPJ {siteConfig.company.cnpj} (“nós”). Ao assinar e usar o{" "}
        {siteConfig.name}, você (“usuário”) concorda com estes termos.
      </p>

      <h2>1. O que é o {siteConfig.name}</h2>
      <p>
        O {siteConfig.name} é uma plataforma de assinatura que reúne e organiza,
        por faixa de preço, uma curadoria de lojas de roupa e indica onde comprar.
        Somos um serviço de curadoria e indicação: não vendemos as roupas, não
        somos loja e não participamos da relação de compra entre você e as lojas
        indicadas.
      </p>

      <h2>2. Cadastro e acesso</h2>
      <p>
        O acesso é individual, feito com e-mail e senha, pelo navegador. Você é
        responsável por manter seus dados de acesso em sigilo e por toda
        atividade realizada na sua conta. É proibido compartilhar o acesso.
        [CONFIRMAR: idade mínima para assinar, ex.: 18 anos.]
      </p>

      <h2>3. Assinatura, pagamento e renovação</h2>
      <p>
        A assinatura custa {siteConfig.price.full}, cobrada de forma recorrente
        por meio da plataforma de pagamento Kiwify. A renovação é automática a
        cada ciclo, até que você cancele. [CONFIRMAR: ciclo de cobrança e regras
        de reajuste de preço.]
      </p>

      <h2>4. Cancelamento e garantia</h2>
      <p>
        Você pode cancelar a qualquer momento, sem multa. Oferecemos garantia de{" "}
        {siteConfig.guaranteeDays} dias: se pedir o cancelamento dentro desse
        prazo, devolvemos o valor pago. [CONFIRMAR: canal e procedimento exato de
        cancelamento e reembolso; prazo para encerramento do acesso após o
        cancelamento.]
      </p>

      <h2>5. Uso correto da plataforma</h2>
      <p>Ao usar o {siteConfig.name}, você concorda em não:</p>
      <ul>
        <li>copiar, revender ou redistribuir o conteúdo da curadoria;</li>
        <li>compartilhar seu acesso com terceiros;</li>
        <li>usar meios automatizados para extrair dados da plataforma;</li>
        <li>utilizar o serviço para qualquer finalidade ilegal.</li>
      </ul>

      <h2>6. Sobre as lojas indicadas</h2>
      <p>
        As lojas indicadas são de terceiros. Fazemos uma curadoria para
        recomendar boas opções, mas não garantimos preços, estoque, qualidade,
        prazos de entrega ou condições de cada loja, que podem mudar sem aviso.
        Qualquer compra é feita diretamente com a loja, sob responsabilidade dela.
      </p>

      <h2>7. Propriedade intelectual</h2>
      <p>
        A marca {siteConfig.name}, o conteúdo, a organização da curadoria e o
        layout da plataforma pertencem a {siteConfig.company.legalName} e são
        protegidos por lei.
      </p>

      <h2>8. Limitação de responsabilidade</h2>
      <p>
        O {siteConfig.name} é oferecido “no estado em que se encontra”. Não nos
        responsabilizamos por prejuízos decorrentes de compras feitas nas lojas
        indicadas nem por indisponibilidades temporárias da plataforma.
      </p>

      <h2>9. Alterações nos termos</h2>
      <p>
        Podemos atualizar estes termos. Mudanças relevantes serão comunicadas
        pelos nossos canais. O uso continuado após a atualização significa
        concordância.
      </p>

      <h2>10. Contato e foro</h2>
      <p>
        Dúvidas sobre estes termos:{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
        Estes termos são regidos pelas leis do Brasil. [CONFIRMAR: cidade/comarca
        de foro.]
      </p>
    </LegalLayout>
  );
}
