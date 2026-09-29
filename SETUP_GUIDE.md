# Setup Guide — do this before Phase 0

## 1. GitHub
- Create a repo: `hmc-website` (private is fine to start).
- Clone it locally: `git clone <repo-url> && cd hmc-website`

## 2. Node.js
- Install Node.js LTS if you don't have it.
- Confirm: `node -v` and `npm -v` work in your terminal.

## 3. Supabase
- Create account at supabase.com → New Project → name it `hmc-website`.
- Go to Project Settings → API Keys (the "Publishable and secret API keys" tab, not "Legacy"). Copy:
  - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
  - Publishable key (`sb_publishable_...`) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - Secret key (`sb_secret_...`) → `SUPABASE_SECRET_KEY` (keep this one secret — server only, bypasses RLS)
- Go to SQL Editor → paste the full schema from `PROJECT_SPEC.md` section 4 (tables, the `get_ticket_by_code` function, and RLS policies) → Run.
- Go to Storage → create a private bucket named exactly `ticket-photos`, cap object size at 5MB in its settings.
- Go to Authentication → add the HMC members' emails manually (or set up email/password signup restricted to your institute domain).

## 4. Sanity
- Run `npm create sanity@latest` in a `sanity/` subfolder (or sanity.io/manage → Create Project).
- Note the Project ID → `NEXT_PUBLIC_SANITY_PROJECT_ID`.
- Dataset name (usually `production`) → `NEXT_PUBLIC_SANITY_DATASET`.
- Only generate an API token if you plan to write to Sanity from the Next.js app itself (not needed if HMC members just use Sanity Studio directly to upload).

## 5. Vercel
- Create account at vercel.com, connect your GitHub.
- Import the `hmc-website` repo (you can do this even before it has real code — first deploy can just be the scaffold).
- Add the environment variables from `.env.example` in Vercel's Project Settings → Environment Variables, using your real Supabase/Sanity values.

## 6. Local env file
- Copy `.env.example` to `.env.local` and fill in the real values.
- Confirm `.env.local` is in `.gitignore` (Next.js includes this by default — double check).

## 7. Antigravity
- Install Antigravity, sign in with your Google account.
- Open the `hmc-website` folder as the workspace.
- Keep `PROJECT_SPEC.md` and `.env.example` visible in the file tree so the agent can reference them.
- Run Phase 0 from `ANTIGRAVITY_PROMPTS.md`.

## 8. Keep-alive for Supabase free tier
- Free Supabase projects pause after 7 days of total inactivity.
- Add a GitHub Actions workflow that pings your Supabase URL every 3–4 days (a simple `curl` step on a cron schedule) to keep it awake — ask Antigravity or Copilot to write this once the repo exists; it's a 15-line YAML file.

## Order of operations from here
1. Steps 1–6 above (accounts + env vars)
2. Phase 0 in Antigravity (scaffold)
3. First deploy to Vercel — confirm the empty pages load live
4. Phases 1 → 8, one at a time, committing after each
