import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";
import { playTone } from "@/lib/play-sound";
import { bumpToolClick } from "@/lib/ux";
import {
  BOW_STYLES,
  FLOWERS,
  MAX_STEMS,
  PAPER_COLORS,
  RIBBON_COLORS,
  TIE,
  WRAP_STYLES,
  addStem,
  byDepth,
  decodeBouquet,
  defaultBouquet,
  flowerById,
  greenery,
  layout,
  removeStem,
  shareUrl,
  shade,
  stemSummary,
  type Bouquet,
  type Flower,
  type PlacedStem,
} from "@/lib/bouquet";

export const Route = createFileRoute("/tools/bouquet")({
  head: () => ({
    meta: [
      { title: "Digital Bouquet Sender - Send Flowers Online | SlashAI" },
      {
        name: "description",
        content:
          "Build a digital flower bouquet in your browser, write a message and send it as a link. Pick every flower and colour yourself - roses, peonies, tulips, sunflowers and more. Free, no account, nothing uploaded.",
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
  "Thank you for everything.",
  "Same time tomorrow? 🌷",
];

/** how far back in the bunch a stem sits, used to dull the ones behind */
const FADE = 0.3;

/* ── one bloom ──────────────────────────────────────────────────────────── */

/** a ring of petals around the head centre */
function petalRing(n: number, len: number, wide: number, fill: string, opacity = 1) {
  return Array.from({ length: n }).map((_, i) => {
    const a = (i / n) * 360;
    return (
      <ellipse
        key={a}
        cx="0"
        cy={-len * 0.52}
        rx={wide}
        ry={len}
        fill={fill}
        opacity={opacity}
        transform={`rotate(${a})`}
      />
    );
  });
}

function Bloom({
  flower,
  petal,
  core,
  scale = 1,
  delay = 0,
}: {
  flower: Flower;
  petal: string;
  core: string;
  scale?: number;
  delay?: number;
}) {
  const body = (() => {
    switch (flower.form) {
      case "rosette":
        return (
          <>
            {petalRing(flower.petals, 26, 13, shade(petal, -0.08))}
            {petalRing(flower.petals, 18, 10, petal)}
            {petalRing(Math.max(4, flower.petals - 3), 10, 7, shade(petal, 0.12))}
            <circle r="5" fill={core} />
          </>
        );
      case "cup":
        return (
          <>
            <path d="M-15 6 C -17 -12, -10 -22, 0 -22 C 10 -22, 17 -12, 15 6 Z" fill={petal} />
            <path
              d="M0 6 C -9 4, -14 -6, -12 -17 C -5 -14, 0 -8, 0 4 Z"
              fill={shade(petal, -0.1)}
            />
            <path d="M0 6 C 9 4, 14 -6, 12 -17 C 5 -14, 0 -8, 0 4 Z" fill={shade(petal, 0.1)} />
            <ellipse cx="0" cy="-17" rx="7" ry="5" fill={core} />
          </>
        );
      case "rays": {
        const long = flower.form === "rays" && flower.petals >= 14;
        return (
          <>
            {petalRing(flower.petals, long ? 26 : 22, long ? 6 : 8, petal)}
            {petalRing(flower.petals, long ? 15 : 13, 5, shade(petal, 0.1))}
            <circle r={long ? 11 : 7} fill={core} />
            <circle r={long ? 7 : 4} fill={shade(core, -0.18)} />
          </>
        );
      }
      case "spike":
        return (
          <>
            {petalRing(flower.petals, 22, 5.5, petal, 0.95)}
            <rect x="-2.5" y="-24" width="5" height="26" rx="2.5" fill={shade(petal, -0.14)} />
          </>
        );
      case "star":
        return (
          <>
            {petalRing(flower.petals, 27, 9, petal)}
            {petalRing(flower.petals, 16, 6, shade(petal, 0.14), 0.9)}
            <circle r="4.5" fill={core} />
          </>
        );
      case "wide":
        return (
          <>
            {petalRing(flower.petals, 27, 15, petal)}
            <circle r="4" fill={core} />
            <rect x="-1.5" y="-34" width="3" height="12" rx="1.5" fill={shade(core, -0.1)} />
            <circle cx="0" cy="-35" r="2.5" fill={core} />
          </>
        );
    }
  })();

  return (
    <g transform={`scale(${scale})`}>
      {/* stem + leaves, drawn unrotated so it always hangs downward */}
      <path
        d="M0 0 C 5 34, -5 66, 0 96"
        stroke={flower.leaf}
        strokeWidth="3.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M1 52 C -13 45, -22 54, -20 66 C -9 69, -1 62, 1 55 Z"
        fill={flower.leaf}
        opacity="0.9"
      />
      <path
        d="M0 70 C 14 63, 23 72, 21 84 C 10 87, 2 80, 0 73 Z"
        fill={flower.leaf}
        opacity="0.9"
      />
      {/* the head itself fades in — opacity only, so the export always matches */}
      <g style={{ animation: `bq-in 620ms ease-out ${delay}ms both` }}>{body}</g>
    </g>
  );
}

/** a filler sprig — two leaves and a few buds */
function Sprig({
  x,
  y,
  rotation,
  scale,
  depth,
}: {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  depth: number;
}) {
  const leaf = shade("#15803d", -0.1 - FADE * (1 - depth));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
      <path
        d="M0 0 C 4 30, -4 58, 0 84"
        stroke={leaf}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="-11" cy="40" rx="12" ry="7" fill={leaf} transform="rotate(-22 -11 40)" />
      <ellipse cx="11" cy="56" rx="12" ry="7" fill={leaf} transform="rotate(22 11 56)" />
      <ellipse
        cx="-8"
        cy="70"
        rx="9"
        ry="5"
        fill={shade(leaf, 0.1)}
        transform="rotate(-18 -8 70)"
      />
    </g>
  );
}

/** the little white filler flowers */
function Breath({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#f8fafc" opacity="0.92">
      <circle cx="0" cy="0" r="3.4" />
      <circle cx="-6" cy="-5" r="2.6" />
      <circle cx="6" cy="-4" r="2.4" />
      <circle cx="-2" cy="-10" r="2.2" />
      <circle cx="5" cy="-11" r="2" />
    </g>
  );
}

/* ── the wrap ───────────────────────────────────────────────────────────── */

function Wrap({ bouquet }: { bouquet: Bouquet }) {
  const paper = PAPER_COLORS.find((p) => p.id === bouquet.paper) ?? PAPER_COLORS[0]!;
  const ribbon = RIBBON_COLORS.find((r) => r.id === bouquet.ribbon) ?? RIBBON_COLORS[0]!;
  const outer = bouquet.mono ? "#e5e7eb" : paper.wrap;
  const inner = bouquet.mono ? "#f9fafb" : paper.bg;
  const tie = bouquet.mono ? "#111827" : ribbon.value;
  const gradId = "bq-paper";

  // cone = wide flared top, tall = narrow, round = softly curved
  const shape =
    bouquet.wrap === "tall"
      ? "M92 210 L228 210 L208 330 L112 330 Z"
      : bouquet.wrap === "round"
        ? "M74 212 L246 212 L206 330 L114 330 Z"
        : "M82 210 L238 210 L200 330 L120 330 Z";

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={inner} />
          <stop offset="100%" stopColor={outer} />
        </linearGradient>
      </defs>
      <path d={shape} fill={`url(#${gradId})`} />
      {/* folded-over top edge, so it reads as paper and not a solid block */}
      <path d={shape.replace(/210/, "232")} fill={outer} opacity="0.55" />
      <path
        d="M74 226 Q160 246 246 226"
        fill="none"
        stroke={bouquet.mono ? "#9ca3af" : "#ffffff"}
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path
        d="M160 232 L200 330"
        stroke={bouquet.mono ? "#9ca3af" : shade(paper.wrap, -0.12)}
        strokeWidth="1.2"
        opacity="0.5"
        fill="none"
      />

      {bouquet.bow === "classic" && (
        <g>
          <path d="M160 246 C 138 232, 120 240, 126 252 C 132 262, 148 256, 160 246 Z" fill={tie} />
          <path
            d="M160 246 C 182 232, 200 240, 194 252 C 188 262, 172 256, 160 246 Z"
            fill={shade(tie, -0.12)}
          />
          <rect x="150" y="240" width="20" height="13" rx="4" fill={shade(tie, 0.12)} />
          <path d="M154 252 L146 274 L158 268 L164 276 Z" fill={shade(tie, -0.06)} />
          <path d="M166 252 L174 274 L162 268 L156 276 Z" fill={tie} />
        </g>
      )}
      {bouquet.bow === "knot" && (
        <g>
          <rect x="142" y="240" width="36" height="14" rx="5" fill={tie} />
          <circle cx="160" cy="247" r="7" fill={shade(tie, 0.14)} />
        </g>
      )}
      {bouquet.bow === "twine" && (
        <g
          stroke={bouquet.mono ? "#111827" : "#a16207"}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M124 244 Q160 256 196 244" />
          <path d="M124 252 Q160 264 196 252" />
        </g>
      )}
    </g>
  );
}

/* ── the bouquet ────────────────────────────────────────────────────────── */

function BouquetArt({ bouquet, idSuffix }: { bouquet: Bouquet; idSuffix: string }) {
  const stems = useMemo(() => byDepth(layout(bouquet)), [bouquet]);
  const leaves = useMemo(
    () => greenery(bouquet, Math.min(14, Math.ceil(stems.length * 0.8))),
    [bouquet, stems.length],
  );
  const paper = PAPER_COLORS.find((p) => p.id === bouquet.paper) ?? PAPER_COLORS[0]!;
  const ordered = useMemo(() => [...leaves].sort((a, b) => a.depth - b.depth), [leaves]);

  return (
    <svg
      viewBox="0 0 320 340"
      role="img"
      aria-label="Your digital bouquet"
      className="h-auto w-full max-w-[22rem]"
    >
      <defs>
        <radialGradient id={`bg-${idSuffix}`} cx="50%" cy="38%" r="72%">
          <stop offset="0%" stopColor={bouquet.mono ? "#fafafa" : paper.bg} stopOpacity="0.55" />
          <stop offset="100%" stopColor={bouquet.mono ? "#ffffff" : paper.bg} stopOpacity="0" />
        </radialGradient>
        {/* The keyframes live inside the SVG, so the exported file carries the
            same rule. `.bq-static` is stamped on the clone we serialise, which
            forces every bloom to full opacity — an export can never catch a
            stem mid-fade and save a blank bouquet. */}
        <style>{`@keyframes bq-in{from{opacity:0}to{opacity:1}}.bq-static [style]{animation:none!important;opacity:1!important}`}</style>
      </defs>
      <ellipse cx="160" cy="150" rx="150" ry="140" fill={`url(#bg-${idSuffix})`} />

      {/* back of the bunch first, front last */}
      {ordered.map((g, i) => (
        <Sprig key={`leaf-${i}`} {...g} />
      ))}

      {bouquet.breath &&
        ordered.map((g, i) => (
          <Breath
            key={`breath-${i}`}
            x={g.x + 6}
            y={g.y + 14}
            scale={0.7 + (1 - Math.abs(g.x - TIE.x) / 120) * 0.5}
          />
        ))}

      {stems.map((s: PlacedStem, i) => {
        // blooms further back are dimmer, which is what sells the depth
        const petal = bouquet.mono ? "#f9fafb" : shade(s.tone.petal, -FADE * (1 - s.depth));
        const core = bouquet.mono ? "#111827" : s.tone.core;
        return (
          <g
            key={`${s.flower.id}-${i}`}
            transform={`translate(${s.x} ${s.y}) rotate(${s.rotation})`}
          >
            <Bloom
              flower={bouquet.mono ? { ...s.flower, leaf: "#374151" } : s.flower}
              petal={petal}
              core={core}
              scale={s.scale}
              delay={s.delay}
            />
          </g>
        );
      })}

      <Wrap bouquet={bouquet} />
    </svg>
  );
}

/* ── page ───────────────────────────────────────────────────────────────── */

function DigitalBouquet() {
  const [bouquet, setBouquet] = useState<Bouquet>(defaultBouquet);
  const [received, setReceived] = useState<Bouquet | null>(null);
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  /** which flower the tone swatches are editing */
  const [editing, setEditing] = useState<string>(FLOWERS[0]!.id);
  const [picking, setPicking] = useState(false);
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, "");
    if (raw) {
      const parsed = decodeBouquet(raw);
      if (parsed) {
        setBouquet(parsed);
        setReceived(parsed);
        setEditing(parsed.stems[0]?.flower ?? FLOWERS[0]!.id);
        bumpToolClick("bouquet");
      }
    }
    setHydrated(true);
  }, []);

  const share = shareUrl(bouquet);
  const total = bouquet.stems.length;
  const full = total >= MAX_STEMS;
  const editingFlower = flowerById(editing) ?? FLOWERS[0]!;
  const tap = () => playTone("tap");

  const add = (id: string, tone = 0) => {
    tap();
    setBouquet((b) => addStem(b, id, tone));
  };

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

  /** serialise a clone that ignores the intro animation, so the saved art is
   *  always the finished bouquet rather than a half-faded one */
  const serialise = (): string | null => {
    const svg = artRef.current?.querySelector("svg");
    if (!svg) return null;
    const clone = svg.cloneNode(true) as SVGElement;
    clone.setAttribute("class", "bq-static");
    return new XMLSerializer().serializeToString(clone);
  };

  /**
   * Rasterise the very same SVG the preview shows, so the PNG can never drift
   * from what is on screen.
   */
  const downloadPng = () => {
    const xml = serialise();
    if (!xml) return;
    const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
    const img = new Image();
    img.onload = () => {
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width = 320 * scale;
      canvas.height = 340 * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "digital-bouquet.png";
        a.click();
        URL.revokeObjectURL(a.href);
      }, "image/png");
      playTone("success");
    };
    img.onerror = () => playTone("fail");
    img.src = src;
  };

  const downloadSvg = () => {
    const xml = serialise();
    if (!xml) return;
    const blob = new Blob([xml], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "digital-bouquet.svg";
    a.click();
    URL.revokeObjectURL(a.href);
    playTone("copy");
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`A bouquet for you 🌷\n${share}`)}`;

  return (
    <AppShell title="Digital Bouquet Sender">
      <div className="mx-auto max-w-5xl gap-8 pt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ── preview ── */}
        <div>
          <div
            ref={artRef}
            className={`relative overflow-hidden rounded-2xl border border-border p-4 ${
              bouquet.mono ? "bg-white dark:bg-zinc-950" : ""
            }`}
          >
            <div className="relative flex flex-col items-center">
              <BouquetArt bouquet={bouquet} idSuffix="main" />
              <p className="mt-3 text-center text-sm text-muted-foreground">
                {hydrated && received
                  ? `A bouquet for ${received.to || "you"}`
                  : total === 0
                    ? "Pick a flower to start your bouquet"
                    : stemSummary(bouquet) || "Your bouquet"}
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
                Download PNG
              </button>
              <button
                onClick={downloadSvg}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
              >
                SVG
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
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.06em] text-muted-foreground">
                Flowers
              </h2>
              <span className="text-xs text-muted-foreground">
                {total}/{MAX_STEMS}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {FLOWERS.map((fl) => (
                <button
                  key={fl.id}
                  disabled={full}
                  onClick={() => {
                    setPicking(true);
                    setEditing(fl.id);
                    add(fl.id, 0);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-border px-2 py-2 text-left text-xs text-foreground transition-colors hover:border-primary/50 disabled:opacity-40"
                >
                  <span className="text-lg" aria-hidden>
                    {fl.emoji}
                  </span>
                  <span className="truncate">{fl.name}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Tap to add. Then pick the colour for {editingFlower.name.toLowerCase()}s.
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {editingFlower.tones.map((tone, i) => (
                <button
                  key={tone.name}
                  onClick={() => {
                    tap();
                    setBouquet((b) => ({
                      ...b,
                      stems: b.stems.map((s) =>
                        s.flower === editingFlower.id ? { ...s, tone: i } : s,
                      ),
                    }));
                  }}
                  title={tone.name}
                  className="rounded-full border-2 border-border px-2.5 py-1 text-[11px] text-foreground transition-colors hover:border-primary/60"
                  style={{ background: tone.petal }}
                >
                  {tone.name}
                </button>
              ))}
            </div>

            {picking && total > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {bouquet.stems.map((s, i) => {
                  const fl = flowerById(s.flower);
                  const tone = fl?.tones[Math.min(s.tone, fl.tones.length - 1)];
                  return (
                    <button
                      key={`${s.flower}-${i}`}
                      onClick={() => {
                        tap();
                        setEditing(s.flower);
                        setBouquet((b) => removeStem(b, i));
                      }}
                      title={`Remove one ${fl?.name ?? "stem"}`}
                      className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs transition-colors hover:border-destructive/60"
                      style={{ background: tone?.petal }}
                    >
                      {fl?.emoji ?? "🌷"} ×
                    </button>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => {
                tap();
                setBouquet(defaultBouquet());
                setReceived(null);
                setPicking(false);
                window.history.replaceState(null, "", window.location.pathname);
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

            <h3 className="mt-4 text-xs font-semibold text-muted-foreground">Wrap style</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {WRAP_STYLES.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    tap();
                    setBouquet((b) => ({ ...b, wrap: w.id }));
                  }}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    bouquet.wrap === w.id
                      ? "border-primary text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {w.name}
                </button>
              ))}
            </div>

            <h3 className="mt-4 text-xs font-semibold text-muted-foreground">Tie</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {BOW_STYLES.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    tap();
                    setBouquet((b) => ({ ...b, bow: w.id }));
                  }}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    bouquet.bow === w.id
                      ? "border-primary text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {w.name}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={bouquet.greenery}
                  onChange={(e) => {
                    tap();
                    setBouquet((b) => ({ ...b, greenery: e.target.checked }));
                  }}
                  className="size-4 accent-[var(--primary)]"
                />
                Greenery sprigs
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={bouquet.breath}
                  onChange={(e) => {
                    tap();
                    setBouquet((b) => ({ ...b, breath: e.target.checked }));
                  }}
                  className="size-4 accent-[var(--primary)]"
                />
                Baby&apos;s breath filler
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
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
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
