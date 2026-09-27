/**
 * Digital bouquet — pure data model.
 *
 * A bouquet is stored entirely in the URL fragment (`/tools/bouquet#...`), so a
 * shared link needs no backend, no account and no storage: the flowers live in
 * the link itself. Keeping the model here (instead of inside the route) makes it
 * testable and keeps the component focused on rendering.
 */

export interface Flower {
  /** short id used in the share code */
  id: string;
  name: string;
  /** petal + centre colours */
  petal: string;
  core: string;
  leaf: string;
  /** 0..1, drives how full the bloom looks */
  size: number;
  emoji: string;
}

export const FLOWERS: Flower[] = [
  {
    id: "rose",
    name: "Rose",
    petal: "#e11d48",
    core: "#fb7185",
    leaf: "#15803d",
    size: 1,
    emoji: "🌹",
  },
  {
    id: "peony",
    name: "Peony",
    petal: "#f9a8d4",
    core: "#fbcfe8",
    leaf: "#166534",
    size: 1.1,
    emoji: "🌸",
  },
  {
    id: "tulip",
    name: "Tulip",
    petal: "#f97316",
    core: "#fde68a",
    leaf: "#15803d",
    size: 0.85,
    emoji: "🌷",
  },
  {
    id: "sunflower",
    name: "Sunflower",
    petal: "#eab308",
    core: "#78350f",
    leaf: "#3f6212",
    size: 1.2,
    emoji: "🌻",
  },
  {
    id: "daisy",
    name: "Daisy",
    petal: "#f8fafc",
    core: "#facc15",
    leaf: "#16a34a",
    size: 0.9,
    emoji: "🌼",
  },
  {
    id: "lavender",
    name: "Lavender",
    petal: "#a78bfa",
    core: "#ddd6fe",
    leaf: "#4d7c0f",
    size: 0.8,
    emoji: "💐",
  },
  {
    id: "hibiscus",
    name: "Hibiscus",
    petal: "#db2777",
    core: "#fde047",
    leaf: "#15803d",
    size: 1,
    emoji: "🌺",
  },
  {
    id: "orchid",
    name: "Orchid",
    petal: "#c084fc",
    core: "#fae8ff",
    leaf: "#15803d",
    size: 0.95,
    emoji: "🌸",
  },
  {
    id: "lily",
    name: "Lily",
    petal: "#f8fafc",
    core: "#fbbf24",
    leaf: "#166534",
    size: 1.05,
    emoji: "🌷",
  },
  {
    id: "wildflower",
    name: "Wildflower",
    petal: "#f472b6",
    core: "#fde68a",
    leaf: "#65a30d",
    size: 0.8,
    emoji: "🌾",
  },
];

export const PAPER_COLORS = [
  { id: "kraft", name: "Kraft", bg: "#d9c3a5", wrap: "#c2a683" },
  { id: "blush", name: "Blush", bg: "#fbcfe8", wrap: "#f9a8d4" },
  { id: "sage", name: "Sage", bg: "#bbf7d0", wrap: "#86efac" },
  { id: "sky", name: "Sky", bg: "#bae6fd", wrap: "#7dd3fc" },
  { id: "ink", name: "Ink", bg: "#cbd5e1", wrap: "#94a3b8" },
] as const;

export const RIBBON_COLORS = [
  { id: "crimson", name: "Crimson", value: "#e11d48" },
  { id: "gold", name: "Gold", value: "#d97706" },
  { id: "forest", name: "Forest", value: "#15803d" },
  { id: "ink", name: "Ink", value: "#1e293b" },
] as const;

export type PaperId = (typeof PAPER_COLORS)[number]["id"];
export type RibbonId = (typeof RIBBON_COLORS)[number]["id"];

export interface Bouquet {
  /** one flower id per bloom, so "3 roses" is 3 entries */
  blooms: string[];
  paper: PaperId;
  ribbon: RibbonId;
  /** who it's for, and who it's from */
  to: string;
  from: string;
  message: string;
  /** plain-black-and-white wrapping, like the original */
  mono: boolean;
}

export const MAX_BLOOMS = 24;

