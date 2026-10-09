"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { enviarFeedbackAction } from "@/app/app/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

const OPCOES = [
  { valor: "sugerir_loja", rotulo: "Sugerir loja" },
  { valor: "link_quebrado", rotulo: "Link quebrado" },
  { valor: "outro", rotulo: "Outro" },
] as const;

/** Botão fixo da área de membros: abre o formulário de sugestão/problema. */
export function FeedbackButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [rodada, setRodada] = useState(0); // remonta o form a cada abertura

  function abrir() {
    setRodada((r) => r + 1);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-fg px-4 py-3 text-sm font-semibold text-bg shadow-lift transition-transform hover:-translate-y-0.5"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <span aria-hidden>💬</span>
        <span>Sugerir loja / reportar problema</span>
      </button>

      <dialog
        ref={dialogRef}
        className="w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-bg p-0 text-fg shadow-lift backdrop:bg-fg/40"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <FeedbackForm key={rodada} fechar={() => dialogRef.current?.close()} />
      </dialog>
    </>
  );
}

function FeedbackForm({ fechar }: { fechar: () => void }) {
  const [estado, acao] = useActionState(enviarFeedbackAction, undefined);
  const pathname = usePathname();

  useEffect(() => {
    if (!estado?.ok) return;
    const t = setTimeout(fechar, 1800);
    return () => clearTimeout(t);
  }, [estado, fechar]);

  if (estado?.ok) {
    return (
      <div className="p-6 text-center">
        <p className="font-display text-xl font-bold">Valeu! 🙌</p>
        <p className="mt-2 text-muted">Recebemos sua mensagem e vamos dar uma olhada.</p>
      </div>
    );
  }

  return (
    <form action={acao} className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-xl font-bold">Fala com a gente</h2>
        <button type="button" onClick={fechar} className="-m-1 p-1 text-muted hover:text-fg" aria-label="Fechar">
          ✕
        </button>
      </div>
      <input type="hidden" name="pagina" value={pathname} />

      <fieldset className="mt-4">
        <legend className="label">Sobre o quê?</legend>
        <div className="flex flex-wrap gap-2">
          {OPCOES.map((o, i) => (
            <label key={o.valor} className="cursor-pointer">
              <input type="radio" name="tipo" value={o.valor} defaultChecked={i === 0} className="peer sr-only" />
              <span className="chip peer-checked:border-fg peer-checked:bg-fg peer-checked:text-bg">{o.rotulo}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <label htmlFor="mensagem" className="label">Mensagem</label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          required
          maxLength={2000}
          placeholder="Ex.: conheço uma loja ótima no Brás… / o link da loja X não abre…"
          className="input resize-none"
        />
      </div>

      {estado?.erro ? <p className="alert-erro mt-3" role="alert">{estado.erro}</p> : null}

      <div className="mt-5">
        <SubmitButton pendente="Enviando…">Enviar</SubmitButton>
      </div>
    </form>
  );
}
