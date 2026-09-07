import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play } from "lucide-react";

export const Route = createFileRoute("/play/cricket")({ component: Cricket });

const W = 400;
const H = 560;
const PITCH_L = 152;
const PITCH_R = 248;
const PITCH_TOP = 34;
const PITCH_BOT = 470;
const SWEET_Y = 380;
const WINDOW_TOP = 250;
const RELEASE_Y = 62;
const STUMP_Y = 452;
const CX = 200;
const BALLS_PER_INNINGS = 12;
const WICKETS = 3;

const BOWLERS = [
  { name: "Fast bowler", emoji: "⚡", vy: 7.6, drift: 0.22 },
  { name: "Medium pacer", emoji: "🎯", vy: 6.0, drift: 0.38 },
  { name: "Spinner", emoji: "🌀", vy: 4.4, drift: 0.7 },
] as const;

interface BallState {
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  bowler: number;
  flight: number;
  flightVx: number;
  flightVy: number;
  batSwing: number;
  swung: boolean;
}

interface Score {
  runs: number;
  wkts: number;
  balls: number;
}

function freshBall(): BallState {
  return {
    alive: false,
    x: CX,
    y: RELEASE_Y,
    vx: 0,
    vy: 0,
    bowler: 0,
    flight: 0,
    flightVx: 0,
    flightVy: 0,
    batSwing: 0,
    swung: false,
  };
}

function loadBest(): number {
  try {
    return Number(localStorage.getItem("play-cricket-best") ?? 0) || 0;
  } catch {
    return 0;
  }
}

function simulateInnings(): number {
  let runs = 0;
  for (let i = 0; i < BALLS_PER_INNINGS; i++) {
    const r = Math.random();
    if (r < 0.08) runs += 6;
    else if (r < 0.22) runs += 4;
    else if (r < 0.4) runs += 2;
    else if (r < 0.62) runs += 1;
  }
  return runs;
}

type Mode = "solo" | "chase" | "duel";
type Phase = "idle" | "play" | "innings" | "done";

