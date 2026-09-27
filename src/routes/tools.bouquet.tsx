import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";
import { playTone } from "@/lib/play-sound";
import { bumpToolClick } from "@/lib/ux";
import {
  FLOWERS,
  PAPER_COLORS,
  RIBBON_COLORS,
  MAX_BLOOMS,
  addBloom,
  bloomSummary,
  decodeBouquet,
  defaultBouquet,
  layout,
  removeBloom,
  shareUrl,
  type Bouquet,
  type PlacedBloom,
} from "@/lib/bouquet";

export const Route = createFileRoute("/tools/bouquet")({
  head: () => ({
    meta: [
      { title: "Digital Bouquet Sender - Send Flowers Online | SlashAI" },
      {
        name: "description",
        content:
          "Build a digital flower bouquet in your browser, write a message and send it as a link. Roses, peonies, sunflowers and more - free, no account, nothing uploaded.",
      },
    ],
  }),
  component: DigitalBouquet,
});

const NOTE_HINTS = [
  "Thinking of you today 💛",
  "Proud of you. Always.",
  "Happy birthday! 🎂",
  "Sorry I was late. Thank you.",
  "You make ordinary days better.",
  "Congratulations! 🎉",
];

/* ── the bouquet itself ──────────────────────────────────────────────────── */

function Stem({ placed, mono, delay }: { placed: PlacedBloom; mono: boolean; delay: number }) {
  const { flower, x, y, rotation, scale } = placed;
  const stem = mono ? "#1f2937" : flower.leaf;
  const petal = mono ? "#f9fafb" : flower.petal;
  const core = mono ? "#111827" : flower.core;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}
      style={{
        animation: `bouquet-bloom 700ms cubic-bezier(0.34, 1.4, 0.5, 1) ${delay}ms both`,
      }}
    >
      <path
        d="M0 0 C 4 40, -4 80, 0 120"
        stroke={stem}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M0 74 C -16 66, -26 76, -24 90 C -12 94, -2 86, 0 78 Z" fill={stem} opacity="0.85" />
      <path d="M0 96 C 16 88, 26 98, 24 112 C 12 116, 2 108, 0 100 Z" fill={stem} opacity="0.85" />
      {Array.from({ length: 6 }).map((_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-16"
          rx="13"
          ry="21"
          fill={petal}
          opacity={mono ? 1 : 0.94}
          transform={`rotate(${i * 60}) translate(0 -2)`}
          stroke={mono ? "#111827" : "none"}
          strokeWidth={mono ? 1.5 : 0}
        />
      ))}
      <circle
        cx="0"
        cy="-16"
        r="7.5"
        fill={core}
        stroke={mono ? "#111827" : "none"}
        strokeWidth={mono ? 1.5 : 0}
      />
    </g>
  );
}

function BouquetArt({ bouquet, className = "" }: { bouquet: Bouquet; className?: string }) {
  const placed = useMemo(() => layout(bouquet), [bouquet]);
  const paper = PAPER_COLORS.find((p) => p.id === bouquet.paper) ?? PAPER_COLORS[0]!;
  const ribbon = RIBBON_COLORS.find((r) => r.id === bouquet.ribbon) ?? RIBBON_COLORS[0]!;
  const wrap = bouquet.mono ? "#f3f4f6" : paper.wrap;
  const tie = bouquet.mono ? "#111827" : ribbon.value;
  return (
    <svg viewBox="0 0 300 320" role="img" aria-label="Your digital bouquet" className={className}>
      <defs>
        <linearGradient id="bouquet-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={wrap} />
          <stop offset="100%" stopColor={bouquet.mono ? "#e5e7eb" : paper.bg} />
        </linearGradient>
      </defs>
      {placed.map((p, i) => (
        <Stem key={`${p.flower.id}-${i}`} placed={p} mono={bouquet.mono} delay={i * 70} />
      ))}
      <path d="M78 214 L 222 214 L 196 316 L 104 316 Z" fill="url(#bouquet-paper)" />
      <path d="M78 214 L 222 214 L 214 236 L 86 236 Z" fill={wrap} opacity="0.85" />
      <path
        d="M78 214 L 222 214 L 216 230 L 84 230 Z"
        fill="none"
        stroke={bouquet.mono ? "#111827" : "#ffffff"}
        strokeWidth="1.5"
        opacity="0.6"
      />
      <rect x="132" y="232" width="36" height="14" rx="4" fill={tie} />
      <path d="M150 246 L 138 268 L 150 262 L 162 268 Z" fill={tie} />
    </svg>
  );
}

/* ── page ────────────────────────────────────────────────────────────────── */

