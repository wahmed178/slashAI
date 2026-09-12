import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/cosmic-dive")({ component: CosmicDive });

const STOPS = [
  { depth: 0, name: "Earth's atmosphere", note: "You are here. Every human who ever lived, lived below this line.", emoji: "🌍" },
  { depth: 400, name: "The ISS", note: "Astronauts up here see 16 sunrises every day.", emoji: "🛰️" },
  { depth: 384400, name: "The Moon", note: "12 people have walked here. Their footprints are still fresh - no wind.", emoji: "🌕" },
  { depth: 78000000, name: "Mars at closest approach", note: "Light from Mars takes over 4 minutes to reach you.", emoji: "🔴" },
  { depth: 1100000000, name: "Jupiter's Great Red Spot", note: "A storm wider than Earth, raging for at least 190 years.", emoji: "🟠" },
  { depth: 1280000000, name: "Saturn", note: "Its rings are mostly ice - and only about 10 metres thick.", emoji: "🪐" },
  { depth: 4351000000, name: "Neptune", note: "Winds here hit 2,100 km/h - the fastest in the solar system.", emoji: "🔵" },
  { depth: 9500000000, name: "Voyager 1", note: "The farthest human-made object. Still calling home after 47 years.", emoji: "📡" },
  { depth: 41000000000000, name: "Proxima Centauri", note: "The nearest star. Our fastest probe would need 73,000 years to get here.", emoji: "✨" },
  { depth: 9460000000000000, name: "One light-year", note: "You just crossed it. Keep scrolling.", emoji: "🌌" },
  { depth: 40000000000000000, name: "The Milky Way's centre", note: "A supermassive black hole, 4 million times the Sun's mass.", emoji: "🕳️" },
  { depth: 2500000000000000000, name: "Andromeda", note: "Our galactic neighbour. We'll merge with it in ~4.5 billion years.", emoji: "🌀" },
  { depth: 440000000000000000000, name: "Edge of the observable universe", note: "The light here left its source 13.8 billion years ago. That's the cosmic dawn.", emoji: "🎆" },
];

function fmt(d: number): string {
  if (d < 1000) return `${Math.round(d)} km`;
  if (d < 1e9) return `${(d / 1e6).toFixed(1)} million km`;
  if (d < 9.46e12) return `${(d / 1e9).toFixed(1)} billion km`;
  return `${(d / 9.46e12).toFixed(2)} light-years`;
}

function CosmicDive() {
  const ref = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? el.scrollTop / max : 0;
      // exponential depth mapping: scroll 0→1 becomes 0→4.4e20
      setDepth(Math.pow(p, 3.2) * 4.4e20);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const reached = STOPS.filter((s) => s.depth <= Math.max(depth, 0.0001));
  const current = reached[reached.length - 1];

  return (
    <AppShell title="Cosmic Dive">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🌌 Cosmic Dive</h1>
        <p className="mt-1 text-sm text-muted-foreground">Scroll from Earth's surface to the edge of the universe. Feel the scale.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-3">
        <div className="sticky top-0 z-10 rounded-xl border border-border bg-surface/95 px-4 py-2 backdrop-blur">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-bold text-primary">{current?.name}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{fmt(depth)}</span>
          </div>
          {current && <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{current.emoji} {current.note}</p>}
        </div>
        <div
          ref={ref}
          className="h-[60vh] overflow-y-auto rounded-xl border border-border bg-[#0d1117]"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, #e6edf3 50%, transparent), radial-gradient(1px 1px at 60% 70%, #8b949e 50%, transparent), radial-gradient(1.5px 1.5px at 80% 20%, #e6edf3 50%, transparent), radial-gradient(1px 1px at 30% 80%, #58a6ff 50%, transparent), radial-gradient(1px 1px at 90% 60%, #a78bfa 50%, transparent), radial-gradient(1px 1px at 10% 50%, #e6edf3 50%, transparent), radial-gradient(1px 1px at 45% 10%, #f85149 50%, transparent), radial-gradient(1px 1px at 70% 90%, #3fb950 50%, transparent)",
            backgroundSize: "600px 600px",
          }}
        >
          <div className="h-[400vh]" />
          <div className="grid place-items-center pb-8">
            <span className="text-[11px] text-muted-foreground">🚀 the edge of the observable universe</span>
          </div>
        </div>
        <p className="text-center text-[11px] text-muted-foreground">
          {reached.length} of {STOPS.length} waypoints reached - keep scrolling
        </p>
      </div>
    </AppShell>
  );
}
