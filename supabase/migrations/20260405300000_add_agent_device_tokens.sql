-- Agent device tokens for push notifications (React Native / Expo)
create table public.agent_device_tokens (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  token         text not null,
  platform      text not null check (platform in ('ios', 'android')),
  chatbot_ids   text[],           -- null = all chatbots for this user
  is_active     boolean not null default true,
  quiet_hours   jsonb,            -- {"enabled":true,"start":"22:00","end":"07:00","timezone":"America/New_York"}
  last_used_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, token)
);

create index idx_agent_device_tokens_user_active
  on public.agent_device_tokens(user_id, is_active)
  where is_active = true;

-- RLS
alter table public.agent_device_tokens enable row level security;

create policy "Users can view own device tokens"
  on public.agent_device_tokens for select
  using (auth.uid() = user_id);

create policy "Users can insert own device tokens"
  on public.agent_device_tokens for insert
  with check (auth.uid() = user_id);

create policy "Users can update own device tokens"
  on public.agent_device_tokens for update
  using (auth.uid() = user_id);

create policy "Users can delete own device tokens"
  on public.agent_device_tokens for delete
  using (auth.uid() = user_id);

create policy "Service role full access"
  on public.agent_device_tokens for all
  using (auth.role() = 'service_role');

-- updated_at trigger (function already exists from prior migrations)
create trigger agent_device_tokens_set_updated_at
  before update on public.agent_device_tokens
  for each row
  execute function public.set_updated_at();
