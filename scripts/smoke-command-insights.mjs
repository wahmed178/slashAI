/**
 * Smoke test for src/lib/command-insights.ts.
 *
 * This module backs the "when to reach for this", "fresh and trending" and
 * hashtag blocks on every one of the 5,704 command pages. Its whole value is
 * that it only ever reports things the catalogue actually says — so the test
 * is written to catch fabrication, not to check formatting:
 *
 *   1. Coverage - every category in the data has real use cases. A missing
 *      entry silently drops the block for every command under it.
 *   2. No invention - the use cases are a description of the category, never
 *      a claim about people. Nothing may contain a number, a percentage or a
 *      quote, because SlashAI has no backend to have measured any of those.
 *   3. Hashtags - derived from the command's own tags/category only, slugged
 *      safely, de-duplicated, and capped.
 *   4. Freshness and trending - sorted by the real addedAt / popularity
 *      fields, with no command appearing twice.
 *
 * Run: bun scripts/smoke-command-insights.mjs
 */
import { readFileSync } from "node:fs";
import { COMMANDS } from "../src/lib/commands.ts";
import {
  addedInLastDays,
  commandEffort,
  commandHashtags,
  freshCommands,
  hashtagString,
  isFresh,
  nicheNeighbours,
  nicheSize,
  trendingCommands,
  commandUseCase,
} from "../src/lib/command-insights.ts";

let failures = 0;
const ok = (cond, msg) => {
  if (cond) return;
  console.log(`  ❌ ${msg}`);
  failures++;
};
const group = (name) => console.log(`\n── ${name}`);

