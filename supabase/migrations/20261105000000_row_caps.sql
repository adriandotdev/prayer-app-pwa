-- Per-user row caps, so one account cannot fill the database (abuse and cost control).
-- The app recognises the 'row_limit_reached' message and shows a friendly note.
-- Limits: 500 own prayers, 100 collections, 500 intentions. Starter prayers (user_id is null) are exempt.

create or replace function public.enforce_row_cap()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  cap integer := tg_argv[0]::integer;
  owned integer;
begin
  if new.user_id is null then
    return new;
  end if;

  execute format('select count(*) from %I.%I where user_id = $1', tg_table_schema, tg_table_name)
    into owned using new.user_id;

  if owned >= cap then
    raise exception 'row_limit_reached: % allows at most % rows per user', tg_table_name, cap
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger prayers_row_cap before insert on public.prayers
  for each row execute function public.enforce_row_cap(500);

create trigger collections_row_cap before insert on public.collections
  for each row execute function public.enforce_row_cap(100);

create trigger intentions_row_cap before insert on public.intentions
  for each row execute function public.enforce_row_cap(500);
