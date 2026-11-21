/**
 * One-time seed script to create Wing Representative documents in Sanity for session 2026-27.
 *
 * DO NOT RUN VIA AUTOMATED AGENT.
 * Run manually using:
 *   node --env-file=.env.local scripts/seed-wing-reps.mjs
 * Or:
 *   SANITY_WRITE_TOKEN="your_token" node scripts/seed-wing-reps.mjs
 * Or in PowerShell:
 *   $env:SANITY_WRITE_TOKEN="your_token"; node scripts/seed-wing-reps.mjs
 */

import { createClient } from "next-sanity";
import fs from "node:fs";
import path from "node:path";

// Attempt to load .env.local for NEXT_PUBLIC_SANITY_* variables
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
        // Remove trailing comments and quotes
        let value = trimmed.slice(idx + 1).trim();
        const hashIdx = value.indexOf("#");
        if (hashIdx !== -1) {
          value = value.slice(0, hashIdx).trim();
        }
        value = value.replace(/^["']|["']$/g, "").trim();
        if (value && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnvLocal();

// Token MUST come from SANITY_WRITE_TOKEN as specified
const token = process.env.SANITY_WRITE_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-28";

if (!token) {
  console.error("❌ Error: Missing SANITY_WRITE_TOKEN environment variable.");
  console.error("   Provide a Sanity token with Write permissions to seed wing representatives.");
  console.error("   Example (bash): SANITY_WRITE_TOKEN=\"your_token\" node scripts/seed-wing-reps.mjs");
  console.error("   Example (PowerShell): $env:SANITY_WRITE_TOKEN=\"your_token\"; node scripts/seed-wing-reps.mjs\n");
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

// Seed data: floor | wing | name | roomNo | phone (10 digits)
// Do not store roll numbers
const WING_REPRESENTATIVES = [
  { floor: "Ground", wing: "Square", name: "Deepak", roomNo: "Sq-065", phone: "6396042845", order: 1 },
  { floor: "1", wing: "Square", name: "Shubham Sharma", roomNo: "Sq-162", phone: "8000870259", order: 1 },
  { floor: "2", wing: "A", name: "Aryan Gawai", roomNo: "A208", phone: "9970130185", order: 1 },
  { floor: "2", wing: "B", name: "Laksh Saini", roomNo: "B205", phone: "8114401820", order: 2 },
  { floor: "2", wing: "C", name: "Harshvardhan", roomNo: "C203", phone: "9636045314", order: 3 },
  { floor: "2", wing: "Square", name: "Naveen", roomNo: "Sq-202", phone: "7976122485", order: 4 },
  { floor: "3", wing: "A", name: "Rajeev Ranjan", roomNo: "A301", phone: "7739607982", order: 1 },
  { floor: "3", wing: "B", name: "Nishit Gamit", roomNo: "B301", phone: "7862946234", order: 2 },
  { floor: "3", wing: "C", name: "Sparsh Kumat", roomNo: "C307", phone: "9929120575", order: 3 },
  { floor: "3", wing: "Square", name: "Harsh Verma", roomNo: "Sq-368", phone: "7779837990", order: 4 },
  { floor: "4", wing: "A", name: "Deepak Jyoti", roomNo: "A403", phone: "8789733461", order: 1 },
  { floor: "4", wing: "B", name: "Noor Hasan", roomNo: "B411", phone: "8228891786", order: 2 },
  { floor: "4", wing: "C", name: "Hemal Parmar", roomNo: "C417", phone: "8799437728", order: 3 },
  { floor: "4", wing: "Square", name: "Akarsh Singh", roomNo: "Sq-401", phone: "9235841860", order: 4 },
  { floor: "5", wing: "A", name: "Parmeshwar Pandey", roomNo: "A517", phone: "9936294660", order: 1 },
  { floor: "5", wing: "B", name: "Harshit Jain", roomNo: "B513", phone: "8529810953", order: 2 },
  { floor: "5", wing: "C", name: "Rohit Yadav", roomNo: "C507", phone: "9782355444", order: 3 },
  { floor: "5", wing: "Square", name: "Chaitanya Mishra", roomNo: "Sq-504", phone: "7903123554", order: 4 },
  { floor: "6", wing: "A", name: "Ashish Kumar", roomNo: "A605", phone: "7366813811", order: 1 },
  { floor: "6", wing: "B", name: "Ashish Yadav", roomNo: "B607", phone: "9257596056", order: 2 },
  { floor: "6", wing: "C", name: "Mitul Patel", roomNo: "C613", phone: "8780563845", order: 3 },
  { floor: "6", wing: "Square", name: "Aryaman Kushwaha", roomNo: "Sq-663", phone: "8957289094", order: 4 },
  { floor: "7", wing: "A", name: "Praveen Kumar", roomNo: "A701", phone: "8143673201", order: 1 },
  { floor: "7", wing: "B", name: "Himanshu Singh", roomNo: "B706", phone: "7084953788", order: 2 },
  { floor: "7", wing: "C", name: "Bharat Lal Pal", roomNo: "C702", phone: "9569232931", order: 3 },
  { floor: "7", wing: "Square", name: "Sugandh Jha", roomNo: "Sq-764", phone: "8780948040", order: 4 },
  { floor: "8", wing: "A", name: "Nirlep", roomNo: "A801", phone: "9724586491", order: 1 },
  { floor: "8", wing: "B", name: "Amit Kumar", roomNo: "B804", phone: "6203770930", order: 2 },
  { floor: "8", wing: "C", name: "Harshal", roomNo: "C801", phone: "9525458798", order: 3 },
  { floor: "8", wing: "Square", name: "Arpit Srivastava", roomNo: "Sq-869", phone: "9044924351", order: 4 },
];

async function seed() {
  console.log(`\n🔍 Checking for existing wingRep documents in dataset "${dataset}"...`);

  // Refuse to run if any wingRep documents already exist
  const existingCount = await client.fetch('count(*[_type == "wingRep"])');
  if (existingCount > 0) {
    console.error(`\n❌ Refusing to run: ${existingCount} wingRep document(s) already exist in dataset "${dataset}".`);
    console.error("   Aborting to prevent duplicate entries.\n");
    process.exit(1);
  }

  console.log(`\n🚀 Seeding ${WING_REPRESENTATIVES.length} Wing Representatives to Sanity (Project: ${projectId}, Dataset: ${dataset})...\n`);

  let count = 0;
  for (const rep of WING_REPRESENTATIVES) {
    const doc = {
      _type: "wingRep",
      floor: rep.floor,
      wing: rep.wing,
      name: rep.name,
      roomNo: rep.roomNo,
      phone: rep.phone,
      order: rep.order,
    };

    try {
      await client.create(doc);
      count++;
      console.log(`  ✓ Created: Floor ${rep.floor} — Wing ${rep.wing} — ${rep.name} (${rep.roomNo})`);
    } catch (err) {
      console.error(`  ✗ Failed to create Floor ${rep.floor} — Wing ${rep.wing} — ${rep.name}:`, err.message);
    }
  }

  console.log(`\n🎉 Completed! Successfully seeded ${count}/${WING_REPRESENTATIVES.length} wing representatives for session 2026-27.\n`);
}

seed().catch((err) => {
  console.error("Fatal error running seed script:", err);
  process.exit(1);
});
