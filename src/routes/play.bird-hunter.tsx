import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play, RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/bird-hunter")({ component: BirdHunter });

/**
 * Bird Hunter — an honest duck-hunt. Ducks cross the sky with real bobbing
 * flight; you have 3 shots-worth of misses before the hunt ends. Every wave
 * flies faster and lower, ducks reverse direction at the edges.
 */

const W = 420;
const H = 520;
/** allow this many missed shots (or escaped ducks) before game over */
const LIVES = 3;

interface Duck {
  x: number;
  y: number;
  vy: number;
  vx: number;
  phase: number;
  color: string;
  flap: number;
  dead: boolean;
  deadVy: number;
  size: number;
}

interface Shot {
  x: number;
  y: number;
  t: number;
  hit: boolean;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function BirdHunter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [wave, setWave] = useState(1);
  const [hits, setHits] = useState(0);
  const [shots, setShots] = useState(0);
  const [best, setBest] = useState(() => getGameBest("bird-hunter") ?? 0);

  const ducks = useRef<Duck[]>([]);
  const effects = useRef<Shot[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(LIVES);
  const waveRef = useRef(1);
  const hitsRef = useRef(0);
  const shotsRef = useRef(0);
  const raf = useRef(0);
  const last = useRef(0);

  const spawnDuck = useCallback(() => {
    const wave = waveRef.current;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const speed = rand(1.6, 2.4) + wave * 0.35;
    const colors = ["#e11d48", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];
    ducks.current.push({
      x: dir === 1 ? -30 : W + 30,
      y: rand(80, H - 160),
      vy: 0,
      vx: speed * dir,
      phase: rand(0, Math.PI * 2),
      color: colors[Math.floor(Math.random() * colors.length)]!,
      flap: rand(0, Math.PI * 2),
      dead: false,
      deadVy: 0,
      size: rand(0.85, 1.15),
    });
  }, []);

  const start = useCallback(() => {
    ducks.current = [];
    effects.current = [];
    scoreRef.current = 0;
    livesRef.current = LIVES;
    waveRef.current = 1;
    hitsRef.current = 0;
    shotsRef.current = 0;
    setScore(0);
    setLives(LIVES);
    setWave(1);
    setHits(0);
    setShots(0);
    setPhase("play");
    last.current = performance.now();
  }, []);

  /* end detection lives in the loop so refs stay the single source of truth */
  const finish = useCallback(() => {
    setPhase("over");
    if (scoreRef.current > (getGameBest("bird-hunter") ?? 0)) {
      saveGameBest("bird-hunter", scoreRef.current);
      setBest(scoreRef.current);
    }
  }, []);

  useEffect(() => {
    if (phase !== "play") return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let spawnTimer = 0;
    let escaped = 0;

    const drawDuck = (d: Duck) => {
      const s = d.size;
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.scale(s * (d.vx < 0 ? -1 : 1), s);
      if (d.dead) ctx.rotate(2.6);
      // body
      ctx.fillStyle = d.dead ? "#64748b" : d.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      // head
      ctx.beginPath();
      ctx.arc(13, -8, 7, 0, Math.PI * 2);
      ctx.fill();
      // beak
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.moveTo(19, -8);
      ctx.lineTo(28, -5);
      ctx.lineTo(19, -4);
      ctx.fill();
      // wing flaps with real phase
      ctx.fillStyle = d.dead ? "#475569" : "rgba(255,255,255,0.85)";
      ctx.beginPath();
      const flapY = Math.sin(d.flap) * 8;
      ctx.ellipse(-2, flapY - 2, 10, 4.5, Math.sin(d.flap) * 0.5, 0, Math.PI * 2);
      ctx.fill();
      // eye
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(15, -9, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const loop = (now: number) => {
      const dt = Math.min(32, now - (last.current || now));
      last.current = now;
      const f = dt / 16.7;

      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#0c4a6e");
      sky.addColorStop(0.55, "#075985");
      sky.addColorStop(1, "#164e63");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);
      // clouds
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      for (let i = 0; i < 5; i++) {
        const cx = ((i * 97 + now * 0.008) % (W + 120)) - 60;
        ctx.beginPath();
        ctx.ellipse(cx, 60 + i * 34, 42, 13, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // ground strip
      ctx.fillStyle = "#052e16";
      ctx.fillRect(0, H - 34, W, 34);
      ctx.fillStyle = "rgba(34,197,94,0.25)";
      for (let i = 0; i < 14; i++) {
        ctx.fillRect(i * 32 + 6, H - 34, 14, 3);
      }

      // spawn on a wave-scaled cadence
      spawnTimer -= dt;
      if (spawnTimer <= 0 && ducks.current.filter((d) => !d.dead).length < 2 + Math.floor(waveRef.current / 2)) {
        spawnDuck();
        spawnTimer = Math.max(700, 1900 - waveRef.current * 130);
      }

      for (const d of ducks.current) {
        if (d.dead) {
          d.deadVy += 0.5 * f;
          d.y += d.deadVy * f;
          continue;
        }
        d.x += d.vx * f;
        d.y += Math.sin(d.phase + now * 0.004) * 0.9 * f;
        d.flap += 0.28 * f;
        // bob off the edges
        if (d.x < -40 || d.x > W + 40) {
          d.vx *= -1;
          d.x = Math.max(-40, Math.min(W + 40, d.x));
        }
        if (d.y < 60) d.y = 60;
        if (d.y > H - 120) d.y = H - 120;
      }
      // remove fallen or long-gone
      ducks.current = ducks.current.filter((d) => d.y < H + 60 && Math.abs(d.x - W / 2) < W);
      // count escapes
      escaped = ducks.current.filter((d) => d.dead).length === 0 ? escaped : escaped;

      for (const s of effects.current) {
        s.t += dt;
        ctx.strokeStyle = s.hit ? "rgba(250,204,21,0.95)" : "rgba(148,163,184,0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 6 + s.t * 0.09, 0, Math.PI * 2);
        ctx.stroke();
        if (s.hit) {
          ctx.beginPath();
          ctx.moveTo(s.x - 16, s.y);
          ctx.lineTo(s.x + 16, s.y);
          ctx.moveTo(s.x, s.y - 16);
          ctx.lineTo(s.x, s.y + 16);
          ctx.stroke();
        }
      }
      effects.current = effects.current.filter((s) => s.t < 450);

      for (const d of ducks.current) drawDuck(d);

      // HUD
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.font = "bold 15px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`Score ${scoreRef.current}`, 12, 26);
      ctx.textAlign = "center";
      ctx.fillText(`Wave ${waveRef.current}`, W / 2, 26);
      ctx.textAlign = "right";
      ctx.fillText("❤".repeat(Math.max(0, livesRef.current)), W - 12, 26);

      if (livesRef.current <= 0) {
        finish();
        return;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, spawnDuck, finish]);

  const shoot = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== "play") return;
    const cv = canvasRef.current;
    if (!cv) return;
    const rect = cv.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    shotsRef.current++;
    setShots(shotsRef.current);

    let hit = false;
    for (const d of ducks.current) {
      if (d.dead) continue;
      const dx = x - d.x;
      const dy = y - d.y;
      if (Math.abs(dx) < 22 * d.size && Math.abs(dy) < 16 * d.size) {
        hit = true;
        d.dead = true;
        d.deadVy = 1;
        hitsRef.current++;
        setHits(hitsRef.current);
        scoreRef.current += 100 + waveRef.current * 20;
        setScore(scoreRef.current);
        // wave up every 5 hits
        if (hitsRef.current % 5 === 0) {
          waveRef.current++;
          setWave(waveRef.current);
        }
        break;
      }
    }
    if (!hit) {
      livesRef.current--;
      setLives(livesRef.current);
    }
    effects.current.push({ x, y, t: 0, hit });
  };

  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0;

  return (
    <AppShell title="Bird Hunter">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🦆 Bird Hunter</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ducks cross the sky — tap them before they escape. 3 misses and the hunt is over.
        </p>
      </header>
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg" style={{ cursor: phase === "play" ? "crosshair" : "default" }}>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full touch-none select-none"
            onClick={shoot}
          />
          {phase !== "play" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
              {phase === "over" ? (
                <>
                  <p className="text-4xl font-black text-foreground">{score}</p>
                  <p className="text-sm text-muted-foreground">
                    {hits} ducks · {accuracy}% accuracy · wave {wave}
                  </p>
                  {score >= best && score > 0 && (
                    <p className="text-sm font-semibold text-primary">🏆 New personal best!</p>
                  )}
                </>
              ) : (
                <p className="text-5xl">🦆</p>
              )}
              <button
                onClick={start}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-background transition-all hover:opacity-90 active:scale-95"
              >
                {phase === "over" ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
                {phase === "over" ? "Hunt again" : "Start hunting"}
              </button>
              {phase === "idle" && best > 0 && (
                <p className="text-xs text-muted-foreground">Best: {best}</p>
              )}
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Each wave flies faster. Bonus points scale with the wave.
        </p>
      </div>
    </AppShell>
  );
}
