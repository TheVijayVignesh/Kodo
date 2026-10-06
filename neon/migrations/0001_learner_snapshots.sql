create table if not exists public.learner_snapshots (
  user_id text primary key,
  snapshot jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists learner_snapshots_updated_at_idx
  on public.learner_snapshots (updated_at);
