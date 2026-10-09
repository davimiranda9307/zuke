/**
 * =============================================================
 *  CONFIGURAÇÃO CENTRAL DO ZUKE
 * =============================================================
 *  Este é o ÚNICO arquivo que você precisa editar para trocar
 *  as informações do negócio: nome, preço, link de checkout,
 *  Pixel, redes sociais, contato e dados da empresa.
 *
 *  Procure por "PREENCHER" para ver o que ainda falta.
 * =============================================================
 */

export type Plano = {
  id: string;
  nome: string;
  /** Preço cobrado no período, sem o "R$" (ex.: "109,99"). */
  preco: string;
  /** Quantos meses o período cobre (usado pra calcular o "por mês"). */
  meses: number;
  /** Como o período aparece ao lado do preço: "/mês", "/semestre"... */
  periodo: string;
  /** Link do checkout desse plano na Kiwify. */
  checkoutUrl: string;
  /** Plano em destaque no modal (fica no centro, com o botão pulsando). */
  destaque?: boolean;
};

/**
 * PLANOS — aparecem no modal que abre ao clicar em qualquer botão de compra.
 * A ORDEM aqui é a ordem na tela: o do meio fica centralizado.
 * Todos os links recebem as UTMs da visita automaticamente.
 */
const planos: Plano[] = [
  {
    id: "mensal",
    nome: "Mensal",
    preco: "19,99",
    meses: 1,
    periodo: "mês",
    checkoutUrl: "https://pay.kiwify.com.br/oRiZphZ",
  },
  {
    id: "anual",
    nome: "Anual",
    preco: "109,99",
    meses: 12,
    periodo: "ano",
    checkoutUrl: "https://pay.kiwify.com.br/0F4UzUh",
    destaque: true,
  },
  {
    id: "semestral",
    nome: "Semestral",
    preco: "59,99",
    meses: 6,
    periodo: "semestre",
    checkoutUrl: "https://pay.kiwify.com.br/UBOmeCY",
  },
];

const planoMensal = planos.find((p) => p.meses === 1) ?? planos[0];

export const siteConfig = {
  /** Nome do app, usado em todo lugar (header, títulos, rodapé). */
  name: "Zuke",

  /** Frase curta que descreve o produto (usada no SEO e no rodapé). */
  tagline:
    "As melhores lojas de roupa, separadas por quanto você quer gastar, num lugar só.",

  /** Descrição usada no SEO / compartilhamento (até ~155 caracteres). */
  description:
    "Pare de perder horas procurando loja no Google. O Zuke reúne as melhores lojas de roupa organizadas por faixa de preço, de R$100 a R$1.000. A partir de R$19,99/mês.",

  /**
   * URL final do site em produção (sem barra no final).
   * PREENCHER com o domínio real depois de publicar na Vercel.
   * Ex.: "https://zuke.com.br"
   */
  url: "https://zuke-nine.vercel.app",

  /** Planos de assinatura (definidos no topo deste arquivo). */
  plans: planos,

  /** Preço do plano MENSAL, usado nos textos da landing. Vem dos planos acima. */
  price: {
    /** Valor exibido, sem o "R$". */
    amount: planoMensal.preco,
    /** Símbolo da moeda. */
    currency: "R$",
    /** Período da cobrança. */
    period: "mês",
    /** Texto completo pronto pra usar: "R$19,99/mês". */
    get full() {
      return `${this.currency}${this.amount}/${this.period}`;
    },
    /** Valor numérico (ex.: 19.9), derivado do amount. */
    get numeric() {
      return Number(this.amount.replace(/\./g, "").replace(",", "."));
    },
    /** Custo por dia formatado (ex.: "0,66"), assumindo 30 dias no mês. */
    get perDay() {
      return (this.numeric / 30).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },

  /**
   * Vídeo de apresentação do hero (VSL). Deixe "" para mostrar um
   * espaço reservado. Preencha com a URL de embed (YouTube, Panda, etc.).
   */
  heroVideoUrl: "",

  /**
   * Link onde o assinante gerencia/cancela a assinatura na Kiwify.
   * [CONFIRMAR] o endereço exato com a Kiwify. Enquanto estiver "",
   * a página "Minha conta" orienta a pessoa a falar com o suporte.
   */
  kiwifyManageUrl: "",

  /**
   * ID do Pixel da Meta (Facebook/Instagram).
   * Deixe "" (vazio) para NÃO carregar o Pixel.
   * PREENCHER com o ID (só números) quando tiver.
   * Ex.: "123456789012345"
   */
  metaPixelId: "",

  /** Redes sociais. Deixe "" para esconder o ícone. */
  social: {
    instagram: "https://instagram.com/zuke", // PREENCHER com o @ real
    tiktok: "https://tiktok.com/@zuke", // PREENCHER com o @ real
  },

  /** Contato. */
  contact: {
    /** E-mail de suporte (usado no rodapé e no FAQ). */
    email: "contato@zuke.com.br", // PREENCHER
    /**
     * WhatsApp de suporte (opcional). Só dígitos com DDI+DDD.
     * Deixe "" para esconder. Ex.: "5511999999999"
     */
    whatsapp: "",
  },

  /** Dados da empresa (rodapé e páginas legais). */
  company: {
    /** Razão social / nome usado nos termos. */
    legalName: "Zuke", // PREENCHER com a razão social
    /** CNPJ formatado. PREENCHER. */
    cnpj: "00.000.000/0001-00",
  },

  /**
   * Faixas de preço exibidas no site (em reais).
   * Pode adicionar/remover valores livremente.
   */
  priceTiers: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],

  /** Garantia, em dias. */
  guaranteeDays: 7,
};

export type SiteConfig = typeof siteConfig;
