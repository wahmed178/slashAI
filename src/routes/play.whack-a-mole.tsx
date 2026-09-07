import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/whack-a-mole")({ component: WhackAMole });

const GAME_SECONDS = 30;
const HOLES = 9;

function loadBest(): number {
  try {
    return Number(localStorage.getItem("play-whack-best") ?? 0) || 0;
  } catch {
    return 0;
  }
}

function randomHole(exclude: number | null) {
  let n = Math.floor(Math.random() * HOLES);
  if (n === exclude) n = (n + 1 + Math.floor(Math.random() * (HOLES - 1))) % HOLES;
  return n;
}

function WhackAMole() {
  const [playing, setPlaying] = useState(false);
  const [mole, setMole] = useState<number | null>(null);
  const [hit, setHit] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [best, setBest] = useState(loadBest);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  // timer + mole spawner
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    let moleTimer = 0;
    const spawn = () => {
      setMole((m) => randomHole(m));
      const speed = Math.max(420, 780 - scoreRef.current * 12);
      moleTimer = window.setTimeout(spawn, speed);
    };
    moleTimer = window.setTimeout(spawn, 600);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(moleTimer);
    };
  }, [playing]);

  // end the run when the clock hits zero
  useEffect(() => {
    if (playing && timeLeft === 0) {
      setPlaying(false);
      setMole(null);
    }
  }, [playing, timeLeft]);

  // save best when the run ends
  useEffect(() => {
    if (playing || score === 0) return;
    setBest((b) => {
      if (score > b) {
        try {
          localStorage.setItem("play-whack-best", String(score));
        } catch {
          /* storage unavailable */
        }
        return score;
      }
      return b;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  function start() {
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setMole(null);
    setPlaying(true);
  }

  function whack(i: number) {
    if (!playing || mole !== i) return;
    setScore((s) => s + 1);
    setHit(i);
    window.setTimeout(() => setHit((h) => (h === i ? null : h)), 220);
    setMole(randomHole(i));
  }

  return (
    <AppShell title="Whack-a-Mole">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔨 Whack-a-Mole</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {GAME_SECONDS} seconds, nine holes, one hammer. Every whack makes them quicker.
        </p>
      </header>

      <div className="mx-auto max-w-xs space-y-3">
        <div className="flex items-center justify-around rounded-xl border border-border bg-surface py-2.5 text-center">
          <div>
            <p className="text-[17px] font-bold text-foreground">{score}</p>
            <p className="text-[10px] text-muted-foreground">Whacks</p>
          </div>
          <div>
            <p className={`text-[17px] font-bold ${playing && timeLeft <= 5 ? "text-[#f87171]" : "text-foreground"}`}>
              {timeLeft}
            </p>
            <p className="text-[10px] text-muted-foreground">Seconds</p>
          </div>
          <div>
            <p className="text-[17px] font-bold text-primary">{best}</p>
            <p className="text-[10px] text-muted-foreground">Best</p>
          </div>
        </div>

        <div className="relative">
          <div className="grid aspect-square grid-cols-3 gap-2.5">
            {Array.from({ length: HOLES }, (_, i) => (
              <button
                key={i}
                onClick={() => whack(i)}
                className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-[#141a22] transition-colors active:bg-[#1a222c]"
              >
                <span className="absolute bottom-2 size-[72%] rounded-[50%] bg-black/50" />
                <span
                  className={`relative text-[38px] transition-transform duration-100 ${
                    hit === i ? "scale-75" : mole === i ? "translate-y-0" : "translate-y-[130%]"
                  }`}
                >
                  {hit === i ? "💥" : "🐹"}
                </span>
              </button>
            ))}
          </div>
          {!playing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/65">
              {score > 0 && (
                <p className="text-[13px] text-muted-foreground">
                  Time! {score} whacks - best {best}
                </p>
              )}
              <button onClick={start} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                {score > 0 ? "Play again" : "Start game"}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Only whack real moles - empty holes do nothing. The pace ramps up as your score climbs.
        </p>
      </div>
    </AppShell>
  );
}
