import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/pixel-thoughts")({ component: PixelThoughts });

const SEEDS = [
  { emoji: "🌱", label: "a seed" },
  { emoji: "🫧", label: "a bubble" },
  { emoji: "⭐", label: "a star" },
  { emoji: "🎈", label: "a balloon" },
];

interface Thought {
  id: number;
  text: string;
  emoji: string;
  /** 0-100, shrinks over time via CSS var-driven animation */
  born: number;
}

function PixelThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [draft, setDraft] = useState("");
  const idRef = useRef(0);

  // park: slow fade loop, purely visual (no timers per thought — CSS drives it)
  useEffect(() => {
    const t = window.setInterval(() => {
      setThoughts((prev) => prev.filter((th) => Date.now() - th.born < 90_000));
    }, 5_000);
    return () => window.clearInterval(t);
  }, []);

  const release = () => {
    const text = draft.trim();
    if (!text) return;
    const seed = SEEDS[Math.floor(Math.random() * SEEDS.length)]!;
    idRef.current += 1;
    setThoughts((prev) => [{ id: idRef.current, text, emoji: seed.emoji, born: Date.now() }, ...prev].slice(0, 24));
    setDraft("");
  };

  return (
    <AppShell title="Pixel Thoughts" wide>
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🌌 Pixel Thoughts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A 60-second meditation. Put a worry in a star and watch it shrink.
        </p>
      </header>

      <div className="mx-auto max-w-md">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && release()}
            placeholder="What's taking up space in your mind?"
            maxLength={120}
            className="h-11 flex-1 rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
          <button
            onClick={release}
            className="rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Release
          </button>
        </div>

        <div className="mt-8 space-y-5">
          {thoughts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-10 text-center">
              <p className="text-4xl">🌠</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Think of the thing that's stressing you out. Put it in a star.
              </p>
            </div>
          )}

          {thoughts.map((th) => (
            <button
              key={th.id}
              onClick={() => setThoughts((prev) => prev.filter((x) => x.id !== th.id))}
              title="Tap to let it go now"
              className="group flex w-full flex-col items-center gap-1 rounded-xl py-3 transition-colors hover:bg-surface/60"
              style={
                {
                  "--age": `${Math.min(90, (Date.now() - th.born) / 1000)}s`,
                } as React.CSSProperties
              }
            >
              <span className="text-2xl" style={{ filter: "drop-shadow(0 0 10px color-mix(in oklab, var(--primary) 45%, transparent))" }}>
                {th.emoji}
              </span>
              <span className="pixel-shrink text-center text-foreground">{th.text}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                tap to let go
              </span>
            </button>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Inspired by pixelthoughts.co — worries look smaller when you zoom out.
        </p>
      </div>
    </AppShell>
  );
}
