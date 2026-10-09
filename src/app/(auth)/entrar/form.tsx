"use client";

import Link from "next/link";
import { useActionState } from "react";
import { entrarAction } from "../actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function EntrarForm({ next }: { next: string }) {
  const [estado, acao] = useActionState(entrarAction, undefined);

  return (
    <form action={acao} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={estado?.email}
          className="input"
        />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="senha" className="label">Senha</label>
          <Link href="/esqueci-senha" className="text-sm font-medium text-muted hover:text-fg">
            Esqueci a senha
          </Link>
        </div>
        <input id="senha" name="senha" type="password" autoComplete="current-password" required className="input" />
      </div>

      {estado?.erro ? <p className="alert-erro" role="alert">{estado.erro}</p> : null}

      <SubmitButton pendente="Entrando…">Entrar</SubmitButton>

      <p className="pt-2 text-center text-sm text-muted">
        Acabou de assinar ou não recebeu o e-mail?{" "}
        <Link href="/primeiro-acesso" className="font-semibold text-fg underline underline-offset-2">
          Primeiro acesso
        </Link>
      </p>
    </form>
  );
}
