import rawCommands from "@/data/commands.json";
import rawCategories from "@/data/categories.json";
import type { CatalogCategory, CatalogCommand } from "./catalog-validation";

export type CommandType =
  | "image"
  | "text"
  | "document"
  | "data"
  | "coding"
  | "research"
  | "productivity"
  | "audio"
  | "video"
  | "business"
  | "learning"
  | "general";

export interface SlashCommand extends CatalogCommand {
  type: CommandType;
  difficulty: "easy" | "medium" | "advanced";
}

/** Runtime guard: identical ids or command names can never reach the UI. */
function dedupeCatalog(list: SlashCommand[]): SlashCommand[] {
  const seenId = new Set<string>();
  const seenName = new Set<string>();
  const out: SlashCommand[] = [];
  for (const c of list) {
    const name = c.command.trim().toLowerCase();
    if (seenId.has(c.id) || seenName.has(name)) continue;
    seenId.add(c.id);
    seenName.add(name);
    out.push(c);
  }
  return out;
}

export const COMMANDS: SlashCommand[] = dedupeCatalog(rawCommands as SlashCommand[]);

/** Verified count — post-deduplication, safe to display. */
export const VERIFIED_TOTAL = COMMANDS.length;

export const CATEGORY_META = rawCategories as CatalogCategory[];

export const CATEGORY_ICONS: Record<string, string> = Object.fromEntries(
  CATEGORY_META.map((c) => [c.category, c.icon]),
);

export interface CategoryNode {
  category: string;
  icon: string;
  count: number;
  subcategories: { subcategory: string; count: number }[];
}

