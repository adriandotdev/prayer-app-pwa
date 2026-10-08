-- Favorites: a join table so starter prayers (read-only, user_id IS NULL) can be favorited too.
-- prayers.is_favorite is left in place but is no longer used.
create table public.prayer_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  prayer_id uuid not null references public.prayers (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, prayer_id)
);

create index prayer_favorites_prayer_id_idx on public.prayer_favorites (prayer_id);

alter table public.prayer_favorites enable row level security;

create policy "prayer_favorites_select_own" on public.prayer_favorites
  for select to authenticated using (user_id = (select auth.uid()));
-- The prayer must be yours or a starter prayer.
create policy "prayer_favorites_insert_own" on public.prayer_favorites
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.prayers p
      where p.id = prayer_id and (p.user_id is null or p.user_id = (select auth.uid()))
    )
  );
create policy "prayer_favorites_delete_own" on public.prayer_favorites
  for delete to authenticated using (user_id = (select auth.uid()));
