import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";

export const Route = createFileRoute("/play/bubble-wrap")({ component: BubbleWrap });

const ROWS = 12;
const COLS = 16;
const TOTAL = ROWS * COLS;

/** tiny synthesized pop via WebAudio - no asset needed */
function usePopSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback(() => {
    if (!enabled) return;
    try {
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext();
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(420 + Math.random() * 180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch {
      /* audio unsupported - pop silently */
    }
  }, [enabled]);
}

function BubbleWrap() {
  const [popped, setPopped] = useState<Set<number>>(() => new Set());
  const [sound, setSound] = useState(true);
  const [dragging, setDragging] = useState(false);
  const pop = usePopSound(sound);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // "Full sheet" reset button also re-arms all bubbles
  const reset = () => setPopped(new Set());

  const popAt = useCallback(
    (i: number) => {
      setPopped((prev) => {
        if (prev.has(i)) return prev;
        pop();
        const next = new Set(prev);
        next.add(i);
        return next;
      });
    },
    [pop],
  );

  useEffect(() => {
    const up = () => setDragging(false);
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  const poppedCount = popped.size;

  return (
    <AppShell title="Bubble Wrap">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🫧 Bubble Wrap</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Click, tap, or drag across the sheet. Endlessly satisfying. Infinitely renewable.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Popped: <b className="tabular-nums text-foreground">{poppedCount}</b> / {TOTAL}
            {poppedCount === TOTAL && <span className="ml-2 font-bold text-primary">Full sheet! 🎉</span>}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setSound((s) => !s)}
              className="grid size-7 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              aria-label={sound ? "Mute pops" : "Unmute pops"}
            >
              {sound ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <RotateCcw className="size-3" /> New sheet
            </button>
          </div>
        </div>

        <div
          ref={wrapRef}
          className="grid touch-none select-none gap-1 rounded-2xl border border-border bg-surface p-3"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          onPointerDown={() => setDragging(true)}
          onContextMenu={(e) => e.preventDefault()}
        >
          {Array.from({ length: TOTAL }, (_, i) => {
            const isPopped = popped.has(i);
            return (
              <button
                key={i}
                onPointerDown={() => popAt(i)}
                onPointerEnter={() => dragging && popAt(i)}
                className={`aspect-square rounded-full transition-all duration-75 ${
                  isPopped
                    ? "scale-90 bg-muted/50 shadow-inner"
                    : "bg-gradient-to-br from-primary/25 to-primary/10 shadow-[inset_0_-2px_3px_rgba(0,0,0,0.15),inset_0_2px_3px_rgba(255,255,255,0.25)] hover:scale-105"
                }`}
                aria-label={isPopped ? "Popped bubble" : "Bubble"}
              />
            );
          })}
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          {poppedCount === 0
            ? "Tip: hold down and drag to pop whole rows at once."
            : poppedCount === TOTAL
              ? "Every single one. Take a deep breath and start again."
              : `${TOTAL - poppedCount} bubbles remain between you and inner peace.`}
        </p>
      </div>
    </AppShell>
  );
}
