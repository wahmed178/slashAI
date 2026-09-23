import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play, RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/cricket-bowling")({ component: CricketBowling });

/**
 * Cricket Bowling — doodle-style timing game from the bowler's end, inspired
 * by the Google-doodle cricket. A moving power/timing marker sweeps the
 * delivery arc: tap to release. Too early = short and wide, too late =
 * full toss; the sweet spot beats the batter. 10 overs per innings (6 balls
 * each), you bowl until 10 wickets fall or the overs run out.
 */

const W = 400;
const H = 520;

type Phase = "idle" | "aim" | "flying" | "result" | "over";

interface Outcome {
  kind: "wicket" | "dot" | "single" | "boundary" | "six" | "wide";
  text: string;
  runs: number;
}

const BALLS_PER_OVER = 6;
const TOTAL_BALLS = 30;

function CricketBowling() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [best, setBest] = useState(() => getGameBest("cricket-bowling") ?? 0);
  const [flash, setFlash] = useState<Outcome | null>(null);

  const marker = useRef(-1); // sweep position, -1..1
  const dir = useRef(1);
  const speed = useRef(1);
  const ball = useRef({ x: 200, y: 90, t: 0, flying: false, targetX: 200 });
  const totals = useRef({ runs: 0, wickets: 0, balls: 0 });
  const raf = useRef(0);
  const last = useRef(0);
  const settled = useRef(false);

  const bestWickets = useCallback(() => getGameBest("cricket-bowling") ?? 0, []);

  const start = useCallback(() => {
    totals.current = { runs: 0, wickets: 0, balls: 0 };
    setRuns(0);
    setWickets(0);
    setBalls(0);
    marker.current = -1;
    dir.current = 1;
    speed.current = 1;
    ball.current = { x: 200, y: 90, t: 0, flying: false, targetX: 200 };
    setFlash(null);
    setPhase("aim");
    last.current = performance.now();
  }, []);

  const finish = useCallback(() => {
    setPhase("over");
    if (totals.current.wickets > bestWickets()) {
      saveGameBest("cricket-bowling", totals.current.wickets);
      setBest(totals.current.wickets);
    }
  }, [bestWickets]);

  /** release the ball — quality judged from marker distance from centre */
  const release = useCallback(() => {
    if (phase !== "aim") return;
    const m = marker.current;
    ball.current.flying = true;
    ball.current.t = 0;
    // wide line drifts with bad timing
    ball.current.targetX = 200 + m * 130;
    setPhase("flying");
  }, [phase]);

  const resolve = useCallback(() => {
    const m = marker.current;
    const accuracy = 1 - Math.min(1, Math.abs(m)); // 1 = perfect
    let out: Outcome;
    if (accuracy > 0.86) {
      out = { kind: "wicket", text: "BOWLED! 🎉", runs: 0 };
    } else if (accuracy > 0.55) {
      const dot = Math.random() < 0.5;
      out = dot ? { kind: "dot", text: "Defended — dot ball", runs: 0 } : { kind: "single", text: "1 run", runs: 1 };
    } else if (accuracy > 0.3) {
      const r = Math.random() < 0.35 ? 4 : Math.random() < 0.5 ? 1 : 2;
      out = { kind: r === 4 ? "boundary" : "single", text: r === 4 ? "FOUR — cracked away" : `${r} runs`, runs: r };
    } else {
      // loose delivery
      const r = Math.random() < 0.25 ? 6 : 4;
      out = { kind: r === 6 ? "six" : "boundary", text: r === 6 ? "SIX — smashed!" : "FOUR — punished", runs: r };
    }
    totals.current.runs += out.runs;
    totals.current.balls += 1;
    if (out.kind === "wicket") totals.current.wickets += 1;
    setRuns(totals.current.runs);
    setBalls(totals.current.balls);
    setWickets(totals.current.wickets);
    setFlash(out);
    speed.current = Math.min(2.2, 1 + totals.current.wickets * 0.14);
    settled.current = true;
    if (totals.current.balls >= TOTAL_BALLS || totals.current.wickets >= 10) {
      finish();
    } else {
      setPhase("result");
    }
  }, [finish]);

  useEffect(() => {
    if (phase === "idle" || phase === "over") return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const loop = (now: number) => {
      const dt = Math.min(32, now - (last.current || now));
      last.current = now;
      const f = dt / 16.7;

      // ground
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#14532d");
      g.addColorStop(0.35, "#166534");
      g.addColorStop(1, "#15803d");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // pitch
      ctx.fillStyle = "#d2b48c";
      ctx.beginPath();
      ctx.moveTo(170, 60);
      ctx.lineTo(230, 60);
      ctx.lineTo(268, H - 40);
      ctx.lineTo(132, H - 40);
      ctx.fill();
      // crease
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.beginPath();
      ctx.moveTo(140, H - 60);
      ctx.lineTo(260, H - 60);
      ctx.stroke();
      // stumps (batter's end)
      ctx.fillStyle = "#f5f5f4";
      for (let i = 0; i < 3; i++) ctx.fillRect(188 + i * 10, 52, 4, 26);
      // bails
      ctx.fillRect(188, 50, 24, 3);

      // bowler (bottom, from behind)
      ctx.fillStyle = "#1e3a8a";
      ctx.beginPath();
      ctx.arc(200, H - 26, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(186, H - 16, 28, 14);

      // timing arc — the doodle's signature meter
      if (phase === "aim" || phase === "flying" || phase === "result") {
        const cy = 140;
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(200, cy + 60, 150, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        // sweet zone
        ctx.strokeStyle = "rgba(74,222,128,0.85)";
        ctx.beginPath();
        ctx.arc(200, cy + 60, 150, Math.PI * 1.42, Math.PI * 1.58);
        ctx.stroke();
        // marker
        if (phase === "aim") {
          marker.current += dir.current * 0.026 * speed.current * f;
          if (marker.current > 1) {
            marker.current = 1;
            dir.current = -1;
          }
          if (marker.current < -1) {
            marker.current = -1;
            dir.current = 1;
          }
        }
        const ang = Math.PI * 1.5 + marker.current * Math.PI * 0.35;
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(200, cy + 60);
        ctx.lineTo(200 + Math.cos(ang) * 150, cy + 60 + Math.sin(ang) * 150);
        ctx.stroke();
      }

      // flying ball
      const b = ball.current;
      if (b.flying) {
        b.t += f;
        const prog = Math.min(1, b.t / 34);
        b.x = 200 + (b.targetX - 200) * prog;
        b.y = 90 + (H - 80 - 90) * prog;
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.arc(b.x, b.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 7, 0.4, 2.2);
        ctx.stroke();
        if (prog >= 1) resolve();
      } else {
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.arc(200, H - 52, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // result flash
      if (phase === "result" && flash) {
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, H / 2 - 44, W, 88);
        ctx.fillStyle = flash.kind === "wicket" ? "#4ade80" : flash.runs >= 4 ? "#f87171" : "#ffffff";
        ctx.font = "bold 26px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(flash.text, W / 2, H / 2 + 8);
      }

      // scoreboard
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.font = "bold 15px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`${runs}/${wickets}`, 12, 26);
      ctx.textAlign = "right";
      const ov = `${Math.floor(balls / 6)}.${balls % 6}`;
      ctx.fillText(`${ov} / 5.0 overs`, W - 12, 26);

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, flash, resolve, runs, wickets, balls]);

  const next = () => {
    ball.current = { x: 200, y: 90, t: 0, flying: false, targetX: 200 };
    marker.current = -1;
    dir.current = Math.random() < 0.5 ? 1 : -1;
    setFlash(null);
    settled.current = false;
    setPhase("aim");
  };

  return (
    <AppShell title="Cricket Bowling">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎳 Cricket Bowling</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Doodle-style bowling: stop the marker in the green zone to beat the batter. 5 overs, 10 wickets.
        </p>
      </header>
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full touch-none select-none"
            onClick={() => (phase === "aim" ? release() : undefined)}
          />
          {phase === "result" && (
            <button
              onClick={next}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-primary px-6 py-2.5 font-semibold text-background active:scale-95"
            >
              Next ball
            </button>
          )}
          {(phase === "idle" || phase === "over") && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
              {phase === "over" ? (
                <>
                  <p className="text-4xl font-black text-foreground">{wickets} wickets</p>
                  <p className="text-sm text-muted-foreground">{runs} conceded in 5 overs</p>
                  {wickets >= best && wickets > 0 && <p className="text-sm font-semibold text-primary">🏆 Best spell!</p>}
                </>
              ) : (
                <p className="text-5xl">🏏</p>
              )}
              <button
                onClick={start}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-background transition-all hover:opacity-90 active:scale-95"
              >
                {phase === "over" ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
                {phase === "over" ? "Bowl again" : "Start bowling"}
              </button>
              {phase === "idle" && best > 0 && <p className="text-xs text-muted-foreground">Best: {best} wickets</p>}
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">Tap at the top of the arc. Perfect = bowled. Loose = boundary.</p>
      </div>
    </AppShell>
  );
}