const HAS_DIGIT = /\d/;
const QUOTE_CHARS = /["“”']/;

/* ── 1. every category has use cases ─────────────────────────────────── */

group("use-case coverage");

{
  const cats = [...new Set(COMMANDS.map((c) => c.category))];
  const unmapped = cats.filter((c) => !commandUseCase({ category: c }));
  ok(unmapped.length === 0, `categories with no use cases: ${unmapped.join(", ")}`);
  console.log(`  ✅ ${cats.length} categories, all mapped`);

  for (const c of cats) {
    const uc = commandUseCase({ category: c });
    ok(uc.headline.length > 10, `thin headline for "${c}"`);
    ok(uc.jobs.length >= 3, `"${c}" has only ${uc.jobs.length} jobs, want >= 3`);
  }
  console.log("  ✅ every headline and job list is substantive");
}

/* ── 2. nothing is invented ──────────────────────────────────────────── */

group("no invented claims");

{
  // A number, a statistic or a quote in this copy would read as a claim about
  // real people that SlashAI has no way of supporting.
  const all = COMMANDS.map((c) => commandUseCase(c)).filter(Boolean);
  const offenders = [];
  for (const uc of all) {
    for (const line of [uc.headline, ...uc.jobs]) {
      if (HAS_DIGIT.test(line) || QUOTE_CHARS.test(line)) offenders.push(line);
    }
  }
  ok(
    offenders.length === 0,
    `use-case copy must contain no numbers or quotes, found ${offenders.length}: ${offenders
      .slice(0, 3)
      .join(" | ")}`,
  );
  console.log("  ✅ no digits and no quoted speech in any use-case line");
}

/* ── 3. hashtags are real and well formed ────────────────────────────── */

group("hashtags");

{
  const bad = [];
  for (const c of COMMANDS) {
    const tags = commandHashtags(c);
    if (tags.length === 0) {
      bad.push(`${c.id}: empty`);
      continue;
    }
    if (tags.length > 8) bad.push(`${c.id}: ${tags.length} tags, cap is 8`);
    if (new Set(tags).size !== tags.length) bad.push(`${c.id}: duplicates`);
    for (const t of tags) {
      if (!/^[a-z0-9-]+$/.test(t)) bad.push(`${c.id}: bad slug "${t}"`);
      if (t.startsWith("-") || t.endsWith("-")) bad.push(`${c.id}: edge dash "${t}"`);
    }
    // Every tag must be traceable to the command's own data or the brand tags.
    const own = new Set([
      ...c.tags,
      c.subcategory,
      c.category,
      "slashai",
      "aiCommands",
      "promptEngineering",
    ]);
    for (const t of tags) {
      const traceable = [...own].some((src) => src && slug(src) === t);
      if (!traceable) bad.push(`${c.id}: untraceable tag "${t}"`);
    }
  }
  ok(bad.length === 0, `hashtag problems: ${bad.slice(0, 5).join("; ")}`);
  console.log(`  ✅ all ${COMMANDS.length} commands produce clean, traceable hashtags`);

  const sample = COMMANDS[0];
  const s = hashtagString(sample);
  ok(s.startsWith("#"), `hashtagString must start with "#", got "${s}"`);
  ok(
    s.split(" ").every((h) => /^#[a-z0-9-]+$/.test(h)),
    `hashtagString produced a malformed tag: "${s}"`,
  );
  console.log(`  ✅ e.g. ${s}`);
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ── 4. freshness and trending use the real fields ────────────────────── */

group("fresh & trending");

{
  const fresh = freshCommands(6);
  ok(fresh.length === 6, `freshCommands returned ${fresh.length}, want 6`);
  for (let i = 1; i < fresh.length; i++) {
    ok(
      fresh[i - 1].addedAt >= fresh[i].addedAt,
      `freshCommands not sorted by addedAt at index ${i}`,
    );
  }
  ok(
    fresh.every((c) => c.addedAt),
    "freshCommands must never include a command with no addedAt",
  );
  console.log(`  ✅ freshCommands: newest first, ${fresh[0].addedAt} → ${fresh.at(-1).addedAt}`);

  const trending = trendingCommands(6);
  ok(trending.length === 6, `trendingCommands returned ${trending.length}, want 6`);
  for (let i = 1; i < trending.length; i++) {
    ok(
      trending[i - 1].popularity >= trending[i].popularity,
      `trendingCommands not sorted by popularity at index ${i}`,
    );
  }
  console.log(
    `  ✅ trendingCommands: popularity ${trending[0].popularity} → ${trending.at(-1).popularity}`,
  );

  const added = addedInLastDays(30);
  ok(added > 0, "addedInLastDays(30) returned 0, so 'fresh' could never be true");
  console.log(`  ✅ ${added} commands added in the last 30 days`);

  // isFresh must agree with addedInLastDays, not drift from it.
  const freshCount = COMMANDS.filter((c) => isFresh(c, 30)).length;
  ok(
    freshCount === added,
    `isFresh(30) matches ${freshCount} but addedInLastDays(30) says ${added}`,
  );
  console.log("  ✅ isFresh and addedInLastDays agree");

  // Known data defect, pinned so it cannot get worse unnoticed: a large share
  // of the catalogue carries an `addedAt` in the future. isFresh correctly
  // rejects those (a command cannot be added tomorrow), which is why
  // addedInLastDays is far below the raw date-string count. The UI labels these
  // picks "Newest" rather than "New" because of it.
  const future = COMMANDS.filter((c) => {
    const ts = Date.parse(c.addedAt);
    return !Number.isNaN(ts) && ts > Date.now();
  });
  const futurePct = ((future.length / COMMANDS.length) * 100).toFixed(1);
  ok(
    future.length / COMMANDS.length < 0.9,
    `${future.length}/${COMMANDS.length} (${futurePct}%) of commands are future-dated`,
  );
  console.log(
    `  ⚠️  known data defect: ${future.length}/${COMMANDS.length} (${futurePct}%) have a future addedAt`,
  );
  ok(
    fresh.every((c) => Date.parse(c.addedAt) <= Date.now()),
    "freshCommands must not be dominated by future-dated entries",
  );
}

/* ── 5. niche neighbours are real and never self-referential ──────────── */

group("niche neighbours");

{
  let bad = 0;
  for (const c of COMMANDS) {
    if (!c.subcategory) continue;
    const n = nicheNeighbours(c, 4);
    if (n.some((x) => x.id === c.id)) bad++;
    if (n.some((x) => x.subcategory !== c.subcategory)) bad++;
    if (n.length > 4) bad++;
  }
  ok(bad === 0, `${bad} commands returned bad niche neighbours`);
  console.log("  ✅ neighbours are same-subcategory, never the command itself");

  const withNiche = COMMANDS.filter((c) => c.subcategory);
  ok(withNiche.length > 0, "no command has a subcategory to test against");
  const size = nicheSize(withNiche[0]);
  ok(size > 0, "nicheSize returned 0 for a categorised command");
  console.log(`  ✅ e.g. "${withNiche[0].subcategory}" holds ${size} commands`);
}

/* ── 6. effort reflects the real template ────────────────────────────── */

group("effort");

{
  const multi = COMMANDS.find((c) => (c.example.match(/\[|\]|\{\{|<|>|\d+\s*=/g) ?? []).length > 2);
  if (multi) {
    const e = commandEffort(multi);
    ok(e.variables > 0, `expected variables for ${multi.id}, got ${e.variables}`);
    ok(
      e.difficulty === multi.difficulty,
      `difficulty must come from the catalogue, got "${e.difficulty}"`,
    );
    console.log(`  ✅ ${multi.id}: ${e.variables} blanks, difficulty "${e.difficulty}"`);
  } else {
    console.log("  …no command with a multi-part template, skipped");
  }
}

/* ── 7. the map itself has no dead keys ──────────────────────────────── */

group("no dead entries");

{
  const src = readFileSync(new URL("../src/lib/command-insights.ts", import.meta.url), "utf8");
  const start = src.indexOf("CATEGORY_USE_CASES");
  const body = src.slice(start, src.indexOf("export interface UseCase"));
  const keys = [...body.matchAll(/^ {2}"?([A-Za-z][^":]*)"?:\s*\{\s*$/gm)].map((m) => m[1].trim());
  const cats = new Set(COMMANDS.map((c) => c.category));
  const dead = keys.filter((k) => !cats.has(k));
  ok(dead.length === 0, `use cases defined for categories that do not exist: ${dead.join(", ")}`);
  console.log(`  ✅ ${keys.length} keys, none orphaned`);
}

if (failures === 0) {
  console.log("\n✅ command-insights: all checks passed");
} else {
  console.log(`\n❌ command-insights: ${failures} check(s) failed`);
}
process.exit(failures ? 1 : 0);