function Cricket() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("solo");
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState<Score>({ runs: 0, wkts: 0, balls: 0 });
  const [banner, setBanner] = useState<{ text: string; sub: string; big: boolean } | null>(null);
  const [bowlerLabel, setBowlerLabel] = useState("");
  const [innings, setInnings] = useState<1 | 2>(1);
  const [target, setTarget] = useState<number | null>(null);
  const [result, setResult] = useState<{ title: string; sub: string } | null>(null);
  const [best, setBest] = useState(loadBest);

  const ballRef = useRef<BallState>(freshBall());
  const scoreRef = useRef<Score>({ runs: 0, wkts: 0, balls: 0 });
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const inningsRef = useRef(innings);
  inningsRef.current = innings;
  const targetRef = useRef(target);
  targetRef.current = target;
  const bestRef = useRef(best);
  bestRef.current = best;
  const nextTimer = useRef(0);
  const tapCooldown = useRef(0);

  useEffect(() => () => window.clearTimeout(nextTimer.current), []);

  function resetInningsState() {
    scoreRef.current = { runs: 0, wkts: 0, balls: 0 };
    setScore({ runs: 0, wkts: 0, balls: 0 });
    ballRef.current = freshBall();
    setBanner(null);
  }

  function scheduleDelivery(delay: number) {
    window.clearTimeout(nextTimer.current);
    nextTimer.current = window.setTimeout(deliver, delay);
  }

  function deliver() {
    if (phaseRef.current !== "play") return;
    const b = ballRef.current;
    const bi = Math.floor(Math.random() * BOWLERS.length);
    const bow = BOWLERS[bi]!;
    const speedScale = Math.min(1.35, 1 + scoreRef.current.balls * 0.02);
    b.bowler = bi;
    b.vy = bow.vy * speedScale * (0.93 + Math.random() * 0.14);
    b.vx = (Math.random() < 0.5 ? -1 : 1) * bow.drift;
    b.x = CX;
    b.y = RELEASE_Y;
    b.alive = true;
    b.swung = false;
    b.flight = 0;
    b.batSwing = 0;
    setBowlerLabel(`${bow.emoji} ${bow.name}`);
    setBanner(null);
  }

  function resolveBall(out: { runs: number; wkt: boolean; text: string; sub: string }) {
    const s = scoreRef.current;
    ballRef.current.alive = false;
    if (out.wkt) s.wkts++;
    s.runs += out.runs;
    s.balls++;
    setScore({ ...s });
    setBanner({ text: out.text, sub: out.sub, big: out.runs >= 4 || out.wkt });

    const chasing = inningsRef.current === 2;
    const t = targetRef.current;
    if (t !== null && chasing && s.runs >= t) {
      endInnings();
      return;
    }
    if (s.wkts >= WICKETS || s.balls >= BALLS_PER_INNINGS) {
      endInnings();
      return;
    }
    scheduleDelivery(1250);
  }

  function endInnings() {
    window.clearTimeout(nextTimer.current);
    const s = scoreRef.current;
    ballRef.current = freshBall();
    if (modeRef.current === "solo") {
      setBest((b) => {
        if (s.runs > b) {
          try {
            localStorage.setItem("play-cricket-best", String(s.runs));
          } catch {
            /* storage unavailable */
          }
          return s.runs;
        }
        return b;
      });
      setResult({
        title: `Innings over - ${s.runs}/${s.wkts}`,
        sub: `${s.balls} balls faced - best ${Math.max(bestRef.current, s.runs)}`,
      });
      setPhase("done");
    } else if (inningsRef.current === 1) {
      setTarget(s.runs + 1);
      setResult({
        title: `Player 1 made ${s.runs}/${s.wkts}`,
        sub: `Pass the device - Player 2 chases ${s.runs + 1} off ${BALLS_PER_INNINGS} balls`,
      });
      setPhase("innings");
    } else {
      const t = targetRef.current ?? s.runs + 1;
      if (s.runs >= t) {
        setResult({
          title: "Chase completed! 🏆",
          sub: `${s.runs}/${s.wkts} - won with ${BALLS_PER_INNINGS - s.balls} ball(s) to spare`,
        });
      } else if (s.runs === t - 1) {
        setResult({ title: "Tied match! 🤝", sub: `Both sides finished on ${t - 1}` });
      } else {
        setResult({ title: "Chase fell short 😔", sub: `Needed ${t}, finished on ${s.runs}/${s.wkts}` });
      }
      setPhase("done");
    }
  }

  function beginMatch() {
    window.clearTimeout(nextTimer.current);
    resetInningsState();
    setInnings(1);
    setTarget(null);
    setResult(null);
    setBowlerLabel("");
    if (modeRef.current === "chase") {
      const ai = simulateInnings();
      setTarget(ai + 1);
      setResult({
        title: `AI set the target: ${ai}`,
        sub: `Chase ${ai + 1} off ${BALLS_PER_INNINGS} balls, ${WICKETS} wickets in hand`,
      });
      setPhase("innings");
    } else {
      setPhase("play");
      scheduleDelivery(800);
    }
  }

  function continueToInnings2() {
    resetInningsState();
    setInnings(2);
    setResult(null);
    setPhase("play");
    scheduleDelivery(900);
  }

  function swing() {
    const b = ballRef.current;
    if (phaseRef.current !== "play" || !b.alive || b.flight > 0) return;
    const now = performance.now();
    if (now - tapCooldown.current < 180) return;
    tapCooldown.current = now;
    if (b.y < WINDOW_TOP || b.y > STUMP_Y) return;
    b.batSwing = 12;
    b.swung = true;
    const d = b.y - SWEET_Y;
    const abs = Math.abs(d);
    if (abs <= 12) {
      b.flight = 40;
      b.flightVx = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 3);
      b.flightVy = -(4 + Math.random() * 2);
      resolveBall({ runs: 6, wkt: false, text: "SIX! 🎉", sub: "Perfect timing - out of the park!" });
    } else if (abs <= 30) {
      b.flight = 34;
      b.flightVx = (d < 0 ? -1 : 1) * (2 + Math.random() * 3);
      b.flightVy = -(2.5 + Math.random() * 1.5);
      resolveBall({
        runs: 4,
        wkt: false,
        text: "FOUR! 🏏",
        sub: d < 0 ? "A touch early but middled" : "A touch late but middled",
      });
    } else if (abs <= 50) {
      b.flight = 26;
      b.flightVx = (d < 0 ? -1 : 1) * (1.5 + Math.random() * 2);
      b.flightVy = -(1.5 + Math.random());
      const two = Math.random() < 0.45;
      resolveBall({
        runs: two ? 2 : 1,
        wkt: false,
        text: two ? "Two runs" : "Quick single",
        sub: d < 0 ? "Early - worked into the gap" : "Late - nudged around the corner",
      });
    } else if (abs <= 70) {
      b.flight = 22;
      b.flightVx = (d < 0 ? -1 : 1) * 2.2;
      b.flightVy = -1.6;
      if (Math.random() < 0.35) {
        resolveBall({ runs: 0, wkt: true, text: "CAUGHT! 😱", sub: "Thick edge - straight to the fielder" });
      } else {
        resolveBall({ runs: 1, wkt: false, text: "Edged - single", sub: "Lucky! Flashed past the keeper" });
      }
    } else {
      setBanner({ text: "Swing and a miss!", sub: d < 0 ? "Way too early" : "Way too late", big: false });
    }
  }

  // keyboard
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        swing();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;

    function drawStumps(px: number, py: number) {
      ctx!.strokeStyle = "rgba(229,231,235,0.85)";
      ctx!.lineWidth = 2.5;
      for (const dx of [-8, 0, 8]) {
        ctx!.beginPath();
        ctx!.moveTo(px + dx, py);
        ctx!.lineTo(px + dx, py + 16);
        ctx!.stroke();
      }
      ctx!.beginPath();
      ctx!.moveTo(px - 10, py - 2);
      ctx!.lineTo(px + 10, py - 2);
      ctx!.stroke();
    }

    const step = () => {
      const b = ballRef.current;
      if (phaseRef.current === "play") {
        if (b.flight > 0) {
          b.x += b.flightVx;
          b.y += b.flightVy;
          b.flight--;
        } else if (b.alive) {
          b.y += b.vy;
          // late movement: drift only in the final stretch, like real seam and spin
          if (b.y > SWEET_Y - 70) b.x += b.vx;
          if (b.y >= STUMP_Y) {
            if (Math.abs(b.x - CX) < 26) {
              resolveBall({
                runs: 0,
                wkt: true,
                text: "BOWLED! 🎳",
                sub: b.swung ? "Through the gate - timber!" : "Left a straight one - stumps flattened",
              });
            } else {
              resolveBall({
                runs: 0,
                wkt: false,
                text: "Dot ball",
                sub: b.swung ? "Beaten all ends up" : "Shouldered arms",
              });
            }
          }
        }
        if (b.batSwing > 0) b.batSwing--;
      }

      // draw
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#0c1a12");
      g.addColorStop(1, "#13261b");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      for (let y = 0; y < H; y += 28) ctx.fillRect(0, y, W, 14);

      ctx.fillStyle = "#5d5038";
      ctx.fillRect(PITCH_L, PITCH_TOP, PITCH_R - PITCH_L, PITCH_BOT - PITCH_TOP);
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      for (let y = PITCH_TOP; y < PITCH_BOT; y += 18) ctx.fillRect(PITCH_L, y, PITCH_R - PITCH_L, 9);

      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(PITCH_L, 442);
      ctx.lineTo(PITCH_R, 442);
      ctx.moveTo(PITCH_L, 96);
      ctx.lineTo(PITCH_R, 96);
      ctx.stroke();

      ctx.fillStyle = "rgba(45,212,191,0.07)";
      ctx.fillRect(PITCH_L, SWEET_Y - 48, PITCH_R - PITCH_L, 96);
      ctx.strokeStyle = "rgba(45,212,191,0.4)";
      ctx.setLineDash([5, 6]);
      ctx.strokeRect(PITCH_L, SWEET_Y - 48, PITCH_R - PITCH_L, 96);
      ctx.setLineDash([]);

      drawStumps(CX, 40);
      drawStumps(CX, 456);

      // bowler
      ctx.fillStyle = "#f87171";
      ctx.beginPath();
      ctx.arc(CX, 72, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(CX - 6, 80, 12, 15, 4);
      ctx.fill();

      // batsman with animated bat
      const swingT = b.batSwing > 0 ? (12 - b.batSwing) / 12 : 0;
      ctx.save();
      ctx.translate(214, 416);
      ctx.rotate(-0.6 + swingT * 2.4);
      ctx.fillStyle = "#8a6d3b";
      ctx.fillRect(-12, -2.5, 12, 5);
      ctx.fillStyle = "#c9a15a";
      ctx.beginPath();
      ctx.roundRect(0, -4.5, 30, 9, 3);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#dbe4ee";
      ctx.beginPath();
      ctx.roundRect(193, 412, 17, 26, 5);
      ctx.fill();
      ctx.fillStyle = "#2dd4bf";
      ctx.beginPath();
      ctx.arc(201, 402, 9, 0, Math.PI * 2);
      ctx.fill();

      // ball
      if (b.flight > 0 || b.alive) {
        const alpha = b.flight > 0 ? b.flight / 40 : 1;
        ctx.globalAlpha = Math.max(0.15, alpha);
        ctx.fillStyle = "#e05252";
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.flight > 0 ? 3 + 3 * alpha : 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.beginPath();
        ctx.arc(b.x - 1.5, b.y - 1.5, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3.2, 0.6, 2.4);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chasing = innings === 2 && target !== null;
  const need = chasing ? Math.max(0, target! - score.runs) : 0;
  const ballsLeft = BALLS_PER_INNINGS - score.balls;

  return (
    <AppShell title="Cricket">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏏 Cricket</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap (or press Space) as the ball enters the teal zone. Perfect timing = six, mistimed =
          danger. {BALLS_PER_INNINGS} balls, {WICKETS} wickets.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        {/* Scoreboard */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2.5">
          <div>
            <p className="text-[19px] font-black text-foreground">
              {score.runs}<span className="text-muted-foreground">/{score.wkts}</span>
            </p>
            <p className="text-[10px] text-muted-foreground">
              {innings === 1 ? (mode === "duel" ? "Player 1" : "Your innings") : mode === "duel" ? "Player 2" : "The chase"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[13px] font-bold text-foreground">Ball {Math.min(score.balls + 1, BALLS_PER_INNINGS)}/{BALLS_PER_INNINGS}</p>
            <p className="text-[10px] text-muted-foreground">{bowlerLabel || "Warming up"}</p>
          </div>
          <div className="text-right">
            {chasing ? (
              <>
                <p className="text-[19px] font-black text-primary">{need}</p>
                <p className="text-[10px] text-muted-foreground">need off {ballsLeft}</p>
              </>
            ) : (
              <>
                <p className="text-[19px] font-black text-primary">{best}</p>
                <p className="text-[10px] text-muted-foreground">best score</p>
              </>
            )}
          </div>
        </div>

        {/* Field */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onPointerDown={(e) => {
              e.preventDefault();
              swing();
            }}
            className="w-full touch-none rounded-xl border border-border"
            style={{ aspectRatio: `${W}/${H}` }}
          />

          {banner && phase === "play" && (
            <div className="pointer-events-none absolute inset-x-6 top-1/3 rounded-2xl bg-black/70 py-4 text-center">
              <p className={`font-black text-foreground ${banner.big ? "text-[26px]" : "text-[17px]"}`}>
                {banner.text}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">{banner.sub}</p>
            </div>
          )}

          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/65 p-4 text-center">
              <p className="text-[18px] font-black text-foreground">🏏 Cricket</p>
              <div className="grid w-full max-w-[260px] grid-cols-3 gap-1.5">
                {([["solo", "Solo bat"], ["chase", "Chase AI"], ["duel", "2P duel"]] as const).map(([m, label]) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`rounded-lg px-2 py-2 text-[11px] font-bold transition-colors ${
                      mode === m ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                onClick={beginMatch}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90"
              >
                <Play className="size-3.5" /> Take the crease
              </button>
            </div>
          )}

          {phase === "innings" && result && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/70 p-4 text-center">
              <p className="text-[18px] font-black text-foreground">{result.title}</p>
              <p className="text-[12px] text-muted-foreground">{result.sub}</p>
              <button
                onClick={continueToInnings2}
                className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90"
              >
                {mode === "chase" ? "Start the chase 🏏" : "Player 2, bat! 🏏"}
              </button>
            </div>
          )}

          {phase === "done" && result && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/70 p-4 text-center">
              <p className="text-[20px] font-black text-foreground">{result.title}</p>
              <p className="text-[12px] text-muted-foreground">{result.sub}</p>
              <div className="flex gap-2">
                <button
                  onClick={beginMatch}
                  className="rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90"
                >
                  Play again
                </button>
                <button
                  onClick={() => {
                    setPhase("idle");
                    setResult(null);
                  }}
                  className="rounded-xl border border-border bg-surface px-4 py-2.5 text-[13px] font-bold text-foreground hover:border-primary/40"
                >
                  Change mode
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Fast bowlers rush in, spinners drift late. Watch the ball out of the hand - early swings go
          leg side, late ones go over cover. Chase mode: knock off the AI target before you run out
          of balls or wickets.
        </p>
      </div>
    </AppShell>
  );
}
