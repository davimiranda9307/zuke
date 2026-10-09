import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getSessao } from "@/lib/auth";
import { formatarData } from "@/lib/format";
import type { Member } from "@/lib/types";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Acesso indisponível",
  robots: { index: false, follow: false },
};

function explicar(member: Member | null, email: string | null): { titulo: string; texto: string } {
  if (!member) {
    return {
      titulo: "Não encontramos sua assinatura",
      texto: `Não há assinatura ligada a ${email ?? "este e-mail"}. Se você comprou com outro e-mail, saia e entre com ele. Se ainda não assinou, é só assinar abaixo.`,
    };
  }
  if (member.acesso_manual === "bloqueado") {
    return { titulo: "Seu acesso está suspenso", texto: "Fale com a gente pra entender o que aconteceu." };
  }
  switch (member.status) {
    case "atrasada":
      return {
        titulo: "Seu pagamento está atrasado",
        texto: `O período de tolerância terminou em ${formatarData(member.tolerancia_ate)}. Atualize o pagamento na Kiwify e o acesso volta sozinho assim que for aprovado.`,
      };
    case "cancelada":
      return {
        titulo: "Sua assinatura foi cancelada",
        texto: member.periodo_pago_ate
          ? `O período que você pagou terminou em ${formatarData(member.periodo_pago_ate)}. Quer voltar? É só assinar de novo.`
          : "O acesso foi encerrado com o cancelamento. Quer voltar? É só assinar de novo.",
      };
    case "reembolsada":
      return { titulo: "Sua compra foi reembolsada", texto: "Por isso o acesso foi encerrado. Se mudou de ideia, você pode assinar de novo." };
    case "chargeback":
      return { titulo: "Pagamento contestado", texto: "O pagamento foi contestado junto ao cartão, então o acesso foi suspenso. Fale com a gente se foi um engano." };
    default:
      return { titulo: "Acesso indisponível", texto: "Fale com a gente pra resolver." };
  }
}

export default async function SemAcessoPage() {
  const sessao = await getSessao();
  if (!sessao) redirect("/entrar");

  const [{ data: temAcesso }, { data: member }] = await Promise.all([
    sessao.supabase.rpc("has_access"),
    sessao.supabase.from("members").select("*").eq("id", sessao.userId).maybeSingle<Member>(),
  ]);
  if (temAcesso) redirect("/app");

  const { titulo, texto } = explicar(member, sessao.email);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface px-5 py-12">
      <div className="card w-full max-w-md text-center">
        <Logo className="mx-auto h-10 w-10" />
        <h1 className="heading-xl mt-5 text-2xl sm:text-3xl">{titulo}</h1>
        <p className="mt-3 leading-relaxed text-muted">{texto}</p>

        <div className="mt-7 space-y-3">
          {member?.status === "atrasada" && siteConfig.kiwifyManageUrl ? (
            <a href={siteConfig.kiwifyManageUrl} className="btn-primary w-full">Atualizar pagamento</a>
          ) : (
            <Link href="/?planos=1" className="btn-primary w-full">
              Ver planos e assinar
            </Link>
          )}
          <a href={`mailto:${siteConfig.contact.email}`} className="btn-secondary w-full">
            Falar com o suporte
          </a>
          <form action="/auth/sair" method="post">
            <button type="submit" className="w-full py-2 text-sm font-medium text-muted hover:text-fg">
              Sair e entrar com outro e-mail
            </button>
          </form>
        </div>
        <p className="mt-6 text-xs text-muted">
          <Link href="/" className="underline underline-offset-2">Voltar ao site</Link>
        </p>
      </div>
    </div>
  );
}
