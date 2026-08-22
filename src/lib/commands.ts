import rawCommands from "@/data/commands.json";
import rawCategories from "@/data/categories.json";

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

export interface SlashCommand {
  id: string;
  command: string;
  title: string;
  description: string;
  usage: string;
  example: string;
  category: string;
  subcategory: string;
  tags: string[];
  type: CommandType;
  difficulty: "easy" | "medium" | "advanced";
  featured: boolean;
  aliases: string[];
  popularity: number;
  addedAt: string;
}

export const COMMANDS = rawCommands as SlashCommand[];

export const CATEGORY_META = rawCategories as {
  category: string;
  icon: string;
  type: CommandType;
}[];

export const CATEGORY_ICONS: Record<string, string> = Object.fromEntries(
  CATEGORY_META.map((c) => [c.category, c.icon]),
);

export const CATEGORY_COUNTS: { category: string; count: number; icon: string }[] = (() => {
  const counts = new Map<string, number>();
  for (const c of COMMANDS) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([category, count]) => ({
      category,
      count,
      icon: CATEGORY_ICONS[category] ?? "Sparkles",
    }))
    .sort((a, b) => a.category.localeCompare(b.category));
})();

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
export const getCommand = (id: string | undefined) => (id ? byId.get(id) : undefined);

/** Deterministic "command of the day" — stable for a given UTC date. */
export function getDailyCommand(dateKey: string): SlashCommand {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  return COMMANDS[hash % COMMANDS.length];
}

export function getRandomCommand(): SlashCommand {
  return COMMANDS[Math.floor(Math.random() * COMMANDS.length)];
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

export interface SearchResult {
  command: SlashCommand;
  score: number;
}

/** Lightweight subsequence fuzzy match; returns a score or -1. */
function fuzzyScore(haystack: string, needle: string): number {
  let h = 0;
  let streak = 0;
  let score = 0;
  for (let n = 0; n < needle.length; n++) {
    const ch = needle[n];
    let found = -1;
    while (h < haystack.length) {
      if (haystack[h] === ch) {
        found = h;
        h++;
        break;
      }
      h++;
    }
    if (found === -1) return -1;
    streak = found > 0 && haystack[found - 1] === needle[n - 1] ? streak + 1 : 0;
    score += 1 + streak;
  }
  return score;
}

export function scoreCommand(cmd: SlashCommand, q: string): number {
  const needle = q.trim().toLowerCase().replace(/^\//, "");
  if (!needle) return 0;
  const name = cmd.command.toLowerCase().replace(/^\//, "");
  const title = cmd.title.toLowerCase();

  if (name === needle) return 1000;
  if (name.startsWith(needle)) return 800 - name.length;
  if (title.startsWith(needle)) return 700 - title.length;
  if (name.includes(needle)) return 600 - name.length;
  if (title.includes(needle)) return 500;

  let score = 0;
  if (cmd.tags.some((t) => t.toLowerCase().includes(needle))) score = Math.max(score, 380);
  if (cmd.subcategory.toLowerCase().includes(needle)) score = Math.max(score, 340);
  if (cmd.category.toLowerCase().includes(needle)) score = Math.max(score, 320);
  if (cmd.description.toLowerCase().includes(needle)) score = Math.max(score, 260);
  if (cmd.usage.toLowerCase().includes(needle) || cmd.example.toLowerCase().includes(needle))
    score = Math.max(score, 180);
  if (cmd.aliases.some((a) => a.toLowerCase().includes(needle))) score = Math.max(score, 300);
  if (score) return score;

  const fz = fuzzyScore(name, needle);
  if (fz > 0) return 60 + fz;
  const fzTitle = fuzzyScore(title.replace(/\s/g, ""), needle);
  if (fzTitle > 0) return 30 + fzTitle;
  return -1;
}

export type SortKey = "relevance" | "name" | "category" | "popularity" | "newest";

export interface FilterState {
  q: string;
  category: string;
  type: string;
  difficulty: string;
  sort: SortKey;
  onlyFavorites: boolean;
  favorites: string[];
}

export function filterCommands(state: FilterState): SlashCommand[] {
  const favSet = new Set(state.favorites);
  const q = state.q.trim();
  let list: { c: SlashCommand; s: number }[] = [];

  for (const c of COMMANDS) {
    if (state.category !== "all" && c.category !== state.category) continue;
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

  const cmp: Record<SortKey, (a: { c: SlashCommand; s: number }, b: { c: SlashCommand; s: number }) => number> = {
    relevance: (a, b) => b.s - a.s || b.c.popularity - a.c.popularity || a.c.command.localeCompare(b.c.command),
    name: (a, b) => a.c.command.localeCompare(b.c.command),
    category: (a, b) => a.c.category.localeCompare(b.c.category) || a.c.command.localeCompare(b.c.command),
    popularity: (a, b) => b.c.popularity - a.c.popularity || a.c.command.localeCompare(b.c.command),
    newest: (a, b) => b.c.addedAt.localeCompare(a.c.addedAt),
  };

  list.sort(cmp[state.sort]);
  return list.map((x) => x.c);
}

export function suggestions(q: string, limit = 6): SlashCommand[] {
  if (!q.trim()) return [];
  return COMMANDS.map((c) => ({ c, s: scoreCommand(c, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.c);
}

/** Ready-to-edit prompt template copied by "Use command". */
export function commandTemplate(cmd: SlashCommand): string {
  return `${cmd.command}\n\n# What it does: ${cmd.description}\n# How to use: ${cmd.usage}\n\nInput: <paste your input here>\nGoal: <what a great result looks like>\nConstraints: <tone, length, format>\n\n--- Example ---\n${cmd.example}`;
}
