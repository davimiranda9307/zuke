"use client";

import { useActionState } from "react";
import { definirSenhaAction } from "../actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function DefinirSenhaForm() {
  const [estado, acao] = useActionState(definirSenhaAction, undefined);

  return (
    <form action={acao} className="mt-6 space-y-4">
      <div>
        <label htmlFor="senha" className="label">Nova senha</label>
        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="input"
        />
        <p className="mt-1.5 text-xs text-muted">Mínimo de 8 caracteres.</p>
      </div>
      <div>
        <label htmlFor="confirmacao" className="label">Repita a senha</label>
        <input
          id="confirmacao"
          name="confirmacao"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="input"
        />
      </div>
      {estado?.erro ? <p className="alert-erro" role="alert">{estado.erro}</p> : null}
      <SubmitButton pendente="Salvando…">Salvar senha e entrar</SubmitButton>
    </form>
  );
}
