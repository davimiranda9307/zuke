/**
 * Validação do webhook da Kiwify.
 *
 * A Kiwify envia o parâmetro `?signature=` na URL: um HMAC-SHA1 (hex) do
 * corpo JSON, usando como chave o TOKEN configurado no webhook.
 *
 * Como esse esquema não está na documentação pública, aceitamos o HMAC
 * calculado sobre o corpo cru OU sobre o JSON re-serializado, e também o
 * token puro em `?token=` (alternativa caso você precise configurar a URL
 * manualmente). Tudo comparado em tempo constante. Sem token configurado,
 * NADA passa.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export type ResultadoAssinatura =
  | { ok: true; metodo: "hmac_raw" | "hmac_json" | "token" }
  | { ok: false; motivo: string };

function iguais(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function hmacSha1(token: string, conteudo: string): string {
  return createHmac("sha1", token).update(conteudo, "utf8").digest("hex");
}

export function validarAssinatura(params: {
  token: string | undefined;
  rawBody: string;
  signature: string | null;
  tokenRecebido: string | null;
}): ResultadoAssinatura {
  const token = params.token?.trim();
  if (!token) return { ok: false, motivo: "KIWIFY_WEBHOOK_TOKEN não configurado" };

  const sig = params.signature?.trim().toLowerCase();
  if (sig) {
    if (iguais(sig, hmacSha1(token, params.rawBody))) return { ok: true, metodo: "hmac_raw" };
    try {
      const reserializado = JSON.stringify(JSON.parse(params.rawBody));
      if (iguais(sig, hmacSha1(token, reserializado))) return { ok: true, metodo: "hmac_json" };
    } catch {
      /* corpo não é JSON: só o HMAC cru vale */
    }
  }

  const recebido = params.tokenRecebido?.trim();
  if (recebido && iguais(recebido, token)) return { ok: true, metodo: "token" };

  return { ok: false, motivo: sig ? "assinatura não confere" : "requisição sem assinatura" };
}
