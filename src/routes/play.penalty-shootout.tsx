import { useCallback, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/penalty-shootout")({ component: PenaltyShootout });

/**
 * Penalty Shootout — the real 5-round format. You take five penalties against
 * an AI keeper, then you go in goal and face five yourself. Zones are the six
 * a keeper actually covers: low/high × left/centre/right.
 */

type Zone = "TL" | "TC" | "TR" | "BL" | "BC" | "BR";
const ZONES: Zone[] = ["TL", "TC", "TR", "BL", "BC", "BR"];
const LABEL: Record<Zone, string> = {
  TL: "Top left",
  TC: "Top centre",
  TR: "Top right",
  BL: "Low left",
  BC: "Low centre",
  BR: "Low right",
};

/** keepers are stronger at low shots and down the middle — that is real football */
const SAVE_WEIGHT: Record<Zone, number> = { TL: 0.34, TC: 0.22, TR: 0.34, BL: 0.44, BC: 0.30, BR: 0.44 };

const KEEPER_SKILL = { Easy: 0.55, Medium: 0.8, Hard: 1.12 } as const;
type Level = keyof typeof KEEPER_SKILL;

function aiDive(): Zone {
  return ZONES[Math.floor(Math.random() * ZONES.length)]!;
}

function keepsOut(zone: Zone, dive: Zone, skill: number): boolean {
  if (dive === zone) return Math.random() < Math.min(0.94, SAVE_WEIGHT[zone] * 2.1 * skill);
  // a keeper who guessed the wrong side still occasionally gets a strong hand to it
  const neighbour = ZONES.slice(0, 3).indexOf(zone) === ZONES.slice(3).indexOf(dive);
  return neighbour && Math.random() < 0.22 * skill;
}

interface Kick {
  zone: Zone;
  scored: boolean;
  dive: Zone;
}

function PenaltyShootout() {
  const [level, setLevel] = useState<Level>("Medium");
  const [phase, setPhase] = useState<"idle" | "shoot" | "save" | "over">("idle");
  const [round, setRound] = useState(1);
  const [yourGoals, setYourGoals] = useState(0);
  const [aiGoals, setAiGoals] = useState(0);
  const [yourKicks, setYourKicks] = useState<Kick[]>([]);
  const [aiKicks, setAiKicks] = useState<Kick[]>([]);
  const [last, setLast] = useState<{ text: string; good: boolean } | null>(null);
  const [dive, setDive] = useState<Zone | null>(null);

  const best = useMemo(() => Number(localStorage.getItem("slashai.penalty.wins")) || 0, []);
  const [wins, setWins] = useState(best);

  const start = useCallback(() => {
    setPhase("shoot");
    setRound(1);
    setYourGoals(0);
    setAiGoals(0);
    setYourKicks([]);
    setAiKicks([]);
    setLast(null);
    setDive(null);
  }, []);

  /** you shoot */
  const shoot = (zone: Zone) => {
    if (phase !== "shoot") return;
    const keeperDive = aiDive();
    const scored = !keepsOut(zone, keeperDive, KEEPER_SKILL[level]);
    setYourKicks((k) => [...k, { zone, scored, dive: keeperDive }]);
    if (scored) setYourGoals((g) => g + 1);
    setLast({
      text: scored
        ? `GOAL! You went ${LABEL[zone].toLowerCase()} and the keeper dived ${LABEL[keeperDive].toLowerCase()}.`
        : `SAVED — the keeper read your ${LABEL[zone].toLowerCase()} shot.`,
      good: scored,
    });
    setPhase("save");
    setDive(null);
  };

  /** you keep — AI shoots */
  const chooseDive = (zone: Zone) => {
    if (phase !== "save") return;
    setDive(zone);
    const shot = aiDive();
    const scored = !keepsOut(shot, zone, 1.35 / KEEPER_SKILL[level]);
    setAiKicks((k) => [...k, { zone: shot, scored, dive: zone }]);
    if (scored) setAiGoals((g) => g + 1);
    setLast({
      text: scored
        ? `AI scored — it went ${LABEL[shot].toLowerCase()}, you dived ${LABEL[zone].toLowerCase()}.`
        : `SAVED! You guessed ${LABEL[zone].toLowerCase()} and it went ${LABEL[shot].toLowerCase()}.`,
      good: !scored,
    });
    if (round >= 5) {
      const finalYou = yourGoals + 0;
      setPhase("over");
      const decided = finalYou > aiGoals + (scored ? 1 : 0);
      if (decided) {
        const nb = wins + 1;
        setWins(nb);
        localStorage.setItem("slashai.penalty.wins", String(nb));
      }
    } else {
      setRound((r) => r + 1);
      setPhase("shoot");
    }
  };

  const youWon = yourGoals > aiGoals;
  const drawn = yourGoals === aiGoals;

  return (
    <AppShell title="Penalty Shootout">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⚽ Penalty Shootout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Five penalties each: you shoot, then you dive. Low and central shots are easier to save — that is real goalkeeping.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">You</p>
            <p className="text-[20px] font-black text-[#2dd4bf]">
              {yourGoals}
              <span className="text-[12px] text-muted-foreground">/{Math.max(yourKicks.length, 5)}</span>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Shootout wins</p>
            <p className="text-[20px] font-black text-foreground">{wins}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">AI</p>
            <p className="text-[20px] font-black text-[#f472b6]">
              {aiGoals}
              <span className="text-[12px] text-muted-foreground">/{Math.max(aiKicks.length, 5)}</span>
            </p>
          </div>
        </div>

        {/* goal mouth */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface">
          <div
            className="relative grid grid-cols-3 grid-rows-2 gap-1.5 p-3"
            style={{
              background: "linear-gradient(180deg, #0b3d2e 0%, #166534 55%, #14532d 100%)",
              minHeight: 300,
            }}
          >
            {/* netting */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 opacity-25"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            {ZONES.map((z) => {
              const isDive = dive === z;
              return (
                <button
                  key={z}
                  disabled={phase === "idle" || phase === "over"}
                  onClick={() => (phase === "shoot" ? shoot(z) : chooseDive(z))}
                  className={`relative z-10 flex min-h-[120px] flex-col items-center justify-center rounded-lg border text-center transition-all duration-150 ${
                    isDive
                      ? "border-amber-300 bg-amber-400/25"
                      : "border-white/25 bg-white/5 hover:border-white/60 hover:bg-white/15"
                  } ${phase === "idle" || phase === "over" ? "cursor-default opacity-70" : "cursor-pointer"}`}
                >
                  <span className="text-[11px] font-bold tracking-wide text-white/85">
                    {phase === "save" ? "DIVE HERE" : phase === "shoot" ? "SHOOT HERE" : LABEL[z]}
                  </span>
                </button>
              );
            })}

            {phase === "idle" && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/70 px-6 text-center">
                <p className="text-[22px] font-black text-foreground">⚽ Penalty Shootout</p>
                <div className="flex gap-1.5">
                  {(Object.keys(KEEPER_SKILL) as Level[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                        level === l ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <button onClick={start} className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-background">
                  ▶ Step up
                </button>
              </div>
            )}

            {phase === "over" && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/80 px-6 text-center">
                <p className="text-[26px] font-black text-foreground">
                  {drawn ? "🤝 All square" : youWon ? "🏆 You win the shootout!" : "😤 AI wins the shootout"}
                </p>
                <p className="text-[15px] text-muted-foreground">
                  {yourGoals} – {aiGoals}
                </p>
                <button onClick={start} className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-background">
                  ↻ Another shootout
                </button>
              </div>
            )}
          </div>
        </div>

        {last && phase !== "idle" && (
          <p className={`text-center text-[12px] font-semibold ${last.good ? "text-emerald-400" : "text-red-400"}`}>{last.text}</p>
        )}

        <p className="text-center text-[11px] text-muted-foreground">
          {phase === "shoot" && `Penalty ${round} of 5 — pick your corner.`}
          {phase === "save" && `Penalty ${round} of 5 — pick where you dive.`}
          {phase === "over" && "Shootout finished."}
          {phase === "idle" && "You shoot first, then you keep."}
        </p>
      </div>
    </AppShell>
  );
}
