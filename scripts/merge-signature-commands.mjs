/**
 * Re-appends the curated signature commands (scripts/data/signature-commands.json)
 * after a catalog regeneration. The generator composes from parts/*.mjs and does
 * not know about hand-curated additions, so this script runs right after it —
 * it is chained into the `catalog:build` package script.
 *
 * Idempotent: skips commands whose name or id already exists.
 * Run: bun scripts/merge-signature-commands.mjs
 */
import fs from "node:fs";

const FILE = "src/data/commands.json";
const SIGNATURE = "scripts/data/signature-commands.json";

const catalog = JSON.parse(fs.readFileSync(FILE, "utf8"));
const signature = JSON.parse(fs.readFileSync(SIGNATURE, "utf8"));

const existingNames = new Set(catalog.map((c) => c.command.toLowerCase()));
const existingIds = new Set(catalog.map((c) => c.id));

let added = 0;
let skipped = 0;
for (const cmd of signature) {
  if (existingNames.has(cmd.command.toLowerCase()) || existingIds.has(cmd.id)) {
    skipped++;
    continue;
  }
  catalog.push(cmd);
  existingNames.add(cmd.command.toLowerCase());
  existingIds.add(cmd.id);
  added++;
}

fs.writeFileSync(FILE, JSON.stringify(catalog, null, 0) + "\n");
console.log(
  `signature commands: added ${added}, skipped ${skipped} (already present), total ${catalog.length}`,
);

// Register any subcategories the appended commands introduced so the category
// filters stay complete (the generator only knows about its own catalog).
const CATS = "src/data/categories.json";
const cats = JSON.parse(fs.readFileSync(CATS, "utf8"));
const byCat = new Map(cats.map((c) => [c.category, c]));
let subsAdded = 0;
for (const c of catalog) {
  const entry = byCat.get(c.category);
  if (!entry) continue;
  if (!entry.subcategories.includes(c.subcategory)) {
    entry.subcategories.push(c.subcategory);
    entry.subcategories.sort();
    subsAdded++;
  }
}
if (subsAdded > 0) {
  fs.writeFileSync(CATS, JSON.stringify(cats, null, 2) + "\n");
  console.log(`categories.json: registered ${subsAdded} new subcategories`);
}
