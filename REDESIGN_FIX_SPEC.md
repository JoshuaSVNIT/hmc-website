# HMC Website — Redesign Correction Spec
_Read this file in full before every phase below. This corrects a frontend
redesign pass that contradicted the site's core design philosophy and
invented fake content. Backend logic (Supabase tables, RLS, ticket flow,
Sanity data fetching patterns already in place) must NOT be changed unless
a phase explicitly says so — this is a UI/content correction pass, not a
rebuild._

## 1. Non-negotiable design philosophy
**Emergency contact numbers must be visible directly below the hero section,
with no scrolling required, on both mobile and desktop.** This was the
original design intent and must be restored. Any redesign that pushes
emergency contacts below the fold is wrong, regardless of how good it looks
otherwise.

## 2. Identity — get this right, it was wrong in the last redesign
- **HMC = Hostel Management Committee.** It is NOT the hostel's name.
- **The hostel's name is Swami Vivekanand Bhavan.**
- Top-left brand mark: a small "SV" monogram/logo, with "HMC" as the main
  title text and "Swami Vivekanand Bhavan" as the subtext underneath. This
  is the ORIGINAL branding — restore it exactly, don't invent "HMC Boys
  Hostel" as a title anywhere.

## 3. Hard bans — remove these everywhere they appear, site-wide
- No cursive/script fonts anywhere on the site, in any section.
- No fabricated/hallucinated statistics (resident counts, occupancy
  percentages, or any other number not pulled from real Supabase/Sanity
  data). If a real number isn't available, don't show a stat there at all.
- No social media icons (Instagram/LinkedIn/YouTube) that link nowhere —
  remove them entirely rather than leaving dead links.
- No "Virtual Tour" button or similar invented marketing content.
- No light/dark mode toggle. This site has ONE fixed theme (the warm ink/
  paper/ochre/brick/forest token system already defined) — it is not
  designed to support a light mode, and attempting one breaks text
  contrast. Remove the toggle control entirely.

## 4. Homepage structure, top to bottom (final correct order)
1. **Hero**: brand name/tagline per section 2 — plain text, no cursive, no
   invented taglines like "A Home Beyond Classrooms". Two primary buttons:
   "Raise a Ticket" and "Track Ticket". A third, visually secondary button:
   "Today's Mess Menu" — clicking it smooth-scrolls DOWN the homepage to the
   mess menu section (section 4.3 below), it does NOT navigate to a
   different page.
2. **Emergency & Supervisors section** — immediately below the hero, no
   scrolling required to see at least the first few entries (section 1).
3. **Mess menu section** (anchor target for the hero's mess menu button) —
   shows today's menu on the homepage itself (this already exists, keep it,
   just confirm the hero button scrolls here rather than linking out).
4. **Gallery preview** — see section 6, pulling REAL Sanity gallery albums,
   not invented cards.
5. Latest Notices preview, footer.

Do not include a "Live Overview" stats block anywhere on the homepage.

## 5. Navigation — final sidebar/hamburger menu structure
Remove duplication and dead links. Final nav list:
- Home
- About HMC
- Facilities (includes Common Rooms — see section 7)
- Mess & Menu → links to the NEW full mess-menu page (section 8), distinct
  from the homepage's in-page mess menu section
- Notices
- Services (submenu): Raise a Ticket, Track Ticket, LAN Guide, Electrical
  Guide
- Gallery
- Contacts

REMOVE entirely: "Student Portal" and "Student Services" (both duplicated
Track Ticket with no distinct content of their own).

Top bar: remove "Notices & Calendar" and "Important Contacts" as separate
items (they duplicate the sidebar's Notices and the homepage's emergency
section). Keep only a simple "Emergency" link/button in the top bar, per
the core philosophy in section 1 — it can jump to the emergency section or
/contacts, but don't rebuild a whole secondary contacts UI in the top bar.

