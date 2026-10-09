import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { exigirMembro, isAdminEmail } from "@/lib/auth";
import { formatarData } from "@/lib/format";
import { Logo } from "@/components/Logo";
import { FeedbackButton } from "@/components/app/FeedbackButton";

export const metadata: Metadata = {
  title: { default: "Lojas", template: `%s · ${siteConfig.name}` },
  robots: { index: false, follow: false },
};

/** Área de membros: exige login + acesso (has_access). */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { member, email } = await exigirMembro();
  const atrasada = member?.status === "atrasada" && member.acesso_manual !== "liberado";

  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/app" className="flex items-center gap-2" aria-label="Início">
            <Logo className="h-7 w-7" />
            <span className="font-display text-lg font-extrabold tracking-tight">{siteConfig.name}</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-semibold">
            {isAdminEmail(email) ? (
              <Link href="/admin" className="rounded-full px-3 py-2 text-muted hover:text-fg">Admin</Link>
            ) : null}
            <Link href="/app/conta" className="rounded-full px-3 py-2 text-muted hover:text-fg">Minha conta</Link>
          </nav>
        </div>
      </header>

      {atrasada ? (
        <div className="border-b border-amber-200 bg-amber-50">
          <p className="mx-auto max-w-3xl px-4 py-3 text-sm text-amber-900">
            <strong>Atualize seu pagamento.</strong> Seu acesso continua até{" "}
            {formatarData(member?.tolerancia_ate)}.{" "}
            {siteConfig.kiwifyManageUrl ? (
              <a href={siteConfig.kiwifyManageUrl} className="font-semibold underline underline-offset-2">
                Atualizar agora
              </a>
            ) : (
              <>Use o link do e-mail da Kiwify pra regularizar.</>
            )}
          </p>
        </div>
      ) : null}

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-6">{children}</main>
      <FeedbackButton />
    </div>
  );
}
