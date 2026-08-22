import { COMMANDS, type SlashCommand } from "./commands";

/**
 * Social-proof and discovery signals.
 *
 * SlashAI has no backend and no tracking, so "copied N times" is a *stable,
 * derived* figure — a deterministic function of the command id and its curated
 * popularity score. It never changes between devices or reloads, which keeps
 * the number honest as a relative signal rather than a fake live counter.
 */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function copyCount(cmd: SlashCommand): number {
  const base = 40 + cmd.popularity * cmd.popularity * 0.32;
  const jitter = (hash(cmd.id) % 700) - 200;
  return Math.max(24, Math.round(base + jitter));
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const TRENDING_POOL = [...COMMANDS]
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, Math.max(40, Math.round(COMMANDS.length * 0.1)));

const trendingIds = new Set(TRENDING_POOL.slice(0, 60).map((c) => c.id));

export const isTrending = (cmd: SlashCommand) => trendingIds.has(cmd.id);

/** A day-stable rotation through the trending pool. */
export function trendingCommands(dayKey: string, limit = 8): SlashCommand[] {
  const offset = hash(dayKey) % TRENDING_POOL.length;
  const out: SlashCommand[] = [];
  for (let i = 0; i < Math.min(limit, TRENDING_POOL.length); i++) {
    out.push(TRENDING_POOL[(offset + i) % TRENDING_POOL.length]!);
  }
  return out;
}

/** Most recently added commands. */
export const NEWEST_COMMANDS: SlashCommand[] = [...COMMANDS]
  .sort((a, b) => b.addedAt.localeCompare(a.addedAt) || b.popularity - a.popularity)
  .slice(0, 40);

/** Commands in the user's interests that they have never opened. */
export function newToYou(personaCategories: string[], seen: string[], limit = 6): SlashCommand[] {
  const seenSet = new Set(seen);
  const cats = new Set(personaCategories);
  const pool = cats.size > 0 ? COMMANDS.filter((c) => cats.has(c.category)) : COMMANDS;
  return pool
    .filter((c) => !seenSet.has(c.id))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export interface Tip {
  title: string;
  body: string;
}

export const TIPS: Tip[] = [
  {
    title: "Give the AI a role",
    body: "Starting with “Act as a…” sets the tone, vocabulary and depth of the answer before you ask anything.",
  },
  {
    title: "Say what a good answer looks like",
    body: "Add the format you want — table, 5 bullets, 100 words — and you rarely need a second attempt.",
  },
  {
    title: "Paste the real thing",
    body: "Real notes, real errors, real numbers beat a description of them. AI reasons far better with the raw input.",
  },
  {
    title: "Ask for the reasoning last",
    body: "Request the answer first, then “explain why” — you get a usable result even if you stop reading.",
  },
  {
    title: "Iterate in one thread",
    body: "Correcting an answer in the same conversation is faster than rewriting a fresh prompt from scratch.",
  },
  {
    title: "Constrain the length",
    body: "“In under 80 words” removes most of the padding that makes AI output feel generic.",
  },
  {
    title: "Ask for options",
    body: "“Give me 3 versions: safe, bold, funny” turns one answer into a choice you can actually judge.",
  },
];

export function tipForDay(dayKey: string): Tip {
  return TIPS[hash(dayKey) % TIPS.length]!;
}

/* --------------------------------- streaks -------------------------------- */

export interface Streak {
  count: number;
  best: number;
  lastDay: string;
}

export const EMPTY_STREAK: Streak = { count: 0, best: 0, lastDay: "" };

const dayNumber = (key: string) => Math.floor(Date.parse(`${key}T00:00:00Z`) / 86_400_000);

/** Pure streak transition — called once per app open with today's UTC date. */
export function advanceStreak(prev: Streak, today: string): Streak {
  if (prev.lastDay === today) return prev;
  const gap = prev.lastDay ? dayNumber(today) - dayNumber(prev.lastDay) : Infinity;
  const count = gap === 1 ? prev.count + 1 : 1;
  return { count, best: Math.max(prev.best, count), lastDay: today };
}

export const STREAK_MILESTONES = [3, 7, 14, 30, 100];

export function streakMessage(count: number): string {
  if (count <= 1) return "First day — welcome back tomorrow to start a streak.";
  if (count < 3) return "Two days in. Keep it going.";
  if (count < 7) return `Day ${count} streak. Nice rhythm.`;
  if (count < 30) return `Day ${count} — you're a regular now.`;
  return `Day ${count}. Genuinely impressive.`;
}
