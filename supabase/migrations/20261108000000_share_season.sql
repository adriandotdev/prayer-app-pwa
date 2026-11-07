-- A share link carries the sharer's liturgical colour choice, so the page looks the way it does in
-- their account. It is a snapshot taken when they create or reopen the link: appearance itself lives
-- in the browser (localStorage), not the database. 'default' is Ora's own palette; 'auto' follows the
-- liturgical year in the reader's time zone.

alter table public.shares
  add column season text not null default 'default'
  constraint shares_season_valid check (season in ('default', 'auto', 'violet', 'rose', 'white', 'gold', 'green', 'red', 'black'));

-- The owner may refresh the season on their own link (nothing else about the row changes).
create policy "shares_update_own" on public.shares
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

revoke update on public.shares from authenticated;
grant update (season) on public.shares to authenticated;

drop function public.get_shared_prayer(text);
create function public.get_shared_prayer(p_token text)
returns table (title text, body text, source text, season text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.title, p.body, p.source, s.season
  from public.shares s
  join public.prayers p on p.id = s.prayer_id
  where s.token = p_token;
$$;

drop function public.get_shared_collection(text);
create function public.get_shared_collection(p_token text)
returns table (collection_name text, prayer_id uuid, title text, body text, source text, season text)
language sql
stable
security definer
set search_path = ''
as $$
  select c.name, p.id, p.title, p.body, p.source, s.season
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
