import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";

import { playTone } from "@/lib/play-sound";
import { SEO_COUNTS } from "@/lib/seo-counts";
import { bumpToolClick, readStorage, toolClicks, writeStorage } from "@/lib/ux";

export const Route = createFileRoute("/tools/flip-clock")({
  head: () => ({
    meta: [
      { title: "Flip Clock - Free Split-Flap Clock | SlashAI" },
      {
        name: "description",
        content:
          "A split-flap flip clock with vertical or horizontal flip, a real 3D card animation, tick and flip sounds, click-to-change Picsum photo backgrounds and pause. Free, no install, works offline.",
      },
    ],
  }),
  component: FlipClock,
});

/* ── constants ──────────────────────────────────────────────── */

const STORE = "slashai.flipclock";
const FLIP_MS = 420;
const HALF_MS = FLIP_MS / 2;
const IDLE_MS = 3200;

/** Which way the card folds. "x" folds top-over-bottom, "y" folds left-over-right. */
type Axis = "x" | "y";

type Prefs = {
  h24: boolean;
  axis: Axis;
  sound: boolean;
  paused: boolean;
  bg: number;
};

const DEFAULTS: Prefs = { h24: false, axis: "x", sound: true, paused: false, bg: 0 };

function loadPrefs(): Prefs {
  const raw = readStorage(STORE);
  if (!raw) return DEFAULTS;
  try {
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return {
      h24: typeof parsed.h24 === "boolean" ? parsed.h24 : DEFAULTS.h24,
      axis: parsed.axis === "y" || parsed.axis === "x" ? parsed.axis : DEFAULTS.axis,
      sound: typeof parsed.sound === "boolean" ? parsed.sound : DEFAULTS.sound,
      paused: typeof parsed.paused === "boolean" ? parsed.paused : DEFAULTS.paused,
      bg: Number.isFinite(parsed.bg) ? Math.abs(Math.trunc(parsed.bg as number)) : DEFAULTS.bg,
    };
  } catch {
    return DEFAULTS;
  }
}

/* ── backgrounds ───────────────────────────────────────────────
 * Picsum serves Unsplash-licensed photos, needs no key and no
 * account: https://picsum.photos/seed/<seed>/<w>/<h>. Index 0 is a
 * pure-CSS gradient so the clock still looks right with no network
 * at all, which keeps SlashAI offline-first.
 */

type Background = { label: string; url: string | null; css: string };

const BACKGROUND_FALLBACK: Background = {
  label: "Slate",
  url: null,
  css: "radial-gradient(120% 90% at 50% 0%, #1c2733 0%, #0b0f14 55%, #05070a 100%)",
};

const BACKGROUNDS: Background[] = [
  BACKGROUND_FALLBACK,
  { label: "Ridge", url: "https://picsum.photos/seed/slashai-ridge/1920/1080", css: "#0b1220" },
  { label: "Dunes", url: "https://picsum.photos/seed/slashai-dunes/1920/1080", css: "#1a1208" },
  { label: "Harbour", url: "https://picsum.photos/seed/slashai-harbour/1920/1080", css: "#08161c" },
  { label: "Pines", url: "https://picsum.photos/seed/slashai-pines/1920/1080", css: "#0a1710" },
  { label: "Station", url: "https://picsum.photos/seed/slashai-station/1920/1080", css: "#151019" },
  { label: "Coast", url: "https://picsum.photos/seed/slashai-coast/1920/1080", css: "#0c1418" },
  { label: "Atrium", url: "https://picsum.photos/seed/slashai-atrium/1920/1080", css: "#141210" },
];

