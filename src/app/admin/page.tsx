import Link from "next/link";
import { exigirAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Visão geral" };

export default async function AdminHome() {
  await exigirAdmin();
  const admin = createAdminClient();
  const seteDias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [comAcesso, membros, lojas, falhas, feedbacks] = await Promise.all([
    admin.from("members").select("id", { count: "exact", head: true }).eq("tem_acesso", true),
    admin.from("members").select("id", { count: "exact", head: true }),
    admin.from("lojas").select("id", { count: "exact", head: true }).eq("ativa", true),
    admin
      .from("webhook_events")
      .select("id", { count: "exact", head: true })
      .in("status", ["erro", "rejeitado"])
      .gte("created_at", seteDias),
    admin.from("feedbacks").select("id", { count: "exact", head: true }).eq("resolvido", false),
  ]);

  const cards = [
    { rotulo: "Membros com acesso", valor: comAcesso.count, sub: `de ${membros.count ?? "—"} cadastrados`, href: "/admin/membros" },
    { rotulo: "Lojas ativas", valor: lojas.count, sub: "na curadoria", href: "/admin/lojas" },
    { rotulo: "Webhooks com problema", valor: falhas.count, sub: "últimos 7 dias", href: "/admin/webhooks?status=problema", alerta: (falhas.count ?? 0) > 0 },
    { rotulo: "Feedbacks abertos", valor: feedbacks.count, sub: "esperando resposta", href: "/admin/feedbacks" },
  ];

  return (
    <div>
      <h1 className="heading-xl text-3xl">Visão geral</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.rotulo} href={c.href} className={`card block transition-transform hover:-translate-y-0.5 ${c.alerta ? "border-red-300" : ""}`}>
            <p className="text-sm font-semibold text-muted">{c.rotulo}</p>
            <p className={`mt-1 font-display text-4xl font-extrabold ${c.alerta ? "text-red-600" : ""}`}>{c.valor ?? "—"}</p>
            <p className="mt-1 text-xs text-muted">{c.sub}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/lojas/nova" className="btn-primary">+ Cadastrar loja</Link>
        <Link href="/admin/membros" className="btn-secondary">Buscar membro</Link>
      </div>
    </div>
  );
}
