import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Brain, Trophy, RotateCcw, Heart } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/play/memory-matrix")({
  head: () => ({
    meta: [
      { title: "Memory Matrix - SlashPlay | SlashAI" },
      {
        name: "description",
        content: "Visual spatial memory training game. Memorize the pattern of glowing tiles and reproduce it across progressive stages.",
      },
    ],
  }),
  component: MemoryMatrixPage,
});

function loadBest(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.localStorage.getItem("play-memory-matrix-best") ?? 0) || 0;
  } catch {
    return 0;
  }
}

function MemoryMatrixPage() {
  const [stage, setStage] = useState(1);
  const [lives, setLives] = useState(3);
  const [phase, setPhase] = useState<"idle" | "memorize" | "recall" | "stage-success" | "gameover">("idle");
  const [gridSize, setGridSize] = useState(3); // 3x3 initially, grows to 4x4, 5x5
  const [activeTiles, setActiveTiles] = useState<Set<number>>(new Set());
  const [selectedTiles, setSelectedTiles] = useState<Set<number>>(new Set());
  const [wrongTiles, setWrongTiles] = useState<Set<number>>(new Set());
  const [highScore, setHighScore] = useState(loadBest);

  const timerRef = useRef<number>(0);

  const startStage = (lvl: number) => {
    const size = lvl <= 3 ? 3 : lvl <= 7 ? 4 : 5;
    const tileCount = size * size;
    const countToMemorize = Math.min(tileCount - 2, 3 + Math.floor(lvl * 0.9));

    setGridSize(size);
    setStage(lvl);
    setSelectedTiles(new Set());
    setWrongTiles(new Set());

    // Generate random active indices
    const indices: number[] = [];
    while (indices.length < countToMemorize) {
      const idx = Math.floor(Math.random() * tileCount);
      if (!indices.includes(idx)) indices.push(idx);
    }
    const targetSet = new Set(indices);
    setActiveTiles(targetSet);
    setPhase("memorize");

    // Flash for 1.8 seconds, then switch to recall
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setPhase("recall");
    }, 1800);
  };

  const handleStartGame = () => {
    setLives(3);
    startStage(1);
  };

  const handleTileClick = (index: number) => {
    if (phase !== "recall") return;
    if (selectedTiles.has(index) || wrongTiles.has(index)) return;

    if (activeTiles.has(index)) {
      const nextSelected = new Set(selectedTiles).add(index);
      setSelectedTiles(nextSelected);

      // Check if all correct tiles found
      if (nextSelected.size === activeTiles.size) {
        setPhase("stage-success");
        const nextStage = stage + 1;

        setHighScore((prev) => {
          if (stage > prev) {
            try {
              window.localStorage.setItem("play-memory-matrix-best", String(stage));
            } catch {
              // ignore
            }
            return stage;
          }
          return prev;
        });

        window.setTimeout(() => {
          startStage(nextStage);
        }, 1000);
      }
    } else {
      // Wrong tile
      const nextWrong = new Set(wrongTiles).add(index);
      setWrongTiles(nextWrong);
      const nextLives = lives - 1;
      setLives(nextLives);

      if (nextLives <= 0) {
        setPhase("gameover");
        window.clearTimeout(timerRef.current);
      }
    }
  };

  return (
    <AppShell title="Memory Matrix">
      <div className="mx-auto max-w-md pb-12">
        <header className="page-enter pt-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Brain className="size-6" />
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Memory Matrix
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Memorize the glowing pattern, then tap every highlighted tile from memory.
          </p>
        </header>

        {/* Dashboard */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-muted-foreground">Stage:</span>
            <span className="font-mono font-bold text-foreground">{stage}</span>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={cn("size-4", i < lives ? "fill-rose-500 text-rose-500" : "text-muted-foreground/30")}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <Trophy className="size-3.5 text-primary" />
            <span className="font-semibold text-muted-foreground">Best:</span>
            <span className="font-mono font-bold text-primary">{highScore}</span>
          </div>
        </div>

        {phase === "idle" && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-surface p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-foreground">Train Your Spatial Memory</h2>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Tiles will flash for 1.8 seconds. Remember their exact locations and tap them.
            </p>
            <Button size="lg" onClick={handleStartGame} className="w-full font-bold">
              Start Stage 1
            </Button>
          </div>
        )}

        {(phase === "memorize" || phase === "recall" || phase === "stage-success") && (
          <div className="mt-6 space-y-4">
            <div className="text-center text-xs font-semibold tracking-wide uppercase">
              {phase === "memorize" && (
                <span className="text-amber-400 animate-pulse">Memorize the pattern...</span>
              )}
              {phase === "recall" && (
                <span className="text-primary">
                  Tap the tiles! ({selectedTiles.size}/{activeTiles.size})
                </span>
              )}
              {phase === "stage-success" && (
                <span className="text-emerald-400 font-bold">Stage Cleared! Next level...</span>
              )}
            </div>

            {/* Grid */}
            <div
              className={cn(
                "grid gap-2.5 mx-auto p-4 rounded-2xl border border-border bg-surface-elevated max-w-xs aspect-square",
                gridSize === 3 && "grid-cols-3",
                gridSize === 4 && "grid-cols-4",
                gridSize === 5 && "grid-cols-5"
              )}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
                const isFlashing = phase === "memorize" && activeTiles.has(idx);
                const isFound = selectedTiles.has(idx);
                const isWrong = wrongTiles.has(idx);

                let tileColor = "border-border bg-surface hover:border-primary/50";
                if (isFlashing) {
                  tileColor = "border-amber-400 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]";
                } else if (isFound) {
                  tileColor = "border-emerald-500 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
                } else if (isWrong) {
                  tileColor = "border-rose-500 bg-rose-500/50";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={phase !== "recall"}
                    onClick={() => handleTileClick(idx)}
                    className={cn(
                      "rounded-xl border transition-all duration-150 active:scale-95",
                      tileColor
                    )}
                  />
                );
              })}
            </div>
          </div>
        )}

        {phase === "gameover" && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-surface p-8 text-center space-y-4">
            <span className="inline-block text-4xl">💔</span>
            <h2 className="text-xl font-bold text-foreground">Game Over</h2>
            <p className="text-xs text-muted-foreground">You reached Stage {stage}</p>

            <Button size="lg" onClick={handleStartGame} className="w-full gap-2 font-bold">
              <RotateCcw className="size-4" /> Try Again
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