## 6. Gallery section — real content only
The homepage's photo-album preview section (previously mislabeled "Life at
HMC" with invented "Fitness & Recreation" and "Common Rooms" cards that
both just linked back to the gallery) must instead show the REAL
`galleryItem` documents already created in Sanity (e.g. "Swachhata Hi Seva",
"Ganesh Chaturthi 2K26"), each card linking to /gallery. Remove the fake
"Fitness & Recreation" and "Common Rooms" cards — Common Rooms gets its own
real page (section 7), not a fake gallery card.

## 7. NEW: Common Rooms (Sanity schema + Facilities page)
There is one common room per wing (A, B, C) on each floor from 2nd to 8th
(7 floors × 3 wings = 21 common rooms total).

New Sanity schema type `commonRoom`:
- `wing` (string, select: A / B / C)
- `floor` (number, 2–8)
- `label` (string — the room's purpose/title, e.g. "Study Room", "TV Lounge")
- `image` (optional image)
- `icon` (optional string emoji — fallback shown when `image` is empty or
  fails to load, same pattern already used for the `contact` schema's
  photo/icon fallback)
- `contactName` (optional string, NOT required)
- `contactPhone` (optional string, NOT required)

The **Facilities page** (currently just scrolls back to the old fake
gallery section — that behavior must be replaced) becomes a real page that
renders all `commonRoom` documents, organized/grouped visually by floor and
wing (e.g. a 7-row × 3-column grid: floors 2–8 as rows, wings A/B/C as
columns), each cell showing its image-or-emoji-icon, label, and contact
info if present.

## 8. NEW: full Mess Menu page
A dedicated page (linked from the sidebar's "Mess & Menu") showing the
complete week's menu as a table — all 7 days, Breakfast/Lunch/Dinner
columns, pulled from the existing `messMenu` Sanity documents. Below the
table, a clearly labeled link to Raise a Ticket with a short instruction
("Having a mess-related issue? Raise a ticket under the Mess tag") —
linking to /raise-ticket. This is separate from the homepage's "today only"
mess menu section.

## 9. Event schema update
Current `event` schema has `description` as plain text. Change it to
Portable Text (array of blocks) so HMC can format it (bold, lists). Add:
- `image` (optional image) — used as the event's cover image
- `icon` (optional string emoji) — fallback shown when `image` is empty or
  fails to load, same pattern as `contact` and `commonRoom`

## 10. About HMC — Committee Members from real data
The About page currently shows 3 hardcoded committee members. Replace with
a query against the existing `contact` Sanity schema, filtered to
`category == "HMC Member"`, rendering each as a member card (using
whatever fields that schema already has: label/name, title, phone, photo/
icon). Do not hardcode any names.

## 11. Add-to-home-screen behavior
- Capture the `beforeinstallprompt` event (Chrome/Android) instead of
  relying purely on the browser's own timing.
- Show the install prompt automatically ONCE per device, tracked via a
  `localStorage` flag (e.g. `hmc_install_prompt_shown`) — not on every
  visit. If dismissed, don't show it again for at least 14 days (store a
  dismissal timestamp).
- ALSO keep a small, persistent, not-too-prominent "Install App" button
  always available (e.g. in the footer or a corner of the nav) that
  manually triggers the captured prompt at any time, regardless of the
  automatic-popup throttling above.
- iOS has no `beforeinstallprompt` event — for iOS Safari, the persistent
  button can instead show a short instruction ("Tap Share → Add to Home
  Screen") since iOS doesn't support a programmatic install trigger.

## 12. Mobile search bar
On mobile widths, the search bar should NOT render as a full-width input
in the header (it currently looks cramped/odd there). Instead show only a
magnifying-glass icon button; tapping it animates/expands into the full
search input (e.g. sliding open or overlaying). Confirm the search actually
executes a real query against site content (notices, contacts, mess menu,
services) — if it's currently just a decorative input with no real search
logic behind it, that needs to be implemented, not just restyled.

## 13. What must NOT change
- Supabase tables, RLS policies, the ticket raise/track/admin flow logic
- Existing Sanity schemas not explicitly modified above (`notice`,
  `galleryItem`, `messMenu`, `contact` field structure beyond what section
  10 asks)
- The color token system, type system, and print/localStorage/anonymous-
  toggle logic already built
