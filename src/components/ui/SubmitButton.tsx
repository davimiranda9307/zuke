"use client";

import { useFormStatus } from "react-dom";

/** Botão de envio que mostra "aguarde" enquanto o formulário processa. */
export function SubmitButton({
  children,
  pendente = "Aguarde…",
  className = "btn-primary w-full",
}: {
  children: React.ReactNode;
  pendente?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${className} disabled:opacity-60`}>
      {pending ? pendente : children}
    </button>
  );
}
