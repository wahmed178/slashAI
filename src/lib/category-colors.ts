/**
 * Category color system - the "fully colour-coded" layer.
 *
 * Every SlashKits section, SlashPlay section and Fun Sites category gets a
 * signature colour. Components read it from the `--cat` CSS custom property
 * (set inline on a section wrapper or card) and the `.cat-*` utilities in
 * styles.css turn it into tinted borders, icon tiles, chips and hover glows.
 *
 * Tints are computed with color-mix(), so every colour adapts automatically
 * to all four themes (dark, amoled, light, glass) - no per-theme overrides.
 */

import { TOOL_SECTIONS } from "./slashkits";
import { PLAY_SECTIONS } from "./slashplay";

export interface CatColor {
  /** display hex; also the value assigned to `--cat` */
  hex: string;
  /** oklch hue angle - kept for reference / future token work */
  hue: number;
}

const c = (hue: number, hex: string): CatColor => ({ hue, hex });

/** the shared palette (oklch hues chosen for vivid-but-tasteful screens) */
export const CAT_PALETTE = {
  teal: c(178, "#2dd4bf"),
  sky: c(235, "#38bdf8"),
  violet: c(295, "#a78bfa"),
  amber: c(75, "#fbbf24"),
  emerald: c(155, "#34d399"),
  rose: c(15, "#fb7185"),
  orange: c(55, "#fb923c"),
  indigo: c(275, "#818cf8"),
  pink: c(340, "#f472b6"),
  cyan: c(195, "#22d3ee"),
  lime: c(130, "#a3e635"),
  fuchsia: c(320, "#e879f9"),
  red: c(25, "#f87171"),
  blue: c(255, "#60a5fa"),
  purple: c(305, "#c084fc"),
  green: c(148, "#4ade80"),
} as const;

/** SlashKits section → colour */
export const KIT_SECTION_COLORS: Record<string, CatColor> = {
  Popular: CAT_PALETTE.teal,
  "File & Document": CAT_PALETTE.sky,
  "Image & Media": CAT_PALETTE.violet,
  "Calculators & Finance": CAT_PALETTE.emerald,
  Developer: CAT_PALETTE.indigo,
  "Writing & Business": CAT_PALETTE.amber,
  "Time & Focus": CAT_PALETTE.orange,
  "Screens & Screensavers": CAT_PALETTE.pink,
  "Social & Creator": CAT_PALETTE.cyan,
  "Life & Wellness": CAT_PALETTE.lime,
  "Islamic Tools": CAT_PALETTE.green,
  "Health & Body": CAT_PALETTE.red,
  Learning: CAT_PALETTE.blue,
  Curiosities: CAT_PALETTE.fuchsia,
  Languages: CAT_PALETTE.purple,
};

/** SlashPlay section → colour */
export const PLAY_SECTION_COLORS: Record<string, CatColor> = {
  Multiplayer: CAT_PALETTE.rose,
  "Card Games": CAT_PALETTE.amber,
  Arcade: CAT_PALETTE.violet,
  "Word & Puzzle": CAT_PALETTE.sky,
  "Viral & Zen": CAT_PALETTE.fuchsia,
  "Quick Plays": CAT_PALETTE.cyan,
};

/** Fun Sites hub category → colour */
export const FUN_CATEGORY_COLORS: Record<string, CatColor> = {
  Interactive: CAT_PALETTE.teal,
  Directory: CAT_PALETTE.orange,
  Weird: CAT_PALETTE.fuchsia,
  Calm: CAT_PALETTE.sky,
  Games: CAT_PALETTE.violet,
  Learning: CAT_PALETTE.lime,
};

export const kitSectionColor = (title: string): CatColor =>
  KIT_SECTION_COLORS[title] ?? CAT_PALETTE.teal;

export const playSectionColor = (title: string): CatColor =>
  PLAY_SECTION_COLORS[title] ?? CAT_PALETTE.rose;

export const funCategoryColor = (name: string): CatColor =>
  FUN_CATEGORY_COLORS[name] ?? CAT_PALETTE.violet;

/** resolve the colour of any tool by slug (first section that lists it) */
export function toolColorOf(slug: string): CatColor {
  for (const s of TOOL_SECTIONS) {
    if (s.tools.some((t) => t.slug === slug)) return kitSectionColor(s.title);
  }
  return CAT_PALETTE.teal;
}

/** resolve the colour of any game by slug */
export function gameColorOf(slug: string): CatColor {
  for (const s of PLAY_SECTIONS) {
    if (s.games.some((g) => g.slug === slug)) return playSectionColor(s.title);
  }
  return CAT_PALETTE.rose;
}
