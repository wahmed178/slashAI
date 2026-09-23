import { useCallback, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/hand-cricket")({ component: HandCricket });

/**
 * Hand Cricket — the schoolyard classic. Both players show fingers 1-6 at
 * once. Match the fingers and the batter is out; otherwise batter adds the
 * runs. Bat, then bowl, then defend your total — full innings switch.
 */

type Phase = "toss" | "bat" | "bowl" | "innings-break" | "done";
type Call = 1 | 2 | 3 | 4 | 5 | 6;

const FINGERS: Call[] = [1, 2, 3, 4, 5, 6];
const EMOJI: Record<Call, string> = { 1: "☝️", 2: "✌️", 3: "🤟", 4: "🖖", 5: "🖐️", 6: "👌" };

function HandCricket() {
  const [phase, setPhase] = useState<Phase>("toss");
  const [batFirst, setBatFirst] = useState<"you" | "ai" | null>(null);
  const [yourRuns, setYourRuns] = useState(0);
  const [aiRuns, setAiRuns] = useState(0);
  const [wicket, setWicket] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [yourHand, setYourHand] = useState<Call | null>(null);
  const [aiHand, setAiHand] = useState<Call | null>(null);
  const [winner, setWinner] = useState<"you" | "ai" | null>(null);

  /** innings the first batter is on */
  const [innings, setInnings] = useState(1);
  const target = useMemo(() => (innings === 2 ? (batFirst === "you" ? yourRuns : aiRuns) + 1 : 0), [innings, batFirst, yourRuns, aiRuns]);

  const push = (s: string) => setLog((l) => [s, ...l].slice(0, 6));

  const startToss = (call: "odd" | "even") => {
    const t = Math.floor(Math.random() * 6) + 1;
    const won = (t % 2 === 0) === (call === "even");
    push(`Toss: ${t} — you ${won ? "win" : "lose"} the toss`);
    let iBatFirst: "you" | "ai";
    if (won) {
      iBatFirst = "you";
    } else {
      iBatFirst = "ai";
    }
    setBatFirst(iBatFirst);
    setPhase(iBatFirst === "you" ? "bat" : "bowl");
  };

  const play = useCallback(
    (mine: Call) => {
      setYourHand(mine);
      const ai: Call = FINGERS[Math.floor(Math.random() * 6)]!;
      setAiHand(ai);

      if (phase === "bat") {
        if (mine === ai) {
          setWicket(true);
          push(`OUT! You showed ${mine}, AI showed ${ai}`);
          setTimeout(() => {
            if (innings === 1) {
              setInnings(2);
              setPhase("bowl");
              setWicket(false);
              push(`AI needs ${yourRuns + 1} to win`);
            } else {
              setWinner("ai");
              setPhase("done");
            }
          }, 1100);
        } else {
          setYourRuns((r) => r + mine);
          push(`You bat ${mine} vs ${ai} — +${mine}`);
        }
      } else if (phase === "bowl") {
        if (mine === ai) {
          push(`WICKET! You showed ${mine}, AI showed ${ai}`);
          if (innings === 1) {
            setInnings(2);
            setPhase("bat");
            push(`You need ${aiRuns + 1} to win`);
          } else {
            setWinner("you");
            setPhase("done");
          }
        } else {
          setAiRuns((r) => r + ai);
          push(`AI bats ${ai} vs your ${mine} — +${ai}`);
          if (innings === 2 && aiRuns + ai >= target) {
            setWinner("ai");
            setPhase("done");
          }
        }
      }
    },
    [phase, innings, yourRuns, aiRuns, target],
  );

  const reset = () => {
    setPhase("toss");
    setBatFirst(null);
    setYourRuns(0);
    setAiRuns(0);
    setWicket(false);
    setLog([]);
    setYourHand(null);
    setAiHand(null);
    setInnings(1);
    setWinner(null);
  };

  const chasing = phase === "bat" && innings === 2;
  const youWin = winner === "you";

  return (
    <AppShell title="Hand Cricket">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🤚 Hand Cricket</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Schoolyard rules: match fingers to get the batter out. Bat, then bowl.
        </p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        {/* scoreboard */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-2xl border p-4 text-center ${batFirst === "you" ? "border-primary/50 bg-primary/5" : "border-border bg-surface"}`}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">You</p>
            <p className="text-3xl font-black text-foreground">{yourRuns}</p>
            {chasing && <p className="text-[11px] text-muted-foreground">need {target}</p>}
          </div>
          <div className={`rounded-2xl border p-4 text-center ${batFirst === "ai" ? "border-primary/50 bg-primary/5" : "border-border bg-surface"}`}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">AI</p>
            <p className="text-3xl font-black text-foreground">{aiRuns}</p>
            {phase === "bowl" && innings === 2 && <p className="text-[11px] text-muted-foreground">need {yourRuns + 1}</p>}
          </div>
        </div>

        {/* hands */}
        {(phase === "bat" || phase === "bowl") && (
          <>
            <div className="flex items-center justify-center gap-8 py-2">
              <div className="text-center">
                <p className="text-5xl">{yourHand ? EMOJI[yourHand] : "🤛"}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">you</p>
              </div>
              <p className="text-2xl font-black text-muted-foreground">VS</p>
              <div className="text-center">
                <p className="text-5xl">{aiHand ? EMOJI[aiHand] : "🤜"}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">AI</p>
              </div>
            </div>
            {wicket && <p className="text-center text-lg font-bold text-red-500">OUT! 🏏</p>}
            <div className="grid grid-cols-6 gap-2">
              {FINGERS.map((n) => (
                <button
                  key={n}
                  onClick={() => play(n)}
                  disabled={wicket}
                  className="rounded-xl border border-border bg-surface py-3 text-2xl transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-90 disabled:opacity-40"
                >
                  {EMOJI[n]}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {phase === "bat" ? "You're batting — tap your fingers" : "You're bowling — match the AI's fingers"}
            </p>
          </>
        )}

        {/* toss */}
        {phase === "toss" && (
          <div className="rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="mb-4 text-lg font-bold text-foreground">🪙 Call the toss</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => startToss("odd")} className="rounded-xl bg-primary px-6 py-3 font-semibold text-background active:scale-95">
                Odd
              </button>
              <button onClick={() => startToss("even")} className="rounded-xl bg-primary px-6 py-3 font-semibold text-background active:scale-95">
                Even
              </button>
            </div>
          </div>
        )}

        {/* innings break */}
        {phase === "innings-break" && <div className="rounded-2xl border border-border bg-surface p-6 text-center font-bold">Innings break</div>}

        {/* done */}
        {phase === "done" && (
          <div className="rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="text-4xl">{youWin ? "🏆" : "😤"}</p>
            <p className="mt-2 text-xl font-bold text-foreground">{youWin ? "You win!" : "AI wins!"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Final: {yourRuns} — {aiRuns}
            </p>
            <button onClick={reset} className="mt-4 rounded-xl bg-primary px-6 py-3 font-semibold text-background active:scale-95">
              Play again
            </button>
          </div>
        )}

        {/* log */}
        {log.length > 0 && phase !== "toss" && (
          <div className="rounded-2xl border border-border bg-surface p-3">
            {log.map((l, i) => (
              <p key={i} className={`py-0.5 text-xs ${i === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                {l}
              </p>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
