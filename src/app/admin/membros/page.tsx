import Link from "next/link";
import { exigirAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { STATUS_LABEL, formatarData } from "@/lib/format";
import type { Member } from "@/lib/types";
import {
  adicionarMembroAction,
  corrigirEmailAction,
  definirAcessoManualAction,
  reenviarAcessoAction,
} from "../actions";
import { Flash } from "@/components/admin/Flash";

export const metadata = { title: "Membros" };

type MembroComAcesso = Member & { tem_acesso: boolean };

export default async function AdminMembros({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ok?: string; erro?: string }>;
}) {
  await exigirAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim().toLowerCase() ?? "";

  let query = createAdminClient()
    .from("members")
    .select("*, tem_acesso")
    .order("created_at", { ascending: false })
    .limit(50);
  if (q) query = query.ilike("email", `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`);
  const { data, error } = await query;
  const membros = (data ?? []) as MembroComAcesso[];

  return (
    <div className="space-y-5">
      <h1 className="heading-xl text-3xl">Membros</h1>
      <Flash ok={sp.ok} erro={sp.erro ?? error?.message} />

      <form method="get" className="flex gap-2">
        <input name="q" type="search" defaultValue={q} placeholder="Buscar por e-mail…" className="input" />
        <button type="submit" className="btn-secondary shrink-0">Buscar</button>
      </form>

      <details className="card">
        <summary className="cursor-pointer font-semibold">+ Adicionar membro manualmente</summary>
        <p className="mt-2 text-sm text-muted">
          Pra parcerias, cortesias ou pra você testar a área de membros. O acesso fica liberado manualmente
          (não depende da Kiwify) e a pessoa recebe o e-mail pra criar a senha.
        </p>
        <form action={adicionarMembroAction} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input name="email" type="email" required placeholder="e-mail" className="input" />
          <input name="nome" placeholder="nome (opcional)" className="input" />
          <button type="submit" className="btn-primary">Adicionar</button>
        </form>
      </details>

      <p className="text-sm text-muted">{q ? `${membros.length} resultado(s)` : `Últimos ${membros.length} membros`}</p>

      <div className="space-y-3">
        {membros.map((m) => (
          <div key={m.id} className="card space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="break-all font-semibold">{m.email}</p>
                <p className="text-sm text-muted">{m.nome || "sem nome"} · desde {formatarData(m.created_at)}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  m.tem_acesso ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                }`}
              >
                {m.tem_acesso ? "com acesso" : "sem acesso"}
              </span>
            </div>

            <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              <div><dt className="inline text-muted">Status Kiwify: </dt><dd className="inline font-semibold">{STATUS_LABEL[m.status]}</dd></div>
              <div>
                <dt className="inline text-muted">Override manual: </dt>
                <dd className="inline font-semibold">{m.acesso_manual ?? "nenhum (segue a Kiwify)"}</dd>
              </div>
              {m.tolerancia_ate ? <div><dt className="inline text-muted">Tolerância até: </dt><dd className="inline">{formatarData(m.tolerancia_ate, true)}</dd></div> : null}
              {m.periodo_pago_ate ? <div><dt className="inline text-muted">Período pago até: </dt><dd className="inline">{formatarData(m.periodo_pago_ate, true)}</dd></div> : null}
              <div><dt className="inline text-muted">Último evento: </dt><dd className="inline">{m.ultimo_evento ?? "—"} ({formatarData(m.ultimo_evento_em, true)})</dd></div>
              <div><dt className="inline text-muted">Assinatura Kiwify: </dt><dd className="inline break-all">{m.kiwify_subscription_id ?? "—"}</dd></div>
            </dl>

            <div className="flex flex-wrap gap-2">
              {(["liberado", "bloqueado", "kiwify"] as const)
                .filter((v) => (v === "kiwify" ? m.acesso_manual !== null : m.acesso_manual !== v))
                .map((v) => (
                  <form key={v} action={definirAcessoManualAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="valor" value={v} />
                    <input type="hidden" name="q" value={q} />
                    <button type="submit" className="btn-secondary !px-4 !py-2 text-sm">
                      {v === "liberado" ? "Liberar acesso" : v === "bloqueado" ? "Bloquear acesso" : "Voltar a seguir a Kiwify"}
                    </button>
                  </form>
                ))}
              <form action={reenviarAcessoAction}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="q" value={q} />
                <button type="submit" className="btn-secondary !px-4 !py-2 text-sm">Reenviar e-mail de acesso</button>
              </form>
              <Link href={`/admin/webhooks?email=${encodeURIComponent(m.email)}`} className="btn-secondary !px-4 !py-2 text-sm">
                Ver webhooks
              </Link>
            </div>

            <details>
              <summary className="cursor-pointer text-sm font-semibold text-muted hover:text-fg">Corrigir e-mail</summary>
              <form action={corrigirEmailAction} className="mt-2 flex gap-2">
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="q" value={q} />
                <input name="email" type="email" required defaultValue={m.email} className="input" />
                <button type="submit" className="btn-primary shrink-0 !px-4">Salvar</button>
              </form>
              <p className="mt-1 text-xs text-muted">Atualiza o login da pessoa também. O novo e-mail já entra confirmado.</p>
            </details>
          </div>
        ))}
        {membros.length === 0 ? <p className="card text-center text-muted">Nenhum membro encontrado.</p> : null}
      </div>
    </div>
  );
}
