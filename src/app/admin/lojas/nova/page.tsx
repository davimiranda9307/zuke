import { siteConfig } from "@/config/site";
import { exigirAdmin } from "@/lib/auth";
import { LojaForm } from "@/components/admin/LojaForm";

export const metadata = { title: "Nova loja" };

export default async function NovaLojaPage() {
  await exigirAdmin();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="heading-xl mb-6 text-3xl">Cadastrar loja</h1>
      <LojaForm faixas={siteConfig.priceTiers} />
    </div>
  );
}
