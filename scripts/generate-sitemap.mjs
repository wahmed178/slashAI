/**
 * Generates public/sitemap.xml from the app's own catalogs.
 *
 * Only indexable, canonical, bot-worthy pages are listed. Private/utility
 * routes (search, favorites, settings, tool screens reachable only from the
 * app shell, ...) are deliberately excluded — they are noindex or not
 * meaningful landing pages.
 *
 * Run: `bun run seo:generate` (also runs as part of `prebuild`).
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

export const SITE_URL = "https://slashai.in";

const url = (path, { changefreq = "weekly", priority = 0.7 } = {}) => ({
  loc: `${SITE_URL}${path}`,
  changefreq,
  priority,
});

async function main() {
  /** @type {Array<ReturnType<typeof url>>} */
  const urls = [
    url("/", { changefreq: "daily", priority: "1.0" }),
    url("/explore", { changefreq: "weekly", priority: "0.9" }),
    url("/discover", { changefreq: "daily", priority: "0.9" }),
    url("/tools", { changefreq: "daily", priority: "0.9" }),
    url("/play", { changefreq: "weekly", priority: "0.9" }),
    url("/slash", { changefreq: "weekly", priority: "0.8" }),
    url("/trending", { changefreq: "daily", priority: "0.8" }),
    url("/live", { changefreq: "hourly", priority: "0.7" }),
    url("/generators", { changefreq: "weekly", priority: "0.8" }),
    url("/roadmaps", { changefreq: "weekly", priority: "0.8" }),
    url("/glossary", { changefreq: "weekly", priority: "0.7" }),
    url("/collections", { changefreq: "weekly", priority: "0.8" }),
    url("/hub", { changefreq: "weekly", priority: "0.8" }),
    url("/quiz", { changefreq: "daily", priority: "0.7" }),
    url("/journal", { changefreq: "weekly", priority: "0.6" }),
    url("/everything", { changefreq: "weekly", priority: "0.7" }),
    url("/whats-new", { changefreq: "weekly", priority: "0.7" }),
    url("/radar", { changefreq: "weekly", priority: "0.6" }),
    url("/alternatives", { changefreq: "weekly", priority: "0.6" }),
    url("/ai-tools", { changefreq: "weekly", priority: "0.8" }),
    url("/web-search", { changefreq: "weekly", priority: "0.6" }),
    url("/movies", { changefreq: "weekly", priority: "0.6" }),
    url("/youtube", { changefreq: "weekly", priority: "0.6" }),
    url("/assistant", { changefreq: "monthly", priority: "0.6" }),
    url("/random", { changefreq: "monthly", priority: "0.4" }),
    url("/about", { changefreq: "monthly", priority: "0.5" }),
    url("/prompts", { changefreq: "daily", priority: "0.9" }),
    url("/prompts/students", { changefreq: "weekly", priority: "0.8" }),
    url("/prompts/business", { changefreq: "weekly", priority: "0.8" }),
    url("/changelog", { changefreq: "weekly", priority: "0.5" }),
    url("/contact", { changefreq: "monthly", priority: "0.4" }),
    url("/privacy", { changefreq: "yearly", priority: "0.3" }),
    url("/terms", { changefreq: "yearly", priority: "0.3" }),
    url("/keyboard", { changefreq: "monthly", priority: "0.3" }),
  ];

  /* ── hubs ── */
  const hubAudiences = [
    "students", "developers", "creators", "professionals", "founders",
    "india", "finance", "designers", "health", "islam", "urdu", "arabic", "fun",
  ];
  for (const a of hubAudiences) urls.push(url(`/hub/${a}`, { priority: "0.7" }));
  for (const extra of ["quotes"]) urls.push(url(`/hub/${extra}`, { priority: "0.5" }));

  /* ── 45 explore categories (slugified) ── */
  const categories = JSON.parse(readFileSync("src/data/categories.json", "utf8"));
  const slug = (s) =>
    s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  for (const c of categories) urls.push(url(`/explore/${slug(c.category)}`, { priority: "0.7" }));

  /* ── command collections ── */
  const collectionsSrc = readFileSync("src/lib/collections.ts", "utf8");
  const colIds = [...collectionsSrc.matchAll(/^\s{4}id: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
  for (const id of colIds) urls.push(url(`/collections/${id}`, { priority: "0.6" }));

  /* ── discover sections (real section ids from the catalog) ── */
  for (const s of ["free-tools", "free-ai", "ai", "free-apis", "github", "learn", "resources", "youtube", "reddit", "websites", "free-time", "tips"]) {
    urls.push(url(`/discover/${s}`, { priority: "0.6" }));
  }
  urls.push(url("/discover/reels", { priority: "0.5" }));

  /* ── tools ──
     Two families of indexable tool pages:
       1. authored tools — one route file each (src/routes/tools.<slug>.tsx)
       2. the declarative toolkit — served by the dynamic /tools/$slug route
     The authored half was missing from this sitemap entirely, so every
     hand-built tool page (BMI, EMI, cron, colour picker, ...) stayed out of
     search results until somebody linked to it. */
  const routeFiles = execSync("ls src/routes", { encoding: "utf8" }).trim().split("\n");

  const toolSlugs = new Set();
  for (const file of routeFiles) {
    const m = /^tools\.([a-z0-9-]+)\.tsx$/.exec(file);
    // "index" is the /tools hub itself and is already listed above.
    if (m && m[1] !== "index") toolSlugs.add(m[1]);
  }
  const catalogSrc = readFileSync("src/lib/toolkit/catalog.ts", "utf8");
  for (const m of catalogSrc.matchAll(/\{\s*slug: "([a-z0-9-]+)", name:/g)) toolSlugs.add(m[1]);
  for (const slug of toolSlugs) urls.push(url(`/tools/${slug}`, { changefreq: "monthly", priority: "0.6" }));

  /* ── games (one route file per game) ── */
  const gameSlugs = new Set();
  for (const file of routeFiles) {
    const m = /^play\.([a-z0-9-]+)\.tsx$/.exec(file);
    // "index" is the /play hub itself and is already listed above.
    if (m && m[1] !== "index") gameSlugs.add(m[1]);
  }
  for (const slug of gameSlugs) urls.push(url(`/play/${slug}`, { changefreq: "monthly", priority: "0.6" }));

  /* ── slash apps that actually render at /slash/<slug> ──
     Apps with a `link:` field redirect elsewhere (loader throws notFound),
     so only link-less slugs are canonical pages. */
  const slashbar = readFileSync("src/lib/slashbar.ts", "utf8");
  const slashSlugs = [];
  for (const m of slashbar.matchAll(/^\s{4}slug: "([a-z0-9-]+)",$/gm)) {
    const next = slashbar.indexOf("slug:", m.index + m[0].length);
    const block = slashbar.slice(m.index, next === -1 ? undefined : next);
    if (!/^\s{4}link: /m.test(block)) slashSlugs.push(m[1]);
  }
  for (const s of slashSlugs) urls.push(url(`/slash/${s}`, { changefreq: "monthly", priority: "0.6" }));

  /* ── free resources (/r/<id>) — verified indexable detail pages ── */
  const resources = await collectResourceIds();
  for (const id of resources) urls.push(url(`/r/${id}`, { changefreq: "monthly", priority: "0.5" }));

  // Note: /c/<id> command pages (5,600+) are deliberately NOT listed —
  // they're reachable from category/hub pages and a 5k-entry sitemap would
  // dilute crawl budget. Category pages cover them for discovery.

  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  writeFileSync("public/sitemap.xml", xml);
  console.log(`sitemap.xml written: ${urls.length} URLs`);
}

async function collectResourceIds() {
  // Import the TS modules via a quick esbuild-free regex over the literal
  // `id: "..."` fields in resources.ts + catalog parts + extras. All /r/:id
  // records live in these files; ids are kebab-case slugs.
  const files = [
    "src/lib/resources.ts",
    "src/lib/resources-extra.ts",
    "src/lib/resources-catalog/apis.ts",
    "src/lib/resources-catalog/courses.ts",
    "src/lib/resources-catalog/youtube.ts",
  ].filter((f) => existsSync(f));
  const ids = new Set();
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(/^\s{4}id: "([a-z0-9-]+)",$/gm)) ids.add(m[1]);
  }
  return [...ids];
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
