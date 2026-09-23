import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play, RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/carrom")({ component: Carrom });

/**
 * Carrom — real board physics. 9 white, 9 black and the red queen arranged
 * in the classic centre circle. Drag from your striker along the baseline to
 * aim and power, release to shoot. Pot your colour (white for P1, black for
 * P2 vs AI), pocket the queen and cover it with your next pot, and clear
 * your pieces before the opponent. Pocketing the striker costs a piece.
 */

const W = 420;
const H = 420;
/** playing area inside the frame */
const T = 34;
const L = 34;
const R = W - 34;
const B = H - 34;
const CX = W / 2;
const CY = H / 2;
const COIN_R = 8.5;
const STRIKER_R = 11;
const POCKET_R = 17;
const POCKETS: [number, number][] = [
  [L + 8, T + 8],
  [R - 8, T + 8],
  [L + 8, B - 8],
  [R - 8, B - 8],
];

interface Piece {
  id: number;
  kind: "white" | "black" | "queen" | "striker";
  x: number;
  y: number;
  vx: number;
  vy: number;
  on: boolean;
}

/** classic carrom formation: queen centre, ring of 6, ring of 12 alternating */
function rackCoins(): Piece[] {
  const coins: Piece[] = [];
  let id = 1;
  // queen
  coins.push({ id: id++, kind: "queen", x: CX, y: CY, vx: 0, vy: 0, on: true });
  // inner ring of 6 (alternate colours)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    coins.push({
      id: id++,
      kind: i % 2 === 0 ? "white" : "black",
      x: CX + Math.cos(a) * COIN_R * 2.15,
      y: CY + Math.sin(a) * COIN_R * 2.15,
      vx: 0,
      vy: 0,
      on: true,
    });
  }
  // outer ring of 12 (alternate, offset)
  let whites = 3; // inner ring gave white 3
  let blacks = 3;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
    let kind: "white" | "black";
    // outer ring: 6 white + 6 black to complete 9/9
    if (i % 2 === 0) {
      kind = whites < 9 ? "white" : "black";
      if (kind === "white") whites++;
    } else {
      kind = blacks < 9 ? "black" : "white";
      if (kind === "black") blacks++;
    }
    coins.push({
      id: id++,
      kind,
      x: CX + Math.cos(a) * COIN_R * 4.1,
      y: CY + Math.sin(a) * COIN_R * 4.1,
      vx: 0,
      vy: 0,
      on: true,
    });
  }
  return coins;
}

const FRICTION = 0.982;
const STOP_V = 0.05;

