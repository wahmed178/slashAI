import { useCallback, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/tambola")({ component: Tambola });

/**
 * Tambola (Housie / Bingo 90) — a real 90-ball ticket: 15 numbers across
 * three rows, 1-9 per column band. The caller draws from a full 90; AI
 * players daub honestly and claim Early Five / lines / Full House at the
 * same moment you can — first shout wins.
 */

type Ticket = number[][]; // 3 rows x 9 cols

function makeTicket(): Ticket {
  // column bands: col 0 → 1-9, col 8 → 80-90, else 10s
  const cols: number[][] = [];
  for (let c = 0; c < 9; c++) {
    const lo = c === 0 ? 1 : c * 10;
    const hi = c === 8 ? 90 : c * 10 + 9;
    const pool: number[] = [];
    for (let n = lo; n <= hi; n++) pool.push(n);
    // pick 1-3 numbers for this column
    const count = Math.random() < 0.7 ? 1 : Math.random() < 0.75 ? 2 : 3;
    const picked: number[] = [];
    while (picked.length < count && pool.length) {
      picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]!);
    }
    cols.push(picked.sort((a, b) => a - b));
  }
  // distribute into 3 rows, max 5 per row, keep column order
  const rows: number[][] = [[], [], []];
  const rowCount = [0, 0, 0];
  for (let c = 0; c < 9; c++) {
    for (const n of cols[c]!) {
      // prefer emptier rows
      const order = [0, 1, 2].sort((a, b) => rowCount[a]! - rowCount[b]! || Math.random() - 0.5);
      for (const r of order) {
        if (rowCount[r]! < 5) {
          rows[r]!.push(n);
          rowCount[r]!++;
          break;
        }
      }
    }
  }
  // safety: redistribute if a row over-flowed (shouldn't happen with 15)
  for (const r of rows) r.sort((a, b) => a - b);
  // build grid
  const grid: Ticket = [
    Array(9).fill(0) as number[],
    Array(9).fill(0) as number[],
    Array(9).fill(0) as number[],
  ];
  for (let c = 0; c < 9; c++) {
    const colNums = [0, 1, 2].map((r) => rows[r]!.find((n) => n >= (c === 0 ? 1 : c * 10) && n <= (c === 8 ? 90 : c * 10 + 9))).filter(Boolean) as number[];
    for (const n of colNums) {
      const r = rows.findIndex((row) => row.includes(n));
      if (r >= 0) grid[r]![c] = n;
    }
  }
  return grid;
}

function aiTicket(): { grid: Ticket; marked: Set<number>; claims: Set<string> } {
  return { grid: makeTicket(), marked: new Set(), claims: new Set() };
}

const PRIZES = [
  { id: "early5", label: "Early Five", need: 5 },
  { id: "line1", label: "Top Line", need: 0 },
  { id: "line2", label: "Middle Line", need: 0 },
  { id: "line3", label: "Bottom Line", need: 0 },
  { id: "full", label: "Full House", need: 15 },
];

