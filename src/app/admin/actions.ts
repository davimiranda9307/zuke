"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { exigirAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { enviarParaUsuario } from "@/lib/access-email";
import { garantirUsuarioAuth, processarRegistro } from "@/lib/kiwify/process";
import { normalizarEmail } from "@/lib/kiwify/parse";
import { linkSite, normalizarTags } from "@/lib/format";

// IMPORTANTE: toda action começa com exigirAdmin(). Server actions são
// endpoints públicos — a checagem precisa estar aqui, não só na página.

const BUCKET = "lojas";
const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];

function voltar(caminho: string, tipo: "ok" | "erro", msg: string): never {
  const sep = caminho.includes("?") ? "&" : "?";
  redirect(`${caminho}${sep}${tipo}=${encodeURIComponent(msg)}`);
}

function texto(formData: FormData, campo: string): string | null {
  const v = String(formData.get(campo) ?? "").trim();
  return v ? v : null;
}

/** Extrai o caminho do arquivo no bucket a partir da URL pública. */
function caminhoNoBucket(url: string | null): string | null {
  if (!url) return null;
  const marcador = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marcador);
  return i >= 0 ? decodeURIComponent(url.slice(i + marcador.length)) : null;
}

// ------------------------------------------------------------------
// LOJAS
// ------------------------------------------------------------------

export type EstadoLoja = { erro?: string } | undefined;

export async function salvarLojaAction(_: EstadoLoja, formData: FormData): Promise<EstadoLoja> {
  await exigirAdmin();
  const admin = createAdminClient();

  const id = texto(formData, "id");
  const nome = texto(formData, "nome");
  const faixa = Number(formData.get("faixa"));
  const siteBruto = texto(formData, "site_url");

  if (!nome) return { erro: "Informe o nome da loja." };
  if (!siteConfig.priceTiers.includes(faixa)) return { erro: "Escolha uma faixa válida." };
  const site_url = siteBruto ? linkSite(siteBruto) : null;
  if (siteBruto && !site_url) return { erro: "O link do site não parece válido." };

  const dados: Record<string, unknown> = {
    nome,
    faixa,
    descricao: texto(formData, "descricao"),
    site_url,
    instagram: texto(formData, "instagram"),
    whatsapp: texto(formData, "whatsapp"),
    endereco: texto(formData, "endereco"),
    tags: normalizarTags(String(formData.get("tags") ?? "")),
    ativa: formData.get("ativa") === "on",
  };

  let fotoAntiga: string | null = null;
  if (id) {
    const { data } = await admin.from("lojas").select("foto_url").eq("id", id).maybeSingle<{ foto_url: string | null }>();
    fotoAntiga = data?.foto_url ?? null;
  }

  // --- foto ---
  const foto = formData.get("foto");
  if (foto instanceof File && foto.size > 0) {
    if (!TIPOS_FOTO.includes(foto.type)) return { erro: "A foto precisa ser JPG, PNG ou WebP." };
    if (foto.size > 5 * 1024 * 1024) return { erro: "A foto passou de 5 MB." };
    const ext = foto.type === "image/png" ? "png" : foto.type === "image/jpeg" ? "jpg" : "webp";
    const caminho = `${randomUUID()}.${ext}`;
    const { error } = await admin.storage
      .from(BUCKET)
      .upload(caminho, foto, { contentType: foto.type, cacheControl: "31536000", upsert: false });
    if (error) return { erro: `Falha no upload da foto: ${error.message}` };
    dados.foto_url = admin.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl;
  } else if (formData.get("remover_foto") === "on") {
    dados.foto_url = null;
  }

  const { error } = id
    ? await admin.from("lojas").update(dados).eq("id", id)
    : await admin.from("lojas").insert(dados);
  if (error) return { erro: `Não foi possível salvar: ${error.message}` };

  // Apaga a foto antiga do Storage se ela foi trocada/removida.
  if ("foto_url" in dados && fotoAntiga && fotoAntiga !== dados.foto_url) {
    const antigo = caminhoNoBucket(fotoAntiga);
    if (antigo) await admin.storage.from(BUCKET).remove([antigo]);
  }

  voltar("/admin/lojas", "ok", id ? `“${nome}” atualizada.` : `“${nome}” cadastrada.`);
}

export async function alternarLojaAction(formData: FormData) {
  await exigirAdmin();
  const id = texto(formData, "id");
  const ativa = formData.get("ativa") === "true";
  const volta = texto(formData, "volta") ?? "/admin/lojas";
  if (!id) voltar(volta, "erro", "Loja não informada.");
  const { error } = await createAdminClient().from("lojas").update({ ativa: !ativa }).eq("id", id);
  if (error) voltar(volta, "erro", error.message);
  voltar(volta, "ok", ativa ? "Loja desativada." : "Loja ativada.");
}

// ------------------------------------------------------------------
// MEMBROS
// ------------------------------------------------------------------

function voltaMembros(formData: FormData) {
  const q = texto(formData, "q");
  return q ? `/admin/membros?q=${encodeURIComponent(q)}` : "/admin/membros";
}

