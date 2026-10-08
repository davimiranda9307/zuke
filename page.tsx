import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WhyZuke } from "@/components/WhyZuke";
import { Comparison } from "@/components/Comparison";
import { HowItWorks } from "@/components/HowItWorks";
import { PriceRanges } from "@/components/PriceRanges";
import { ForWhom } from "@/components/ForWhom";
import { DescobrindoBras } from "@/components/DescobrindoBras";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { Guarantee } from "@/components/Guarantee";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { StickyMobileBar } from "@/components/StickyMobileBar";

/**
 * Ordem dos blocos segue o "Blueprint" da análise (13 blocos), adaptado
 * ao Zuke (assinatura, sem prova social/números inventados).
 */
export default function HomePage() {
  return (
    <>
      {/* 01 · Header fixo */}
      <Header />
      <main>
        {/* 02 · Hero + VSL (escuro) */}
        <Hero />
        {/* 03 · Por que o Zuke */}
        <WhyZuke />
        {/* Comparativo WhatsApp x Zuke (inimigo comum) */}
        <Comparison />
        {/* 04 · Como funciona (3 passos) */}
        <HowItWorks />
        {/* 05 · O que tem dentro / as faixas */}
        <PriceRanges />
        {/* 06 · Para quem é */}
        <ForWhom />
        {/* 07 · Autoridade da curadoria — Descobrindo fornecedores (escuro) */}
        <DescobrindoBras />
        {/* 08 · Prova social — só aparece quando houver depoimentos reais */}
        <Testimonials />
        {/* 09 · Oferta (único caminho até o checkout) */}
        <Pricing />
        {/* 10 · Garantia */}
        <Guarantee />
        {/* 11 · FAQ */}
        <FAQ />
        {/* 12 · CTA final (escuro) */}
        <FinalCTA />
      </main>
      {/* 13 · Rodapé (escuro) */}
      <Footer />

      {/* espaço pra barra fixa não cobrir o rodapé no celular */}
      <div className="h-16 md:hidden" aria-hidden />

      <StickyMobileBar />
    </>
  );
}
