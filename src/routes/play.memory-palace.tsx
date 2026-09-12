import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/memory-palace")({ component: MemoryPalace });

/**
 * Memory Palace - a real spatial-memory trainer.
 * Items are "placed" into rooms of a palace (a grid). Study the placement,
 * then walk the palace and recall which item sat in each room.
 * Levels add rooms and shrink study time - the classic method-of-loci workout.
 */

const ITEMS = [
  "🍎", "🔑", "🕯️", "🎩", "🐙", "🎺", "🧊", "⏰", "🪑", "🌵",
  "🧀", "🪁", "💎", "🎈", "🦊", "📚", "⚽", "🍉", "🔔", "🧦",
];

const ROOM_LABELS = ["Hall", "Kitchen", "Library", "Garden", "Attic", "Cellar", "Studio", "Porch", "Den"];

interface Level {
  rooms: number; // grid size: rooms x rooms
  items: number; // how many items are placed
  studyMs: number; // study time
}

function levelFor(lvl: number): Level {
  // gentle ramp: 2x2 → 3x3 → 4x4, faster study each level
  if (lvl <= 2) return { rooms: 2, items: 2 + (lvl - 1), studyMs: 6000 };
  if (lvl <= 5) return { rooms: 3, items: 2 + lvl, studyMs: 6500 - lvl * 400 };
  return { rooms: 4, items: 3 + lvl, studyMs: 7000 - lvl * 350 };
}

type Phase = "idle" | "study" | "recall" | "result";

