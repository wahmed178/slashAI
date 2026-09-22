/**
 * SlashAI icon generator — single source of truth for every app icon.
 *
 * Design (matches the site's design law):
 *   bg:   #12161C rounded square (site background)
 *   mark: lightning bolt through a slash, gradient #58a6ff → #a78bfa (accent → violet)
 *   maskable/monochrome variants handled per output
 *
 * Generates:
 *   public/favicon.ico                16/32/48 multi-size (Google + browsers)
 *   public/favicon-48.png             48×48  (Google's minimum favicon size)
 *   public/favicon-96.png             96×96  (2x, still a multiple of 48)
 *   public/favicon.png                64×64
 *   public/favicon-32.png             32×32
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
import { mkdir, writeFile } from "node:fs/promises";

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

async function render(svg, size, out) {
  await sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log("✓", out, `${size}×${size}`);
}

/** Same render, kept in memory (for the multi-size .ico bundle). */
function pngBuffer(svg, size) {
  return sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Writes a real multi-size .ico.
 *
 * Google's favicon crawler and virtually every browser request /favicon.ico
 * directly, and the site had no such file at all — a blank icon in search
 * results. Entries are PNG-compressed (fine for every current browser), and
 * the ICO format itself is what makes the `/favicon.ico` request a 200.
 *
 * Google also requires the favicon to be square and a multiple of 48px, which
 * is why 48 (and 96) exist — the old 64px/32px pair was silently ignored.
 */
async function writeIco(svg, sizes, out) {
  const images = await Promise.all(sizes.map((s) => pngBuffer(svg, s)));
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(images.length, 4); // image count

  let offset = header.length;
  images.forEach((buf, i) => {
    const e = 6 + i * 16;
    const size = sizes[i];
    header.writeUInt8(size >= 256 ? 0 : size, e); // width (0 = 256)
    header.writeUInt8(size >= 256 ? 0 : size, e + 1); // height
    header.writeUInt8(0, e + 2); // palette size
    header.writeUInt8(0, e + 3); // reserved
    header.writeUInt16LE(1, e + 4); // colour planes
    header.writeUInt16LE(32, e + 6); // bits per pixel
    header.writeUInt32LE(buf.length, e + 8); // image data size
    header.writeUInt32LE(offset, e + 12); // image data offset
    offset += buf.length;
  });

  await writeFile(out, Buffer.concat([header, ...images]));
  console.log("✓", out, `${sizes.join("/")}px`);
}

async function main() {
  await mkdir("public/icons", { recursive: true });

  /* ── Web / PWA ── */
  await writeIco(squareIcon(), [16, 32, 48], "public/favicon.ico");
  await render(squareIcon(), 48, "public/favicon-48.png");
  await render(squareIcon(), 96, "public/favicon-96.png");
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
