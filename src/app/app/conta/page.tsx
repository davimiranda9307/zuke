import Link from "next/link";
import { siteConfig } from "@/config/site";
import { exigirMembro } from "@/lib/auth";
import { STATUS_LABEL, formatarData } from "@/lib/format";

export const metadata = { title: "Minha conta" };

export default async function ContaPage() {
  const { member, email } = await exigirMembro();

  let detalhe: string | null = null;
  if (member?.acesso_manual === "liberado") detalhe = "Acesso liberado manualmente pela equipe.";
  else if (member?.status === "atrasada") detalhe = `Acesso garantido até ${formatarData(member.tolerancia_ate)}. Atualize o pagamento pra não perder.`;
  else if (member?.status === "cancelada") detalhe = `Assinatura cancelada. Acesso até ${formatarData(member.periodo_pago_ate)}.`;
  else if (member?.periodo_pago_ate) detalhe = `Próxima renovação: ${formatarData(member.periodo_pago_ate)}.`;

  return (
    <div className="space-y-4">
      <h1 className="heading-xl text-3xl">Minha conta</h1>

      <section className="card">
        <dl className="space-y-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-muted">Nome</dt>
            <dd className="mt-1 font-semibold">{member?.nome || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-muted">E-mail</dt>
            <dd className="mt-1 font-semibold break-all">{email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-muted">Assinatura</dt>
            <dd className="mt-1 font-semibold">
              {member ? STATUS_LABEL[member.status] : "—"} · {siteConfig.price.full}
            </dd>
            {detalhe ? <dd className="mt-1 text-sm text-muted">{detalhe}</dd> : null}
          </div>
        </dl>
      </section>

      <section className="card space-y-3">
        <h2 className="font-display text-lg font-bold">Gerenciar assinatura</h2>
        {siteConfig.kiwifyManageUrl ? (
          <>
            <p className="text-sm text-muted">Pagamento, cartão e cancelamento ficam na Kiwify.</p>
            <a href={siteConfig.kiwifyManageUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full">
              Gerenciar ou cancelar na Kiwify
            </a>
          </>
        ) : (
          <p className="text-sm text-muted">
            Pra trocar o cartão ou cancelar, use o link do e-mail de compra da Kiwify ou fale com a gente em{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-fg underline underline-offset-2">
              {siteConfig.contact.email}
            </a>
            .
          </p>
        )}
      </section>

      <section className="card space-y-2">
        <Link href="/definir-senha" className="btn-secondary w-full">Trocar senha</Link>
        <form action="/auth/sair" method="post">
          <button type="submit" className="w-full py-3 text-sm font-semibold text-muted hover:text-fg">Sair</button>
        </form>
      </section>
    </div>
  );
}
