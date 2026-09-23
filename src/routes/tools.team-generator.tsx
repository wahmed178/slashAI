import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/team-generator")({ component: TeamGenerator });

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i]!;
    out[i] = out[j]!;
    out[j] = tmp;
  }
  return out;
}

function TeamGenerator() {
  const [raw, setRaw] = useState("");
  const [teamCount, setTeamCount] = useState(2);
  const [seed, setSeed] = useState(0);

  const names = useMemo(() => raw.split(/[\n,]+/).map((n) => n.trim()).filter(Boolean), [raw]);

  const teams = useMemo(() => {
    if (names.length < teamCount) return [];
    const shuffled = shuffle(names);
    const teams: string[][] = Array.from({ length: teamCount }, () => []);
    // round-robin deal so sizes differ by at most one
    shuffled.forEach((name, i) => teams[i % teamCount]!.push(name));
    return teams;
    // seed is a rebuild trigger only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names, teamCount, seed]);

  const copyAll = async () => {
    const text = teams.map((t, i) => `Team ${i + 1}:\n${t.map((n) => `- ${n}`).join("\n")}`).join("\n\n");
    try { await navigator.clipboard.writeText(text); } catch { /* selectable anyway */ }
  };

  return (
    <AppShell title="Random Team Generator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">👥 Random Team Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Paste names, pick a team count, get fair balanced groups. Great for classrooms, cricket and game night.</p>
      </header>

      <div className="mx-auto max-w-3xl space-y-4">
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={6}
          placeholder={"One name per line (or comma-separated):\nAarav\nDiya\nKabir\nMeera\n…"}
          className="w-full rounded-xl border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Teams</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setTeamCount((c) => Math.max(2, c - 1))} className="size-8 rounded-lg border border-border text-foreground">−</button>
              <span className="w-8 text-center text-lg font-bold text-foreground">{teamCount}</span>
              <button onClick={() => setTeamCount((c) => Math.min(10, c + 1))} className="size-8 rounded-lg border border-border text-foreground">+</button>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{names.length} names · ~{names.length ? Math.ceil(names.length / teamCount) : 0} per team</span>
          <div className="ml-auto flex gap-2">
            <button onClick={() => setSeed((s) => s + 1)} disabled={names.length < teamCount} className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-background disabled:opacity-40">
              🎲 Generate
            </button>
            {teams.length > 0 && (
              <button onClick={() => void copyAll()} className="h-10 rounded-xl border border-border px-4 text-sm text-foreground">
                Copy
              </button>
            )}
          </div>
        </div>

        {raw.trim() && names.length < teamCount && (
          <p className="text-sm text-amber-400">Add at least {teamCount} names to form {teamCount} teams.</p>
        )}

        {teams.length > 0 && (
          <div className={`grid gap-3 ${teamCount <= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
            {teams.map((team, i) => (
              <div key={i} className="rounded-2xl border border-border bg-surface p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">Team {i + 1}</span>
                  <span className="text-xs text-muted-foreground">{team.length}</span>
                </div>
                <ul className="space-y-1">
                  {team.map((n, j) => (
                    <li key={j} className="rounded-lg bg-background px-2 py-1 text-sm text-foreground">{n}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <FaqSection />
      </div>
    </AppShell>
  );
}
