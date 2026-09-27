/**
 * The virtual handheld that wraps SlashPlay games.
 *
 * Every game gets the device, but a few genuinely do not suit a 4:3 screen
 * with a d-pad — cricket is a stat-and-timeline game, the life/business sims
 * are text-first, and the word puzzles need a real keyboard. Those opt out here
 * rather than being wrapped in a shell that fights them.
 *
 * The cover palette is derived from the slug, so every game has a stable,
 * recognisable cartridge label without shipping 96 image files.
 */

import { ALL_PLAY_GAMES, getPlayGame } from "./slashplay";

/**
 * Games that read better on a normal page than inside the handheld.
 * Everything else is wrapped.
 */
const NO_DEVICE = new Set<string>([
  // cricket sims: long scorecards and a tournament bracket, far too much text
  // for a 4:3 screen
  "cricket",
  "cricket-2",
  "hand-cricket",
  // typing needs a real keyboard, not a d-pad
  "typing-test",
  // word games that are mostly reading and guessing
  "hangman",
  "word-chain",
  "word-scramble",
]);

/** true when the game should be shown inside the handheld */
export function usesDevice(slug: string | undefined): boolean {
  if (!slug) return false;
  if (!getPlayGame(slug)) return false;
  return !NO_DEVICE.has(slug);
}

export function deviceOptOut(slug: string): boolean {
  return NO_DEVICE.has(slug);
}

export function deviceOptOutCount(): number {
  return NO_DEVICE.size;
}

/* ── cartridge art ──────────────────────────────────────────────────────── */

export interface CoverPalette {
  /** body of the label */
  bg: string;
  /** band behind the title */
  band: string;
  ink: string;
  accent: string;
}

/** small stable hash so a slug always maps to the same colours */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const RAMPS: [string, string, string, string][] = [
  ["#7c3aed", "#4c1d95", "#f5f3ff", "#facc15"],
  ["#0ea5e9", "#075985", "#f0f9ff", "#fbbf24"],
  ["#10b981", "#065f46", "#ecfdf5", "#fde68a"],
  ["#f43f5e", "#881337", "#fff1f2", "#fde047"],
  ["#f59e0b", "#92400e", "#fffbeb", "#4c1d95"],
  ["#8b5cf6", "#4c1d95", "#faf5ff", "#34d399"],
  ["#ef4444", "#7f1d1d", "#fef2f2", "#a3e635"],
  ["#14b8a6", "#134e4a", "#f0fdfa", "#fbbf24"],
  ["#6366f1", "#312e81", "#eef2ff", "#fca5a5"],
  ["#d946ef", "#701a75", "#fdf4ff", "#a3e635"],
  ["#84cc16", "#365314", "#f7fee7", "#f472b6"],
  ["#f97316", "#7c2d12", "#fff7ed", "#38bdf8"],
];

/** a game's label colours, stable for the life of the catalogue */
export function coverPalette(slug: string): CoverPalette {
  const [bg, band, ink, accent] = RAMPS[hash(slug) % RAMPS.length]!;
  return { bg, band, ink, accent };
}

/** which of the four pattern slots a game uses */
export function coverPattern(slug: string): number {
  return hash(slug + "p") % 4;
}

/** how many games the device wraps, for honest copy in the UI */
export function deviceCount(): number {
  return ALL_PLAY_GAMES.filter((g) => usesDevice(g.slug)).length;
}
