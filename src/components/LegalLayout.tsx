import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlanosModal } from "@/components/PlanosModal";

/** Moldura das páginas legais (Termos e Privacidade). */
export function LegalLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="text-sm font-medium text-muted transition-colors hover:text-fg"
          >
            ← Voltar para a página inicial
          </Link>

          <h1 className="heading-xl mt-6 text-3xl sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">Última atualização: {updatedAt}</p>

          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed text-fg/80">
            <strong>Texto provisório.</strong> Este é um rascunho inicial, apenas
            para estruturar a página. Revise com um advogado antes de publicar
            de verdade. Os trechos marcados com <code>[CONFIRMAR]</code> precisam
            da sua decisão.
          </div>

          <div className="legal-content mt-10 space-y-6 leading-relaxed text-fg/80">
            {children}
          </div>
        </div>
      </main>
      <Footer />
      <PlanosModal />
    </>
  );
}