export async function definirAcessoManualAction(formData: FormData) {
  await exigirAdmin();
  const id = texto(formData, "id");
  const valor = texto(formData, "valor"); // "liberado" | "bloqueado" | "kiwify"
  const volta = voltaMembros(formData);
  if (!id || !valor || !["liberado", "bloqueado", "kiwify"].includes(valor)) voltar(volta, "erro", "Ação inválida.");

  const { error } = await createAdminClient()
    .from("members")
    .update({ acesso_manual: valor === "kiwify" ? null : valor })
    .eq("id", id);
  if (error) voltar(volta, "erro", error.message);
  const msg = valor === "liberado" ? "Acesso liberado manualmente." : valor === "bloqueado" ? "Acesso bloqueado manualmente." : "Voltou a seguir o status da Kiwify.";
  voltar(volta, "ok", msg);
}

export async function reenviarAcessoAction(formData: FormData) {
  await exigirAdmin();
  const id = texto(formData, "id");
  const volta = voltaMembros(formData);
  const admin = createAdminClient();
  const { data: m } = await admin.from("members").select("id, email").eq("id", id ?? "").maybeSingle<{ id: string; email: string }>();
  if (!m) voltar(volta, "erro", "Membro não encontrado.");

  const r = await enviarParaUsuario(admin, m.id, m.email);
  if (!r.enviado) voltar(volta, "erro", `Não foi possível enviar: ${r.motivo}`);
  voltar(volta, "ok", `E-mail de ${r.tipo === "convite" ? "convite" : "recuperação"} enviado pra ${m.email}.`);
}

export async function corrigirEmailAction(formData: FormData) {
  await exigirAdmin();
  const id = texto(formData, "id");
  const novo = normalizarEmail(texto(formData, "email"));
  const volta = voltaMembros(formData);
  if (!id || !novo) voltar(volta, "erro", "Informe um e-mail válido.");

  const admin = createAdminClient();
  const { data: outro } = await admin.from("members").select("id").eq("email", novo).neq("id", id).maybeSingle();
  if (outro) voltar(volta, "erro", `Já existe um membro com ${novo}.`);

  const { error: errAuth } = await admin.auth.admin.updateUserById(id, { email: novo, email_confirm: true });
  if (errAuth) voltar(volta, "erro", `Erro no Auth: ${errAuth.message}`);

  const { error } = await admin.from("members").update({ email: novo }).eq("id", id);
  if (error) voltar(volta, "erro", error.message);
  voltar(`/admin/membros?q=${encodeURIComponent(novo)}`, "ok", `E-mail corrigido pra ${novo}.`);
}

export async function adicionarMembroAction(formData: FormData) {
  await exigirAdmin();
  const email = normalizarEmail(texto(formData, "email"));
  const nome = texto(formData, "nome");
  if (!email) voltar("/admin/membros", "erro", "Informe um e-mail válido.");

  const admin = createAdminClient();
  const { data: existe } = await admin.from("members").select("id").eq("email", email).maybeSingle<{ id: string }>();
  if (existe) {
    await admin.from("members").update({ acesso_manual: "liberado" }).eq("id", existe.id);
    voltar(`/admin/membros?q=${encodeURIComponent(email)}`, "ok", "Já era membro: acesso liberado manualmente.");
  }

  let nota: string;
  try {
    const r = await garantirUsuarioAuth(admin, email, nome);
    const { error } = await admin.from("members").upsert(
      { id: r.userId, email, nome, status: "ativa", acesso_manual: "liberado" },
      { onConflict: "id" },
    );
    if (error) throw new Error(error.message);
    nota = r.nota;
  } catch (e) {
    voltar("/admin/membros", "erro", e instanceof Error ? e.message : String(e));
  }
  voltar(`/admin/membros?q=${encodeURIComponent(email)}`, "ok", `Membro adicionado (${nota}).`);
}

// ------------------------------------------------------------------
// WEBHOOKS
// ------------------------------------------------------------------

export async function reprocessarWebhookAction(formData: FormData) {
  await exigirAdmin();
  const id = texto(formData, "id");
  const volta = texto(formData, "volta") ?? "/admin/webhooks";
  const admin = createAdminClient();

  const { data: ev } = await admin
    .from("webhook_events")
    .select("id, payload, status")
    .eq("id", id ?? "")
    .maybeSingle<{ id: string; payload: unknown; status: string }>();
  if (!ev || ev.payload === null) voltar(volta, "erro", "Evento sem payload pra reprocessar.");
  if (ev.status === "processando") voltar(volta, "erro", "Esse evento está sendo processado agora.");

  await admin.from("webhook_events").update({ status: "recebido", erro: null }).eq("id", ev.id);
  const r = await processarRegistro(admin, ev.id, ev.payload);
  if (r.duplicado) voltar(volta, "erro", "Não foi possível reservar o evento.");
  if (r.status === "erro") voltar(volta, "erro", `Falhou de novo: ${r.erro}`);
  voltar(volta, "ok", `Reprocessado: ${r.resultado}`);
}

// ------------------------------------------------------------------
// FEEDBACKS
// ------------------------------------------------------------------

export async function alternarFeedbackAction(formData: FormData) {
  await exigirAdmin();
  const id = texto(formData, "id");
  const resolvido = formData.get("resolvido") === "true";
  const volta = texto(formData, "volta") ?? "/admin/feedbacks";
  const { error } = await createAdminClient().from("feedbacks").update({ resolvido: !resolvido }).eq("id", id ?? "");
  if (error) voltar(volta, "erro", error.message);
  voltar(volta, "ok", resolvido ? "Reaberto." : "Marcado como resolvido.");
}
