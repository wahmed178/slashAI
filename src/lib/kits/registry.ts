/**
 * Kit registry — turns seed tables into 1,000+ instant-answer web tools.
 * Each kit is real and working: converters convert, reference tables carry
 * actual data, cheat sheets render copyable rows, and directory kits link to
 * curated external sites with honest explanations.
 *
 * Every kit is served at /tools/kit/<slug>; the prefix keeps slugs
 * collision-free with existing /tools routes.
 */
import { CONV_FAMILIES, TEMPERATURE_UNITS } from "./converter-data";
import {
  ELEMENTS, ELEMENT_CATEGORIES, INDIA_STATES, CURRENCIES, STUDY_TABLES, CHEATSHEETS,
} from "./reference-data";
import { WEB_TOOLS, WEB_GROUP_META, type WebGroup } from "./web-tools";

export type KitKind = "converter" | "temperature" | "element" | "state" | "currency" | "table" | "cheatsheet" | "directory";
export type KitGroup = "Converters" | "Science & Data" | "India" | "Study Tables" | "Cheat Sheets" | "Web Directory";

export interface Kit {
  slug: string;
  name: string;
  kind: KitKind;
  group: KitGroup;
  icon: string;
  desc: string;
  /** converter family id / element / state / currency / table / sheet / webgroup */
  ref?: string;
  /** search text: name + desc + ref data */
  search: string;
  kids?: boolean | undefined;
}

export interface KitSection {
  title: KitGroup;
  icon: string;
  blurb: string;
  kits: Kit[];
}

const kits: Kit[] = [];
const seen = new Set<string>();
function add(k: Omit<Kit, "search"> & { search?: string }) {
  if (seen.has(k.slug)) throw new Error(`duplicate kit slug ${k.slug}`);
  seen.add(k.slug);
  kits.push({ search: `${k.name} ${k.desc}`.toLowerCase(), ...k } as Kit);
}

/* ── 1. converters: every unit pair becomes its own kit ─────────────── */

for (const f of CONV_FAMILIES) {
  const n = f.units.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const from = f.units[i]![0];
      const to = f.units[j]![0];
      add({
        slug: `${f.id}-${i + 1}-to-${j + 1}`,
        name: `${cap(from)} to ${cap(to)}`,
        kind: "converter",
        group: "Converters",
        icon: f.icon,
        desc: `Convert ${from} to ${to} instantly — part of the ${f.name.toLowerCase()} converter family`,
        ref: `${f.id}:${i}:${j}`,
      });
    }
  }
}
// temperature pairs (4 units → 12 kits)
for (let i = 0; i < TEMPERATURE_UNITS.length; i++) {
  for (let j = 0; j < TEMPERATURE_UNITS.length; j++) {
    if (i === j) continue;
    add({
      slug: `temperature-${i + 1}-to-${j + 1}`,
      name: `${TEMPERATURE_UNITS[i]![0]} to ${TEMPERATURE_UNITS[j]![0]}`,
      kind: "temperature",
      group: "Converters",
      icon: "🌡️",
      desc: `Convert ${TEMPERATURE_UNITS[i]![0].toLowerCase()} to ${TEMPERATURE_UNITS[j]![0].toLowerCase()} — instant, with formula shown`,
      ref: `${i}:${j}`,
    });
  }
}

/* ── 2. periodic table: one kit per element (103) ───────────────────── */

for (const [num, sym, name, mass, cat] of ELEMENTS) {
  add({
    slug: `element-${sym.toLowerCase()}`,
    name: `${name} (${sym})`,
    kind: "element",
    group: "Science & Data",
    icon: "⚗️",
    desc: `Element #${num}: atomic mass ${mass} · ${cat} — facts, properties and placement`,
    ref: sym,
  });
}

/* ── 3. Indian states (28) ──────────────────────────────────────────── */

for (const [state, capital, stats, known] of INDIA_STATES) {
  add({
    slug: `state-${slugify(state)}`,
    name: state,
    kind: "state",
    group: "India",
    icon: "🇮🇳",
    desc: `${state}: capital ${capital} · ${stats} · known for ${known.split(",")[0]!.trim()}`,
    ref: slugify(state),
  });
}

