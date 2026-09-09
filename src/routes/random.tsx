import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Dices, Sparkles } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";
import { pickRandom, pickSeveral, RANDOM_POOL_SIZE, type RandomPick } from "@/lib/random-pick";

export const Route = createFileRoute("/random")({
  head: () => ({
    meta: [
      { title: "Feeling Lucky? - Random tool or game | SlashAI" },
      {
        name: "description",
        content: `One tap takes you to a random tool or game from ${RANDOM_POOL_SIZE} hand-built destinations. The bored button of SlashAI.`,
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    // the flag may arrive as true, "true" or "1" depending on serialization
    go: Boolean(search["go"]),
  }),
  component: RandomPage,
});

const ROLL_MS = 1100;

function RandomPage() {
  const navigate = useNavigate();
  const { go } = Route.useSearch();
  const [rolling, setRolling] = useState(false);
  const [flash, setFlash] = useState<RandomPick | null>(null);
  const teasers = useRef<RandomPick[]>(pickSeveral(6));
  const rolled = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      for (const t of timers.current) window.clearTimeout(t);
    },
    [],
  );

  function travel(pick: RandomPick, replace: boolean) {
    void navigate({ to: pick.path as string, replace });
  }

  function roll(replace: boolean) {
    if (rolling) return;
    setRolling(true);
    const pick = pickRandom();
    // slot-machine flicker through the catalog
    const started = performance.now();
    const flicker = () => {
      const left = ROLL_MS - (performance.now() - started);
      if (left <= 0) {
        setFlash(pick);
        timers.current.push(
          window.setTimeout(() => travel(pick, replace), 450),
        );
        return;
      }
      setFlash(pickRandom());
      timers.current.push(window.setTimeout(flicker, Math.max(60, left / 14)));
    };
    flicker();
  }

  // ?go=1 (hub buttons): roll immediately and replace this page in history so
  // the back button returns to wherever the user came from.
  useEffect(() => {
    if (go && !rolled.current) {
      rolled.current = true;
      roll(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go]);

  return (
    <AppShell title="Feeling Lucky?">
      <header className="page-enter pt-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">🎲 Feeling Lucky?</h1>
        <p className="mx-auto mt-1 max-w-md text-[15px] text-muted-foreground">
          One tap drops you into a random tool or game from all {RANDOM_POOL_SIZE} hand-built
          destinations. No choosing, no scrolling - just go.
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-md text-center">
        <button
          onClick={() => roll(false)}
          disabled={rolling}
          className="group relative mx-auto flex size-44 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/25 to-primary/5 shadow-[0_0_60px_-12px] shadow-primary/40 transition-transform duration-150 hover:scale-105 active:scale-95 disabled:cursor-wait sm:size-52"
          aria-label="Take me somewhere random"
        >
          <span className="absolute inset-2 rounded-full border border-border/60" />
          {rolling ? (
            flash ? (
              <span className="flex flex-col items-center gap-1 px-4">
                <span className="text-[34px] leading-none">{flash.icon}</span>
                <span className="text-[12px] font-bold text-foreground">{flash.name}</span>
              </span>
            ) : (
              <Dices className="size-12 text-primary" />
            )
          ) : (
            <Dices className="size-14 text-primary transition-transform duration-150 group-hover:rotate-12" />
          )}
        </button>

        <p className="mt-5 text-[13px] font-semibold text-foreground">
          {rolling ? "Rolling the dice..." : "Take me somewhere fun"}
        </p>
        {rolling && flash && (
          <p className="mt-1 text-[11px] text-muted-foreground">{flash.desc}</p>
        )}
        {!rolling && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            {RANDOM_POOL_SIZE} destinations - tools, games, hubs and more
          </p>
        )}
      </div>

      <section className="mx-auto mt-10 max-w-lg">
        <h2 className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="size-3.5" /> Where the dice can take you
        </h2>
        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {teasers.current.map((t) => (
            <button
              key={t.path}
              onClick={() => travel(t, false)}
              className="flex flex-col items-start rounded-xl border border-border bg-surface p-3 text-left transition-colors hover:border-primary/40"
            >
              <span className="text-[22px] leading-none">{t.icon}</span>
              <span className="mt-2 text-[12px] font-bold text-foreground">{t.name}</span>
              <span className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-muted-foreground">
                {t.desc}
              </span>
            </button>
          ))}
        </div>
      </section>

      <p className="mx-auto mt-8 max-w-md text-center text-[11px] text-muted-foreground">
        Pressing the button replaces this page in your history, so going back returns you exactly
        where you were - no random-button rabbit holes.
      </p>
    </AppShell>
  );
}