function MemoryPalace() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [best, setBest] = useState(() => Number(localStorage.getItem("slashai.palace.best") ?? 0));
  const [placements, setPlacements] = useState<Map<number, string>>(new Map());
  const [answers, setAnswers] = useState<Map<number, string>>(new Map());
  const [reveal, setReveal] = useState<Map<number, boolean>>(new Map());
  const [studyLeft, setStudyLeft] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const timerRef = useRef<number | null>(null);

  const cfg = levelFor(level);

  // study countdown
  useEffect(() => {
    if (phase !== "study") return;
    setStudyLeft(cfg.studyMs);
    const started = Date.now();
    timerRef.current = window.setInterval(() => {
      const left = cfg.studyMs - (Date.now() - started);
      if (left <= 0) {
        window.clearInterval(timerRef.current!);
        setPhase("recall");
      } else {
        setStudyLeft(left);
      }
    }, 100);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase, level]);

  const startLevel = (lvl: number) => {
    const c = levelFor(lvl);
    const cells = c.rooms * c.rooms;
    const chosen = [...Array(cells).keys()].sort(() => Math.random() - 0.5).slice(0, c.items);
    const picked = [...ITEMS].sort(() => Math.random() - 0.5).slice(0, c.items);
    const map = new Map<number, string>();
    chosen.forEach((cell, i) => map.set(cell, picked[i]!));
    setPlacements(map);
    setAnswers(new Map());
    setReveal(new Map());
    setWrongCount(0);
    setLevel(lvl);
    setPhase("study");
  };

  const start = () => startLevel(1);

  const tapRoom = (cell: number) => {
    if (phase !== "recall") return;
    const correct = placements.get(cell);
    if (!correct) return; // empty rooms are not part of the palace walk

    if (answers.has(cell)) return; // already answered this room
    const next = new Map(answers);
    next.set(cell, correct);
    setAnswers(next);
    // mark this room's answer as correct/incorrect for instant feedback
    const rv = new Map(reveal);
    rv.set(cell, true);
    setReveal(rv);
  };

  // when every item room is answered, show the result
  useEffect(() => {
    if (phase !== "recall") return;
    if (answers.size < placements.size) return;
    let wrong = 0;
    for (const [cell, item] of placements) {
      if (answers.get(cell) !== item) wrong++;
    }
    setWrongCount(wrong);
    if (wrong === 0) {
      const newBest = Math.max(best, level);
      setBest(newBest);
      localStorage.setItem("slashai.palace.best", String(newBest));
    }
    setPhase("result");
  }, [answers]);

  return (
    <AppShell title="Memory Palace">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏛️ Memory Palace</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Items appear in rooms. Memorise where everything sits, then walk the palace and place each item back.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-5">
        {phase === "idle" && (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <p className="text-5xl">🏛️</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Pros of ancient orators used places to remember speeches.<br />
                Study each level's rooms, then recall every item's room.<br />
                Each level: more rooms, less time.
              </p>
              {best > 0 && <p className="mt-2 text-[13px] font-semibold text-primary">Best: level {best}</p>}
            </div>
            <button onClick={start} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              ▶ Enter the palace
            </button>
          </div>
        )}

        {(phase === "study" || phase === "recall") && (
          <>
            <div className="flex items-center justify-between text-[13px] font-semibold">
              <span className="text-muted-foreground">
                Level <b className="text-foreground">{level}</b> · {placements.size} items
              </span>
              {phase === "study" ? (
                <span className="text-amber-400">👁 Memorise… {Math.ceil(studyLeft / 1000)}s</span>
              ) : (
                <span className="text-primary">
                  🧠 Recall: {answers.size}/{placements.size}
                </span>
              )}
            </div>

            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${cfg.rooms}, minmax(0, 1fr))` }}
            >
              {[...Array(cfg.rooms * cfg.rooms).keys()].map((cell) => {
                const revealed = phase === "recall" && answers.has(cell);
                const correct = reveal.get(cell) ?? false;
                const empty = !placements.has(cell);
                return (
                  <button
                    key={cell}
                    onClick={() => tapRoom(cell)}
                    disabled={phase === "study" || empty || (phase === "recall" && answers.has(cell))}
                    className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border text-center transition-all duration-150 ${
                      phase === "study" && placements.has(cell)
                        ? "border-primary/50 bg-primary/10"
                        : revealed
                          ? correct
                            ? placements.get(cell) === answers.get(cell)
                              ? "border-emerald-500/60 bg-emerald-500/10"
                              : "border-red-500/60 bg-red-500/10"
                            : "border-border bg-surface"
                          : "border-border bg-surface hover:border-primary/40 active:scale-95"
                    }`}
                  >
                    {phase === "study" ? (
                      placements.has(cell) ? (
                        <>
                          <span className="text-[24px]">{placements.get(cell)}</span>
                          <span className="text-[9px] text-muted-foreground">{ROOM_LABELS[cell % ROOM_LABELS.length]}</span>
                        </>
                      ) : (
                        <span className="text-[18px] opacity-25">🚪</span>
                      )
                    ) : revealed ? (
                      <>
                        <span className="text-[22px]">{answers.get(cell)}</span>
                        <span className={`text-[9px] font-bold ${placements.get(cell) === answers.get(cell) ? "text-emerald-400" : "text-red-400"}`}>
                          {placements.get(cell) === answers.get(cell) ? "✓" : `was ${placements.get(cell)}`}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[18px] opacity-40">🚪</span>
                        <span className="text-[9px] text-muted-foreground">{ROOM_LABELS[cell % ROOM_LABELS.length]}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {phase === "recall" && (
              <p className="text-center text-[12px] text-muted-foreground">
                Tap each room that held an item - the marked ones from study time.
              </p>
            )}
          </>
        )}

        {phase === "result" && (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-border bg-surface p-8">
              {wrongCount === 0 ? (
                <>
                  <p className="text-5xl">🏆</p>
                  <p className="mt-2 text-lg font-bold text-foreground">Perfect recall!</p>
                  <p className="mt-1 text-sm text-muted-foreground">Level {level} cleared - the palace grows.</p>
                </>
              ) : (
                <>
                  <p className="text-5xl">🧠</p>
                  <p className="mt-2 text-lg font-bold text-foreground">
                    {placements.size - wrongCount}/{placements.size} rooms right
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {wrongCount === 1 ? "One item slipped a room." : `${wrongCount} items slipped rooms.`}
                  </p>
                </>
              )}
              {best > 0 && <p className="mt-2 text-[13px] font-semibold text-primary">Best: level {best}</p>}
            </div>
            {wrongCount === 0 ? (
              <button onClick={() => startLevel(level + 1)} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                ▶ Level {level + 1}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => startLevel(level)} className="h-12 rounded-xl border border-border bg-surface text-sm font-bold text-foreground">
                  ↻ Retry level {level}
                </button>
                <button onClick={() => startLevel(Math.max(1, level - 1))} className="h-12 rounded-xl border border-border bg-surface text-sm font-bold text-muted-foreground">
                  ↓ Easier
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
