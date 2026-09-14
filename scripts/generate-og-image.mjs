/**
 * Branded 1200x630 Open Graph image, rendered with sharp (already a
 * devDependency via the icon pipeline). SlashAI lightning mark, product name
 * and tagline on the brand's dark-navy + teal palette.
 *
 * Run: bun scripts/generate-og-image.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2dd4bf" stop-opacity="0.35"/>
      <stop offset="0.55" stop-color="#38bdf8" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#a78bfa" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="word" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#b9f5ee"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#0d1117"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <circle cx="1020" cy="90" r="220" fill="#2dd4bf" opacity="0.07"/>
  <circle cx="150" cy="560" r="260" fill="#38bdf8" opacity="0.06"/>

  <!-- lightning mark -->
  <g transform="translate(120,190)">
    <rect x="0" y="0" width="250" height="250" rx="56" fill="#2dd4bf" opacity="0.12"/>
    <rect x="0" y="0" width="250" height="250" rx="56" fill="none" stroke="#2dd4bf" stroke-opacity="0.45" stroke-width="3"/>
    <path d="M143 45 L88 140 L124 140 L107 205 L166 108 L129 108 Z"
      fill="#2dd4bf" stroke="#0d1117" stroke-width="0"/>
  </g>

  <!-- wordmark -->
  <text x="410" y="292" font-family="Verdana, DejaVu Sans, sans-serif" font-size="92" font-weight="bold" fill="url(#word)">SlashAI</text>
  <text x="412" y="352" font-family="Verdana, DejaVu Sans, sans-serif" font-size="30" fill="#8b949e">Free AI commands, tools &amp; games</text>

  <!-- stat chips -->
  <g font-family="Verdana, DejaVu Sans, sans-serif" font-size="26" font-weight="bold">
    <rect x="410" y="408" rx="24" width="218" height="52" fill="#161b22" stroke="#30363d"/>
    <text x="436" y="443" fill="#2dd4bf">5,000+</text>
    <text x="540" y="443" fill="#8b949e" font-weight="normal" font-size="22">commands</text>

    <rect x="648" y="408" rx="24" width="218" height="52" fill="#161b22" stroke="#30363d"/>
    <text x="674" y="443" fill="#2dd4bf">150+</text>
    <text x="756" y="443" fill="#8b949e" font-weight="normal" font-size="22">tools</text>

    <rect x="886" y="408" rx="24" width="212" height="52" fill="#161b22" stroke="#30363d"/>
    <text x="912" y="443" fill="#2dd4bf">50+</text>
    <text x="988" y="443" fill="#8b949e" font-weight="normal" font-size="22">games</text>
  </g>

  <text x="410" y="530" font-family="Verdana, DejaVu Sans, sans-serif" font-size="24" fill="#6e7681">slashai.in  -  free forever, no account</text>
</svg>`;

await mkdir("public", { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile("public/og-image.png");
console.log("wrote public/og-image.png (1200x630)");
