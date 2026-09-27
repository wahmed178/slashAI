/**
 * Digital bouquet — pure data model.
 *
 * A bouquet is stored entirely in the URL fragment (`/tools/bouquet#...`), so a
 * shared link needs no backend, no account and no storage: the flowers live in
 * the link itself. Keeping the model here (instead of inside the route) makes it
 * testable and keeps the component focused on rendering.
 *
 * IMPORTANT: nothing in here may rely on CSS transforms. The bouquet is
 * serialised to SVG for download, and a CSS `transform` silently overrides the
 * SVG `transform` attribute in the browser while being absent from the
 * exported file — which made the preview and the download disagree. Motion
 * here is opacity only.
 */

export type BloomForm = "rosette" | "cup" | "rays" | "spike" | "star" | "wide";

export interface FlowerTone {
  name: string;
  petal: string;
  core: string;
}

export interface Flower {
  /** short id used in the share code */
  id: string;
  name: string;
  form: BloomForm;
  /** how the petals are drawn */
  petals: number;
  leaf: string;
  /** head size relative to the default rose */
  size: number;
  /** single-glyph stand-in used in the picker and the stem list */
  emoji: string;
  /** swatches the sender can pick from */
  tones: FlowerTone[];
}

const f = (
  id: string,
  name: string,
  form: BloomForm,
  petals: number,
  leaf: string,
  size: number,
  emoji: string,
  tones: [string, string, string][],
): Flower => ({
  id,
  name,
  form,
  petals,
  leaf,
  size,
  emoji,
  tones: tones.map(([name, petal, core]) => ({ name, petal, core })),
});

export const FLOWERS: Flower[] = [
  f("rose", "Rose", "rosette", 7, "#15803d", 1, "🌹", [
    ["Classic red", "#e11d48", "#fb7185"],
    ["Blush pink", "#f9a8d4", "#fbcfe8"],
    ["Ivory", "#f8fafc", "#e7e5e4"],
    ["Sunset orange", "#f97316", "#fdba74"],
    ["Deep plum", "#7e22ce", "#c084fc"],
  ]),
  f("peony", "Peony", "rosette", 9, "#166534", 1.1, "🌸", [
    ["Blush", "#fbcfe8", "#f9a8d4"],
    ["Coral", "#fb7185", "#fda4af"],
    ["White", "#fafaf9", "#e7e5e4"],
    ["Magenta", "#db2777", "#f9a8d4"],
  ]),
  f("tulip", "Tulip", "cup", 3, "#15803d", 0.85, "🌷", [
    ["Red", "#dc2626", "#f87171"],
    ["Yellow", "#facc15", "#fef08a"],
    ["Purple", "#9333ea", "#c084fc"],
    ["Pink", "#ec4899", "#f9a8d4"],
  ]),
  f("sunflower", "Sunflower", "rays", 16, "#3f6212", 1.2, "🌻", [
    ["Golden", "#eab308", "#78350f"],
    ["Amber", "#f59e0b", "#78350f"],
  ]),
  f("daisy", "Daisy", "rays", 10, "#16a34a", 0.9, "🌼", [
    ["White", "#f8fafc", "#facc15"],
    ["Pink", "#f9a8d4", "#facc15"],
  ]),
  f("lavender", "Lavender", "spike", 9, "#4d7c0f", 0.8, "💐", [
    ["Purple", "#a78bfa", "#ddd6fe"],
    ["Blue", "#60a5fa", "#bfdbfe"],
  ]),
  f("hibiscus", "Hibiscus", "wide", 5, "#15803d", 1, "🌺", [
    ["Red", "#db2777", "#fde047"],
    ["Yellow", "#facc15", "#f97316"],
    ["White", "#fdf2f8", "#fde047"],
  ]),
  f("orchid", "Orchid", "star", 5, "#15803d", 0.95, "🌸", [
    ["Purple", "#c084fc", "#fae8ff"],
    ["White", "#fafaf9", "#f5d0fe"],
    ["Pink", "#f9a8d4", "#fdf4ff"],
  ]),
  f("lily", "Lily", "star", 6, "#166534", 1.05, "🌷", [
    ["White", "#f8fafc", "#fbbf24"],
    ["Yellow", "#fef08a", "#b45309"],
  ]),
  f("carnation", "Carnation", "rosette", 12, "#15803d", 0.95, "🌺", [
    ["Pink", "#f472b6", "#fbcfe8"],
    ["White", "#fafaf9", "#e7e5e4"],
    ["Red", "#e11d48", "#fda4af"],
  ]),
  f("poppy", "Poppy", "cup", 4, "#166534", 1, "🌺", [
    ["Scarlet", "#ef4444", "#1c1917"],
    ["Orange", "#f97316", "#1c1917"],
  ]),
  f("gerbera", "Gerbera", "rays", 14, "#16a34a", 1.1, "🌼", [
    ["Coral", "#fb7185", "#f59e0b"],
    ["Yellow", "#facc15", "#b45309"],
    ["Purple", "#a78bfa", "#fde047"],
  ]),
  f("ranunculus", "Ranunculus", "rosette", 10, "#166534", 0.9, "🌸", [
    ["Peach", "#fed7aa", "#fdba74"],
    ["Cream", "#fef3c7", "#fcd34d"],
    ["Lilac", "#ddd6fe", "#c4b5fd"],
  ]),
  f("chrysanthemum", "Chrysanthemum", "rays", 20, "#3f6212", 0.95, "🌾", [
    ["Gold", "#fde047", "#ca8a04"],
    ["White", "#fafaf9", "#e7e5e4"],
    ["Rust", "#c2410c", "#7c2d12"],
  ]),
  f("wildflower", "Wildflower", "rays", 7, "#65a30d", 0.8, "🌾", [
    ["Pink", "#f472b6", "#fde68a"],
    ["Lavender", "#c4b5fd", "#fef08a"],
    ["Blue", "#93c5fd", "#fef9c3"],
  ]),
  f("alstroemeria", "Alstroemeria", "star", 6, "#15803d", 0.85, "🌸", [
    ["Pink", "#fda4af", "#fbbf24"],
    ["Purple", "#d8b4fe", "#fde047"],
    ["Orange", "#fdba74", "#fde047"],
  ]),
];

