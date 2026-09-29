/**
 * One-off extractor: move the inline data out of the /hub/* route files and
 * into src/lib/hub-*.ts, so the content survives the hubs being redirected
 * into SlashBar categories.
 *
 * The hub routes each defined their curated lists inline — 52 Islamic
 * resources, 132 fun sites, 8 Urdu links, 4 Arabic links, ~60 quotes. None of
 * it is in src/lib/resources.ts, so deleting or redirecting those routes
 * without this step would have thrown all of it away.
 *
 * These are hand-written static literals, so evaluating them here is safe and
 * is the only reliable way to copy 250+ entries without transcription errors.
 * The script writes the module and then re-verifies the row count.
 *
 * Run: bun scripts/extract-hub-data.mjs
 * Re-running is idempotent: the source routes are only read, never written.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
const ok = (cond, msg) => {
  if (cond) return;
  console.log(`  ❌ ${msg}`);
  failures++;
};

/**
 * Pull a top-level `const NAME ... = [ ... ];` literal out of a source file by
 * scanning for balanced brackets, ignoring brackets inside strings.
 */
function extractArray(source, name) {
  const decl = new RegExp(`(?:const|let|var)\\s+${name}\\b[^=]*=\\s*\\[`, "m").exec(source);
  if (!decl) throw new Error(`could not find "${name}"`);
  const start = decl.index + decl[0].length - 1; // the '['
  let depth = 0;
  let i = start;
  let quote = null;
  for (; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "[" || ch === "{") depth++;
    else if (ch === "]" || ch === "}") {
      depth--;
      if (depth === 0) {
        const literal = source.slice(start, i + 1);
        // eslint-disable-next-line no-new-func
        return new Function(`return ${literal}`)();
      }
    }
  }
  throw new Error(`unbalanced brackets for "${name}"`);
}

const read = (p) => readFileSync(join(root, p), "utf8");
const write = (p, body) => writeFileSync(join(root, p), body);

/**
 * The hub routes this script reads from have since been deleted, because the
 * hubs are now SlashBar categories. The generated modules are now the source of
 * truth, so a missing input is a normal outcome rather than a crash - but a
 * silent skip would hide the fact that this script can no longer regenerate
 * anything, so it says so loudly.
 */
function readIfPresent(path, label) {
  try {
    return read(path);
  } catch {
    console.log(`  ℹ️  ${label}: ${path} is gone, skipping (the generated module is now the source)`);
    return null;
  }
}

const HEADER = (title) => `/**
 * ${title}
 *
 * Extracted verbatim from the old /hub/* route by scripts/extract-hub-data.mjs.
 * These entries were never in src/lib/resources.ts, which is why they had to be
 * moved into a module before the hub routes could be redirected into SlashBar
 * categories. Do not hand-edit; re-run the extractor instead.
 */
`;

/* ── Islam ──────────────────────────────────────────────────────────────── */
{
  console.log("\n── islam");
  const src = readIfPresent("src/routes/hub.islam.tsx", "islam");
  if (!src) {
    console.log("  … nothing to extract");
  } else {
  const sections = extractArray(src, "SECTIONS");
  const items = sections.flatMap((s) => s.items);
  ok(items.length === 52, `expected 52 islamic resources, got ${items.length}`);
  ok(
    items.every((r) => r.id && r.name && r.url && r.description && r.lastVerified),
    "every islamic resource needs id, name, url, description and lastVerified",
  );
  ok(
    new Set(items.map((r) => r.id)).size === items.length,
    "duplicate ids in the islamic list",
  );
  write(
    "src/lib/hub-islam.ts",
    `${HEADER("Islamic resources: ${items.length} hand-checked links across ${sections.length} sections.")}
export interface IslamResource {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  pricing: "Completely Free" | "Free Tier" | "Open Source";
  lastVerified: string;
}

export interface IslamSection {
  icon: string;
  title: string;
  items: IslamResource[];
}

export const ISLAM_SECTIONS: IslamSection[] = ${JSON.stringify(sections, null, 2)};

/** Flat view, for the SlashBar category index. */
export const ISLAM_RESOURCES: IslamResource[] = ISLAM_SECTIONS.flatMap((s) => s.items);
`,
  );
  console.log(`  ✅ ${items.length} resources in ${sections.length} sections`);
  }
}

/* ── Urdu ───────────────────────────────────────────────────────────────── */
{
  console.log("\n── urdu");
  const src = readIfPresent("src/routes/hub.urdu.tsx", "urdu");
  if (!src) {
    console.log("  … nothing to extract");
  } else {
  const items = extractArray(src, "RESOURCES");
  ok(items.length === 8, `expected 8 urdu resources, got ${items.length}`);
  ok(items.every((r) => r.name && r.url && r.emoji), "every urdu resource needs name, url and emoji");
  write(
    "src/lib/hub-urdu.ts",
    `${HEADER("Urdu resources: poetry, dictionaries, fonts and news.")}
export interface UrduResource {
  name: string;
  desc: string;
  url: string;
  emoji: string;
  category: string;
}

export const URDU_RESOURCES: UrduResource[] = ${JSON.stringify(items, null, 2)};
`,
  );
  console.log(`  ✅ ${items.length} resources`);
  }
}

