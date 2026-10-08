import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-fg text-bg">
      <div className="container-page py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="font-display text-xl font-extrabold">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-bg/60">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-bg/50">
                Navegar
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#como-funciona" className="text-bg/80 transition-colors hover:text-bg">
                    Como funciona
                  </a>
                </li>
                <li>
                  <a href="#faixas" className="text-bg/80 transition-colors hover:text-bg">
                    Faixas de preço
                  </a>
                </li>
                <li>
                  <a href="#oferta" className="text-bg/80 transition-colors hover:text-bg">
                    Assinar
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-bg/80 transition-colors hover:text-bg">
                    Dúvidas
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-bg/50">
                Legal
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/termos" className="text-bg/80 transition-colors hover:text-bg">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="/privacidade" className="text-bg/80 transition-colors hover:text-bg">
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-bg/50">
                Contato
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-bg/80 transition-colors hover:text-bg"
                  >
                    {siteConfig.contact.email}
                  </a>
                </li>
                {siteConfig.social.instagram ? (
                  <li>
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bg/80 transition-colors hover:text-bg"
                    >
                      Instagram
                    </a>
                  </li>
                ) : null}
                {siteConfig.social.tiktok ? (
                  <li>
                    <a
                      href={siteConfig.social.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bg/80 transition-colors hover:text-bg"
                    >
                      TikTok
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-bg/10 pt-6 text-xs leading-relaxed text-bg/50">
          O {siteConfig.name} é um serviço de curadoria e indicação de lojas. Não
          vendemos as roupas e não garantimos preços, estoque ou condições das
          lojas indicadas, que podem mudar sem aviso.
        </p>

        <div className="mt-6 flex flex-col gap-2 text-xs text-bg/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.company.legalName}. CNPJ {siteConfig.company.cnpj}.
          </p>
          <p>Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
