# Redesign Correction — Prompts (run in order)

Back on Gemini Flash 3.8 (med/high) — narrow, explicit steps again. Phase A
was interrupted partway through by Claude running out of quota, and it's
unknown exactly what was completed, so Phase A is now split into small,
SELF-CHECKING steps: each one audits its own specific item first and only
makes a change if that item isn't already fixed. This makes them safe to
run in order regardless of what state the interrupted run left things in.
Everything from Phase C onward was never started, so those remain plain
(non-checking) narrow steps as originally written.

Run ONE step per agent task. Review the result yourself before the next
one. Commit to git after each.

Every prompt below assumes you paste it AFTER telling the agent to read
REDESIGN_FIX_SPEC.md, exactly as shown.

---

## Phase A1 — Check/fix: brand identity
```
Read REDESIGN_FIX_SPEC.md section 2 fully before doing anything.

First, check: does the header/sidebar currently show "HMC Boys Hostel" or
any similar wrong branding (treating HMC as if it were the hostel's name)?

- If YES: fix it. Replace with the original branding: an "SV" monogram
  logo, "HMC" as the title text, "Swami Vivekanand Bhavan" as the subtext
  underneath. Check all locations this might appear (header, sidebar,
  footer, page <title> tags, metadata) and fix every instance.
- If NO (branding is already correct): make no changes, just tell me it's
  already correct.

Either way, report clearly which case it was.
```

## Phase A2 — Check/fix: remove light/dark mode toggle
```
Read REDESIGN_FIX_SPEC.md section 3 fully before doing anything.

First, check: does a light/dark mode toggle control still exist anywhere
(sidebar, footer, settings menu, etc.)?

- If YES: remove it entirely, including any associated theme-switching
  logic/state, since this site uses one fixed theme only.
- If NO: make no changes, just tell me it's already removed.

Report clearly which case it was.
```

## Phase A3 — Check/fix: remove dead social icons
```
Read REDESIGN_FIX_SPEC.md section 3 fully before doing anything.

First, check: do Instagram/LinkedIn/YouTube icons (or any other social
icons that link nowhere real) still exist in the footer or anywhere else?

- If YES: remove them entirely.
- If NO: make no changes, just tell me it's already removed.

Report clearly which case it was.
```

## Phase A4 — Check/fix: remove cursive fonts and invented taglines
```
Read REDESIGN_FIX_SPEC.md section 3 fully before doing anything.

First, check: does any cursive/script-font text still exist anywhere on
the site (e.g. a tagline like "Same Walls New Stories")?

- If YES: remove that text content entirely (not just restyle it to a
  different font — the content itself is invented copy that shouldn't
  exist). Search the whole codebase, not just the homepage, since this may
  appear in a footer component used site-wide.
- If NO: make no changes, just tell me it's already removed.

Report clearly which case it was, and list every file where you found (or
confirmed the absence of) this pattern.
```

## Phase A5 — Check/fix: remove duplicate sidebar nav items
```
Read REDESIGN_FIX_SPEC.md section 5 fully before doing anything.

First, check: does the sidebar still contain "Student Portal" and/or
"Student Services" menu items (both of which duplicate Track Ticket with
no distinct content)?

- If YES (either one, or both): remove whichever still exist.
- If NO: make no changes, just tell me they're already removed.

Report clearly which case it was.
```

## Phase A6 — Check/fix: simplify top bar to a single Emergency link
```
Read REDESIGN_FIX_SPEC.md section 5 fully before doing anything.

First, check: does the top bar still show "Notices & Calendar" and/or
"Important Contacts" as separate items?

- If YES: remove whichever still exist, and replace with (or confirm there
  already is) a single "Emergency" link/button in the top bar, linking to
  /contacts or jumping to the homepage's emergency section.
- If NO (top bar already just shows the single Emergency link): make no
  changes, just tell me it's already correct.

Report clearly which case it was.
```

