import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/tools/spend-money")({ component: SpendMoney });

interface Item {
  name: string;
  price: number;
  emoji: string;
}

const ITEMS: Item[] = [
  { name: "Big Mac", price: 5, emoji: "🍔" },
  { name: "Coffee", price: 4, emoji: "☕" },
  { name: "Pizza", price: 12, emoji: "🍕" },
  { name: "Movie ticket", price: 15, emoji: "🎬" },
  { name: "Book", price: 18, emoji: "📚" },
  { name: "Video game", price: 60, emoji: "🎮" },
  { name: "AirPods", price: 199, emoji: "🎧" },
  { name: "Smartphone", price: 999, emoji: "📱" },
  { name: "Bicycle", price: 1200, emoji: "🚲" },
  { name: "Laptop", price: 2000, emoji: "💻" },
  { name: "Rolex watch", price: 12000, emoji: "⌚" },
  { name: "Car", price: 32000, emoji: "🚗" },
  { name: "Sports car", price: 110000, emoji: "🏎️" },
  { name: "Engagement ring", price: 150000, emoji: "💍" },
  { name: "House", price: 350000, emoji: "🏠" },
  { name: "Luxury villa", price: 2000000, emoji: "🏝️" },
  { name: "Private island", price: 15000000, emoji: "🌴" },
  { name: "Yacht", price: 30000000, emoji: "🛥️" },
  { name: "Private jet", price: 65000000, emoji: "✈️" },
  { name: "Skyscraper", price: 850000000, emoji: "🏢" },
  { name: "NBA team", price: 2120000000, emoji: "🏀" },
  { name: "Cruise ship", price: 9300000000, emoji: "🚢" },
  { name: "Space mission", price: 12000000000, emoji: "🚀" },
];

const START_MONEY = 100_000_000_000;
const fmt = new Intl.NumberFormat("en-US");
const money = (n: number) => "$" + fmt.format(n);

function SpendMoney() {
  const [balance, setBalance] = useState(START_MONEY);
  const [owned, setOwned] = useState<Record<string, number>>({});

  const spent = useMemo(() => {
    let total = 0;
    for (const item of ITEMS) {
      const qty = owned[item.name] ?? 0;
      total += qty * item.price;
    }
    return total;
  }, [owned]);

  const buy = (item: Item) => {
    if (balance < item.price) return;
    setBalance((b) => b - item.price);
    setOwned((o) => ({ ...o, [item.name]: (o[item.name] ?? 0) + 1 }));
  };

  const sell = (item: Item) => {
    const qty = owned[item.name] ?? 0;
    if (qty <= 0) return;
    setBalance((b) => b + item.price);
    setOwned((o) => ({ ...o, [item.name]: qty - 1 }));
  };

  const reset = () => {
    setBalance(START_MONEY);
    setOwned({});
  };

  const pct = (spent / START_MONEY) * 100;

  return (
    <AppShell title="Spend Billions">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">💸 Spend Billions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You have {money(START_MONEY)}. Spend it all. Good luck.
        </p>
      </header>

      <div className="sticky top-0 z-10 -mx-1 mb-4 rounded-xl border border-border bg-surface/95 p-4 backdrop-blur">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Your money</p>
            <p className="text-2xl font-bold tabular-nums text-foreground">{money(balance)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="text-lg font-semibold tabular-nums text-primary">{money(spent)}</p>
          </div>
          <button
            onClick={reset}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {pct >= 100 ? "You spent it all. Legendary." : `${pct.toFixed(2)}% spent`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {ITEMS.map((item) => {
          const qty = owned[item.name] ?? 0;
          const affordable = balance >= item.price;
          return (
            <div
              key={item.name}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-colors"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-muted text-2xl">
                {item.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs tabular-nums text-muted-foreground">{money(item.price)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => sell(item)}
                  disabled={qty === 0}
                  className="grid size-8 place-items-center rounded-lg border border-border text-sm font-bold text-foreground transition-colors hover:border-primary/40 disabled:opacity-30"
                  aria-label={`Sell ${item.name}`}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold tabular-nums text-foreground">{qty || ""}</span>
                <button
                  onClick={() => buy(item)}
                  disabled={!affordable}
                  className="grid size-8 place-items-center rounded-lg border border-primary/50 text-sm font-bold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:opacity-40"
                  aria-label={`Buy ${item.name}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
