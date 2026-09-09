import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { ArrowLeft, ArrowRight, Trophy } from "lucide-react";

export const Route = createFileRoute("/tools/wiki-speedrun")({ component: WikiSpeedrun });

/** small curated pool of start → target pairs; verified links between well-known pages */
const CHALLENGES: { start: string; target: string; hint: string }[] = [
  { start: "Pizza", target: "Albert Einstein", hint: "Think flour, then physics" },
  { start: "Coffee", target: "Napoleon", hint: "Beverage of empires" },
  { start: "Banana", target: "Nuclear weapon", hint: "Potassium is the key" },
  { start: "Cat", target: "Internet", hint: "Cats rule something bigger" },
  { start: "Shoes", target: "Moon landing", hint: "One small step" },
  { start: "Bicycle", target: "World War II", hint: "Wheels to war" },
  { start: "Chocolate", target: "Aztec Empire", hint: "Go back in time" },
  { start: "Skateboarding", target: "California", hint: "Start where you are" },
  { start: "Tea", target: "British Empire", hint: "Follow the leaf" },
  { start: "Rubik's Cube", target: "Hungary", hint: "Where was it invented?" },
];

const WIKI = "https://en.wikipedia.org";

interface Step {
  title: string;
}

function WikiSpeedrun() {
  const [challenge, setChallenge] = useState(() => Math.floor(Math.random() * CHALLENGES.length));
  const [path, setPath] = useState<Step[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem("wiki-speedrun-best") ?? "{}");
    } catch {
      return {};
    }
  });
  const timerRef = useRef<number | null>(null);

  const current = CHALLENGES[challenge]!;
  const currentTitle = path.length > 0 ? path[path.length - 1]!.title : current.start;

  // timer only - link loading lives in WikiLinks
  useEffect(() => {
    if (startTime === null) setStartTime(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge]);

  // timer
  useEffect(() => {
    if (won || startTime === null) return;
    timerRef.current = window.setInterval(() => setElapsed(Date.now() - startTime), 200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [won, startTime]);

  const targetReached = currentTitle === current.target;

  useEffect(() => {
    if (!targetReached || won) return;
    setWon(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (startTime !== null) {
      const secs = (Date.now() - startTime) / 1000;
      setBest((b) => {
        const prev = b[current.target];
        if (prev === undefined || secs < prev) {
          const next = { ...b, [current.target]: secs };
          localStorage.setItem("wiki-speedrun-best", JSON.stringify(next));
          return next;
        }
        return b;
      });
    }
  }, [targetReached, won, startTime, current.target]);

  /** follow a link inside the article */
  const follow = (title: string) => {
    if (won) return;
    setPath((p) => [...p, { title }]);
  };

  const goBack = () => setPath((p) => p.slice(0, -1));

  const restart = () => {
    setChallenge((c) => {
      let n = c;
      while (n === c) n = Math.floor(Math.random() * CHALLENGES.length);
      return n;
    });
    setPath([]);
    setWon(false);
    setElapsed(0);
    setStartTime(null);
  };

  return (
    <AppShell title="Wiki Speedrun">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏃 Wiki Speedrun</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start at one Wikipedia article. Click only links that appear on the page. Reach the target - fast.
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface p-3.5">
          <div className="text-sm">
            <span className="font-bold text-foreground">{current.start}</span>
            <ArrowRight className="mx-1.5 inline size-4 text-primary" />
            <span className="rounded-md bg-primary/10 px-2 py-0.5 font-bold text-primary">{current.target}</span>
            <span className="ml-2 text-[11px] text-muted-foreground">Hint: {current.hint}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="tabular-nums text-muted-foreground">
              {(elapsed / 1000).toFixed(1)}s
            </span>
            <span className="tabular-nums text-muted-foreground">
              {path.length} clicks
            </span>
            {best[current.target] !== undefined && (
              <span className="flex items-center gap-1 font-semibold text-primary">
                <Trophy className="size-3.5" /> {best[current.target]!.toFixed(1)}s
              </span>
            )}
          </div>
        </div>

        {/* path trail */}
        {path.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-muted/60 p-2 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">{current.start}</span>
            {path.map((p, i) => (
              <span key={i} className="flex items-center gap-1">
                <ArrowRight className="size-3" />
                <span className={i === path.length - 1 ? "font-semibold text-primary" : ""}>{p.title}</span>
              </span>
            ))}
          </div>
        )}

        {won && (
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-5 text-center">
            <p className="text-lg font-bold text-foreground">🎯 Reached {current.target}!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {(elapsed / 1000).toFixed(1)} seconds · {path.length} clicks · {path.length > 0 ? (elapsed / 1000 / (path.length + 1)).toFixed(1) : "0"}s per hop
            </p>
            <button
              onClick={restart}
              className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              New challenge
            </button>
          </div>
        )}

        {!won && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">📄 {currentTitle}</p>
              <div className="flex gap-1.5">
                <button
                  onClick={goBack}
                  disabled={path.length === 0}
                  className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-40"
                >
                  <ArrowLeft className="size-3" /> Back
                </button>
                <a
                  href={`${WIKI}/wiki/${encodeURIComponent(currentTitle)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  Read ↗
                </a>
              </div>
            </div>

            {won ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Challenge complete.</p>
            ) : (
              <WikiLinks title={currentTitle} onFollow={follow} />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

/** fetches and renders the article's actual link list so players click only real wiki links */
function WikiLinks({ title, onFollow }: { title: string; onFollow: (t: string) => void }) {
  const [links, setLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(
      `${WIKI}/w/api.php?action=query&format=json&origin=*&prop=links&pllimit=max&plnamespace=0&titles=${encodeURIComponent(title)}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const pages = data?.query?.pages ?? {};
        const first = Object.values(pages)[0] as { links?: { title: string }[] } | undefined;
        setLinks((first?.links ?? []).map((l) => l.title));
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [title]);

  if (loading) return <p className="py-6 text-center text-sm text-muted-foreground">Loading links...</p>;

  return (
    <div className="flex max-h-72 flex-wrap gap-1.5 overflow-y-auto">
      {links.map((l) => (
        <button
          key={l}
          onClick={() => onFollow(l)}
          className="rounded-md bg-muted/70 px-2.5 py-1 text-[11px] text-foreground/90 transition-colors hover:bg-primary/15 hover:text-primary"
        >
          {l}
        </button>
      ))}
      {links.length === 0 && <p className="text-sm text-muted-foreground">This page has no article links. Go back.</p>}
    </div>
  );
}
