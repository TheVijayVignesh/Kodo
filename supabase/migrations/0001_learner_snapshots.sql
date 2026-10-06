create table if not exists public.learner_snapshots (
  user_id uuid primary key references auth.users (id) on delete cascade,
  snapshot jsonb not null default '{}'::jsonb
    check (jsonb_typeof(snapshot) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.learner_snapshots enable row level security;

grant select, insert, update on public.learner_snapshots to authenticated;

drop policy if exists "Learners can read their own snapshot" on public.learner_snapshots;
create policy "Learners can read their own snapshot"
  on public.learner_snapshots for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Learners can create their own snapshot" on public.learner_snapshots;
create policy "Learners can create their own snapshot"
  on public.learner_snapshots for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Learners can update their own snapshot" on public.learner_snapshots;
create policy "Learners can update their own snapshot"
  on public.learner_snapshots for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.set_learner_snapshot_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_learner_snapshot_updated_at on public.learner_snapshots;
create trigger set_learner_snapshot_updated_at
  before update on public.learner_snapshots
  for each row execute function public.set_learner_snapshot_updated_at();
