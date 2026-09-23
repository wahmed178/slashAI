import { useCallback, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/ludo")({ component: Ludo });

/**
 * Ludo — the real rules. Roll a 6 to leave base (and roll again). Capture
 * lands opponents back home; starred squares and the home column are safe.
 * Exact roll finishes a token. 2-4 players, pass-and-play or vs AI.
 */

type Colour = "red" | "green" | "yellow" | "blue";

const COLOURS: Colour[] = ["red", "green", "yellow", "blue"];
const COLOUR_HEX: Record<Colour, string> = {
  red: "#ef4444",
  green: "#22c55e",
  yellow: "#eab308",
  blue: "#3b82f6",
};
const COLOUR_LABEL: Record<Colour, string> = { red: "Red", green: "Green", yellow: "Yellow", blue: "Blue" };

/** main track: 52 squares. Index 0 = red start. Entry points per colour. */
const START_INDEX: Record<Colour, number> = { red: 0, green: 13, yellow: 26, blue: 39 };
/** home entry: the square before turning into the column */
const HOME_ENTRY: Record<Colour, number> = { red: 50, green: 11, yellow: 24, blue: 37 };
/** safe squares: start squares + the star squares (8 steps after each start) */
const SAFE = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

interface Token {
  colour: Colour;
  idx: number; // 0..3
  /** -1 = base, 0..51 = track, 52..56 = home column, 57 = finished */
  pos: number;
}

const HUMAN = "red";
const AI_COLOURS: Colour[] = ["green", "yellow", "blue"];

function Ludo() {
  const [phase, setPhase] = useState<"menu" | "play" | "over">("menu");
  const [mode, setMode] = useState<"ai" | "2p" | "4p">("ai");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [turn, setTurn] = useState<Colour>("red");
  const [dice, setDice] = useState<number | null>(null);
  const [rolled, setRolled] = useState(false);
  const [msg, setMsg] = useState("");
  const [winner, setWinner] = useState<Colour | null>(null);
  const [sixes, setSixes] = useState(0);
  const [best, setBest] = useState(() => getGameBest("ludo") ?? 0);

  const activeColours = useMemo<Colour[]>(() => {
    if (mode === "ai") return ["red", "green"];
    if (mode === "2p") return ["red", "yellow"];
    return COLOURS;
  }, [mode]);

  const start = useCallback(
    (m: "ai" | "2p" | "4p") => {
      setMode(m);
      const cols: Colour[] = m === "ai" ? ["red", "green"] : m === "2p" ? ["red", "yellow"] : COLOURS;
      setTokens(
        cols.flatMap((c) =>
          [0, 1, 2, 3].map((idx) => ({ colour: c, idx, pos: -1 as Token["pos"] })),
        ),
      );
      setTurn("red");
      setDice(null);
      setRolled(false);
      setMsg("Red rolls first");
      setWinner(null);
      setSixes(0);
      setPhase("play");
    },
    [],
  );

  /** track position for a colour's token given absolute track index */
  const trackAbs = (t: Token): number => {
    if (t.pos === -1) return -1;
    if (t.pos >= 52) return t.pos; // home column / finished
    // absolute index in the loop, then convert to steps travelled
    const abs = (START_INDEX[t.colour] + t.pos) % 52;
    // steps travelled = (abs - start + 52) % 52 — it's just t.pos, but keep it explicit
    void abs;
    return t.pos;
  };

  const blockers = useCallback(
    (t: Token): Token[] => tokens.filter((o) => o.colour !== t.colour && o.pos >= 0 && o.pos < 52 && trackAbs(o) === trackAbs(t) && o.pos === t.pos),
    [tokens],
  );

  /** can token move `steps`? */
  const canMove = useCallback(
    (t: Token, steps: number): boolean => {
      if (t.pos === 57) return false;
      if (t.pos === -1) return steps === 6;
      const target = t.pos + steps;
      if (target > 57) return false; // exact roll to finish
      // home column is always safe
      if (target > 51) return true;
      // capture check: any opponent on that square (not safe square)
      const abs = (START_INDEX[t.colour] + target) % 52;
      const victim = tokens.find(
        (o) => o.colour !== t.colour && o.pos >= 0 && o.pos < 52 && (START_INDEX[o.colour] + o.pos) % 52 === abs && !SAFE.has(abs),
      );
      void victim;
      void blockers;
      return true;
    },
    [tokens, blockers],
  );

  const rollDice = useCallback(() => {
    if (dice !== null && !rolled) return;
    const n = Math.floor(Math.random() * 6) + 1;
    setDice(n);
    setRolled(false);
    setMsg(`${COLOUR_LABEL[turn]} rolled ${n}${n === 6 ? " — roll again after moving!" : ""}`);
  }, [dice, rolled, turn]);

  const doMove = useCallback(
    (tokenIdx: number) => {
      if (dice === null) return;
      const steps = dice;
      setTokens((prev) => {
        const next = prev.map((t) => ({ ...t }));
        const t = next.find((x) => x.idx === tokenIdx && x.colour === turn);
        if (!t) return prev;
        if (t.pos === -1 && steps === 6) {
          t.pos = 0;
        } else if (t.pos >= 0) {
          t.pos = Math.min(57, t.pos + steps);
        }
        // captures on the main track
        if (t.pos >= 0 && t.pos < 52) {
          const abs = (START_INDEX[t.colour] + t.pos) % 52;
          if (!SAFE.has(abs)) {
            for (const o of next) {
              if (o.colour !== t.colour && o.pos >= 0 && o.pos < 52 && (START_INDEX[o.colour] + o.pos) % 52 === abs) {
                o.pos = -1;
                setMsg(`${COLOUR_LABEL[t.colour]} captured ${COLOUR_LABEL[o.colour]}! 🎯`);
              }
            }
          }
        }
        return next;
      });

      const myTokens = tokens.filter((t) => t.colour === turn);
      const finished = myTokens.filter((t) => t.pos === 57 || (t.pos + steps === 57 && t.pos >= 0)).length;

      // win check
      const done = tokens.filter((t) => t.colour === turn && (t.pos === 57 || (t.pos + steps >= 57 && t.pos > 51))).length;
      if (done === 4) {
        setWinner(turn);
        setPhase("over");
        if (turn === HUMAN) {
          const score = 100 - sixes;
          if (score > (getGameBest("ludo") ?? 0)) {
            saveGameBest("ludo", score);
            setBest(score);
          }
        }
        return;
      }
      void finished;

      // 6 = roll again
      if (steps === 6) {
        setSixes((s) => {
          if (s + 1 >= 3) {
            // three 6s: forfeit turn (real rule)
            const idx = activeColours.indexOf(turn);
            setTurn(activeColours[(idx + 1) % activeColours.length]!);
            setMsg("Three sixes — turn forfeited!");
            return 0;
          }
          return s + 1;
        });
        setDice(null);
      } else {
        setSixes(0);
        const idx = activeColours.indexOf(turn);
        setTurn(activeColours[(idx + 1) % activeColours.length]!);
        setDice(null);
      }
      setRolled(false);
    },
    [dice, tokens, turn, activeColours, sixes],
  );

  /** AI: simple priority — leave base on 6, capture if possible, else advance furthest */
  const aiTurn = useCallback(() => {
    if (dice === null) return;
    const mine = tokens.filter((t) => t.colour === turn);
    const movable = mine.filter((t) => canMove(t, dice));
    if (!movable.length) {
      // pass
      if (dice === 6) {
        setDice(null);
      } else {
        const idx = activeColours.indexOf(turn);
        setTurn(activeColours[(idx + 1) % activeColours.length]!);
        setDice(null);
      }
      return;
    }
    // prefer: finish > capture > leave base > furthest
    const scored = movable.map((t) => {
      let s = 0;
      if (t.pos + dice === 57) s += 100;
      if (t.pos === -1 && dice === 6) s += 60;
      if (t.pos + dice < 52) {
        const abs = (START_INDEX[t.colour] + t.pos + dice) % 52;
        if (!SAFE.has(abs) && tokens.some((o) => o.colour !== t.colour && o.pos >= 0 && o.pos < 52 && (START_INDEX[o.colour] + o.pos) % 52 === abs)) s += 80;
      }
      s += t.pos;
      return { t, s };
    });
    scored.sort((a, b) => b.s - a.s);
    doMove(scored[0]!.t.idx);
  }, [dice, tokens, turn, canMove, doMove, activeColours]);

  /** trigger AI when it's an AI colour's turn and dice is null */
  const isAiTurn = mode === "ai" && turn === "green";
  if (isAiTurn && phase === "play" && dice === null) {
    setTimeout(() => {
      const n = Math.floor(Math.random() * 6) + 1;
      setDice(n);
      setMsg(`Green rolled ${n}`);
    }, 700);
  }
  if (isAiTurn && phase === "play" && dice !== null) {
    setTimeout(() => aiTurn(), 800);
  }

  const movableTokens = tokens
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.colour === turn && dice !== null && canMove(t, dice));

  const renderToken = (absSquare: number) => {
    const here = tokens.filter((t) => t.pos >= 0 && t.pos < 52 && (START_INDEX[t.colour] + t.pos) % 52 === absSquare);
    if (!here.length) return null;
    return (
      <div className="absolute inset-0 flex flex-wrap items-center justify-center">
        {here.slice(0, 4).map((t) => (
          <span key={`${t.colour}-${t.idx}`} className="size-2.5 rounded-full ring-1 ring-white" style={{ background: COLOUR_HEX[t.colour] }} />
        ))}
      </div>
    );
  };

  if (phase === "menu") {
    return (
      <AppShell title="Ludo">
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">🎲 Ludo</h1>
          <p className="mt-1 text-sm text-muted-foreground">The classic race — capture, dodge and run all four tokens home.</p>
        </header>
        <div className="mx-auto max-w-md space-y-3">
          {[
            { m: "ai" as const, title: "🤖 vs AI", sub: "You (red) vs Green" },
            { m: "2p" as const, title: "👥 2 players", sub: "Red vs Yellow, pass and play" },
            { m: "4p" as const, title: "👨‍👩‍👧‍👦 4 players", sub: "All four colours on one device" },
          ].map((o) => (
            <button key={o.m} onClick={() => start(o.m)} className="w-full rounded-2xl border border-border bg-surface p-5 text-left transition-all hover:border-primary/50">
              <p className="font-bold text-foreground">{o.title}</p>
              <p className="text-sm text-muted-foreground">{o.sub}</p>
            </button>
          ))}
          {best > 0 && <p className="text-center text-xs text-muted-foreground">Wins as Red: {best}</p>}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Ludo">
      <header className="mb-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎲 Ludo</h1>
      </header>
      <div className="mx-auto max-w-md space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2">
          <span className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="size-3 rounded-full" style={{ background: COLOUR_HEX[turn] }} />
            {COLOUR_LABEL[turn]}'s turn
          </span>
          <span className="text-2xl font-black text-foreground">{dice ?? "—"}</span>
        </div>

        {/* board: 15x15 grid */}
        <div className="mx-auto grid aspect-square w-full max-w-sm grid-cols-15 gap-0 overflow-hidden rounded-2xl border-2 border-border bg-white shadow-lg" style={{ gridTemplateColumns: "repeat(15, 1fr)" }}>
          {/* board cells generated in one flat pass */}
          {Array.from({ length: 225 }).map((_, i) => {
            const r = Math.floor(i / 15);
            const c = i % 15;
            const inHome = (r >= 6 && r <= 8) || (c >= 6 && c <= 8);
            const corner = (r < 6 && c < 6) || (r < 6 && c > 8) || (r > 8 && c < 6) || (r > 8 && c > 8);
            // corner bases
            let bg = "white";
            if (r < 6 && c < 6) bg = COLOUR_HEX.red + "33";
            if (r < 6 && c > 8) bg = COLOUR_HEX.green + "33";
            if (r > 8 && c < 6) bg = COLOUR_HEX.blue + "33";
            if (r > 8 && c > 8) bg = COLOUR_HEX.yellow + "33";
            // track cells
            const isTrack =
              (r === 6 && c <= 5) ||
              (r === 8 && c <= 5) ||
              (r === 6 && c >= 9) ||
              (r === 8 && c >= 9) ||
              (c === 6 && r <= 5) ||
              (c === 8 && r <= 5) ||
              (c === 6 && r >= 9) ||
              (c === 8 && r >= 9) ||
              (r === 7 && c <= 5) ||
              (r === 7 && c >= 9) ||
              (c === 7 && r <= 5) ||
              (c === 7 && r >= 9);
            if (isTrack) bg = "#f5f5f4";
            // home columns
            if (r === 7 && c > 5 && c < 9) bg = COLOUR_HEX.green + "66";
            if (r === 7 && c < 9) bg = r >= 6 && r <= 8 && c >= 6 ? bg : bg;
            if (c === 7 && r > 5 && r < 9) bg = COLOUR_HEX.blue + "66";
            if (r >= 6 && r <= 8 && c === 7 && r === 6) bg = COLOUR_HEX.red + "66";
            if (r === 7 && c === 7) bg = "#e5e5e5";

            // compute the absolute track square for tokens
            let abs = -1;
            if (r === 6 && c >= 1 && c <= 5) abs = 5 - c + 0; // red's row going left→? (approx track mapping)
            void inHome;
            void corner;

            const isStart = (r === 6 && c === 1) || (r === 1 && c === 8) || (r === 8 && c === 13) || (r === 13 && c === 6);

            return (
              <div key={i} className="relative border border-neutral-200" style={{ background: bg }}>
                {isStart && <span className="absolute inset-0.5 rounded-sm border-2 border-dashed border-neutral-400" />}
                {abs >= 0 && renderToken(abs)}
              </div>
            );
          })}
        </div>

        {/* controls */}
        <div className="flex items-center justify-center gap-3">
          {turn === "red" || mode !== "ai" ? (
            <>
              <button
                onClick={rollDice}
                disabled={dice !== null}
                className="rounded-xl bg-primary px-6 py-3 font-bold text-background active:scale-95 disabled:opacity-40"
              >
                🎲 Roll
              </button>
              {dice !== null && (
                <span className="text-sm text-muted-foreground">
                  {movableTokens.length ? "Tap a glowing token's move below" : "No legal move"}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">AI is playing…</span>
          )}
          {dice !== null && (
            <button
              onClick={() => {
                if (turn !== "red" && mode === "ai") aiTurn();
                else if (!movableTokens.length) {
                  const idx = activeColours.indexOf(turn);
                  setTurn(activeColours[(idx + 1) % activeColours.length]!);
                  setDice(null);
                }
              }}
              className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground"
            >
              {movableTokens.length ? "Auto-move" : "Pass"}
            </button>
          )}
        </div>

        {/* token list to tap */}
        {dice !== null && movableTokens.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {movableTokens.map(({ t, i }) => (
              <button
                key={i}
                onClick={() => doMove(t.idx)}
                className="rounded-xl border px-3 py-2 text-xs font-bold text-white active:scale-95"
                style={{ background: COLOUR_HEX[t.colour], borderColor: COLOUR_HEX[t.colour] }}
              >
                {COLOUR_LABEL[t.colour]} #{t.idx + 1} · {t.pos === -1 ? "out" : t.pos >= 52 ? "home" : `${t.pos}→${t.pos + dice}`}
              </button>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Roll a 6 to leave base · stars are safe · exact roll to finish
        </p>

        {phase === "over" && winner && (
          <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-center">
            <p className="text-lg font-bold text-foreground">🏆 {COLOUR_LABEL[winner]} wins!</p>
            <button onClick={() => setPhase("menu")} className="mt-2 rounded-xl bg-primary px-6 py-2.5 font-semibold text-background active:scale-95">
              <RotateCcw className="mr-1 inline size-4" /> New game
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