/* ── 4. currencies (30) ─────────────────────────────────────────────── */

for (const [code, name, symbol, countries] of CURRENCIES) {
  add({
    slug: `currency-${code.toLowerCase()}`,
    name: `${name} (${code})`,
    kind: "currency",
    group: "Science & Data",
    icon: "💱",
    desc: `${name} ${symbol} — used in ${countries}: symbol, code and quick facts`,
    ref: code,
  });
}

/* ── 5. study tables (23) ───────────────────────────────────────────── */

for (const t of STUDY_TABLES) {
  add({
    slug: `table-${t.id}`,
    name: t.name,
    kind: "table",
    group: "Study Tables",
    icon: t.icon,
    desc: `${t.desc} — full table, tap any row to hear it`,
    ref: t.id,
    kids: true,
  });
}

/* ── 6. cheat sheets (5) ────────────────────────────────────────────── */

for (const c of CHEATSHEETS) {
  add({
    slug: `sheet-${c.id}`,
    name: c.name,
    kind: "cheatsheet",
    group: "Cheat Sheets",
    icon: c.icon,
    desc: `${c.desc} — every row copyable`,
    ref: c.id,
  });
}

/* ── 7. web directory (13 kits: per-group + per-tool) ───────────────── */

for (const g of WEB_GROUP_META) {
  add({
    slug: `web-${g.id.toLowerCase()}`,
    name: `${g.id} Web Tools`,
    kind: "directory",
    group: "Web Directory",
    icon: g.icon,
    desc: `Curated free ${g.id.toLowerCase()} tools on the wider web — ${g.blurb}, each explained`,
    ref: g.id,
  });
}
for (const t of WEB_TOOLS) {
  add({
    slug: `site-${slugify(t.name)}`,
    name: t.name,
    kind: "directory",
    group: "Web Directory",
    icon: "🔗",
    desc: t.what,
    ref: t.group,
    kids: t.kidsOk,
  });
}

/* ── exports ────────────────────────────────────────────────────────── */

export const KITS: Kit[] = kits;
export const KIT_COUNT = kits.length;

export const KIT_GROUPS: { title: KitGroup; icon: string; blurb: string }[] = [
  { title: "Converters", icon: "🔄", blurb: "Every unit pair, instant two-way conversion" },
  { title: "Science & Data", icon: "⚗️", blurb: "Periodic table, currencies, world data" },
  { title: "India", icon: "🇮🇳", blurb: "States, capitals and state facts" },
  { title: "Study Tables", icon: "✖️", blurb: "Tables, squares, cubes, primes and powers" },
  { title: "Cheat Sheets", icon: "📋", blurb: "Copyable quick references for work and code" },
  { title: "Web Directory", icon: "🧭", blurb: "Hand-picked free tools across the web, explained" },
];

export const kitSections = (): KitSection[] =>
  KIT_GROUPS.map((g) => ({
    title: g.title,
    icon: g.icon,
    blurb: g.blurb,
    kits: kits.filter((k) => k.group === g.title),
  }));

const kitBySlug = new Map(kits.map((k) => [k.slug, k]));
export const getKit = (slug: string | undefined): Kit | undefined =>
  slug ? kitBySlug.get(slug) : undefined;

export function searchKits(q: string, limit = 24): Kit[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return kits
    .filter((k) => k.search.includes(needle))
    .sort((a, b) => a.name.length - b.name.length)
    .slice(0, limit);
}

/** re-exported for kit pages */
export {
  CONV_FAMILIES, TEMPERATURE_UNITS,
  ELEMENTS, ELEMENT_CATEGORIES, INDIA_STATES, CURRENCIES, STUDY_TABLES, CHEATSHEETS,
  WEB_TOOLS, WEB_GROUP_META,
};
export type { WebGroup };

/* ── helpers ────────────────────────────────────────────────────────── */

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
