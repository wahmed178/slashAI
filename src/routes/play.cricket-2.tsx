import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { getGameBest, saveGameBest } from "@/lib/ux";
import { playTone } from "@/lib/play-sound";
import {
  BOWLS,
  DIFFICULTIES,
  FORMATS,
  LEAGUES,
  SHOTS,
  WICKETS,
  aiBowl,
  aiShot,
  buildRounds,
  campaignScore,
  commentaryKeyFor,
  currentInnings,
  emptyInnings,
  newInnings,
  nextMilestone,
  oversText,
  playerOfTheMatch,
  poolFor,
  randomCommentary,
  rollOutcome,
  teamById,
  type Bowl,
  type Difficulty,
  type Innings,
  type League,
  type MatchCtx,
  type Round,
  type Role,
  type Shot,
  type Team,
  type TourneyType,
} from "@/lib/games/cricket-2";

export const Route = createFileRoute("/play/cricket-2")({
  head: () => ({
    meta: [
      { title: "Cricket 2 - Cricket Champions Tournament | SlashAI" },
      {
        name: "description",
        content:
          "Cricket Champions tournament edition: pick a format, win the toss, call every shot and delivery, then chase a target through a knockout bracket. 1-5 overs, 3 difficulties, free and offline.",
      },
    ],
  }),
  component: Cricket2,
});

type Screen = "format" | "tourney" | "team" | "toss" | "match" | "bracket" | "result";

interface MatchState {
  screen: Screen;
  round: number;
  overs: number;
  difficulty: Difficulty;
  tourneyType: TourneyType;
  league: League;
  playerTeamId: string;
  opponentId: string;
  rounds: Round[];
  playerBatsFirst: boolean | null;
  innings: 1 | 2;
  first: Innings;
  second: Innings;
  striker: number;
  nonStriker: number;
  bowler: number;
  userAction: Role;
  commentary: { result: string; detail: string };
  busy: boolean;
  /** milestone (50/100/150/200) that still owes its popup before the next ball */
  milestonePending: number | null;
  scorecard: boolean;
  lastWon: boolean;
  resultDetail: string;
  careerRuns: number;
  matchesWon: number;
  savedBest: number | null;
}

type Action =
  | { type: "reset" }
  | { type: "pick"; screen?: Screen; patch?: Partial<MatchState> }
  | { type: "toss"; playerBatsFirst: boolean }
  | {
      type: "ball";
      outcome: { runs: number; wicket: boolean; four: boolean; six: boolean };
      note: string;
    }
  | { type: "resume" }
  | { type: "nextMatch" }
  | { type: "scorecard"; open: boolean };

const initial: MatchState = {
  screen: "format",
  round: 0,
  overs: 2,
  difficulty: "medium",
  tourneyType: "domestic",
  league: LEAGUES[0]!,
  playerTeamId: "",
  opponentId: "",
  rounds: [],
  playerBatsFirst: null,
  innings: 1,
  first: emptyInnings(),
  second: emptyInnings(),
  striker: 0,
  nonStriker: 1,
  bowler: 0,
  userAction: "bat",
  commentary: { result: "Match begins!", detail: "Get ready for the first delivery." },
  busy: false,
  milestonePending: null,
  scorecard: false,
  lastWon: false,
  resultDetail: "",
  careerRuns: 0,
  matchesWon: 0,
  savedBest: null,
};

/* ── team lookups ─────────────────────────────────────────────────── */

function me(s: MatchState): Team {
  return teamById(s.tourneyType, s.league, s.playerTeamId) ?? poolFor(s.tourneyType, s.league)[0]!;
}

function them(s: MatchState): Team {
  return teamById(s.tourneyType, s.league, s.opponentId) ?? me(s);
}

/** The side holding the bat, given who won the toss. */
function battingTeamOf(s: MatchState): Team {
  return s.playerBatsFirst ? me(s) : them(s);
}

function bowlingTeamOf(s: MatchState): Team {
  return s.playerBatsFirst ? them(s) : me(s);
}

function ctxOf(s: MatchState): MatchCtx {
  return {
    overs: s.overs,
    difficulty: s.difficulty,
    innings: s.innings,
    userAction: s.userAction,
    first: s.first,
    second: s.second,
    batting: battingTeamOf(s),
    bowling: bowlingTeamOf(s),
  };
}

function inningOf(s: MatchState): Innings {
  return currentInnings(s);
}

/* ── reducer ─────────────────────────────────────────────────────── */

