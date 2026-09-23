import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play, RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/bubbles-shooter")({ component: BubblesShooter });

/**
 * Bubbles Shooter — the real match-3 bubble-popper. Aim, shoot, clusters of
 * 3+ same-colour pop and everything not attached to the ceiling falls.
 * Rows creep down; reach the bottom line and it's over.
 */

const COLS = 11;
const R = 17;
const W = COLS * R * 2;
const H = 560;
const COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];
const PALETTE = 4; // colours in play

interface Cell {
  c: number;
}
type Grid = (Cell | null)[][];

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  c: number;
}

/** row r's bubbles sit offset when the row is odd */
const rowOffset = (r: number) => (r % 2 === 1 ? R : 0);

function newGrid(rows: number): Grid {
  const g: Grid = [];
  for (let r = 0; r < rows; r++) {
    const row: (Cell | null)[] = [];
    const n = COLS - (r % 2 === 1 ? 1 : 0);
    for (let c = 0; c < n; c++) row.push({ c: Math.floor(Math.random() * PALETTE) });
    g.push(row);
  }
  return g;
}

function BubblesShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getGameBest("bubbles-shooter") ?? 0);

  const grid = useRef<Grid>([]);
  const current = useRef<Ball | null>(null);
  const nextC = useRef(0);
  const scoreRef = useRef(0);
  const rowDrops = useRef(0);
  const raf = useRef(0);
  const flying = useRef(false);
  const aimAngle = useRef(-Math.PI / 2);
  const mousePos = useRef<{ x: number; y: number } | null>(null);

  const start = useCallback(() => {
    grid.current = newGrid(5);
    scoreRef.current = 0;
    rowDrops.current = 0;
    flying.current = false;
    nextC.current = Math.floor(Math.random() * PALETTE);
    current.current = { x: W / 2, y: H - 40, vx: 0, vy: 0, c: Math.floor(Math.random() * PALETTE) };
    setScore(0);
    setPhase("play");
  }, []);

  const finish = useCallback(() => {
    setPhase("over");
    if (scoreRef.current > (getGameBest("bubbles-shooter") ?? 0)) {
      saveGameBest("bubbles-shooter", scoreRef.current);
      setBest(scoreRef.current);
    }
  }, []);

  /** neighbours in the hex layout (odd rows shifted right) */
  const neighbors = (g: Grid, r: number, c: number): [number, number][] => {
    const odd = r % 2 === 1;
    const deltas: [number, number][] = odd
      ? [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
      : [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];
    const out: [number, number][] = [];
    for (const [dr, dc] of deltas) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < g.length && g[nr] && nc >= 0 && nc < g[nr]!.length && g[nr]![nc]) out.push([nr, nc]);
    }
    return out;
  };

  /** shoot: resolve landing cell, pop cluster ≥ 3, drop floaters */
  const shoot = useCallback(() => {
    const ball = current.current;
    if (!ball || flying.current) return;
    flying.current = true;
    const speed = 11;
    ball.vx = Math.cos(aimAngle.current) * speed;
    ball.vy = Math.sin(aimAngle.current) * speed;
  }, []);

  const resolveLanding = useCallback(
    (x: number, y: number, c: number) => {
      const g = grid.current;
      // find the nearest empty cell to the landing point
      let br = 0;
      let bc = 0;
      let bd = Infinity;
      for (let r = 0; r < g.length + 6; r++) {
        if (!g[r]) g[r] = [];
        const n = COLS - (r % 2 === 1 ? 1 : 0);
        for (let cc = 0; cc < n; cc++) {
          if (g[r]![cc]) continue;
          const cx = cc * R * 2 + R + rowOffset(r);
          const cy = r * R * 1.74 + R + 8;
          const d = (cx - x) ** 2 + (cy - y) ** 2;
          if (d < bd) {
            bd = d;
            br = r;
            bc = cc;
          }
        }
      }
      while (g.length <= br) g.push([]);
      const n = COLS - (br % 2 === 1 ? 1 : 0);
      while (g[br]!.length < n) g[br]!.push(null);
      g[br]![bc] = { c };

      // flood-fill same-colour cluster
      const cluster: [number, number][] = [];
      const seen = new Set<string>();
      const stack: [number, number][] = [[br, bc]];
      while (stack.length) {
        const [r, cc] = stack.pop()!;
        const key = `${r},${cc}`;
        if (seen.has(key)) continue;
        seen.add(key);
        if (!g[r]?.[cc] || g[r]![cc]!.c !== c) continue;
        cluster.push([r, cc]);
        for (const [nr, nc] of neighbors(g, r, cc)) stack.push([nr, nc]);
      }

      if (cluster.length >= 3) {
        for (const [r, cc] of cluster) g[r]![cc] = null;
        scoreRef.current += cluster.length * 10 * cluster.length > 60 ? cluster.length * 10 + 50 : cluster.length * 10;
        setScore(scoreRef.current);
        // drop anything no longer connected to row 0
        const attached = new Set<string>();
        const walk = (r: number, cc: number) => {
          const key = `${r},${cc}`;
          if (attached.has(key)) return;
          attached.add(key);
          for (const [nr, nc] of neighbors(g, r, cc)) if (g[nr]?.[nc]) walk(nr, nc);
        };
        for (let cc = 0; cc < (g[0]?.length ?? 0); cc++) if (g[0]?.[cc]) walk(0, cc);
        let dropped = 0;
        for (let r = 0; r < g.length; r++) {
          for (let cc = 0; cc < g[r]!.length; cc++) {
            if (g[r]![cc] && !attached.has(`${r},${cc}`)) {
              g[r]![cc] = null;
              dropped++;
            }
          }
        }
        if (dropped > 0) {
          scoreRef.current += dropped * 20;
          setScore(scoreRef.current);
        }
      }

      // ceiling creeps down every 2 shots
      rowDrops.current++;
      if (rowDrops.current % 2 === 0) {
        g.unshift(new Array(COLS).fill(null).map(() => ({ c: Math.floor(Math.random() * PALETTE) })));
        // keep odd-row invariants: trim to length
        for (let r = 0; r < g.length; r++) {
          const n = COLS - (r % 2 === 1 ? 1 : 0);
          g[r] = g[r]!.slice(0, n);
          while (g[r]!.length < n) g[r]!.push(null);
        }
      }

      // lose check: any bubble below the line
      const limitY = H - 110;
      for (let r = 0; r < g.length; r++) {
        const cy = r * R * 1.74 + R + 8;
        if (cy > limitY && g[r]!.some(Boolean)) {
          finish();
          return;
        }
      }
      flying.current = false;
      current.current = { x: W / 2, y: H - 40, vx: 0, vy: 0, c: nextC.current };
      nextC.current = Math.floor(Math.random() * PALETTE);
    },
    [finish],
  );

  useEffect(() => {
    if (phase !== "play") return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const drawBubble = (x: number, y: number, c: number, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = COLORS[c % COLORS.length]!;
      ctx.beginPath();
      ctx.arc(x, y, R - 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(x - R * 0.3, y - R * 0.3, R * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);

      const g = grid.current;
      for (let r = 0; r < g.length; r++) {
        const cy = r * R * 1.74 + R + 8;
        for (let c = 0; c < g[r]!.length; c++) {
          const cell = g[r]![c];
          if (cell) drawBubble(c * R * 2 + R + rowOffset(r), cy, cell.c);
        }
      }

      // danger line
      ctx.strokeStyle = "rgba(239,68,68,0.5)";
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, H - 110);
      ctx.lineTo(W, H - 110);
      ctx.stroke();
      ctx.setLineDash([]);

      const ball = current.current;
      if (ball) {
        if (flying.current) {
          ball.x += ball.vx;
          ball.y += ball.vy;
          if (ball.x < R) {
            ball.x = R;
            ball.vx *= -1;
          }
          if (ball.x > W - R) {
            ball.x = W - R;
            ball.vx *= -1;
          }
          // ceiling or contact with the stack
          let landed = ball.y <= R + 8;
          for (let r = 0; r < g.length && !landed; r++) {
            const cy = r * R * 1.74 + R + 8;
            for (let c = 0; c < g[r]!.length; c++) {
              if (!g[r]![c]) continue;
              const cx = c * R * 2 + R + rowOffset(r);
              if ((cx - ball.x) ** 2 + (cy - ball.y) ** 2 < (R * 2 - 2) ** 2) {
                landed = true;
                break;
              }
            }
          }
          if (landed) {
            resolveLanding(ball.x, ball.y, ball.c);
          } else if (ball.y > H) {
            flying.current = false;
            current.current = { x: W / 2, y: H - 40, vx: 0, vy: 0, c: nextC.current };
            nextC.current = Math.floor(Math.random() * PALETTE);
          }
        }
        drawBubble(ball.x, ball.y, ball.c);
      }

      // next-up bubble + cannon
      ctx.strokeStyle = "rgba(148,163,184,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2, H - 40);
      ctx.lineTo(W / 2 + Math.cos(aimAngle.current) * 34, H - 40 + Math.sin(aimAngle.current) * 34);
      ctx.stroke();
      drawBubble(W / 2 - 44, H - 24, nextC.current, 0.55);

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, resolveLanding]);

  const aim = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (phase !== "play") return;
    const cv = canvasRef.current;
    if (!cv) return;
    const rect = cv.getBoundingClientRect();
    const p = "touches" in e ? e.touches[0] : e;
    if (!p) return;
    const x = ((p.clientX - rect.left) / rect.width) * W;
    const y = ((p.clientY - rect.top) / rect.height) * H;
    mousePos.current = { x, y };
    aimAngle.current = Math.atan2(y - (H - 40), x - W / 2);
    // never aim straight down
    if (aimAngle.current > -0.12) aimAngle.current = -0.12;
    if (aimAngle.current < -Math.PI + 0.12) aimAngle.current = -Math.PI + 0.12;
  };

  const tap = (e: React.TouchEvent<HTMLCanvasElement>) => {
    aim(e);
    shoot();
  };

  return (
    <AppShell title="Bubbles Shooter">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🫧 Bubbles Shooter</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Match 3+ of a colour to pop. Unattached bubbles fall. The ceiling creeps every 2 shots.
        </p>
      </header>
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between px-1 pb-2 text-sm">
          <span className="font-bold text-foreground">{score}</span>
          <span className="text-muted-foreground">Best {best}</span>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full touch-none select-none"
            onMouseMove={aim}
            onClick={shoot}
            onTouchMove={aim}
            onTouchStart={tap}
          />
          {phase !== "play" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
              {phase === "over" && (
                <>
                  <p className="text-4xl font-black text-foreground">{score}</p>
                  {score >= best && score > 0 && <p className="text-sm font-semibold text-primary">🏆 New best!</p>}
                </>
              )}
              <button
                onClick={start}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-background transition-all hover:opacity-90 active:scale-95"
              >
                {phase === "over" ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
                {phase === "over" ? "Play again" : "Start popping"}
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
