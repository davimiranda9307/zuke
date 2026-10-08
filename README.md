# Zuke — Landing Page

Landing page do **Zuke**: plataforma de assinatura com curadoria de lojas de roupa,
organizadas por faixa de preço (de R$100 a R$1.000), por R$19,90/mês.

Feita com **Next.js (App Router) + TypeScript + Tailwind CSS**, pronta pra subir na **Vercel**.

---

## 🚀 Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

Outros comandos:

```bash
npm run build   # build de produção
npm start       # roda o build de produção
npm run lint    # checa o código
```

---

## ⚙️ O que você precisa preencher

Quase tudo fica em **um arquivo só**: [`src/config/site.ts`](src/config/site.ts).
Abra ele e procure por `PREENCHER`. Itens principais:

| O quê | Onde | Observação |
|---|---|---|
| **Link do checkout (Kiwify)** | `checkoutUrl` | Todos os botões "Assinar" levam pra cá. |
| **Pixel da Meta** | `metaPixelId` | Deixe `""` pra não carregar. Preencha só com os números do ID. |
| **Instagram / TikTok** | `social` | Deixe `""` pra esconder o link. |
| **E-mail / WhatsApp de contato** | `contact` | |
| **Razão social + CNPJ** | `company` | Aparece no rodapé e nas páginas legais. |
| **Domínio final** | `url` | Troque depois de publicar (ex.: `https://zuke.com.br`). |
| **Vídeo do hero (VSL)** | `heroVideoUrl` | Deixe `""` para espaço reservado; cole o embed quando tiver. |
| **Preço / nome / faixas** | demais campos | Já preenchidos; mude se precisar. |

Outros pontos de conteúdo:

- **Vídeo do hero (VSL):** `heroVideoUrl` em [`src/config/site.ts`](src/config/site.ts) — deixe `""` para mostrar um espaço reservado, ou cole o embed do seu vídeo de apresentação.
- **Vídeos do "Descobrindo fornecedores":** [`src/components/DescobrindoBras.tsx`](src/components/DescobrindoBras.tsx) — cole a URL de embed dos 3 Reels/TikToks no array `videos`.
- **Números da curadoria:** [`src/components/AuthorityStats.tsx`](src/components/AuthorityStats.tsx) — **escondido** até você ter números reais (ex.: lojas visitadas). Preencha o array e a faixa aparece sozinha. Nada inventado.
- **Depoimentos:** [`src/components/Testimonials.tsx`](src/components/Testimonials.tsx) — já está pronta, mas **escondida** até você ter depoimentos reais. Preencha o array e a seção aparece sozinha.
- **Textos `[CONFIRMAR]`:** aparecem no FAQ ([`src/components/FAQ.tsx`](src/components/FAQ.tsx)), no bloco de garantia ([`src/components/Guarantee.tsx`](src/components/Guarantee.tsx)) e nas páginas legais ([`/termos`](src/app/termos/page.tsx) e [`/privacidade`](src/app/privacidade/page.tsx)). São trechos que dependem de uma decisão sua.

---

## 🎨 Trocar a identidade visual (cores e fontes)

A identidade ainda não está definida. Tudo está em variáveis:

- **Cores:** [`src/app/globals.css`](src/app/globals.css), bloco `:root`. As cores estão em canais RGB (ex.: `255 78 43`), o que permite transparências. A cor da marca é `--color-accent` (muda os botões e destaques).
- **Fontes:** [`src/app/layout.tsx`](src/app/layout.tsx), via `next/font`. Hoje: *Bricolage Grotesque* (títulos) + *Inter* (texto).
- **Ícone/favicon:** [`src/app/icon.svg`](src/app/icon.svg) (cor fixa em hex — atualize junto se trocar a marca).

---

## ☁️ Como subir na Vercel (pelo GitHub)

**1. Suba o projeto pro GitHub**

Na pasta do projeto:

```bash
git init
git add .
git commit -m "Zuke landing page"
```

Crie um repositório **vazio** no GitHub (sem README). Depois:

```bash
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/zuke.git
git push -u origin main
```

**2. Importe na Vercel**

1. Entre em https://vercel.com e faça login com o GitHub.
2. Clique em **Add New… → Project**.
3. Selecione o repositório `zuke` e clique em **Import**.
4. A Vercel detecta o Next.js sozinho. Não precisa mudar nada (Build e Output já vêm certos).
5. Clique em **Deploy** e espere ~1 minuto.

**3. Pronto**

A Vercel te dá uma URL (ex.: `zuke.vercel.app`). A partir daí, **todo push pro `main` publica sozinho**.

**4. (Opcional) Domínio próprio**

Em **Settings → Domains**, adicione seu domínio (ex.: `zuke.com.br`) e siga as instruções de DNS.
Depois, atualize `url` em `src/config/site.ts` com o domínio final.

> Não precisa configurar variáveis de ambiente agora. O arquivo `.env.example`
> é só um mapa do que será usado nas próximas fases.

---

## 🧱 Estrutura (pensada pra crescer)

```
src/
  app/
    page.tsx            # a landing (monta as seções na ordem)
    layout.tsx          # fontes, SEO/OpenGraph, Pixel, cookies
    globals.css         # tokens de cor (identidade visual)
    opengraph-image.tsx # imagem de compartilhamento (gerada automática)
    termos/             # /termos (texto provisório)
    privacidade/        # /privacidade (texto provisório)
    robots.ts, sitemap.ts
  components/           # Header, Hero, Pricing, FAQ, etc.
  config/
    site.ts             # 👈 tudo que você troca fica aqui
  lib/
    checkout.ts         # monta o link do checkout com as UTMs
    analytics.ts        # eventos do Pixel (PageView, InitiateCheckout)
```

### Ordem dos blocos (estrutura de página de vendas)

A página segue a estrutura do blueprint da análise, adaptada pro Zuke:

1. Header fixo (CTA → oferta)
2. Hero + vídeo (VSL) — fundo escuro
3. Por que o Zuke (6 diferenciais)
4. Comparativo: Grupo de WhatsApp × Zuke
5. Como funciona (3 passos)
6. O que tem dentro / as faixas (R$100–R$1.000)
7. Para quem é (abas de perfil)
8. Descobrindo fornecedores — curadoria (fundo escuro)
9. Prova social / depoimentos (escondida até ter material real)
10. Oferta (#oferta) — **único botão que leva ao checkout**
11. Garantia
12. FAQ
13. CTA final + rodapé

Todos os botões "Assinar" internos **rolam até a oferta**; só o botão da caixa
de oferta vai pro checkout da Kiwify — assim ninguém paga sem ver preço e garantia.

### Próximas fases (ainda **não** implementadas)

O projeto já está organizado pra receber, **no mesmo repositório**:

- **Login + banco** com Supabase.
- **Área de membros** em `/app`.
- **Webhook da Kiwify** (ex.: `/api/webhooks/kiwify`) que libera o acesso de quem pagou.

As variáveis dessas fases já estão mapeadas em [`.env.example`](.env.example).

---

## ✅ Já incluído

- Mobile-first + barra fixa de "Assinar" no celular depois do hero.
- Botões de assinar repassando **UTMs** pro checkout.
- **Pixel da Meta** opcional (PageView + InitiateCheckout).
- Aviso de **cookies (LGPD)**.
- **SEO + Open Graph** (prévia bonita no WhatsApp/Instagram).
- Página leve: sem imagens pesadas, sem bibliotecas desnecessárias.
- Sem depoimento, número ou escassez inventados.
