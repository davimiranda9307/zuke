"use client";

import { siteConfig } from "@/config/site";
import { abrirPlanos } from "@/lib/planos";

type Props = {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "light";
  /** Pulsar levemente (hero e fechamento). */
  pulse?: boolean;
  className?: string;
};

/**
 * Botão de compra usado em toda a landing: abre o modal de planos.
 * O href="#oferta" é só o plano B — se o JavaScript não carregar,
 * o clique ainda leva a pessoa até a seção de oferta.
 */
export function CTAButton({
  children = `Assinar por ${siteConfig.price.full}`,
  variant = "primary",
  pulse = false,
  className = "",
}: Props) {
  const base =
    variant === "secondary"
      ? "btn-secondary"
      : variant === "light"
        ? "btn-light"
        : "btn-primary";

  return (
    <a
      href="#oferta"
      onClick={(e) => {
        e.preventDefault();
        abrirPlanos();
      }}
      className={`${base} ${pulse ? "animate-pulse-cta" : ""} ${className}`.trim()}
    >
      {children}
    </a>
  );
}