/* ── card styling ──────────────────────────────────────────────
 * The digit is sized from the card's own box with container-query
 * units, so it can never overflow the card no matter how wide the
 * viewport is. The previous version used `clamp(px, 22vw, 220px)`,
 * which pushed 220px glyphs through a 320px card with no
 * `overflow: hidden` to stop them.
 *
 * The card *box* is the thing that has to grow. The old width was
 * `clamp(56px, 15vw, 88px)` — capped at 88px on any monitor wider
 * than ~590px, so the clock sat in the middle of a desktop screen as
 * a thumbnail. The sizes are now derived from the viewport in CSS
 * (see the `.fc-*` rules at the bottom of this file): the stacked
 * layout is bound by the screen height (three rows have to fit) and
 * the inline layout by the screen width (six cards in one row).
 */

const CARD: CSSProperties = {
  background: "#101010",
  borderRadius: 10,
  boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset, 0 10px 26px rgba(0,0,0,0.45)",
  // `perspective` must sit on the direct parent of the folding
  // leaves, otherwise they get no 3D projection at all.
  perspective: 1100,
  transformStyle: "preserve-3d",
  overflow: "hidden",
  position: "relative",
  containerType: "size",
  width: "100%",
  height: "100%",
};

const GLYPH: CSSProperties = {
  fontFamily: "var(--font-sans)",
  // The size itself comes from `.fc-glyph` in the stylesheet at the
  // bottom: a container query (`cqh`) is the only unit that tracks the
  // card box, and it needs a plain viewport fallback for older engines.
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  fontVariantNumeric: "tabular-nums",
  color: "#e8e8e8",
  textShadow: "0 1px 1px rgba(0,0,0,0.45)",
  userSelect: "none",
};

const FILLER: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const SHADE_TOP = "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 100%)";
const SHADE_BOTTOM = "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)";

/** clipPath for one half, per axis. `a` is the first half (top / left). */
function clip(axis: Axis, half: "a" | "b"): string {
  return axis === "x"
    ? half === "a"
      ? "inset(0 0 50% 0)"
      : "inset(50% 0 0 0)"
    : half === "a"
      ? "inset(0 50% 0 0)"
      : "inset(0 0 0 50%)";
}

/** The resting half of a card: glyph centred in the full card, clipped. */
function Half({
  axis,
  half,
  value,
  shade,
}: {
  axis: Axis;
  half: "a" | "b";
  value: string;
  shade?: string;
}) {
  return (
    <div className="absolute inset-0" style={{ clipPath: clip(axis, half) }}>
      <div style={FILLER}>
        <span className="fc-glyph" style={GLYPH}>
          {value}
        </span>
      </div>
      {shade && <div className="absolute inset-0" style={{ background: shade }} />}
    </div>
  );
}

/* ── one flip card ──────────────────────────────────────────── */