function reducer(s: MatchState, a: Action): MatchState {
  switch (a.type) {
    case "reset":
      return { ...initial };

    case "pick":
      return { ...s, ...(a.screen ? { screen: a.screen } : {}), ...(a.patch ?? {}) };

    case "toss": {
      const batting = a.playerBatsFirst ? me(s) : them(s);
      const bowling = a.playerBatsFirst ? them(s) : me(s);
      return {
        ...s,
        screen: "match",
        playerBatsFirst: a.playerBatsFirst,
        innings: 1,
        first: newInnings(batting, bowling),
        second: emptyInnings(),
        striker: 0,
        nonStriker: 1,
        bowler: 0,
        userAction: a.playerBatsFirst ? "bat" : "bowl",
        busy: false,
        milestonePending: null,
        commentary: {
          result: "1st Innings",
          detail: `${batting.logo} ${batting.name} are batting, ${bowling.logo} ${bowling.name} bowling.`,
        },
      };
    }

    case "ball": {
      const wasInnings = s.innings;
      const inn: Innings = { ...inningOf(s) };
      const batsmen = inn.batsmen.map((b) => ({ ...b }));
      const bowlers = inn.bowlers.map((b) => ({ ...b }));
      const ev = a.outcome;
      const striker = batsmen[s.striker]!;
      const bowler = bowlers[s.bowler]!;

      let commentary: { result: string; detail: string };
      let strikerIdx = s.striker;
      let nonStrikerIdx = s.nonStriker;
      let careerRuns = s.careerRuns;

      if (ev.wicket) {
        inn.wickets += 1;
        batsmen[s.striker]!.out = true;
        bowlers[s.bowler]!.wickets += 1;
        commentary = {
          result: "WICKET!",
          detail: `${striker.name} is out! ${a.note} Bowled by ${bowler.name}.`,
        };
        if (inn.wickets < WICKETS) strikerIdx = inn.wickets + 1;
      } else {
        inn.runs += ev.runs;
        batsmen[s.striker]!.runs += ev.runs;
        batsmen[s.striker]!.balls += 1;
        if (ev.six) batsmen[s.striker]!.sixes += 1;
        if (ev.four) batsmen[s.striker]!.fours += 1;
        bowlers[s.bowler]!.balls += 1;
        bowlers[s.bowler]!.runs += ev.runs;
        if (s.userAction === "bat") careerRuns += ev.runs;

        const swapStrike = () => {
          const t = strikerIdx;
          strikerIdx = nonStrikerIdx;
          nonStrikerIdx = t;
        };

        if (ev.six) {
          commentary = {
            result: "SIX!",
            detail: `${striker.name} launches it! ${a.note} Off ${bowler.name}.`,
          };
        } else if (ev.four) {
          commentary = {
            result: "FOUR!",
            detail: `${striker.name} finds the rope! ${a.note} ${bowler.name} concedes.`,
          };
        } else if (ev.runs === 0) {
          commentary = {
            result: "Dot ball",
            detail: `${striker.name} faces ${bowler.name}. ${a.note}`,
          };
        } else if (ev.runs === 1) {
          commentary = { result: "1 run", detail: `${striker.name} picks up a single. ${a.note}` };
          swapStrike();
        } else if (ev.runs === 2) {
          commentary = { result: "2 runs", detail: `${striker.name} finds the gap! ${a.note}` };
        } else {
          commentary = { result: "3 runs", detail: `${striker.name} hustles! ${a.note}` };
          swapStrike();
        }
      }

      inn.balls += 1;
      inn.events = [...inn.events, ev];
      const milestone = nextMilestone(inn.runs, inn.milestones);
      if (milestone) inn.milestones = [...inn.milestones, milestone];

      let bowlerIdx = s.bowler;
      if (inn.balls % 6 === 0 && inn.balls < s.overs * 6) {
        const t = strikerIdx;
        strikerIdx = nonStrikerIdx;
        nonStrikerIdx = t;
        bowlerIdx = (s.bowler + 1) % Math.max(1, bowlers.length);
      }

      const base: MatchState = {
        ...s,
        striker: strikerIdx,
        nonStriker: nonStrikerIdx,
        bowler: bowlerIdx,
        commentary,
        careerRuns,
        ...(wasInnings === 1
          ? { first: { ...inn, batsmen, bowlers } }
          : { second: { ...inn, batsmen, bowlers } }),
      };

      const overDone = inn.balls >= s.overs * 6;
      const allOut = inn.wickets >= WICKETS;
      const chased = wasInnings === 2 && inn.runs > s.first.runs;

      if (!(overDone || allOut || chased)) {
        return { ...base, busy: true, milestonePending: milestone };
      }

      if (wasInnings === 1) {
        return {
          ...base,
          innings: 2,
          second: newInnings(bowlingTeamOf(base), battingTeamOf(base)),
          striker: 0,
          nonStriker: 1,
          bowler: 0,
          userAction: s.userAction === "bat" ? "bowl" : "bat",
          busy: true,
          milestonePending: null,
          commentary: {
            result: "End of 1st Innings",
            detail: `${base.first.runs}/${base.first.wickets} on the board. Target ${base.first.runs + 1}.`,
          },
        };
      }

      const playerInn = s.playerBatsFirst ? base.first : base.second;
      const aiInn = s.playerBatsFirst ? base.second : base.first;
      const won =
        playerInn.runs > aiInn.runs
          ? true
          : aiInn.runs > playerInn.runs
            ? false
            : Math.random() < 0.5;
      const margin = won
        ? s.playerBatsFirst
          ? `${playerInn.runs - aiInn.runs} runs`
          : `${WICKETS - playerInn.wickets} wickets`
        : s.playerBatsFirst
          ? `${aiInn.runs - playerInn.runs} runs`
          : `${WICKETS - aiInn.wickets} wickets`;
      const detail =
        playerInn.runs === aiInn.runs
          ? `Match tied — ${won ? me(s).name : them(s).name} wins on countback.`
          : `${won ? me(s).name : them(s).name} won by ${margin}.`;

      const rounds = s.rounds.map((r, i) => (i === s.round ? { ...r, won } : r));
      const isLast = s.round === s.rounds.length - 1;
      const matchesWon = s.matchesWon + (won ? 1 : 0);
      const score = campaignScore(s.careerRuns, matchesWon, won && isLast);
      const saved = saveGameBest("cricket-2", score) ? score : getGameBest("cricket-2");

      return {
        ...base,
        rounds,
        screen: won && !isLast ? "bracket" : "result",
        lastWon: won,
        matchesWon,
        resultDetail: detail,
        busy: false,
        milestonePending: null,
        savedBest: saved,
      };
    }

    case "resume":
      return { ...s, busy: false, milestonePending: null };

    case "nextMatch": {
      const round = s.round + 1;
      return {
        ...s,
        screen: "toss",
        round,
        opponentId: s.rounds[round]?.opponentId ?? s.opponentId,
        playerBatsFirst: null,
        innings: 1,
        first: emptyInnings(),
        second: emptyInnings(),
        commentary: { result: "", detail: "" },
        scorecard: false,
        busy: false,
        lastWon: false,
        milestonePending: null,
      };
    }

    case "scorecard":
      return { ...s, scorecard: a.open };
  }
}

