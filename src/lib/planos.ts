import { siteConfig, type Plano } from "@/config/site";

/** Evento que abre o modal de planos (disparado pelos botões de compra). */
export const EVENTO_ABRIR_PLANOS = "zuke:abrir-planos";

declare global {
  interface Window {
    /** true quando o modal de planos está montado na página atual. */
    __zukePlanos?: boolean;
  }
}

/**
 * Abre o modal de planos. Se a página atual não tiver o modal (ex.: alguma
 * página futura), leva pra landing já com o modal aberto.
 */
export function abrirPlanos(): void {
  if (window.__zukePlanos) {
    window.dispatchEvent(new Event(EVENTO_ABRIR_PLANOS));
  } else {
    window.location.href = "/?planos=1";
  }
}

// ---------- contas dos planos (sempre calculadas, nunca inventadas) ----------

export function valorNumerico(preco: string): number {
  return Number(preco.replace(/\./g, "").replace(",", "."));
}

export function formatarReais(valor: number): string {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Quanto o plano sai por mês. */
export function precoPorMes(plano: Plano): number {
  return valorNumerico(plano.preco) / plano.meses;
}

/** "mensal (R$19,99/mês), semestral (R$59,99/semestre) e anual (R$109,99/ano)" */
export function descreverPlanos(comPreco = true): string {
  const itens = [...siteConfig.plans]
    .sort((a, b) => a.meses - b.meses)
    .map((p) => (comPreco ? `${p.nome.toLowerCase()} (R$${p.preco}/${p.periodo})` : p.nome.toLowerCase()));
  return itens.length > 1 ? `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}` : (itens[0] ?? "");
}

/** % de economia em relação a pagar o plano mensal pelo mesmo período (0 se não houver). */
export function economia(plano: Plano): number {
  const mensal = siteConfig.plans.find((p) => p.meses === 1);
  if (!mensal || plano.meses <= 1) return 0;
  const cheio = valorNumerico(mensal.preco) * plano.meses;
  return Math.max(0, Math.round((1 - valorNumerico(plano.preco) / cheio) * 100));
}
