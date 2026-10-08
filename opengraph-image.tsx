import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/* Gera a imagem de compartilhamento (WhatsApp, Instagram, etc.) em PNG,
   sem precisar subir nenhum arquivo. Se mudar a cor da marca no globals.css,
   atualize ACCENT aqui também para a prévia combinar. */
export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#ff4e2b";
const INK = "#121212";
const BG = "#ffffff";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            Z
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: INK }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              color: INK,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 980,
            }}
          >
            Pare de perder horas procurando loja no Google.
          </div>
          <div style={{ fontSize: 34, color: "#55555a", maxWidth: 940 }}>
            As melhores lojas de roupa, separadas por quanto você quer gastar —
            de R$100 a R$1.000.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              background: INK,
              color: "#fff",
              fontSize: 30,
              fontWeight: 700,
              padding: "14px 28px",
              borderRadius: 999,
            }}
          >
            {siteConfig.price.full}
          </div>
          <div style={{ fontSize: 28, color: "#55555a" }}>
            Acesso web · cancele quando quiser
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