function Carrom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [msg, setMsg] = useState("");
  const [scoreW, setScoreW] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [best, setBest] = useState(() => getGameBest("carrom") ?? 0);

  const coins = useRef<Piece[]>([]);
  const striker = useRef<Piece>({ id: 0, kind: "striker", x: CX, y: B - 26, vx: 0, vy: 0, on: true });
  const turn = useRef<"p1" | "p2">("p1");
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const moving = useRef(false);
  const pottedThisShot = useRef<Piece[]>([]);
  const queenPending = useRef<"p1" | "p2" | null>(null); // potted queen, needs cover
  const scores = useRef({ w: 0, b: 0 });
  const raf = useRef(0);
  const aiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const myColour = (t: "p1" | "p2") => (t === "p1" ? "white" : "black");

  const start = useCallback(() => {
    coins.current = rackCoins();
    striker.current = { id: 0, kind: "striker", x: CX, y: B - 26, vx: 0, vy: 0, on: true };
    turn.current = "p1";
    queenPending.current = null;
    scores.current = { w: 0, b: 0 };
    pottedThisShot.current = [];
    setScoreW(0);
    setScoreB(0);
    setMsg("Your break — drag the striker!");
    setPhase("play");
  }, []);

  const finish = useCallback((winner: "p1" | "p2") => {
    setPhase("over");
    if (winner === "p1") {
      const score = scores.current.w;
      if (score > (getGameBest("carrom") ?? 0)) {
        saveGameBest("carrom", score);
        setBest(score);
      }
    }
  }, []);

  const endShot = useCallback(() => {
    const potted = pottedThisShot.current;
    const me = turn.current;
    const opp = me === "p1" ? "p2" : "p1";
    const mine = myColour(me);
    let keepTurn = false;
    let newMsg = "Turn passes";

    const strikerOut = potted.some((p) => p.kind === "striker");

    for (const p of potted) {
      if (p.kind === "striker") continue;
      if (p.kind === "queen") {
        queenPending.current = me;
        newMsg = "Queen down — cover her with your colour!";
      } else if (p.kind === mine) {
        scores.current[mine === "white" ? "w" : "b"]++;
        keepTurn = true;
        // queen cover: if queen pending for me and I pot my colour after, she counts
        if (queenPending.current === me) {
          queenPending.current = null;
          scores.current[mine === "white" ? "w" : "b"] += 3;
          newMsg = "Queen covered! +3";
          keepTurn = true;
        }
      } else {
        // opponent's coin potted — it stays potted for them (classic rule: opponent benefits)
        scores.current[p.kind === "white" ? "w" : "b"]++;
        newMsg = "You potted opponent's coin";
      }
    }

    // striker pocketed: return one potted coin of mine (penalty)
    if (strikerOut) {
      const myRemaining = coins.current.filter((c) => c.kind === mine && !c.on).length;
      const returnCoin = coins.current.find((c) => c.kind === mine && !c.on);
      if (myRemaining > 0 && returnCoin) {
        returnCoin.on = true;
        scores.current[mine === "white" ? "w" : "b"] = Math.max(0, scores.current[mine === "white" ? "w" : "b"] - 1);
      }
      if (queenPending.current === me) {
        // queen returns to centre
        const q = coins.current.find((c) => c.kind === "queen");
        if (q && !q.on) {
          q.on = true;
          q.x = CX;
          q.y = CY;
        }
        queenPending.current = null;
      }
      newMsg = "Foul! Striker pocketed — penalty coin back";
      keepTurn = false;
    }

    // unclaimed queen at end of shot without cover: back to centre
    if (queenPending.current === me && !potted.some((p) => p.kind === mine)) {
      const q = coins.current.find((c) => c.kind === "queen");
      if (q && !q.on) {
        q.on = true;
        q.x = CX;
        q.y = CY;
      }
      queenPending.current = null;
      newMsg = "Queen uncovered — she returns";
    }

    setScoreW(scores.current.w);
    setScoreB(scores.current.b);

    // win: all my coins down (queen included)
    const mineLeft = coins.current.filter((c) => c.kind === mine && c.on).length;
    if (mineLeft === 0 && queenPending.current !== me) {
      const iWon = scores.current[mine === "white" ? "w" : "b"] > scores.current[opp === "p1" ? "w" : "b"];
      setMsg(iWon ? "You win! 🏆" : `${opp === "p2" ? "AI" : "Player 2"} wins`);
      finish(me);
      return;
    }

    turn.current = keepTurn ? me : opp;
    // reset striker to the current player's baseline
    striker.current.on = true;
    striker.current.vx = 0;
    striker.current.vy = 0;
    striker.current.y = turn.current === "p1" ? B - 26 : T + 26;
    striker.current.x = CX;
    pottedThisShot.current = [];
    moving.current = false;
    setMsg(keepTurn ? (newMsg === "Turn passes" ? "Nice — shoot again!" : newMsg) : newMsg);
  }, [finish]);

  /** step physics for all live pieces */
  const stepPhysics = useCallback(() => {
    const all = [...coins.current.filter((c) => c.on), ...(striker.current.on ? [striker.current] : [])];
    let anyMoving = false;
    for (const p of all) {
      if (p.vx === 0 && p.vy === 0) continue;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      if (Math.hypot(p.vx, p.vy) < STOP_V) {
        p.vx = 0;
        p.vy = 0;
      } else {
        anyMoving = true;
      }
      // cushions
      if (p.x < L + (p.kind === "striker" ? STRIKER_R : COIN_R)) {
        p.x = L + (p.kind === "striker" ? STRIKER_R : COIN_R);
        p.vx *= -0.85;
      }
      if (p.x > R - (p.kind === "striker" ? STRIKER_R : COIN_R)) {
        p.x = R - (p.kind === "striker" ? STRIKER_R : COIN_R);
        p.vx *= -0.85;
      }
      if (p.y < T + (p.kind === "striker" ? STRIKER_R : COIN_R)) {
        p.y = T + (p.kind === "striker" ? STRIKER_R : COIN_R);
        p.vy *= -0.85;
      }
      if (p.y > B - (p.kind === "striker" ? STRIKER_R : COIN_R)) {
        p.y = B - (p.kind === "striker" ? STRIKER_R : COIN_R);
        p.vy *= -0.85;
      }
      // pockets
      for (const [px, py] of POCKETS) {
        if (Math.hypot(p.x - px, p.y - py) < POCKET_R - 2) {
          p.on = false;
          p.vx = 0;
          p.vy = 0;
          pottedThisShot.current.push(p);
          break;
        }
      }
    }
    // piece collisions (elastic)
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const a = all[i]!;
        const c = all[j]!;
        if (!a.on || !c.on) continue;
        const ra = a.kind === "striker" ? STRIKER_R : COIN_R;
        const rc = c.kind === "striker" ? STRIKER_R : COIN_R;
        const dx = c.x - a.x;
        const dy = c.y - a.y;
        const d = Math.hypot(dx, dy);
        if (d < ra + rc && d > 0) {
          const nx = dx / d;
          const ny = dy / d;
          const overlap = ra + rc - d;
          a.x -= nx * overlap * 0.5;
          a.y -= ny * overlap * 0.5;
          c.x += nx * overlap * 0.5;
          c.y += ny * overlap * 0.5;
          const rel = a.vx * nx + a.vy * ny - (c.vx * nx + c.vy * ny);
          if (rel > 0) {
            a.vx -= rel * nx * 0.96;
            a.vy -= rel * ny * 0.96;
            c.vx += rel * nx * 0.96;
            c.vy += rel * ny * 0.96;
          }
        }
      }
    }
    return anyMoving;
  }, []);

  /** simple AI: aim at nearest own coin nearest pocket, add error */
  const aiShoot = useCallback(() => {
    const mine = myColour("p2");
    const targets = coins.current.filter((c) => c.on && (c.kind === mine || c.kind === "queen"));
    if (!targets.length) return;
    // pick coin+combo with clearest line
    let bestShot: { power: number; angle: number } | null = null;
    let bestScore = Infinity;
    for (const c of targets) {
      for (const [px, py] of POCKETS) {
        const toCoin = Math.atan2(c.y - striker.current.y, c.x - striker.current.x);
        // rough cut angle: pocket behind coin
        const cutAngle = Math.atan2(2 * c.y - py - striker.current.y, 2 * c.x - px - striker.current.x);
        const err = Math.abs(toCoin - cutAngle);
        if (err < bestScore) {
          bestScore = err;
          bestShot = { angle: cutAngle + (Math.random() - 0.5) * 0.09, power: 10 + Math.random() * 4 };
        }
      }
    }
    if (bestShot) {
      striker.current.vx = Math.cos(bestShot.angle) * bestShot.power;
      striker.current.vy = Math.sin(bestShot.angle) * bestShot.power;
      moving.current = true;
    } else {
      endShot();
    }
  }, [endShot]);

  useEffect(() => {
    if (phase !== "play") return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const drawPiece = (p: Piece) => {
      const r = p.kind === "striker" ? STRIKER_R : COIN_R;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      if (p.kind === "striker") {
        ctx.fillStyle = "#f1f5f9";
        ctx.fill();
        ctx.strokeStyle = "#0ea5e9";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (p.kind === "queen") {
        ctx.fillStyle = "#dc2626";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = p.kind === "white" ? "#e7e5e4" : "#1c1917";
        ctx.fill();
        ctx.strokeStyle = p.kind === "white" ? "#78716c" : "#57534e";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      // inner ring for style
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const loop = () => {
      // board
      ctx.fillStyle = "#b45309";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#d97706";
      ctx.fillRect(L - 14, T - 14, R - L + 28, B - T + 28);
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(L, T, R - L, B - T);
      // grain lines
      ctx.strokeStyle = "rgba(120,53,15,0.15)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(L, T + ((B - T) / 8) * i);
        ctx.lineTo(R, T + ((B - T) / 8) * i);
        ctx.stroke();
      }
      // pockets
      for (const [px, py] of POCKETS) {
        ctx.fillStyle = "#1c1917";
        ctx.beginPath();
        ctx.arc(px, py, POCKET_R, 0, Math.PI * 2);
        ctx.fill();
      }
      // centre circle + arrows
      ctx.strokeStyle = "rgba(120,53,15,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(CX, CY, COIN_R * 4.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(CX, CY, COIN_R * 1.1, 0, Math.PI * 2);
      ctx.stroke();
      // baselines
      ctx.beginPath();
      ctx.moveTo(L + 40, B - 26);
      ctx.lineTo(R - 40, B - 26);
      ctx.moveTo(L + 40, T + 26);
      ctx.lineTo(R - 40, T + 26);
      ctx.stroke();
      // end circles
      for (const y of [T + 26, B - 26]) {
        ctx.beginPath();
        ctx.arc(L + 40, y, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(R - 40, y, 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      const wasMoving = moving.current;
      const still = !stepPhysics();
      if (wasMoving && still) endShot();

      for (const c of coins.current) if (c.on) drawPiece(c);
      if (striker.current.on) drawPiece(striker.current);

      // aim UI
      const s = striker.current;
      if (dragging.current && !moving.current && s.on) {
        const d = dragging.current;
        const dx = s.x - d.x;
        const dy = s.y - d.y;
        const len = Math.hypot(dx, dy) || 1;
        const power = Math.min(len, 130) / 130;
        ctx.strokeStyle = "rgba(14,165,233,0.9)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + (dx / len) * 260, s.y + (dy / len) * 260);
        ctx.stroke();
        ctx.setLineDash([]);
        // power bar
        ctx.fillStyle = power > 0.66 ? "#ef4444" : power > 0.33 ? "#f59e0b" : "#22c55e";
        ctx.fillRect(12, 12, 60 * power, 7);
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.strokeRect(12, 12, 60, 7);
      }

      // HUD
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = "bold 13px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`⚪ You ${scores.current.w}`, 12, H - 8);
      ctx.textAlign = "right";
      ctx.fillText(`⚫ AI ${scores.current.b}`, W - 12, H - 8);
      ctx.textAlign = "center";
      ctx.fillStyle = turn.current === "p1" ? "#0ea5e9" : "#f97316";
      ctx.fillText(turn.current === "p1" ? msg : "AI thinking…", W / 2, H - 8);

      // AI turn trigger
      if (turn.current === "p2" && !moving.current && !aiTimer.current) {
        aiTimer.current = setTimeout(() => {
          aiTimer.current = null;
          aiShoot();
        }, 900);
      }

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf.current);
      if (aiTimer.current) {
        clearTimeout(aiTimer.current);
        aiTimer.current = null;
      }
    };
  }, [phase, msg, endShot, stepPhysics, aiShoot]);

  const pointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "play" || turn.current !== "p1" || moving.current) return;
    const cv = canvasRef.current!;
    const rect = cv.getBoundingClientRect();
    dragging.current = {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  };

  const pointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const d = dragging.current;
    dragging.current = null;
    if (!d || phase !== "play" || turn.current !== "p1" || moving.current) return;
    const cv = canvasRef.current!;
    const rect = cv.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const dx = striker.current.x - x;
    const dy = striker.current.y - y;
    const len = Math.hypot(dx, dy);
    if (len < 12) return;
    const power = (Math.min(len, 130) / 130) * 13;
    striker.current.vx = (dx / len) * power;
    striker.current.vy = (dy / len) * power;
    moving.current = true;
  };

  return (
    <AppShell title="Carrom">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🪙 Carrom</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Classic carrom vs AI — pot your white coins, take the red queen and cover her.
        </p>
      </header>
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full cursor-crosshair touch-none select-none"
            onPointerDown={pointerDown}
            onPointerUp={pointerUp}
          />
          {phase !== "play" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 backdrop-blur-sm">
              {phase === "over" ? (
                <>
                  <p className="text-3xl font-black text-foreground">
                    {scores.current.w > scores.current.b ? "🏆 You win!" : "AI wins"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {scores.current.w} — {scores.current.b}
                  </p>
                </>
              ) : (
                <p className="text-5xl">🪙</p>
              )}
              <button
                onClick={start}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-background transition-all hover:opacity-90 active:scale-95"
              >
                {phase === "over" ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
                {phase === "over" ? "New board" : "Start game"}
              </button>
              {phase === "idle" && best > 0 && <p className="text-xs text-muted-foreground">Best winning score: {best}</p>}
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Drag from the striker back like a slingshot. Queen = 3 points but must be covered by your next pot.
        </p>
      </div>
    </AppShell>
  );
}
