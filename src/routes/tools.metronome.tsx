import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/metronome")({
  head: () => ({
    meta: [
      { title: "Metronome - Free Browser Tool | SlashAI" },
      {
        name: "description",
        content:
          "A precise web metronome: 30-240 BPM, 2/4/3/4/6/8 time signatures, tap tempo and visual beat dots. Free, no install, works offline.",
      },
    ],
  }),
  component: MetronomeTool,
});

/** schedule-ahead metronome via Web Audio clock (rock-solid timing, unlike setInterval) */
function MetronomeTool() {
  const [bpm, setBpm] = useState(100);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);

  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number>(0);
  const nextNoteRef = useRef(0);
  const beatRef = useRef(0);

  useEffect(() => {
    // stop everything on unmount
    return () => {
      window.clearInterval(timerRef.current);
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  const click = (ctx: AudioContext, t: number, accent: boolean) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = accent ? 1600 : 1100;
    gain.gain.setValueAtTime(accent ? 0.9 : 0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  };

  const start = () => {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current ?? new Ctx();
    ctxRef.current = ctx;
    void ctx.resume();
    nextNoteRef.current = ctx.currentTime + 0.1;
    beatRef.current = 0;
    setBeat(0);
    setRunning(true);

    timerRef.current = window.setInterval(() => {
      while (nextNoteRef.current < ctx.currentTime + 0.12) {
        const isAccent = beatRef.current % beatsPerBar === 0;
        click(ctx, nextNoteRef.current, isAccent);
        const visualDelay = Math.max(0, (nextNoteRef.current - ctx.currentTime) * 1000);
        window.setTimeout(() => setBeat(beatRef.current % beatsPerBar), visualDelay);
        beatRef.current = (beatRef.current + 1) % beatsPerBar;
        nextNoteRef.current += 60 / bpm;
      }
    }, 25);
  };

  const stop = () => {
    window.clearInterval(timerRef.current);
    setRunning(false);
  };

  // tap tempo
  const tapsRef = useRef<number[]>([]);
  const tap = () => {
    const now = performance.now();
    tapsRef.current = [...tapsRef.current.filter((t) => now - t < 2500), now];
    if (tapsRef.current.length >= 2) {
      const gaps = tapsRef.current.slice(1).map((t, i) => t - tapsRef.current[i]!);
      const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      const tapped = Math.round(60000 / avg);
      setBpm(Math.max(30, Math.min(240, tapped)));
    }
  };

  return (
    <AppShell title="Metronome">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🥁 Metronome</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Studio-accurate timing via the Web Audio clock — not setInterval. Tap tempo supported.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        {/* beat dots */}
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-6">
          {Array.from({ length: beatsPerBar }, (_, i) => (
            <span
              key={i}
              aria-hidden
              className="rounded-full transition-all duration-75"
              style={{
                width: running && beat === i ? 26 : 14,
                height: running && beat === i ? 26 : 14,
                background: running && beat === i ? (i === 0 ? "#2dd4bf" : "#818cf8") : "var(--border)",
              }}
            />
          ))}
        </div>

        {/* BPM */}
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          <p className="text-5xl font-black tabular-nums text-foreground">{bpm}</p>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">BPM</p>
          <input
            type="range"
            min={30}
            max={240}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--primary)]"
            aria-label="Beats per minute"
          />
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {[60, 80, 100, 120, 160, 200].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setBpm(v)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                  bpm === v ? "bg-primary text-primary-foreground" : "bg-surface-elevated text-muted-foreground hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* time signature + controls */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-[12px] font-semibold text-muted-foreground">Time signature</p>
          <div className="mt-2 flex gap-1.5">
            {[2, 3, 4, 6, 8].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setBeatsPerBar(n);
                  beatRef.current = 0;
                  setBeat(0);
                }}
                className={`h-10 flex-1 rounded-lg text-[13px] font-bold transition-colors ${
                  beatsPerBar === n ? "bg-primary text-primary-foreground" : "bg-surface-elevated text-muted-foreground hover:text-foreground"
                }`}
              >
                {n}/4
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={running ? stop : start}
              className={`h-12 flex-1 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 ${running ? "bg-rose-500" : "bg-primary"}`}
            >
              {running ? "■ Stop" : "▶ Start"}
            </button>
            <button
              type="button"
              onClick={tap}
              className="h-12 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors hover:border-primary/40"
            >
              Tap tempo
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
