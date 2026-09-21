/**
 * Toolkit operations — the pure functions behind every declarative tool.
 *
 * Each op takes the raw input plus the option values chosen in the UI and
 * returns the rendered output. Everything runs client-side; nothing is sent
 * anywhere. Ops that need cryptography return a promise (Web Crypto is async).
 */

/**
 * Option bag handed to every op. The named optional fields are declared so
 * dot-access stays type-safe under `noPropertyAccessFromIndexSignature`,
 * while the index signature keeps the bag open for new tools.
 */
export interface OpOptions {
  [key: string]: string | undefined;
  width?: string;
  length?: string;
  shift?: string;
  count?: string;
  words?: string;
  charset?: string;
  min?: string;
  max?: string;
  algo?: string;
  name?: string;
  table?: string;
  pattern?: string;
  flags?: string;
  to?: string;
  days?: string;
  x?: string;
  y?: string;
  blur?: string;
  spread?: string;
  radius?: string;
  angle?: string;
  alpha?: string;
  vw?: string;
  justify?: string;
  align?: string;
  gap?: string;
  url?: string;
  image?: string;
  priority?: string;
  changefreq?: string;
}

export type OpFn = (input: string, opts: OpOptions) => string | Promise<string>;

/* ── small shared helpers ─────────────────────────────────────────── */

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const lines = (s: string) => s.split(/\r?\n/);
const unique = <T>(arr: T[]) => [...new Set(arr)];

const stripTags = (s: string) => s.replace(/<[^>]*>/g, "");

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const unescapeHtml = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

/** longest common subsequence diff, rendered as -/+ lines */
function lineDiff(a: string, b: string): string {
  const A = lines(a);
  const B = lines(b);
  const m = A.length;
  const n = B.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i]![j] = A[i] === B[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    }
  }
  const out: string[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (A[i] === B[j]) {
      out.push(`  ${A[i]}`);
      i++;
      j++;
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      out.push(`- ${A[i]}`);
      i++;
    } else {
      out.push(`+ ${B[j]}`);
      j++;
    }
  }
  while (i < m) out.push(`- ${A[i++]}`);
  while (j < n) out.push(`+ ${B[j++]}`);
  return out.join("\n");
}

function levenshtein(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0]!;
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]!;
      prev[j] = Math.min(prev[j]! + 1, prev[j - 1]! + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = tmp;
    }
  }
  return prev[b.length]!;
}

const toBase64 = (s: string) => {
  try {
    return btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  } catch {
    return btoa(unescape(encodeURIComponent(s)));
  }
};
const fromBase64 = (s: string) => {
  try {
    const bin = atob(s.trim());
    return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  } catch {
    return "⚠ Not valid base64.";
  }
};

const MORSE: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..", j: ".---",
  k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-",
  u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
};
const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

const toMorse = (s: string) =>
  s
    .toLowerCase()
    .split(/\s+/)
    .map((word) => [...word].map((c) => MORSE[c] ?? "").filter(Boolean).join(" "))
    .join(" / ");
