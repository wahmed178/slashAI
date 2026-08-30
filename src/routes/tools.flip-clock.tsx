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
      }, 300);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, displayed]);

  const digitCls =
    "absolute inset-0 flex items-center justify-center select-none pointer-events-none";
  const digitStyle = {
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSize: "clamp(72px, 20vw, 200px)",
    fontWeight: 700,
    lineHeight: 1,
  };

  return (
    <div className="relative w-full" style={{ aspectRatio: "1.4" }}>
      {/* Card background */}
      <div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden"
        style={{ background: "#1a1a1a" }}
      >
        {/* ── TOP HALF ── shows top portion of current digit */}
        <div
          className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden"
          style={{ clipPath: "inset(0 0 0 0)" }}
        >
          <div className={digitCls}>
            <span
              style={{
                ...digitStyle,
                color: "rgba(255,255,255,0.92)",
                clipPath: "inset(0 0 50% 0)",
              }}
            >
              {flipping ? prev : displayed}
            </span>
          </div>
        </div>

        {/* ── BOTTOM HALF ── shows bottom portion of current digit */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden"
          style={{ clipPath: "inset(0 0 0 0)" }}
        >
          <div className={digitCls}>
            <span
              style={{
                ...digitStyle,
                color: "rgba(255,255,255,0.6)",
                clipPath: "inset(50% 0 0 0)",
              }}
            >
              {displayed}
            </span>
          </div>
        </div>

        {/* ── FLIP: top flap (old value folding away) ── */}
        {flipping && (
          <div
            className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden origin-bottom"
            style={{
              animation: "flipTop 0.3s ease-in forwards",
              backfaceVisibility: "hidden",
              zIndex: 10,
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "#1a1a1a" }}
            >
              <div className={digitCls}>
                <span
                  style={{
                    ...digitStyle,
                    color: "rgba(255,255,255,0.92)",
                    clipPath: "inset(0 0 50% 0)",
                  }}
                >
                  {prev}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── FLIP: bottom flap (new value appearing) ── */}
        {flipping && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden origin-top"
            style={{
              animation: "flipBottom 0.3s ease-out 0.15s forwards",
              backfaceVisibility: "hidden",
              transform: "rotateX(90deg)",
              zIndex: 10,
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "#1a1a1a" }}
            >
              <div className={digitCls}>
                <span
                  style={{
                    ...digitStyle,
                    color: "rgba(255,255,255,0.6)",
                    clipPath: "inset(50% 0 0 0)",
                  }}
                >
                  {displayed}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Center split line */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-px h-px z-20"
          style={{ background: "rgba(0,0,0,0.7)" }}
        />
      </div>

      {/* AM/PM badge */}
      {showAmPm && (
        <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5 z-30">
          <span
            className="text-xs sm:text-sm font-semibold tracking-wider"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {isPm ? "PM" : "AM"}
          </span>
        </div>
      )}

      {/* Label */}
      {label && (
        <div className="absolute top-3 right-4 sm:top-4 sm:right-5 z-30">
          <span
            className="text-[10px] sm:text-xs font-medium tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.2)" }}
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

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden select-none"
      style={{ background: "#000000" }}
    >
      {/* Back button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="fixed top-4 left-4 z-50 h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-150 active:scale-95"
        style={{
          borderColor: "rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Flip cards — vertical stack, centered */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4 px-6 sm:px-10 py-4">
        <div className="w-full max-w-[280px] sm:max-w-[340px]">
          <FlipCard value={hStr} showAmPm={!h24} isPm={isPm} />
        </div>
        <div className="w-full max-w-[280px] sm:max-w-[340px]">
          <FlipCard value={mStr} label="MINUTES" />
        </div>
        <div className="w-full max-w-[280px] sm:max-w-[340px]">
          <FlipCard value={sStr} label="SECONDS" />
        </div>
      </div>

      {/* Date */}
      <div className="shrink-0 pb-8 sm:pb-12 text-center">
        <p className="text-xs sm:text-sm tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
          {dateStr}
        </p>
      </div>

      {/* Controls */}
      <div className="shrink-0 fixed bottom-0 left-0 right-0 flex items-center justify-center pb-4 gap-3 z-20">
        <button
          type="button"
          onClick={() => setH24(!h24)}
          className="h-8 px-3 rounded-full border text-[11px] tracking-wider transition-all duration-150"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {h24 ? "24H" : "12H"}
        </button>
      </div>

      <style>{`
        @keyframes flipTop {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
        @keyframes flipBottom {
          0% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
      `}</style>
    </div>
  );
}
