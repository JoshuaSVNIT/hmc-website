# Antigravity Prompts — run these in order

Rules for using these:
- Run ONE phase per agent task. Don't paste multiple phases into one prompt.
- After each phase finishes, review the diff yourself and `git commit` before starting the next.
- Always keep PROJECT_SPEC.md open/attached in the workspace so the agent can reference it.
- Phases 0-3 are already built. Phases below marked "(update)" are re-runs to bring
  already-built pages in line with the current spec (contacts moved to Sanity,
  anonymous toggle, corrected RLS).

---

## Phase 0 — Scaffold ✅ done

## Phase 1 — Home, Navbar, Footer, design tokens, feature-toggle-aware nav ✅ done

## Phase 2 (update) — Raise a Ticket: add back the anonymous toggle
```
Read PROJECT_SPEC.md sections 6, 7, and 8. Update the existing /raise-ticket
form:

- Read NEXT_PUBLIC_ALLOW_ANONYMOUS_TICKETS. If "true", show a "Submit
  anonymously" checkbox above the name field. When checked: hide/disable the
  raiser_name field (it becomes optional, save as null), and save
  is_anonymous: true. When unchecked: raiser_name is required as it is now.
- If NEXT_PUBLIC_ALLOW_ANONYMOUS_TICKETS is "false" or unset, hide the
  checkbox entirely and keep raiser_name required — this is the current
  behavior, don't break it.
- Do not change the storage upload constraints, ticket_code generation,
  print button, or localStorage logic — those are already correct.
```

## Phase 3 (update) — Track Ticket: use the RPC function, not a direct select
```
Read PROJECT_SPEC.md section 4. The /track-ticket manual search currently
queries the tickets table directly with .eq('ticket_code', code) — this
relies on an RLS policy that doesn't actually exist and shouldn't, since a
direct anon SELECT policy would let anyone list every ticket via the public
API regardless of what filter the UI applies.

Replace the lookup with a call to the get_ticket_by_code Postgres function
via supabase.rpc('get_ticket_by_code', { code }) instead of a table select.
Apply the same change to the "Recent tickets" quick-access links — each one
should also resolve via the RPC call, not a direct table read. Everything
else on this page (localStorage reading, print button) stays as-is.
```

## Phase 4 — Admin dashboard, auth, admin_notes, corrected RLS
```
Read PROJECT_SPEC.md sections 4 and 6. Set up Supabase Auth (email/password)
for HMC members. Build /admin/login. Build /admin as a protected route
(server-side check via middleware or a server component — not just a
client-side redirect, so the data fetch itself never happens for an
unauthenticated request) showing a table of all tickets from Supabase,
filterable by tag and status, with:
- a dropdown per row to update status (Open / In Progress / Resolved)
- an editable admin_notes text field per row that saves back to the table

The RLS policies and the get_ticket_by_code function should already exist in
supabase/schema.sql and be applied to the live project — do not rewrite them,
just build the dashboard against them. The admin dashboard uses the
authenticated user's session for all reads/writes; do not use the Supabase
secret key on the client to bypass RLS.
```

## Phase 5 (update) — Contacts page: now from Sanity, not Supabase
```
Read PROJECT_SPEC.md sections 3 and 5. There is no `contacts` table in
Supabase — contact info lives in Sanity as the `contact` schema type
(category, label, phone, order, icon). Update /contacts to fetch from
Sanity instead, grouped by category (Emergency, Supervisor, HMC Member),
sorted by the `order` field within each group. Each entry should have a
tap-to-call link on mobile (tel: links). Also update the homepage's
emergency-contacts section (currently hardcoded placeholder numbers) to
fetch the same `contact` schema from Sanity, filtered to just the
Emergency and Supervisor categories, instead of hardcoded values.
```

## Phase 6 — Guides pages ✅ can still run as originally written
```
Read PROJECT_SPEC.md. Build /guides/lan and /guides/electrical as static
step-by-step pages. I will paste in the text/steps from my existing PDF
guides — use numbered steps with an image placeholder per step (I'll add
real images after).
```

## Phase 7 — Sanity integration (Notices, Gallery, Events, Mess Menu, Contacts)
```
Read PROJECT_SPEC.md section 5. Set up the Sanity client in src/lib/sanity/.
Define Sanity schema types for:
- notice (title, body as Portable Text, date, pinned boolean)
- galleryItem (title, image, event name, date)
- event (title, description, date, googleFormUrl)
- messMenu (day: string select of Monday–Sunday, breakfast: text,
  lunch: text, dinner: text) — one document per day, 7 total
- contact (category: string select of Emergency/Supervisor/HMC Member,
  label: string, phone: string, order: number, icon: optional string)

Build /notices rendering the Portable Text body with @portabletext/react
(support at least bold text and bullet lists). Build /gallery. Build
/events per section 7: read NEXT_PUBLIC_SHOW_EVENTS and call Next.js
notFound() if "false"; otherwise render events with each googleFormUrl
embedded as an iframe on its detail view.

Note: if Phase 5 already built a Sanity-based /contacts page and homepage
section against the `contact` schema, just make sure the schema type
defined here matches what those pages expect — don't duplicate or rename it.
```

## Phase 8 — Mess Menu widget on homepage
```
Read PROJECT_SPEC.md section 9. Build the "Today's Mess Menu" section on
the homepage (replacing the Phase 1 placeholder):
- Detect the current day of the week client-side inside a useEffect (avoid
  SSR/client mismatch on the date).
- Fetch that day's messMenu document from Sanity and display Breakfast,
  Lunch, and Dinner.
- Explicitly display the detected day at the top, e.g.
  "Showing menu for: Tuesday".
- Handle a missing document for that day gracefully (e.g. "Menu not added
  yet").
```

## Phase 9 — Leaderboard (Realtime, feature-toggled)
```
Read PROJECT_SPEC.md sections 4, 6, and 7. Build /leaderboard reading from
the leaderboard_entries table in Supabase, sorted by score descending,
grouped by game. Subscribe to realtime changes so the page updates live
without a refresh when an admin updates a score from /admin. Read
NEXT_PUBLIC_SHOW_LEADERBOARD and call Next.js notFound() if "false",
matching the same toggle pattern used for /events in Phase 7.
```

---
## General-purpose prompt (use anytime something breaks)
```
Read PROJECT_SPEC.md. [Describe the bug/behavior here.] Don't change the
tech stack or add new dependencies without asking me first. Run the app,
reproduce the issue using the browser tool, then fix it and verify the fix
by testing again.
```
