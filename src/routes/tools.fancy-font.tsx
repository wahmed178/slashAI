import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/fancy-font")({ component: FancyFont });

/**
 * Real Unicode code-point maps — not webfonts — so the styles survive
 * copy-paste into Instagram, WhatsApp and bios.
 */
const A = 65;
const a = 97;
const d0 = 48;

// build a lookup from ASCII char -> styled char for a contiguous mapped range
function mapFrom(offsetUpper: number, offsetLower: number, offsetDigit = -1): Record<string, string> {
  const m: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    m[String.fromCharCode(A + i)] = String.fromCodePoint(offsetUpper + i);
    m[String.fromCharCode(a + i)] = String.fromCodePoint(offsetLower + i);
  }
  if (offsetDigit >= 0) {
    for (let i = 0; i < 10; i++) m[String.fromCharCode(d0 + i)] = String.fromCodePoint(offsetDigit + i);
  }
  return m;
}

function offsetAll(offset: number): Record<string, string> {
  const m: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    m[String.fromCharCode(A + i)] = String.fromCharCode(A + i + offset);
    m[String.fromCharCode(a + i)] = String.fromCharCode(a + i + offset);
  }
  return m;
}

const STYLES: { name: string; map: Record<string, string> }[] = [
  { name: "Bold", map: mapFrom(0x1d400, 0x1d41a, 0x1d7ce) },
  { name: "Italic", map: mapFrom(0x1d434, 0x1d44e) },
  { name: "Bold Italic", map: mapFrom(0x1d468, 0x1d482) },
  { name: "Script", map: mapFrom(0x1d49c, 0x1d4b6) },
  { name: "Bold Script", map: mapFrom(0x1d4d0, 0x1d4ea) },
  { name: "Fraktur", map: mapFrom(0x1d504, 0x1d51e) },
  { name: "Bold Fraktur", map: mapFrom(0x1d56c, 0x1d586) },
  { name: "Double-struck", map: mapFrom(0x1d538, 0x1d552, 0x1d7d8) },
  { name: "Sans", map: mapFrom(0x1d5a0, 0x1d5ba, 0x1d7e2) },
  { name: "Sans Bold", map: mapFrom(0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { name: "Sans Italic", map: mapFrom(0x1d608, 0x1d622) },
  { name: "Monospace", map: mapFrom(0x1d670, 0x1d68a, 0x1d7f6) },
  { name: "Circled", map: mapFrom(0x24b6, 0x24d0, 0x2775) },
  { name: "Squared", map: mapFrom(0x1f130, 0x1f130) },
  { name: "Fullwidth", map: mapFrom(0xff21, 0xff41, 0xff10) },
];

// small runtime patch-ups for the few Unicode holes (missing code points)
const HOLES: Record<string, Record<string, string>> = {
  Script: { E: "\u212e", H: "\u210b", I: "\u2110", R: "\u211b", B: "\u212c", F: "\u2131", L: "\u2112", M: "\u2133", e: "\u212f", g: "\u210a", o: "\u2134" },
  Fraktur: { C: "\u212d", H: "\u210c", I: "\u2111", R: "\u211c", Z: "\u2128" },
  "Double-struck": { C: "\u2102", H: "\u210d", N: "\u2115", P: "\u2119", Q: "\u211a", R: "\u211d", Z: "\u2124" },
  Circled: { "0": "\u24ea", "1": "\u2460", "2": "\u2461", "3": "\u2462", "4": "\u2463", "5": "\u2464", "6": "\u2465", "7": "\u2466", "8": "\u2467", "9": "\u2468" },
};
for (const [style, patch] of Object.entries(HOLES)) {
  const s = STYLES.find((x) => x.name === style);
  if (s) Object.assign(s.map, patch);
}

export function toStyle(text: string, map: Record<string, string>): string {
  return Array.from(text)
    .map((ch) => map[ch] ?? ch)
    .join("");
}

function FancyFont() {
  const [text, setText] = useState("Your name here");
  const [copied, setCopied] = useState<string | null>(null);

  const results = useMemo(
    () => STYLES.map((s) => ({ name: s.name, out: toStyle(text, s.map) })),
    [text],
  );

  const copy = async (value: string, name: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard blocked — the text is selectable anyway */
    }
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <AppShell title="Fancy Font Generator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">✨ Fancy Font Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real Unicode styles that paste anywhere — Instagram bio, WhatsApp status, YouTube names.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type anything…"
          className="h-14 w-full rounded-xl border border-border bg-surface px-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <div className="space-y-2">
          {results.map((r) => (
            <button
              key={r.name}
              onClick={() => void copy(r.out, r.name)}
              className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 text-left transition-colors hover:border-primary/50"
            >
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.name}</div>
                <div className="truncate text-lg text-foreground" style={{ fontFamily: r.name === "Monospace" ? "monospace" : undefined }}>
                  {r.out || "—"}
                </div>
              </div>
              <span className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${copied === r.name ? "bg-emerald-500/15 text-emerald-400" : "bg-primary/10 text-primary"}`}>
                {copied === r.name ? "Copied ✓" : "Copy"}
              </span>
            </button>
          ))}
        </div>

        <FaqSection />
      </div>
    </AppShell>
  );
}
