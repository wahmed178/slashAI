import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/darts")({ component: Darts });

/**
 * Darts — a real 501 board. The 20 sectors sit in their true clockwise order
 * and the rings score exactly as a bristle board does: single, treble, double,
 * outer bull (25) and bullseye (50). Three darts a turn, then the AI throws.
 * Land exactly on zero to win; 1 or below ends the turn as a bust.
 */

const ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
const R = 168;
const BOX = R * 2 + 16;
const RING = { bull: 12, outerBull: 22, singleInner: 92, treble: 104, singleOuter: 146, double: 158 };
const AI_ACCURACY = { Easy: 0.4, Medium: 0.62, Hard: 0.8 } as const;
type Level = keyof typeof AI_ACCURACY;

function scoreAt(dx: number, dy: number): { score: number; label: string } {
  const r = Math.hypot(dx, dy);
  if (r > RING.double) return { score: 0, label: "Off the board" };
  if (r <= RING.bull) return { score: 50, label: "Bullseye 50" };
  if (r <= RING.outerBull) return { score: 25, label: "Outer bull 25" };
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const a = (deg + 90 + 360) % 360;
  const idx = Math.floor((a + 9) / 18) % 20;
  const base = ORDER[idx]!;
  if (r > RING.singleOuter) return { score: base * 2, label: `Double ${base}` };
  if (r > RING.singleInner) return { score: base * 3, label: `Treble ${base}` };
  return { score: base, label: `Single ${base}` };
}

interface Dart { x: number; y: number; label: string; score: number }

