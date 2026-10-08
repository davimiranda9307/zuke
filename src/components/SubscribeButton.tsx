"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { buildCheckoutUrl } from "@/lib/checkout";
import { trackInitiateCheckout } from "@/lib/analytics";

type Props = {
  children?: React.ReactNode;
  /** Estilo do botão. */
  variant?: "primary" | "secondary";
  /** Classe extra (ex.: w-full). */
  className?: string;
  /** Rótulo para leitura de tela e para eventos (opcional). */
  "aria-label"?: string;
};

/**
 * Botão "Assinar" usado em toda a landing.
 * - Leva ao checkout da Kiwify (siteConfig.checkoutUrl).
 * - Repassa as UTMs/parâmetros de rastreio que vieram na URL da landing.
 * - Dispara o evento InitiateCheckout do Pixel ao clicar.
 */
export function SubscribeButton({
  children = "Assinar agora",
  variant = "primary",
  className = "",
  ...rest
}: Props) {
  // Começa com o link base (válido no SSR) e enriquece com as UTMs no cliente.
  const [href, setHref] = useState(siteConfig.checkoutUrl);

  useEffect(() => {
    setHref(buildCheckoutUrl(window.location.search));
  }, []);

  const base = variant === "primary" ? "btn-primary" : "btn-secondary";

  return (
    <a
      href={href}
      onClick={() => trackInitiateCheckout()}
      className={`${base} ${className}`.trim()}
      {...rest}
    >
      {children}
    </a>
  );
}
