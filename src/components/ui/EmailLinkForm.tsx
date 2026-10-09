"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { EstadoForm } from "@/app/(auth)/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

/** Formulário "digite seu e-mail e receba um link" (primeiro acesso / esqueci a senha). */
export function EmailLinkForm({
  action,
  botao,
  aviso,
}: {
  action: (estado: EstadoForm, formData: FormData) => Promise<EstadoForm>;
  botao: string;
  /** Aviso mostrado só antes do envio (ex.: link expirado). */
  aviso?: string;
}) {
  const [estado, acao] = useActionState(action, undefined);

  if (estado?.ok) {
    return (
      <div className="mt-6 space-y-4">
        <p className="alert-ok" role="status">{estado.ok}</p>
        <Link href="/entrar" className="btn-secondary w-full">Voltar pro login</Link>
      </div>
    );
  }

  return (
    <form action={acao} className="mt-6 space-y-4">
      {aviso ? <p className="alert-aviso">{aviso}</p> : null}
      <div>
        <label htmlFor="email" className="label">E-mail usado na compra</label>
        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required className="input" />
      </div>
      {estado?.erro ? <p className="alert-erro" role="alert">{estado.erro}</p> : null}
      <SubmitButton pendente="Enviando…">{botao}</SubmitButton>
      <p className="pt-2 text-center text-sm text-muted">
        Já tem senha?{" "}
        <Link href="/entrar" className="font-semibold text-fg underline underline-offset-2">Entrar</Link>
      </p>
    </form>
  );
}
