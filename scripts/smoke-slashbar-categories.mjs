/**
 * Smoke test for src/lib/slashbar-categories.ts.
 *
 * SlashBar is now the site's single hub, and a category is an index across six
 * different tables. That makes three classes of bug possible and all of them
 * are silent, so each is checked here:
 *
 *   1. Fabrication - a count on a category page must be a count of real rows.
 *      Every item is re-checked against its source table, so a match that came
 *      from nothing (or a duplicate) fails the build.
 *   2. Content loss - the retired /hub/* routes defined 196 hand-curated
 *      resources inline. If the extractor or the index drops one, that is a
 *      deleted page's worth of curated content gone with no other signal.
 *   3. Dangling redirects - /hub/<audience> has to point at a category that
 *      actually exists, or the redirect lands on a 404.
 *
 * Run: bun scripts/smoke-slashbar-categories.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { COMMANDS } from "../src/lib/commands.ts";
import { ALL_SLASH_TOOLS } from "../src/lib/slashkits.ts";
import { DECLARATIVE_TOOLS } from "../src/lib/toolkit/catalog.ts";
import { ALL_PLAY_GAMES } from "../src/lib/slashplay.ts";
import { ALL_BLOG_POSTS } from "../src/lib/blog-guides.ts";
import { RESOURCES } from "../src/lib/resources.ts";
import { ISLAM_RESOURCES } from "../src/lib/hub-islam.ts";
import { URDU_RESOURCES } from "../src/lib/hub-urdu.ts";
import { ARABIC_RESOURCES, ARABIC_ALPHABET } from "../src/lib/hub-arabic.ts";
import { FUN_SITES } from "../src/lib/hub-fun.ts";
import { QUOTES } from "../src/lib/hub-quotes.ts";
import {
  HUB_REDIRECTS,
  SLASH_CATEGORIES,
  categoryContents,
  categorySummaries,
} from "../src/lib/slashbar-categories.ts";

let failures = 0;
const ok = (cond, msg) => {
  if (cond) return;
  console.log(`  ❌ ${msg}`);
  failures++;
};
const group = (name) => console.log(`\n── ${name}`);

/**
 * Fun-site links that were still plain http when the list was extracted. Five
 * of the seven were confirmed to serve https and were upgraded; these two did
 * not answer from the build sandbox, so they were left exactly as the original
 * curator wrote them rather than rewritten on a guess. Re-check them and delete
 * this set when they are fixed.
 */
const KNOWN_HTTP = new Set([
  "http://hyperphysics.phy-astr.gsu.edu",
  "http://www.donothingfor2minutes.com",
]);

/* ── 1. every category is reachable and non-empty ─────────────────────── */

group("categories");

{
  ok(SLASH_CATEGORIES.length === 14, `expected 14 categories, got ${SLASH_CATEGORIES.length}`);
  const slugs = new Set(SLASH_CATEGORIES.map((c) => c.slug));
  ok(slugs.size === SLASH_CATEGORIES.length, "duplicate category slugs");

  for (const def of SLASH_CATEGORIES) {
    ok(def.keywords.length > 0, `${def.slug} has no keywords`);
    ok(def.desc.length > 10, `${def.slug} has a thin description`);
  }

  for (const s of categorySummaries()) {
    ok(
      s.total > 0,
      `category "${s.def.slug}" is completely empty - it would render as a dead page`,
    );
  }
  console.log(`  ✅ ${SLASH_CATEGORIES.length} categories, none empty`);
  for (const s of categorySummaries()) {
    console.log(
      `     ${s.def.slug.padEnd(14)} ${String(s.total).padStart(5)} items ` +
        `(cmd ${s.counts.commands}, tools ${s.counts.tools}, res ${s.counts.resources}, games ${s.counts.games})`,
    );
  }
}

/* ── 2. counts are counts of real rows ────────────────────────────────── */

group("counts match the source tables");

