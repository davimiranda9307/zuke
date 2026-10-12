import { siteConfig } from "@/config/site";
import { Logo } from "@/components/Logo";

/**
 * Assinatura da marca: monograma + nome em duas linhas
 * ("Camarote VIP" em cima, "CLOTHES" pequeno embaixo).
 * Cabe no cabeçalho do celular sem empurrar os botões.
 */
export function BrandMark({
  tamanho = "md",
  claro = false,
}: {
  tamanho?: "sm" | "md";
  /** true sobre fundo escuro (rodapé). */
  claro?: boolean;
}) {
  const resto = siteConfig.name.replace(siteConfig.shortName, "").trim();

  return (
    <span className="flex items-center gap-2">
      <Logo className={tamanho === "sm" ? "h-7 w-7 shrink-0" : "h-8 w-8 shrink-0"} />
      <span className="flex flex-col leading-none">
        <span
          className={`whitespace-nowrap font-display font-extrabold tracking-tight ${
            tamanho === "sm" ? "text-base" : "text-[17px] sm:text-lg"
          }`}
        >
          {siteConfig.shortName}
        </span>
        {resto ? (
          <span
            className={`mt-0.5 text-[9px] font-semibold uppercase tracking-[0.42em] ${
              claro ? "text-bg/60" : "text-muted"
            }`}
          >
            {resto}
          </span>
        ) : null}
      </span>
    </span>
  );
}
