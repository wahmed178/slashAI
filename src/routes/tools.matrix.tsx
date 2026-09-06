import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/matrix")({ component: MatrixCalculator });

type Mat = number[][];

function at(m: Mat, r: number, c: number): number {
  return m[r]?.[c] ?? 0;
}

const det2 = (m: Mat) => at(m, 0, 0) * at(m, 1, 1) - at(m, 0, 1) * at(m, 1, 0);

function det3(m: Mat): number {
  return (
    at(m, 0, 0) * (at(m, 1, 1) * at(m, 2, 2) - at(m, 1, 2) * at(m, 2, 1)) -
    at(m, 0, 1) * (at(m, 1, 0) * at(m, 2, 2) - at(m, 1, 2) * at(m, 2, 0)) +
    at(m, 0, 2) * (at(m, 1, 0) * at(m, 2, 1) - at(m, 1, 1) * at(m, 2, 0))
  );
}

function inverse2(m: Mat): Mat | null {
  const d = det2(m);
  if (Math.abs(d) < 1e-12) return null;
  return [
    [at(m, 1, 1) / d, -at(m, 0, 1) / d],
    [-at(m, 1, 0) / d, at(m, 0, 0) / d],
  ];
}

function inverse3(m: Mat): Mat | null {
  const d = det3(m);
  if (Math.abs(d) < 1e-12) return null;
  const cof = (r: number, c: number) => {
    const sub = m.filter((_, i) => i !== r).map((row) => row.filter((_, j) => j !== c));
    return ((r + c) % 2 === 0 ? 1 : -1) * det2(sub);
  };
  return Array.from({ length: 3 }, (_, r) => Array.from({ length: 3 }, (_, c) => cof(c, r) / d));
}

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(3).replace(/\.?0+$/, ""));

function MatrixCalculator() {
  const [n, setN] = useState<2 | 3>(3);
  const [m, setM] = useState<Mat>([
    [4, 7, 2],
    [3, 6, 1],
    [2, 5, 3],
  ]);

  const size = n;
  const sq: Mat = m.slice(0, size).map((row) => row.slice(0, size));
  const det = size === 2 ? det2(sq) : det3(sq);
  const inv = size === 2 ? inverse2(sq) : inverse3(sq);

  const setCell = (r: number, c: number, v: string) => {
    const next: Mat = m.map((row) => [...row]);
    const row = next[r];
    if (row) row[c] = Number(v) || 0;
    setM(next);
  };

  const gridCls = size === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <AppShell title="Matrix Calculator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔢 Matrix Calculator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Determinant and inverse for 2x2 and 3x3 matrices.</p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex gap-2">
          {[2, 3].map((s) => (
            <button key={s} type="button" onClick={() => setN(s as 2 | 3)} className={`min-h-[34px] flex-1 rounded-md border border-border text-[12.5px] font-medium ${n === s ? "bg-primary text-background" : "hover:text-primary"}`}>
              {s}x{s}
            </button>
          ))}
        </div>

        <div className={`grid gap-2 ${gridCls}`}>
          {sq.map((row, r) =>
            row.map((v, c) => (
              <input
                key={`${r}-${c}`}
                type="number"
                value={v}
                onChange={(e) => setCell(r, c, e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-surface text-center font-mono text-sm"
                aria-label={`Row ${r + 1} column ${c + 1}`}
              />
            )),
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Determinant</p>
          <p className="mt-1 text-2xl font-black text-primary">{fmt(det)}</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Inverse</p>
          {inv ? (
            <div className={`mx-auto mt-2 grid max-w-[220px] gap-1.5 ${gridCls}`}>
              {inv.flat().map((v, i) => (
                <span key={i} className="rounded-md bg-surface-elevated py-1.5 text-center font-mono text-[13px] text-foreground">
                  {fmt(v)}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-red">Singular matrix - no inverse exists.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
