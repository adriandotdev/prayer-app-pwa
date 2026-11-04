-- Link a Rosary session to the intention it was prayed for (optional).
-- Deleting an intention keeps the session and just unlinks it.
alter table public.rosary_sessions
  add column intention_id uuid references public.intentions(id) on delete set null;

create index rosary_sessions_intention_idx
  on public.rosary_sessions (intention_id)
  where intention_id is not null;

-- A session may only point at one of the user's own intentions.
drop policy "rosary_sessions_insert_own" on public.rosary_sessions;
create policy "rosary_sessions_insert_own" on public.rosary_sessions
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (
      intention_id is null
      or exists (
        select 1 from public.intentions i
        where i.id = intention_id and i.user_id = (select auth.uid())
      )
    )
  );
