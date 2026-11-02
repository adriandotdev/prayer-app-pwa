-- Server-side limits that match the app's zod schemas, and an idempotency key for Rosary history.

-- The app caps the prayer body at 20000 characters and the source at 200; enforce it in the database too.
alter table public.prayers
  add constraint prayers_body_length check (char_length(body) <= 20000),
  add constraint prayers_source_length check (source is null or char_length(source) <= 200);

-- A client-generated id per finished Rosary, so a retry after a lost response (or an offline queue that
-- syncs twice) cannot record the same Rosary twice. Null for rows recorded before this existed.
alter table public.rosary_sessions add column client_id uuid;

create unique index rosary_sessions_client_id_key
  on public.rosary_sessions (user_id, client_id)
  where client_id is not null;
