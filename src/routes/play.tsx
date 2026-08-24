import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Coins, Dices, Shuffle, Sparkles, Volume2, VolumeX, Wand2 } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { COMMANDS } from "@/lib/commands";
import { feedback, isMuted, setMuted } from "@/lib/play-sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Play — quick games & decision makers | SlashAI" },
      {
        name: "description",
        content:
          "Bored? Flip a coin, roll dice, spin a decision wheel or hit the Surprise me button to land on a random AI command.",
      },
      { property: "og:title", content: "Play — quick games & decision makers | SlashAI" },
      {
        property: "og:description",
        content: "Coin toss, dice, decision wheel and a Surprise me button, all inside SlashAI.",
      },
    ],
  }),
  component: PlayPage,
});

function Tile({
  title,
  hint,
  children,
  className,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "panel relative overflow-hidden rounded-2xl p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/50",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 size-48 rounded-full bg-primary/10 blur-3xl"
      />
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      <div className="relative mt-4">{children}</div>
    </section>
  );
}

/** Big tactile action button: press-scale, glow, sound + haptics. */
function ActionButton({
  children,
  onClick,
  icon: Icon,
  busy,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className="group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-150 ease-out will-change-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none active:translate-y-0 active:scale-[0.97] disabled:opacity-70"
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <Icon className={cn("size-4", busy && "animate-spin")} />
      {children}
    </button>
  );
}

function CoinToss() {
  const [result, setResult] = useState<"Heads" | "Tails" | null>(null);
  const [spinning, setSpinning] = useState(false);

  const toss = () => {
    feedback("flip");
    setSpinning(true);
    window.setTimeout(() => {
      setResult(Math.random() < 0.5 ? "Heads" : "Tails");
      setSpinning(false);
      feedback("win");
    }, 700);
  };

  return (
    <Tile title="Coin toss" hint="Settle it in one tap.">
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "flex size-24 items-center justify-center rounded-full border-2 border-primary/40 bg-surface text-lg font-bold text-foreground transition-transform duration-700 ease-out",
            spinning && "animate-spin",
          )}
          aria-live="polite"
        >
          {spinning ? <Coins className="size-8 text-primary" /> : (result ?? "Toss")}
        </div>
        <ActionButton icon={Coins} onClick={toss} busy={spinning}>
          Flip the coin
        </ActionButton>
      </div>
    </Tile>
  );
}

const PIPS = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function DiceRoll() {
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    feedback("roll");
    setRolling(true);
    const timer = window.setInterval(() => {
      setDice([Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)]);
    }, 70);
    window.setTimeout(() => {
      window.clearInterval(timer);
      setRolling(false);
      feedback("win");
    }, 620);
  };

  return (
    <Tile title="Dice" hint="Two dice, real randomness.">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3" aria-live="polite">
          {dice.map((d, i) => (
            <span
              key={i}
              className={cn(
                "select-none text-6xl leading-none text-primary transition-transform duration-150",
                rolling && "scale-110",
              )}
            >
              {PIPS[d]}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">Total {dice[0] + dice[1] + 2}</p>
        <ActionButton icon={Dices} onClick={roll} busy={rolling}>
          Roll dice
        </ActionButton>
      </div>
    </Tile>
  );
}

function DecisionWheel() {
  const [raw, setRaw] = useState("Pizza, Biryani, Noodles, Cook at home");
  const [pick, setPick] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    const options = raw
      .split(/[,\n]/)
      .map((o) => o.trim())
      .filter(Boolean);
    if (options.length === 0) return;
    feedback("roll");
    setSpinning(true);
    const timer = window.setInterval(() => {
      setPick(options[Math.floor(Math.random() * options.length)] ?? null);
    }, 90);
    window.setTimeout(() => {
      window.clearInterval(timer);
      setSpinning(false);
      feedback("win");
    }, 900);
  };

  return (
    <Tile title="Decide for me" hint="Type your options, comma separated.">
      <div className="space-y-3">
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={3}
          aria-label="Options to choose between"
          className="w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
          placeholder="Option one, option two, option three"
        />
        <div
          className={cn(
            "rounded-xl border border-dashed border-primary/40 px-4 py-3 text-center text-base font-semibold text-foreground transition-opacity",
            spinning && "opacity-60",
          )}
          aria-live="polite"
        >
          {pick ?? "Spin to pick"}
        </div>
        <ActionButton icon={Shuffle} onClick={spin} busy={spinning}>
          Spin
        </ActionButton>
      </div>
    </Tile>
  );
}

function SurpriseMe() {
  const navigate = useNavigate();
  const [teaser, setTeaser] = useState<string | null>(null);

  const surprise = () => {
    const cmd = COMMANDS[Math.floor(Math.random() * COMMANDS.length)];
    if (!cmd) return;
    feedback("flip");
    setTeaser(cmd.command);
    window.setTimeout(() => {
      void navigate({ to: "/c/$slug", params: { slug: cmd.id } });
    }, 320);
  };

  return (
    <Tile title="Bored? Surprise me" hint="Jump to a random command from the library.">
      <div className="space-y-3">
        <p className="font-mono text-sm text-primary" aria-live="polite">
          {teaser ?? "/????"}
        </p>
        <ActionButton icon={Wand2} onClick={surprise}>
          Surprise me
        </ActionButton>
        <Link
          to="/discover/$section"
          params={{ section: "free-time" }}
          className="block text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          More free-time picks
        </Link>
      </div>
    </Tile>
  );
}

function PlayPage() {
  const [muted, setMutedState] = useState(() => (typeof window === "undefined" ? true : isMuted()));

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) feedback("tap");
  };

  return (
    <AppShell wide title="Play">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Sparkles className="size-5 text-primary" /> Play
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Small, satisfying time-passers — coin toss, dice, a decision spinner and a random
            command button. Everything runs offline.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={toggleSound}>
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          {muted ? "Sound off" : "Sound on"}
        </Button>
      </header>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <CoinToss />
        <DiceRoll />
        <DecisionWheel />
        <SurpriseMe />
      </div>
    </AppShell>
  );
}
