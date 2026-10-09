import type { Metadata } from "next";
import { primeiroAcessoAction } from "../actions";
import { EmailLinkForm } from "@/components/ui/EmailLinkForm";

export const metadata: Metadata = { title: "Primeiro acesso" };

export default async function PrimeiroAcessoPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return (
    <div className="card">
      <h1 className="heading-xl text-3xl">Primeiro acesso</h1>
      <p className="mt-2 text-muted">
        Digite o e-mail que você usou na compra. A gente manda um link pra você criar sua senha.
      </p>
      <EmailLinkForm
        action={primeiroAcessoAction}
        botao="Receber link de acesso"
        aviso={erro === "link" ? "Esse link expirou ou já foi usado. Peça um novo abaixo — leva só um instante." : undefined}
      />
    </div>
  );
}
