"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { salvarLojaAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { Loja } from "@/lib/types";

/**
 * Reduz a foto no próprio navegador antes do upload (máx. 1000px, WebP).
 * Uma foto de celular de 4 MB vira ~100 KB — a área de membros fica rápida.
 */
async function reduzirFoto(file: File, max = 1000): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * escala);
    const h = Math.round(bitmap.height * escala);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);

    const gerar = (tipo: string, q: number) =>
      new Promise<Blob | null>((ok) => canvas.toBlob(ok, tipo, q));
    let blob = await gerar("image/webp", 0.82);
    if (!blob || blob.type !== "image/webp") blob = await gerar("image/jpeg", 0.85); // navegador sem WebP
    if (!blob) return file;
    const ext = blob.type === "image/webp" ? "webp" : "jpg";
    return new File([blob], `foto.${ext}`, { type: blob.type });
  } catch {
    return file; // formato que o navegador não lê: manda o original
  }
}

export function LojaForm({ loja, faixas }: { loja?: Loja; faixas: number[] }) {
  const [estado, acao] = useActionState(salvarLojaAction, undefined);
  const [preview, setPreview] = useState<string | null>(loja?.foto_url ?? null);
  const [processando, setProcessando] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function aoEscolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const original = e.target.files?.[0];
    if (!original) return;
    setProcessando(true);
    const reduzida = await reduzirFoto(original);
    const dt = new DataTransfer();
    dt.items.add(reduzida);
    if (inputRef.current) inputRef.current.files = dt.files;
    setPreview(URL.createObjectURL(reduzida));
    setInfo(`${(original.size / 1024).toFixed(0)} KB → ${(reduzida.size / 1024).toFixed(0)} KB`);
    setProcessando(false);
  }

  return (
    <form action={acao} className="space-y-5">
      {loja ? <input type="hidden" name="id" value={loja.id} /> : null}

      <div className="card space-y-4">
        <div>
          <label htmlFor="nome" className="label">Nome da loja *</label>
          <input id="nome" name="nome" required defaultValue={loja?.nome} className="input" />
        </div>
        <div>
          <label htmlFor="faixa" className="label">Faixa *</label>
          <select id="faixa" name="faixa" required defaultValue={loja?.faixa ?? ""} className="input">
            <option value="" disabled>Escolha…</option>
            {faixas.map((f) => (
              <option key={f} value={f}>até R${f.toLocaleString("pt-BR")}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="descricao" className="label">Por que indicamos</label>
          <textarea
            id="descricao"
            name="descricao"
            rows={3}
            maxLength={400}
            defaultValue={loja?.descricao ?? ""}
            placeholder="Ex.: Ótimo caimento nos jeans, troca fácil e entrega rápida."
            className="input resize-y"
          />
        </div>
        <div>
          <label htmlFor="tags" className="label">Tags</label>
          <input
            id="tags"
            name="tags"
            defaultValue={loja?.tags.join(", ")}
            placeholder="feminino, plus size, jeans"
            className="input"
          />
          <p className="mt-1 text-xs text-muted">Separe por vírgula. Viram filtros na página da faixa.</p>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-display text-lg font-bold">Onde comprar</h2>
        <div>
          <label htmlFor="site_url" className="label">Site</label>
          <input id="site_url" name="site_url" defaultValue={loja?.site_url ?? ""} placeholder="https://…" className="input" inputMode="url" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="instagram" className="label">Instagram</label>
            <input id="instagram" name="instagram" defaultValue={loja?.instagram ?? ""} placeholder="@loja" className="input" />
          </div>
          <div>
            <label htmlFor="whatsapp" className="label">WhatsApp</label>
            <input id="whatsapp" name="whatsapp" defaultValue={loja?.whatsapp ?? ""} placeholder="(11) 99999-9999" className="input" inputMode="tel" />
          </div>
        </div>
        <div>
          <label htmlFor="endereco" className="label">Endereço (opcional, lojas físicas)</label>
          <input id="endereco" name="endereco" defaultValue={loja?.endereco ?? ""} placeholder="Rua Oriente, 000 — Brás, São Paulo" className="input" />
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-display text-lg font-bold">Foto</h2>
        <div className="flex items-start gap-4">
          <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-surface-2">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Prévia" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <input
              ref={inputRef}
              type="file"
              name="foto"
              accept="image/*"
              onChange={aoEscolherFoto}
              className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-fg file:px-4 file:py-2 file:text-sm file:font-semibold file:text-bg"
            />
            {processando ? <p className="text-xs text-muted">Otimizando a foto…</p> : null}
            {info ? <p className="text-xs text-muted">Foto otimizada: {info}</p> : null}
            {loja?.foto_url ? (
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" name="remover_foto" /> Remover foto atual
              </label>
            ) : null}
          </div>
        </div>
      </div>

      <label className="card flex cursor-pointer items-center gap-3">
        <input type="checkbox" name="ativa" defaultChecked={loja?.ativa ?? true} className="h-5 w-5 accent-[rgb(var(--color-accent))]" />
        <span>
          <span className="font-semibold">Loja ativa</span>
          <span className="block text-sm text-muted">Desmarque pra esconder dos membros sem apagar.</span>
        </span>
      </label>

      {estado?.erro ? <p className="alert-erro" role="alert">{estado.erro}</p> : null}

      <div className="flex gap-2">
        <Link href="/admin/lojas" className="btn-secondary">Cancelar</Link>
        <div className="flex-1">
          {processando ? (
            <button type="button" disabled className="btn-primary w-full opacity-60">Otimizando foto…</button>
          ) : (
            <SubmitButton pendente="Salvando…">{loja ? "Salvar alterações" : "Cadastrar loja"}</SubmitButton>
          )}
        </div>
      </div>
    </form>
  );
}