{
  const toolSlugs = new Set([
    ...ALL_SLASH_TOOLS.map((t) => t.slug),
    ...DECLARATIVE_TOOLS.map((t) => t.slug),
  ]);
  const gameSlugs = new Set(ALL_PLAY_GAMES.map((g) => g.slug));
  const blogSlugs = new Set(ALL_BLOG_POSTS.map((p) => p.slug));
  const commandIds = new Set(COMMANDS.map((c) => c.id));
  const catalogueUrls = new Set(RESOURCES.map((r) => r.url));

  for (const def of SLASH_CATEGORIES) {
    const c = categoryContents(def.slug);

    for (const t of c.tools) {
      ok(toolSlugs.has(t.slug), `${def.slug}: tool "${t.slug}" is not a real tool`);
    }
    for (const g of c.games) {
      ok(gameSlugs.has(g.slug), `${def.slug}: game "${g.slug}" is not a real game`);
    }
    for (const a of c.articles) {
      ok(blogSlugs.has(a.slug), `${def.slug}: article "${a.slug}" is not a real article`);
    }
    for (const cmd of c.commands) {
      ok(commandIds.has(cmd.id), `${def.slug}: command "${cmd.id}" is not in the catalogue`);
    }
    for (const r of c.resources) {
      ok(
        catalogueUrls.has(r.url) || r.source === "curated" || r.source === "dedicated",
        `${def.slug}: resource "${r.name}" (${r.url}) has no traceable source`,
      );
      ok(
        r.url.startsWith("https://") || KNOWN_HTTP.has(r.url),
        `${def.slug}: resource "${r.name}" (${r.url}) is plain http and is not a known exception`,
      );
    }

    // No duplicates within a bucket - a repeated card is a visible bug, and
    // the same url reaching the list from two different sources is the easiest
    // way to accidentally cause one.
    ok(
      new Set(c.tools.map((t) => t.slug)).size === c.tools.length,
      `${def.slug}: duplicate tools`,
    );
    ok(
      new Set(c.resources.map((r) => r.url)).size === c.resources.length,
      `${def.slug}: duplicate resource urls`,
    );
    ok(
      new Set(c.commands.map((x) => x.id)).size === c.commands.length,
      `${def.slug}: duplicate commands`,
    );

    // The headline total must equal the sum of its parts.
    const sum =
      c.counts.commands +
      c.counts.tools +
      c.counts.games +
      c.counts.articles +
      c.counts.resources +
      c.counts.quotes +
      c.counts.apps;
    ok(sum === c.counts.total, `${def.slug}: total ${c.counts.total} != sum of parts ${sum}`);
  }
  console.log("  ✅ every item traces back to a real row, no duplicates, totals add up");
}

/* ── 3. nothing curated was lost when the hubs were retired ───────────── */

group("curated hub content survived");

{
  // These five lists were defined inline inside the old /hub/* route files and
  // exist nowhere else in the repo. Their expected sizes are pinned so a
  // truncated extraction fails loudly instead of quietly shrinking a page.
  const expected = [
    ["ISLAM_RESOURCES", ISLAM_RESOURCES, 52],
    ["URDU_RESOURCES", URDU_RESOURCES, 8],
    ["ARABIC_RESOURCES", ARABIC_RESOURCES, 4],
    ["ARABIC_ALPHABET", ARABIC_ALPHABET, 28],
    ["FUN_SITES", FUN_SITES, 131],
    ["QUOTES", QUOTES, 45],
  ];
  for (const [name, list, n] of expected) {
    ok(list.length === n, `${name} has ${list.length} entries, expected ${n}`);
  }
  console.log(`  ✅ all ${expected.length} curated lists intact (196 links + 28 letters + 45 quotes)`);

  // And they must actually be reachable from their category, not just imported.
  const islam = categoryContents("islam");
  const islamUrls = new Set(ISLAM_RESOURCES.map((r) => r.url));
  const served = islam.resources.filter((r) => islamUrls.has(r.url)).length;
  ok(
    served === islamUrls.size,
    `islam serves ${served} of ${islamUrls.size} curated islamic resources`,
  );
  console.log(`  ✅ all ${served} islamic resources are served by the Islam category`);

  const fun = categoryContents("fun");
  const funUrls = new Set(FUN_SITES.map((s) => s.url));
  const funServed = fun.resources.filter((r) => funUrls.has(r.url)).length;
  ok(
    funServed === FUN_SITES.length,
    `fun serves ${funServed} of ${FUN_SITES.length} fun sites`,
  );
  console.log(`  ✅ all ${funServed} fun sites are served by the Fun category`);

  const quotes = categoryContents("quotes");
  ok(
    quotes.quotes.length === QUOTES.length,
    `quotes category serves ${quotes.quotes.length} of ${QUOTES.length} quotes`,
  );
  console.log(`  ✅ all ${quotes.quotes.length} quotes are served by the Quotes category`);
}

