import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/fake-or-fact")({ component: FakeOrFact });

interface Claim {
  statement: string;
  isFact: boolean;
  explain: string;
}

const CLAIMS: Claim[] = [
  { statement: "Octopuses have three hearts.", isFact: true, explain: "Two pump blood to the gills, one to the body. The main one stops when they swim, which is why they prefer crawling." },
  { statement: "Goldfish only remember things for 3 seconds.", isFact: false, explain: "Goldfish can remember things for months and can even be trained to respond to sounds and colours." },
  { statement: "Bananas are berries, but strawberries are not.", isFact: true, explain: "Botanically, berries develop from a single ovary. Strawberries are 'accessory fruits'; bananas qualify as berries." },
  { statement: "Humans only use 10% of their brains.", isFact: false, explain: "Brain imaging shows virtually all regions are active over a day. The '10%' idea is a persistent myth." },
  { statement: "Honey never spoils.", isFact: true, explain: "Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still edible, thanks to low moisture and acidity." },
  { statement: "Lightning never strikes the same place twice.", isFact: false, explain: "The Empire State Building is struck about 20-25 times a year. Tall structures get hit repeatedly." },
  { statement: "A day on Venus is longer than its year.", isFact: true, explain: "Venus rotates once every 243 Earth days but orbits the Sun in 225. Its day really is longer than its year." },
  { statement: "The Great Wall of China is visible from the Moon with the naked eye.", isFact: false, explain: "Astronauts confirm it is not visible from the Moon. From low orbit it is barely distinguishable from rivers." },
  { statement: "Wombat poop is cube-shaped.", isFact: true, explain: "Their intestines have variable elasticity, shaping droppings into cubes that don't roll away - used to mark territory." },
  { statement: "Sharks are immune to all diseases, including cancer.", isFact: false, explain: "Sharks do get cancer, including cancers of their cartilage. The myth fueled a wasteful shark-cartilage supplement industry." },
  { statement: "There are more possible chess games than atoms in the observable universe.", isFact: true, explain: "The Shannon number estimates 10^120 possible games versus roughly 10^80 atoms. Chess dwarfs the physical universe." },
  { statement: "Bats are blind.", isFact: false, explain: "All bat species can see, many quite well. They use echolocation in addition to vision, not instead of it." },
  { statement: "The Eiffel Tower can grow more than 15 cm taller in summer.", isFact: true, explain: "Thermal expansion of its iron structure makes the tower grow up to about 15-30 cm on hot days and lean away from the sun." },
  { statement: "You swallow an average of 8 spiders in your lifetime while sleeping.", isFact: false, explain: "Spiders have no reason to crawl into a breathing, vibrating mouth. This famous 'fact' was invented to show how easily misinformation spreads." },
  { statement: "Scotland's national animal is the unicorn.", isFact: true, explain: "It has been an official heraldic symbol of Scotland for centuries, representing purity and power." },
  { statement: "Clocks in ads always show 10:10 because it looks like a smile.", isFact: true, explain: "Watch brands set hands to 10:10 to frame the logo symmetrically and create a visually 'smiling' face." },
  { statement: "Goldfish grow to the size of their tank.", isFact: false, explain: "They grow stunted in small tanks due to poor water quality, but left in a pond they can reach 30 cm or more." },
  { statement: "Peanuts are an ingredient in dynamite.", isFact: true, explain: "Peanuts can be used to produce glycerol, which is used to make nitroglycerin - though industrial dynamite doesn't rely on peanuts." },
  { statement: "The inventor of the Pringles can is buried in one.", isFact: true, explain: "Fredric Baur designed the can and was so proud that part of his ashes was buried in a Pringles can in 2008." },
  { statement: "Napoleon was unusually short.", isFact: false, explain: "He was about 1.68 m - average for his era. British propaganda and French-vs-English unit confusion created the myth." },
];

const ROUNDS = 10;

function pickOrder(): number[] {
  const arr = CLAIMS.map((_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr.slice(0, ROUNDS);
}

function FakeOrFact() {
  const [order, setOrder] = useState<number[]>(pickOrder);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<"fact" | "fake" | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const claim = useMemo(() => CLAIMS[order[idx] ?? 0] ?? CLAIMS[0]!, [order, idx]);

  const answerIt = (choice: "fact" | "fake") => {
    if (answer) return;
    setAnswer(choice);
    const correct = (choice === "fact") === claim.isFact;
    if (correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= order.length) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setAnswer(null);
  };

  const restart = () => {
    setOrder(pickOrder());
    setIdx(0);
    setAnswer(null);
    setScore(0);
    setDone(false);
  };

  const wasRight = answer !== null && (answer === "fact") === claim.isFact;

  if (done) {
    return (
      <AppShell title="Fake or Fact">
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">🧐 Fake or Fact</h1>
        </header>
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-5xl">{score >= 9 ? "🏆" : score >= 7 ? "🧠" : "📰"}</p>
          <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{score}/{ROUNDS}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {score >= 9 ? "Fact-checking machine. Media outlets could hire you." : score >= 7 ? "Sharp instincts against misinformation." : score >= 5 ? "Solid - the internet still fools you sometimes." : "The internet wins this round. Try again!"}
          </p>
          <button
            onClick={restart}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <RotateCcw className="size-3.5" /> New round
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Fake or Fact">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🧐 Fake or Fact</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real claim or internet nonsense? Trust your gut.</p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Round {idx + 1} of {ROUNDS}</span>
          <span>Score: <b className="text-foreground">{score}</b></span>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground">TRUE OR FALSE?</p>
          <p className="mt-3 text-lg font-semibold leading-relaxed text-foreground">"{claim.statement}"</p>
        </div>

        {!answer ? (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => answerIt("fact")}
              className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 py-4 text-sm font-bold text-emerald-400 transition-all hover:-translate-y-0.5 hover:border-emerald-500"
            >
              ✅ FACT
            </button>
            <button
              onClick={() => answerIt("fake")}
              className="rounded-xl border-2 border-rose-500/40 bg-rose-500/10 py-4 text-sm font-bold text-rose-400 transition-all hover:-translate-y-0.5 hover:border-rose-500"
            >
              ❌ FAKE
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`rounded-xl border p-4 ${wasRight ? "border-emerald-500/40 bg-emerald-500/10" : "border-rose-500/40 bg-rose-500/10"}`}>
              <p className="text-sm font-bold text-foreground">
                {wasRight ? "Correct!" : "Nope!"} This one is {claim.isFact ? "FACT" : "FAKE"}.
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{claim.explain}</p>
            </div>
            <button
              onClick={next}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {idx + 1 >= ROUNDS ? "See results" : "Next claim"}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
