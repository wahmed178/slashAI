import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/tools/trolley")({ component: Trolley });

interface Dilemma {
  title: string;
  scenario: string;
  trackA: string;
  trackB: string;
  note: string;
}

const DILEMMAS: Dilemma[] = [
  {
    title: "The Classic",
    scenario: "A runaway trolley is heading toward five people. You can pull the lever to divert it to the other track.",
    trackA: "Five people are hit",
    trackB: "One person is hit",
    note: "Most people pull. Utilitarians say the math is simple; deontologists say using the death of one as a means is different from letting five die.",
  },
  {
    title: "The Fat Man",
    scenario: "This time there is no lever. But you stand next to a large stranger on a bridge; pushing him off stops the trolley with his body.",
    trackA: "Five people die",
    trackB: "You push the stranger to his death",
    note: "Most people refuse, even though the arithmetic is identical to the classic. Physical force feels morally different from a distant switch.",
  },
  {
    title: "The Surgeon",
    scenario: "Five patients need organs. A healthy tourist is in the waiting room, a match for all five. Harvest him quietly and all live.",
    trackA: "Five patients die",
    trackB: "Harvest the tourist's organs",
    note: "Nearly everyone refuses. Killing an innocent as a means to an end is the strongest taboo in the philosophy of harm.",
  },
  {
    title: "The Loop",
    scenario: "Diverting the trolley loops it back to the five. The only thing stopping it is one person on the side track, whose body halts it.",
    trackA: "Five die",
    trackB: "One dies as the trolley-stopper",
    note: "The 'loop' case: philosophically it mirrors the fat man, yet people's intuitions are split almost evenly. Framing changes everything.",
  },
  {
    title: "The Self",
    scenario: "You can throw yourself in front of the trolley to save five. A 100% certain death for you.",
    trackA: "Five people die",
    trackB: "You sacrifice yourself",
    note: "Almost everyone says yes. We weigh our own deaths far more lightly when they buy five lives - heroism is intuitive.",
  },
  {
    title: "The Actor",
    scenario: "A famous actor is on the side track. Pulling the lever kills him, but his future films would raise millions for charity.",
    trackA: "Five ordinary people die",
    trackB: "One actor dies; charity gains millions",
    note: "Welcome to consequentialism's dark side: if outcomes are all that matter, a famous life can outweigh five. Most people still refuse.",
  },
  {
    title: "The Baby",
    scenario: "A trolley heads toward five adults. You can divert it onto a track with one newborn baby.",
    trackA: "Five adults die",
    trackB: "One baby dies",
    note: "One of the most debated variants. Philosophers genuinely disagree - some studies find a slim majority divert, many refuse.",
  },
  {
    title: "The Genius",
    scenario: "On the side track stands the scientist who was about to cure cancer. The five on the main track are strangers.",
    trackA: "Five strangers die",
    trackB: "The scientist dies before curing cancer",
    note: "Do we count lives not yet saved? Most say no, but this is exactly how governments prioritise vaccine and AI safety funding.",
  },
  {
    title: "The Driver",
    scenario: "You are driving the trolley. You cannot stop it. Brake failure. The lever is in your cab.",
    trackA: "Five die while you watch",
    trackB: "One dies by your steering choice",
    note: "Agency changes feeling: as the driver, pulling the lever is your duty to some (you chose the lesser harm) and murder to others.",
  },
  {
    title: "The Twin Trolleys",
    scenario: "Two trolleys. Each lever diverts its trolley onto a track with one person. Do nothing: five die on one track, one on the other anyway.",
    trackA: "Five plus one die",
    trackB: "Divert both: two die",
    note: "Multiple dilemmas stack intuition errors - we judge each lever separately but the totals decide the outcome. Congestion pricing, anyone?",
  },
];

function Trolley() {
  const [index, setIndex] = useState(0);
  const [pull, setPull] = useState<boolean | null>(null);
  const [pulls, setPulls] = useState(0);
  const [noPulls, setNoPulls] = useState(0);

  const d = DILEMMAS[index]!;
  const isLast = index === DILEMMAS.length - 1;

  const answer = (choice: boolean) => {
    if (pull !== null) return;
    setPull(choice);
    if (choice) setPulls((p) => p + 1);
    else setNoPulls((p) => p + 1);
  };

  const next = () => {
    if (isLast) {
      setIndex(0);
      setPull(null);
      setPulls(0);
      setNoPulls(0);
      return;
    }
    setIndex((i) => i + 1);
    setPull(null);
  };

  return (
    <AppShell title="Trolley Problems">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🚋 Trolley Problems</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ten ethical dilemmas. Pull the lever - or don't. There are no right answers, only revealed values.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            Dilemma {index + 1} of {DILEMMAS.length}
          </span>
          <span>
            Pulled: <b className="text-foreground">{pulls}</b> · Spared: <b className="text-foreground">{noPulls}</b>
          </span>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-3 flex items-center justify-center gap-2 text-2xl" aria-hidden>
            <span>🚋</span>
            <span className="text-muted-foreground">──── ⚡ ────</span>
          </div>
          <h2 className="text-center text-lg font-bold text-foreground">{d.title}</h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">{d.scenario}</p>

          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              onClick={() => answer(false)}
              disabled={pull !== null}
              className={`rounded-lg border p-3.5 text-left text-sm transition-colors disabled:opacity-60 ${
                pull === false
                  ? "border-primary bg-primary/10 font-semibold text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <span className="mb-1 block text-[10px] font-bold tracking-widest text-muted-foreground/70">DO NOTHING</span>
              {d.trackA}
            </button>
            <button
              onClick={() => answer(true)}
              disabled={pull !== null}
              className={`rounded-lg border p-3.5 text-left text-sm transition-colors disabled:opacity-60 ${
                pull === true
                  ? "border-primary bg-primary/10 font-semibold text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <span className="mb-1 block text-[10px] font-bold tracking-widest text-muted-foreground/70">PULL THE LEVER</span>
              {d.trackB}
            </button>
          </div>

          {pull !== null && (
            <div className="mt-4 rounded-lg bg-muted/60 p-3.5">
              <p className="text-[11px] font-bold tracking-widest text-primary">THE PHILOSOPHY</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.note}</p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={next}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {isLast ? "Start over" : "Next dilemma"}
                </button>
                {isLast && (
                  <span className="text-[11px] text-muted-foreground">
                    Final tally: {pulls} pulled / {noPulls} spared
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <RotateCcw className="size-3" /> your tally resets after the tenth dilemma
        </div>
      </div>
    </AppShell>
  );
}
