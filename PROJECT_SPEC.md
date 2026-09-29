# HMC Website — Project Spec
**Swami Vivekanand Bhavan Hostel — Technical Secretary project**
_Read this file in full before doing any task. Do not invent features, pages, or schema that aren't listed here — ask instead._

## 1. Overview
A website for the Hostel Management Committee (HMC) covering: complaint ticketing, emergency contacts, LAN/electrical complaint guides, notices, event gallery, event registration, a live gaming-contest leaderboard, and a dynamic mess menu.

## 2. Tech stack (fixed — do not substitute)
| Layer | Choice |
|---|---|
| Frontend framework | Next.js (App Router, TypeScript) |
| Hosting | Vercel |
| Ticket + leaderboard data, Auth | Supabase (Postgres) — only for app-generated data needing access rules |
| CMS (notices / gallery / events / mess menu / contacts) | Sanity — for anything HMC edits as content |
| Styling | Tailwind CSS |
| Event registration | Google Forms (embedded iframe) for now |
| Ticket export | Native browser `window.print()` — no PDF library |

**Rule of thumb:** if a resident or the app creates the data (a ticket, a score), it goes in Supabase and gets RLS. If HMC just wants to edit content without touching code (a phone number, a notice, a photo), it goes in Sanity.

## 3. Pages / routes
| Route | Purpose | Data source |
|---|---|---|
| `/` | Home — quick links, pinned emergency numbers, latest notice, today's mess menu | Sanity + Supabase |
| `/raise-ticket` | Complaint form. No login required. Anonymous submission togglable (section 7). Success view has a "Print Ticket" button. | Supabase |
| `/track-ticket` | Manual search by `ticket_code` (via RPC, not direct table read), plus a "Recent tickets" quick-access list from `localStorage`. No login. | Supabase + localStorage |
| `/admin` | HMC-only dashboard: view/filter/update all tickets, add admin notes | Supabase (auth-gated) |
| `/admin/login` | HMC member login | Supabase Auth |
| `/contacts` | Emergency + supervisor + HMC member contact list | Sanity |
| `/guides/lan` | LAN complaint guide — embedded PDF viewer + download link | static PDF file in `/public/guides/` |
| `/guides/electrical` | Electrical complaint guide — embedded PDF viewer + download link | static PDF file in `/public/guides/` |
| `/notices` | Read-only mirror of important notices (Portable Text, supports bold/lists) | Sanity |
| `/gallery` | Hostel event photos/posters | Sanity |
| `/events` | Upcoming events list + registration links (Google Form embeds). Gated by `NEXT_PUBLIC_SHOW_EVENTS`. | Sanity |
| `/leaderboard` | Live gaming-contest leaderboard. Gated by `NEXT_PUBLIC_SHOW_LEADERBOARD`. | Supabase Realtime |

Residents never create accounts anywhere on the site. Only HMC members authenticate, and only to reach `/admin`. Since there is no public sign-up path in the app, any authenticated user is by definition an HMC member — admin accounts are only ever created manually by you in the Supabase dashboard.

## 4. Supabase schema (Postgres)
Source of truth lives in `supabase/schema.sql`. This is the ONLY place RLS matters — Sanity content has no row-level security concept.

```sql
create table tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_code text unique not null,       -- short human-readable code e.g. HMC-1042
  raiser_name text,                       -- nullable: optional when is_anonymous = true
  room_no text not null,
  tag text not null check (tag in ('LAN','Electrical','Plumbing','Lift','Other')),
  description text not null,
  photo_url text,
  status text not null default 'Open' check (status in ('Open','In Progress','Resolved')),
  admin_notes text,                       -- HMC-only free-text updates, e.g. "Electrician arriving at 5 PM"
  is_anonymous boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  room_no text,
  game text not null,       -- BGMI / Free Fire
  score int default 0,
  updated_at timestamptz default now()
);

-- Anon must NEVER get direct SELECT on tickets (that would allow listing/
-- enumerating every resident's ticket via the public API, regardless of what
-- filter the frontend intends to apply). Instead, expose one narrow function:
create or replace function get_ticket_by_code(code text)
returns setof tickets
language sql
security definer
as $$
  select * from tickets where ticket_code = code;
$$;

revoke all on function get_ticket_by_code(text) from public;
grant execute on function get_ticket_by_code(text) to anon, authenticated;

alter table tickets enable row level security;
alter table leaderboard_entries enable row level security;

-- anon: can create tickets, cannot read the table directly at all
create policy "anon can insert tickets"
  on tickets for insert
  to anon
  with check (true);

-- authenticated (= HMC admin, since there's no public signup): full access
create policy "authenticated full select on tickets"
  on tickets for select
  to authenticated
  using (true);

create policy "authenticated can update tickets"
  on tickets for update
  to authenticated
  using (true);

create policy "public read leaderboard"
  on leaderboard_entries for select
  to anon, authenticated
  using (true);

create policy "authenticated write leaderboard"
  on leaderboard_entries for all
  to authenticated
  using (true) with check (true);
```

The frontend must call `.rpc('get_ticket_by_code', { code })` for ticket lookups on `/track-ticket` — never `.from('tickets').select()...eq('ticket_code', code)`, since anon has no direct SELECT grant on the table at all.

