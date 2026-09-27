import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Check, Play, Share2 } from "lucide-react";

import { playTone } from "@/lib/play-sound";
import { SITE_URL } from "@/lib/seo";
import { getGameBest, readStorage, saveGameBest } from "@/lib/ux";

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
const WICKETS = 3;

/** 60 fps reference step — physics is scaled by real elapsed time. */
const FRAME_MS = 1000 / 60;

/** Length of an innings per mode. Longer formats, more shots to time. */
const MODE_BALLS: Record<Mode, number> = { blitz: 12, solo: 24, t20: 40, chase: 24, duel: 24 };

const BOWLERS = [
  { name: "Fast bowler", short: "Fast", emoji: "⚡", vy: 7.6, drift: 0.22 },
  { name: "Medium pacer", short: "Med", emoji: "🎯", vy: 6.0, drift: 0.38 },
  { name: "Spinner", short: "Spin", emoji: "🌀", vy: 4.4, drift: 0.7 },
] as const;

/**
 * Batting order. The reducer brings in a new batter at `wickets + 1`, so the
 * order needs WICKETS + 1 slots — one short of that and the innings runs off
 * the end of the array on the last wicket.
 */
const BATTERS = ["You", "V. Raghav", "D. Mensah", "K. Soren"] as const;

interface BallState {
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
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
  fours: number;
  sixes: number;
}

interface Batter {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  out: boolean;
}

interface BowlerFig {
  name: string;
  balls: number;
  runs: number;
  wkts: number;
}

interface BatCard {
  order: Batter[];
  striker: number;
  nonStriker: number;
  partnership: number;
}

/** One delivery's result, plus the call the banner makes. */
interface Outcome {
  runs: number;
  wkt: boolean;
  text: string;
  sub: string;
  big: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  colour: string;
}

function freshBall(): BallState {
  return {
    alive: false,
    x: CX,
    y: RELEASE_Y,
    vx: 0,
    vy: 0,
    flight: 0,
    flightVx: 0,
    flightVy: 0,
    batSwing: 0,
    swung: false,
  };
}

function freshScore(): Score {
  return { runs: 0, wkts: 0, balls: 0, fours: 0, sixes: 0 };
}

function freshCard(): BatCard {
  return {
    order: BATTERS.map((n) => ({ name: n, runs: 0, balls: 0, fours: 0, sixes: 0, out: false })),
    striker: 0,
    nonStriker: 1,
    partnership: 0,
  };
}

function freshFigures(): BowlerFig[] {
  return BOWLERS.map((b) => ({ name: b.short, balls: 0, runs: 0, wkts: 0 }));
}

/** "12.3" from a raw ball count. */
function overs(balls: number): string {
  return `${Math.floor(balls / 6)}.${balls % 6}`;
}

/** Runs per hundred balls, the way a scorecard quotes it. */
function strikeRate(runs: number, balls: number): string {
  if (balls === 0) return "0.00";
  return ((runs / balls) * 100).toFixed(2);
}

/**
 * Personal best, read from the shared game-score store. Older installs kept
 * their record under "play-cricket-best" — migrate it once, then forget it.
 *
 * `readStorage` rather than `localStorage`: this runs during render, and on the
 * server a bare `localStorage` throws. `loadBest` is only called from an effect
 * so the first client render still matches the server's markup.
 */
function loadBest(): number {
  const stored = getGameBest("cricket");
  const legacy = Number(readStorage("play-cricket-best") ?? 0) || 0;
  if (legacy > (stored ?? 0)) {
    saveGameBest("cricket", legacy);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("play-cricket-best");
      } catch {
        /* private mode — the legacy key just lingers */
      }
    }
    return legacy;
  }
  return stored ?? 0;
}

/** Rough AI innings for the chase / duel modes, scaled to the format length. */
function simulateInnings(balls: number): number {
  let runs = 0;
  for (let i = 0; i < balls; i++) {
    const r = Math.random();
    if (r < 0.08) runs += 6;
    else if (r < 0.22) runs += 4;
    else if (r < 0.4) runs += 2;
    else if (r < 0.62) runs += 1;
  }
  return runs;
}

