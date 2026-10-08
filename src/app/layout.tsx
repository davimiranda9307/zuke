import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { MetaPixel } from "@/components/MetaPixel";
import { CookieBanner } from "@/components/CookieBanner";

/* Fontes carregadas pelo next/font (self-hosted, sem requisição externa).
   - display: "swap" mostra o texto na hora com a fonte do sistema e troca
     pela definitiva assim que carrega (zero texto invisível).
   - fallback reduz o "pulo" de layout enquanto a fonte baixa.
   Para trocar, basta mudar aqui — elas viram as variáveis CSS do design. */
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "lojas de roupa",
    "Brás",
    "moda",
    "curadoria de lojas",
    "comprar roupa barato",
    "assinatura",
    siteConfig.name,
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <head>
        {/* Aquece a conexão com o checkout (DNS + TLS) antes do clique. */}
        <link rel="preconnect" href="https://pay.kiwify.com.br" />
        {/* Pixel da Meta (só é usado se o ID estiver preenchido). */}
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
      </head>
      <body>
        {children}
        <CookieBanner />
        <MetaPixel />
      </body>
    </html>
  );
}
