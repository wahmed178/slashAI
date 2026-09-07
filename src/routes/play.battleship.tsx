import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw, Shuffle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/play/battleship")({ component: Battleship });

const GRID = 10;
type Player = 1 | 2;

interface Ship {
  name: string;
  size: number;
  cells: number[];
}

const FLEET = [
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 },
];

const TOTAL_SHIP_CELLS = FLEET.reduce((a, s) => a + s.size, 0);

const cellName = (i: number) => `${String.fromCharCode(65 + Math.floor(i / GRID))}${(i % GRID) + 1}`;

function shipAt(ships: Ship[], i: number): Ship | undefined {
  return ships.find((s) => s.cells.includes(i));
}

function validCells(cells: number[]): boolean {
  const row = Math.floor(cells[0]! / GRID);
  const col = cells[0]! % GRID;
  const horiz = cells[1] === cells[0]! + 1;
  return cells.every((c, k) => {
    if (c < 0 || c >= GRID * GRID) return false;
    if (horiz) return Math.floor(c / GRID) === row && c % GRID === col + k;
    return c % GRID === col && Math.floor(c / GRID) === row + k;
  });
}

function freeCells(ships: Ship[], cells: number[]): boolean {
  return cells.every((c) => !ships.some((s) => s.cells.includes(c)));
}

function autoPlace(): Ship[] {
  for (let attempt = 0; attempt < 500; attempt++) {
    const ships: Ship[] = [];
    let ok = true;
    for (const f of FLEET) {
      let placed = false;
      for (let tries = 0; tries < 200 && !placed; tries++) {
        const horiz = Math.random() < 0.5;
        const row = Math.floor(Math.random() * GRID);
        const col = Math.floor(Math.random() * GRID);
        const cells = Array.from({ length: f.size }, (_, k) =>
          horiz ? row * GRID + col + k : (row + k) * GRID + col,
        );
        if (validCells(cells) && freeCells(ships, cells)) {
          ships.push({ name: f.name, size: f.size, cells });
          placed = true;
        }
      }
      if (!placed) {
        ok = false;
        break;
      }
    }
    if (ok) return ships;
  }
  return FLEET.map((f, idx) => ({
    name: f.name,
    size: f.size,
    cells: Array.from({ length: f.size }, (_, k) => idx * 10 + k),
  }));
}

type Phase = "setup" | "handoff" | "battle" | "over";

