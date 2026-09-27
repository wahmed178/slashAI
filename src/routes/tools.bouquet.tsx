import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { BouquetArt } from "@/components/library/BouquetArt";
import { FaqSection } from "@/components/library/FaqSection";
import { playTone } from "@/lib/play-sound";
import { useShortenLink } from "@/components/library/shorten-store";
import { bumpToolClick } from "@/lib/ux";
import {
  BOW_STYLES,
  FLOWERS,
  MAX_STEMS,
  PAPER_COLORS,
  RIBBON_COLORS,
  WRAP_STYLES,
  addStem,
  decodeBouquet,
  defaultBouquet,
  emptyBouquet,
  flowerById,
  removeStem,
  sharePageUrl,
  stemSummary,
  type Bouquet,
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

function DigitalBouquet() {
  const [bouquet, setBouquet] = useState<Bouquet>(defaultBouquet);
  const [received, setReceived] = useState<Bouquet | null>(null);
  const [copied, setCopied] = useState(false);
  /** which flower the colour swatches are editing */
  const [editing, setEditing] = useState<string>(FLOWERS[0]!.id);
  const artRef = useRef<HTMLDivElement>(null);
  const shorten = useShortenLink();

  // an old share link may still carry the bouquet in the fragment
  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, "");
    if (raw.startsWith("v1.") || raw.startsWith("v2.")) {
      const parsed = decodeBouquet(raw);
      if (parsed) {
        setBouquet(parsed);
        setReceived(parsed);
        setEditing(parsed.stems[0]?.flower ?? FLOWERS[0]!.id);
        bumpToolClick("bouquet");
      }
    }
  }, []);

  // the link now points at the bouquet-only page, not this editor
  const share = sharePageUrl(bouquet);
  const total = bouquet.stems.length;
  const full = total >= MAX_STEMS;
  const editingFlower = flowerById(editing) ?? FLOWERS[0]!;
  const tap = () => playTone("tap");

  const add = (id: string, tone = 0) => {
    tap();
    setBouquet((b) => addStem(b, id, tone));
  };

  /** start fresh: no flowers, no message, same wrapping choices */
  const startFresh = () => {
    tap();
    setBouquet(emptyBouquet());
    setReceived(null);
    setEditing(FLOWERS[0]!.id);
    window.history.replaceState(null, "", window.location.pathname);
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

  /** rasterise the very same SVG the preview shows, so the PNG can never drift
   *  from what is on screen */
  const downloadPng = () => {
    const xml = serialise();
    if (!xml) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 320 * 3;
      canvas.height = 340 * 3;
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
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
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
      <div className="mx-auto max-w-4xl space-y-6 pt-4">
        {/* ── builder, on top ── */}
        <div className="grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-border bg-surface p-4">
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
              Tap to add. Then choose the colour for {editingFlower.name.toLowerCase()}s.
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

            {total > 0 && (
              <>
                <p className="mt-4 text-xs font-semibold text-muted-foreground">
                  Tap a stem to remove it
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
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
              </>
            )}

            <button
              onClick={startFresh}
              className="mt-4 w-full rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              Clear — start a fresh bouquet
            </button>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-4">
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
              {(
                [
                  ["greenery", "Greenery sprigs"],
                  ["breath", "Baby's breath filler"],
                  ["mono", "Black and white wrapping"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"
                >
                  <input
                    type="checkbox"
                    checked={bouquet[key]}
                    onChange={(e) => {
                      tap();
                      setBouquet((b) => ({ ...b, [key]: e.target.checked }));
                    }}
                    className="size-4 accent-[var(--primary)]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* ── the bouquet, below ── */}
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div
            ref={artRef}
            className={`relative flex justify-center overflow-hidden rounded-xl p-4 ${
              bouquet.mono ? "bg-white dark:bg-zinc-950" : ""
            }`}
          >
            {total === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-4xl" aria-hidden>
                  🪴
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">No flowers yet</p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  Tap any flower above to start building your bouquet.
                </p>
              </div>
            ) : (
              <BouquetArt bouquet={bouquet} idSuffix="main" />
            )}
          </div>

          {total > 0 && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {received ? `A bouquet for ${received.to || "you"}` : stemSummary(bouquet)}
            </p>
          )}

          <div className="mx-auto mt-4 grid max-w-2xl gap-3 sm:grid-cols-2">
            <input
              value={bouquet.to}
              onChange={(e) => setBouquet((b) => ({ ...b, to: e.target.value }))}
              placeholder="To (their name)"
              aria-label="Recipient name"
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
            />
            <input
              value={bouquet.from}
              onChange={(e) => setBouquet((b) => ({ ...b, from: e.target.value }))}
              placeholder="From (your name)"
              aria-label="Sender name"
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
            />
            <textarea
              value={bouquet.message}
              onChange={(e) => setBouquet((b) => ({ ...b, message: e.target.value }))}
              placeholder="Your message…"
              aria-label="Message"
              rows={2}
              className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none sm:col-span-2"
            />
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
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
        </div>

        {/* ── send ── */}
        <section className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.06em] text-muted-foreground">
            Send it
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            The link opens a page with just this bouquet on it — the builder stays here. Nothing is
            uploaded or stored.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={copyLink}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {copied ? "Link copied ✓" : "Copy share link"}
            </button>
            <button
              onClick={() => shorten.open(share)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
            >
              Shorten link
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
              disabled={total === 0}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 disabled:opacity-40"
            >
              Download PNG
            </button>
            <button
              onClick={downloadSvg}
              disabled={total === 0}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 disabled:opacity-40"
            >
              SVG
            </button>
          </div>
          <p className="mt-3 break-all rounded-lg bg-background px-3 py-2 font-mono text-[11px] text-muted-foreground">
            {share}
          </p>
        </section>

        <FaqSection />
      </div>
    </AppShell>
  );
}