export const PAPER_COLORS = [
  { id: "kraft", name: "Kraft", bg: "#d9c3a5", wrap: "#bfa07a" },
  { id: "blush", name: "Blush", bg: "#fbcfe8", wrap: "#f0a9c9" },
  { id: "sage", name: "Sage", bg: "#bbf7d0", wrap: "#86efac" },
  { id: "sky", name: "Sky", bg: "#bae6fd", wrap: "#7dd3fc" },
  { id: "butter", name: "Butter", bg: "#fef08a", wrap: "#fde047" },
  { id: "lilac", name: "Lilac", bg: "#ddd6fe", wrap: "#c4b5fd" },
  { id: "ink", name: "Ink", bg: "#cbd5e1", wrap: "#94a3b8" },
  { id: "ivory", name: "Ivory", bg: "#f5f5f4", wrap: "#e7e5e4" },
] as const;

export const RIBBON_COLORS = [
  { id: "crimson", name: "Crimson", value: "#e11d48" },
  { id: "gold", name: "Gold", value: "#d97706" },
  { id: "forest", name: "Forest", value: "#15803d" },
  { id: "navy", name: "Navy", value: "#1e3a8a" },
  { id: "ink", name: "Ink", value: "#1e293b" },
  { id: "blush", name: "Blush", value: "#db2777" },
] as const;

/** how the bouquet is gathered at the waist */
export const WRAP_STYLES = [
  { id: "cone", name: "Cone" },
  { id: "round", name: "Round" },
  { id: "tall", name: "Tall" },
] as const;

export const BOW_STYLES = [
  { id: "classic", name: "Classic bow" },
  { id: "knot", name: "Simple knot" },
  { id: "twine", name: "Twine tie" },
] as const;

export type PaperId = (typeof PAPER_COLORS)[number]["id"];
export type RibbonId = (typeof RIBBON_COLORS)[number]["id"];
export type WrapId = (typeof WRAP_STYLES)[number]["id"];
export type BowId = (typeof BOW_STYLES)[number]["id"];

