import { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/habit-stack")({
  component: HabitStackingPlanner,
});

interface StackItem { id: number; habit: string; reward: string; }
type StackType = "morning" | "evening" | "work";

const STACK_LABELS: Record<StackType, { label: string; icon: string }> = {
  morning: { label: "Morning", icon: "🌅" },
  evening: { label: "Evening", icon: "🌙" },
  work: { label: "Work", icon: "💼" },
};

function HabitStackingPlanner() {
  const [activeStack, setActiveStack] = useState<StackType>("morning");
  const [stacks, setStacks] = useState<Record<StackType, StackItem[]>>({
    morning: [
      { id: 1, habit: "Wake up", reward: "Glass of water" },
      { id: 2, habit: "Drink water", reward: "Stretch for 2 min" },
    ],
    evening: [{ id: 1, habit: "Put phone away", reward: "Read for 10 min" }],
    work: [{ id: 1, habit: "Open laptop", reward: "Review task list" }],
  });
  const [completedToday, setCompletedToday] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("slashai.habit-stack.done") || "{}"); } catch { return {}; }
  });
  const [habit, setHabit] = useState("");
  const [reward, setReward] = useState("");

  const addItem = useCallback(() => {
    if (!habit.trim()) return;
    setStacks((s) => ({
      ...s,
      [activeStack]: [...s[activeStack], { id: Date.now(), habit: habit.trim(), reward: reward.trim() || "None" }],
    }));
    setHabit(""); setReward("");
  }, [habit, reward, activeStack]);

  const removeItem = (id: number) => {
    setStacks((s) => ({ ...s, [activeStack]: s[activeStack].filter((i) => i.id !== id) }));
  };

  const toggleDone = (key: string) => {
    setCompletedToday((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem("slashai.habit-stack.done", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const currentItems = stacks[activeStack];
  const doneCount = currentItems.filter((item) => completedToday[`${activeStack}-${item.id}`]).length;
  const streak = Object.keys(completedToday).length > 0 ? Math.min(7, Object.keys(completedToday).filter((k) => k.startsWith(activeStack)).length) : 0;

  return (
    <AppShell title="Habit Stacking Planner">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📋 Habit Stacking Planner</h1>
        <p className="mt-1 text-sm text-muted-foreground">Design routines based on Atomic Habits — "After I [habit], I will [new habit]."</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        {/* Stack selector */}
        <div className="flex gap-2">
          {(Object.keys(STACK_LABELS) as StackType[]).map((key) => (
            <button key={key} onClick={() => setActiveStack(key)} className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${activeStack === key ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
              {STACK_LABELS[key].icon} {STACK_LABELS[key].label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-surface p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{doneCount}/{currentItems.length}</p>
            <p className="text-[10px] text-muted-foreground">Completed Today</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 text-center">
            <p className="text-2xl font-bold text-primary">{streak}</p>
            <p className="text-[10px] text-muted-foreground">Day Streak</p>
          </div>
        </div>

        {/* Visual chain */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3">{STACK_LABELS[activeStack].icon} {STACK_LABELS[activeStack].label} Stack</p>
          {currentItems.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No habits yet. Add your first habit below.</p>
          ) : (
            <div className="space-y-2">
              {currentItems.map((item, idx) => {
                const key = `${activeStack}-${item.id}`;
                const done = completedToday[key];
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <button onClick={() => toggleDone(key)} className={`flex size-7 shrink-0 items-center justify-center rounded-lg border text-sm transition-colors ${done ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-surface-elevated text-muted-foreground hover:border-primary/30"}`}>
                      {done ? "✓" : idx + 1}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {idx === 0 ? "" : "After "}{item.habit}
                      </p>
                      <p className="text-[11px] text-muted-foreground">→ Reward: {item.reward}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="shrink-0 text-xs text-muted-foreground hover:text-red-400">✕</button>
                    {idx < currentItems.length - 1 && <div className="absolute left-[27px] mt-8 w-px h-2 bg-border" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add form */}
        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">Add to stack</p>
          <input value={habit} onChange={(e) => setHabit(e.target.value)} placeholder="After I [existing habit]..." className="h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none focus:border-primary/50" onKeyDown={(e) => e.key === "Enter" && addItem()} />
          <input value={reward} onChange={(e) => setReward(e.target.value)} placeholder="Then reward myself with [optional]..." className="h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none focus:border-primary/50" onKeyDown={(e) => e.key === "Enter" && addItem()} />
          <button onClick={addItem} disabled={!habit.trim()} className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">Add Habit</button>
        </div>
      </div>
    </AppShell>
  );
}
