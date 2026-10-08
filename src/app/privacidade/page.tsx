import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Política de Privacidade do ${siteConfig.name}.`,
  robots: { index: false, follow: true },
};

export default function PrivacidadePage() {
  return (
    <LegalLayout title="Política de Privacidade" updatedAt="[CONFIRMAR data]">
      <p>
        Esta Política de Privacidade explica como {siteConfig.company.legalName}{" "}
        (CNPJ {siteConfig.company.cnpj}) trata seus dados pessoais ao usar o{" "}
        {siteConfig.name}, em conformidade com a Lei Geral de Proteção de Dados
        (LGPD, Lei nº 13.709/2018).
      </p>

      <h2>1. Dados que coletamos</h2>
      <ul>
        <li>
          <strong>Dados de cadastro:</strong> nome e e-mail usados para criar e
          acessar sua conta.
        </li>
        <li>
          <strong>Dados de pagamento:</strong> processados pela Kiwify. Nós não
          armazenamos os dados do seu cartão. [CONFIRMAR: quais dados a Kiwify
          repassa pra gente, ex.: status da assinatura.]
        </li>
        <li>
          <strong>Dados de navegação:</strong> páginas visitadas, cliques e
          informações do dispositivo, coletados por cookies e ferramentas de
          medição (como o Pixel da Meta), para entender o uso e melhorar a
          experiência.
        </li>
      </ul>

      <h2>2. Como usamos seus dados</h2>
      <ul>
        <li>liberar e manter seu acesso à plataforma;</li>
        <li>processar a assinatura e dar suporte;</li>
        <li>medir e melhorar o site e a curadoria;</li>
        <li>exibir anúncios e medir campanhas (marketing).</li>
      </ul>

      <h2>3. Cookies e Pixel</h2>
      <p>
        Usamos cookies essenciais (para o site funcionar) e cookies de medição e
        marketing. Se o Pixel da Meta estiver ativo, ele registra eventos como a
        visita à página e o início do checkout, ajudando a medir e otimizar
        campanhas. Você pode gerenciar cookies no seu navegador e no aviso
        exibido no site.
      </p>

      <h2>4. Compartilhamento</h2>
      <p>
        Compartilhamos dados apenas com parceiros necessários para operar o
        serviço, como a Kiwify (pagamentos), provedores de hospedagem e
        ferramentas de medição (como a Meta). Não vendemos seus dados.
      </p>

      <h2>5. Seus direitos (LGPD)</h2>
      <p>
        Você pode solicitar acesso, correção, portabilidade ou exclusão dos seus
        dados, além de revogar consentimentos. Para exercer seus direitos, fale
        com a gente em{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>

      <h2>6. Retenção e segurança</h2>
      <p>
        Guardamos seus dados pelo tempo necessário para prestar o serviço e
        cumprir obrigações legais, adotando medidas de segurança razoáveis para
        protegê-los. [CONFIRMAR: prazo de retenção após o cancelamento.]
      </p>

      <h2>7. Encarregado (DPO) e contato</h2>
      <p>
        Dúvidas sobre privacidade ou sobre esta política:{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
        [CONFIRMAR: nome e contato do encarregado de dados, se houver.]
      </p>

      <h2>8. Alterações</h2>
      <p>
        Podemos atualizar esta política. A data no topo indica a última revisão.
      </p>
    </LegalLayout>
  );
}