function FlipDigit({ char, axis }: { char: string; axis: Axis }) {
  const [shown, setShown] = useState(char);
  const [from, setFrom] = useState(char);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (char === shown) return;
    // Respect the OS setting: land on the new digit without animating.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(char);
      setFrom(char);
      setFlipping(false);
      return;
    }
    setFrom(shown);
    setFlipping(true);
    const timer = setTimeout(() => {
      setShown(char);
      setFlipping(false);
    }, FLIP_MS);
    return () => clearTimeout(timer);
  }, [char, shown]);

  const vertical = axis === "x";

  return (
    <div style={CARD}>
      {/* resting card: both halves already show the new digit */}
      <Half axis={axis} half="a" value={char} shade={SHADE_TOP} />
      <Half axis={axis} half="b" value={char} shade={SHADE_BOTTOM} />

      {flipping && (
        <>
          {/* outgoing leaf — the digit we are leaving, darkening as it falls */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: clip(axis, "a"),
              transformOrigin: vertical ? "50% 100%" : "100% 50%",
              animation: `${vertical ? "fcOutX" : "fcOutY"} ${HALF_MS}ms cubic-bezier(0.36, 0, 0.66, -0.2) forwards`,
              zIndex: 2,
            }}
          >
            <div style={FILLER}>
              <span className="fc-glyph" style={GLYPH}>
                {from}
              </span>
            </div>
            <div
              className="absolute inset-0"
              style={{ background: "#000", animation: "fcShadeOut 210ms linear forwards" }}
            />
          </div>

          {/* incoming leaf — the new digit, unfolding into place.
              No `backface-visibility: hidden` here: the old version put it
              on this element while it was pre-rotated 180deg, which made the
              whole leaf invisible for the entire animation. */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: clip(axis, "b"),
              transformOrigin: vertical ? "50% 0%" : "0% 50%",
              animation: `${vertical ? "fcInX" : "fcInY"} ${HALF_MS}ms cubic-bezier(0.34, 1.3, 0.64, 1) ${HALF_MS}ms forwards`,
              zIndex: 2,
            }}
          >
            <div style={FILLER}>
              <span className="fc-glyph" style={GLYPH}>
                {char}
              </span>
            </div>
            <div
              className="absolute inset-0"
              style={{ background: "#000", animation: "fcShadeIn 210ms linear 210ms forwards" }}
            />
          </div>
        </>
      )}

      {/* hinge */}
      <div
        className="absolute"
        style={{
          background: "rgba(0,0,0,0.85)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.05)",
          ...(vertical
            ? { left: 0, right: 0, top: "50%", height: 2, marginTop: -1 }
            : { top: 0, bottom: 0, left: "50%", width: 2, marginLeft: -1 }),
        }}
      />
    </div>
  );
}

/* ── shared chrome ──────────────────────────────────────────── */

function Pill({
  active,
  children,
  onClick,
  title,
  icon,
}: {
  active?: boolean;
  children: ReactNode;
  onClick: () => void;
  title?: string;
  icon?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`flex h-9 shrink-0 items-center justify-center rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all duration-150 active:scale-[0.96] ${
        icon ? "w-9 px-0" : "px-3.5"
      }`}
      style={{
        color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
        background: active ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)",
        boxShadow: active ? "0 1px 0 rgba(255,255,255,0.14) inset" : "none",
      }}
    >
      {children}
    </button>
  );
}

/** Hairline divider between control groups inside the deck. */
function Divider() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-white/10" />;
}

/* ── main component ────────────────────────────────────────── */

