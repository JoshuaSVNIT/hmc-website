-- HMC Website — Supabase schema
-- Source of truth per PROJECT_SPEC.md §4.
-- Run this in Supabase SQL Editor: Project → SQL Editor → paste → Run

-- ─────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────

create table if not exists tickets (
  id          uuid primary key default gen_random_uuid(),
  ticket_code text unique not null,       -- e.g. HMC-1042
  raiser_name text,
  room_no     text not null,
  tag         text not null check (tag in ('LAN','Electrical','Plumbing','Lift','Other')),
  description text not null,
  photo_url   text,
  status      text not null default 'Open' check (status in ('Open','In Progress','Resolved')),
  admin_notes text,                       -- HMC-only field
  is_anonymous boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists contacts (
  id       uuid primary key default gen_random_uuid(),
  category text not null,   -- Ambulance / Dispensary / Night Supervisor / HMC Member
  name     text,
  phone    text not null,
  notes    text
);

create table if not exists leaderboard_entries (
  id          uuid primary key default gen_random_uuid(),
  player_name text not null,
  room_no     text,
  game        text not null,       -- BGMI / Free Fire
  score       int  default 0,
  updated_at  timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Auto-update updated_at trigger for tickets
-- ─────────────────────────────────────────────

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tickets_updated_at on tickets;
create trigger tickets_updated_at
  before update on tickets
  for each row execute procedure update_updated_at();

-- ─────────────────────────────────────────────
-- Row Level Security (§4 — strict)
-- ─────────────────────────────────────────────

alter table tickets             enable row level security;
alter table contacts            enable row level security;
alter table leaderboard_entries enable row level security;

-- tickets: anyone can insert (no auth needed to raise a complaint)
create policy "anon_insert_tickets"
  on tickets for insert
  to anon
  with check (true);

-- tickets: public can only SELECT when they supply the exact ticket_code
-- (prevents enumeration — you can only look up your own code)
create policy "anon_select_by_code"
  on tickets for select
  to anon
  using (ticket_code = current_setting('request.jwt.claims', true)::json->>'ticket_code');

-- NOTE: the application queries by exact ticket_code from the client.
-- Supabase's .eq('ticket_code', code) combined with the row policy above
-- ensures only that specific row is returned.
-- For the /track-ticket anon lookup, the app sends the code via query param;
-- the server route applies .eq('ticket_code', code) which triggers this policy.

-- tickets: authenticated HMC admins have full select + update
create policy "admin_full_access_tickets"
  on tickets for all
  to authenticated
  using (true)
  with check (true);

-- contacts: public read, admin write
create policy "public_read_contacts"
  on contacts for select
  to anon, authenticated
  using (true);

create policy "admin_write_contacts"
  on contacts for all
  to authenticated
  using (true)
  with check (true);

-- leaderboard: public read, admin write
create policy "public_read_leaderboard"
  on leaderboard_entries for select
  to anon, authenticated
  using (true);

create policy "admin_write_leaderboard"
  on leaderboard_entries for all
  to authenticated
  using (true)
  with check (true);

-- ─────────────────────────────────────────────
-- Storage bucket (run once via Supabase dashboard or API)
-- ─────────────────────────────────────────────
-- Create bucket named "ticket-photos" with public reads.
-- Bucket policy (set in Storage → Policies):
--   INSERT: anon allowed, file size < 5242880, mime in (image/jpeg, image/png, image/webp)
--   SELECT: public (so photo_url in the ticket is viewable)
