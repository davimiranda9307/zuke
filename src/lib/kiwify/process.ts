import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { enviarParaUsuario, linkDefinirSenha } from "@/lib/access-email";
import { parseKiwify, type EventoKiwify } from "./parse";
import { decidir, type EstadoMembro, type Patch } from "./transition";

type MembroRow = EstadoMembro & { id: string; email: string };

export type Aplicado = { status: "processado" | "ignorado"; resultado: string };

/** Aplica um evento já validado no banco. Lança erro se algo falhar. */
export async function aplicarEvento(admin: SupabaseClient, ev: EventoKiwify): Promise<Aplicado> {
  const produto = env.kiwifyProductId();
  if (produto && ev.productId && ev.productId !== produto) {
    return { status: "ignorado", resultado: `produto ${ev.productId} não é o configurado em KIWIFY_PRODUCT_ID` };
  }

  const membro = await acharMembro(admin, ev);
  const decisao = decidir(ev, membro, new Date(), env.diasTolerancia());

  const rastro = {
    ultimo_evento: ev.evento,
    ultimo_evento_em: new Date().toISOString(),
    ...(ev.subscriptionId ? { kiwify_subscription_id: ev.subscriptionId } : {}),
    ...(ev.orderId ? { kiwify_order_id: ev.orderId } : {}),
  };

  switch (decisao.acao) {
    case "ignorar":
      return { status: "ignorado", resultado: decisao.motivo };

    case "nada":
      return { status: "processado", resultado: `sem mudança: ${decisao.motivo}` };

    case "atualizar": {
      await atualizar(admin, membro!.id, { ...decisao.patch, ...rastro });
      return { status: "processado", resultado: decisao.motivo };
    }

    case "ativar": {
      if (membro) {
        await atualizar(admin, membro.id, {
          ...decisao.patch,
          ...rastro,
          ...(ev.nome ? { nome: ev.nome } : {}),
        });
        return { status: "processado", resultado: `${decisao.motivo}; acesso ativo` };
      }
      if (!ev.email) {
        throw new Error(
          "Compra sem e-mail reconhecido no payload. Confira o payload bruto e ajuste os caminhos em src/lib/kiwify/parse.ts.",
        );
      }
      const nota = await criarMembro(admin, ev, decisao.patch, rastro);
      return { status: "processado", resultado: `${decisao.motivo}; ${nota}` };
    }
  }
}

async function acharMembro(admin: SupabaseClient, ev: EventoKiwify): Promise<MembroRow | null> {
  const campos = "id, email, status, tolerancia_ate, periodo_pago_ate, kiwify_order_id";
  if (ev.email) {
    const { data, error } = await admin.from("members").select(campos).eq("email", ev.email).maybeSingle<MembroRow>();
    if (error) throw new Error(`erro ao buscar membro: ${error.message}`);
    if (data) return data;
  }
  if (ev.subscriptionId) {
    const { data, error } = await admin
      .from("members")
      .select(campos)
      .eq("kiwify_subscription_id", ev.subscriptionId)
      .limit(1)
      .maybeSingle<MembroRow>();
    if (error) throw new Error(`erro ao buscar membro: ${error.message}`);
    if (data) return data;
  }
  return null;
}

async function atualizar(admin: SupabaseClient, id: string, campos: Record<string, unknown>) {
  const { error } = await admin.from("members").update(campos).eq("id", id);
  if (error) throw new Error(`erro ao atualizar membro: ${error.message}`);
}

/**
 * Primeira compra: cria o usuário no Auth, manda o convite "Defina sua senha"
 * e cria o membro. Se o ENVIO do e-mail falhar (ex.: limite do SMTP padrão),
 * a conta é criada mesmo assim — a pessoa recebe o link depois pelo
 * /primeiro-acesso ou pelo "reenviar acesso" do admin. Nunca se perde a venda.
 */
