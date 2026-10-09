# Zuke — Landing page + plataforma

**Zuke**: plataforma de assinatura com curadoria de lojas de roupa,
organizadas por faixa de preço (de R$100 a R$1.000), por R$19,90/mês.

Feita com **Next.js (App Router) + TypeScript + Tailwind CSS + Supabase**, pronta pra subir na **Vercel**.

> 👉 **Pra colocar a plataforma no ar** (Supabase, Resend, webhook da Kiwify e
> compra de teste), siga o passo a passo em **[PLATAFORMA.md](PLATAFORMA.md)**.

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

## 🧱 Estrutura

```
src/
  app/
    page.tsx            # a landing (monta as seções na ordem)
    layout.tsx          # fontes, SEO/OpenGraph, Pixel, cookies
    globals.css         # tokens de cor (identidade visual)
    termos/ privacidade/
    (auth)/             # /entrar, /primeiro-acesso, /esqueci-senha, /definir-senha
    app/                # área de membros (protegida): início, /faixa/[valor], /conta
    admin/              # painel admin: lojas, membros, webhooks, feedbacks
    sem-acesso/         # pra quem está logado mas sem assinatura ativa
    auth/               # callback dos links de e-mail e logout
    api/webhooks/kiwify # recebe os avisos da Kiwify
  components/           # blocos da landing + app/ + admin/ + ui/
  config/site.ts        # 👈 nome, preço, checkout, Pixel, contatos
  lib/
    kiwify/             # leitura do payload, regras de acesso, assinatura, processamento
    supabase/           # clientes do Supabase (sessão / servidor)
    auth.ts             # quem está logado, exige membro, exige admin
  middleware.ts         # protege /app e /admin (a landing não passa por ele)
supabase/
  migrations/           # SQL do banco (tabelas, RLS, has_access)
  templates/            # e-mails em português (convite, recuperação)
  seed_exemplos.sql     # lojas fictícias opcionais pra teste
scripts/
  simular-kiwify.mjs    # simula todos os eventos da Kiwify (npm run simular:kiwify)
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

### Plataforma

- **Login** com e-mail e senha (Supabase Auth), sem app pra baixar.
- **Área de membros** `/app`: faixas de preço, novidades da semana, busca e filtro por tags.
- **Webhook da Kiwify** que cria a conta de quem pagou e corta o acesso de quem cancelou,
  atrasou, foi reembolsado ou deu chargeback — idempotente e com caixa-preta de eventos.
- **Painel admin** `/admin` (só e-mails em `ADMIN_EMAILS`).

Variáveis de ambiente documentadas em [`.env.example`](.env.example).
Passo a passo completo em **[PLATAFORMA.md](PLATAFORMA.md)**.

---

## ✅ Já incluído

- Mobile-first + barra fixa de "Assinar" no celular depois do hero.
- Botões de assinar repassando **UTMs** pro checkout.
- **Pixel da Meta** opcional (PageView + InitiateCheckout).
- Aviso de **cookies (LGPD)**.
- **SEO + Open Graph** (prévia bonita no WhatsApp/Instagram).
- Página leve: sem imagens pesadas, sem bibliotecas desnecessárias.
- Sem depoimento, número ou escassez inventados.
