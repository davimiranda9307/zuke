-- =============================================================
--  ZUKE — schema da plataforma
-- =============================================================
--  Rode este arquivo UMA vez no SQL Editor do Supabase
--  (ou com `supabase db push`, se usar a CLI).
--
--  Regras de segurança:
--  - Row Level Security ligado em TODAS as tabelas.
--  - A regra "essa pessoa tem acesso?" vive só em public.has_access().
--    Ela é usada no RLS e também na proteção das páginas (via RPC).
--  - Só o servidor (service_role) escreve em members e webhook_events.
--  - E-mails são sempre salvos em minúsculo (garantido por constraint).
-- =============================================================


-- -------------------------------------------------------------
-- Utilitário: mantém updated_at em dia
-- -------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- -------------------------------------------------------------
-- members — quem assinou
-- -------------------------------------------------------------
create table public.members (
  id                      uuid primary key references auth.users (id) on delete cascade,
  email                   text not null unique check (email = lower(btrim(email))),
  nome                    text,
  status                  text not null default 'ativa'
                          check (status in ('ativa', 'atrasada', 'cancelada', 'reembolsada', 'chargeback')),
  -- Override manual do admin. null = segue o status da Kiwify.
  acesso_manual           text check (acesso_manual in ('liberado', 'bloqueado')),
  -- Fim do período pago, quando a Kiwify informa (usado no cancelamento).
  periodo_pago_ate        timestamptz,
  -- Fim da tolerância de pagamento atrasado.
  tolerancia_ate          timestamptz,
  kiwify_subscription_id  text,
  kiwify_order_id         text,
  ultimo_evento           text,
  ultimo_evento_em        timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index members_subscription_idx on public.members (kiwify_subscription_id);
create index members_status_idx on public.members (status);

create trigger members_set_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();


-- -------------------------------------------------------------
-- has_access — A ÚNICA regra de acesso do sistema
-- -------------------------------------------------------------
--  liberado manualmente ............ sim
--  bloqueado manualmente ........... não
--  ativa ........................... sim
--  atrasada ........................ sim, até o fim da tolerância
--  cancelada ....................... sim, até o fim do período pago (se informado)
--  reembolsada / chargeback ........ não
create or replace function public.has_access(p_uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select case
      when m.acesso_manual = 'bloqueado' then false
      when m.acesso_manual = 'liberado'  then true
      when m.status = 'ativa'            then true
      when m.status = 'atrasada'         then coalesce(m.tolerancia_ate > now(), false)
      when m.status = 'cancelada'        then coalesce(m.periodo_pago_ate > now(), false)
      else false
    end
    from public.members m
    where m.id = p_uid
  ), false);
$$;

-- Coluna calculada pro painel admin: select('*, tem_acesso').
-- Apenas delega pra has_access (a regra continua num lugar só).
create or replace function public.tem_acesso(m public.members)
returns boolean
language sql
stable
set search_path = ''
as $$
  select public.has_access(m.id);
$$;


