import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/color-picker")({ component: ColorPicker });

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return m ? { r: parseInt(m[1] ?? "0", 16), g: parseInt(m[2] ?? "0", 16), b: parseInt(m[3] ?? "0", 16) } : null;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function luminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }) as [number, number, number];
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }) {
  const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function ColorPicker() {
  const [color, setColor] = useState("#58a6ff");
  const [bgColor, setBgColor] = useState("#0d1117");
  const [copied, setCopied] = useState("");

  const rgb = useMemo(() => hexToRgb(color) || { r: 0, g: 0, b: 0 }, [color]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);
  const bgRgb = useMemo(() => hexToRgb(bgColor) || { r: 0, g: 0, b: 0 }, [bgColor]);
  const ratio = useMemo(() => contrastRatio(rgb, bgRgb), [rgb, bgRgb]);
  const rating = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA Large" : "Fail";

  const copy = (text: string, label: string) => { navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(""), 1200); };

  const palettes = useMemo(() => {
    const base = hsl.h;
    return {
      complementary: `hsl(${(base + 180) % 360}, ${hsl.s}%, ${hsl.l}%)`,
      analogous1: `hsl(${(base + 30) % 360}, ${hsl.s}%, ${hsl.l}%)`,
      analogous2: `hsl(${(base - 30 + 360) % 360}, ${hsl.s}%, ${hsl.l}%)`,
      triadic1: `hsl(${(base + 120) % 360}, ${hsl.s}%, ${hsl.l}%)`,
      triadic2: `hsl(${(base + 240) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    };
  }, [hsl]);

  return (
    <AppShell title="Color Picker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎨 Color Picker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick colors, convert formats, check contrast ratio, generate palettes.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex gap-3 items-center">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="size-16 rounded-xl border border-border cursor-pointer" />
          <div className="flex-1 space-y-1">
            <input value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-8 rounded-lg border border-border bg-surface px-2 font-mono text-sm" />
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>RGB({rgb.r}, {rgb.g}, {rgb.b})</span>
              <span>HSL({hsl.h}°, {hsl.s}%, {hsl.l}%)</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["HEX", "RGB", "HSL", "CSS"].map((label) => {
            const vals: Record<string, string> = { HEX: color, RGB: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, HSL: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, CSS: `--color: ${color};` };
            const val = vals[label] ?? "";
            return (
            <button key={label} onClick={() => copy(val, label)} className="rounded-lg border border-border bg-surface p-2 text-left">
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="text-xs font-mono text-foreground truncate">{copied === label ? "✓ Copied" : val}</p>
            </button>
          ); })}
        </div>
        {/* Contrast check */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Contrast Checker</p>
          <div className="flex gap-2 items-center mb-2">
            <div className="flex items-center gap-2"><label className="text-[10px] text-muted-foreground">FG</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="size-6 rounded" /></div>
            <div className="flex items-center gap-2"><label className="text-[10px] text-muted-foreground">BG</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="size-6 rounded" /></div>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: bgColor, color }}>
            <p className="text-lg font-bold">Sample Text Aa</p>
          </div>
          <p className="mt-2 text-xs text-center"><span className="font-bold">{ratio.toFixed(2)}</span> · <span className={rating === "Fail" ? "text-red-400" : "text-green"}>{rating}</span></p>
        </div>
        {/* Palette */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Color Palette</p>
          <div className="flex gap-2">
            {Object.entries(palettes).map(([name, hex]) => (
              <button key={name} onClick={() => copy(hex, name)} className="flex-1 rounded-lg h-12 transition-transform hover:scale-105" style={{ backgroundColor: hex }} title={name} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
