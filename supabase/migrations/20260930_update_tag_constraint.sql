-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: Update tickets.tag CHECK constraint
-- Drop 'LAN' and add: 'Mess', 'Plumbing/Water', 'Elevator', 'Cleanliness',
-- 'Pests', 'Others'. Remove: 'LAN', 'Lift', 'Other' (old spellings).
--
-- ⚠️  WARNING — READ BEFORE RUNNING ⚠️
-- Any existing row with tag = 'LAN', tag = 'Lift', or tag = 'Other' will
-- VIOLATE this new constraint the moment it is applied. Postgres will REJECT
-- the ALTER TABLE and roll back if any such rows exist.
-- Before running this migration, decide what to do with those rows, e.g.:
--
--   -- Option A: Reassign LAN tickets to 'Electrical' (closest functional match)
--   UPDATE tickets SET tag = 'Electrical'   WHERE tag = 'LAN';
--   UPDATE tickets SET tag = 'Others'       WHERE tag = 'Lift';
--   UPDATE tickets SET tag = 'Others'       WHERE tag = 'Other';
--
--   -- Option B: Delete them (only if they are test / disposable tickets)
--   DELETE FROM tickets WHERE tag IN ('LAN', 'Lift', 'Other');
--
-- Run whichever block fits your situation BEFORE the ALTER TABLE below, or
-- wrap everything in a transaction and handle it in one go.
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

-- 1. Drop the old CHECK constraint by name.
--    The constraint name was set automatically by Postgres; check with:
--      \d tickets   (psql) or  Information Schema query below.
--    Typical auto-generated name: tickets_tag_check
--    If yours differs, replace the name below accordingly.
ALTER TABLE tickets
  DROP CONSTRAINT IF EXISTS tickets_tag_check;

-- 2. Add the new CHECK constraint with the updated tag list.
ALTER TABLE tickets
  ADD CONSTRAINT tickets_tag_check
  CHECK (tag IN (
    'Mess',
    'Electrical',
    'Plumbing/Water',
    'Elevator',
    'Cleanliness',
    'Pests',
    'Others'
  ));

COMMIT;

-- ─────────────────────────────────────────────────────────────────────────────
-- Helper query — find the actual constraint name if needed:
-- SELECT conname FROM pg_constraint
--   WHERE conrelid = 'tickets'::regclass AND contype = 'c' AND conname LIKE '%tag%';
-- ─────────────────────────────────────────────────────────────────────────────
