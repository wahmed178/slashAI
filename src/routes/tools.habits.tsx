import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Plus, Trash2, Flame } from "lucide-react";

export const Route = createFileRoute("/tools/habits")({
  head: () => ({ meta: [{ title: "Habit Tracker — SlashAI" }] }),
  component: HabitTracker,
});

type Habit = { id: string; name: string; color: string; days: Record<string, boolean> };

const COLORS = ["#2dd4bf", "#58a6ff", "#3fb950", "#d29922", "#f85149", "#bc8cff", "#f778ba", "#ff9a3c"];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function dateKey(d: Date) { return d.toISOString().slice(0, 10); }
function today() { return dateKey(new Date()); }
function getStreak(days: Record<string, boolean>): number {
  let streak = 0;
  const d = new Date();
  while (days[dateKey(d)]) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}

function ContributionGrid({ days, color }: { days: Record<string, boolean>; color: string }) {
  const weeks: string[][] = [];
  const d = new Date();
  d.setDate(d.getDate() - 83); // ~12 weeks back
  // Align to Sunday
  d.setDate(d.getDate() - d.getDay());

  for (let w = 0; w < 12; w++) {
    const week: string[] = [];
    for (let day = 0; day < 7; day++) {
      week.push(dateKey(d));
      d.setDate(d.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <div className="flex gap-[3px]">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((dk) => (
            <div
              key={dk}
              className="size-[14px] rounded-[2px] transition-colors"
              style={{
                background: days[dk] ? color : "var(--surface-elevated, #1c2128)",
                opacity: dk > today() ? 0.3 : 1,
              }}
              title={dk}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try { return JSON.parse(localStorage.getItem("habits") || "[]"); } catch { return []; }
  });
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<string>(COLORS[0]!);

  const save = (next: Habit[]) => {
    setHabits(next);
    try { localStorage.setItem("habits", JSON.stringify(next)); } catch { /* ignore */ }
  };

  const addHabit = () => {
    if (!newName.trim()) return;
    const c = newColor || COLORS[0]!;
    save([...habits, { id: crypto.randomUUID(), name: newName.trim(), color: c, days: {} }]);
    setNewName("");
  };

  const toggleDay = (id: string, date: string) => {
    save(habits.map((h) => h.id === id ? { ...h, days: { ...h.days, [date]: !h.days[date] } } : h));
  };

  const removeHabit = (id: string) => save(habits.filter((h) => h.id !== id));

  return (
    <AppShell title="Habit Tracker">
      <div className="mx-auto max-w-3xl space-y-6 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Habit Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">Build consistency — track habits with a visual grid.</p>
        </div>

        {/* Add habit */}
        <div className="flex items-center gap-2">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHabit()} placeholder="New habit (e.g., Read 30 min)" className="h-10 flex-1 rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none" />
          <div className="flex gap-1">
            {COLORS.map((c) => (
              <button key={c} onClick={() => setNewColor(c)} className="size-6 rounded-full border-2" style={{ background: c, borderColor: c === newColor ? "#f0f6fc" : "transparent" }} />
            ))}
          </div>
          <button onClick={addHabit} className="flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm text-white hover:bg-primary/90"><Plus className="size-4" /> Add</button>
        </div>

        {/* Habit list */}
        <div className="space-y-4">
          {habits.map((h) => {
            const streak = getStreak(h.days);
            const todayDone = h.days[today()];
            const completedDays = Object.values(h.days).filter(Boolean).length;
            return (
              <div key={h.id} className="rounded-[10px] border border-border bg-surface p-4 transition-all hover:border-[#484f58]">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleDay(h.id, today())} className={`flex size-9 items-center justify-center rounded-lg border-2 transition-all ${todayDone ? "border-transparent text-white" : "border-border bg-surface-elevated text-muted-foreground hover:border-[#484f58]"}`} style={todayDone ? { background: h.color } : {}}>
                      {todayDone ? "✓" : ""}
                    </button>
                    <div>
                      <p className="text-sm font-medium text-foreground">{h.name}</p>
                      <p className="text-[10px] text-muted-foreground">{completedDays} days total</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {streak > 0 && (
                      <span className="flex items-center gap-1 text-xs text-yellow"><Flame className="size-3.5" /> {streak} day streak</span>
                    )}
                    <button onClick={() => removeHabit(h.id)} className="text-muted-foreground hover:text-red"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
                <ContributionGrid days={h.days} color={h.color} />
              </div>
            );
          })}
          {habits.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No habits yet. Add one above to start tracking!
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
