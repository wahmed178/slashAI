/**
 * Refresh "Last checked" (lastVerified) dates in the resource catalog files
 * to today. Runs on a weekly GitHub Actions schedule so the What's New and
 * hub pages never show stale check dates.
 *
 * Surgical by design: only the lastVerified field values change - curated
 * dates (published, addedDate, lastUpdated) and URLs are never touched.
 *
 * Usage: node scripts/refresh-resource-dates.cjs
 */
const fs = require("fs");
const path = require("path");

const today = new Date().toISOString().split("T")[0];

const TARGETS = [
  "src/lib/resources.ts",
  "src/lib/resources-extra.ts",
  "src/lib/hub-founders.ts",
  "src/lib/hub-india.ts",
  "src/lib/hub-finance.ts",
  "src/lib/hub-health.ts",
];

/**
 * Matches lastVerified values in the shapes used across the catalog:
 *   lastVerified: "2026-08-22"   (inline literal)
 *   const V = "2026-09-17"       (resources.ts shared verified constant)
 * Curated dates (published, addedDate, lastUpdated, D) are never touched.
 */
const PATTERNS = [
  /(lastVerified:\s*")(20\d{2}-\d{2}-\d{2})(")/g,
  /(const V = ")(20\d{2}-\d{2}-\d{2})(")/g,
];

let changedFiles = 0;

for (const rel of TARGETS) {
  const file = path.join(__dirname, "..", rel);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");

  let after = before;
  for (const pattern of PATTERNS) {
    after = after.replace(pattern, `$1${today}$3`);
  }

  if (after !== before) {
    fs.writeFileSync(file, after);
    changedFiles++;
    console.log(`updated ${rel}`);
  } else {
    console.log(`already current: ${rel}`);
  }
}

if (changedFiles === 0) {
  console.log("all check dates already current - nothing to do");
} else {
  console.log(`refreshed lastVerified in ${changedFiles} file(s) to ${today}`);
}
