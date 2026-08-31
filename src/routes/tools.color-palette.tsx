import { useState, useCallback, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Copy, Check, Download, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/tools/color-palette")({
  head: () => ({ meta: [{ title: "Color Palette Studio — SlashAI" }] }),
  component: ColorPalette,
});

function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  return `#${[f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("")}`;
}

function generatePalette(hex: string) {
  const [h, s, l] = hexToHSL(hex);
  const tints = [95, 90, 80, 70].map((l) => ({ hex: hslToHex(h, s, l), label: `Tint ${100 - l}%` }));
  const shades = [40, 30, 20, 10].map((l) => ({ hex: hslToHex(h, s, l), label: `Shade ${l}%` }));
  const complementary = [{ hex: hslToHex((h + 180) % 360, s, l), label: "Complementary" }];
  const analogous = [
    { hex: hslToHex((h + 30) % 360, s, l), label: "Analogous +30°" },
    { hex: hslToHex((h - 30 + 360) % 360, s, l), label: "Analogous -30°" },
  ];
  const triadic = [
    { hex: hslToHex((h + 120) % 360, s, l), label: "Triadic +120°" },
    { hex: hslToHex((h + 240) % 360, s, l), label: "Triadic +240°" },
  ];
  return { tints, shades, complementary, analogous, triadic };
}

function Swatch({ hex, label }: { hex: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <button onClick={copy} className="group relative overflow-hidden rounded-lg border border-border" style={{ background: hex }}>
      <div className="h-16 w-full" />
      <div className="flex items-center justify-between bg-surface px-2 py-1.5">
        <span className="font-mono text-[10px] text-muted-foreground uppercase">{hex}</span>
        {copied ? <Check className="size-3 text-green" /> : <Copy className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
      </div>
    </button>
  );
}

function ColorPalette() {
  const [hex, setHex] = useState("#58a6ff");
  const [copiedFmt, setCopiedFmt] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const palette = generatePalette(hex);
  const [h, s, l] = hexToHSL(hex);

  const copyFormat = (fmt: string) => {
    navigator.clipboard.writeText(fmt);
    setCopiedFmt(fmt);
    setTimeout(() => setCopiedFmt(""), 1500);
  };

  const randomColor = useCallback(() => {
    setHex(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`);
  }, []);

  const extractFromImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        // Sample 5 positions
        const sample = (x: number, y: number) => ctx.getImageData(x, y, 1, 1).data;
        const positions = [
          sample(img.width / 4, img.height / 4),
          sample(img.width / 2, img.height / 2),
          sample(3 * img.width / 4, 3 * img.height / 4),
          sample(img.width / 2, img.height / 4),
          sample(img.width / 4, img.height / 2),
        ];
        const colors = positions.map((data) => {
          const r = data[0] ?? 0;
          const g = data[1] ?? 0;
          const b = data[2] ?? 0;
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        });
        if (colors[0]) setHex(colors[0]);
      };
      img.src = URL.createObjectURL(file);
    };
    input.click();
  }, []);

  const formats = [
    `--primary: ${hex};`,
    `color: ${hex};`,
    `background: ${hex};`,
    `HEX: ${hex}`,
    `RGB: rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`,
    `HSL: hsl(${h}, ${s}%, ${l}%)`,
    `--tw-${hex.slice(1)}: ${hex};`,
  ];

  return (
    <AppShell title="Color Palette Studio">
      <canvas ref={canvasRef} className="hidden" />
      <div className="mx-auto max-w-3xl space-y-6 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Color Palette Studio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate palettes from any color. Extract from images. Copy as CSS/Tailwind.
          </p>
        </div>

        {/* Input */}
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="size-12 cursor-pointer rounded-lg border border-border bg-transparent"
          />
          <input
            type="text"
            value={hex}
            onChange={(e) => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) setHex(e.target.value); }}
            className="h-12 flex-1 rounded-lg border border-border bg-surface px-4 font-mono text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            placeholder="#58a6ff"
          />
          <button onClick={randomColor} className="flex size-12 items-center justify-center rounded-lg border border-border bg-surface-elevated text-muted-foreground transition-all hover:text-foreground" title="Random">
            <RefreshCw className="size-4" />
          </button>
          <button onClick={extractFromImage} className="flex h-12 items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 text-sm text-muted-foreground transition-all hover:text-foreground">
            🖼️ From image
          </button>
        </div>

        {/* Copy formats */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {formats.map((f) => (
            <button key={f} onClick={() => copyFormat(f)} className="rounded-lg border border-border bg-surface px-3 py-2 text-left font-mono text-[11px] text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground">
              {copiedFmt === f ? <span className="text-green">Copied!</span> : f}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="flex gap-3">
          <div className="flex-1 rounded-[10px] border border-border p-4" style={{ background: hex }}>
            <p className="text-lg font-bold" style={{ color: l > 50 ? "#000" : "#fff" }}>Light text preview</p>
            <p className="text-sm" style={{ color: l > 50 ? "#333" : "#ddd" }}>Body text on this color</p>
          </div>
          <div className="flex-1 rounded-[10px] border border-border bg-surface p-4">
            <p className="text-lg font-bold text-foreground">Dark surface preview</p>
            <p className="text-sm" style={{ color: hex }}>Accent text on dark</p>
          </div>
        </div>

        {/* Palette groups */}
        {Object.entries(palette).map(([group, colors]) => (
          <div key={group}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group}</h3>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6">
              {colors.map((c) => (
                <Swatch key={c.hex + c.label} hex={c.hex} label={c.label} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
