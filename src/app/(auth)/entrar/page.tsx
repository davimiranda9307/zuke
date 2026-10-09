import type { Metadata } from "next";
import { EntrarForm } from "./form";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="card">
      <h1 className="heading-xl text-3xl">Entrar</h1>
      <p className="mt-2 text-muted">Acesse sua conta pra ver as lojas.</p>
      <EntrarForm next={next ?? "/app"} />
    </div>
  );
}