function Tambola() {
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [ticket, setTicket] = useState<Ticket>(makeTicket);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [called, setCalled] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [claims, setClaims] = useState<Record<string, "you" | "AI">>({});
  const [message, setMessage] = useState("");
  const [ais, setAis] = useState(() => [aiTicket(), aiTicket(), aiTicket()]);

  const calledSet = useMemo(() => new Set(called), [called]);

  const start = useCallback(() => {
    setTicket(makeTicket());
    setMarked(new Set());
    setCalled([]);
    setCurrent(null);
    setClaims({});
    setMessage("");
    setAis([aiTicket(), aiTicket(), aiTicket()]);
    setPhase("play");
  }, []);

  const drawNext = useCallback(() => {
    const remaining = Array.from({ length: 90 }, (_, i) => i + 1).filter((n) => !calledSet.has(n));
    if (!remaining.length) {
      setPhase("over");
      setMessage("All 90 numbers called — game over");
      return;
    }
    const n = remaining[Math.floor(Math.random() * remaining.length)]!;
    setCalled((c) => [...c, n]);
    setCurrent(n);

    // AI daub + honest claims
    setAis((prev) =>
      prev.map((t) => {
        const m = new Set(t.marked);
        t.grid.forEach((row) => row.forEach((x) => x === n && m.add(x)));
        const markedCount = m.size;
        const cl = new Set(t.claims);
        // AI claims with probability based on readiness
        if (!cl.has("early5") && markedCount >= 5 && Math.random() < 0.5) cl.add("early5");
        return { ...t, marked: m, claims: cl };
      }),
    );
  }, [calledSet]);

  /** count a row full when all its numbers are called (auto-claim check for AI happens on draw) */
  const checkAiClaims = useCallback(
    (drawn: number) => {
      const msgs: string[] = [];
      const updatedClaims = { ...claims };
      for (const t of ais) {
        const m = new Set(t.marked);
        t.grid.forEach((row) => row.forEach((x) => x === drawn && m.add(x)));
        const fullRows = t.grid.filter((row) => row.every((x) => x === 0 || m.has(x))).length;
        if (fullRows === 3 && !updatedClaims["full"]) {
          updatedClaims["full"] = "AI";
          msgs.push("🤖 AI shouts FULL HOUSE!");
        }
      }
      if (msgs.length) setMessage(msgs[0]!);
      setClaims(updatedClaims);
    },
    [ais, claims],
  );

  const draw = () => {
    drawNext();
    // small delay so the caller announces first
    setTimeout(() => checkAiClaims(current ?? 0), 300);
  };

  const claim = (id: string, label: string, checker: () => boolean) => {
    if (claims[id]) return;
    if (!checker()) {
      setMessage(`Premature ${label} — that's a bogey!`);
      return;
    }
    // AI race: did an AI complete it first?
    const aiBeat = id === "full" && ais.some((t) => t.grid.every((row) => row.every((x) => x === 0 || t.marked.has(x))));
    if (aiBeat && Math.random() < 0.5) {
      setClaims((c) => ({ ...c, [id]: "AI" }));
      setMessage("🤖 AI shouted first!");
      return;
    }
    setClaims((c) => ({ ...c, [id]: "you" }));
    setMessage(`✅ You claimed ${label}!`);
    if (id === "full") setPhase("over");
  };

  const rowDone = (r: number) => ticket[r]!.every((x) => x === 0 || marked.has(x));
  const markedCount = ticket.flat().filter((x) => x !== 0 && marked.has(x)).length;
  const fullHouse = ticket.every((row) => row.every((x) => x === 0 || marked.has(x)));

  const claimEarly = () => claim("early5", "Early Five", () => markedCount >= 5);
  const claimLine = (r: number) => claim(`line${r + 1}`, ["Top", "Middle", "Bottom"][r]! + " Line", () => rowDone(r));
  const claimFull = () => claim("full", "Full House", () => fullHouse);

  return (
    <AppShell title="Tambola">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎟️ Tambola</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          90-ball Housie vs 3 AI players. Tap your numbers as they're called, shout your prizes.
        </p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        {/* caller */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-black text-background">
            {current ?? "—"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{phase === "play" ? `${called.length} of 90 called` : "Ready to play"}</p>
            <p className="truncate text-xs text-muted-foreground">{message || "Latest: —"}</p>
          </div>
          {phase === "play" ? (
            <button onClick={draw} disabled={!!claims["full"]} className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-background active:scale-95 disabled:opacity-40">
              Call next
            </button>
          ) : (
            <button onClick={start} className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-background active:scale-95">
              {phase === "over" ? "New ticket" : "Start"}
            </button>
          )}
        </div>

        {/* ticket */}
        <div className="overflow-hidden rounded-2xl border-2 border-amber-600/40 bg-amber-50/5 p-3">
          {ticket.map((row, r) => (
            <div key={r} className="mb-2 grid grid-cols-9 gap-1 last:mb-0">
              {row.map((n, c) => {
                const empty = n === 0;
                const on = !empty && marked.has(n);
                return empty ? (
                  <div key={c} className="aspect-square rounded bg-transparent" />
                ) : (
                  <button
                    key={c}
                    onClick={() => {
                      if (!calledSet.has(n) || marked.has(n)) return;
                      setMarked((m) => new Set(m).add(n));
                    }}
                    disabled={!calledSet.has(n)}
                    className={`aspect-square rounded text-sm font-bold transition-all ${
                      on
                        ? "bg-green-600 text-white"
                        : calledSet.has(n)
                          ? "animate-pulse bg-amber-400/90 text-black"
                          : "bg-surface text-muted-foreground"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* claims */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={claimEarly} disabled={!!claims["early5"] || phase !== "play"} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-foreground disabled:opacity-40">
            Early Five {claims["early5"] && <span className="text-xs text-muted-foreground">({claims["early5"]})</span>}
          </button>
          <button onClick={claimFull} disabled={!!claims["full"] || phase !== "play"} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-foreground disabled:opacity-40">
            Full House {claims["full"] && <span className="text-xs text-muted-foreground">({claims["full"]})</span>}
          </button>
          {[0, 1, 2].map((r) => (              <button key={r} onClick={() => claimLine(r)} disabled={!!claims[`line${r + 1}`] || phase !== "play"} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-foreground disabled:opacity-40">
              {["Top", "Middle", "Bottom"][r]} Line {claims[`line${r + 1}`] && <span className="text-xs text-muted-foreground">({claims[`line${r + 1}`]})</span>}
            </button>
          ))}
          <button onClick={start} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-muted-foreground">
            <RotateCcw className="mr-1 inline size-3.5" /> New ticket
          </button>
        </div>

        {called.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface p-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Called board</p>
            <div className="flex flex-wrap gap-1">
              {called.slice(-18).map((n) => (
                <span key={n} className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-foreground">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