export interface Stem {
  flower: string;
  /** index into the flower's tone list */
  tone: number;
}

export interface Bouquet {
  stems: Stem[];
  paper: PaperId;
  ribbon: RibbonId;
  wrap: WrapId;
  bow: BowId;
  /** filler leaves tucked between the blooms */
  greenery: boolean;
  /** little white filler flowers */
  breath: boolean;
  /** who it's for, and who it's from */
  to: string;
  from: string;
  message: string;
  /** plain-black-and-white wrapping */
  mono: boolean;
}

export const MAX_STEMS = 30;

export function defaultBouquet(): Bouquet {
  return {
    stems: [
      { flower: "rose", tone: 0 },
      { flower: "rose", tone: 0 },
      { flower: "rose", tone: 0 },
      { flower: "peony", tone: 0 },
      { flower: "peony", tone: 2 },
      { flower: "tulip", tone: 0 },
      { flower: "daisy", tone: 0 },
      { flower: "chrysanthemum", tone: 0 },
    ],
    paper: "blush",
    ribbon: "crimson",
    wrap: "cone",
    bow: "classic",
    greenery: true,
    breath: true,
    to: "",
    from: "",
    message: "Thinking of you today 💛",
    mono: false,
  };
}

/** an empty bunch, for "start fresh" — same style, no flowers at all */
export function emptyBouquet(): Bouquet {
  return { ...defaultBouquet(), stems: [], to: "", from: "", message: "" };
}

export function flowerById(id: string): Flower | undefined {
  return FLOWERS.find((x) => x.id === id);
}

export function toneOf(stem: Stem): { petal: string; core: string; name: string } {
  const flower = flowerById(stem.flower);
  if (!flower) return { petal: "#e11d48", core: "#fb7185", name: "" };
  const tone = flower.tones[Math.min(stem.tone, flower.tones.length - 1)] ?? flower.tones[0]!;
  return { petal: tone.petal, core: tone.core, name: tone.name };
}

export function addStem(b: Bouquet, id: string, tone = 0): Bouquet {
  if (b.stems.length >= MAX_STEMS) return b;
  return { ...b, stems: [...b.stems, { flower: id, tone }] };
}

export function removeStem(b: Bouquet, index: number): Bouquet {
  return { ...b, stems: b.stems.filter((_, i) => i !== index) };
}

/** one-line summary, e.g. "3 roses, 2 daisies" */
export function stemSummary(b: Bouquet): string {
  const counts = new Map<string, number>();
  for (const s of b.stems) counts.set(s.flower, (counts.get(s.flower) ?? 0) + 1);
  return [...counts.entries()]
    .map(([id, n]) => `${n} ${flowerById(id)?.name.toLowerCase() ?? id}${n > 1 ? "s" : ""}`)
    .join(", ");
}