## Phase A7 — Check/fix: hero section content and buttons
```
Read REDESIGN_FIX_SPEC.md section 4 (point 1) fully before doing anything.

Check each of these independently and fix only what's still wrong:

1. Does the hero still show invented tagline text (e.g. "A Home Beyond
   Classrooms" / "More Than a Hostel")? If yes, remove it and replace with
   plain, accurate copy identifying the site as the Hostel Management
   Committee of Swami Vivekanand Bhavan. If already fixed, skip.

2. Does a "Virtual Tour" button still exist in the hero? If yes, remove it.
   If already removed, skip.

3. Does the hero have exactly two primary buttons — "Raise a Ticket"
   (→ /raise-ticket) and "Track Ticket" (→ /track-ticket)? If missing or
   different, fix to match. If already correct, skip.

4. Is there a "Today's Mess Menu" button that smooth-scrolls DOWN the
   current page to the homepage's mess menu section (not a page
   navigation)? If it navigates to a different URL instead, or doesn't
   exist, fix it to scroll in-page (add an anchor/id on the mess menu
   section if needed). If already correct, skip.

Report clearly, item by item, which of the 4 were already correct and
which needed fixing.
```

---

## Phase C — Emergency contacts placement + remove fake stats
```
Read REDESIGN_FIX_SPEC.md sections 1 and 4 fully before doing anything.

1. Confirm/fix that the Emergency & Supervisors section renders IMMEDIATELY
   after the hero section, both in component order and visually — on both
   mobile and desktop, at least the first few emergency contacts must be
   visible without the user needing to scroll. If any section currently
   sits between the hero and emergency contacts, move the emergency
   contacts section to be directly after the hero.

2. Find and completely remove any "Live Overview" section or similar stats
   block showing numbers like resident counts, room occupancy percentage,
   or similar invented statistics. Remove the entire section, not just the
   fake numbers inside it.
```

## Phase D — Gallery section: real content only
```
Read REDESIGN_FIX_SPEC.md section 6 fully before doing anything.

Find the homepage section currently showing "Life at HMC" (or similar) with
cards for things like "Fitness & Recreation" and "Common Rooms" that link
back to the gallery page. Replace this section entirely:
- Rename the section heading to something accurate, e.g. "Life at Swami
  Vivekanand Bhavan" or simply "Gallery".
- Query the real `galleryItem` documents already in Sanity and render each
  as a card (using its title and first image from the `images` array),
  linking to /gallery.
- Remove the invented "Fitness & Recreation" and "Common Rooms" cards
  entirely.
```

## Phase E — Common Rooms: Sanity schema, seed script, Facilities page
```
Read REDESIGN_FIX_SPEC.md section 7 fully before doing anything.

1. Create a new Sanity schema type `commonRoom` with exactly these fields:
   wing (string, select: A/B/C, required), floor (number, required),
   label (string — the room's purpose/title, required), image (optional
   image), icon (optional string emoji, described as "fallback shown when
   image is empty or fails to load"), contactName (optional string, NOT
   required), contactPhone (optional string, NOT required). Register this
   schema type alongside the existing ones.

2. Write a one-time Node seed script (using the Sanity client with a write
   token I will provide via an env var, e.g. SANITY_WRITE_TOKEN) that
   creates 21 commonRoom documents: one for each combination of wing (A, B,
   C) and floor (2 through 8), with `label` left as an empty string for me
   to fill in later via Sanity Studio. Do not run this script yourself —
   write it and show me the exact command to run it myself.

3. Rebuild the Facilities page: it currently just scrolls back to the old
   gallery section — replace that behavior. The Facilities page should
   query all `commonRoom` documents and render them in a grid organized by
   floor (rows, 2 through 8) and wing (columns, A/B/C), each cell showing
   its image-or-emoji-icon fallback, label, and contact info if present.

4. Update the sidebar's "Facilities" link to point at this rebuilt page.
```

## Phase F — Event schema: rich description + image/icon
```
Read REDESIGN_FIX_SPEC.md section 9 fully before doing anything.

Update the existing `event` Sanity schema: change the `description` field
from plain text to Portable Text (array of blocks), matching how the
`notice` schema's body field already works. Add two new fields: `image`
(optional image, used as the event's cover image) and `icon` (optional
string emoji, fallback shown when `image` is empty or fails to load, same
pattern as the `contact` schema). Update the /events page (if already
built) to render the Portable Text description with @portabletext/react
and show the image-or-emoji-icon fallback as each event's cover.
```

