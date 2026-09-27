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
  fontSize: "min(66cqw, 46cqh)",
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
        <span style={GLYPH}>{value}</span>
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
              <span style={GLYPH}>{from}</span>
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
              <span style={GLYPH}>{char}</span>
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
}: {
  active?: boolean;
  children: ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="h-8 shrink-0 rounded-full border px-3 text-[11px] font-semibold tracking-wider transition-all duration-150"
      style={{
        borderColor: active ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.1)",
        color: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.5)",
        background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
      }}
    >
      {children}
    </button>
  );
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

  const cardBox = vertical ? "w-[clamp(56px,15vw,88px)]" : "w-[clamp(44px,11.5vw,72px)]";

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden select-none">
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
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-6">
        {vertical ? (
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            {units.map((u) => (
              <div key={u.label} className="flex items-center gap-3 sm:gap-5">
                <span className="w-14 text-right text-[9px] font-semibold tracking-[0.18em] text-white/35 uppercase sm:w-20 sm:text-[10px]">
                  {u.label}
                </span>
                <div className={`flex gap-1.5 sm:gap-2 ${cardBox}`} style={{ aspectRatio: "1.52" }}>
                  <div className="flex-1">
                    <FlipDigit char={u.pair[0]} axis={prefs.axis} />
                  </div>
                  <div className="flex-1">
                    <FlipDigit char={u.pair[1]} axis={prefs.axis} />
                  </div>
                </div>
                {u.label === "Hours" && !prefs.h24 && (
                  <span className="w-8 text-[11px] font-bold tracking-wider text-white/45 sm:w-10 sm:text-sm">
                    {isPm ? "PM" : "AM"}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2.5">
            {digits.map((d, i) => (
              <div key={i} className="flex items-center gap-1 sm:gap-2.5">
                <div className={cardBox} style={{ aspectRatio: vertical ? "1.52" : "0.8" }}>
                  <FlipDigit char={d} axis={prefs.axis} />
                </div>
                {(i === 1 || i === 3) && (
                  <span className="px-0.5 text-2xl font-semibold text-white/35 sm:text-4xl">:</span>
                )}
              </div>
            ))}
            {!prefs.h24 && (
              <span className="pl-1 text-[11px] font-bold tracking-wider text-white/45 sm:text-sm">
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

      {/* ── real numbers, not a made-up viewer count ── */}
      <div
        className={`pointer-events-none fixed bottom-16 left-4 z-30 max-w-[230px] rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 backdrop-blur transition-opacity duration-300 sm:bottom-20 sm:left-6 ${
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

      {/* ── controls ── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-2 pb-4 transition-opacity duration-300 ${
          showUi ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex max-w-[94vw] flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/10 bg-black/55 px-3 py-2 backdrop-blur">
          <Pill onClick={() => window.history.back()} title="Back">
            Close
          </Pill>
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
          <Pill onClick={() => set("sound", !prefs.sound)} active={prefs.sound} title="S">
            {prefs.sound ? "🔊 Sound" : "🔇 Muted"}
          </Pill>
          <Pill onClick={cycleBg} title="B">
            {bg.label}
          </Pill>
          <Pill onClick={toggleFullscreen} title="F">
            ⛶
          </Pill>
        </div>
        <p className="text-[9px] tracking-wider text-white/25">
          Click the background to change it · Space pause · S sound · B background
        </p>
      </div>

      <style>{`
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
