# Zuke — Como colocar a plataforma no ar

Siga **nesta ordem**. Cada passo diz exatamente onde clicar e o que colar.
Tempo total: uns 40 minutos (mais a espera de DNS do domínio de e-mail).

> **Como a plataforma funciona:** a pessoa assina na Kiwify → a Kiwify avisa o
> site (webhook) → o site cria a conta no Supabase e manda o e-mail "Crie sua
> senha" → ela cria a senha e entra em `/app`. Se cancelar, atrasar, pedir
> reembolso ou der chargeback, a Kiwify avisa e o acesso é cortado sozinho.

---

## 1. Criar o projeto no Supabase

1. Entre em https://supabase.com e crie uma conta (pode usar o GitHub).
2. **New project** → nome `zuke` → crie uma senha forte pro banco (guarde num lugar seguro) → região **South America (São Paulo)** → **Create new project**.
3. Espere uns 2 minutos até o projeto ficar pronto.

## 2. Rodar as migrations (criar as tabelas)

1. No menu da esquerda: **SQL Editor** → **New query**.
2. Abra o arquivo [`supabase/migrations/20261009120000_plataforma.sql`](supabase/migrations/20261009120000_plataforma.sql), copie **tudo** e cole no editor.
3. Clique em **Run**. Deve aparecer *"Success. No rows returned"*.
4. *(Opcional)* Pra ver a área de membros com lojas de exemplo, rode também o [`supabase/seed_exemplos.sql`](supabase/seed_exemplos.sql). **Apague-as antes de lançar** (o comando está no topo do arquivo).

Isso cria as tabelas `members`, `lojas`, `webhook_events` e `feedbacks` (todas com Row Level Security ligado), a regra de acesso `has_access()` e o bucket `lojas` pras fotos.

## 3. Configurar o login no Supabase

Em **Authentication**:

1. **Sign In / Providers** → em *User Signups*, **desligue** "Allow new users to sign up".
   (As contas são criadas só pelo sistema, quando alguém paga. Os convites continuam funcionando.)
2. **URL Configuration**:
   - **Site URL**: o endereço final do site, ex. `https://zuke.com.br` (ou o `.vercel.app` por enquanto).
   - **Redirect URLs** → *Add URL*: `http://localhost:3000/**` e `https://SEU-DOMINIO/**`.
3. **Emails** (Templates):
   - **Invite user** → Assunto: `Seu acesso ao Zuke chegou: crie sua senha` → no corpo, cole o conteúdo de [`supabase/templates/convite.html`](supabase/templates/convite.html).
   - **Reset password** → Assunto: `Zuke: crie uma nova senha` → cole [`supabase/templates/recuperacao.html`](supabase/templates/recuperacao.html).
   - Salve cada um.

> Os links dos e-mails usam o **Site URL** do passo 2. Se ele estiver errado, os links quebram.

## 4. Pegar as chaves e configurar as variáveis

No Supabase: **Project Settings → API Keys** (ou **API**). Você vai precisar de:

| Variável | Onde achar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (`https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave **publishable** (`sb_publishable_…`) ou **anon public** |
| `SUPABASE_SERVICE_ROLE_KEY` | chave **secret** (`sb_secret_…`) ou **service_role** — ⚠️ nunca mostre pra ninguém |

As outras:

| Variável | O que colocar |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` no seu computador; o domínio final na Vercel |
| `KIWIFY_WEBHOOK_TOKEN` | você pega no passo 8 (por enquanto invente um texto longo pra testar local) |
| `KIWIFY_PRODUCT_ID` | opcional; deixe vazio se só vende o Zuke na Kiwify |
| `LATE_GRACE_DAYS` | dias de tolerância com pagamento atrasado (padrão `3`) |
| `ADMIN_EMAILS` | seu e-mail (e de sócios), separados por vírgula |

**No seu computador:** copie `.env.example` para `.env.local` e preencha.

**Na Vercel:** Project → **Settings → Environment Variables** → adicione cada uma (marque *Production* e *Preview*). Depois vá em **Deployments → ⋯ → Redeploy** — variável nova só vale depois de um novo deploy.

## 5. Criar o seu usuário de admin

1. Supabase → **Authentication → Users → Add user → Create new user**.
2. Use o **mesmo e-mail** que está em `ADMIN_EMAILS`, crie uma senha e marque **Auto Confirm User**.
3. Entre em `/entrar` com esse e-mail e senha e abra `/admin`. ✅
4. Pra ver também a área de membros: em `/admin/membros` → **Adicionar membro manualmente** com o seu e-mail. (Pode ignorar o e-mail de senha que chegar.)

## 6. Testar o fluxo inteiro no seu computador

Com o `.env.local` preenchido (incluindo um `KIWIFY_WEBHOOK_TOKEN` qualquer):

```bash
npm run dev
```

Em **outro terminal**:

```bash
npm run simular:kiwify
```

O script simula 14 situações (compra, reenvio duplicado, atraso, renovação, cancelamento com e sem data, reembolso, chargeback, assinatura falsa…) e confere no banco, depois de cada uma, o status e se a pessoa tem acesso. No fim deve aparecer **"Fluxo completo funcionando! ✓"**.

- Por padrão ele usa um apelido do seu e-mail de admin (`voce+zukeXXXX@gmail.com`) e apaga o usuário de teste no fim.
- Pra receber o convite de verdade e testar o login: `npm run simular:kiwify -- --email=seuemail@gmail.com`
- **Antes do Resend (passo 7)**, o Supabase só envia 2 e-mails por hora e só pra quem é da equipe do projeto. Então é normal o resultado dizer *"conta criada, mas o e-mail de convite FALHOU"* — o sistema criou a conta mesmo assim, e a pessoa pode pedir o link em `/primeiro-acesso`.

## 7. Configurar o Resend (e-mails de verdade)

O envio padrão do Supabase é só pra teste. Pra mandar e-mail pros clientes:

1. Crie conta em https://resend.com (plano grátis: 3.000 e-mails/mês, 100/dia).
2. **Domains → Add Domain** → digite seu domínio (ex.: `zuke.com.br`).
3. O Resend mostra alguns registros DNS (TXT e MX). Cadastre-os onde o seu domínio está registrado (Registro.br, Cloudflare, Hostinger, Vercel…) e clique em **Verify**. Pode levar de minutos a algumas horas.
4. **API Keys → Create API Key** → permissão *Sending access* → copie a chave (`re_…`).
5. No Supabase: **Authentication → Emails → SMTP Settings** → ative **Enable custom SMTP**:

   | Campo | Valor |
   |---|---|
   | Sender email | `nao-responda@zuke.com.br` (precisa ser do domínio verificado) |
   | Sender name | `Zuke` |
   | Host | `smtp.resend.com` |
   | Port | `465` |
   | Username | `resend` |
   | Password | a chave `re_…` do Resend |

6. **Authentication → Rate Limits** → aumente *"Rate limit for sending emails"* (ex.: 100 por hora).
7. Teste: `/primeiro-acesso` com o e-mail de um membro → o e-mail deve chegar em segundos.

## 8. Cadastrar o webhook na Kiwify

1. Na Kiwify: **Apps → Webhooks → Criar webhook**.
2. Preencha:
   - **Nome:** `Zuke plataforma`
   - **URL:** `https://SEU-DOMINIO/api/webhooks/kiwify`
   - **Produto:** o Zuke
   - **Gatilhos (eventos):** marque
     - Compra aprovada
     - Compra reembolsada
     - Chargeback
     - Assinatura cancelada
     - Assinatura atrasada
     - Assinatura renovada
3. Copie o **Token** que aparece no webhook e cole em `KIWIFY_WEBHOOK_TOKEN` na Vercel (e no `.env.local`). **Redeploy** na Vercel.

## 9. Fazer uma compra de teste

1. Compre o Zuke pelo link da landing com um e-mail seu que **ainda não é membro** (pode ser um apelido: `voce+teste@gmail.com`).
2. Em até 1 minuto:
   - abra `/admin/webhooks` → deve aparecer o evento como **processado**;
   - o e-mail "Crie sua senha" deve chegar.
3. Crie a senha, entre e confira as lojas.
4. Peça o **reembolso** na Kiwify → em `/admin/webhooks` aparece o reembolso e o acesso é cortado. (Assim você testa os dois lados.)

**Depois dessa primeira compra, me mande o payload** que aparece em `/admin/webhooks` (clique no evento). O formato exato do webhook de vendas da Kiwify não está na documentação pública: o sistema já lê de forma tolerante, mas com um payload real eu confirmo o mapeamento e o método de validação (aparece em *"validação: hmac_raw / hmac_json / token"*).

---

## Se algo der errado

| Sintoma | Onde olhar / o que fazer |
|---|---|
| Evento **rejeitado** em `/admin/webhooks` | Token diferente entre Kiwify e Vercel. Confira e faça Redeploy. Depois clique em **Reprocessar** no evento. |
| Evento com **erro** | Leia a mensagem no evento. Corrija e clique em **Reprocessar**. |
| Pessoa pagou e não recebeu e-mail | `/admin/membros` → busque o e-mail → **Reenviar e-mail de acesso**. Ou ela mesma usa `/primeiro-acesso`. |
| Pessoa comprou com e-mail errado | `/admin/membros` → **Corrigir e-mail**. |
| Link do e-mail não abre | Confira o **Site URL** e as **Redirect URLs** do passo 3. |
| Quer dar acesso de cortesia | `/admin/membros` → **Adicionar membro manualmente**. |

## Regras de acesso (resumo)

| Situação | Tem acesso? |
|---|---|
| Ativa | Sim |
| Pagamento atrasado | Sim, por `LATE_GRACE_DAYS` dias (com aviso "atualize seu pagamento") |
| Cancelada | Sim, até o fim do período pago, se a Kiwify informar a data; senão, não |
| Reembolsada / Chargeback | Não, na hora |
| Liberado manualmente no admin | Sim, sempre |
| Bloqueado manualmente no admin | Não, nunca |

Tudo isso vive numa única função do banco, `has_access()`, usada tanto pela segurança do banco (RLS) quanto pela proteção das páginas.