/* ── 4. hub redirects point somewhere real ────────────────────────────── */

group("hub redirects");

{
  for (const [hub, category] of Object.entries(HUB_REDIRECTS)) {
    const target = categoryContents(category);
    ok(Boolean(target), `/hub/${hub} redirects to /slashbar/${category}, which does not exist`);
  }
  console.log(`  ✅ all ${Object.keys(HUB_REDIRECTS).length} hub redirects resolve`);

  // Every old hub URL that was in the sitemap must have a redirect, or it 404s.
  const oldHubs = [
    "students", "developers", "creators", "professionals", "founders", "india",
    "finance", "designers", "health", "islam", "urdu", "arabic", "fun", "quotes",
  ];
  const missing = oldHubs.filter((h) => !HUB_REDIRECTS[h]);
  ok(missing.length === 0, `old hub urls with no redirect: ${missing.join(", ")}`);
  console.log(`  ✅ every previously-sitemap'd /hub/* url still redirects`);
}

/* ── 5. the retired routes are actually gone ──────────────────────────── */

group("retired routes");

{
  const gone = ["islam", "urdu", "arabic", "quotes", "fun"].map((s) => `src/routes/hub.${s}.tsx`);
  const still = gone.filter((p) => existsSync(p));
  ok(still.length === 0, `these hub routes were meant to be deleted: ${still.join(", ")}`);

  const sitemap = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  ok(!sitemap.includes("/hub/"), "the sitemap still lists /hub/* urls");
  ok(
    sitemap.includes("/slashbar/islam"),
    "the sitemap is missing the new /slashbar/islam url",
  );
  console.log("  ✅ no hub route files, no /hub/* in the sitemap");
}

/* ── 6. the specific categories the user called out ───────────────────── */

group("content depth");

{
  // The brief was "Islam should contain tools, articles, resources and
  // commands". Four of those five exist in the catalogue today; the missing one
  // is a real gap in the data, not in the index, and is asserted here so it
  // cannot be quietly forgotten.
  const islam = categoryContents("islam");
  ok(islam.resources.length >= 50, `islam has only ${islam.resources.length} resources`);
  ok(islam.tools.length >= 8, `islam has only ${islam.tools.length} tools`);
  ok(
    islam.commands.length === 0,
    `islam now has ${islam.commands.length} commands - the catalogue gained some; update this note`,
  );
  ok(islam.articles.length === 0, `islam now has ${islam.articles.length} articles - update this note`);
  console.log(
    `  ⚠️  known gap: the catalogue has 0 Islamic commands and 0 Islamic guides,` +
      ` so Islam shows ${islam.tools.length} tools and ${islam.resources.length} resources`,
  );

  const fun = categoryContents("fun");
  ok(fun.games.length === ALL_PLAY_GAMES.length, "fun should hold the whole game library");
  console.log(`  ✅ fun holds all ${fun.games.length} games`);
}

if (failures === 0) {
  console.log("\n✅ slashbar-categories: all checks passed");
} else {
  console.log(`\n❌ slashbar-categories: ${failures} check(s) failed`);
}
process.exit(failures ? 1 : 0);
