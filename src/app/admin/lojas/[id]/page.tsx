import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { exigirAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Loja } from "@/lib/types";
import { LojaForm } from "@/components/admin/LojaForm";

export const metadata = { title: "Editar loja" };

export default async function EditarLojaPage({ params }: { params: Promise<{ id: string }> }) {
  await exigirAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { data } = await createAdminClient().from("lojas").select("*").eq("id", id).maybeSingle<Loja>();
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="heading-xl mb-6 text-3xl">Editar loja</h1>
      <LojaForm loja={data} faixas={siteConfig.priceTiers} />
    </div>
  );
}
