/**
 * Regras de negócio: o que cada evento da Kiwify faz com o membro.
 *
 * Módulo puro (sem banco, sem rede): recebe o estado atual e o evento,
 * devolve o que deve mudar. Aplicar a mesma decisão duas vezes dá o mesmo
 * resultado — é isso que torna o webhook idempotente.
 */

import type { EventoKiwify } from "./parse";

export type StatusMembro = "ativa" | "atrasada" | "cancelada" | "reembolsada" | "chargeback";

export type EstadoMembro = {
  status: StatusMembro;
  tolerancia_ate: string | null;
  periodo_pago_ate: string | null;
  kiwify_order_id: string | null;
};

export type Patch = {
  status: StatusMembro;
  tolerancia_ate?: string | null;
  periodo_pago_ate?: string | null;
};

export type Decisao =
  /** Evento que não muda acesso (boleto gerado, pix, etc.). */
  | { acao: "ignorar"; motivo: string }
  /** Nada a fazer (ex.: membro inexistente pra um cancelamento). */
  | { acao: "nada"; motivo: string }
  /** Cria o membro se não existir (e manda o convite) ou reativa. */
  | { acao: "ativar"; patch: Patch; motivo: string }
  /** Atualiza um membro existente. */
  | { acao: "atualizar"; patch: Patch; motivo: string };

const DIA_MS = 24 * 60 * 60 * 1000;

export function decidir(
  ev: EventoKiwify,
  membro: EstadoMembro | null,
  agora: Date,
  diasTolerancia: number,
): Decisao {
  switch (ev.evento) {
    case "aprovada":
    case "renovada": {
      // Proteção contra reenvio atrasado: um pedido que já foi reembolsado
      // ou contestado não pode reativar o acesso. (Uma compra NOVA tem outro
      // order_id e reativa normalmente.)
      if (
        membro &&
        (membro.status === "reembolsada" || membro.status === "chargeback") &&
        ev.orderId &&
        membro.kiwify_order_id === ev.orderId
      ) {
        return { acao: "nada", motivo: `pedido ${ev.orderId} já foi ${membro.status}; evento antigo ignorado` };
      }
      return {
        acao: "ativar",
        patch: {
          status: "ativa",
          tolerancia_ate: null,
          periodo_pago_ate: ev.periodoPagoAte ?? membro?.periodo_pago_ate ?? null,
        },
        motivo: ev.evento === "aprovada" ? "compra aprovada" : "assinatura renovada",
      };
    }

    case "atrasada": {
      if (!membro) return { acao: "nada", motivo: "atraso de quem não é membro" };
      if (membro.status === "atrasada") {
        // Reenvio do mesmo atraso: mantém a tolerância original.
        return { acao: "nada", motivo: "já estava atrasada; tolerância mantida" };
      }
      if (membro.status !== "ativa") {
        return { acao: "nada", motivo: `status ${membro.status} não muda com atraso` };
      }
      return {
        acao: "atualizar",
        patch: {
          status: "atrasada",
          tolerancia_ate: new Date(agora.getTime() + diasTolerancia * DIA_MS).toISOString(),
        },
        motivo: `pagamento atrasado; acesso mantido por ${diasTolerancia} dia(s)`,
      };
    }

    case "cancelada": {
      if (!membro) return { acao: "nada", motivo: "cancelamento de quem não é membro" };
      if (membro.status === "reembolsada" || membro.status === "chargeback") {
        return { acao: "nada", motivo: `já está ${membro.status}; bloqueio mantido` };
      }
      const fim = ev.periodoPagoAte;
      const vigente = fim !== null && Date.parse(fim) > agora.getTime();
      return {
        acao: "atualizar",
        patch: { status: "cancelada", tolerancia_ate: null, periodo_pago_ate: fim },
        motivo: vigente
          ? `cancelada; acesso até ${fim}`
          : "cancelada sem período pago vigente; acesso bloqueado",
      };
    }

    case "reembolsada":
    case "chargeback": {
      if (!membro) return { acao: "nada", motivo: `${ev.evento} de quem não é membro` };
      return {
        acao: "atualizar",
        patch: { status: ev.evento, tolerancia_ate: null },
        motivo: `${ev.evento}; acesso bloqueado na hora`,
      };
    }

    default:
      return { acao: "ignorar", motivo: `evento "${ev.tipoOriginal ?? "desconhecido"}" não altera acesso` };
  }
}
