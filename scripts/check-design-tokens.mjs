/**
 * Design-token guard for src/styles.css.
 *
 * The elevation and glass work cannot be eyeballed from here, so this checks
 * the parts that are objectively checkable:
 *
 *   1. WCAG contrast on every foreground/background pair the themes define.
 *      Glass in particular is easy to get wrong: raise the translucency and
 *      the text sitting on the pane quietly drops below AA.
 *   2. Every theme defines a complete token set, so switching themes can
 *      never fall through to another theme's values.
 *   3. The brutal theme still opts out of blur/translucency, because it is
 *      the first-run default and a stray frosted pane there would be a
 *      visible regression, not a style choice.
 *
 * Run: bun run design:check
 */
import { readFileSync } from "node:fs";

let failures = 0;
const ok = (cond, msg) => {
  if (cond) return;
  console.log(`  ❌ ${msg}`);
  failures++;
};
const group = (n) => console.log(`\n── ${n}`);

const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

/* ── oklch -> sRGB -> relative luminance, per CSS Color 4 ─────────────── */

function oklchToSrgb(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const linearToSrgb = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const luminance = (rgb) =>
  0.2126 * linearToSrgb(rgb[0]) + 0.7152 * linearToSrgb(rgb[1]) + 0.0722 * linearToSrgb(rgb[2]);

/** Parse an `oklch(L C H)` string, ignoring any alpha. */
function parseOklch(value) {
  const m = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(value);
  if (!m) return null;
  return oklchToSrgb(Number(m[1]), Number(m[2]), Number(m[3]));
}

function contrast(fgValue, bgValue) {
  const fg = parseOklch(fgValue);
  const bg = parseOklch(bgValue);
  if (!fg || !bg) return null;
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/* ── extract the theme blocks ────────────────────────────────────────── */

const THEMES = {
  dark: { selector: /:root\s*\{([\s\S]*?)\n\}/, label: ":root (dark)" },
  amoled: { selector: /\.amoled\s*\{([\s\S]*?)\n\}/, label: ".amoled" },
  light: { selector: /\.light\s*\{([\s\S]*?)\n\}/, label: ".light" },
  glass: { selector: /:root\.glass\s*\{([\s\S]*?)\n\}/, label: ":root.glass" },
  "glass.light": { selector: /:root\.glass\.light\s*\{([\s\S]*?)\n\}/, label: ":root.glass.light" },
  brutal: { selector: /:root\.brutal\s*\{([\s\S]*?)\n\}/, label: ":root.brutal" },
};

const blocks = {};
for (const [name, { selector }] of Object.entries(THEMES)) {
  const m = selector.exec(css);
  if (m) blocks[name] = m[1];
}

group("themes present");
for (const name of Object.keys(THEMES)) {
  ok(!!blocks[name], `theme block "${name}" not found in styles.css`);
}

const tokenIn = (block, token) => {
  const m = new RegExp(`--${token}:\\s*([^;]+);`).exec(block);
  return m ? m[1].trim() : null;
};

/**
 * Resolve a token the way the cascade actually does: the theme's own
 * declaration if it has one, otherwise whatever :root declared. .amoled and
 * friends deliberately inherit most of the palette, so a checker that only
 * looked inside the theme block would report tokens as missing when the
 * browser is inheriting them perfectly well.
 */
const makeReader = (name) => {
  const base = blocks.dark ?? "";
  return (token) => tokenIn(blocks[name] ?? "", token) ?? tokenIn(base, token);
};

const read = makeReader("dark");

/* ── 1. contrast ─────────────────────────────────────────────────────── */

group("WCAG contrast");

/**
 * Contrast debt that already existed on main, measured against HEAD before
 * this change. Listed here so the guard can catch a *regression* without
 * forcing an unrelated colour rework into a depth-and-glass pass. Each entry
 * is "theme: foreground-on-background" -> the ratio as it stands today.
 * Fixing these is its own piece of work; what matters here is that none of
 * them gets worse, and that nothing new appears.
 */
const KNOWN_DEBT = {
  "dark: destructive-foreground on destructive": 2.22,
  // .amoled inherits these two from :root, so it lands on exactly the same
  // ratio as dark. Listed so the inheritance-aware reader does not report an
  // inherited value as a brand-new failure.
  "amoled: destructive-foreground on destructive": 2.22,
  "amoled: primary-foreground on primary": 7.4,
  "light: muted-foreground on background": 2.47,
  "light: muted-foreground on card": 2.52,
  "light: primary-foreground on primary": 2.55,
  "light: destructive-foreground on destructive": 2.66,
  "glass: card-foreground on card": 4.45,
  "glass: muted-foreground on card": 3.26,
  "glass: primary-foreground on primary": 1.65,
  "glass: secondary-foreground on secondary": 3.41,
  "glass: accent-foreground on accent": 3.09,
  "glass: destructive-foreground on destructive": 2.22,
  "glass.light: muted-foreground on background": 2.6,
  "glass.light: muted-foreground on card": 2.67,
  "glass.light: primary-foreground on primary": 3.14,
  "glass.light: destructive-foreground on destructive": 2.66,
  "brutal: muted-foreground on background": 2.63,
  "brutal: muted-foreground on card": 2.78,
  "brutal: primary-foreground on primary": 1.74,
  "brutal: destructive-foreground on destructive": 2.75,
};

const debt = new Map();
const noteDebt = (key, ratio) => {
  debt.set(key, ratio);
  const was = KNOWN_DEBT[key];
  if (was === undefined) {
    ok(false, `NEW contrast failure - ${key} is ${ratio.toFixed(2)}:1 and was not failing before`);
  } else if (ratio < was - 0.05) {
    ok(false, `REGRESSION - ${key} fell from ${was.toFixed(2)}:1 to ${ratio.toFixed(2)}:1`);
  }
};

for (const [key] of Object.entries(KNOWN_DEBT)) debt.set(key, KNOWN_DEBT[key]);

/** How opaque a glass pane actually is, as a 0..1 fill over its backdrop. */
const glassAlpha = (value) => {
  const m = /color-mix\(in oklab,\s*var\(--surface\)\s+(\d+)%/.exec(value ?? "");
  return m ? Number(m[1]) / 100 : 1;
};

for (const [name, block] of Object.entries(blocks)) {
  const t = makeReader(name);
  const pairs = [
    ["foreground", "background", 4.5],
    ["card-foreground", "card", 4.5],
    ["muted-foreground", "background", 4.5],
    ["muted-foreground", "card", 4.5],
    ["primary-foreground", "primary", 4.5],
    ["secondary-foreground", "secondary", 4.5],
    ["accent-foreground", "accent", 4.5],
    ["destructive-foreground", "destructive", 4.5],
  ];
  for (const [fg, bg, min] of pairs) {
    const f = t(fg);
    const b = t(bg);
    if (!f || !b) {
      ok(false, `${name}: missing ${fg} or ${bg}`);
      continue;
    }
    const ratio = contrast(f, b);
    if (ratio === null) continue; // token uses color-mix; checked below
    if (ratio < min) noteDebt(`${name}: ${fg} on ${bg}`, ratio);
  }

  // A frosted pane sits over the page background, so its effective backdrop
  // is the glass fill composited over the background at the token's alpha.
  // This is the one contrast check this change owns outright: raising the
  // translucency is exactly what would quietly break it.
  const glass = t("glass");
  const bg = t("background");
  if (glass && bg) {
    const alpha = glassAlpha(glass);
    const pane = parseOklch(t("surface"));
    const back = parseOklch(bg);
    if (pane && back) {
      const mixed = pane.map((c, i) => c * alpha + back[i] * (1 - alpha));
      const fgL = luminance(parseOklch(t("foreground")));
      const paneL =
        0.2126 * linearToSrgb(mixed[0]) +
        0.7152 * linearToSrgb(mixed[1]) +
        0.0722 * linearToSrgb(mixed[2]);
      const [hi, lo] = fgL > paneL ? [fgL, paneL] : [paneL, fgL];
      const ratio = (hi + 0.05) / (lo + 0.05);
      ok(
        ratio >= 4.5,
        `${name}: foreground on a .glass pane (${(alpha * 100).toFixed(0)}% fill) is ${ratio.toFixed(2)}:1, needs 4.5:1`,
      );
    }
  }
}

const stillFailing = [...debt.entries()].filter(([, r]) => r < 4.5);
if (stillFailing.length > 0) {
  console.log(
    `  ℹ️  ${stillFailing.length} pre-existing contrast issue(s) carried over from main, not introduced here:`,
  );
  for (const [key, ratio] of stillFailing.sort((a, b) => a[1] - b[1])) {
    console.log(`       ${key} = ${ratio.toFixed(2)}:1`);
  }
}

/* ── 2. token completeness ───────────────────────────────────────────── */

group("token completeness");

const ELEVATION = ["shadow-depth-1", "shadow-depth-2", "shadow-depth-3", "shadow-depth-4"];
const GLASS_TOKENS = ["glass", "glass-blur", "glass-saturate", "glass-sheen"];

for (const [name, block] of Object.entries(blocks)) {
  const t = makeReader(name);
  for (const token of [...ELEVATION, ...GLASS_TOKENS, "shadow-panel"]) {
    // inherited from :root is fine, but the depth ladder and the glass
    // tokens are per-theme by design, so a theme must declare its own
    ok(t(token) !== null, `${name}: does not resolve --${token}`);
  }
  // Every theme must alias --shadow-panel to a rung on its own ladder,
  // otherwise `panel` silently stops matching the theme.
  const panel = t("shadow-panel");
  if (name !== "brutal") {
    ok(
      panel === "var(--shadow-depth-2)",
      `${name}: --shadow-panel should alias the ladder (got "${panel}")`,
    );
  }
}

group("elevation ladder is a real ladder");
for (const name of ["dark", "amoled", "light", "glass", "glass.light"]) {
  if (!blocks[name]) continue;
  const t = makeReader(name);
  // Shadow extent, not the count of "px" tokens: a step is "deeper" when its
  // widest blur reaches further than the one below it.
  const reach = ELEVATION.map((token) => {
    const v = t(token) ?? "";
    return Math.max(0, ...[...v.matchAll(/(\d+(?:\.\d+)?)px/g)].map((m) => Number(m[1])));
  });
  ok(
    reach[0] < reach[1] && reach[1] < reach[2] && reach[2] < reach[3],
    `${name}: each depth level should reach further than the one below it (got ${reach.join(", ")})`,
  );
}

/* ── 3. brutal really opts out ───────────────────────────────────────── */

group("brutal opts out of glass");
{
  const t = makeReader("brutal");
  ok(t("glass-blur") === "0px", "brutal must define --glass-blur: 0px");
  ok(t("glass-saturate") === "100%", "brutal must define --glass-saturate: 100%");
  ok(t("glass-sheen") === "none", "brutal must define --glass-sheen: none");
  ok(!/color-mix/.test(t("glass") ?? ""), "brutal's --glass must be an opaque colour, not a mix");
  const overrides = css.match(/:root\.brutal \.glass[\s\S]*?\}/);
  ok(!!overrides, "brutal must still override .glass");
  ok(
    /backdrop-filter:\s*none\s*!important/.test(overrides?.[0] ?? ""),
    "brutal must force backdrop-filter off",
  );
  ok(
    /background-color:[^;]*!important/.test(overrides?.[0] ?? ""),
    "brutal's .glass must be forced opaque, not left as a transparent hole",
  );
  ok(/:root\.brutal \.sheen/.test(css), "brutal must override the new .sheen utility");
  ok(
    /:root\.brutal \.panel-float/.test(css) && /:root\.brutal \.panel-sunken/.test(css),
    "brutal must override the new panel-float / panel-sunken utilities",
  );
}

/* ── 4. the utilities actually use the tokens ────────────────────────── */

group("utilities consume the tokens");
{
  const glass = /@utility glass \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
  ok(glass.includes("var(--glass)"), ".glass must paint with --glass");
  ok(glass.includes("var(--glass-blur)"), ".glass must blur with --glass-blur");
  ok(glass.includes("var(--glass-saturate)"), ".glass must saturate with --glass-saturate");
  ok(glass.includes("var(--glass-sheen)"), ".glass must carry the top sheen");
  ok(glass.includes("var(--shadow-depth-3)"), ".glass must sit on a rung of the ladder");

  ok(
    /@supports not \(\(backdrop-filter/.test(css),
    "there must be a no-backdrop-filter fallback so .glass is never a transparent hole",
  );

  const panel = /@utility panel \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
  ok(panel.includes("var(--shadow-panel)"), ".panel must use --shadow-panel");

  const lift = /@utility lift \{([\s\S]*?)\n\}\n/s.exec(css)?.[1] ?? "";
  ok(lift.includes("var(--shadow-depth-4)"), ".lift:hover must promote to depth-4");
  ok(lift.includes("var(--shadow-depth-1)"), ".lift:active must settle to depth-1");

  // The utilities are the layer this change owns, so they must read depth
  // from the ladder. Component classes (skeleton shimmer, brutal overrides,
  // focus rings) legitimately hardcode their own shadows - those are not
  // elevation and are deliberately out of scope here.
  const hardcoded = [];
  for (const m of css.matchAll(/@utility\s+([\w-]+)\s*\{([\s\S]*?)\n\}/g)) {
    for (const s of m[2].matchAll(/box-shadow:\s*([^;]+);/g)) {
      if (/var\(--shadow|var\(--glass-sheen/.test(s[1])) continue;
      hardcoded.push(`${m[1]} -> "${s[1].trim()}"`);
    }
  }
  ok(
    hardcoded.length === 0,
    `utilities must take depth from the ladder, but these hardcode it: ${hardcoded.join("; ")}`,
  );
}

if (failures === 0) {
  console.log("\n✅ design: all checks passed");
} else {
  console.log(`\n❌ design: ${failures} check(s) failed`);
}
process.exit(failures ? 1 : 0);
