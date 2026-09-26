import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/hue-hunt")({
  head: () => ({
    meta: [
      { title: "Hue Hunt - Colour Discrimination Training | SlashAI" },
      {
        name: "description",
        content:
          "Advanced colour brain training: an adaptive hue-discrimination staircase that measures the narrowest colour difference you can actually resolve. Two modes, real JND score, free.",
      },
    ],
  }),
  component: HueHunt,
});

/**
 * Lightness and saturation are held constant on purpose, so the only variable
 * left is hue itself. That makes this a clean psychophysics task rather than a
 * "spot the different square" puzzle — the same trick real colour-vision
 * screening uses.
 */
const SAT = 72;
const LIGHT = 52;

const swatch = (hue: number) => `hsl(${Math.round(((hue % 360) + 360) % 360)} ${SAT}% ${LIGHT}%)`;

type Mode = "match" | "odd";
type Phase = "idle" | "running" | "over";

const START_DELTA = 26;
const MIN_DELTA = 0.75;
const MAX_DELTA = 34;

const ROUNDS = 12;

function HueHunt() {
  const [mode, setMode] = useState<Mode>("match");
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [delta, setDelta] = useState(START_DELTA);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("slashai.huehunt.best") ?? 0));
  const [narrowest, setNarrowest] = useState<number | null>(null);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);

  /** match mode: [target, distractorA, distractorB] hues; oddIdx is the answer */
  const [board, setBoard] = useState<{ hues: number[]; oddIdx: number; target: number } | null>(
    null,
  );
  const locked = useRef(false);

  /** grid grows as the staircase tightens — more cells, finer gaps */
  const gridSize = useMemo(
    () => (mode === "odd" ? Math.min(6, 2 + Math.floor(round / 4)) : 0),
    [mode, round],
  );

  const build = useCallback((m: Mode, d: number, n: number) => {
    const target = Math.random() * 360;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const off = d * dir;

    if (m === "match") {
      // target, one match, one distractor — the player picks the exact hue
      const hues = [target, target + off, target + 180 + off * 0.6];
      // shuffle so the answer is not always first
      for (let i = hues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [hues[i], hues[j]] = [hues[j]!, hues[i]!];
      }
      const oddIdx = hues.findIndex((h) => Math.abs(h - target) < 0.001);
      setBoard({ hues, oddIdx: oddIdx < 0 ? 0 : oddIdx, target });
      return;
    }

    // odd mode: a grid of near-identical swatches, exactly one is shifted
    const size = Math.min(6, 2 + Math.floor(n / 4));
    const cells = size * size;
    const odd = Math.floor(Math.random() * cells);
    const hues = Array.from({ length: cells }, (_, i) => (i === odd ? target + off : target));
    setBoard({ hues, oddIdx: odd, target });
  }, []);

  const next = useCallback(
    (n: number, d: number) => {
      build(mode, d, n);
      locked.current = false;
    },
    [build, mode],
  );

  /** takes the mode explicitly so a button can switch mode and start in one go */
  const start = useCallback(
    (m: Mode) => {
      setMode(m);
      setRound(0);
      setDelta(START_DELTA);
      setScore(0);
      setNarrowest(null);
      setFlash(null);
      locked.current = false;
      build(m, START_DELTA, 0);
      setPhase("running");
    },
    [build],
  );

  const pick = useCallback(
    (idx: number) => {
      if (phase !== "running" || !board || locked.current) return;
      locked.current = true;
      const correct = idx === board.oddIdx;
      setFlash(correct ? "ok" : "no");

      // staircase: reward accuracy by narrowing the gap, punish guesses by widening it
      const nd = correct ? Math.max(MIN_DELTA, delta * 0.7) : Math.min(MAX_DELTA, delta * 1.6);

      window.setTimeout(() => {
        setFlash(null);
        if (correct) {
          setScore((s) => s + 1);
          setNarrowest((n) => (n === null ? nd : Math.min(n, nd)));
        }
        setDelta(nd);
        setRound((r) => {
          if (r + 1 >= ROUNDS) {
            setPhase("over");
            return r;
          }
          const nextRound = r + 1;
          locked.current = false;
          next(nextRound, nd);
          return nextRound;
        });
      }, 300);
    },
    [board, delta, next, phase],
  );

  useEffect(() => {
    if (phase !== "over") return;
    const pts = score * 100 + Math.round((10 - (narrowest ?? START_DELTA)) * 20);
    if (pts > 0) {
      saveGameBest(`hue-hunt-${mode}`, pts);
      setBest((b) => Math.max(b, pts));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== "running" || !board) return;
      if (e.key === "ArrowLeft" || e.key === "a") {
        e.preventDefault();
        pick(0);
      } else if (e.key === "ArrowRight" || e.key === "d") {
        e.preventDefault();
        pick(mode === "match" ? 1 : board.hues.length - 1);
      } else if (/^[1-9]$/.test(e.key)) {
        const n = Number(e.key) - 1;
        if (mode === "match" ? n < 3 : n < board.hues.length) {
          e.preventDefault();
          pick(n);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [board, mode, phase, pick]);

  return (
    <AppShell title="Hue Hunt">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎨 Hue Hunt</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A colour-discrimination staircase. Brightness and saturation never change — only the hue
          gap shrinks as you get it right, until you find the limit of what your eyes can resolve.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-5">
        {phase === "idle" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-5xl">🌈</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Twelve rounds. Each correct answer shrinks the colour gap by 30%, so the task gets
                harder the better you do. The result is your{" "}
                <b className="text-foreground">just-noticeable difference</b> — the smallest colour
                shift you can reliably spot.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                onClick={() => start("match")}
                className="rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:bg-surface-elevated"
              >
                <span className="block text-[14px] font-bold text-foreground">Hue Match</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                  Three swatches, one is the target. Pick the exact match.
                </span>
              </button>
              <button
                onClick={() => start("odd")}
                className="rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:bg-surface-elevated"
              >
                <span className="block text-[14px] font-bold text-foreground">Odd Swatch</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                  A grid of identical colours. Exactly one is off. The grid grows as you level up.
                </span>
              </button>
            </div>
          </div>
        )}

        {phase === "running" && board && (
          <>
            <div className="flex items-center justify-between text-[13px] font-semibold text-muted-foreground">
              <span>
                Round {round + 1} / {ROUNDS}
              </span>
              <span>
                gap <b className="text-foreground">{delta.toFixed(1)}°</b>
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${((round + 1) / ROUNDS) * 100}%` }}
              />
            </div>

            {mode === "match" ? (
              <>
                <div className="rounded-2xl border border-border bg-surface p-5 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Find this exact hue
                  </p>
                  <div
                    className="mx-auto mt-3 size-28 rounded-2xl border border-border"
                    style={{ background: swatch(board.target) }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {board.hues.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => pick(i)}
                      aria-label={`Option ${i + 1}`}
                      className={`h-24 rounded-2xl border-2 transition-transform active:scale-95 ${
                        flash === "no" && i === board.oddIdx
                          ? "border-emerald-500"
                          : flash === "ok" && i === board.oddIdx
                            ? "border-emerald-500"
                            : "border-transparent hover:border-primary/50"
                      }`}
                      style={{ background: swatch(h) }}
                    >
                      <span className="sr-only">Option {i + 1}</span>
                    </button>
                  ))}
                </div>
                <p className="text-center text-[11px] text-muted-foreground">
                  Press <kbd className="rounded border border-border px-1">1</kbd>–
                  <kbd className="rounded border border-border px-1">3</kbd> to answer
                </p>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <p className="text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Which one is off? · {gridSize}×{gridSize}
                  </p>
                  <div
                    className="mx-auto mt-3 grid max-w-sm gap-1.5"
                    style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
                  >
                    {board.hues.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => pick(i)}
                        aria-label={`Cell ${i + 1}`}
                        className={`aspect-square rounded-lg border-2 transition-transform active:scale-95 ${
                          flash === "no" && i === board.oddIdx
                            ? "border-white"
                            : "border-transparent hover:border-white/40"
                        }`}
                        style={{ background: swatch(h) }}
                      >
                        <span className="sr-only">Cell {i + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-center text-[11px] text-muted-foreground">
                  Use number keys, or <kbd className="rounded border border-border px-1">A</kbd> for
                  the first cell
                </p>
              </>
            )}
          </>
        )}

        {phase === "over" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-[13px] uppercase tracking-widest text-muted-foreground">
                {mode === "match" ? "Hue match" : "Odd swatch"} complete
              </p>
              <p className="mt-2 text-5xl font-black text-foreground">
                {score}
                <span className="text-2xl text-muted-foreground">/{ROUNDS}</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">correct rounds</p>

              <dl className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-2 text-left">
                {[
                  {
                    k: "JND",
                    v: narrowest === null ? "—" : `${narrowest.toFixed(1)}°`,
                  },
                  { k: "Final gap", v: `${delta.toFixed(1)}°` },
                  {
                    k: "Score",
                    v: String(score * 100 + Math.round((10 - (narrowest ?? START_DELTA)) * 20)),
                  },
                  { k: "Best", v: String(Math.max(best, score * 100)) },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="rounded-lg border border-border bg-surface-elevated px-3 py-2"
                  >
                    <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {row.k}
                    </dt>
                    <dd className="text-[14px] font-bold text-foreground">{row.v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mx-auto mt-3 max-w-sm text-[11px] leading-snug text-muted-foreground">
                {narrowest === null
                  ? "No correct answers this run — the staircase never tightened."
                  : narrowest <= 2
                    ? "A sub-2° threshold is genuinely excellent colour discrimination."
                    : narrowest <= 6
                      ? "A tight threshold — most adult eyes sit somewhere around here."
                      : "Plenty of headroom. Run it again and the staircase will start tighter."}
              </p>
            </div>
            <button
              onClick={() => start(mode)}
              className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
            >
              ↻ Run again
            </button>
            <button
              onClick={() => setPhase("idle")}
              className="h-10 w-full rounded-xl border border-border bg-surface text-[13px] font-semibold text-muted-foreground"
            >
              Switch mode
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
