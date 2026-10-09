import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Moldura das telas de login, primeiro acesso e senha. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label={siteConfig.name}>
          <Logo className="h-8 w-8" />
          <span className="font-display text-xl font-extrabold tracking-tight">{siteConfig.name}</span>
        </Link>
        <Link href="/" className="text-sm font-medium text-muted hover:text-fg">
          Voltar ao site
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-5 pb-16 pt-6 sm:items-center sm:pt-0">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
