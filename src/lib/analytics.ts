/**
 * Helpers de rastreamento do Pixel da Meta.
 * Tudo aqui é seguro de chamar mesmo quando o Pixel não está carregado
 * (ID vazio na config): simplesmente não faz nada.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Dispara um evento padrão do Pixel, se ele existir. */
export function trackMeta(event: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
}

/** Evento disparado ao clicar em qualquer botão "Assinar". */
export function trackInitiateCheckout(): void {
  trackMeta("InitiateCheckout");
}