function Darts() {
  const [level, setLevel] = useState<Level>("Medium");
  const [youLeft, setYouLeft] = useState(501);
  const [aiLeft, setAiLeft] = useState(501);
  const [turn, setTurn] = useState<"you" | "ai">("you");
  const [onBoard, setOnBoard] = useState<Dart[]>([]);
  const [turnDarts, setTurnDarts] = useState<Dart[]>([]);
  const [message, setMessage] = useState("You throw first — 501, straight out.");
  const [winner, setWinner] = useState<"" | "you" | "ai">("");
  const [wins, setWins] = useState(() => Number(localStorage.getItem("slashai.darts.wins")) || 0);

  const restart = useCallback(() => {
    setYouLeft(501);
    setAiLeft(501);
    setTurn("you");
    setOnBoard([]);
    setTurnDarts([]);
    setWinner("");
    setMessage("New leg — 501, straight out.");
  }, []);

  const recordWin = () => {
    const nb = wins + 1;
    setWins(nb);
    localStorage.setItem("slashai.darts.wins", String(nb));
  };

  /** the AI plays a whole turn of up to three darts */
  const playAiTurn = useCallback(
    (from: number) => {
      const acc = AI_ACCURACY[level];
      const thrown: Dart[] = [];
      let left = from;
      let bust = false;
      for (let i = 0; i < 3; i++) {
        const scatter = (1 - acc) * 150;
        // under 170 it hunts a finish, otherwise it works the treble 20 bed
        const aimDx = left > 170 ? 0 : left % 2 === 0 ? -58 : 58;
        const dx = aimDx + (Math.random() - 0.5) * scatter;
        const dy = (left > 170 ? -58 : 0) + (Math.random() - 0.5) * scatter;
        const hit = Math.hypot(dx, dy) > RING.double ? { score: 0, label: "Off the board" } : scoreAt(dx, dy);
        thrown.push({ x: dx, y: dy, ...hit });
        left -= hit.score;
        if (left === 0) break;
        if (left < 2) {
          bust = true;
          break;
        }
      }
      setOnBoard((b) => [...b, ...thrown]);
      setTurnDarts(thrown);
      if (left === 0) {
        setAiLeft(0);
        setWinner("ai");
        setMessage("😤 The AI checks out. Leg lost.");
        return;
      }
      if (bust) {
        setMessage("The AI busts — its score is restored.");
        setTurn("you");
        setTurnDarts([]);
        return;
      }
      setAiLeft(left);
      setMessage(`AI leaves ${left}. Your throw.`);
      setTurn("you");
      setTurnDarts([]);
    },
    [level],
  );

  const throwDart = (e: React.MouseEvent<SVGSVGElement>) => {
    if (turn !== "you" || winner) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = BOX / rect.width;
    const dx = (e.clientX - (rect.left + rect.width / 2)) * scale;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * scale;
    const hit = scoreAt(dx, dy);
    const dart: Dart = { x: dx, y: dy, ...hit };
    const thrown = [...turnDarts, dart];
    setOnBoard((b) => [...b, dart]);
    setTurnDarts(thrown);

    const left = youLeft - hit.score;
    if (left === 0) {
      setYouLeft(0);
      setWinner("you");
      setMessage("🏆 Checkout! You win the leg.");
      recordWin();
      return;
    }
    if (left < 2) {
      setMessage(`${hit.label} — bust, the whole turn is void.`);
      setTurn("ai");
      setTurnDarts([]);
      window.setTimeout(() => playAiTurn(aiLeft), 700);
      return;
    }
    setYouLeft(left);
    setMessage(`${hit.label} — ${left} left.`);
    if (thrown.length >= 3) {
      setTurn("ai");
      setTurnDarts([]);
      window.setTimeout(() => playAiTurn(aiLeft), 700);
    }
  };

  const sectorPath = (i: number, r1: number, r2: number) => {
    const a1 = ((i * 18 - 99) * Math.PI) / 180;
    const a2 = ((i * 18 - 81) * Math.PI) / 180;
    return `M ${Math.cos(a1) * r1} ${Math.sin(a1) * r1} L ${Math.cos(a2) * r1} ${Math.sin(a2) * r1} A ${r2} ${r2} 0 0 1 ${Math.cos(a2) * r2} ${Math.sin(a2) * r2} L ${Math.cos(a1) * r2} ${Math.sin(a1) * r2} A ${r1} ${r1} 0 0 0 ${Math.cos(a1) * r1} ${Math.sin(a1) * r1} Z`;
  };

  const SEG: [string, string] = ["#111827", "#f8fafc"];

  return (
    <AppShell title="Darts">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎯 Darts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          501, straight out. Tap the board to throw — three darts a turn, then the AI throws. Land exactly on zero.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">You</p>
            <p className="text-[20px] font-black text-[#2dd4bf]">{youLeft}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Legs won</p>
            <p className="text-[20px] font-black text-foreground">{wins}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">AI</p>
            <p className="text-[20px] font-black text-[#f472b6]">{aiLeft}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-[#0b1017] p-3">
          <svg
            viewBox={`${-R - 8} ${-R - 8} ${BOX} ${BOX}`}
            className={`mx-auto block w-full max-w-[380px] select-none ${turn === "you" && !winner ? "cursor-crosshair" : "cursor-default"}`}
            onClick={throwDart}
          >
            <circle r={R} fill="#0f172a" />
            {ORDER.map((n, i) => (
              <g key={n}>
                <path d={sectorPath(i, RING.outerBull, RING.singleInner)} fill={SEG[i % 2]} />
                <path d={sectorPath(i, RING.singleInner, RING.treble)} fill={i % 2 === 0 ? "#dc2626" : "#16a34a"} />
                <path d={sectorPath(i, RING.treble, RING.singleOuter)} fill={SEG[i % 2]} />
                <path d={sectorPath(i, RING.singleOuter, RING.double)} fill={i % 2 === 0 ? "#dc2626" : "#16a34a"} />
                <text
                  x={Math.cos(((i * 18 - 90) * Math.PI) / 180) * (RING.singleOuter + 10)}
                  y={Math.sin(((i * 18 - 90) * Math.PI) / 180) * (RING.singleOuter + 10)}
                  fill="#e2e8f0"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {n}
                </text>
              </g>
            ))}
            <circle r={RING.outerBull} fill="#16a34a" />
            <circle r={RING.bull} fill="#dc2626" />
            {onBoard.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={5} fill="#fbbf24" stroke="#78350f" strokeWidth={1.5} />
            ))}
          </svg>

          {winner && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 px-6 text-center">
              <p className="text-[24px] font-black text-foreground">
                {winner === "you" ? "🏆 Checkout — you win!" : "😤 AI checks out"}
              </p>
              <button onClick={restart} className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-background">
                ↻ New leg
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[12px] font-semibold text-foreground">{message}</p>
        <p className="text-center text-[11px] text-muted-foreground">
          Darts this turn: {turnDarts.map((d) => d.label).join(" · ") || "—"}
        </p>

        {turn === "ai" && !winner && (
          <button
            onClick={() => playAiTurn(aiLeft)}
            className="mx-auto block rounded-lg border border-border bg-surface px-4 py-2 text-[12px] font-semibold text-foreground hover:bg-primary/10"
          >
            Let the AI throw →
          </button>
        )}

        <div className="flex items-center justify-center gap-1.5">
          {(Object.keys(AI_ACCURACY) as Level[]).map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                level === l ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"
              }`}
            >
              {l}
            </button>
          ))}
          <button onClick={restart} className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground">
            Reset
          </button>
        </div>
      </div>
    </AppShell>
  );
}