/** category -> subcategory -> count, built from the data itself. */
export const CATEGORY_TREE: CategoryNode[] = (() => {
  const map = new Map<string, Map<string, number>>();
  for (const c of COMMANDS) {
    let subs = map.get(c.category);
    if (!subs) map.set(c.category, (subs = new Map()));
    subs.set(c.subcategory, (subs.get(c.subcategory) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([category, subs]) => ({
      category,
      icon: CATEGORY_ICONS[category] ?? "Sparkles",
      count: [...subs.values()].reduce((a, b) => a + b, 0),
      subcategories: [...subs.entries()]
        .map(([subcategory, count]) => ({ subcategory, count }))
        .sort((a, b) => a.subcategory.localeCompare(b.subcategory)),
    }))
    .sort((a, b) => a.category.localeCompare(b.category));
})();

export const CATEGORY_COUNTS = CATEGORY_TREE.map(({ category, count, icon }) => ({
  category,
  count,
  icon,
}));

export const SUBCATEGORY_TOTAL = CATEGORY_TREE.reduce((n, c) => n + c.subcategories.length, 0);

export const TYPES: CommandType[] = [
  "image",
  "text",
  "document",
  "data",
  "coding",
  "research",
  "productivity",
  "audio",
  "video",
  "business",
  "learning",
  "general",
];

export const FEATURED = COMMANDS.filter((c) => c.featured);

const byId = new Map(COMMANDS.map((c) => [c.id, c]));
const byName = new Map(COMMANDS.map((c) => [c.command.slice(1).toLowerCase(), c]));

/** Resolve a share URL segment: either the stable id or the command name. */
export const getCommand = (idOrSlug: string | undefined | null): SlashCommand | undefined => {
  if (!idOrSlug) return undefined;
  const key = idOrSlug.trim().toLowerCase().replace(/^\//, "");
  return byId.get(key) ?? byName.get(key) ?? byId.get(key.replace(/[^a-z0-9]/g, ""));
};

export const commandPath = (cmd: SlashCommand) => `/c/${cmd.id}`;

/** Deterministic "command of the day" — stable for a given UTC date, for everyone. */
export function getDailyCommand(dateKey: string): SlashCommand {
  let hash = 2166136261;
  for (let i = 0; i < dateKey.length; i++) {
    hash ^= dateKey.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return COMMANDS[(hash >>> 0) % COMMANDS.length]!;
}

export const todayKey = () => new Date().toISOString().slice(0, 10);

export function getRandomCommand(exceptId?: string): SlashCommand {
  if (COMMANDS.length === 1) return COMMANDS[0]!;
  let pick = COMMANDS[Math.floor(Math.random() * COMMANDS.length)]!;
  while (exceptId && pick.id === exceptId) {
    pick = COMMANDS[Math.floor(Math.random() * COMMANDS.length)]!;
  }
  return pick;
}

export function relatedCommands(cmd: SlashCommand, limit = 6): SlashCommand[] {
  const tagSet = new Set(cmd.tags);
  return COMMANDS.filter((c) => c.id !== cmd.id)
    .map((c) => {
      let score = 0;
      if (c.subcategory === cmd.subcategory) score += 3;
      if (c.category === cmd.category) score += 2;
      for (const t of c.tags) if (tagSet.has(t)) score += 1;
      return { c, score };
    })
    .filter((x) => x.score > 2)
    .sort((a, b) => b.score - a.score || b.c.popularity - a.c.popularity)
    .slice(0, limit)
    .map((x) => x.c);
}

/* ---------------------------------- search --------------------------------- */

/** Bounded edit distance — returns a number > max as soon as it is hopeless. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const v = Math.min(prev[j]! + 1, row[j - 1]! + 1, prev[j - 1]! + cost);
      row.push(v);
      if (v < best) best = v;
    }
    if (best > max) return max + 1;
    prev = row;
  }
  return prev[b.length]!;
}

/** Initials of a multi-word title, e.g. "Clean CSV Data" -> "ccd". */
const initials = (s: string) =>
  s
    .split(/[\s&/-]+/)
    .filter(Boolean)
    .map((w) => w[0]!.toLowerCase())
    .join("");

/**
 * Score a single term. Ranking tiers (highest first):
 * exact command → command prefix → alias → title → tags → subcategory/category
 * → description → how-to-use/example → typo-tolerant fuzzy.
 */
function scoreTerm(cmd: SlashCommand, needle: string): number {
  if (!needle) return 0;
  const name = cmd.command.slice(1).toLowerCase();
  const title = cmd.title.toLowerCase();

  if (name === needle) return 10000;
  if (cmd.aliases.some((a) => a.slice(1).toLowerCase() === needle)) return 9000;
  if (name.startsWith(needle)) return 8000 - name.length;
  if (title === needle) return 7500;
  if (title.startsWith(needle)) return 7000 - title.length;
  if (needle.length >= 2 && initials(cmd.title) === needle) return 6500;
  if (name.includes(needle)) return 6000 - name.length;
  if (cmd.aliases.some((a) => a.toLowerCase().includes(needle))) return 5500;
  if (title.includes(needle)) return 5000;
  if (cmd.tags.some((t) => t.toLowerCase() === needle)) return 4500;
  if (cmd.tags.some((t) => t.toLowerCase().includes(needle))) return 4000;
  if (cmd.subcategory.toLowerCase().includes(needle)) return 3500;
  if (cmd.category.toLowerCase().includes(needle)) return 3000;
  if (cmd.description.toLowerCase().includes(needle)) return 2500;
  if (cmd.type.toLowerCase() === needle || cmd.difficulty === needle) return 2000;
  if (cmd.howToUse.toLowerCase().includes(needle)) return 1500;
  if (cmd.example.toLowerCase().includes(needle)) return 1200;

  // typo tolerance: one edit for short queries, two for longer ones
  if (needle.length >= 4) {
    const max = needle.length >= 7 ? 2 : 1;
    const d = editDistance(name, needle, max);
    if (d <= max) return 900 - d * 100;
    for (const word of title.split(/\s+/)) {
      if (editDistance(word, needle, max) <= max) return 700 - name.length;
    }
    for (const tag of cmd.tags) {
      if (editDistance(tag.toLowerCase(), needle, max) <= max) return 600;
    }
  }
  return -1;
}

/**
 * Multi-word queries match in any order. Commands matching every word rank
 * highest, but partial matches are still returned so plain-language phrases
 * like "study explain" or "email plan meeting" never dead-end at zero results.
 */
export function scoreCommand(cmd: SlashCommand, q: string): number {
  const cleaned = q.trim().toLowerCase().replace(/^\//, "");
  if (!cleaned) return 0;
  const tokens = cleaned.split(/[\s,]+/).filter(Boolean);
  if (tokens.length < 2) return scoreTerm(cmd, cleaned);

  let total = 0;
  let matched = 0;
  for (const t of tokens) {
    const s = scoreTerm(cmd, t);
    if (s > 0) {
      matched += 1;
      total += s;
    }
  }
  if (matched === 0) return -1;

  const missed = tokens.length - matched;
  const avg = Math.round(total / matched);
  const wordScore = avg + (missed === 0 ? 250 : 0) - missed * 400;
  const phrase = scoreTerm(cmd, cleaned);
  return Math.max(phrase, Math.max(wordScore, 1));
}


export type SortKey = "relevance" | "name" | "category" | "popularity" | "newest";

export interface FilterState {
  q: string;
  category: string;
  subcategory?: string;
  type: string;
  difficulty: string;
  sort: SortKey;
  onlyFavorites: boolean;
  favorites: string[];
}

export function filterCommands(state: FilterState): SlashCommand[] {
  const favSet = new Set(state.favorites);
  const q = state.q.trim();
  const list: { c: SlashCommand; s: number }[] = [];

  for (const c of COMMANDS) {
    if (state.category !== "all" && c.category !== state.category) continue;
    if (state.subcategory && state.subcategory !== "all" && c.subcategory !== state.subcategory)
      continue;
    if (state.type !== "all" && c.type !== state.type) continue;
    if (state.difficulty !== "all" && c.difficulty !== state.difficulty) continue;
    if (state.onlyFavorites && !favSet.has(c.id)) continue;
    let s = 0;
    if (q) {
      s = scoreCommand(c, q);
      if (s < 0) continue;
    }
    list.push({ c, s });
  }

  const cmp: Record<
    SortKey,
    (a: { c: SlashCommand; s: number }, b: { c: SlashCommand; s: number }) => number
  > = {
    relevance: (a, b) =>
      b.s - a.s || b.c.popularity - a.c.popularity || a.c.command.localeCompare(b.c.command),
    name: (a, b) => a.c.command.localeCompare(b.c.command),
    category: (a, b) =>
      a.c.category.localeCompare(b.c.category) ||
      a.c.subcategory.localeCompare(b.c.subcategory) ||
      a.c.command.localeCompare(b.c.command),
    popularity: (a, b) => b.c.popularity - a.c.popularity || a.c.command.localeCompare(b.c.command),
    newest: (a, b) => b.c.addedAt.localeCompare(a.c.addedAt),
  };

  list.sort(cmp[state.sort]);
  return list.map((x) => x.c);
}

export function suggestions(q: string, limit = 7): SlashCommand[] {
  if (!q.trim()) return [];
  return COMMANDS.map((c) => ({ c, s: scoreCommand(c, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.c.popularity - a.c.popularity)
    .slice(0, limit)
    .map((x) => x.c);
}

/** Ready-to-edit prompt template copied by "Use command". */
export function commandTemplate(cmd: SlashCommand): string {
  return `${cmd.command}

# ${cmd.title} — ${cmd.category} / ${cmd.subcategory}
# What it does: ${cmd.description}
# How to use: ${cmd.howToUse}

Input: <paste your input here>
Goal: <what a great result looks like>
Constraints: <tone, length, format>

--- Example ---
${cmd.example}`;
}