-- -------------------------------------------------------------
-- lojas — a curadoria
-- -------------------------------------------------------------
create table public.lojas (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null check (length(btrim(nome)) > 0),
  faixa       integer not null check (faixa between 100 and 1000 and faixa % 100 = 0),
  descricao   text,          -- por que indicamos
  foto_url    text,
  site_url    text,
  instagram   text,
  whatsapp    text,
  endereco    text,          -- opcional, pra lojas físicas do Brás
  tags        text[] not null default '{}',
  ativa       boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index lojas_faixa_idx   on public.lojas (faixa) where ativa;
create index lojas_recentes_idx on public.lojas (created_at desc) where ativa;
create index lojas_tags_idx    on public.lojas using gin (tags);

create trigger lojas_set_updated_at
  before update on public.lojas
  for each row execute function public.set_updated_at();


-- -------------------------------------------------------------
-- webhook_events — a caixa-preta (guarda TODO webhook recebido)
-- -------------------------------------------------------------
create table public.webhook_events (
  id                 uuid primary key default gen_random_uuid(),
  provider           text not null default 'kiwify',
  event_type         text,          -- como veio no payload
  evento             text,          -- normalizado: aprovada, renovada, atrasada...
  email              text,
  order_id           text,
  subscription_id    text,
  dedupe_key         text not null unique,
  assinatura_ok      boolean not null default false,
  assinatura_metodo  text,          -- como a assinatura foi validada (diagnóstico)
  status             text not null default 'recebido'
                     check (status in ('recebido', 'processando', 'processado', 'ignorado', 'erro', 'rejeitado')),
  resultado          text,          -- o que o sistema fez
  erro               text,
  tentativas         integer not null default 0,
  payload            jsonb,
  raw_body           text,
  processed_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index webhook_events_created_idx on public.webhook_events (created_at desc);
create index webhook_events_status_idx  on public.webhook_events (status);
create index webhook_events_email_idx   on public.webhook_events (email);

create trigger webhook_events_set_updated_at
  before update on public.webhook_events
  for each row execute function public.set_updated_at();

-- Reserva um evento pra processamento, de forma atômica.
-- Garante que dois reenvios simultâneos não processem o mesmo evento.
create or replace function public.claim_webhook_event(p_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ok boolean;
begin
  update public.webhook_events
     set status = 'processando',
         tentativas = tentativas + 1
   where id = p_id
     and (
       status in ('recebido', 'erro')
       or (status = 'processando' and updated_at < now() - interval '2 minutes')
     )
  returning true into v_ok;

  return coalesce(v_ok, false);
end;
$$;


-- -------------------------------------------------------------
-- feedbacks — sugestões e problemas reportados pelos membros
-- -------------------------------------------------------------
create table public.feedbacks (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid references public.members (id) on delete set null,
  email       text,
  tipo        text not null check (tipo in ('sugerir_loja', 'link_quebrado', 'outro')),
  mensagem    text not null check (length(btrim(mensagem)) between 1 and 2000),
  pagina      text,
  resolvido   boolean not null default false,
  created_at  timestamptz not null default now()
);

create index feedbacks_abertos_idx on public.feedbacks (created_at desc) where not resolvido;


-- -------------------------------------------------------------
-- Busca o id do usuário do Auth pelo e-mail (só o servidor usa)
-- -------------------------------------------------------------
create or replace function public.auth_user_id_by_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select u.id
    from auth.users u
   where lower(u.email) = lower(btrim(p_email))
   limit 1;
$$;


-- -------------------------------------------------------------
-- Permissões das funções
-- -------------------------------------------------------------
revoke all on function public.claim_webhook_event(uuid)    from public, anon, authenticated;
revoke all on function public.auth_user_id_by_email(text)  from public, anon, authenticated;
grant execute on function public.claim_webhook_event(uuid)   to service_role;
grant execute on function public.auth_user_id_by_email(text) to service_role;

revoke all on function public.has_access(uuid) from public, anon;
grant execute on function public.has_access(uuid) to authenticated, service_role;


-- -------------------------------------------------------------
-- Row Level Security — ligado em TODAS as tabelas
-- -------------------------------------------------------------
alter table public.members        enable row level security;
alter table public.lojas          enable row level security;
alter table public.webhook_events enable row level security;
alter table public.feedbacks      enable row level security;

-- members: cada pessoa lê só a própria linha. Ninguém escreve pelo app
-- (sem policy de insert/update/delete => só o service_role escreve).
create policy "members: le a propria linha"
  on public.members for select
  to authenticated
  using (id = (select auth.uid()));

-- lojas: só quem tem acesso lê, e só as ativas.
create policy "lojas: membros com acesso leem as ativas"
  on public.lojas for select
  to authenticated
  using (ativa and (select public.has_access()));

-- feedbacks: membro com acesso envia e vê os próprios.
create policy "feedbacks: membro envia"
  on public.feedbacks for insert
  to authenticated
  with check (member_id = (select auth.uid()) and (select public.has_access()));

create policy "feedbacks: membro ve os proprios"
  on public.feedbacks for select
  to authenticated
  using (member_id = (select auth.uid()));

-- webhook_events: nenhuma policy => inacessível pelo app. Só o servidor.
revoke all on table public.webhook_events from anon, authenticated;


-- -------------------------------------------------------------
-- Storage: bucket público pras fotos das lojas
-- (leitura pública pela URL; upload só pelo servidor/admin)
-- -------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lojas', 'lojas', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
