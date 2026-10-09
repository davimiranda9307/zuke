import type { Metadata } from "next";
import { esqueciSenhaAction } from "../actions";
import { EmailLinkForm } from "@/components/ui/EmailLinkForm";

export const metadata: Metadata = { title: "Esqueci a senha" };

export default function EsqueciSenhaPage() {
  return (
    <div className="card">
      <h1 className="heading-xl text-3xl">Esqueci a senha</h1>
      <p className="mt-2 text-muted">
        Digite seu e-mail e a gente manda um link pra você criar uma senha nova.
      </p>
      <EmailLinkForm action={esqueciSenhaAction} botao="Enviar link" />
    </div>
  );
}
