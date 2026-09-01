import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/coin-flip")({ component: CoinFlipper });

function CoinFlipper() {
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [history, setHistory] = useState<{ side: "heads" | "tails"; time: number }[]>([]);

  const flip = () => {
    setFlipping(true);
    setTimeout(() => {
      const side: "heads" | "tails" = Math.random() > 0.5 ? "heads" : "tails";
      setResult(side);
      setHistory((p) => [{ side, time: Date.now() }, ...p].slice(0, 50));
      setFlipping(false);
    }, 600);
  };

  const heads = history.filter((h) => h.side === "heads").length;
  const tails = history.filter((h) => h.side === "tails").length;

  return (
    <AppShell title="Coin Flipper">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🪙 Coin Flipper</h1>
        <p className="mt-1 text-sm text-muted-foreground">Flip a virtual coin with animation.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex justify-center">
          <button onClick={flip} disabled={flipping}
            className={`size-32 rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center text-6xl transition-all ${flipping ? "animate-spin" : "hover:scale-105 active:scale-95"}`}>
            {result ? (result === "heads" ? "👑" : "🌙") : "🪙"}
          </button>
        </div>
        {result && <p className="text-center text-lg font-bold text-foreground capitalize">{result}!</p>}
        {history.length > 0 && (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-border bg-surface p-3"><p className="text-2xl font-bold text-foreground">{heads}</p><p className="text-[10px] text-muted-foreground">Heads</p></div>
            <div className="rounded-xl border border-border bg-surface p-3"><p className="text-2xl font-bold text-foreground">{tails}</p><p className="text-[10px] text-muted-foreground">Tails</p></div>
            <div className="rounded-xl border border-border bg-surface p-3"><p className="text-2xl font-bold text-foreground">{history.length}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
