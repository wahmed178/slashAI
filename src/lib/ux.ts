/**
 * Small, dependency-free UX helpers that every personalisation feature shares.
 *
 * Everything here is localStorage-only (no account, no backend) and every
 * reader is defensive: a corrupt or unavailable store must never break a page.
 */

import { recordEngagementAction } from "@/lib/coffee-nudge";

/* ─────────────────────────── storage primitives ─────────────────────────── */

export const UX_KEYS = {
  /** absent ⇒ this visitor has never used the command guide */
  firstVisit: "slash_first_visit",
  /** { slug: clickCount } — how often each tool/game has been opened */
  clicks: "slashai-tool-clicks",
  /** { slug: bestScore } — personal bests for scoring games */
  best: "slashai-game-best",
  /** ["slug"] — resources/courses the user has opened or finished */
  started: "slashai-started",
  /** last copied command text, so the floating button can re-copy it */
  lastCopy: "slashai-last-copy",
  /** [{ kind, id, at }] — rolling interaction log for "you might like" */
  interactions: "slashai-ux-interactions",
  /** [{ id, name, category, text, timestamp }] — copy history */
  copyHistory: "slash_history",
} as const;

/** Fired on window whenever any UX helper changes stored state. */
export const UX_CHANGE_EVENT = "slashai-ux-change";
/** Fired on window when the last-copied command changes (or is cleared). */
export const LAST_COPY_EVENT = "slashai-last-copy-change";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota — personalisation is optional, never fatal */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(UX_CHANGE_EVENT));
}

/* ───────────────────────────── first visit ──────────────────────────────── */

/** True until the visitor has seen (and dismissed) the command guide once. */
export function isFirstTimeVisitor(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(UX_KEYS.firstVisit) === null;
  } catch {
    return false;
  }
}

/** Mark the visitor as no longer new, so guides start collapsed. */
export function markVisited(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(UX_KEYS.firstVisit, "1");
  } catch {
    /* ignore */
  }
}

/* ───────────────────────── tool / game popularity ───────────────────────── */

export function toolClicks(): Record<string, number> {
  const raw = readJson<Record<string, number>>(UX_KEYS.clicks, {});
  const out: Record<string, number> = {};
  for (const [slug, n] of Object.entries(raw)) {
    if (typeof n === "number" && Number.isFinite(n) && n > 0) out[slug] = n;
  }
  return out;
}

/** Record an open. Used for the 🔥 Popular badge on tool cards. */
export function bumpToolClick(slug: string): void {
  if (!slug) return;
  const all = toolClicks();
  all[slug] = (all[slug] ?? 0) + 1;
  // keep the map bounded — 300 most-used slug is plenty
  const trimmed = Object.entries(all)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 300);
  writeJson(UX_KEYS.clicks, Object.fromEntries(trimmed));
}

/** Slugs the visitor personally uses a lot (≥ `min` opens). */
export function popularFromUsage(min = 2): Set<string> {
  const out = new Set<string>();
  for (const [slug, n] of Object.entries(toolClicks())) if (n >= min) out.add(slug);
  return out;
}

/* ─────────────────────────── personal best scores ───────────────────────── */

/** Highest recorded score for a game slug, or null when never played. */
export function getGameBest(slug: string): number | null {
  const map = readJson<Record<string, number>>(UX_KEYS.best, {});
  const v = map[slug];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/** Saves `score` when it beats the stored best. Returns true on a new record. */
export function saveGameBest(slug: string, score: number): boolean {
  if (!slug || !Number.isFinite(score)) return false;
  const map = readJson<Record<string, number>>(UX_KEYS.best, {});
  const prev = typeof map[slug] === "number" ? map[slug]! : null;
  if (prev !== null && score <= prev) return false;
  map[slug] = score;
  writeJson(UX_KEYS.best, map);
  recordEngagementAction("game_play");
  return true;
}

/* ─────────────────────── started / finished tracking ───────────────────── */

/** Slugs of courses and resources the visitor has opened at least once. */
export function startedSlugs(): string[] {
  const raw = readJson<unknown>(UX_KEYS.started, []);
  return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : [];
}

export function hasStarted(slug: string): boolean {
  return startedSlugs().includes(slug);
}

/** Marks a course/resource as started. Silently ignores duplicates. */
export function markStarted(slug: string): void {
  if (!slug) return;
  const list = startedSlugs();
  if (list.includes(slug)) return;
  writeJson(UX_KEYS.started, [slug, ...list].slice(0, 400));
}

/* ─────────────────────────── last copied command ────────────────────────── */

export function setLastCopied(text: string): void {
  if (typeof window === "undefined" || !text) return;
  try {
    window.localStorage.setItem(UX_KEYS.lastCopy, text);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(LAST_COPY_EVENT));
}

export function getLastCopied(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(UX_KEYS.lastCopy);
  } catch {
    return null;
  }
}

