import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CTAButton } from "@/components/CTAButton";
import { Logo } from "@/components/Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-bg/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label={siteConfig.name}>
          <Logo className="h-8 w-8" />
          <span className="font-display text-xl font-extrabold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <a href="#como-funciona" className="transition-colors hover:text-fg">
            Como funciona
          </a>
          <a href="#faixas" className="transition-colors hover:text-fg">
            Faixas de preço
          </a>
          <a href="#para-quem" className="transition-colors hover:text-fg">
            Para quem é
          </a>
          <a href="#faq" className="transition-colors hover:text-fg">
            Dúvidas
          </a>
        </nav>

        <CTAButton className="!px-5 !py-2.5 text-sm">Assinar</CTAButton>
      </div>
    </header>
  );
}
