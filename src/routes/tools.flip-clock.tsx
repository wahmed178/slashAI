import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/flip-clock")({
  head: () => ({ meta: [{ title: "Flip Clock — SlashKits" }] }),
  component: FlipClock,
});

/* ── Single flip card ───────────────────────────────────────── */

function FlipCard({
  value,
  label,
  showAmPm,
  isPm,
}: {
  value: string;
  label?: string;
  showAmPm?: boolean;
  isPm?: boolean;
}) {
  const [displayed, setDisplayed] = useState(value);
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value !== displayed) {
      setPrev(displayed);
      setFlipping(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setDisplayed(value);
        setFlipping(false);
      }, 350);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, displayed]);

  // The number to show in the static halves
  const staticNum = flipping ? prev : displayed;

  return (
    <div className="relative w-full" style={{ aspectRatio: "1.35" }}>
      {/* Card background */}
      <div
        className="absolute inset-0 rounded-[18px] sm:rounded-[24px]"
        style={{ background: "#1c1c1c" }}
      >
        {/* ── TOP HALF ── bright, clipped to top 50% */}
        <div
          className="absolute inset-0"
          style={{ clipPath: "inset(0 0 50% 0)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="select-none pointer-events-none"
              style={{
                fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                fontSize: "clamp(80px, 22vw, 220px)",
                fontWeight: 600,
                lineHeight: 1,
                color: "#d4d4d4",
                letterSpacing: "-0.02em",
              }}
            >
              {staticNum}
            </span>
          </div>
        </div>

        {/* ── BOTTOM HALF ── dimmer, clipped to bottom 50% */}
        <div
          className="absolute inset-0"
          style={{ clipPath: "inset(50% 0 0 0)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="select-none pointer-events-none"
              style={{
                fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                fontSize: "clamp(80px, 22vw, 220px)",
                fontWeight: 600,
                lineHeight: 1,
                color: "#9a9a9a",
                letterSpacing: "-0.02em",
              }}
            >
              {displayed}
            </span>
          </div>
        </div>

        {/* ── FLIP: top flap folding down (shows OLD value) ── */}
        {flipping && (
          <div
            className="absolute inset-0 origin-bottom"
            style={{
              clipPath: "inset(0 0 50% 0)",
              animation: "flipDown 0.35s ease-in forwards",
              backfaceVisibility: "hidden",
              zIndex: 10,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="select-none pointer-events-none"
                style={{
                  fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                  fontSize: "clamp(80px, 22vw, 220px)",
                  fontWeight: 600,
                  lineHeight: 1,
                  color: "#d4d4d4",
                  letterSpacing: "-0.02em",
                }}
              >
                {prev}
              </span>
            </div>
          </div>
        )}

        {/* ── FLIP: bottom flap rotating in (shows NEW value) ── */}
        {flipping && (
          <div
            className="absolute inset-0 origin-top"
            style={{
              clipPath: "inset(50% 0 0 0)",
              transform: "rotateX(180deg)",
              animation: "flipUp 0.35s ease-out 0.175s forwards",
              backfaceVisibility: "hidden",
              zIndex: 10,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="select-none pointer-events-none"
                style={{
                  fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                  fontSize: "clamp(80px, 22vw, 220px)",
                  fontWeight: 600,
                  lineHeight: 1,
                  color: "#9a9a9a",
                  letterSpacing: "-0.02em",
                }}
              >
                {displayed}
              </span>
            </div>
          </div>
        )}

        {/* Center split line */}
        <div
          className="absolute left-0 right-0 top-1/2 z-20"
          style={{
            height: "1px",
            marginTop: "-0.5px",
            background: "rgba(0,0,0,0.6)",
          }}
        />
      </div>

      {/* AM/PM badge — bottom-left of card */}
      {showAmPm && (
        <div
          className="absolute z-30"
          style={{ bottom: "12%", left: "8%" }}
        >
          <span
            className="text-[11px] sm:text-sm font-semibold tracking-wider"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {isPm ? "PM" : "AM"}
          </span>
        </div>
      )}

      {/* Label — top-right of card */}
      {label && (
        <div
          className="absolute z-30"
          style={{ top: "10%", right: "6%" }}
        >
          <span
            className="text-[9px] sm:text-[11px] font-medium tracking-[0.15em] uppercase"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */

function FlipClock() {
  const [now, setNow] = useState(new Date());
  const [h24, setH24] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const show = () => {
      setShowControls(true);
    };
    const hide = setTimeout(() => setShowControls(false), 3000);
    window.addEventListener("mousemove", show);
    window.addEventListener("touchstart", show);
    return () => {
      window.removeEventListener("mousemove", show);
      window.removeEventListener("touchstart", show);
      clearTimeout(hide);
    };
  }, [showControls]);


  let hours: number;
  let minutes: number;
  let seconds: number;
  let isPm = false;

  if (h24) {
    hours = now.getHours();
    minutes = now.getMinutes();
    seconds = now.getSeconds();
  } else {
    let h = now.getHours();
    isPm = h >= 12;
    h = h % 12 || 12;
    hours = h;
    minutes = now.getMinutes();
    seconds = now.getSeconds();
  }

  const hStr = String(hours).padStart(2, "0");
  const mStr = String(minutes).padStart(2, "0");
  const sStr = String(seconds).padStart(2, "0");

  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden select-none"
      style={{ background: "#000000" }}
    >
      {/* Auto-dismiss close button */}
      <div
        className={`fixed top-4 left-4 z-50 transition-opacity duration-500 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-lg border border-border bg-surface/80 backdrop-blur px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Close
        </button>
      </div>

      {/* Vertical center line behind cards */}
      <div
        className="absolute left-1/2 top-0 bottom-0 -translate-x-px z-0"
        style={{ width: "1px", background: "rgba(255,255,255,0.04)" }}
      />

      {/* Flip cards — vertical stack, centered */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4 px-8 sm:px-12 relative z-10">
        <div className="w-full max-w-[260px] sm:max-w-[320px]">
          <FlipCard value={hStr} showAmPm={!h24} isPm={isPm} />
        </div>
        <div className="w-full max-w-[260px] sm:max-w-[320px]">
          <FlipCard value={mStr} label="MINUTES" />
        </div>
        <div className="w-full max-w-[260px] sm:max-w-[320px]">
          <FlipCard value={sStr} label="SECONDS" />
        </div>
      </div>

      {/* Controls */}
      <div className="shrink-0 fixed bottom-0 left-0 right-0 flex items-center justify-center pb-5 gap-3 z-20">
        <button
          type="button"
          onClick={() => setH24(!h24)}
          className="h-8 px-3 rounded-full border text-[11px] tracking-wider transition-all duration-150"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.35)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          {h24 ? "24H" : "12H"}
        </button>
      </div>

      <style>{`
        @keyframes flipDown {
          0%   { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
        @keyframes flipUp {
          0%   { transform: rotateX(180deg); }
          100% { transform: rotateX(0deg); }
        }
      `}</style>
    </div>
  );
}