/* ── colour helpers ────────────────────────────────────────────────────── */

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return [
    parseInt(full.slice(0, 2), 16) || 0,
    parseInt(full.slice(2, 4), 16) || 0,
    parseInt(full.slice(4, 6), 16) || 0,
  ];
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => clampByte(v).toString(16).padStart(2, "0")).join("")}`;
}

/** amount < 0 darkens toward black, > 0 lightens toward white */
export function shade(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex);
  if (amount < 0) {
    const k = 1 + amount;
    return toHex(r * k, g * k, b * k);
  }
  return toHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

/* ── layout ──────────────────────────────────────────────────────────────
 * Deterministic: the same bouquet always lays out identically. A small integer
 * hash supplies the jitter so re-renders never reshuffle the arrangement.
 */

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** where every stem is gathered, in the 320×340 viewBox */
export const TIE = { x: 160, y: 258 };

export interface PlacedStem {
  flower: Flower;
  tone: { petal: string; core: string; name: string };
  /** head centre */
  x: number;
  y: number;
  /** stem tilt in degrees, 0 = straight up */
  rotation: number;
  scale: number;
  /** 0 = back of the bouquet, 1 = closest to the viewer */
  depth: number;
  delay: number;
}

export function layout(b: Bouquet): PlacedStem[] {
  const seed = hash(b.stems.map((s) => `${s.flower}${s.tone}`).join(",") + b.wrap);
  const n = b.stems.length;
  const spread = b.wrap === "tall" ? 52 : b.wrap === "round" ? 78 : 66;

  return b.stems.map((stem, i) => {
    const flower = flowerById(stem.flower) ?? FLOWERS[0]!;
    const jitter = (((seed >> (i % 14)) % 1000) / 1000 - 0.5) * 2;
    const t = n <= 1 ? 0.5 : i / (n - 1);
    // -1 (leftmost) .. 1 (rightmost)
    const side = t * 2 - 1;
    const angle = side * spread + jitter * 7;
    const rad = (angle * Math.PI) / 180;
    // outer stems sit slightly lower, the way a hand-tied bunch falls
    const length = 150 - Math.abs(side) * 26 + jitter * 14;

    return {
      flower,
      tone: toneOf(stem),
      x: TIE.x + Math.sin(rad) * length,
      y: TIE.y - Math.cos(rad) * length,
      rotation: angle,
      scale: (0.74 + Math.cos(rad * 0.85) * 0.22) * flower.size,
      // the middle of the bunch is what you see most clearly
      depth: 1 - Math.abs(side),
      delay: i * 55,
    };
  });
}

/** painter's order: the back of the bouquet is drawn first */
export function byDepth(stems: PlacedStem[]): PlacedStem[] {
  return [...stems].sort((a, b) => a.depth - b.depth);
}

export interface Greenery {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  depth: number;
}

/** filler leaves and sprigs tucked between the blooms */
export function greenery(b: Bouquet, count: number): Greenery[] {
  if (!b.greenery || count === 0) return [];
  const seed = hash("leaf" + count + b.wrap);
  const spread = b.wrap === "tall" ? 62 : 78;
  return Array.from({ length: count }, (_, i) => {
    const jitter = (((seed >> (i % 13)) % 1000) / 1000 - 0.5) * 2;
    const t = (i + 0.5) / count;
    const side = t * 2 - 1;
    const angle = side * spread + jitter * 10;
    const rad = (angle * Math.PI) / 180;
    const length = 150 - Math.abs(side) * 22 + jitter * 12;
    return {
      x: TIE.x + Math.sin(rad) * length,
      y: TIE.y - Math.cos(rad) * length,
      rotation: angle,
      scale: 0.9 + (1 - Math.abs(side)) * 0.35,
      depth: 1 - Math.abs(side),
    };
  });
}

/* ── share code ──────────────────────────────────────────────────────────
 * v2.<paper>.<ribbon>.<wrap>.<bow>.<mono><greenery><breath>.<stems>.<text>
 * A stem is `flower~tone`. The three free-text fields travel as ONE URI-encoded
 * JSON token — splitting them on a delimiter would break the moment a message
 * contained a full stop or a pipe, since encodeURIComponent leaves both alone.
 */

export function encodeBouquet(b: Bouquet): string {
  const flags = `${b.mono ? 1 : 0}${b.greenery ? 1 : 0}${b.breath ? 1 : 0}`;
  const stems = b.stems.map((s) => `${s.flower}~${s.tone}`).join(",");
  const text = encodeURIComponent(JSON.stringify([b.from, b.to, b.message]));
  return `v2.${b.paper}.${b.ribbon}.${b.wrap}.${b.bow}.${flags}.${stems}.${text}`;
}

export function decodeBouquet(code: string): Bouquet | null {
  // Only the 7 fixed header fields are dot-separated; the message tail is taken
  // as-is, because a decoded message may legitimately contain full stops.
  const parts = code.split(".");
  if (parts.length < 8 || parts[0] !== "v2") return null;
  const [paper, ribbon, wrap, bow, flags, stems] = parts.slice(1, 7);
  const text = parts.slice(7).join(".");
  if (!paper || !ribbon || !wrap || !bow || !flags || stems === undefined) return null;
  const base = defaultBouquet();

  let words: string[] = ["", "", ""];
  if (text) {
    try {
      const parsed: unknown = JSON.parse(decodeURIComponent(text));
      if (Array.isArray(parsed)) {
        words = parsed.slice(0, 3).map((v) => (typeof v === "string" ? v : ""));
      }
    } catch {
      /* a truncated or hand-edited link just loses the message */
    }
  }

  const parsed = stems
    .split(",")
    .map((token) => {
      const [id, tone] = token.split("~");
      const flower = flowerById(id ?? "");
      if (!flower) return null;
      const t = Number(tone ?? 0);
      return { flower: flower.id, tone: Number.isFinite(t) ? t : 0 };
    })
    .filter((s): s is Stem => Boolean(s))
    .slice(0, MAX_STEMS);

  return {
    ...base,
    stems: parsed,
    paper: (PAPER_COLORS.some((p) => p.id === paper) ? paper : base.paper) as PaperId,
    ribbon: (RIBBON_COLORS.some((r) => r.id === ribbon) ? ribbon : base.ribbon) as RibbonId,
    wrap: (WRAP_STYLES.some((w) => w.id === wrap) ? wrap : base.wrap) as WrapId,
    bow: (BOW_STYLES.some((w) => w.id === bow) ? bow : base.bow) as BowId,
    mono: flags[0] === "1",
    greenery: flags[1] !== "0",
    breath: flags[2] !== "0",
    from: words[0] ?? "",
    to: words[1] ?? "",
    message: words[2] ?? "",
  };
}

/** absolute share url; falls back to the current origin */
export function shareUrl(b: Bouquet): string {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/tools/bouquet#${encodeBouquet(b)}`;
}

