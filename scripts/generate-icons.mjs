/**
 * SlashAI icon generator — single source of truth for every app icon.
 *
 * Design (matches the site's design law):
 *   bg:   #12161C rounded square (site background)
 *   mark: lightning bolt through a slash, gradient #58a6ff → #a78bfa (accent → violet)
 *   maskable/monochrome variants handled per output
 *
 * Generates:
 *   public/favicon.png                64×64
 *   public/favicon.ico-style 32px     (public/favicon-32.png, linked in __root)
 *   public/icons/icon-192.png         PWA any
 *   public/icons/icon-512.png         PWA any
 *   public/icons/icon-maskable-512.png  (mark at 66% safe zone)
 *   public/icons/android-adaptive-fg.png 1024×1024 monochrome (white mark, transparent bg)
 *   android mipmap dirs: ic_launcher (48–192), ic_launcher_round (circle),
 *   ic_launcher_foreground (adaptive mark, 2× density sizes)
 *
 * Run: bun scripts/generate-icons.mjs
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const BG = "#12161C";
const GRAD_A = "#58a6ff";
const GRAD_B = "#a78bfa";

/* The mark: a lightning bolt whose stem is cut by a diagonal slash gap. */
function boltMark({ color = "url(#g)", stroke = "none" } = {}) {
  return `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GRAD_A}"/>
      <stop offset="1" stop-color="${GRAD_B}"/>
    </linearGradient>
  </defs>
  <g transform="translate(500 500) scale(1.62) translate(-500 -500)">
    <path
      d="M561 169 L349 536 L472 536 L421 831 L665 442 L532 442 Z"
      fill="${color}"
      stroke="${stroke}"
      stroke-width="${stroke === "none" ? 0 : 26}"
      stroke-linejoin="round"
    />
  </g>`;
}

/** Full square icon (rounded corners at large sizes; OS crops smaller ones). */
function squareIcon({ rounded = true } = {}) {
  const rx = rounded ? 118 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" rx="${rx}" fill="${BG}"/>
  ${boltMark()}
</svg>`;
}

/** Maskable: mark kept inside the 66% safe-zone circle. */
function maskableIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="${BG}"/>
  <g transform="translate(500 500) scale(1.08) translate(-500 -500)">
    ${boltMark().replace(/<defs>[\s\S]*?<\/defs>/, "")}
  </g>
</svg>`;
}

/** Android adaptive foreground: mark in the center 44% (safe zone ~66Ø). */
function adaptiveForeground({ mono = false } = {}) {
  const fill = mono ? "#ffffff" : "url(#g)";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  ${mono ? "" : `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${GRAD_A}"/><stop offset="1" stop-color="${GRAD_B}"/></linearGradient></defs>`}
  <g transform="translate(500 500) scale(0.92) translate(-500 -500)">
    <path
      d="M561 169 L349 536 L472 536 L421 831 L665 442 L532 442 Z"
      fill="${fill}"
    />
  </g>
</svg>`;
}

/** Round icon: circular clip of the square design. */
function roundIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs><clipPath id="c"><circle cx="512" cy="512" r="512"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="1024" height="1024" fill="${BG}"/>
    ${boltMark().replace(/<defs>[\s\S]*?<\/defs>/, "")}
  </g>
</svg>`;
}

async function render(svg, size, out, opts = {}) {
  await sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log("✓", out, `${size}×${size}`);
}

async function main() {
  await mkdir("public/icons", { recursive: true });

  /* ── Web / PWA ── */
  await render(squareIcon(), 64, "public/favicon.png");
  await render(squareIcon(), 32, "public/favicon-32.png");
  await render(squareIcon(), 180, "public/icons/apple-touch-icon.png");
  await render(squareIcon(), 192, "public/icons/icon-192.png");
  await render(squareIcon(), 512, "public/icons/icon-512.png");
  await render(maskableIcon(), 512, "public/icons/icon-maskable-512.png");
  await render(adaptiveForeground({ mono: true }), 1024, "public/icons/android-adaptive-fg.png");

  /* ── Android mipmaps ── */
  const densities = [
    ["mdpi", 48],
    ["hdpi", 72],
    ["xhdpi", 96],
    ["xxhdpi", 144],
    ["xxxhdpi", 192],
  ];
  for (const [dpi, size] of densities) {
    const dir = `android/app/src/main/res/mipmap-${dpi}`;
    await mkdir(dir, { recursive: true });
    await render(squareIcon({ rounded: false }), size, `${dir}/ic_launcher.png`);
    await render(roundIcon(), size, `${dir}/ic_launcher_round.png`);
    await render(adaptiveForeground(), size * 2, `${dir}/ic_launcher_foreground.png`);
  }

  console.log("\nAll icons generated.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
