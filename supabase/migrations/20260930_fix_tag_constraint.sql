-- Fix: update tickets.tag CHECK constraint to match current application tags.
-- Run this in: Supabase dashboard → SQL Editor → paste → Run
--
-- Safe to run even if the table has no existing tickets (DROP IF EXISTS is no-op).
-- If you DO have existing rows with old tags ('LAN', 'Plumbing', 'Lift', 'Other'),
-- the ALTER TABLE will fail. In that case, run the UPDATE lines first.
-- (Unlikely on a fresh install.)

BEGIN;

-- Optional: remap any old-tag rows if they exist
-- UPDATE tickets SET tag = 'Others'     WHERE tag IN ('LAN', 'Lift', 'Other');
-- UPDATE tickets SET tag = 'Plumbing/Water' WHERE tag = 'Plumbing';

-- Drop old constraint
ALTER TABLE tickets
  DROP CONSTRAINT IF EXISTS tickets_tag_check;

-- Add new constraint matching all current app tags
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
