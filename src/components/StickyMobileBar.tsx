"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { CTAButton } from "@/components/CTAButton";

/**
 * Barra fixa no rodapé, só no celular, que aparece depois que a pessoa
 * passa do hero. Observa a seção #hero: quando ela sai da tela, mostra a barra.
 */
export function StickyMobileBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { rootMargin: "0px 0px -80% 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/95 backdrop-blur transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!show}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="leading-tight">
          <p className="font-display text-base font-extrabold">
            {siteConfig.price.full}
          </p>
          <p className="text-xs text-muted">Cancele quando quiser</p>
        </div>
        <CTAButton className="!px-6">Assinar</CTAButton>
      </div>
    </div>
  );
}