## Phase G — About HMC: real committee members
```
Read REDESIGN_FIX_SPEC.md section 10 fully before doing anything.

The About HMC page currently shows 3 hardcoded committee members. Replace
this with a query against the existing `contact` Sanity schema, filtered to
category == "HMC Member", rendering each result as a member card using
whatever fields that schema has. Remove all hardcoded member data from the
page/component.
```

## Phase H — New full Mess Menu page
```
Read REDESIGN_FIX_SPEC.md section 8 fully before doing anything.

Create a new page (linked from the sidebar's "Mess & Menu" item) showing
the complete week's mess menu as a table: 7 rows (Monday through Sunday),
columns for Breakfast/Lunch/Dinner, pulled from the existing `messMenu`
Sanity documents. Below the table, add a clearly labeled link to
/raise-ticket with short instruction text: "Having a mess-related issue?
Raise a ticket under the Mess tag." This page is separate from and in
addition to the homepage's existing today-only mess menu section — don't
remove or change that homepage section.
```

## Phase I — Add-to-home-screen: throttled auto-prompt + persistent button
```
Read REDESIGN_FIX_SPEC.md section 11 fully before doing anything.

Implement home-screen install prompting:
- Capture the browser's beforeinstallprompt event (Chrome/Android) instead
  of relying on the browser's own default timing/UI.
- Show the captured prompt automatically ONCE per device: check a
  localStorage flag (e.g. hmc_install_prompt_shown) before auto-showing; if
  the user dismisses it, store a dismissal timestamp and don't auto-show
  again for at least 14 days.
- Separately, add a small, persistent "Install App" button (not prominent,
  but always visible — e.g. in the footer or a corner of the nav) that
  manually triggers the captured prompt at any time, independent of the
  auto-show throttling above.
- For iOS Safari (no beforeinstallprompt support), make the same persistent
  button instead show a short instruction: "Tap Share → Add to Home
  Screen".
```

## Phase J — Mobile search: icon-only + expand + working search
```
Read REDESIGN_FIX_SPEC.md section 12 fully before doing anything.

On mobile widths, replace the full-width search input in the header with
just a magnifying-glass icon button. On tap, animate it into an expanded
search input. On desktop, leave the existing full search bar as-is.

Then check: does the search bar currently execute a real search against
site content, or is it purely decorative with no logic behind it? If it has
no real logic, implement a basic client-side search across notices
(titles), contacts (names/categories), and service page names — typing a
query should show matching results as a simple dropdown list, each linking
to the relevant page. Tell me clearly whether search logic already existed
or whether you built it from scratch.
```

## Phase K — Final audit
```
Read REDESIGN_FIX_SPEC.md fully. Do a full audit of the site against every
section of this spec and report back a checklist of what passes and what
doesn't — don't silently fix anything in this pass, just report:

1. Is "HMC Boys Hostel" or any similar wrong branding still present
   anywhere?
2. Is emergency contacts visibly below the hero without scrolling, on both
   a mobile-width and desktop-width view?
3. Does any cursive font, dead social icon, fake statistic, or "Virtual
   Tour" button still exist anywhere?
4. Does the sidebar still contain "Student Portal" or "Student Services"?
5. Does the top bar still show "Notices & Calendar" or "Important Contacts"
   as separate items instead of a single "Emergency" link?
6. Does clicking "Today's Mess Menu" on the homepage scroll down the page,
   or does it navigate away?
7. Does the Facilities page show the real Common Rooms grid, or does it
   still just scroll back to the gallery?
8. Does the About HMC page pull real contact data, or is it still
   hardcoded?
9. Run `npm run build` and report any errors.
10. Confirm no Supabase table, RLS policy, or existing ticket-flow logic was
    modified during this entire correction pass.
```
