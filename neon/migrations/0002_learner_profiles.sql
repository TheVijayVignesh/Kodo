create table if not exists public.learner_profiles (
  user_id text primary key,
  auth_provider text not null check (auth_provider in ('clerk')),
  email text not null,
  display_name text not null,
  image_url text,
  updated_at timestamptz not null default now()
);

create index if not exists learner_profiles_updated_at_idx
  on public.learner_profiles (updated_at);
