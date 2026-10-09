import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { exigirAdmin } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: { default: "Admin", template: `%s · Admin ${siteConfig.name}` },
  robots: { index: false, follow: false },
};

/** Painel admin: só e-mails listados em ADMIN_EMAILS (os demais recebem 404). */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { email } = await exigirAdmin();

  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-bg/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex h-14 items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <Logo className="h-7 w-7" />
              <span className="font-display text-lg font-extrabold">{siteConfig.name}</span>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">admin</span>
            </Link>
            <div className="flex items-center gap-1 text-sm">
              <Link href="/app" className="rounded-full px-3 py-2 font-semibold text-muted hover:text-fg">Ver app</Link>
              <form action="/auth/sair" method="post">
                <button type="submit" className="rounded-full px-3 py-2 font-semibold text-muted hover:text-fg">Sair</button>
              </form>
            </div>
          </div>
          <div className="pb-2">
            <AdminNav />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6">{children}</main>
      <p className="pb-6 text-center text-xs text-muted">Logado como {email}</p>
    </div>
  );
}
