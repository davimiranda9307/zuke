import type { StatusMembro } from "@/lib/kiwify/transition";

export type { StatusMembro };

export type Member = {
  id: string;
  email: string;
  nome: string | null;
  status: StatusMembro;
  acesso_manual: "liberado" | "bloqueado" | null;
  periodo_pago_ate: string | null;
  tolerancia_ate: string | null;
  kiwify_subscription_id: string | null;
  kiwify_order_id: string | null;
  ultimo_evento: string | null;
  ultimo_evento_em: string | null;
  created_at: string;
  updated_at: string;
};

export type Loja = {
  id: string;
  nome: string;
  faixa: number;
  descricao: string | null;
  foto_url: string | null;
  site_url: string | null;
  instagram: string | null;
  whatsapp: string | null;
  endereco: string | null;
  tags: string[];
  ativa: boolean;
  created_at: string;
  updated_at: string;
};

export type WebhookEvent = {
  id: string;
  provider: string;
  event_type: string | null;
  evento: string | null;
  email: string | null;
  order_id: string | null;
  subscription_id: string | null;
  assinatura_ok: boolean;
  assinatura_metodo: string | null;
  status: "recebido" | "processando" | "processado" | "ignorado" | "erro" | "rejeitado";
  resultado: string | null;
  erro: string | null;
  tentativas: number;
  payload: unknown;
  created_at: string;
};

export type Feedback = {
  id: string;
  member_id: string | null;
  email: string | null;
  tipo: "sugerir_loja" | "link_quebrado" | "outro";
  mensagem: string;
  pagina: string | null;
  resolvido: boolean;
  created_at: string;
};