function DigitalBouquet() {
  const [bouquet, setBouquet] = useState<Bouquet>(defaultBouquet);
  /** set when the page is opened from a shared link */
  const [received, setReceived] = useState<Bouquet | null>(null);
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // read the share code from the fragment, once, on mount
  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, "");
    if (raw) {
      const parsed = decodeBouquet(raw);
      if (parsed) {
        setBouquet(parsed);
        setReceived(parsed);
        bumpToolClick("bouquet");
      }
    }
    setHydrated(true);
  }, []);

  const share = shareUrl(bouquet);
  const total = bouquet.blooms.length;
  const full = total >= MAX_BLOOMS;

  const tap = () => playTone("tap");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(share);
    } catch {
      /* clipboard blocked — the link is on screen to copy by hand */
    }
    playTone("copy");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadPng = () => {
    const svg = cardRef.current?.querySelector("svg");
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "digital-bouquet.svg";
    a.click();
    playTone("success");
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`A bouquet for you 🌷\n${share}`)}`;

  return (
    <AppShell title="Digital Bouquet Sender">
      <style>{`@keyframes bouquet-bloom{0%{opacity:0;transform:translateY(26px) scale(.4)}100%{opacity:1;transform:none}}`}</style>

      <div className="mx-auto max-w-5xl gap-8 pt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ── bouquet preview ── */}
        <div>
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-rose-50 via-rose-50/40 to-transparent p-6 dark:from-rose-950/30 dark:via-transparent"
          >
            {bouquet.mono && (
              <div
                className="absolute inset-0 bg-white/70 backdrop-grayscale dark:bg-zinc-950/70"
                aria-hidden
              />
            )}
            <div className="relative flex flex-col items-center">
              <BouquetArt bouquet={bouquet} className="h-72 w-auto drop-shadow-sm sm:h-96" />
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {hydrated && received
                  ? `A bouquet for ${received.to || "you"}`
                  : total === 0
                    ? "Add a flower to start your bouquet"
                    : bloomSummary(bouquet) || "Your bouquet"}
              </p>
              {(bouquet.to || bouquet.message || bouquet.from) && (
                <div className="mt-4 max-w-sm rounded-xl border border-border bg-surface/90 px-4 py-3 text-center">
                  {bouquet.to && (
                    <p className="text-sm font-semibold text-foreground">For {bouquet.to}</p>
                  )}
                  {bouquet.message && (
                    <p className="mt-1 text-sm text-muted-foreground">{bouquet.message}</p>
                  )}
                  {bouquet.from && (
                    <p className="mt-1 text-xs text-muted-foreground">— {bouquet.from}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── message ── */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input
              value={bouquet.to}
              onChange={(e) => setBouquet((b) => ({ ...b, to: e.target.value }))}
              placeholder="To (their name)"
              aria-label="Recipient name"
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
            />
            <input
              value={bouquet.from}
              onChange={(e) => setBouquet((b) => ({ ...b, from: e.target.value }))}
              placeholder="From (your name)"
              aria-label="Sender name"
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
            />
            <textarea
              value={bouquet.message}
              onChange={(e) => setBouquet((b) => ({ ...b, message: e.target.value }))}
              placeholder="Your message…"
              aria-label="Message"
              rows={2}
              className="resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none sm:col-span-2"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {NOTE_HINTS.map((hint) => (
              <button
                key={hint}
                onClick={() => {
                  tap();
                  setBouquet((b) => ({ ...b, message: hint }));
                }}
                className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {hint}
              </button>
            ))}
          </div>

          {/* ── send ── */}
          <div className="mt-5 rounded-2xl border border-border bg-surface p-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.06em] text-muted-foreground">
              Send it
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              The whole bouquet lives inside the link — no account, no upload, nothing stored on a
              server.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={copyLink}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {copied ? "Link copied ✓" : "Copy share link"}
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={tap}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
              >
                Share on WhatsApp
              </a>
              <button
                onClick={downloadPng}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
              >
                Download image
              </button>
            </div>
            <p className="mt-3 break-all rounded-lg bg-background px-3 py-2 font-mono text-[11px] text-muted-foreground">
              {share}
            </p>
          </div>

          <FaqSection />
        </div>

        {/* ── builder ── */}
        <aside className="mt-8 space-y-5 lg:mt-0">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.06em] text-muted-foreground">
              Flowers
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {FLOWERS.map((f) => (
                <button
                  key={f.id}
                  disabled={full}
                  onClick={() => {
                    tap();
                    setBouquet((b) => addBloom(b, f.id));
                  }}
                  className="flex items-center gap-2 rounded-lg border border-border px-2 py-2 text-left text-xs text-foreground transition-colors hover:border-primary/50 disabled:opacity-40"
                >
                  <span className="text-lg" aria-hidden>
                    {f.emoji}
                  </span>
                  <span className="truncate">{f.name}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {total}/{MAX_BLOOMS} stems
            </p>
            {total > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {bouquet.blooms.map((id, i) => (
                  <button
                    key={`${id}-${i}`}
                    onClick={() => {
                      tap();
                      setBouquet((b) => removeBloom(b, i));
                    }}
                    title="Remove this stem"
                    className="rounded-full border border-border px-2 py-0.5 text-sm transition-colors hover:border-destructive/60"
                  >
                    {FLOWERS.find((f) => f.id === id)?.emoji ?? "🌷"}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                tap();
                setBouquet(defaultBouquet());
              }}
              className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              Clear bouquet
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.06em] text-muted-foreground">
              Wrapping
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {PAPER_COLORS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    tap();
                    setBouquet((b) => ({ ...b, paper: p.id }));
                  }}
                  title={p.name}
                  aria-label={`${p.name} paper`}
                  className={`size-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    bouquet.paper === p.id ? "border-primary" : "border-transparent"
                  }`}
                  style={{ background: p.bg }}
                />
              ))}
            </div>
            <h3 className="mt-4 text-xs font-semibold text-muted-foreground">Ribbon</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {RIBBON_COLORS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    tap();
                    setBouquet((b) => ({ ...b, ribbon: r.id }));
                  }}
                  title={r.name}
                  aria-label={`${r.name} ribbon`}
                  className={`size-8 rounded-md border-2 transition-transform hover:scale-110 ${
                    bouquet.ribbon === r.id ? "border-primary" : "border-transparent"
                  }`}
                  style={{ background: r.value }}
                />
              ))}
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={bouquet.mono}
                onChange={(e) => {
                  tap();
                  setBouquet((b) => ({ ...b, mono: e.target.checked }));
                }}
                className="size-4 accent-[var(--primary)]"
              />
              Black and white wrapping
            </label>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