/* ── compact share code ─────────────────────────────────────────────────
 * The share page lives at /tools/bouquet/$code, so the link a person sends is
 * a clean, readable path instead of a hash full of punctuation. The payload is
 * base64url-encoded JSON, which round-trips any message character safely.
 */

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(code: string): string | null {
  try {
    const padded = code.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export function encodeShare(b: Bouquet): string {
  return toBase64Url(JSON.stringify(b));
}

export function decodeShare(code: string): Bouquet | null {
  const json = fromBase64Url(code.trim());
  if (!json) return null;
  try {
    const raw: unknown = JSON.parse(json);
    if (!raw || typeof raw !== "object") return null;
    return sanitise(raw as Partial<Bouquet>);
  } catch {
    return null;
  }
}

/** clamp an untrusted payload to the real catalogue, so a hand-edited link
 *  can never inject an unknown flower, paper or 5,000 stems */
function sanitise(raw: Partial<Bouquet>): Bouquet {
  const base = defaultBouquet();
  const stems = Array.isArray(raw.stems)
    ? raw.stems
        .map((s) => {
          const flower = flowerById((s as Stem)?.flower ?? "");
          if (!flower) return null;
          const tone = Number((s as Stem)?.tone ?? 0);
          return {
            flower: flower.id,
            tone: Number.isFinite(tone) ? Math.max(0, Math.floor(tone)) : 0,
          };
        })
        .filter((s): s is Stem => Boolean(s))
        .slice(0, MAX_STEMS)
    : base.stems;
  const str = (v: unknown) => (typeof v === "string" ? v.slice(0, 600) : "");
  return {
    stems,
    paper: (PAPER_COLORS.some((p) => p.id === raw.paper) ? raw.paper : base.paper) as PaperId,
    ribbon: (RIBBON_COLORS.some((r) => r.id === raw.ribbon) ? raw.ribbon : base.ribbon) as RibbonId,
    wrap: (WRAP_STYLES.some((w) => w.id === raw.wrap) ? raw.wrap : base.wrap) as WrapId,
    bow: (BOW_STYLES.some((w) => w.id === raw.bow) ? raw.bow : base.bow) as BowId,
    greenery: raw.greenery !== false,
    breath: raw.breath !== false,
    mono: raw.mono === true,
    from: str(raw.from),
    to: str(raw.to),
    message: str(raw.message),
  };
}

/** the bouquet-only page, which is what a share link should open */
export function sharePageUrl(b: Bouquet): string {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/tools/bouquet/${encodeShare(b)}`;
}
