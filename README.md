# HMC Website — Swami Vivekanand Bhavan

Website for the Hostel Management Committee: complaint ticketing, emergency contacts, LAN/electrical guides, notices, gallery, event registration, an esports leaderboard, and a dynamic mess menu.

Built from the "Fix the LIFT. Fix the LAN" manifesto.

## Docs
- [`PROJECT_SPEC.md`](./PROJECT_SPEC.md) — full spec: tech stack, routes, DB schema, security rules, feature list. Read this before making changes.
- [`SETUP_GUIDE.md`](./SETUP_GUIDE.md) — one-time account/env setup (GitHub, Supabase, Sanity, Vercel).
- [`ANTIGRAVITY_PROMPTS.md`](./ANTIGRAVITY_PROMPTS.md) — staged build prompts, run one phase at a time.

## Tech stack
- **Frontend:** Next.js (App Router, TypeScript), Tailwind CSS
- **Hosting:** Vercel
- **Database / Auth / Realtime:** Supabase (Postgres)
- **CMS:** Sanity (gallery, notices, events, mess menu)

## Key architectural decisions
- **No resident login.** Tickets are tracked via a `ticket_code` + a `localStorage`-based recent-tickets list, not user accounts.
- **No PDF library.** Tickets are exported via the browser's native `window.print()` with a `@media print` stylesheet — zero added dependencies.
- **Strict RLS.** Anonymous users can insert tickets and read only the exact ticket they have the code for; only authenticated HMC admins can list/update all tickets.
- **Feature toggles.** Event-specific pages (leaderboard, registrations) are hidden via `NEXT_PUBLIC_SHOW_*` env vars — flip the var and redeploy, no code change needed to hide/show them.
- **Mess menu lives in Sanity**, not in code — HMC members update it directly in Sanity Studio.

Full detail on all of the above is in `PROJECT_SPEC.md`.

## Local development
```bash
npm install
cp .env.example .env.local   # fill in real values — see SETUP_GUIDE.md
npm run dev
```

## Environment variables
See `PROJECT_SPEC.md` section 5 for the full list and `SETUP_GUIDE.md` for where to get each value. Never commit `.env.local`.

## Contributing (HMC members / teammates)
1. Pull latest `main`.
2. One feature per branch/commit — don't bundle unrelated changes.
3. Test locally (`npm run dev`) before pushing.
4. If you used Antigravity/Copilot to generate a change, review the diff yourself before committing — don't commit unreviewed agent output.
