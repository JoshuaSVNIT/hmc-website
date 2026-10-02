-- Migration: Add phone_no column to tickets table
-- Run this in: Supabase dashboard → SQL Editor → paste → Run

ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS phone_no TEXT DEFAULT NULL;