/* ── component ────────────────────────────────────────────────────── */

type BallAt = "top" | "bat" | "out" | "none";

/** Static hover colours, so Tailwind can actually see the class names. */
const RISK_HOVER: Record<Shot["risk"], string> = {
  Low: "hover:border-emerald-500/60",
  Med: "hover:border-amber-400/60",
  High: "hover:border-orange-500/60",
  "V.High": "hover:border-red-500/60",
};

function Cricket2() {
  const [s, dispatch] = useReducer(reducer, initial);
  const [milestone, setMilestone] = useState<number | null>(null);
  const [confetti, setConfetti] = useState(0);
  const [ballAt, setBallAt] = useState<BallAt>("none");
  const [toss, setToss] = useState<{
    state: "call" | "spinning" | "done";
    result?: "heads" | "tails";
    won?: boolean;
  }>({ state: "call" });
  const [aiCall, setAiCall] = useState<Role | null>(null);
  const [best, setBest] = useState<number | null>(null);

  const timers = useRef<number[]>([]);
  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);
  useEffect(() => setBest(getGameBest("cricket-2")), []);

  // Only meaningful once a match has actually been played, so the empty
  // innings of the format and toss screens never produce a "player".
  const starPlayer = useMemo(
    () => (s.screen === "result" ? playerOfTheMatch(s.first, s.second) : null),
    [s.screen, s.first, s.second],
  );

  /** Between every ball: milestone popup, then hand control back. */
  useEffect(() => {
    if (s.screen !== "match" || !s.busy) return;
    const pending = s.milestonePending;
    const inn = inningOf(s);
    const overDone = inn.balls >= s.overs * 6;
    const allOut = inn.wickets >= WICKETS;
    const chased = s.innings === 2 && inn.runs > s.first.runs;
    const delay = pending ? 1900 : overDone || allOut || chased ? 1500 : 1200;

    const t = window.setTimeout(() => {
      if (pending) {
        setMilestone(pending);
        playTone("win");
        setConfetti((c) => c + 1);
        timers.current.push(window.setTimeout(() => setMilestone(null), 1700));
      }
      dispatch({ type: "resume" });
    }, delay);

    return () => window.clearTimeout(t);
  }, [s.busy, s]);

  /** When the opponent wins the toss they pick, then play starts. */
  useEffect(() => {
    if (s.screen !== "toss" || toss.state !== "done" || toss.won !== false || aiCall) return;
    const call: Role = Math.random() < 0.5 ? "bat" : "bowl";
    setAiCall(call);
    schedule(() => dispatch({ type: "toss", playerBatsFirst: call === "bowl" }), 1400);
  }, [s.screen, toss, aiCall, schedule]);

  const pool = poolFor(s.tourneyType, s.league);
  const myTeam = s.playerTeamId ? (pool.find((t) => t.id === s.playerTeamId) ?? null) : null;
  const opp = s.opponentId ? (pool.find((t) => t.id === s.opponentId) ?? null) : null;
  const format = FORMATS.find((f) => f.overs === s.overs) ?? FORMATS[1]!;
  const inn = inningOf(s);
  const ballsLeft = s.overs * 6 - inn.balls;
  const need = s.innings === 2 ? s.first.runs - inn.runs + 1 : 0;
  const rrr =
    s.innings === 2 && ballsLeft > 0 && need > 0 ? ((need / ballsLeft) * 6).toFixed(2) : "—";
  const crr = inn.balls > 0 ? ((inn.runs / inn.balls) * 6).toFixed(2) : "0.00";
  const phase = inn.balls < 6 ? "Powerplay" : ballsLeft <= 6 ? "Death" : "Middle";
  const tense = s.innings === 2 && ballsLeft <= 6 && need > 0 && need <= ballsLeft * 2;

  /* ── actions ───────────────────────────────────────────────────── */

  const startTournament = () => {
    playTone("flip");
    const rounds = buildRounds(s.tourneyType, s.league, s.playerTeamId, format);
    dispatch({
      type: "pick",
      screen: "toss",
      patch: { rounds, opponentId: rounds[0]?.opponentId ?? "" },
    });
    setToss({ state: "call" });
    setAiCall(null);
  };

  const callToss = (call: "heads" | "tails") => {
    playTone("roll");
    setToss({ state: "spinning" });
    schedule(() => {
      const result: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
      const won = call === result;
      playTone(won ? "success" : "fail");
      setToss({ state: "done", result, won });
    }, 1200);
  };

  const faceBall = (item: Shot | Bowl) => {
    const ctx = ctxOf(s);
    const userBatting = s.userAction === "bat";
    const delivery = userBatting ? aiBowl(ctx) : (item as Bowl);
    const shot = userBatting ? (item as Shot) : aiShot(ctx, delivery);

    dispatch({ type: "pick", patch: { busy: true } });
    playTone("tick");
    setBallAt("bat");

    schedule(() => {
      const outcome = rollOutcome(ctx, shot, delivery, userBatting);
      const note = randomCommentary(commentaryKeyFor(outcome));
      const tone = outcome.wicket
        ? userBatting
          ? "fail"
          : "success"
        : outcome.six || outcome.four
          ? userBatting
            ? "win"
            : "fail"
          : "tap";
      playTone(tone);
      setBallAt(outcome.six ? "top" : outcome.four ? "out" : "none");
      dispatch({ type: "ball", outcome, note });
    }, 380);
  };

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (s.screen !== "match" || s.busy) return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1) return;
      const list = s.userAction === "bat" ? SHOTS : BOWLS;
      const item = list[n - 1];
      if (item) faceBall(item);
    },
    // faceBall intentionally reads the current match state from this closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [s],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  const reset = () => {
    clearTimers();
    setMilestone(null);
    setBallAt("none");
    setConfetti(0);
    setAiCall(null);
    setToss({ state: "call" });
    dispatch({ type: "reset" });
  };

  /* ── render ────────────────────────────────────────────────────── */

  return (
    <AppShell title="Cricket 2">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          🏏 Cricket 2 — Champions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tournament edition — win the toss, call every shot and delivery, then chase a target
          through a knockout bracket.
        </p>
      </header>

      {confetti > 0 && <Confetti key={confetti} />}

      <div className="mx-auto max-w-2xl space-y-4">
        {/* ── 1. format + difficulty ── */}
        {s.screen === "format" && (
          <>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-3xl">🏆</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Knockout cricket in 1–5 overs. You call every shot or delivery, so the toss matters.
                Squads are fictional.
              </p>
              {best !== null && (
                <p className="mt-2 text-xs font-semibold text-primary">
                  Your best campaign: {best} pts
                </p>
              )}
            </div>

            <fieldset>
              <Legend>Format</Legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {FORMATS.map((f) => (
                  <PickCard
                    key={f.overs}
                    selected={s.overs === f.overs}
                    onClick={() => {
                      playTone("tap");
                      dispatch({ type: "pick", patch: { overs: f.overs } });
                    }}
                  >
                    <span className="block text-xl">{f.icon}</span>
                    <span className="mt-1 block text-[13px] font-bold text-foreground">
                      {f.name}
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">
                      {f.desc}
                    </span>
                  </PickCard>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <Legend>Difficulty</Legend>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((d) => (
                  <PickCard
                    key={d.id}
                    selected={s.difficulty === d.id}
                    onClick={() => {
                      playTone("tap");
                      dispatch({ type: "pick", patch: { difficulty: d.id } });
                    }}
                  >
                    <span className="block text-[13px] font-bold text-foreground">{d.name}</span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">{d.desc}</span>
                  </PickCard>
                ))}
              </div>
            </fieldset>

            <Primary
              onClick={() => {
                playTone("flip");
                dispatch({ type: "pick", screen: "tourney" });
              }}
            >
              Next →
            </Primary>
          </>
        )}

        {/* ── 2. competition ── */}
        {s.screen === "tourney" && (
          <>
            <fieldset>
              <Legend>Competition</Legend>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    {
                      id: "domestic",
                      icon: "🏟️",
                      name: "Domestic League",
                      desc: "Four fictional leagues",
                    },
                    {
                      id: "international",
                      icon: "🌍",
                      name: "International Cup",
                      desc: "Eight nations",
                    },
                  ] as { id: TourneyType; icon: string; name: string; desc: string }[]
                ).map((t) => (
                  <PickCard
                    key={t.id}
                    selected={s.tourneyType === t.id}
                    onClick={() => {
                      playTone("tap");
                      dispatch({ type: "pick", patch: { tourneyType: t.id, playerTeamId: "" } });
                    }}
                  >
                    <span className="block text-xl">{t.icon}</span>
                    <span className="mt-1 block text-[13px] font-bold text-foreground">
                      {t.name}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">{t.desc}</span>
                  </PickCard>
                ))}
              </div>
            </fieldset>

            {s.tourneyType === "domestic" && (
              <fieldset>
                <Legend>League</Legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {LEAGUES.map((l) => (
                    <PickCard
                      key={l.id}
                      selected={s.league.id === l.id}
                      onClick={() => {
                        playTone("tap");
                        dispatch({ type: "pick", patch: { league: l, playerTeamId: "" } });
                      }}
                    >
                      <span className="block text-xl">{l.icon}</span>
                      <span className="mt-1 block text-[13px] font-bold text-foreground">
                        {l.short}
                      </span>
                      <span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">
                        {l.name}
                      </span>
                    </PickCard>
                  ))}
                </div>
              </fieldset>
            )}

            <Primary
              onClick={() => {
                playTone("flip");
                dispatch({ type: "pick", screen: "team" });
              }}
            >
              Next →
            </Primary>
          </>
        )}

        {/* ── 3. team ── */}
        {s.screen === "team" && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.tourneyType === "domestic" ? s.league.name : "International Cup"} · pick a side
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {pool.map((t) => (
                <PickCard
                  key={t.id}
                  selected={s.playerTeamId === t.id}
                  onClick={() => {
                    playTone("tap");
                    dispatch({ type: "pick", patch: { playerTeamId: t.id } });
                  }}
                >
                  <span className="block text-2xl">{t.logo}</span>
                  <span className="mt-1 block text-[13px] font-bold text-foreground">{t.name}</span>
                  <span className="mt-0.5 block text-[10px] font-semibold text-primary">
                    ★ {t.rating}
                  </span>
                </PickCard>
              ))}
            </div>

            {myTeam && (
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Your squad
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {myTeam.players.map((p) => (
                    <div
                      key={p.name}
                      className="rounded-lg border border-border bg-surface-elevated px-2.5 py-2"
                    >
                      <p className="text-[12px] font-bold text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.role}</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-primary">{p.stat}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Primary onClick={startTournament} disabled={!s.playerTeamId}>
              Start tournament →
            </Primary>
          </>
        )}

        {/* ── 4. toss ── */}
        {s.screen === "toss" && myTeam && opp && (
          <div className="rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {s.rounds[s.round]?.round}
            </p>
            <h2 className="mt-1 text-lg font-bold text-foreground">
              {myTeam.logo} {myTeam.name} vs {opp.logo} {opp.name}
            </h2>
            <p className="mt-4 text-5xl">
              {toss.state === "spinning"
                ? "🪙"
                : toss.state === "done"
                  ? toss.result === "heads"
                    ? "👑"
                    : "🏏"
                  : "🪙"}
            </p>

            {toss.state === "call" && (
              <>
                <p className="mt-4 text-sm text-muted-foreground">Call it in the air.</p>
                <div className="mt-3 flex gap-2">
                  <Primary onClick={() => callToss("heads")}>Heads</Primary>
                  <Secondary onClick={() => callToss("tails")}>Tails</Secondary>
                </div>
              </>
            )}

            {toss.state === "done" && toss.won && (
              <>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {(toss.result ?? "heads").toUpperCase()} — you won the toss! 🎉
                </p>
                <div className="mt-3 flex gap-2">
                  <Primary
                    onClick={() => {
                      playTone("tap");
                      dispatch({ type: "toss", playerBatsFirst: true });
                    }}
                  >
                    🏏 Bat first
                  </Primary>
                  <Secondary
                    onClick={() => {
                      playTone("tap");
                      dispatch({ type: "toss", playerBatsFirst: false });
                    }}
                  >
                    🎯 Bowl first
                  </Secondary>
                </div>
              </>
            )}

            {toss.state === "done" && !toss.won && (
              <>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {(toss.result ?? "tails").toUpperCase()} — {opp.name} won the toss.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {opp.name} chose to {aiCall === "bowl" ? "🎯 bowl" : "🏏 bat"} first. Get ready…
                </p>
              </>
            )}
          </div>
        )}

        {/* ── 5. match ── */}
        {s.screen === "match" && (
          <>
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-border bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {s.rounds[s.round]?.round}
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                {s.innings === 1 ? "1st innings" : "2nd innings"}
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl border border-border bg-surface p-4">
              <ScoreBox
                team={me(s)}
                score={s.playerBatsFirst ? s.first : s.second}
                overs={s.overs}
                batting={!!s.playerBatsFirst}
              />
              <span className="text-xs font-black text-muted-foreground">VS</span>
              <ScoreBox
                team={them(s)}
                score={s.playerBatsFirst ? s.second : s.first}
                overs={s.overs}
                batting={!s.playerBatsFirst}
              />
            </div>

            {s.innings === 2 && (
              <div
                className={`rounded-xl border px-3 py-2 text-center text-[13px] font-bold ${
                  tense
                    ? "border-red-500/60 bg-red-500/10 text-red-400"
                    : "border-border bg-surface text-primary"
                }`}
              >
                🎯 Target {s.first.runs + 1} in {s.overs} over{s.overs > 1 ? "s" : ""}
                {tense && " — this is going to the wire"}
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 rounded-xl border border-border bg-surface p-3 text-center">
              <Stat
                label={s.innings === 2 ? "RRR" : "CRR"}
                value={s.innings === 2 ? rrr : crr}
                tone={tense ? "bad" : "good"}
              />
              <Stat
                label="Balls left"
                value={String(ballsLeft)}
                tone={ballsLeft <= 6 ? "warn" : "plain"}
              />
              <Stat
                label="Wickets"
                value={String(WICKETS - inn.wickets)}
                tone={inn.wickets >= 4 ? "bad" : "plain"}
              />
              <Stat label="Phase" value={phase} tone="good" />
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[300px] overflow-hidden rounded-full border-4 border-border bg-emerald-950 shadow-lg">
              <div className="absolute inset-[15%] rounded-full border-2 border-dashed border-emerald-400/25" />
              <div className="absolute left-1/2 top-1/2 h-[56%] w-[13%] -translate-x-1/2 -translate-y-1/2 rounded bg-amber-700/80" />
              <div className="absolute inset-x-0 top-[16%] h-0.5 bg-white/70" />
              <div className="absolute inset-x-0 bottom-[16%] h-0.5 bg-white/70" />
              <span className="absolute left-1/2 top-[13%] -translate-x-1/2 text-lg">🏃</span>
              <span className="absolute left-1/2 top-[22%] -translate-x-1/2 text-xl">🏏</span>
              <span
                className={`absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(248,113,113,0.7)] transition-all duration-500 ease-out ${
                  ballAt === "top"
                    ? "-top-0"
                    : ballAt === "bat"
                      ? "top-[52%]"
                      : ballAt === "out"
                        ? "left-[86%] top-[34%]"
                        : "left-1/2 top-[22%] opacity-0"
                }`}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 rounded-xl border border-border bg-surface p-3">
              {inn.events.length === 0 && (
                <p className="text-[11px] text-muted-foreground">No balls bowled yet</p>
              )}
              {inn.events.slice(-18).map((b, i) => (
                <span
                  key={`${i}-${b.runs}-${b.wicket}`}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold ${
                    b.wicket
                      ? "border-red-500 bg-red-500 text-white"
                      : b.six
                        ? "border-amber-400 bg-amber-400 text-black"
                        : b.four
                          ? "border-emerald-500 bg-emerald-500 text-black"
                          : "border-border bg-surface-elevated text-muted-foreground"
                  }`}
                >
                  {b.wicket ? "W" : b.runs}
                </span>
              ))}
            </div>

            <div className="rounded-xl border-l-4 border-primary bg-surface p-3">
              <p className="text-sm font-bold text-foreground">{s.commentary.result}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                {s.commentary.detail}
              </p>
            </div>

            <button
              onClick={() => dispatch({ type: "scorecard", open: !s.scorecard })}
              className="h-9 w-full rounded-lg border border-border bg-surface text-[12px] font-semibold text-muted-foreground"
            >
              {s.scorecard ? "Hide scorecard" : "📊 Show scorecard"}
            </button>

            {s.scorecard && (
              <div className="space-y-3 rounded-xl border border-border bg-surface p-3">
                <ScoreTable
                  title={`🏏 ${battingTeamOf(s).name}`}
                  headers={["Batsman", "R", "B", "4s", "6s", "SR"]}
                  rows={inn.batsmen.map((b, i) => ({
                    key: b.name,
                    name: b.name,
                    onStrike: !b.out && i === s.striker,
                    out: b.out,
                    cells: [
                      String(b.runs),
                      String(b.balls),
                      String(b.fours),
                      String(b.sixes),
                      b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0",
                    ],
                  }))}
                />
                <ScoreTable
                  title={`🎯 ${bowlingTeamOf(s).name}`}
                  headers={["Bowler", "O", "R", "W", "Econ"]}
                  rows={inn.bowlers.map((b, i) => ({
                    key: b.name,
                    name: b.name,
                    onStrike: i === s.bowler,
                    out: false,
                    cells: [
                      oversText(b.balls),
                      String(b.runs),
                      String(b.wickets),
                      b.balls > 0 ? ((b.runs / b.balls) * 6).toFixed(2) : "0.00",
                    ],
                  }))}
                />
              </div>
            )}

            <div className="rounded-2xl border border-border bg-surface p-3">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {s.userAction === "bat" ? "🏏 Choose your shot" : "🎯 Choose your delivery"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {s.userAction === "bat"
                  ? SHOTS.map((sh, i) => (
                      <button
                        key={sh.id}
                        type="button"
                        disabled={s.busy}
                        onClick={() => faceBall(sh)}
                        className={`rounded-xl border border-border bg-surface-elevated p-2 text-center transition-colors disabled:opacity-40 ${RISK_HOVER[sh.risk]}`}
                      >
                        <span className="block text-lg">{sh.icon}</span>
                        <span className="block text-[12px] font-bold text-foreground">
                          {sh.name}
                        </span>
                        <span className="block text-[9px] text-muted-foreground">
                          {i + 1} · {sh.risk} risk
                        </span>
                      </button>
                    ))
                  : BOWLS.map((b, i) => (
                      <button
                        key={b.id}
                        type="button"
                        disabled={s.busy}
                        onClick={() => faceBall(b)}
                        className="rounded-xl border border-border bg-surface-elevated p-2 text-center transition-colors hover:border-primary/60 disabled:opacity-40"
                      >
                        <span className="block text-lg">{b.icon}</span>
                        <span className="block text-[12px] font-bold text-foreground">
                          {b.name}
                        </span>
                        <span className="block text-[9px] text-muted-foreground">
                          {i + 1} · {b.desc}
                        </span>
                      </button>
                    ))}
              </div>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                Keys {s.userAction === "bat" ? "1–6" : "1–7"} pick an option.
              </p>
            </div>
          </>
        )}

        {/* ── 6. bracket ── */}
        {s.screen === "bracket" && (
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-3xl">🎉</p>
            <h2 className="mt-1 text-lg font-bold text-foreground">Advance to the next round</h2>
            <p className="mt-1 text-sm text-muted-foreground">{s.resultDetail}</p>

            <div className="mt-4 space-y-2">
              {s.rounds.map((r, i) => {
                const o = teamById(s.tourneyType, s.league, r.opponentId);
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-[11px] ${
                      i === s.round
                        ? "border-primary/60 bg-primary/10"
                        : "border-border bg-surface-elevated"
                    }`}
                  >
                    <span className="shrink-0 font-semibold text-muted-foreground">{r.round}</span>
                    <span className={r.won ? "font-bold text-emerald-500" : "text-foreground"}>
                      {me(s).logo} {me(s).name}
                      {r.won ? " ✓" : ""}
                    </span>
                    <span className="text-muted-foreground">vs</span>
                    <span
                      className={r.won === false ? "font-bold text-emerald-500" : "text-foreground"}
                    >
                      {o ? `${o.logo} ${o.name}` : "TBD"}
                      {r.won === false ? " ✓" : ""}
                    </span>
                  </div>
                );
              })}
            </div>

            <Primary
              className="mt-4"
              onClick={() => {
                playTone("flip");
                setToss({ state: "call" });
                setAiCall(null);
                dispatch({ type: "nextMatch" });
              }}
            >
              Next: {s.rounds[s.round + 1]?.round} →
            </Primary>
          </div>
        )}

        {/* ── 7. result ── */}
        {s.screen === "result" && (
          <div className="rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="text-5xl">{s.lastWon ? "🏆" : "🥈"}</p>
            <h2 className="mt-2 text-xl font-black text-foreground">
              {s.lastWon ? "CHAMPIONS!" : "Tournament over"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {s.lastWon ? `${me(s).name} won the ${s.league.short} trophy.` : s.resultDetail}
            </p>

            <div className="mx-auto mt-5 max-w-sm text-left">
              <InfoRow label="Tournament" value={`${s.league.icon} ${s.league.name}`} />
              <InfoRow label="Format" value={`${format.name} · ${s.difficulty}`} />
              <InfoRow label="Your team" value={`${me(s).logo} ${me(s).name}`} />
              <InfoRow label="Final opponent" value={`${them(s).logo} ${them(s).name}`} />
              <InfoRow label="Your runs" value={String(s.careerRuns)} />
              <InfoRow label="Matches won" value={String(s.matchesWon)} />
              {starPlayer && (
                <div className="mt-3 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2.5">
                  <p className="text-[9px] font-bold tracking-[0.18em] text-amber-400/80 uppercase">
                    Player of the match
                  </p>
                  <p className="text-[13px] font-bold text-foreground">
                    ⭐ {starPlayer.name}
                    <span className="ml-1.5 font-normal text-muted-foreground">
                      {starPlayer.line}
                    </span>
                  </p>
                </div>
              )}

              <InfoRow
                label="Your best"
                value={s.savedBest !== null ? `${s.savedBest} pts` : "—"}
              />
            </div>

            <p className="mt-3 text-[11px] text-muted-foreground">
              Campaign score = your runs + 200 per win + 500 for the trophy.
            </p>

            <Primary className="mt-4" onClick={reset}>
              🔄 Play again
            </Primary>
          </div>
        )}
      </div>

      {milestone !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="rounded-3xl border-2 border-amber-400 bg-surface px-10 py-8 text-center shadow-2xl">
            <p className="text-5xl">{milestone >= 150 ? "🔥" : milestone >= 100 ? "💯" : "🎉"}</p>
            <p className="mt-2 bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-3xl font-black capitalize text-transparent">
              {milestone === 50
                ? "fifty!"
                : milestone === 100
                  ? "century!"
                  : milestone === 150
                    ? "one-fifty!"
                    : "two hundred!"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {battingTeamOf(s).logo} {battingTeamOf(s).name}
            </p>
          </div>
        </div>
      )}
    </AppShell>
  );
}

/* ── presentational pieces ────────────────────────────────────────── */

function Legend({ children }: { children: ReactNode }) {
  return (
    <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
      {children}
    </legend>
  );
}

function PickCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border p-3 text-center transition-colors ${
        selected
          ? "border-primary/60 bg-primary/10"
          : "border-border bg-surface hover:bg-surface-elevated"
      }`}
    >
      {children}
    </button>
  );
}

function Primary({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-12 flex-1 rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

function Secondary({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-12 flex-1 rounded-xl border border-border bg-surface-elevated text-sm font-bold text-foreground"
    >
      {children}
    </button>
  );
}

function ScoreBox({
  team,
  score,
  overs,
  batting,
}: {
  team: Team;
  score: Innings;
  overs: number;
  batting: boolean;
}) {
  return (
    <div className="text-center">
      <span className="block text-xl">{team.logo}</span>
      <span className="mt-0.5 block text-[11px] font-bold text-foreground">{team.name}</span>
      {batting && (
        <span className="mt-0.5 inline-block rounded-full bg-primary px-1.5 py-px text-[8px] font-black text-primary-foreground">
          BATTING
        </span>
      )}
      <p className="mt-1 text-xl font-black text-amber-400">
        {score.runs}/{score.wickets}
      </p>
      <p className="text-[10px] text-muted-foreground">
        ({oversText(score.balls)}/{overs})
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "good" | "warn" | "bad" | "plain";
}) {
  const color =
    tone === "bad"
      ? "text-red-400"
      : tone === "warn"
        ? "text-amber-400"
        : tone === "good"
          ? "text-emerald-400"
          : "text-foreground";
  return (
    <div>
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`text-[13px] font-bold ${color}`}>{value}</p>
    </div>
  );
}

function ScoreTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: { key: string; name: string; onStrike: boolean; out: boolean; cells: string[] }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{title}</p>
      <div className="mt-1 overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-left text-muted-foreground">
              {headers.map((h) => (
                <th key={h} className="py-1 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.key}
                className={r.out ? "text-muted-foreground line-through" : "text-foreground"}
              >
                <td className="py-1 font-semibold">
                  {r.name}
                  {r.onStrike && <span className="ml-1 text-primary">*</span>}
                </td>
                {r.cells.map((c, i) => (
                  <td key={i} className="py-1">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 text-[12px] last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

const CONFETTI_COLORS = ["#ffd700", "#00d9a3", "#ff4757", "#4a90ff", "#a855f7", "#fb923c"];

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        drift: Math.random() * 60 - 30,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {bits.map((b) => (
        <span
          key={b.id}
          className="absolute top-0 h-2.5 w-2.5 animate-bounce rounded-sm"
          style={{
            left: `${b.left}%`,
            backgroundColor: b.color,
            animationDelay: `${b.delay}s`,
            animationDuration: `${1 + (b.id % 5) * 0.15}s`,
            transform: `translateX(${b.drift}px)`,
          }}
        />
      ))}
    </div>
  );
}
