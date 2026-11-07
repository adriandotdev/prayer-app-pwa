-- Read-only public share links for a user's own prayer or collection.
-- One link per item: stopping a share deletes the row, and sharing again mints a new token.
-- Anonymous readers never touch the table: they call the two security-definer functions below,
-- which look up a single token and return an allowlist of columns (no user_id, no other rows).

create table public.shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- 32 hex characters from a v4 uuid: 122 random bits, not guessable or enumerable.
  token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  prayer_id uuid references public.prayers (id) on delete cascade,
  collection_id uuid references public.collections (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint shares_one_target check (num_nonnulls(prayer_id, collection_id) = 1),
  constraint shares_token_format check (token ~ '^[0-9a-f]{32}$'),
  constraint shares_prayer_unique unique (prayer_id),
  constraint shares_collection_unique unique (collection_id)
);

create index shares_user_id_idx on public.shares (user_id);

alter table public.shares enable row level security;

create policy "shares_select_own" on public.shares
  for select to authenticated using (user_id = (select auth.uid()));

-- Only your own prayers and collections can be shared. Starter prayers are already public.
create policy "shares_insert_own" on public.shares
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (
      (prayer_id is not null and exists (
        select 1 from public.prayers p where p.id = prayer_id and p.user_id = (select auth.uid())
      ))
      or (collection_id is not null and exists (
        select 1 from public.collections c where c.id = collection_id and c.user_id = (select auth.uid())
      ))
    )
  );

create policy "shares_delete_own" on public.shares
  for delete to authenticated using (user_id = (select auth.uid()));

-- At most 200 live links per user (see the row_caps migration).
create trigger shares_row_cap before insert on public.shares
  for each row execute function public.enforce_row_cap(200);

-- A shared prayer, by token. Returns nothing for an unknown token.
create function public.get_shared_prayer(p_token text)
returns table (title text, body text, source text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.title, p.body, p.source
  from public.shares s
  join public.prayers p on p.id = s.prayer_id
  where s.token = p_token;
$$;

-- A shared collection, by token: one row per prayer, in the collection's order. An empty
-- collection comes back as a single row with null prayer columns, so it still resolves.
create function public.get_shared_collection(p_token text)
returns table (collection_name text, prayer_id uuid, title text, body text, source text)
language sql
stable
security definer
set search_path = ''
as $$
  select c.name, p.id, p.title, p.body, p.source
  from public.shares s
  join public.collections c on c.id = s.collection_id
  left join public.collection_prayers cp on cp.collection_id = c.id
  left join public.prayers p on p.id = cp.prayer_id
  where s.token = p_token
  order by cp.sort_order, p.title;
$$;

revoke all on function public.get_shared_prayer(text) from public;
revoke all on function public.get_shared_collection(text) from public;
grant execute on function public.get_shared_prayer(text) to anon, authenticated;
grant execute on function public.get_shared_collection(text) to anon, authenticated;
