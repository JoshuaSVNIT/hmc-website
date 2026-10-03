/**
 * One-time seed script to create 21 Common Room documents in Sanity.
 * Generates 1 room per wing (A, B, C) for floors 2 through 8 (7 floors x 3 wings = 21 rooms).
 *
 * DO NOT RUN VIA AUTOMATED AGENT.
 * Run manually using:
 *   node --env-file=.env.local scripts/seed-common-rooms.mjs
 * Or:
 *   SANITY_WRITE_TOKEN="your_token" node scripts/seed-common-rooms.mjs
 */

import { createClient } from "next-sanity";
import fs from "node:fs";
import path from "node:path";

// Attempt to load .env.local if variables are missing
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnvLocal();

const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-28";

if (!token) {
  console.error("❌ Error: Missing SANITY_WRITE_TOKEN (or SANITY_API_TOKEN) environment variable.");
  console.error("   Provide a Sanity token with Write permissions to seed common rooms.");
  console.error("   Example: SANITY_WRITE_TOKEN=\"your_token\" node scripts/seed-common-rooms.mjs\n");
  process.exit(1);
}

if (!projectId || !dataset) {
  console.error("❌ Error: Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in environment.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const WINGS = ["A", "B", "C"];
const FLOORS = [2, 3, 4, 5, 6, 7, 8];

async function seed() {
  console.log(`\n🚀 Seeding 21 Common Rooms to Sanity (Project: ${projectId}, Dataset: ${dataset})...\n`);

  let count = 0;
  for (const floor of FLOORS) {
    for (const wing of WINGS) {
      const docId = `commonRoom-${floor}-${wing.toLowerCase()}`;
      const doc = {
        _id: docId,
        _type: "commonRoom",
        wing,
        floor,
        label: "", // Empty string as requested, to be filled in via Sanity Studio
      };

      try {
        await client.createOrReplace(doc);
        count++;
        console.log(`  ✓ Created/verified: Floor ${floor} — Wing ${wing} (ID: ${docId})`);
      } catch (err) {
        console.error(`  ✗ Failed to create Floor ${floor} — Wing ${wing}:`, err.message);
      }
    }
  }

  console.log(`\n🎉 Completed! Successfully seeded ${count}/21 common rooms.\n`);
  console.log("You can now open Sanity Studio (/studio) to edit the labels, photos, and icons for each common room.\n");
}

seed().catch((err) => {
  console.error("Fatal error running seed script:", err);
  process.exit(1);
});
