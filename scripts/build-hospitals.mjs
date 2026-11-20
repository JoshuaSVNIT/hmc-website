// Usage: node scripts/build-hospitals.mjs --updated=YYYY-MM-DD --source="Source description" [--out=path/to/output.json]
// Example:
// node scripts/build-hospitals.mjs --updated=2026-11-21 --source="FHPL network hospital list (ICICI Lombard, Surat)"

import fs from "fs";
import path from "path";
import Papa from "papaparse";

// Parse CLI flags
const args = process.argv.slice(2);
let updated = "";
let source = "";
let outPath = "src/data/network-hospitals.json";
let csvPath = "data-src/network-hospitals.csv";

for (const arg of args) {
  if (arg.startsWith("--updated=")) {
    updated = arg.slice("--updated=".length);
  } else if (arg.startsWith("--source=")) {
    source = arg.slice("--source=".length);
  } else if (arg.startsWith("--out=")) {
    outPath = arg.slice("--out=".length);
  } else if (arg.startsWith("--in=")) {
    csvPath = arg.slice("--in=".length);
  }
}

// Clean helper for name and address
function cleanText(str) {
  if (!str) return "";
  let s = String(str);
  s = s.replace(/&Acirc;&nbsp;/g, " ");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&amp;/g, "&");
  s = s.replace(/\s+/g, " ");
  return s.trim();
}

function cleanAddress(str) {
  let s = cleanText(str);
  // strip trailing commas from address
  s = s.replace(/,+$/, "").trim();
  return s;
}

function cleanPhones(str) {
  if (!str) return [];
  // split ContactDetails on commas, slashes and semicolons
  const parts = String(str).split(/[,/;]+/);
  // keep digits only, drop empties, dedupe
  const digitsList = parts
    .map((p) => p.replace(/\D/g, "").trim())
    .filter((d) => d.length > 0);
  return Array.from(new Set(digitsList));
}

// Read CSV
const csvContent = fs.readFileSync(path.resolve(csvPath), "utf-8");
const parsed = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: "greedy",
});

const hospitals = [];
let rowsWithoutPhone = 0;
const entityWarnings = [];

for (let i = 0; i < parsed.data.length; i++) {
  const row = parsed.data[i];
  const name = cleanText(row.HospitalName);
  const address = cleanAddress(row.Address);
  const phones = cleanPhones(row.ContactDetails);

  if (!name && !address) continue;

  if (phones.length === 0) {
    rowsWithoutPhone++;
  }

  // Check for remaining &...; pattern
  const entityRegex = /&[a-zA-Z0-9#]+;/g;
  const nameEntities = name.match(entityRegex);
  const addrEntities = address.match(entityRegex);
  if (nameEntities || addrEntities) {
    entityWarnings.push({
      row: i + 1,
      name,
      entities: [...(nameEntities || []), ...(addrEntities || [])],
    });
  }

  hospitals.push({
    name,
    address,
    phones,
  });
}

const outputData = {
  updated,
  source,
  hospitals,
};

// Ensure output directory exists
const targetDir = path.dirname(path.resolve(outPath));
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.resolve(outPath), JSON.stringify(outputData, null, 2) + "\n", "utf-8");

console.log(`Total rows processed: ${hospitals.length}`);
console.log(`Rows without phone: ${rowsWithoutPhone}`);

if (entityWarnings.length > 0) {
  console.warn(`WARNING: Found remaining '&...;' entities in ${entityWarnings.length} row(s):`);
  for (const w of entityWarnings) {
    console.warn(`  Row ${w.row} (${w.name}): ${w.entities.join(", ")}`);
  }
} else {
  console.log("No remaining HTML entities found.");
}

