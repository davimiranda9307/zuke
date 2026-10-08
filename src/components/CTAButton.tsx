import { siteConfig } from "@/config/site";

type Props = {
  children?: React.ReactNode;
  /** Âncora de destino (por padrão, a caixa de oferta). */
  href?: string;
  variant?: "primary" | "secondary" | "light";
  /** Pulsar levemente (hero e fechamento). */
  pulse?: boolean;
  className?: string;
};

/**
 * Botão de avanço interno. Leva à seção de oferta (#oferta) — NÃO ao checkout.
 * Segue a regra do blueprint: só o botão da caixa de oferta vai pro checkout,
 * então ninguém chega ao pagamento sem ver preço e garantia.
 */
export function CTAButton({
  children = `Assinar por ${siteConfig.price.full}`,
  href = "#oferta",
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
      href={href}
      className={`${base} ${pulse ? "animate-pulse-cta" : ""} ${className}`.trim()}
    >
      {children}
    </a>
  );
}