const fromMorse = (s: string) =>
  s
    .trim()
    .split(/\s*\/\s*/)
    .map((word) => word.split(/\s+/).map((code) => MORSE_REV[code] ?? "").join(""))
    .join(" ");

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
};
const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, Math.round(l * 100)];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (max === rr) h = ((gg - bb) / d) % 6;
  else if (max === gg) h = (bb - rr) / d + 2;
  else h = (rr - gg) / d + 4;
  return [Math.round(((h * 60) + 360) % 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const ss = s / 100;
  const ll = l / 100;
  const c = (1 - Math.abs(2 * ll - 1)) * ss;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ll - c / 2;
  let rgb: [number, number, number] = [0, 0, 0];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return [Math.round((rgb[0] + m) * 255), Math.round((rgb[1] + m) * 255), Math.round((rgb[2] + m) * 255)];
}

const luminance = (r: number, g: number, b: number) => {
  const chan = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
};

const contrast = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) => {
  const la = luminance(a.r, a.g, a.b);
  const lb = luminance(b.r, b.g, b.b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const parseRgb = (s: string) => {
  const m = s.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
  if (!m) return null;
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
};
const parseHsl = (s: string) => {
  const m = s.match(/(\d{1,3})\D+(\d{1,3})%?\D+(\d{1,3})%?/);
  if (!m) return null;
  return { h: Number(m[1]), s: Number(m[2]), l: Number(m[3]) };
};
const parseAnyColour = (s: string) => {
  const t = s.trim();
  if (t.startsWith("#")) return hexToRgb(t);
  if (/rgb/i.test(t)) {
    const p = parseRgb(t);
    return p ? { r: p.r, g: p.g, b: p.b } : null;
  }
  if (/hsl/i.test(t)) {
    const p = parseHsl(t);
    if (!p) return null;
    const [r, g, b] = hslToRgb(p.h, p.s, p.l);
    return { r, g, b };
  }
  return null;
};

const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const UUID_ALPHABET = "0123456789abcdef";
const randomHex = (n: number) =>
  Array.from({ length: n }, () => UUID_ALPHABET[Math.floor(Math.random() * 16)]).join("");

const uuidV4 = () =>
  `${randomHex(8)}-${randomHex(4)}-4${randomHex(3)}-${"89ab"[Math.floor(Math.random() * 4)]}${randomHex(3)}-${randomHex(12)}`;

const WORDS_POOL =
  "the quick brown fox jumps over lazy dog river stone bright quiet mountain forest candle window silver garden meadow lantern harbour compass orchard velvet marble thistle whisper coral anchor north current ripple".split(" ");

const lorem = (count: number, unit: "words" | "sentences" | "paragraphs") => {
  const word = () => WORDS_POOL[Math.floor(Math.random() * WORDS_POOL.length)]!;
  const sentence = () => {
    const n = 8 + Math.floor(Math.random() * 10);
    const s = Array.from({ length: n }, word).join(" ");
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  };
  if (unit === "words") return Array.from({ length: count }, word).join(" ");
  if (unit === "sentences") return Array.from({ length: count }, sentence).join(" ");
  return Array.from({ length: count }, () => Array.from({ length: 4 + Math.floor(Math.random() * 3) }, sentence).join(" ")).join("\n\n");
};

const titles = {
  upper: (s: string) => s.toUpperCase(),
  lower: (s: string) => s.toLowerCase(),
  title: (s: string) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  sentence: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
  camel: (s: string) =>
    words(s.replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2"))
      .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
      .join(""),
  pascal: (s: string) =>
    words(s.replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2"))
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(""),
  snake: (s: string) => slugify(s).replace(/-/g, "_"),
  kebab: (s: string) => slugify(s),
  constant: (s: string) => slugify(s).replace(/-/g, "_").toUpperCase(),
  dot: (s: string) => slugify(s).replace(/-/g, "."),
  alternating: (s: string) =>
    [...s].map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join(""),
  inverse: (s: string) => [...s].map((c) => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase())).join(""),
  slug: slugify,
};

/* ── the operation table ──────────────────────────────────────────── */

export const OPS: Record<string, OpFn> = {
  /* text statistics */
  wordCount: (s) => {
    const w = words(s);
    const sentences = s.split(/[.!?]+/).filter((x) => x.trim()).length;
    const paragraphs = s.split(/\n\s*\n/).filter((x) => x.trim()).length;
    return [
      `Words:      ${w.length}`,
      `Characters: ${s.length}`,
      `No spaces:  ${s.replace(/\s/g, "").length}`,
      `Sentences:  ${sentences}`,
      `Paragraphs: ${paragraphs}`,
      `Lines:      ${lines(s).length}`,
      `Unique words: ${unique(w.map((x) => x.toLowerCase())).length}`,
      `Avg word length: ${w.length ? (w.join("").length / w.length).toFixed(1) : 0}`,
    ].join("\n");
  },
  charCount: (s) => `${s.length} characters · ${s.replace(/\s/g, "").length} excluding spaces · ${lines(s).length} lines`,
  readingTime: (s) => {
    const w = words(s).length;
    return `${w} words\n≈ ${Math.ceil(w / 220)} min reading (220 wpm)\n≈ ${Math.ceil(w / 130)} min reading aloud (130 wpm)`;
  },
  wordFrequency: (s) => {
    const map = new Map<string, number>();
    for (const w of words(s.toLowerCase().replace(/[^a-z0-9\s'-]/gi, ""))) map.set(w, (map.get(w) ?? 0) + 1);
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([w, n]) => `${String(n).padStart(4)}  ${w}`)
      .join("\n");
  },
  charFrequency: (s) => {
    const map = new Map<string, number>();
    for (const c of [...s]) if (/\S/.test(c)) map.set(c, (map.get(c) ?? 0) + 1);
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([c, n]) => `${String(n).padStart(4)}  ${c}`)
      .join("\n");
  },
  readability: (s) => {
    const w = words(s);
    const sentences = s.split(/[.!?]+/).filter((x) => x.trim()).length || 1;
    const syllables = w.reduce((acc, word) => acc + Math.max(1, (word.toLowerCase().match(/[aeiouy]+/g) ?? []).length), 0);
    const asl = w.length / sentences;
    const asw = syllables / (w.length || 1);
    const flesch = 206.835 - 1.015 * asl - 84.6 * asw;
    const grade = 0.39 * asl + 11.8 * asw - 15.59;
    const band =
      flesch >= 90 ? "Very easy (5th grade)" :
      flesch >= 80 ? "Easy (6th grade)" :
      flesch >= 70 ? "Fairly easy (7th grade)" :
      flesch >= 60 ? "Plain English (8th-9th)" :
      flesch >= 50 ? "Fairly difficult (10th-12th)" :
      flesch >= 30 ? "Difficult (college)" : "Very difficult (graduate)";
    return `Flesch Reading Ease: ${flesch.toFixed(1)} — ${band}\nFlesch-Kincaid Grade: ${grade.toFixed(1)}\nWords ${w.length} · sentences ${sentences} · syllables ${syllables}`;
  },
  longestWords: (s) =>
    unique(words(s.toLowerCase().replace(/[^a-z\s]/g, "")))
      .sort((a, b) => b.length - a.length)
      .slice(0, 15)
      .map((w) => `${String(w.length).padStart(3)}  ${w}`)
      .join("\n"),

  /* case + naming */
  upper: (s) => titles.upper(s),
  lower: (s) => titles.lower(s),
  titleCase: (s) => titles.title(s),
  sentenceCase: (s) => titles.sentence(s),
  camelCase: (s) => titles.camel(s),
  pascalCase: (s) => titles.pascal(s),
  snakeCase: (s) => titles.snake(s),
  kebabCase: (s) => titles.kebab(s),
  constantCase: (s) => titles.constant(s),
  dotCase: (s) => titles.dot(s),
  alternatingCase: (s) => titles.alternating(s),
  inverseCase: (s) => titles.inverse(s),
  slugify: (s) => slugify(s),

  /* cleaning */
  collapseSpaces: (s) => s.replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").trim(),
  removeLineBreaks: (s) => s.replace(/\s*\n\s*/g, " ").trim(),
  removeEmptyLines: (s) => lines(s).filter((l) => l.trim()).join("\n"),
  trimLines: (s) => lines(s).map((l) => l.trim()).join("\n"),
  dedupeLines: (s) => unique(lines(s).map((l) => l.trim()).filter(Boolean)).join("\n"),
  dedupeWords: (s) => unique(words(s)).join(" "),
  stripPunctuation: (s) => s.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim(),
  stripNumbers: (s) => s.replace(/\d+/g, "").replace(/[ \t]+/g, " ").trim(),
  stripHtml: (s) => unescapeHtml(stripTags(s)).replace(/\s+/g, " ").trim(),
  stripUrls: (s) => s.replace(/https?:\/\/\S+/g, "").replace(/[ \t]{2,}/g, " ").trim(),
  stripEmoji: (s) => s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "").trim(),
  removeAccents: (s) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, ""),

  /* line shaping */
  reverseText: (s) => [...s].reverse().join(""),
  reverseWords: (s) => words(s).reverse().join(" "),
  reverseLines: (s) => lines(s).reverse().join("\n"),
  shuffleLines: (s) => {
    const l = lines(s);
    for (let i = l.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = l[i]!;
      l[i] = l[j]!;
      l[j] = t;
    }
    return l.join("\n");
  },
  sortLinesAsc: (s) => lines(s).slice().sort((a, b) => a.localeCompare(b)).join("\n"),
  sortLinesDesc: (s) => lines(s).slice().sort((a, b) => b.localeCompare(a)).join("\n"),
  sortByLength: (s) => lines(s).slice().sort((a, b) => a.length - b.length).join("\n"),
  numberLines: (s) => lines(s).map((l, i) => `${String(i + 1).padStart(3)}. ${l}`).join("\n"),
  bulletLines: (s) => lines(s).filter((l) => l.trim()).map((l) => `• ${l.trim()}`).join("\n"),
  indentLines: (s) => lines(s).map((l) => `    ${l}`).join("\n"),
  wrapText: (s, o) => {
    const width = Math.max(20, Number(o.width ?? 80));
    return lines(s)
      .map((line) => {
        const out: string[] = [];
        let cur = "";
        for (const w of line.split(/\s+/)) {
          if ((cur + " " + w).trim().length > width) {
            if (cur) out.push(cur);
            cur = w;
          } else cur = (cur + " " + w).trim();
        }
        if (cur) out.push(cur);
        return out.join("\n");
      })
      .join("\n");
  },
  truncate: (s, o) => {
    const n = Math.max(1, Number(o.length ?? 120));
    return s.length <= n ? s : s.slice(0, n).trimEnd() + "…";
  },

  /* extraction */
  extractEmails: (s) => unique(s.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? []).join("\n"),
  extractUrls: (s) => unique(s.match(/https?:\/\/[^\s<>"')]+/g) ?? []).join("\n"),
  extractDomains: (s) =>
    unique(
      (s.match(/https?:\/\/[^\s<>"')]+/g) ?? [])
        .map((u) => {
          try {
            return new URL(u).hostname;
          } catch {
            return "";
          }
        })
        .filter(Boolean),
    ).join("\n"),
  extractPhones: (s) => unique(s.match(/(?:\+\d{1,3}[\s-]?)?(?:\(?\d{3,5}\)?[\s-]?)\d{3}[\s-]?\d{3,4}/g) ?? []).join("\n"),
  extractNumbers: (s) => (s.match(/-?\d+(?:\.\d+)?/g) ?? []).join("\n"),
  extractHashtags: (s) => unique(s.match(/#[\w]+/g) ?? []).join("\n"),
  extractMentions: (s) => unique(s.match(/@[\w.]+/g) ?? []).join("\n"),
  extractHexColors: (s) => unique(s.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).join("\n"),
  extractIps: (s) => unique(s.match(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g) ?? []).join("\n"),
  extractDates: (s) =>
    unique(
      s.match(/\b(?:\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4})\b/g) ?? [],
    ).join("\n"),

  /* encoding */
  base64Encode: (s) => toBase64(s),
  base64Decode: (s) => fromBase64(s),
  urlEncode: (s) => encodeURIComponent(s),
  urlDecode: (s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return "⚠ Not valid percent-encoding.";
    }
  },
  htmlEscape: (s) => escapeHtml(s),
  htmlUnescape: (s) => unescapeHtml(s),
  hexEncode: (s) => [...new TextEncoder().encode(s)].map((b) => b.toString(16).padStart(2, "0")).join(" "),
  hexDecode: (s) => {
    const parts = s.trim().split(/\s+|(?<=..)(?=..)/).filter(Boolean);
    try {
      return new TextDecoder().decode(Uint8Array.from(parts.map((p) => parseInt(p, 16))));
    } catch {
      return "⚠ Not valid hex.";
    }
  },
  binaryEncode: (s) => [...new TextEncoder().encode(s)].map((b) => b.toString(2).padStart(8, "0")).join(" "),
  binaryDecode: (s) => {
    try {
      return new TextDecoder().decode(Uint8Array.from(s.trim().split(/\s+/).map((b) => parseInt(b, 2))));
    } catch {
      return "⚠ Not valid binary.";
    }
  },
  rot13: (s) => s.replace(/[a-z]/gi, (c) => String.fromCharCode(((c.charCodeAt(0) - (c <= "Z" ? 65 : 97) + 13) % 26) + (c <= "Z" ? 65 : 97))),
  caesar: (s, o) => {
    const shift = ((Number(o.shift ?? 3) % 26) + 26) % 26;
    return s.replace(/[a-z]/gi, (c) => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
    });
  },
  morseEncode: (s) => toMorse(s),
  morseDecode: (s) => fromMorse(s),
  unicodeEscape: (s) => [...s].map((c) => (c.charCodeAt(0) > 126 ? `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}` : c)).join(""),
  unicodeUnescape: (s) => s.replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))),
  asciiCodes: (s) => [...s].map((c) => c.charCodeAt(0)).join(" "),
  jwtDecode: (s) => {
    const parts = s.trim().split(".");
    if (parts.length < 2) return "⚠ A JWT has three dot-separated parts.";
    const dec = (p: string) => {
      try {
        return JSON.stringify(JSON.parse(fromBase64(p.replace(/-/g, "+").replace(/_/g, "/"))), null, 2);
      } catch {
        return "⚠ Could not decode this part.";
      }
    };
    return `── header ──\n${dec(parts[0]!)}\n\n── payload ──\n${dec(parts[1]!)}`;
  },

  /* generators */
  uuid: (s, o) => Array.from({ length: Math.max(1, Math.min(50, Number(o.count ?? 1))) }, uuidV4).join("\n"),
  nanoid: (s, o) => {
    const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const len = Math.max(4, Math.min(64, Number(o.length ?? 21)));
    return Array.from({ length: Math.max(1, Math.min(50, Number(o.count ?? 1))) }, () =>
      Array.from({ length: len }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join(""),
    ).join("\n");
  },
  password: (s, o) => {
    const len = Math.max(8, Math.min(128, Number(o.length ?? 20)));
    const sets = ["abcdefghijkmnopqrstuvwxyz", "ABCDEFGHJKLMNPQRSTUVWXYZ", "23456789", "!@#$%^&*()-_=+[]{}?"];
    const pool = sets.join("");
    return Array.from({ length: Math.max(1, Math.min(20, Number(o.count ?? 1))) }, () => {
      const chars = [sets[0]!, sets[1]!, sets[2]!, sets[3]!].map((set) => set[Math.floor(Math.random() * set.length)]!);
      while (chars.length < len) chars.push(pool[Math.floor(Math.random() * pool.length)]!);
      return chars.sort(() => Math.random() - 0.5).join("");
    }).join("\n");
  },
  passphrase: (s, o) => {
    const list = "amber anchor atlas beacon bison blaze canyon cedar cinder citrus clover cobalt comet copper coral cosmos crimson dawn delta drift ember falcon fern flint forge garnet glacier granite harbour hazel indigo ivory jade juniper kestrel lagoon lantern larch lilac linen lotus maple marble meadow mint nimbus noble oasis onyx opal orchid osprey pebble pine quartz quill raven reef ripple rowan saffron sage sable sienna slate sorrel spruce summit thistle timber topaz umber velvet violet walnut willow yarrow zephyr".split(" ");
    const count = Math.max(3, Math.min(8, Number(o.words ?? 4)));
    return Array.from({ length: Math.max(1, Math.min(10, Number(o.count ?? 1))) }, () =>
      Array.from({ length: count }, () => list[Math.floor(Math.random() * list.length)]!).join("-"),
    ).join("\n");
  },
  randomString: (s, o) => {
    const len = Math.max(1, Math.min(256, Number(o.length ?? 32)));
    const charset = o.charset === "hex" ? "0123456789abcdef" : o.charset === "numeric" ? "0123456789" : o.charset === "alnum" ? "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array.from({ length: len }, () => charset[Math.floor(Math.random() * charset.length)]).join("");
  },
  loremWords: (s, o) => lorem(Math.max(1, Math.min(500, Number(o.count ?? 50))), "words"),
  loremSentences: (s, o) => lorem(Math.max(1, Math.min(50, Number(o.count ?? 5))), "sentences"),
  loremParagraphs: (s, o) => lorem(Math.max(1, Math.min(20, Number(o.count ?? 3))), "paragraphs"),
  randomNumbers: (s, o) => {
    const min = Number(o.min ?? 1);
    const max = Number(o.max ?? 100);
    const count = Math.max(1, Math.min(100, Number(o.count ?? 10)));
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min).join(", ");
  },

  /* hashing (Web Crypto) */
  hash: async (s, o) => {
    const algo = o.algo ?? "SHA-256";
    try {
      const digest = await crypto.subtle.digest(algo, new TextEncoder().encode(s));
      return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      return "⚠ Hashing needs a secure context (https or localhost).";
    }
  },

  /* JSON */
  jsonFormat: (s) => {
    try {
      return JSON.stringify(JSON.parse(s), null, 2);
    } catch (e) {
      return `⚠ Invalid JSON — ${(e as Error).message}`;
    }
  },
  jsonMinify: (s) => {
    try {
      return JSON.stringify(JSON.parse(s));
    } catch (e) {
      return `⚠ Invalid JSON — ${(e as Error).message}`;
    }
  },
  jsonValidate: (s) => {
    try {
      const v = JSON.parse(s);
      const type = Array.isArray(v) ? "array" : typeof v;
      const size = Array.isArray(v) ? v.length : Object.keys(v as object).length;
      return `✅ Valid JSON\nRoot type: ${type}\nTop-level entries: ${size}\nSize: ${s.length} bytes`;
    } catch (e) {
      return `❌ Invalid JSON\n${(e as Error).message}`;
    }
  },
  jsonSortKeys: (s) => {
    const walk = (v: unknown): unknown => {
      if (Array.isArray(v)) return v.map(walk);
      if (v && typeof v === "object") {
        return Object.fromEntries(
          Object.keys(v as Record<string, unknown>)
            .sort()
            .map((k) => [k, walk((v as Record<string, unknown>)[k])]),
        );
      }
      return v;
    };
    try {
      return JSON.stringify(walk(JSON.parse(s)), null, 2);
    } catch {
      return "⚠ Invalid JSON.";
    }
  },
  jsonFlatten: (s) => {
    try {
      const out: Record<string, unknown> = {};
      const walk = (v: unknown, prefix: string) => {
        if (v && typeof v === "object" && !Array.isArray(v)) {
          for (const [k, val] of Object.entries(v as Record<string, unknown>)) walk(val, prefix ? `${prefix}.${k}` : k);
        } else out[prefix] = v;
      };
      walk(JSON.parse(s), "");
      return JSON.stringify(out, null, 2);
    } catch {
      return "⚠ Invalid JSON.";
    }
  },
  jsonEscape: (s) => JSON.stringify(s),
  jsonUnescape: (s) => {
    try {
      return JSON.parse(s);
    } catch {
      return s.replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
    }
  },
  jsonToCsv: (s) => {
    try {
      const data = JSON.parse(s);
      if (!Array.isArray(data) || data.length === 0) return "⚠ Expected a non-empty array of objects.";
      const cols = unique(data.flatMap((row) => Object.keys(row as object)));
      const cell = (v: unknown) => {
        const str = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
        return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
      };
      return [cols.join(","), ...data.map((row) => cols.map((c) => cell((row as Record<string, unknown>)[c])).join(","))].join("\n");
    } catch {
      return "⚠ Invalid JSON.";
    }
  },
  jsonToTypes: (s, o) => {
    const name = o.name ?? "Root";
    try {
      const data = JSON.parse(s);
      const typeOf = (v: unknown): string => {
        if (v === null) return "null";
        if (Array.isArray(v)) return v.length ? `${typeOf(v[0])}[]` : "unknown[]";
        if (typeof v === "object") return "Record<string, unknown>";
        return typeof v;
      };
      if (Array.isArray(data)) return `export type ${name} = ${typeOf(data)};\n\nexport type ${name}Item = {\n${Object.entries((data[0] ?? {}) as Record<string, unknown>).map(([k, v]) => `  ${k}: ${typeOf(v)};`).join("\n")}\n};`;
      return `export interface ${name} {\n${Object.entries(data as Record<string, unknown>)
        .map(([k, v]) => `  ${k}: ${typeOf(v)};`)
        .join("\n")}\n}`;
    } catch {
      return "⚠ Invalid JSON.";
    }
  },
  jsonToSql: (s, o) => {
    const table = o.table ?? "my_table";
    try {
      const data = JSON.parse(s);
      const rows = Array.isArray(data) ? data : [data];
      const cols = unique(rows.flatMap((r) => Object.keys(r as object)));
      const val = (v: unknown) =>
        v === null || v === undefined ? "NULL" : typeof v === "number" ? String(v) : typeof v === "boolean" ? (v ? "TRUE" : "FALSE") : `'${String(v).replace(/'/g, "''")}'`;
      return rows
        .map((r) => `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${cols.map((c) => val((r as Record<string, unknown>)[c])).join(", ")});`)
        .join("\n");
    } catch {
      return "⚠ Invalid JSON.";
    }
  },

  /* CSV */
  csvToJson: (s) => {
    const rows = lines(s.trim()).filter(Boolean);
    if (rows.length < 2) return "⚠ Need a header row plus at least one data row.";
    const split = (line: string) => {
      const out: string[] = [];
      let cur = "";
      let quoted = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i]!;
        if (c === '"') {
          if (quoted && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else quoted = !quoted;
        } else if (c === "," && !quoted) {
          out.push(cur);
          cur = "";
        } else cur += c;
      }
      out.push(cur);
      return out.map((x) => x.trim());
    };
    const head = split(rows[0]!);
    const data = rows.slice(1).map((r) => {
      const cells = split(r);
      return Object.fromEntries(head.map((h, i) => [h, cells[i] ?? ""]));
    });
    return JSON.stringify(data, null, 2);
  },
  csvToMarkdown: (s) => {
    const rows = lines(s.trim()).filter(Boolean).map((l) => l.split(",").map((c) => c.trim().replace(/^"|"$/g, "")));
    if (rows.length === 0) return "⚠ Paste CSV first.";
    const head = rows[0]!;
    return [head, head.map(() => "---"), ...rows.slice(1)].map((r) => `| ${r.join(" | ")} |`).join("\n");
  },
  csvTranspose: (s) => {
    const rows = lines(s.trim()).filter(Boolean).map((l) => l.split(",").map((c) => c.trim()));
    const width = Math.max(...rows.map((r) => r.length));
    return Array.from({ length: width }, (_, c) => rows.map((r) => r[c] ?? "").join(",")).join("\n");
  },

  /* regex */
  regexTest: (s, o) => {
    const pattern = o.pattern ?? "";
    const flags = o.flags ?? "g";
    if (!pattern) return "⚠ Enter a pattern in the options.";
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const matches = [...s.matchAll(re)];
      if (matches.length === 0) return "No matches.";
      const list = matches
        .slice(0, 100)
        .map((m, i) => `${i + 1}. "${m[0]}" at index ${m.index}${m.length > 1 ? `  groups: ${m.slice(1).map((g) => g ?? "—").join(" | ")}` : ""}`)
        .join("\n");
      return `${matches.length} match${matches.length === 1 ? "" : "es"}\n\n${list}`;
    } catch (e) {
      return `⚠ Invalid pattern — ${(e as Error).message}`;
    }
  },
  regexEscape: (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  regexExtract: (s, o) => {
    const pattern = o.pattern ?? "";
    if (!pattern) return "⚠ Enter a pattern in the options.";
    try {
      return unique([...s.matchAll(new RegExp(pattern, "g"))].map((m) => m[0])).join("\n");
    } catch (e) {
      return `⚠ Invalid pattern — ${(e as Error).message}`;
    }
  },

  /* diff + comparison */
  diffLines: (s) => {
    const [a, b] = s.split(/^---+\s*$/m);
    if (a === undefined || b === undefined) return "⚠ Separate the two versions with a line containing only ---";
    return lineDiff(a.trim(), b.trim());
  },
  levenshtein: (s) => {
    const [a, b] = s.split(/^---+\s*$/m);
    if (a === undefined || b === undefined) return "⚠ Separate the two strings with a line containing only ---";
    const dist = levenshtein(a.trim(), b.trim());
    const max = Math.max(a.trim().length, b.trim().length) || 1;
    return `Edit distance: ${dist}\nSimilarity: ${(100 - (dist / max) * 100).toFixed(1)}%`;
  },
  palindromeCheck: (s) => {
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const ok = clean === [...clean].reverse().join("");
    return ok ? `✅ Yes — "${clean}" reads the same both ways.` : `❌ No — reversed it reads "${[...clean].reverse().join("")}".`;
  },
  anagramCheck: (s) => {
    const [a, b] = s.split(/^---+\s*$/m);
    if (a === undefined || b === undefined) return "⚠ Separate the two words with a line containing only ---";
    const key = (x: string) => [...x.toLowerCase().replace(/[^a-z]/g, "")].sort().join("");
    return key(a) === key(b) ? "✅ Yes — those are anagrams." : "❌ No — the letters do not match.";
  },

  /* colour */
  colorConvert: (s, o) => {
    const target = o.to ?? "rgb";
    const rgb = parseAnyColour(s);
    if (!rgb) return "⚠ Enter a colour like #2dd4bf, rgb(45,212,191) or hsl(172,80%,50%).";
    const [h, sat, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
    if (target === "rgb") return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    if (target === "hsl") return `hsl(${h}, ${sat}%, ${l}%)`;
    if (target === "hex") return rgbToHex(rgb.r, rgb.g, rgb.b);
    return [
      `HEX  ${rgbToHex(rgb.r, rgb.g, rgb.b)}`,
      `RGB  rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      `HSL  hsl(${h}, ${sat}%, ${l}%)`,
      `Luminance ${luminance(rgb.r, rgb.g, rgb.b).toFixed(3)}`,
    ].join("\n");
  },
  colorContrast: (s) => {
    const [a, b] = s.split(/^---+\s*$/m);
    const c1 = parseAnyColour(a ?? "");
    const c2 = parseAnyColour(b ?? "");
    if (!c1 || !c2) return "⚠ Put one colour above a --- line and the second below it.";
    const ratio = contrast(c1, c2);
    const verdict = (n: number, large: boolean) =>
      ratio >= (large ? 3 : 4.5) ? "passes" : "fails";
    return `Contrast ratio: ${ratio.toFixed(2)}:1\n\nNormal text (AA 4.5:1) — ${verdict(4.5, false)}\nLarge text (AA 3:1) — ${verdict(3, true)}\nAAA normal (7:1) — ${ratio >= 7 ? "passes" : "fails"}\nAAA large (4.5:1) — ${ratio >= 4.5 ? "passes" : "fails"}`;
  },
  colorShades: (s) => {
    const rgb = parseAnyColour(s.split("\n")[0] ?? s);
    if (!rgb) return "⚠ Enter a colour like #2dd4bf.";
    const steps = [0.9, 0.75, 0.6, 0.45, 0.3, 0.15, 0];
    return steps
      .map((t) => {
        const r = rgb.r + (255 - rgb.r) * t;
        const g = rgb.g + (255 - rgb.g) * t;
        const b = rgb.b + (255 - rgb.b) * t;
        return `${rgbToHex(r, g, b)}  ${t === 0 ? "(base)" : `${Math.round((1 - t) * 100)}%`}`;
      })
      .join("\n");
  },
  colorHarmony: (s) => {
    const rgb = parseAnyColour(s.split("\n")[0] ?? s);
    if (!rgb) return "⚠ Enter a colour like #2dd4bf.";
    const [h, sat, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const at = (deg: number) => {
      const [r, g, b] = hslToRgb((h + deg + 360) % 360, sat, l);
      return rgbToHex(r, g, b);
    };
    return [
      `base        ${rgbToHex(rgb.r, rgb.g, rgb.b)}`,
      `complement  ${at(180)}`,
      ``,
      `analogous   ${at(-30)}  ${at(30)}`,
      `triadic     ${at(120)}  ${at(240)}`,
      `split-comp  ${at(150)}  ${at(210)}`,
      `tetradic    ${at(90)}  ${at(180)}  ${at(270)}`,
    ].join("\n");
  },
  colorPalette: (s, o) => {
    const base = parseAnyColour(s.split("\n")[0] ?? s) ?? { r: 45, g: 212, b: 191 };
    const count = Math.max(3, Math.min(10, Number(o.count ?? 5)));
    const [h, sat0, l0] = rgbToHsl(base.r, base.g, base.b);
    return Array.from({ length: count }, (_, i) => {
      const hue = (h + i * Math.round(360 / count)) % 360;
      const sat = Math.max(35, Math.min(95, sat0 + (i % 2 === 0 ? 6 : -6)));
      const l = Math.max(28, Math.min(72, l0 + (i - count / 2) * 6));
      const [r, g, b] = hslToRgb(hue, sat, l);
      return `${rgbToHex(r, g, b)}  hsl(${hue}, ${sat}%, ${Math.round(l)}%)`;
    }).join("\n");
  },
  randomColor: (s, o) => {
    const count = Math.max(1, Math.min(20, Number(o.count ?? 6)));
    return Array.from({ length: count }, () => {
      const [r, g, b] = hslToRgb(Math.floor(Math.random() * 360), 60 + Math.floor(Math.random() * 30), 42 + Math.floor(Math.random() * 20));
      return rgbToHex(r, g, b);
    }).join("\n");
  },

  /* dates */
  timestampToDate: (s) => {
    const n = Number(s.trim());
    if (!Number.isFinite(n)) return "⚠ Enter a Unix timestamp in seconds or milliseconds.";
    const ms = String(Math.trunc(n)).length > 10 ? n : n * 1000;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return "⚠ That timestamp is out of range.";
    return [
      `ISO (UTC)   ${d.toISOString()}`,
      `Local       ${d.toString()}`,
      `Date only   ${d.toISOString().slice(0, 10)}`,
      `Relative    ${relative(d)}`,
    ].join("\n");
  },
  dateToTimestamp: (s) => {
    const d = new Date(s.trim());
    if (Number.isNaN(d.getTime())) return "⚠ Could not read that date. Try 2026-09-21 or 21 Sep 2026.";
    return `Seconds: ${Math.floor(d.getTime() / 1000)}\nMilliseconds: ${d.getTime()}\nISO: ${d.toISOString()}`;
  },
  daysBetween: (s) => {
    const dates = s.split(/^---+\s*$/m).map((x) => new Date(x.trim()));
    if (dates.length < 2 || dates.some((d) => Number.isNaN(d.getTime())))
      return "⚠ Put a date above a --- line and the second below it.";
    const [a, b] = dates as [Date, Date];
    const ms = Math.abs(b.getTime() - a.getTime());
    const days = ms / 86400000;
    let weekdays = 0;
    const step = new Date(Math.min(a.getTime(), b.getTime()));
    const end = Math.max(a.getTime(), b.getTime());
    while (step.getTime() <= end) {
      const day = step.getDay();
      if (day !== 0 && day !== 6) weekdays++;
      step.setDate(step.getDate() + 1);
    }
    return `Days: ${Math.floor(days)}\nWeeks: ${(days / 7).toFixed(2)}\nWeekdays: ${weekdays}\nMonths (approx): ${(days / 30.44).toFixed(2)}\nYears (approx): ${(days / 365.25).toFixed(3)}`;
  },
  addDays: (s, o) => {
    const d = new Date(s.trim());
    if (Number.isNaN(d.getTime())) return "⚠ Could not read that date.";
    const n = Number(o.days ?? 30);
    d.setDate(d.getDate() + n);
    return `${d.toISOString().slice(0, 10)} (${d.toDateString()})`;
  },
  weekNumber: (s) => {
    const d = s.trim() ? new Date(s.trim()) : new Date();
    if (Number.isNaN(d.getTime())) return "⚠ Could not read that date.";
    const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = target.getUTCDay() || 7;
    target.setUTCDate(target.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `ISO week: ${target.getUTCFullYear()}-W${String(week).padStart(2, "0")}\nDay of year: ${Math.ceil((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)}\nQuarter: Q${Math.floor(d.getMonth() / 3) + 1}`;
  },

  /* css */
  cssBoxShadow: (s, o) => {
    const x = Number(o.x ?? 0);
    const y = Number(o.y ?? 8);
    const blur = Number(o.blur ?? 24);
    const spread = Number(o.spread ?? -6);
    const colour = (s.split("\n")[0] ?? "#000").trim() || "#000";
    return `box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${colour};`;
  },
  cssBorderRadius: (s, o) => {
    const n = Number(o.radius ?? 12);
    return `border-radius: ${n}px;\n\n/* pill */\nborder-radius: 9999px;\n\n/* blob */\nborder-radius: ${n * 2}px ${n * 4}px ${n * 2}px ${n * 4}px;`;
  },
  cssGradient: (s, o) => {
    const [a, b] = s.split(/^---+\s*$/m);
    const from = (a ?? "#2dd4bf").trim();
    const to = (b ?? "#a78bfa").trim();
    const deg = Number(o.angle ?? 135);
    return `background: linear-gradient(${deg}deg, ${from}, ${to});\n\n/* with a hard stop */\nbackground: linear-gradient(${deg}deg, ${from} 0%, ${from} 50%, ${to} 50%, ${to} 100%);`;
  },
  cssGlass: (s, o) => {
    const blur = Number(o.blur ?? 14);
    const alpha = Number(o.alpha ?? 0.12);
    return `background: rgba(255, 255, 255, ${alpha});\nbackdrop-filter: blur(${blur}px) saturate(140%);\n-webkit-backdrop-filter: blur(${blur}px) saturate(140%);\nborder: 1px solid rgba(255, 255, 255, 0.18);`;
  },
  cssClamp: (s, o) => {
    const min = Number(o.min ?? 16);
    const vw = Number(o.vw ?? 2.5);
    const max = Number(o.max ?? 32);
    return `font-size: clamp(${min}px, ${vw}vw, ${max}px);`;
  },
  cssFlex: (s, o) => {
    const justify = o.justify ?? "center";
    const align = o.align ?? "center";
    const gap = o.gap ?? "1rem";
    return `.row {\n  display: flex;\n  justify-content: ${justify};\n  align-items: ${align};\n  gap: ${gap};\n}`;
  },

  /* web + seo */
  metaTags: (s, o) => {
    const title = (s.split("\n")[0] ?? "").trim() || "Page title";
    const desc = (s.split("\n").slice(1).join(" ") || "Page description").trim().slice(0, 160);
    const url = o.url ?? "https://example.com";
    const image = o.image ?? "https://example.com/og.png";
    return `<title>${title}</title>\n<meta name="description" content="${desc}" />\n<link rel="canonical" href="${url}" />\n\n<meta property="og:type" content="website" />\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n<meta property="og:url" content="${url}" />\n<meta property="og:image" content="${image}" />\n\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${desc}" />\n<meta name="twitter:image" content="${image}" />`;
  },
  robotsTxt: (s) => {
    const paths = lines(s).map((l) => l.trim()).filter(Boolean);
    const disallow = paths.length ? paths : ["/admin", "/api/", "/private"];
    return ["User-agent: *", ...disallow.map((p) => `Disallow: ${p}`), "", "Sitemap: https://example.com/sitemap.xml"].join("\n");
  },
  sitemapEntry: (s, o) => {
    const urls = lines(s).map((l) => l.trim()).filter(Boolean);
    const priority = o.priority ?? "0.8";
    const freq = o.changefreq ?? "weekly";
    return urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
      )
      .join("\n");
  },
  keywordDensity: (s) => {
    const w = words(s.toLowerCase().replace(/[^a-z0-9\s]/g, " ")).filter((x) => x.length > 2);
    const total = w.length || 1;
    const map = new Map<string, number>();
    for (let i = 0; i < w.length; i++) {
      const one = w[i]!;
      map.set(one, (map.get(one) ?? 0) + 1);
      if (i + 1 < w.length) {
        const two = `${one} ${w[i + 1]!}`;
        map.set(two, (map.get(two) ?? 0) + 1);
      }
    }
    return [...map.entries()]
      .filter(([, n]) => n > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([k, n]) => `${(n / total * 100).toFixed(2)}%  ${k} (${n})`)
      .join("\n");
  },
  urlParse: (s) => {
    try {
      const u = new URL(s.trim());
      return [
        `protocol  ${u.protocol}`,
        `host      ${u.host}`,
        `hostname  ${u.hostname}`,
        `port      ${u.port || "(default)"}`,
        `path      ${u.pathname}`,
        `query     ${u.search || "(none)"}`,
        `hash      ${u.hash || "(none)"}`,
        `params    ${u.searchParams.size}`,
        ``,
        ...[...u.searchParams.entries()].map(([k, v]) => `param  ${k} = ${v}`),
      ].join("\n");
    } catch {
      return "⚠ That is not a parseable URL.";
    }
  },
  queryParse: (s) => {
    const q = s.includes("?") ? s.split("?")[1]!.split("#")[0]! : s.trim();
    try {
      const params = new URLSearchParams(q);
      return [...params.entries()].map(([k, v]) => `${k} = ${decodeURIComponent(v)}`).join("\n") || "No parameters found.";
    } catch {
      return "⚠ Could not parse those parameters.";
    }
  },
  queryBuild: (s) => {
    const pairs = lines(s)
      .map((l) => l.split("="))
      .filter((p) => p[0]?.trim());
    return "?" + pairs.map(([k, ...rest]) => `${encodeURIComponent(k!.trim())}=${encodeURIComponent(rest.join("=").trim())}`).join("&");
  },
  markdownTable: (s) => {
    const rows = lines(s).filter(Boolean).map((l) => l.split(/\t|,(?![^\[]*\])/).map((c) => c.trim()));
    if (!rows.length) return "⚠ Paste tab- or comma-separated rows.";
    const width = Math.max(...rows.map((r) => r.length));
    const norm = rows.map((r) => Array.from({ length: width }, (_, i) => r[i] ?? ""));
    const head = norm[0]!;
    return [head, head.map(() => "---"), ...norm.slice(1)].map((r) => `| ${r.join(" | ")} |`).join("\n");
  },

  /* misc transforms */
  swapCase: (s) => titles.inverse(s),
  initials: (s) => words(s).map((w) => w.charAt(0).toUpperCase()).join(""),
  acronym: (s) =>
    words(s)
      .filter((w) => w.length > 2 && !["the", "and", "of", "for", "with"].includes(w.toLowerCase()))
      .map((w) => w.charAt(0).toUpperCase())
      .join(""),
  countdownList: (s, o) => {
    const n = Math.max(1, Math.min(50, Number(o.count ?? 5)));
    const from = Number(s.trim()) || n;
    return Array.from({ length: n }, (_, i) => from - i).join(" → ");
  },
};

/** every op except the ones needing an input box */
export const NO_INPUT_OPS = new Set([
  "uuid", "nanoid", "password", "passphrase", "randomString",
  "loremWords", "loremSentences", "loremParagraphs", "randomNumbers", "randomColor",
]);

function relative(d: Date): string {
  const diff = Date.now() - d.getTime();
  const abs = Math.abs(diff);
  const units: [number, string][] = [
    [31557600000, "year"],
    [2629800000, "month"],
    [604800000, "week"],
    [86400000, "day"],
    [3600000, "hour"],
    [60000, "minute"],
  ];
  for (const [msVal, name] of units) {
    if (abs >= msVal) {
      const n = Math.floor(abs / msVal);
      return `${n} ${name}${n === 1 ? "" : "s"} ${diff > 0 ? "ago" : "from now"}`;
    }
  }
  return "just now";
}