function Battleship() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [placing, setPlacing] = useState<Player>(1);
  const [ships, setShips] = useState<Record<Player, Ship[]>>({ 1: [], 2: [] });
  const [shots, setShots] = useState<Record<Player, number[]>>({ 1: [], 2: [] });
  const [current, setCurrent] = useState<Player>(1);
  const [selShip, setSelShip] = useState(0);
  const [vertical, setVertical] = useState(false);
  const [message, setMessage] = useState("Place your fleet, Commander.");
  const [winner, setWinner] = useState<Player | null>(null);

  const myShips = ships[placing] ?? [];
  const nextUnplaced = FLEET.findIndex((_, idx) => !myShips.some((s) => s.name === FLEET[idx]!.name));
  const activeSel = nextUnplaced === -1 ? -1 : selShip >= FLEET.length || !myShips.some((s) => s.name === FLEET[selShip!]?.name) ? nextUnplaced : selShip;

  function placeAt(i: number) {
    if (nextUnplaced === -1) return;
    const f = FLEET[activeSel]!;
    const row = Math.floor(i / GRID);
    const col = i % GRID;
    const cells = Array.from({ length: f.size }, (_, k) =>
      vertical ? (row + k) * GRID + col : row * GRID + col + k,
    );
    if (!validCells(cells) || !freeCells(myShips, cells)) {
      setMessage("Can't place there - out of bounds or overlapping.");
      return;
    }
    setShips((prev) => ({ ...prev, [placing]: [...prev[placing]!, { name: f.name, size: f.size, cells }] }));
    setMessage(`${f.name} placed.`);
  }

  function auto() {
    setShips((prev) => ({ ...prev, [placing]: autoPlace() }));
    setMessage("Fleet auto-placed. Ready when you are.");
  }

  function clearMine() {
    setShips((prev) => ({ ...prev, [placing]: [] }));
    setMessage("Cleared. Place your fleet again.");
  }

  function confirmFleet() {
    if (nextUnplaced !== -1) {
      setMessage("Place all 5 ships first (or tap Auto).");
      return;
    }
    if (placing === 1) {
      setPlacing(2);
      setSelShip(0);
      setMessage("Player 2: place your fleet.");
    } else {
      setPlacing(1);
      setCurrent(1);
      setPhase("handoff");
      setMessage("");
    }
  }

  function fire(i: number) {
    const enemy: Player = current === 1 ? 2 : 1;
    if ((shots[current] ?? []).includes(i)) return;
    const newShots = [...(shots[current] ?? []), i];
    setShots((prev) => ({ ...prev, [current]: newShots }));

    const ship = shipAt(ships[enemy] ?? [], i);
    if (!ship) {
      setMessage(`Player ${current} fired at ${cellName(i)} - miss.`);
    } else {
      const sunk = ship.cells.every((c) => newShots.includes(c));
      setMessage(
        sunk
          ? `Direct hit at ${cellName(i)} - ${ship.name} SUNK!`
          : `Direct hit at ${cellName(i)}!`,
      );
    }

    const allSunk = (ships[enemy] ?? []).every((s) => s.cells.every((c) => newShots.includes(c)));
    if (allSunk) {
      setWinner(current);
      setPhase("over");
      return;
    }
    setCurrent(enemy);
    setPhase("handoff");
  }

  function reset() {
    setPhase("setup");
    setPlacing(1);
    setShips({ 1: [], 2: [] });
    setShots({ 1: [], 2: [] });
    setCurrent(1);
    setSelShip(0);
    setVertical(false);
    setMessage("Place your fleet, Commander.");
    setWinner(null);
  }

  /* ── setup board ── */
  if (phase === "setup") {
    return (
      <AppShell title="Battleship">
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">🚢 Battleship</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pass-and-play: each commander places a secret fleet, then take turns firing.</p>
        </header>
        <div className="mx-auto max-w-md space-y-3">
          <p className="text-center text-[15px] font-bold text-foreground">
            Player {placing} - place your fleet
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {FLEET.map((f, idx) => {
              const placed = myShips.some((s) => s.name === f.name);
              const active = idx === activeSel;
              return (
                <button
                  key={f.name}
                  disabled={placed}
                  onClick={() => setSelShip(idx)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                    placed
                      ? "bg-primary/15 text-primary line-through"
                      : active
                        ? "bg-primary text-background"
                        : "border border-border bg-surface text-muted-foreground"
                  }`}
                >
                  {f.name} ({f.size})
                </button>
              );
            })}
          </div>
          <p className="text-center text-[11px] text-muted-foreground">
            Tap a ship, then tap the grid. Ships face right -{" "}
            <button onClick={() => setVertical((v) => !v)} className="font-bold text-primary underline">
              {vertical ? "vertical" : "horizontal"}
            </button>
          </p>
          <div className="grid grid-cols-10 gap-0.5">
            {Array.from({ length: GRID * GRID }, (_, i) => {
              const ship = shipAt(myShips, i);
              return (
                <button
                  key={i}
                  onClick={() => placeAt(i)}
                  className={`aspect-square rounded-[3px] text-[7px] transition-colors ${
                    ship ? "bg-primary/60" : "bg-surface-elevated hover:bg-primary/30"
                  }`}
                />
              );
            })}
          </div>
          <div className="flex justify-center gap-2">
            <button onClick={auto} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-[12px] font-medium text-foreground hover:bg-primary/10">
              <Shuffle className="size-3.5" /> Auto place
            </button>
            <button onClick={clearMine} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-[12px] font-medium text-foreground hover:bg-primary/10">
              <RefreshCw className="size-3.5" /> Clear
            </button>
            <button onClick={confirmFleet} className="rounded-lg bg-primary px-4 py-2 text-[12px] font-bold text-background hover:bg-primary/90">
              {placing === 1 ? "Done - Player 2's turn" : "Start battle!"}
            </button>
          </div>
          {message && <p className="text-center text-[12px] text-amber-400">{message}</p>}
        </div>
      </AppShell>
    );
  }

  /* ── handoff ── */
  if (phase === "handoff") {
    return (
      <AppShell title="Battleship">
        <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-5 text-center">
          <span className="text-[52px]">🤝</span>
          <h2 className="text-xl font-bold text-foreground">Pass the device to Player {current}</h2>
          <p className="text-sm text-muted-foreground">No peeking at the last board!</p>
          <button onClick={() => setPhase("battle")} className="rounded-xl bg-primary px-6 py-3 text-[14px] font-bold text-background hover:bg-primary/90">
            I'm Player {current} - Ready
          </button>
        </div>
      </AppShell>
    );
  }

  /* ── battle / over ── */
  const enemy: Player = current === 1 ? 2 : 1;
  const myShots = shots[current] ?? [];
  const hitsLanded = myShots.filter((s) => shipAt(ships[enemy] ?? [], s)).length;

  return (
    <AppShell title="Battleship">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🚢 Battleship</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tap the enemy waters to fire.</p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        <p className={`text-center text-[14px] font-bold ${phase === "over" ? "text-primary" : "text-foreground"}`}>
          {phase === "over"
            ? `Player ${winner} wins! All enemy ships destroyed.`
            : message || `Player ${current}: fire at will.`}
        </p>

        <div>
          <p className="mb-1.5 text-[12px] font-bold text-foreground">🎯 Enemy waters</p>
          <div className="grid grid-cols-10 gap-0.5">
            {Array.from({ length: GRID * GRID }, (_, i) => {
              const shot = myShots.includes(i);
              const hit = shot && Boolean(shipAt(ships[enemy] ?? [], i));
              return (
                <button
                  key={i}
                  disabled={phase === "over" || shot}
                  onClick={() => fire(i)}
                  className={`aspect-square rounded-[3px] text-[9px] font-bold transition-colors ${
                    hit
                      ? "bg-[#f87171] text-white"
                      : shot
                        ? "bg-surface-elevated text-muted-foreground"
                        : "bg-[#12233a] hover:bg-primary/40"
                  }`}
                >
                  {hit ? "✕" : shot ? "·" : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[12px] font-bold text-foreground">🛡️ Your fleet (Player {current})</p>
          <div className="grid grid-cols-10 gap-0.5">
            {Array.from({ length: GRID * GRID }, (_, i) => {
              const ship = shipAt(ships[current] ?? [], i);
              const incoming = (shots[enemy] ?? []).includes(i);
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-[3px] text-[8px] ${
                    ship ? (incoming ? "bg-[#f87171]" : "bg-primary/50") : incoming ? "bg-surface-elevated" : "bg-[#0a0d12]"
                  }`}
                >
                  {ship && incoming ? "✕" : ""}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-[12px] text-muted-foreground">
          <span>Hits landed: <b className="text-foreground">{hitsLanded}/{TOTAL_SHIP_CELLS}</b></span>
          <button onClick={reset} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 py-2 font-medium text-foreground hover:bg-primary/10">
            <RotateCcw className="size-3.5" /> New game
          </button>
        </div>
      </div>
    </AppShell>
  );
}