export function clearLastCopied(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(UX_KEYS.lastCopy);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(LAST_COPY_EVENT));
}

/* ──────────────────────── interaction log (recommend) ──────────────────── */

export type UxInteractionKind = "tool" | "game" | "command" | "course" | "resource";

export interface UxInteraction {
  kind: UxInteractionKind;
  id: string;
  /** category/section label, used to pick similar suggestions */
  tag?: string;
  at: number;
}

const MAX_INTERACTIONS = 40;

export function uxInteractions(): UxInteraction[] {
  const raw = readJson<unknown>(UX_KEYS.interactions, []);
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (e): e is UxInteraction =>
      typeof e === "object" &&
      e !== null &&
      typeof (e as UxInteraction).kind === "string" &&
      typeof (e as UxInteraction).id === "string",
  );
}

export function recordUxInteraction(kind: UxInteractionKind, id: string, tag?: string): void {
  if (!id) return;
  const next: UxInteraction[] = [
    { kind, id, at: Date.now(), ...(tag ? { tag } : {}) },
    ...uxInteractions().filter((e) => !(e.kind === kind && e.id === id)),
  ].slice(0, MAX_INTERACTIONS);
  if (kind === "game") {
    recordEngagementAction("game_play");
  } else if (kind === "tool") {
    recordEngagementAction("tool_run");
  }
  writeJson(UX_KEYS.interactions, next);
}

/** The tags a returning visitor gravitates towards, most recent first. */
export function favouriteTags(limit = 3): string[] {
  const counts = new Map<string, number>();
  uxInteractions().forEach((e, i) => {
    if (!e.tag) return;
    counts.set(e.tag, (counts.get(e.tag) ?? 0) + (MAX_INTERACTIONS - i));
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}

/* ──────────────────────────── "New" badges ─────────────────────────────── */

/** How long a catalogue item keeps its 🆕 badge after being added. */
export const NEW_WINDOW_DAYS = 45;

/** True when `added` (an ISO date) falls inside the freshness window. */
export function isNewItem(added: string | undefined, now = Date.now()): boolean {
  if (!added) return false;
  const ts = Date.parse(added);
  if (Number.isNaN(ts)) return false;
  const age = now - ts;
  return age >= 0 && age <= NEW_WINDOW_DAYS * 86_400_000;
}

/* ─────────────────────── command complexity inference ──────────────────── */

export interface Complexity {
  level: "beginner" | "intermediate" | "advanced";
  emoji: string;
  label: string;
  hint: string;
}

/** Counts `[bracketed]` placeholders a user has to replace. */
export function placeholderCount(text: string): number {
  const matches = text.match(/\[[^\]\n]{1,60}\]/g);
  return matches ? matches.length : 0;
}

const LEVELS: Record<Complexity["level"], Complexity> = {
  beginner: {
    level: "beginner",
    emoji: "🟢",
    label: "Beginner",
    hint: "Paste and go — no editing needed",
  },
  intermediate: {
    level: "intermediate",
    emoji: "🟡",
    label: "Intermediate",
    hint: "Replace one or two placeholders",
  },
  advanced: {
    level: "advanced",
    emoji: "🔴",
    label: "Advanced",
    hint: "Needs your context and some customisation",
  },
};

/**
 * Difficulty of a command, inferred from how many placeholders it contains
 * (and how long the prompt is). 0 placeholders → beginner, 1–2 → intermediate,
 * 3+ (or a very long prompt) → advanced.
 */
export function inferComplexity(text: string): Complexity {
  const n = placeholderCount(text);
  if (n <= 0) return LEVELS.beginner;
  if (n <= 2) return LEVELS.intermediate;
  return LEVELS.advanced;
}

/** Compact badge label used on command cards. */
export function complexityBadge(text: string): string {
  const c = inferComplexity(text);
  return `${c.emoji} ${c.label}`;
}

/* ─────────────────────────── copy history ─────────────────────────────── */

export interface CopyHistoryItem {
  id: string;
  name: string;
  category: string;
  text: string;
  timestamp: number;
}

const MAX_COPY_HISTORY = 50;

export function getCopyHistory(): CopyHistoryItem[] {
  return readJson<CopyHistoryItem[]>(UX_KEYS.copyHistory, []);
}

export function recordCopyHistory(item: { id: string; name: string; category: string; text: string }): void {
  const current = getCopyHistory();
  const next: CopyHistoryItem[] = [
    { ...item, timestamp: Date.now() },
    ...current.filter((c) => c.text !== item.text),
  ].slice(0, MAX_COPY_HISTORY);
  writeJson(UX_KEYS.copyHistory, next);
}

export function clearCopyHistory(): void {
  writeJson(UX_KEYS.copyHistory, []);
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