### Storage constraints
- Bucket `ticket-photos`, private (not public).
- Client-side AND bucket-policy enforcement: only `.jpg`, `.png`, `.webp`, hard cap 5MB per file.

## 5. Sanity content schema
All of the following are Sanity document types, edited by HMC members in Sanity Studio — no code changes or redeploys needed to update any of this content.

- **`notice`** — title, body (Portable Text — supports bold/lists/links), date, pinned (boolean)
- **`galleryItem`** — title, **images (array of images, not a single image)**, event name, date. One `galleryItem` document = one event/album with multiple photos; the frontend renders `images` as a grid/lightbox per item, not a single `<img>`.
- **`event`** — title, description, date, googleFormUrl
- **`messMenu`** — one document per day of the week (7 total): day (string, Monday–Sunday), breakfast (text), lunch (text), dinner (text)
- **`contact`** — category (select: Emergency, Supervisor, HMC Member), label (e.g. "Ambulance", "Night Supervisor", or a person's name), phone, order (number, for sort position within a category), icon (optional emoji/string). The homepage and `/contacts` page both query this same schema, just filtered/sliced differently — homepage shows a short pinned subset (Ambulance, Dispensary, Night Supervisor), `/contacts` shows everything grouped by category.

## 6. Environment variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # sb_publishable_... — safe client-side, same privileges as old anon key
SUPABASE_SECRET_KEY=                    # sb_secret_... — server-only, NEVER in client-side code, bypasses RLS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                       # only if writing from the app; Studio uploads don't need this

# Feature toggles — see section 7
NEXT_PUBLIC_SHOW_LEADERBOARD=false
NEXT_PUBLIC_SHOW_EVENTS=false
NEXT_PUBLIC_ALLOW_ANONYMOUS_TICKETS=true
```
Note: use Supabase's new publishable/secret keys (Settings → API Keys), not the legacy anon/service_role JWT keys — Supabase is deprecating the legacy keys by end of 2026.

## 7. Feature toggles
- **`NEXT_PUBLIC_SHOW_LEADERBOARD`** / **`NEXT_PUBLIC_SHOW_EVENTS`**: gated pages call Next.js `notFound()` when `false`; the Navbar reads the same flags and omits the nav link entirely.
- **`NEXT_PUBLIC_ALLOW_ANONYMOUS_TICKETS`**: when `true`, `/raise-ticket` shows a "Submit anonymously" checkbox; checking it makes `raiser_name` optional and saves `is_anonymous: true`. When `false`, the checkbox is hidden entirely and `raiser_name` stays required (this is the currently-built behavior).
- All toggles live in Vercel's Environment Variables, not hardcoded — flipping one for a live event is just a redeploy, not a code change.

## 8. Ticket UX details
- **No public login.** Residents raise and track tickets without an account.
- **Anonymous toggle:** see section 7. `is_anonymous` and nullable `raiser_name` already exist in the schema (section 4) regardless of whether the toggle is currently on.
- **localStorage quick-access:** on successful ticket creation, append the new `ticket_code` to a `localStorage` array (key `hmc_recent_tickets`) inside a `useEffect` only — never during initial render, to avoid Next.js hydration mismatches.
- `/track-ticket` shows this recent-tickets list as clickable quick links above/below the manual `ticket_code` search box, and looks up tickets via the `get_ticket_by_code` RPC (section 4), never a direct table select.
- **Print/PDF:** success page and track-ticket detail view both have a "Print Ticket" button calling `window.print()`, with a `@media print` rule hiding Navbar/Footer/buttons — no PDF-generation library added.

## 9. Mess Menu widget (homepage)
- Detects the current day of the week client-side (e.g. `toLocaleDateString('en-US', { weekday: 'long' })`) inside a `useEffect`.
- Fetches that day's `messMenu` document from Sanity (section 5) and displays Breakfast, Lunch, Dinner.
- Explicitly displays the detected day at the top, e.g. **"Showing menu for: Tuesday"**.
- Handles a missing document for that day gracefully (e.g. "Menu not added yet").

## 10. Design tokens
Derived from the campaign poster:
- Primary (blue): `#1E3A8A`–`#2563EB` range
- Accent/urgent (red): `#EF4444`
- Accent/CTA (yellow): `#EAB308`
- Font: bold, rounded sans-serif for headings; clean sans for body
- Mobile-first — most users will be on phones in hostel corridors

## 11. Non-goals (for now)
- No native app
- No resident accounts of any kind — ticket tracking uses `localStorage` + `ticket_code` lookup via RPC, not login (section 8)
- No custom auth system for HMC either — Supabase Auth only, accounts created manually by the Technical Secretary
- No custom form builder — use Google Forms for registrations until there's a real need to change
- No PDF-generation library — native browser print only (section 8)
- No separate admin portal/subdomain — RLS + Auth on the same app is the real security boundary, not URL separation (see chat discussion; can revisit as a Vercel rewrite later if desired for UX reasons, not security ones)
- No WhatsApp API integration in phase 1 — HMC keeps using the admin-only WhatsApp group as the primary notice channel; `/notices` mirrors important ones manually via Sanity
