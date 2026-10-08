"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "zuke-cookie-consent";

/**
 * Aviso simples de cookies (LGPD). Aparece uma vez; a escolha fica salva
 * no navegador do visitante. É um aviso informativo — para um gerenciador
 * de consentimento completo, dá pra evoluir depois.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage pode estar bloqueado — não mostra o aviso nesse caso.
    }
  }, []);

  function decide(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignora */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-content rounded-2xl border border-border bg-bg/95 p-4 shadow-lift backdrop-blur sm:bottom-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-relaxed text-muted">
          A gente usa cookies para entender como você navega e melhorar sua
          experiência. Veja a{" "}
          <Link href="/privacidade" className="font-semibold text-fg underline underline-offset-2">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="rounded-full border border-fg/15 px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-fg/5"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-full bg-fg px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-fg/90"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
