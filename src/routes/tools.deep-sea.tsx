import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/deep-sea")({ component: DeepSea });

interface Creature {
  depth: number;
  name: string;
  emoji: string;
  fact: string;
}

const CREATURES: Creature[] = [
  { depth: 0, name: "Surface", emoji: "🌊", fact: "Where sunlight meets the sea. Most ocean life lives in the top 200 m." },
  { depth: 10, name: "Recreational dive limit", emoji: "🤿", fact: "40 m is the deepest sport divers may go. Beyond this: decompression risk." },
  { depth: 50, name: "Sea turtle", emoji: "🐢", fact: "Green turtles dive to about 290 m but must surface to breathe every few hours." },
  { depth: 100, name: "Bottlenose dolphin", emoji: "🐬", fact: "Dolphins can dive past 300 m in short bursts while hunting fish." },
  { depth: 200, name: "Sunlight zone ends", emoji: "☀️", fact: "Below 200 m, photosynthesis fails. Plants cannot grow - only drifters and hunters remain." },
  { depth: 330, name: "Deepest scuba dive", emoji: "🏅", fact: "Ahmed Gabr reached 332 m in 2014. The descent took 12 minutes; the return, 15 hours." },
  { depth: 500, name: "Blue whale", emoji: "🐋", fact: "The largest animal ever feeds at depth and can hold its breath for 30 minutes." },
  { depth: 830, name: "Twilight zone", emoji: "🌇", fact: "From 200 to 1,000 m light fades to blue-black. Eyes are huge, bodies translucent." },
  { depth: 1000, name: "Giant squid", emoji: "🦑", fact: "Up to 13 m long with eyes the size of dinner plates - the largest in the animal kingdom." },
  { depth: 1280, name: "Leatherback turtle", emoji: "🐢", fact: "The deepest-diving reptile, recorded past 1,200 m chasing jellyfish." },
  { depth: 2000, name: "Midnight zone", emoji: "🌑", fact: "No sunlight at all. The only light is bioluminescence: living flashes, lures and sparks." },
  { depth: 2200, name: "Cuvier's beaked whale", emoji: "🐳", fact: "The mammalian record holder: 2,992 m deep for 3 hours and 42 minutes on one breath." },
  { depth: 3000, name: "Abyssal zone", emoji: "🕳️", fact: "Near-freezing water, crushing pressure. A styrofoam cup here shrinks to a thimble." },
  { depth: 3800, name: "RMS Titanic", emoji: "🚢", fact: "The wreck rests at 3,800 m, slowly consumed by iron-eating bacteria." },
  { depth: 4000, name: "Anglerfish", emoji: "🎣", fact: "Females dangle a glowing lure; males fuse to their bodies permanently as parasites." },
  { depth: 6000, name: "Hadal zone begins", emoji: "⚫", fact: "Named for Hades. Only trenches go deeper - long, narrow scars where one plate dives under another." },
  { depth: 6500, name: "Dumbo octopus", emoji: "🐙", fact: "The deepest-living octopus, flapping ear-like fins above the trench floor." },
  { depth: 8336, name: "Deepest fish ever filmed", emoji: "🐟", fact: "A snailfish filmed in 2023 near Japan - gelatinous, translucent, perfectly at home." },
  { depth: 10935, name: "Challenger Deep", emoji: "🏆", fact: "The ocean's deepest point. Pressure: over 1,000 bar - like 100 elephants on your thumbnail." },
  { depth: 10994, name: "Deepest crewed descent", emoji: "🛳️", fact: "Victor Vescovo's 2019 dive reached 10,928 m and found a plastic bag on the floor." },
];

const MAX_DEPTH = 11000;
const PX_PER_M = 1.4;

function DeepSea() {
  const [depth, setDepth] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

  // depth bands for the background gradient
  const band = useMemo(() => {
    if (depth < 200) return "from-sky-500/70 via-sky-700/70 to-sky-900/80";
    if (depth < 1000) return "from-sky-800/80 via-blue-900/85 to-slate-900";
    if (depth < 4000) return "from-blue-950 via-slate-950 to-black";
    return "from-black via-slate-950 to-black";
  }, [depth]);

  const visible = CREATURES.filter((c) => Math.abs(c.depth - depth) < 900);

  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepth(Number(e.target.value));
  };

  const nearest = CREATURES.reduce((best, c) => (Math.abs(c.depth - depth) < Math.abs(best.depth - depth) ? c : best), CREATURES[0]!);

  return (
    <AppShell title="Deep Sea">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🌊 Deep Sea</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Descend 11 kilometres. Scroll through the deepest place on Earth - and meet who lives there.
        </p>
      </header>

      <div
        className={`relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-gradient-to-b ${band} transition-[background] duration-700`}
        style={{ height: 520 }}
        onPointerDown={() => setScrubbing(true)}
        onPointerUp={() => setScrubbing(false)}
        onPointerLeave={() => setScrubbing(false)}
      >
        {/* depth ruler */}
        <div className="pointer-events-none absolute left-3 top-3 bottom-3 w-10">
          {Array.from({ length: 12 }, (_, i) => {
            const m = i * 1000;
            return (
              <div key={i} className="absolute flex items-center gap-1 text-[9px] text-white/60" style={{ top: `${(m / MAX_DEPTH) * 100}%` }}>
                <span className="inline-block h-px w-2 bg-white/40" />
                {m / 1000}km
              </div>
            );
          })}
        </div>

        {/* current depth readout */}
        <div className="pointer-events-none absolute right-3 top-3 rounded-lg bg-black/50 px-3 py-1.5 text-right backdrop-blur">
          <p className="text-lg font-bold tabular-nums text-white">{depth.toLocaleString()} m</p>
          <p className="text-[10px] text-white/70">{((depth / MAX_DEPTH) * 100).toFixed(1)}% to the floor</p>
        </div>

        {/* creatures at this depth */}
        <div className="absolute inset-0 flex items-center justify-center px-14">
          <div className="w-full max-w-sm space-y-3">
            {visible.map((c) => (
              <div key={c.name} className="rounded-xl bg-white/10 p-3.5 backdrop-blur-sm">
                <p className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="text-xl">{c.emoji}</span>
                  <span>{c.name}</span>
                  <span className="ml-auto text-[10px] font-medium tabular-nums text-white/60">{c.depth.toLocaleString()} m</span>
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/80">{c.fact}</p>
              </div>
            ))}
            {visible.length === 0 && (
              <p className="text-center text-xs text-white/50">Empty water. Keep descending...</p>
            )}
          </div>
        </div>

        {/* the nearest highlight glow */}
        <div
          className="pointer-events-none absolute left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-xl"
          style={{ top: `${(nearest.depth / MAX_DEPTH) * 100}%` }}
        />
      </div>

      {/* scrubber */}
      <div className="mx-auto mt-4 max-w-2xl rounded-xl border border-border bg-surface p-4">
        <label className="mb-2 flex items-baseline justify-between text-xs text-muted-foreground">
          <span>Drag to dive</span>
          <span className="tabular-nums">
            {scrubbing ? "Diving..." : "Surface → Challenger Deep"}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={MAX_DEPTH}
          step={10}
          value={depth}
          onChange={onScrub}
          className="w-full accent-primary"
          aria-label="Depth in metres"
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>0 m</span>
          <span>2 km</span>
          <span>4 km</span>
          <span>6 km</span>
          <span>8 km</span>
          <span>11 km</span>
        </div>

        <p className="mt-3 text-center text-sm text-muted-foreground">
          You are near <b className="text-foreground">{nearest.emoji} {nearest.name}</b>
        </p>
      </div>
    </AppShell>
  );
}