export function defaultBouquet(): Bouquet {
  return {
    blooms: ["rose", "rose", "rose", "peony", "peony", "tulip", "daisy", "sunflower"],
    paper: "blush",
    ribbon: "crimson",
    to: "",
    from: "",
    message: "Thinking of you today 💛",
    mono: false,
  };
}

export function flowerById(id: string): Flower | undefined {
  return FLOWERS.find((f) => f.id === id);
}

export function addBloom(b: Bouquet, id: string): Bouquet {
  if (b.blooms.length >= MAX_BLOOMS) return b;
  return { ...b, blooms: [...b.blooms, id] };
}

export function removeBloom(b: Bouquet, index: number): Bouquet {
  return { ...b, blooms: b.blooms.filter((_, i) => i !== index) };
}

/** one-line summary, e.g. "3 roses, 2 daisies" */
export function bloomSummary(b: Bouquet): string {
  const counts = new Map<string, number>();
  for (const id of b.blooms) counts.set(id, (counts.get(id) ?? 0) + 1);
  return [...counts.entries()]
    .map(([id, n]) => `${n} ${flowerById(id)?.name.toLowerCase() ?? id}${n > 1 ? "s" : ""}`)
    .join(", ");
}

/**
 * Deterministic layout: same bouquet → same stems. Uses a small integer hash so
 * the result is stable across renders without a random call on every paint.
 */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export interface PlacedBloom {
  flower: Flower;
  /** stem tip position in the svg viewBox */
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

/** fans the stems out from a single tie point near the bottom of the wrap */
export function layout(b: Bouquet): PlacedBloom[] {
  const key = b.blooms.join(",") + b.paper + b.ribbon;
  const seed = hash(key);
  const cx = 150;
  const tie = 268;
  const span = 108;
  const n = b.blooms.length;
  return b.blooms.map((id, i) => {
    const flower = flowerById(id);
    const t = n <= 1 ? 0.5 : i / (n - 1);
    // deterministic jitter, not Math.random, so re-renders don't reshuffle
    const jitter = ((seed >> (i % 12)) % 100) / 100 - 0.5;
    const arc = Math.sin(t * Math.PI);
    return {
      flower: flower ?? FLOWERS[0]!,
      x: cx + (t - 0.5) * span * 2 + jitter * 8,
      y: tie - 40 - arc * 96 + jitter * 10,
      rotation: (t - 0.5) * 34 + jitter * 10,
      scale: 0.78 + arc * 0.42,
    };
  });
}

/* ── share code ──────────────────────────────────────────────────────────
 * v1.<paper>.<ribbon>.<mono>.blooms|from|to|message
 * Fields are URI-encoded so spaces, emoji and pipes all survive a round-trip.
 */

function field(value: string): string {
  return encodeURIComponent(value.replace(/\|/g, " ").trim());
}

export function encodeBouquet(b: Bouquet): string {
  const body = [b.from, b.to, b.message].map(field).join("|");
  return `v1.${b.paper}.${b.ribbon}.${b.mono ? 1 : 0}.${b.blooms.join(",")}.${body}`;
}

export function decodeBouquet(code: string): Bouquet | null {
  const parts = code.split(".");
  if (parts.length < 6 || parts[0] !== "v1") return null;
  const [, paper, ribbon, mono, blooms, body] = parts;
  if (!paper || !ribbon || mono === undefined || !blooms) return null;
  const text = (body ?? "").split("|");
  const clean = text.map((t) => {
    try {
      return decodeURIComponent(t);
    } catch {
      return "";
    }
  });
  const base = defaultBouquet();
  return {
    ...base,
    blooms: blooms
      .split(",")
      .filter((id) => Boolean(flowerById(id)))
      .slice(0, MAX_BLOOMS),
    paper: (PAPER_COLORS.some((p) => p.id === paper) ? paper : base.paper) as PaperId,
    ribbon: (RIBBON_COLORS.some((r) => r.id === ribbon) ? ribbon : base.ribbon) as RibbonId,
    mono: mono === "1",
    from: clean[0] ?? "",
    to: clean[1] ?? "",
    message: clean[2] ?? "",
  };
}

/** absolute share url; falls back to the current origin */
export function shareUrl(b: Bouquet): string {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/tools/bouquet#${encodeBouquet(b)}`;
}