type Mode = "blitz" | "solo" | "t20" | "chase" | "duel";
type Phase = "idle" | "play" | "innings" | "done";

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "blitz", label: "Blitz", hint: "12 balls - one quick hit" },
  { id: "solo", label: "Solo 24", hint: "24 balls - chase your own best" },
  { id: "t20", label: "T20", hint: "40 balls - the long haul" },
  { id: "chase", label: "Chase AI", hint: "24 balls - beat the AI's total" },
  { id: "duel", label: "2P duel", hint: "24 balls each - pass and play" },
];

/** Modes that are a straight batting innings against your own best. */
const ATTACK_MODES: Mode[] = ["blitz", "solo", "t20"];

function Cricket() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("solo");
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState<Score>(freshScore);
  const [card, setCard] = useState<BatCard>(freshCard);
  const [figs, setFigs] = useState<BowlerFig[]>(freshFigures);
  const [banner, setBanner] = useState<{ text: string; sub: string; big: boolean } | null>(null);
  const [bowlerLabel, setBowlerLabel] = useState("");
  const [innings, setInnings] = useState<1 | 2>(1);
  const [target, setTarget] = useState<number | null>(null);
  const [result, setResult] = useState<{ title: string; sub: string } | null>(null);
  const [best, setBest] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [shared, setShared] = useState(false);

  const ballRef = useRef<BallState>(freshBall());
  const scoreRef = useRef<Score>(freshScore());
  const cardRef = useRef<BatCard>(freshCard());
  const figRef = useRef<BowlerFig[]>(freshFigures());
  const sparksRef = useRef<Spark[]>([]);
  const overBowlerRef = useRef(0);
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

  useEffect(() => {
    setBest(loadBest());
  }, []);

  useEffect(() => () => window.clearTimeout(nextTimer.current), []);

  function resetInningsState() {
    scoreRef.current = freshScore();
    cardRef.current = freshCard();
    figRef.current = freshFigures();
    overBowlerRef.current = 0;
    sparksRef.current = [];
    setScore(freshScore());
    setCard(freshCard());
    setFigs(freshFigures());
    setShowCard(false);
    setBanner(null);
  }

  function scheduleDelivery(delay: number) {
    window.clearTimeout(nextTimer.current);
    nextTimer.current = window.setTimeout(deliver, delay);
  }

  /** Celebration sparks for a six or a wicket. */
  function burst(x: number, y: number, kind: "six" | "wicket", count: number) {
    const palette =
      kind === "wicket" ? ["#f87171", "#fbbf24", "#e5e7eb"] : ["#fde047", "#fb923c", "#22d3ee"];
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const sp = 1.6 + Math.random() * 2.6;
      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1,
        life: 26 + Math.random() * 18,
        colour: palette[i % palette.length]!,
      });
    }
  }

  function deliver() {
    if (phaseRef.current !== "play") return;
    const b = ballRef.current;
    // A bowler bowls an over, not a single ball: the over's bowler is chosen
    // when the innings starts and swapped every six deliveries.
    const bi = overBowlerRef.current;
    const bow = BOWLERS[bi]!;
    const speedScale = Math.min(1.35, 1 + scoreRef.current.balls * 0.02);
    b.vy = bow.vy * speedScale * (0.93 + Math.random() * 0.14);
    b.vx = (Math.random() < 0.5 ? -1 : 1) * bow.drift;
    b.x = CX;
    b.y = RELEASE_Y;
    b.alive = true;
    b.swung = false;
    b.flight = 0;
    b.batSwing = 0;
    setBowlerLabel(`${bow.emoji} ${bow.name} · over ${Math.floor(scoreRef.current.balls / 6) + 1}`);
    setBanner(null);
  }

  function resolveBall(out: Outcome) {
    const s = scoreRef.current;
    const c = cardRef.current;
    const f = figRef.current;
    ballRef.current.alive = false;

    // bowler figures
    const bi = overBowlerRef.current;
    const fig = f[bi]!;
    fig.balls += 1;
    fig.runs += out.runs;
    if (out.wkt) fig.wkts += 1;

    if (out.wkt) {
      s.wkts += 1;
      c.order[c.striker]!.out = true;
      burst(CX, SWEET_Y, "wicket", 16);
      playTone("fail");
    } else {
      const bat = c.order[c.striker]!;
      bat.runs += out.runs;
      bat.balls += 1;
      if (out.runs === 4) {
        bat.fours += 1;
        s.fours += 1;
        playTone("success");
      } else if (out.runs === 6) {
        bat.sixes += 1;
        s.sixes += 1;
        burst(ballRef.current.x, ballRef.current.y, "six", 22);
        playTone("win");
      } else if (out.runs > 0) {
        playTone("tap");
      } else {
        playTone("tick");
      }
      c.partnership += out.runs;
      // Odd runs put the batters on strike, exactly as in real cricket.
      if (out.runs % 2 === 1) {
        const t = c.striker;
        c.striker = c.nonStriker;
        c.nonStriker = t;
      }
    }

    s.runs += out.runs;
    s.balls += 1;

    setScore({ ...s });
    setCard({ ...c, order: c.order.map((b) => ({ ...b })) });
    setFigs([...f]);
    setBanner({ text: out.text, sub: out.sub, big: out.big });

    const chasing = inningsRef.current === 2;
    const t = targetRef.current;
    if (t !== null && chasing && s.runs >= t) {
      endInnings();
      return;
    }
    if (s.wkts >= WICKETS || s.balls >= MODE_BALLS[modeRef.current]) {
      endInnings();
      return;
    }

    // End of over: the ends change for a new bowler, and the strike swaps.
    if (s.balls % 6 === 0) {
      overBowlerRef.current = (overBowlerRef.current + 1) % BOWLERS.length;
      const t2 = c.striker;
      c.striker = c.nonStriker;
      c.nonStriker = t2;
    }
    scheduleDelivery(1250);
  }

  function endInnings() {
    window.clearTimeout(nextTimer.current);
    const s = scoreRef.current;
    ballRef.current = freshBall();
    sparksRef.current = [];

    if (ATTACK_MODES.includes(modeRef.current)) {
      const isRecord = saveGameBest("cricket", s.runs);
      setBest((b) => (s.runs > b ? s.runs : b));
      setResult({
        title: `Innings over — ${s.runs}/${s.wkts}`,
        sub: isRecord
          ? `🏆 New personal best! ${s.runs} off ${s.balls} balls`
          : `${s.balls} balls faced — best ${Math.max(bestRef.current, s.runs)}`,
      });
      setPhase("done");
    } else if (inningsRef.current === 1) {
      setTarget(s.runs + 1);
      setResult({
        title: `Player 1 made ${s.runs}/${s.wkts}`,
        sub: `Pass the device — Player 2 chases ${s.runs + 1} off ${MODE_BALLS[modeRef.current]} balls`,
      });
      setPhase("innings");
    } else {
      const t = targetRef.current ?? s.runs + 1;
      if (s.runs >= t) {
        setResult({
          title: "Chase completed! 🏆",
          sub: `${s.runs}/${s.wkts} — won with ${MODE_BALLS[modeRef.current] - s.balls} ball(s) to spare`,
        });
      } else if (s.runs === t - 1) {
        setResult({ title: "Tied match! 🤝", sub: `Both sides finished on ${t - 1}` });
      } else {
        setResult({
          title: "Chase fell short 😔",
          sub: `Needed ${t}, finished on ${s.runs}/${s.wkts}`,
        });
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
    const balls = MODE_BALLS[modeRef.current];
    if (modeRef.current === "chase") {
      const ai = simulateInnings(balls);
      setTarget(ai + 1);
      setResult({
        title: `AI set the target: ${ai}`,
        sub: `Chase ${ai + 1} off ${balls} balls, ${WICKETS} wickets in hand`,
      });
      setPhase("innings");
    } else if (modeRef.current === "solo" && bestRef.current > 0) {
      setTarget(bestRef.current + 1);
      setResult({
        title: `Your best is ${bestRef.current}`,
        sub: `Score ${bestRef.current + 1} off ${balls} balls to beat it`,
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
      resolveBall({
        runs: 6,
        wkt: false,
        text: "SIX! 🎉",
        sub: "Perfect timing — out of the park!",
        big: true,
      });
    } else if (abs <= 30) {
      b.flight = 34;
      b.flightVx = (d < 0 ? -1 : 1) * (2 + Math.random() * 3);
      b.flightVy = -(2.5 + Math.random() * 1.5);
      resolveBall({
        runs: 4,
        wkt: false,
        text: "FOUR! 🏏",
        sub: d < 0 ? "A touch early but middled" : "A touch late but middled",
        big: true,
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
        sub: d < 0 ? "Early — worked into the gap" : "Late — nudged around the corner",
        big: false,
      });
    } else if (abs <= 70) {
      b.flight = 22;
      b.flightVx = (d < 0 ? -1 : 1) * 2.2;
      b.flightVy = -1.6;
      if (Math.random() < 0.35) {
        resolveBall({
          runs: 0,
          wkt: true,
          text: "CAUGHT! 😱",
          sub: "Thick edge — straight to the fielder",
          big: true,
        });
      } else {
        resolveBall({
          runs: 1,
          wkt: false,
          text: "Edged — single",
          sub: "Lucky! Flashed past the keeper",
          big: false,
        });
      }
    } else {
      playTone("tick");
      setBanner({
        text: "Swing and a miss!",
        sub: d < 0 ? "Way too early" : "Way too late",
        big: false,
      });
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

    // Frame-rate independence: on 90/120 Hz screens a fixed per-frame step
    // made the ball arrive twice as fast. Scale every movement by how long the
    // last frame actually took, normalised to 60 fps.
    let last = 0;

    const step = (now: number) => {
      const dt = last === 0 ? 1 : Math.min(3, Math.max(0.25, (now - last) / FRAME_MS));
      last = now;
      const b = ballRef.current;
      if (phaseRef.current === "play") {
        if (b.flight > 0) {
          b.x += b.flightVx * dt;
          b.y += b.flightVy * dt;
          b.flight -= dt;
        } else if (b.alive) {
          b.y += b.vy * dt;
          // late movement: drift only in the final stretch, like real seam and spin
          if (b.y > SWEET_Y - 70) b.x += b.vx * dt;
          if (b.y >= STUMP_Y) {
            if (Math.abs(b.x - CX) < 26) {
              resolveBall({
                runs: 0,
                wkt: true,
                text: "BOWLED! 🎳",
                sub: b.swung
                  ? "Through the gate — timber!"
                  : "Left a straight one — stumps flattened",
                big: true,
              });
            } else {
              resolveBall({
                runs: 0,
                wkt: false,
                text: "Dot ball",
                sub: b.swung ? "Beaten all ends up" : "Shouldered arms",
                big: false,
              });
            }
          }
        }
        if (b.batSwing > 0) b.batSwing = Math.max(0, b.batSwing - dt);
      }

      // sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const sp = sparksRef.current[i]!;
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vy += 0.14 * dt;
        sp.life -= dt;
        if (sp.life <= 0) sparksRef.current.splice(i, 1);
      }

      // draw
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#0c1a12");
      g.addColorStop(1, "#13261b");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      for (let y = 0; y < H; y += 28) ctx.fillRect(0, y, W, 14);

      // boundary rope
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(W / 2, H / 2 + 30, W / 2 - 12, H / 2 - 26, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#5d5038";
      ctx.fillRect(PITCH_L, PITCH_TOP, PITCH_R - PITCH_L, PITCH_BOT - PITCH_TOP);
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      for (let y = PITCH_TOP; y < PITCH_BOT; y += 18)
        ctx.fillRect(PITCH_L, y, PITCH_R - PITCH_L, 9);

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

      // sparks
      for (const sp of sparksRef.current) {
        ctx.globalAlpha = Math.max(0, Math.min(1, sp.life / 30));
        ctx.fillStyle = sp.colour;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ball
      if (b.flight > 0 || b.alive) {
        const alpha = b.flight > 0 ? b.flight / 40 : 1;
        ctx.globalAlpha = Math.max(0.15, alpha);
        // shadow on the pitch
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.ellipse(b.x + 4, b.y + 5, 6, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
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

  const ballsTotal = MODE_BALLS[mode];
  const chasing =
    target !== null && (innings === 2 || mode === "chase" || (mode === "solo" && best > 0));
  const need = chasing ? Math.max(0, target! - score.runs) : 0;
  const ballsLeft = ballsTotal - score.balls;
  const runRate = score.balls > 0 ? (score.runs / score.balls) * 6 : 0;
  const inningsName =
    innings === 1
      ? mode === "duel"
        ? "Player 1"
        : "Your innings"
      : mode === "duel"
        ? "Player 2"
        : "The chase";

  const shareScore = async () => {
    const text =
      mode === "duel" || mode === "chase" || (mode === "solo" && best > 0 && target !== null)
        ? `SlashAI Cricket · finished on ${score.runs}/${score.wkts}`
        : `I scored ${score.runs}/${score.wkts} in ${score.balls} balls on SlashAI Cricket 🏏`;
    const url = `${SITE_URL}/play/cricket`;
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title: "SlashAI Cricket", text, url });
      } else {
        await navigator.clipboard.writeText(`${text} — ${url}`);
      }
      setShared(true);
      window.setTimeout(() => setShared(false), 2200);
    } catch {
      /* user cancelled the share sheet */
    }
  };

  return (
    <AppShell title="Cricket">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏏 Cricket</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap (or press Space) as the ball enters the teal zone. Perfect timing = six, mistimed =
          danger. {ballsTotal} balls, {WICKETS} wickets.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        {/* Scoreboard */}
        <div className="rounded-xl border border-border bg-surface px-3.5 py-2.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[19px] font-black text-foreground">
                {score.runs}
                <span className="text-muted-foreground">/{score.wkts}</span>
              </p>
              <p className="text-[10px] text-muted-foreground">
                {innings === 1
                  ? mode === "duel"
                    ? "Player 1"
                    : "Your innings"
                  : mode === "duel"
                    ? "Player 2"
                    : "The chase"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[13px] font-bold text-foreground">
                {overs(score.balls)} / {overs(ballsTotal)}
              </p>
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

          {/* live figures strip */}
          <div className="mt-2 grid grid-cols-4 gap-1 border-t border-border pt-2 text-center">
            <div>
              <p className="text-[12px] font-bold text-foreground tabular-nums">
                {runRate.toFixed(1)}
              </p>
              <p className="text-[9px] text-muted-foreground">run rate</p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-foreground tabular-nums">
                {strikeRate(score.runs, score.balls)}
              </p>
              <p className="text-[9px] text-muted-foreground">strike rate</p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-foreground tabular-nums">
                {score.fours}/{score.sixes}
              </p>
              <p className="text-[9px] text-muted-foreground">4s / 6s</p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-foreground tabular-nums">
                {card.partnership}
              </p>
              <p className="text-[9px] text-muted-foreground">partnership</p>
            </div>
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
              <p
                className={`font-black text-foreground ${
                  banner.big ? "text-[26px]" : "text-[17px]"
                }`}
              >
                {banner.text}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">{banner.sub}</p>
            </div>
          )}

          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-y-auto rounded-xl bg-black/65 p-4 text-center">
              <p className="text-[18px] font-black text-foreground">🏏 Cricket</p>
              <div className="grid w-full max-w-[320px] grid-cols-2 gap-1.5">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    title={m.hint}
                    aria-pressed={mode === m.id}
                    className={`rounded-lg px-2 py-2 text-[11px] font-bold transition-colors ${
                      mode === m.id
                        ? "bg-primary text-background"
                        : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m.label}
                    <span className="mt-0.5 block text-[9px] font-medium opacity-80">
                      {MODE_BALLS[m.id]} balls
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={beginMatch}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90"
              >
                <Play className="size-3.5" /> Take the crease
              </button>
              {best > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  🏆 Your best: <b className="text-amber-400">{best}</b>
                  {mode === "solo" ? " — Solo 24 makes you chase it" : ""}
                </p>
              )}
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
                {mode === "chase"
                  ? "Start the chase 🏏"
                  : mode === "duel"
                    ? "Player 2, bat! 🏏"
                    : "Start batting 🏏"}
              </button>
            </div>
          )}

          {phase === "done" && result && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-y-auto rounded-xl bg-black/70 p-4 text-center">
              <p className="text-[20px] font-black text-foreground">{result.title}</p>
              <p className="text-[12px] text-muted-foreground">{result.sub}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={beginMatch}
                  className="rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90"
                >
                  Play again
                </button>
                <button
                  onClick={() => void shareScore()}
                  className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-[13px] font-bold text-primary hover:bg-primary/20"
                >
                  {shared ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
                  {shared ? "Copied" : "Share score"}
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

        {/* Scorecard */}
        <div className="rounded-xl border border-border bg-surface">
          <button
            type="button"
            onClick={() => setShowCard((v) => !v)}
            aria-expanded={showCard}
            className="flex w-full items-center justify-between px-3.5 py-2.5 text-left"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Scorecard
            </span>
            <span className="text-[11px] text-muted-foreground">
              {showCard ? "Hide ▲" : "Show ▼"}
            </span>
          </button>

          {showCard && (
            <div className="space-y-3 border-t border-border px-3.5 py-3">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {inningsName}
                </p>
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="text-left font-medium">Batter</th>
                      <th className="text-right font-medium">R</th>
                      <th className="text-right font-medium">B</th>
                      <th className="text-right font-medium">4s</th>
                      <th className="text-right font-medium">6s</th>
                      <th className="text-right font-medium">SR</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {card.order.map((b, i) => (
                      <tr
                        key={b.name}
                        className={
                          i === card.striker && phase !== "done"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        <td className="py-0.5 text-left">
                          {b.name}
                          {i === card.striker && phase !== "done" ? " *" : ""}
                          {b.out ? " (c)" : ""}
                        </td>
                        <td className="text-right">{b.runs}</td>
                        <td className="text-right">{b.balls}</td>
                        <td className="text-right">{b.fours}</td>
                        <td className="text-right">{b.sixes}</td>
                        <td className="text-right">{strikeRate(b.runs, b.balls)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Bowling
                </p>
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="text-left font-medium">Bowler</th>
                      <th className="text-right font-medium">O</th>
                      <th className="text-right font-medium">R</th>
                      <th className="text-right font-medium">W</th>
                      <th className="text-right font-medium">Econ</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {figs.map((f, i) => (
                      <tr
                        key={f.name}
                        className={
                          i === overBowlerRef.current && phase === "play"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        <td className="py-0.5 text-left">
                          {f.name}
                          {i === overBowlerRef.current && phase === "play" ? " *" : ""}
                        </td>
                        <td className="text-right">{overs(f.balls)}</td>
                        <td className="text-right">{f.runs}</td>
                        <td className="text-right">{f.wkts}</td>
                        <td className="text-right">
                          {f.balls > 0 ? ((f.runs / f.balls) * 6).toFixed(2) : "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Fast bowlers rush in, spinners drift late. Watch the ball out of the hand — early swings
          go leg side, late ones go over cover. A new bowler comes on every over, and odd runs
          change the strike. Blitz is 12 balls, T20 is 40; Solo 24, Chase AI and the 2P duel run 24
          each. Beat the target before you run out of balls or wickets, then share your score.
        </p>
      </div>
    </AppShell>
  );
}
