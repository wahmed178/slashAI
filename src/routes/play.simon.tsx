import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/simon")({ component: Simon });

const PADS = [
  { color: "#22d3ee", glow: "rgba(34,211,238,0.75)", freq: 329.63 },
  { color: "#4ade80", glow: "rgba(74,222,128,0.75)", freq: 261.63 },
  { color: "#facc15", glow: "rgba(250,204,21,0.75)", freq: 220 },
  { color: "#f87171", glow: "rgba(248,113,113,0.75)", freq: 164.81 },
] as const;

function loadBest(): number {
  try {
    return Number(localStorage.getItem("play-simon-best") ?? 0) || 0;
  } catch {
    return 0;
  }
}

function Simon() {
  const [seq, setSeq] = useState<number[]>([]);
  const [phase, setPhase] = useState<"idle" | "showing" | "input" | "over">("idle");
  const [idx, setIdx] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [best, setBest] = useState(loadBest);
  const audioRef = useRef<AudioContext | null>(null);

  function tone(freq: number, dur = 0.3) {
    try {
      const w = window as unknown as { webkitAudioContext?: typeof AudioContext };
      const AC = window.AudioContext ?? w.webkitAudioContext;
      if (!AC) return;
      if (!audioRef.current) audioRef.current = new AC();
      const ctx = audioRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.16, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {
      /* audio unavailable */
    }
  }

  function start() {
    setSeq([Math.floor(Math.random() * 4)]);
    setIdx(0);
    setPhase("showing");
  }

  // playback loop
  useEffect(() => {
    if (phase !== "showing" || seq.length === 0) return;
    let cancelled = false;
    let i = 0;
    const step = () => {
      if (cancelled) return;
      const s = seq[i];
      if (s === undefined) {
        setActive(null);
        setIdx(0);
        setPhase("input");
        return;
      }
      setActive(s);
      tone(PADS[s]!.freq);
      window.setTimeout(() => {
        if (cancelled) return;
        setActive(null);
        window.setTimeout(() => {
          if (cancelled) return;
          i++;
          step();
        }, 170);
      }, 420);
    };
    const kick = window.setTimeout(step, 550);
    return () => {
      cancelled = true;
      window.clearTimeout(kick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, seq]);

  function tap(i: number) {
    if (phase !== "input") return;
    tone(PADS[i]!.freq, 0.22);
    setActive(i);
    window.setTimeout(() => setActive((a) => (a === i ? null : a)), 200);
    if (seq[idx] !== i) {
      setPhase("over");
      if (seq.length - 1 > best) {
        setBest(seq.length - 1);
        try {
          localStorage.setItem("play-simon-best", String(seq.length - 1));
        } catch {
          /* storage unavailable */
        }
      }
      return;
    }
    if (idx + 1 >= seq.length) {
      window.setTimeout(() => {
        setSeq((s) => [...s, Math.floor(Math.random() * 4)]);
        setPhase("showing");
      }, 550);
    } else {
      setIdx(idx + 1);
    }
  }

  const level = Math.max(0, seq.length - (phase === "over" ? 1 : 0));

  return (
    <AppShell title="Simon">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎵 Simon</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Watch the pattern, then repeat it. Every round adds one more step. Sound on for the full
          effect.
        </p>
      </header>

      <div className="mx-auto max-w-xs space-y-3">
        <div className="flex items-center justify-around rounded-xl border border-border bg-surface py-2.5 text-center">
          <div>
            <p className="text-[17px] font-bold text-foreground">{phase === "idle" ? 0 : level}</p>
            <p className="text-[10px] text-muted-foreground">Level</p>
          </div>
          <div>
            <p className="text-[17px] font-bold text-primary">{best}</p>
            <p className="text-[10px] text-muted-foreground">Best</p>
          </div>
          <button
            onClick={start}
            disabled={phase === "showing" || phase === "input"}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12px] font-bold text-background transition-opacity hover:bg-primary/90 disabled:opacity-40"
          >
            <RotateCcw className="size-3" /> {phase === "over" ? "Retry" : "Start"}
          </button>
        </div>

        <div className="relative">
          <div className="grid aspect-square grid-cols-2 gap-2.5">
            {PADS.map((p, i) => (
              <button
                key={i}
                onClick={() => tap(i)}
                disabled={phase !== "input"}
                className="rounded-2xl border border-border transition-all duration-100"
                style={{
                  backgroundColor: active === i ? p.glow : p.color,
                  opacity: active === i ? 1 : 0.32,
                  transform: active === i ? "scale(0.97)" : "scale(1)",
                  boxShadow: active === i ? `0 0 24px ${p.glow}` : "none",
                }}
                aria-label={`Pad ${i + 1}`}
              />
            ))}
          </div>
          {phase !== "input" && phase !== "showing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-black/65">
              <p className="text-[18px] font-black text-foreground">
                {phase === "over" ? "Wrong pad! 💥" : "🎵 Simon"}
              </p>
              <p className="text-[12px] text-muted-foreground">
                {phase === "over" ? `You reached level ${level}` : "Repeat the pattern as it grows"}
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-[12px] font-semibold text-primary">
          {phase === "showing" ? "Watch closely..." : phase === "input" ? `Your turn - step ${idx + 1} of ${seq.length}` : ""}
        </p>
      </div>
    </AppShell>
  );
}
