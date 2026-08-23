-- ForgeAI persistence schema. Run in the Supabase SQL editor.
-- Provider secrets should be encrypted before insert; this schema intentionally never stores plaintext keys.

create table if not exists public.provider_credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('nvidia')),
  encrypted_key text not null,
  key_hint text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  model text not null,
  prompt text not null check (char_length(prompt) <= 10000),
  image_path text,
  resolution text not null,
  aspect_ratio text not null,
  seed bigint,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt text not null check (char_length(prompt) <= 10000),
  favorite boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, prompt)
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  default_provider text not null default 'nvidia',
  default_model text not null default 'black-forest-labs/flux.2-klein-4b',
  default_resolution text not null default '1024 × 1024',
  default_aspect_ratio text not null default '1:1',
  theme text not null default 'dark',
  updated_at timestamptz not null default now()
);

alter table public.provider_credentials enable row level security;
alter table public.generations enable row level security;
alter table public.saved_prompts enable row level security;
alter table public.user_settings enable row level security;

create policy "credentials owner access" on public.provider_credentials for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "generations owner access" on public.generations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "saved prompts owner access" on public.saved_prompts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "settings owner access" on public.user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists generations_user_created_at_idx on public.generations(user_id, created_at desc);
create index if not exists saved_prompts_user_created_at_idx on public.saved_prompts(user_id, created_at desc);
