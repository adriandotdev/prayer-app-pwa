-- Ora: initial schema, triggers and Row Level Security.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  timezone text not null default 'UTC',
  preferred_language text not null default 'en',
  created_at timestamptz not null default now()
);

-- Auto-create a profile whenever a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), '')
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- prayers (user_id IS NULL = read-only starter library)
-- ---------------------------------------------------------------------------
create table public.prayers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  body text not null default '',
  source text,
  is_favorite boolean not null default false,
  search tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index prayers_user_id_idx on public.prayers (user_id);
create index prayers_search_idx on public.prayers using gin (search);

create trigger prayers_set_updated_at
  before update on public.prayers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- collections and their prayers
-- ---------------------------------------------------------------------------
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index collections_user_id_idx on public.collections (user_id, sort_order);

create table public.collection_prayers (
  collection_id uuid not null references public.collections (id) on delete cascade,
  prayer_id uuid not null references public.prayers (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (collection_id, prayer_id)
);

create index collection_prayers_prayer_id_idx on public.collection_prayers (prayer_id);

-- ---------------------------------------------------------------------------
-- intentions
-- ---------------------------------------------------------------------------
create table public.intentions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  text text not null check (char_length(text) between 1 and 2000),
  is_answered boolean not null default false,
  answered_at timestamptz,
  created_at timestamptz not null default now(),
  check (is_answered or answered_at is null)
);

create index intentions_user_id_idx on public.intentions (user_id, is_answered, created_at desc);

-- ---------------------------------------------------------------------------
-- rosary_sessions
-- ---------------------------------------------------------------------------
create table public.rosary_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mystery_set text not null check (mystery_set in ('joyful', 'sorrowful', 'glorious', 'luminous')),
  completed_at timestamptz not null default now()
);

create index rosary_sessions_user_id_idx on public.rosary_sessions (user_id, completed_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.prayers enable row level security;
alter table public.collections enable row level security;
alter table public.collection_prayers enable row level security;
alter table public.intentions enable row level security;
alter table public.rosary_sessions enable row level security;

-- profiles: own row only. Rows are created by the trigger, never by clients.
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- prayers: starter prayers (user_id IS NULL) are readable by everyone and never writable.
create policy "prayers_select" on public.prayers
  for select to anon, authenticated
  using (user_id is null or user_id = (select auth.uid()));
create policy "prayers_insert_own" on public.prayers
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "prayers_update_own" on public.prayers
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "prayers_delete_own" on public.prayers
  for delete to authenticated using (user_id = (select auth.uid()));

-- collections: own rows only.
create policy "collections_select_own" on public.collections
  for select to authenticated using (user_id = (select auth.uid()));
create policy "collections_insert_own" on public.collections
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "collections_update_own" on public.collections
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "collections_delete_own" on public.collections
  for delete to authenticated using (user_id = (select auth.uid()));

-- collection_prayers: allowed when the collection is yours; the prayer must be yours or a starter prayer.
create policy "collection_prayers_select_own" on public.collection_prayers
  for select to authenticated
  using (exists (
    select 1 from public.collections c
    where c.id = collection_id and c.user_id = (select auth.uid())
  ));
create policy "collection_prayers_insert_own" on public.collection_prayers
  for insert to authenticated
  with check (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.prayers p
      where p.id = prayer_id and (p.user_id is null or p.user_id = (select auth.uid()))
    )
  );
create policy "collection_prayers_update_own" on public.collection_prayers
  for update to authenticated
  using (exists (
    select 1 from public.collections c
    where c.id = collection_id and c.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.collections c
    where c.id = collection_id and c.user_id = (select auth.uid())
  ));
create policy "collection_prayers_delete_own" on public.collection_prayers
  for delete to authenticated
  using (exists (
    select 1 from public.collections c
    where c.id = collection_id and c.user_id = (select auth.uid())
  ));

-- intentions: own rows only.
create policy "intentions_select_own" on public.intentions
  for select to authenticated using (user_id = (select auth.uid()));
create policy "intentions_insert_own" on public.intentions
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "intentions_update_own" on public.intentions
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "intentions_delete_own" on public.intentions
  for delete to authenticated using (user_id = (select auth.uid()));

-- rosary_sessions: own rows only.
create policy "rosary_sessions_select_own" on public.rosary_sessions
  for select to authenticated using (user_id = (select auth.uid()));
create policy "rosary_sessions_insert_own" on public.rosary_sessions
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "rosary_sessions_delete_own" on public.rosary_sessions
  for delete to authenticated using (user_id = (select auth.uid()));