/* ── Arabic ─────────────────────────────────────────────────────────────── */
{
  console.log("\n── arabic");
  const src = readIfPresent("src/routes/hub.arabic.tsx", "arabic");
  if (!src) {
    console.log("  … nothing to extract");
  } else {
  const resources = extractArray(src, "RESOURCES");
  const alphabet = extractArray(src, "ALPHABET");
  const phrases = extractArray(src, "PHRASES");
  ok(resources.length === 4, `expected 4 arabic resources, got ${resources.length}`);
  ok(alphabet.length >= 28, `expected the 28-letter alphabet, got ${alphabet.length}`);
  ok(phrases.length > 0, "no arabic phrases found");
  write(
    "src/lib/hub-arabic.ts",
    `${HEADER("Arabic resources, the full alphabet, and starter phrases.")}
export interface ArabicResource {
  title: string;
  desc: string;
  url: string;
  icon: string;
}

export interface ArabicLetter {
  letter: string;
  name: string;
  sound: string;
}

export interface ArabicPhrase {
  arabic: string;
  english: string;
}

export const ARABIC_RESOURCES: ArabicResource[] = ${JSON.stringify(resources, null, 2)};

export const ARABIC_ALPHABET: ArabicLetter[] = ${JSON.stringify(alphabet, null, 2)};

export const ARABIC_PHRASES: ArabicPhrase[] = ${JSON.stringify(phrases, null, 2)};
`,
  );
  console.log(`  ✅ ${resources.length} resources, ${alphabet.length} letters, ${phrases.length} phrases`);
  }
}

/* ── Fun ────────────────────────────────────────────────────────────────── */
{
  console.log("\n── fun");
  const src = readIfPresent("src/routes/hub.fun.tsx", "fun");
  if (!src) {
    console.log("  … nothing to extract");
  } else {
  const raw = extractArray(src, "SITES");
  ok(raw.length === 132, `expected 132 fun sites, got ${raw.length}`);
  ok(raw.every((s) => s.name && s.url), "every fun site needs a name and a url");

  // The source listed MapCrunch twice - once under "Directory", once under
  // "Interactive" - so anyone browsing the fun hub saw it twice. De-duplicate
  // by URL, keeping the first entry, and say so rather than silently dropping.
  const seen = new Set();
  const sites = raw.filter((s) => {
    if (seen.has(s.url)) {
      console.log(`  ℹ️  dropped duplicate url ${s.url} ("${s.name}" / ${s.category})`);
      return false;
    }
    seen.add(s.url);
    return true;
  });
  ok(new Set(sites.map((s) => s.url)).size === sites.length, "urls still not unique");
  write(
    "src/lib/hub-fun.ts",
    `${HEADER(`${sites.length} gloriously pointless websites, grouped by category.`)}
export interface FunSite {
  name: string;
  url: string;
  emoji: string;
  category: string;
  desc: string;
  /** we also ship our own in-app version of this — deep-link to it */
  inApp?: { to: string; label: string };
}

/** ${raw.length} entries in the source list, de-duplicated to ${sites.length} by url. */
export const FUN_SITES: FunSite[] = ${JSON.stringify(sites, null, 2)};

export const FUN_CATEGORIES: string[] = [
  "All",
  ...Array.from(new Set(FUN_SITES.map((s) => s.category))),
];
`,
  );
  console.log(`  ✅ ${sites.length} unique sites`);
  }
}

/* ── Quotes ─────────────────────────────────────────────────────────────── */
{
  console.log("\n── quotes");
  const src = readIfPresent("src/routes/hub.quotes.tsx", "quotes");
  if (!src) {
    console.log("  … nothing to extract");
  } else {
  const quotes = extractArray(src, "QUOTES");
  ok(quotes.length > 0, "no quotes found");
  ok(
    quotes.every((q) => q.text && q.author && q.category),
    "every quote needs text, author and category",
  );
  write(
    "src/lib/hub-quotes.ts",
    `${HEADER("Curated quotes, attributed to the people who said them.")}
export interface SlashQuote {
  text: string;
  author: string;
  source?: string;
  category: string;
}

export const QUOTES: SlashQuote[] = ${JSON.stringify(quotes, null, 2)};

export const QUOTE_CATEGORIES: string[] = [
  "All",
  ...Array.from(new Set(QUOTES.map((q) => q.category))),
];
`,
  );
  console.log(`  ✅ ${quotes.length} quotes`);
  }
}

if (failures === 0) {
  console.log("\n✅ extract-hub-data: all sections written");
} else {
  console.log(`\n❌ extract-hub-data: ${failures} check(s) failed`);
}
process.exit(failures ? 1 : 0);
