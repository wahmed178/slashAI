import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/dots-boxes")({ component: DotsBoxes });

const N = 5; // 5x5 dots -> 4x4 boxes
const B = N - 1;

type Owner = 1 | 2 | null;

export function DotsBoxes() {
  // h[r][c]: edge between dot (r,c) and (r,c+1); v[r][c]: between (r,c) and (r+1,c)
  const [h, setH] = useState<boolean[][]>(() => Array.from({ length: N }, () => Array(B).fill(false)));
  const [v, setV] = useState<boolean[][]>(() => Array.from({ length: B }, () => Array(N).fill(false)));
  const [owner, setOwner] = useState<Owner[][]>(() =>
    Array.from({ length: B }, () => Array<Owner>(B).fill(null)),
  );
  const [turn, setTurn] = useState<1 | 2>(1);
  const [last, setLast] = useState<string | null>(null);

  const scores: [number, number] = [
    owner.flat().filter((o) => o === 1).length,
    owner.flat().filter((o) => o === 2).length,
  ];
  const totalEdges = N * B + B * N;
  const claimed = h.flat().filter(Boolean).length + v.flat().filter(Boolean).length;
  const gameOver = claimed === totalEdges;

  function completeBoxes(hh: boolean[][], vv: boolean[][], player: 1 | 2): number {
    const own = owner.map((r) => [...r]);
    let got = 0;
    for (let r = 0; r < B; r++) {
      for (let c = 0; c < B; c++) {
        if (own[r]![c]) continue;
        if (hh[r]![c] && hh[r! + 1]![c] && vv[r]![c] && vv[r]![c! + 1]) {
          own[r]![c] = player;
          got++;
        }
      }
    }
    if (got) setOwner(own);
    return got;
  }

  function take(kind: "h" | "v", r: number, c: number) {
    if (gameOver) return;
    const already = kind === "h" ? h[r]![c] : v[r]![c];
    if (already) return;
    const hh = h.map((row) => [...row]);
    const vv = v.map((row) => [...row]);
    if (kind === "h") hh[r]![c] = true;
    else vv[r]![c] = true;
    setH(hh);
    setV(vv);
    setLast(`${kind}${r}-${c}`);
    const got = completeBoxes(hh, vv, turn);
    if (!got) setTurn(turn === 1 ? 2 : 1);
  }

  function reset() {
    setH(Array.from({ length: N }, () => Array(B).fill(false)));
    setV(Array.from({ length: B }, () => Array(N).fill(false)));
    setOwner(Array.from({ length: B }, () => Array<Owner>(B).fill(null)));
    setTurn(1);
    setLast(null);
  }

  const winner =
    scores[0] === scores[1] ? null : scores[0]! > scores[1]! ? 1 : 2;

  // render helpers
  const isEdge = (kind: "h" | "v", r: number, c: number) => (kind === "h" ? h[r]?.[c] : v[r]?.[c]) ?? false;
  const edgeIsLast = (kind: "h" | "v", r: number, c: number) => last === `${kind}${r}-${c}`;

  return (
    <AppShell title="Dots and Boxes">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔗 Dots and Boxes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Take turns drawing lines. Complete a box to claim it and go again - most boxes wins.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
          <span className={`text-[13px] font-bold ${turn === 1 ? "text-primary" : "text-amber-400"}`}>
            {gameOver ? (winner ? `Player ${winner} wins!` : "Draw!") : `Player ${turn}'s turn`}
          </span>
          <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
            <span>🔴 {scores[0]}</span>
            <span>🟡 {scores[1]}</span>
            <button onClick={reset} className="flex items-center gap-1 rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 font-medium text-foreground hover:bg-primary/10">
              <RotateCcw className="size-3" /> Reset
            </button>
          </div>
        </div>

        <div className="mx-auto aspect-square w-full max-w-[400px] select-none rounded-xl border border-border bg-surface p-2">
          <div className="grid h-full w-full grid-cols-9 grid-rows-9">
            {Array.from({ length: 81 }, (_, i) => {
              const gr = Math.floor(i / 9);
              const gc = i % 9;
              const isDot = gr % 2 === 0 && gc % 2 === 0;
              const isH = gr % 2 === 0 && gc % 2 === 1;
              const isV = gr % 2 === 1 && gc % 2 === 0;
              const isBox = gr % 2 === 1 && gc % 2 === 1;
              const r = Math.floor(gr / 2);
              const c = Math.floor(gc / 2);

              if (isDot)
                return (
                  <div key={i} className="flex items-center justify-center">
                    <span className="size-2 rounded-full bg-foreground/70" />
                  </div>
                );

              if (isH) {
                const br = r;
                const bc = c;
                const claimedEdge = isEdge("h", br, bc);
                return (
                  <button
                    key={i}
                    onClick={() => take("h", br, bc)}
                    disabled={claimedEdge}
                    aria-label={`Horizontal line row ${br + 1} col ${bc + 1}`}
                    className="group flex items-center justify-center px-0.5"
                  >
                    <span
                      className={`h-[5px] w-full rounded-full transition-all ${
                        claimedEdge
                          ? edgeIsLast("h", br, bc)
                            ? "bg-primary"
                            : "bg-foreground/80"
                          : "bg-border/60 group-hover:bg-primary/60"
                      }`}
                    />
                  </button>
                );
              }

              if (isV) {
                const br = r;
                const bc = c;
                const claimedEdge = isEdge("v", br, bc);
                return (
                  <button
                    key={i}
                    onClick={() => take("v", br, bc)}
                    disabled={claimedEdge}
                    aria-label={`Vertical line row ${br + 1} col ${bc + 1}`}
                    className="group flex items-center justify-center py-0.5"
                  >
                    <span
                      className={`h-full w-[5px] rounded-full transition-all ${
                        claimedEdge
                          ? edgeIsLast("v", br, bc)
                            ? "bg-primary"
                            : "bg-foreground/80"
                          : "bg-border/60 group-hover:bg-primary/60"
                      }`}
                    />
                  </button>
                );
              }

              if (isBox) {
                const o = owner[r]?.[c];
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center text-[15px] font-black ${
                      o === 1 ? "bg-[#f87171]/25 text-[#f87171]" : o === 2 ? "bg-[#fbbf24]/25 text-amber-500" : ""
                    }`}
                  >
                    {o ? (o === 1 ? "1" : "2") : ""}
                  </div>
                );
              }
              return <div key={i} />;
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