function FlipClock() {
  // Prefs are read through the SSR-safe helper: a bare localStorage read
  // in a useState initialiser throws while server-rendering the route.
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [now, setNow] = useState(() => new Date());
  const [sessionSec, setSessionSec] = useState(0);
  const [visits, setVisits] = useState(0);
  const [showUi, setShowUi] = useState(true);
  const [photoOk, setPhotoOk] = useState(true);

  const pausedRef = useRef(false);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSec = useRef(-1);
  const prevMin = useRef(-1);

  // hydrate prefs + this device's real visit count after mount
  useEffect(() => {
    setPrefs(loadPrefs());
    setVisits(toolClicks()["flip-clock"] ?? 0);
    bumpToolClick("flip-clock");
  }, []);

  useEffect(() => {
    writeStorage(STORE, JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    pausedRef.current = prefs.paused;
  }, [prefs.paused]);

  /* The clock is a fixed full-bleed overlay now, so the page behind it
     (header, breadcrumbs, the catalogue cross-links) must not scroll
     underneath — a scrollbar would also make `100vw` wider than the
     visible area and shrink the usable width. */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const set = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  }, []);

  /* the single one-second heartbeat: advances the clock unless paused */
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setNow(new Date());
      setSessionSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = now.getHours();
  const isPm = h >= 12;
  const hours = prefs.h24 ? h : h % 12 || 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  /* sounds: a "tik tik" on every second, a louder card flip on the minute */
  useEffect(() => {
    if (!prefs.sound || prefs.paused) return;
    if (seconds === prevSec.current) return;
    prevSec.current = seconds;
    playTone("tick");
    if (minutes !== prevMin.current) {
      prevMin.current = minutes;
      playTone("flip");
    }
  }, [seconds, minutes, prefs.sound, prefs.paused]);

  /* auto-hiding chrome — re-armed on every interaction, not just once */
  const wake = useCallback(() => {
    setShowUi(true);
    if (idleRef.current) clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => setShowUi(false), IDLE_MS);
  }, []);

  useEffect(() => {
    wake();
    const events: (keyof WindowEventMap)[] = ["mousemove", "touchstart", "keydown"];
    for (const e of events) window.addEventListener(e, wake, { passive: true });
    return () => {
      for (const e of events) window.removeEventListener(e, wake);
      if (idleRef.current) clearTimeout(idleRef.current);
    };
  }, [wake]);

  const cycleBg = useCallback(() => {
    setPhotoOk(true);
    set("bg", (prefs.bg + 1) % BACKGROUNDS.length);
  }, [prefs.bg, set]);

  const togglePause = useCallback(() => {
    if (!prefs.paused) {
      // freeze on the current instant so resuming never skips a second
      setNow(new Date());
    }
    set("paused", !prefs.paused);
  }, [prefs.paused, set]);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        togglePause();
      } else if (e.key === "s" || e.key === "S") set("sound", !prefs.sound);
      else if (e.key === "b" || e.key === "B") cycleBg();
      else if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleBg, prefs.sound, set, toggleFullscreen, togglePause]);

  const hStr = String(hours).padStart(2, "0");
  const mStr = String(minutes).padStart(2, "0");
  const sStr = String(seconds).padStart(2, "0");
  // `charAt` (not index access) so every element is a plain string under
  // noUncheckedIndexedAccess.
  const digits = [
    hStr.charAt(0),
    hStr.charAt(1),
    mStr.charAt(0),
    mStr.charAt(1),
    sStr.charAt(0),
    sStr.charAt(1),
  ] as const;

  const bg = BACKGROUNDS[prefs.bg % BACKGROUNDS.length] ?? BACKGROUND_FALLBACK;
  const vertical = prefs.axis === "x";
  const units = [
    { label: "Hours", pair: [digits[0], digits[1]] as const },
    { label: "Minutes", pair: [digits[2], digits[3]] as const },
    { label: "Seconds", pair: [digits[4], digits[5]] as const },
  ];

  /* Card geometry now lives in CSS (`.fc-stack` / `.fc-inline`) so it can
     be driven straight off the viewport. Both branches only need the
     layout class. */
  const layoutClass = vertical ? "fc-stack" : "fc-inline";

  return (
    <div
      className={`fc-root fixed inset-0 z-40 flex w-full flex-col overflow-hidden select-none ${layoutClass}`}
    >
      {/* ── background: click anywhere on it to change the photo ── */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ background: bg.css }}
        onClick={cycleBg}
        role="button"
        tabIndex={-1}
        aria-label="Change background"
        title="Click to change background"
      >
        {bg.url && photoOk && (
          <img
            src={bg.url}
            alt=""
            aria-hidden="true"
            onError={() => setPhotoOk(false)}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "saturate(0.85) brightness(0.55)" }}
          />
        )}
        {/* scrim keeps the digits readable over any photo */}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.34)" }} />
      </div>

      <h1 className="sr-only">Flip Clock — split-flap clock by SlashAI</h1>

      {/* ── clock ── */}
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 py-3 sm:px-6">
        {vertical ? (
          /* A 3-column grid, not three centred rows: the Hours row used to
             carry an extra AM/PM cell, so each row was a different width and
             centring them independently left the digit columns visibly out
             of line. Every row now fills the same three columns, and the
             meridiem cell is always rendered (empty for the lower two rows)
             so the grid reserves it too. */
          <div
            className="fc-grid grid items-center"
            style={{ gridTemplateColumns: "auto auto auto" }}
          >
            {units.map((u) => (
              <div key={u.label} className="contents">
                <span className="fc-label text-right font-semibold tracking-[0.18em] text-white/35 uppercase">
                  {u.label}
                </span>
                <div className="fc-pair flex">
                  <div className="flex-1">
                    <FlipDigit char={u.pair[0]} axis={prefs.axis} />
                  </div>
                  <div className="flex-1">
                    <FlipDigit char={u.pair[1]} axis={prefs.axis} />
                  </div>
                </div>
                <span className="fc-meridiem font-bold tracking-wider text-white/45">
                  {u.label === "Hours" && !prefs.h24 ? (isPm ? "PM" : "AM") : ""}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="fc-row flex items-center">
            {digits.map((d, i) => (
              <div key={i} className="fc-group flex items-center">
                <div className="fc-card">
                  <FlipDigit char={d} axis={prefs.axis} />
                </div>
                {(i === 1 || i === 3) && (
                  <span className="fc-colon px-0.5 font-semibold text-white/35">:</span>
                )}
              </div>
            ))}
            {!prefs.h24 && (
              <span className="fc-meridiem pl-1 font-bold tracking-wider text-white/45">
                {isPm ? "PM" : "AM"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── paused badge ── */}
      {prefs.paused && (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-[calc(50%+64px)] text-center">
          <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
            Paused
          </span>
        </div>
      )}

      {/* ── real numbers, not a made-up viewer count ──
          Anchored top-right: the old bottom-left placement collided with the
          control deck as soon as the pills wrapped on a narrow screen. */}
      <div
        className={`pointer-events-none fixed top-4 right-4 z-30 w-[190px] rounded-2xl border border-white/10 bg-black/50 px-3 py-2.5 backdrop-blur-md transition-opacity duration-300 sm:w-[210px] ${
          showUi ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-[9px] font-bold tracking-[0.18em] text-white/40 uppercase">
          SlashAI right now
        </p>
        <dl className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-white/70">
          <dt className="text-white/40">Tools</dt>
          <dd className="text-right font-semibold tabular-nums">{SEO_COUNTS.tools}</dd>
          <dt className="text-white/40">Commands</dt>
          <dd className="text-right font-semibold tabular-nums">{SEO_COUNTS.commands}</dd>
          <dt className="text-white/40">Games</dt>
          <dd className="text-right font-semibold tabular-nums">{SEO_COUNTS.games}</dd>
          <dt className="text-white/40">Courses</dt>
          <dd className="text-right font-semibold tabular-nums">{SEO_COUNTS.courses}</dd>
          <dt className="text-white/40">On this page</dt>
          <dd className="text-right font-semibold tabular-nums">
            {Math.floor(sessionSec / 60)}:{String(sessionSec % 60).padStart(2, "0")}
          </dd>
          <dt className="text-white/40">Your visits</dt>
          <dd className="text-right font-semibold tabular-nums">{visits}</dd>
        </dl>
        <p className="mt-1.5 text-[9px] leading-tight text-white/30">
          Counted from the site catalogue and this device — no invented viewers.
        </p>
      </div>

      {/* ── control deck ──
          One non-wrapping row that scrolls sideways on narrow screens. The
          previous bar used flex-wrap, so on a phone the seven controls spilled
          onto three ragged lines and the hint text landed on top of them. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-2 px-3 pb-3 transition-opacity duration-300 sm:pb-4 ${
          showUi ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <p className="hidden text-[9px] tracking-wider text-white/30 sm:block">
          Click the background to change it · Space pause · S sound · B background
        </p>
        <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <Pill onClick={() => window.history.back()} title="Back">
            Close
          </Pill>
          <Divider />
          <Pill onClick={togglePause} active={prefs.paused} title="Space">
            {prefs.paused ? "▶ Resume" : "❙❙ Pause"}
          </Pill>
          <Pill onClick={() => set("h24", !prefs.h24)} active={prefs.h24}>
            {prefs.h24 ? "24H" : "12H"}
          </Pill>
          <Pill
            onClick={() => set("axis", vertical ? "y" : "x")}
            active={vertical}
            title="Flip direction"
          >
            {vertical ? "▤ Vertical" : "▥ Horizontal"}
          </Pill>
          <Divider />
          <Pill onClick={() => set("sound", !prefs.sound)} active={prefs.sound} title="S">
            {prefs.sound ? "🔊 Sound" : "🔇 Muted"}
          </Pill>
          <Pill onClick={cycleBg} title="B">
            {bg.label}
          </Pill>
          <Pill onClick={toggleFullscreen} title="F" icon>
            ⛶
          </Pill>
        </div>
      </div>

      <style>{`
        /* ── full-screen sizing ──────────────────────────────────
           The clock is a fixed, full-bleed overlay, so the free space is
           exactly the viewport minus the two floating chrome panels. The
           old build sized cards with clamp(56px, 15vw, 88px), which
           stopped growing at 88px and left the clock looking like a
           thumbnail on a desktop monitor. These rules derive the card
           box from the viewport instead, in both layouts:

           - .fc-stack: three rows of two cards (1.44:1). Bound by
             height, since 3 cards + gaps have to fit the screen.
           - .fc-inline: six cards in one row (0.8:1). Bound by width,
             since 6 cards + gaps + separators have to fit the screen.

           150px is reserved for the auto-hiding control deck at the
           bottom; the two floor values stop the cards collapsing on
           very small windows. */
        .fc-root { --fc-gap: clamp(4px, 1vmin, 20px); }

        .fc-stack {
          --fc-card-h: max(42px, min(calc((100dvh - 150px - 2 * var(--fc-gap)) / 3), calc((100vw - 170px) / 3.6)));
          --fc-card-w: calc(var(--fc-card-h) * 1.44);
        }
        .fc-inline {
          --fc-card-h: max(34px, min(100dvh - 150px, (100vw - 110px) / 5.7));
          --fc-card-w: calc(var(--fc-card-h) * 0.8);
        }

        .fc-grid { gap: var(--fc-gap); }

        .fc-pair {
          gap: var(--fc-gap);
          flex: none;
          width: calc(var(--fc-card-w) * 2 + var(--fc-gap));
          height: var(--fc-card-h);
        }
        .fc-row { gap: var(--fc-gap); }
        .fc-group { gap: calc(var(--fc-gap) * 0.5); }
        .fc-card { width: var(--fc-card-w); height: var(--fc-card-h); flex: none; }

        /* The digit is sized off its own card (a container query), so it
           can never overflow the card however big the screen is. A
           split-flap glyph is ~0.72em of cap height, so 1.05cqh fills
           roughly three quarters of the card. The vmin line is the
           fallback for engines without container-query units. */
        .fc-glyph { font-size: clamp(52px, 12vmin, 460px); font-size: 1.05cqh; }

        /* the small type scales with the clock so it never looks lost
           next to a 250px digit */
        .fc-label { font-size: clamp(9px, 1.1vmin, 20px); }
        .fc-meridiem { font-size: clamp(11px, 1.7vmin, 30px); }
        .fc-colon { font-size: clamp(1.5rem, 9vmin, 12rem); line-height: 1; }

        @keyframes fcOutX { from { transform: rotateX(0deg); } to { transform: rotateX(-90deg); } }
        @keyframes fcInX  { from { transform: rotateX(90deg); } to { transform: rotateX(0deg); } }
        @keyframes fcOutY { from { transform: rotateY(0deg); } to { transform: rotateY(-90deg); } }
        @keyframes fcInY  { from { transform: rotateY(90deg); } to { transform: rotateY(0deg); } }
        @keyframes fcShadeOut { from { opacity: 0; } to { opacity: 0.55; } }
        @keyframes fcShadeIn  { from { opacity: 0.5; } to { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
}
