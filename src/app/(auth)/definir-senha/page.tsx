import type { Metadata } from "next";
import Link from "next/link";
import { getSessao } from "@/lib/auth";
import { DefinirSenhaForm } from "./form";

export const metadata: Metadata = { title: "Definir senha" };

export default async function DefinirSenhaPage() {
  const sessao = await getSessao();

  if (!sessao) {
    return (
      <div className="card">
        <h1 className="heading-xl text-3xl">Link expirado</h1>
        <p className="mt-3 text-muted">
          Pra criar sua senha, abra o link que enviamos por e-mail. Se ele expirou, peça um novo.
        </p>
        <Link href="/primeiro-acesso" className="btn-primary mt-6 w-full">Pedir novo link</Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h1 className="heading-xl text-3xl">Crie sua senha</h1>
      <p className="mt-2 text-muted">
        Para <span className="font-semibold text-fg">{sessao.email}</span>. É com ela que você vai entrar daqui pra frente.
      </p>
      <DefinirSenhaForm />
    </div>
  );
}
