import { createClient } from "@sanity/client";

const MENU = [
  { day: "Monday", breakfast: "Poha, Tea, Milk, Coffee, Cornflakes, Sprouts, Bread butter, Jam, Banana",
    lunch: "Bhindi aloo, Chauli, Curd, Roti, Dal, Rice, Gujarati dal",
    dinner: "Aloo mutter, Soya vadi pulav, Dal, Roti, Salad, Sambhar" },
  { day: "Tuesday", breakfast: "Thepla, Aloo sabji, Tea, Coffee, Milk, Cornflakes, Bread butter, Jam",
    lunch: "Aloo chips, Dal makhani, Rice, Dal, Roti, Salad, Gujarati dal",
    dinner: "Aloo paratha, Dal, Curd, Rice, Salad, Sambhar" },
  { day: "Wednesday", breakfast: "Masala idli sambhar / Medu vada sambhar, Tea, Coffee, Milk, Cornflakes, Sprouts",
    lunch: "Soyabin, Chanadal palak, Curd, Rice, Dal, Roti, Salad, Gujarati dal",
    dinner: "Egg curry / Egg kheema, Kadhai paneer / Paneer bhurji, Roti, Rice, Dal, Salad, Sambhar" },
  { day: "Thursday", breakfast: "Aloo tikki / Bread pakoda, Bread butter, Jam, Tea, Coffee, Milk, Cornflakes",
    lunch: "Aloo palak, White mutter aloo, Buttermilk, Rice, Dal, Roti, Salad, Gujarati dal",
    dinner: "Chhole bhature / Aloo sabji, Puri, Khir / Custard, Rice, Dal, Salad, Sambhar" },
  { day: "Friday", breakfast: "Masala vada pav / Dabeli, Bread butter, Jam, Tea, Coffee, Milk, Cornflakes",
    lunch: "Lauki, Rajma masala, Dal, Rice, Roti, Curd, Gujarati dal, Salad, Dahi",
    dinner: "Soyabin, Chanadal palak, Rice, Dal, Roti, Salad, Gujarati dal" },
  { day: "Saturday", breakfast: "Ragda samosa, Bread butter, Jam, Tea, Coffee, Milk, Cornflakes",
    lunch: "Aloo gobhi, Kadhi pakoda, Buttermilk, Roti, Rice, Dal, Gujarati dal, Salad",
    dinner: "Dal bati, Mix veg, Roti, Rice, Gud, Salad, Sambhar, MESS OFF" },
  { day: "Sunday", breakfast: "Uttapam, Bread butter, Jam, Tea, Coffee, Milk, Cornflakes, Sprouts",
    lunch: "Paneer masala / Egg curry, Jeera rice, Dal fry, Sweet, Fryums, Salad, Achar",
    dinner: "Malai kofta, Dahi vada / Veg raita, Dal tadka, Peas pulao, Roti, Salad, Sambhar" },
];

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

const missing = [];
if (!projectId) missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
if (!dataset) missing.push("NEXT_PUBLIC_SANITY_DATASET");
if (!token) missing.push("SANITY_WRITE_TOKEN");

if (missing.length > 0) {
  console.error(`Error: Missing required environment variable(s): ${missing.join(", ")}`);
  process.exit(1);
}

const apply = process.argv.includes("--apply");

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const QUERY = `*[_type == "messMenu" && day == $day]{_id, breakfast, lunch, dinner}`;

async function main() {
  console.log(`Mode: ${apply ? "APPLY (writing to Sanity)" : "DRY RUN (no changes will be written)"}`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of MENU) {
    const existingDocs = await client.fetch(QUERY, { day: item.day });

    if (existingDocs.length === 0) {
      console.log(`${item.day}: create — text changed (new document: breakfast="${item.breakfast}", lunch="${item.lunch}", dinner="${item.dinner}")`);
      if (apply) {
        await client.create({
          _type: "messMenu",
          day: item.day,
          breakfast: item.breakfast,
          lunch: item.lunch,
          dinner: item.dinner,
        });
      }
      created++;
    } else if (existingDocs.length === 1) {
      const doc = existingDocs[0];
      const fields = ["breakfast", "lunch", "dinner"];
      const diffs = [];

      for (const field of fields) {
        const oldVal = doc[field] ?? "";
        const newVal = item[field];
        if (oldVal !== newVal) {
          diffs.push({ field, oldVal, newVal });
        }
      }

      if (diffs.length > 0) {
        console.log(`${item.day}: update — text changed (id: ${doc._id})`);
        for (const d of diffs) {
          console.log(`  ${d.field}: "${d.oldVal}" -> "${d.newVal}"`);
        }
      } else {
        console.log(`${item.day}: update — no text change (id: ${doc._id})`);
      }

      if (apply) {
        await client
          .patch(doc._id)
          .set({
            breakfast: item.breakfast,
            lunch: item.lunch,
            dinner: item.dinner,
          })
          .commit();
      }
      updated++;
    } else {
      const ids = existingDocs.map((d) => d._id).join(", ");
      console.log(`${item.day}: skip — WARNING: ${existingDocs.length} documents found (${ids}), skipping`);
      skipped++;
    }
  }

  console.log(`\nSummary (${apply ? "applied" : "dry run"}): created=${created}, updated=${updated}, skipped=${skipped}`);
}

main().catch((err) => {
  console.error("Error updating mess menu:", err);
  process.exit(1);
});