async function criarMembro(
  admin: SupabaseClient,
  ev: EventoKiwify,
  patch: Patch,
  rastro: Record<string, unknown>,
): Promise<string> {
  const email = ev.email!;
  const { userId, nota } = await garantirUsuarioAuth(admin, email, ev.nome);

  const { error: errMembro } = await admin
    .from("members")
    .upsert({ id: userId, email, nome: ev.nome, ...patch, ...rastro }, { onConflict: "id" });
  if (errMembro) throw new Error(`erro ao salvar membro: ${errMembro.message}`);

  return nota;
}

/**
 * Garante que existe um usuário no Supabase Auth pra esse e-mail e que ele
 * recebeu o e-mail pra criar a senha. Usado pelo webhook e pelo admin.
 */
export async function garantirUsuarioAuth(
  admin: SupabaseClient,
  email: string,
  nome: string | null,
): Promise<{ userId: string; nota: string }> {
  const { data: existente, error: errBusca } = await admin.rpc("auth_user_id_by_email", { p_email: email });
  if (errBusca) throw new Error(`erro ao buscar usuário: ${errBusca.message}`);

  if (existente) {
    const userId = existente as string;
    const envio = await enviarParaUsuario(admin, userId, email);
    return {
      userId,
      nota: envio.enviado
        ? `usuário já existia; e-mail de acesso (${envio.tipo}) enviado`
        : `usuário já existia; e-mail de acesso NÃO enviado (${envio.motivo})`,
    };
  }

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: linkDefinirSenha(),
    data: nome ? { nome } : undefined,
  });
  if (!error && data.user) {
    return { userId: data.user.id, nota: "conta criada e convite 'Defina sua senha' enviado" };
  }

  // O ENVIO falhou (ex.: limite do SMTP padrão): cria a conta sem e-mail.
  let userId: string;
  const { data: criado, error: errCriar } = await admin.auth.admin.createUser({
    email,
    email_confirm: false,
    user_metadata: nome ? { nome } : undefined,
  });
  if (criado?.user) {
    userId = criado.user.id;
  } else {
    // Corrida: outro reenvio pode ter criado o usuário neste meio-tempo.
    const { data: id2 } = await admin.rpc("auth_user_id_by_email", { p_email: email });
    if (!id2) throw new Error(`não foi possível criar o usuário: ${errCriar?.message ?? error?.message}`);
    userId = id2 as string;
  }
  return {
    userId,
    nota:
      `conta criada, mas o e-mail de convite FALHOU (${error?.message ?? "sem detalhe"}). ` +
      "Reenvie em /admin/membros ou peça pra pessoa usar /primeiro-acesso.",
  };
}

export type ResultadoProcessamento =
  | { duplicado: true }
  | { duplicado: false; status: "processado" | "ignorado"; resultado: string }
  | { duplicado: false; status: "erro"; erro: string };

/**
 * Reserva o evento (atômico), aplica e grava o resultado na caixa-preta.
 * Usado pelo webhook e pelo botão "Reprocessar" do admin.
 */
export async function processarRegistro(
  admin: SupabaseClient,
  id: string,
  payload: unknown,
): Promise<ResultadoProcessamento> {
  const { data: reservado, error: errClaim } = await admin.rpc("claim_webhook_event", { p_id: id });
  if (errClaim) throw new Error(`erro ao reservar evento: ${errClaim.message}`);
  if (!reservado) return { duplicado: true };

  try {
    const r = await aplicarEvento(admin, parseKiwify(payload));
    await admin
      .from("webhook_events")
      .update({ status: r.status, resultado: r.resultado, erro: null, processed_at: new Date().toISOString() })
      .eq("id", id);
    return { duplicado: false, ...r };
  } catch (e) {
    const erro = e instanceof Error ? e.message : String(e);
    await admin.from("webhook_events").update({ status: "erro", erro }).eq("id", id);
    return { duplicado: false, status: "erro", erro };
  }
}
