import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/text-to-handwriting")({ component: TextToHandwriting });

const INKS = [
  { key: "blue", label: "Blue pen", color: "#1e3a8a" },
  { key: "black", label: "Black pen", color: "#1c1917" },
  { key: "navy", label: "Royal blue", color: "#1d4ed8" },
  { key: "green", label: "Green pen", color: "#14532d" },
];

const FONTS = [
  { key: "cursive", label: "Cursive", css: "cursive" },
  { key: "comic", label: "Comic", css: "'Comic Sans MS', cursive" },
  { key: "serif", label: "Serif", css: "Georgia, serif" },
  { key: "neat", label: "Print", css: "system-ui, sans-serif" },
];

function TextToHandwriting() {
  const [text, setText] = useState("");
  const [ink, setInk] = useState(INKS[0]!);
  const [font, setFont] = useState(FONTS[0]!);
  const [size, setSize] = useState(26);
  const [rules, setRules] = useState(true);
  const [margin, setMargin] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** Renders the text onto ruled A4-ish pages; returns the total page count. */
  const renderPages = (): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;

    const W = 1000;
    const H = 1380; // ~A4 ratio
    const padL = margin ? 90 : 50;
    const padR = 60;
    const padT = 90;
    const lineH = Math.round(size * 1.85);
    const maxW = W - padL - padR;

    ctx.fillStyle = "#fdfcf7";
    ctx.fillRect(0, 0, W, H);

    if (rules) {
      ctx.strokeStyle = "#c7d7e8";
      ctx.lineWidth = 1;
      for (let y = padT + lineH - 8; y < H - 60; y += lineH) {
        ctx.beginPath();
        ctx.moveTo(padL - 20, y);
        ctx.lineTo(W - padR, y);
        ctx.stroke();
      }
      // red margin line, like a real notebook
      if (margin) {
        ctx.strokeStyle = "#e6a5a5";
        ctx.beginPath();
        ctx.moveTo(padL - 34, 40);
        ctx.lineTo(padL - 34, H - 40);
        ctx.stroke();
      }
    }

    ctx.fillStyle = ink.color;
    ctx.font = `${size}px ${font.css}`;
    ctx.textBaseline = "alphabetic";

    // word-wrap into lines that fit the page width
    const words = text.replace(/\r/g, "").split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width > maxW && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);

    const linesPerPage = Math.floor((H - padT - 70) / lineH);
    const visible = lines.slice(0, linesPerPage);
    visible.forEach((line, i) => {
      ctx.fillText(line, padL, padT + lineH * (i + 1) - 8);
    });

    return Math.max(1, Math.ceil(lines.length / linesPerPage));
  };

  const pages = renderPages();

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "handwritten-notes.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <AppShell title="Text to Handwriting">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">✍️ Text to Handwriting</h1>
        <p className="mt-1 text-sm text-muted-foreground">Type your notes, get a realistic handwritten-on-ruled-paper image. Students' favourite.</p>
      </header>

      <div className="mx-auto max-w-4xl space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder="Paste or type your assignment text here…"
          className="w-full rounded-xl border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3">
          <div className="flex gap-1">
            {INKS.map((i) => (
              <button
                key={i.key}
                onClick={() => setInk(i)}
                aria-label={i.label}
                className={`size-8 rounded-full border-2 ${ink.key === i.key ? "border-primary" : "border-transparent"}`}
                style={{ backgroundColor: i.color }}
              />
            ))}
          </div>
          <select value={font.key} onChange={(e) => setFont(FONTS.find((f) => f.key === e.target.value) ?? FONTS[0]!)} className="h-9 rounded-lg border border-border bg-background px-2 text-xs text-foreground">
            {FONTS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
          </select>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Size
            <input type="range" min={18} max={40} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-24 accent-primary" />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input type="checkbox" checked={rules} onChange={(e) => setRules(e.target.checked)} className="accent-primary" /> Ruled lines
          </label>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input type="checkbox" checked={margin} onChange={(e) => setMargin(e.target.checked)} className="accent-primary" /> Margin line
          </label>
          <span className="ml-auto text-xs text-muted-foreground">Page 1 of {pages}</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <canvas ref={canvasRef} width={1000} height={1380} className="mx-auto block h-auto w-full max-w-[560px]" />
        </div>

        <button onClick={download} disabled={!text.trim()} className="h-12 w-full rounded-xl bg-primary font-semibold text-background disabled:opacity-40">
          Download PNG
        </button>

        <FaqSection />
      </div>
    </AppShell>
  );
}
