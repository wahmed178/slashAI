import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Plus, Trash2 } from "lucide-react";

interface Countdown { id: string; name: string; target: string; }

function getCountdowns(): Countdown[] {
  try { return JSON.parse(localStorage.getItem("countdowns") || "[]"); } catch { return []; }
}

function saveCountdowns(c: Countdown[]) { localStorage.setItem("countdowns", JSON.stringify(c)); }

export const Route = createFileRoute("/tools/countdown")({
  head: () => ({ meta: [{ title: "Countdown Timer \u2014 SlashAI" }] }),
  component: CountdownTimer,
});

function CountdownTimer() {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [countdowns, setCountdowns] = useState<Countdown[]>(getCountdowns);
  const [active, setActive] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);
  const [now, setNow] = useState(Date.now());

  const selectedTarget = target ? new Date(target).getTime() : null;

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);

  useEffect(() => {
    if (!selectedTarget) { setActive(null); return; }
    const diff = selectedTarget - now;
    if (diff <= 0) { setActive({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
    setActive({
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins: Math.floor((diff / (1000 * 60)) % 60),
      secs: Math.floor((diff / 1000) % 60),
    });
  }, [selectedTarget, now]);

  const addCountdown = () => {
    if (!name || !target || countdowns.length >= 5) return;
    const c = [...countdowns, { id: Date.now().toString(), name, target }];
    setCountdowns(c);
    saveCountdowns(c);
    setName(""); setTarget("");
  };

  const remove = (id: string) => {
    const c = countdowns.filter((x) => x.id !== id);
    setCountdowns(c);
    saveCountdowns(c);
  };

  const UnitBox = ({ val, label }: { val: number; label: string }) => (
    <div className="flex flex-col items-center rounded-lg bg-surface p-3 min-w-[60px]">
      <span className="text-2xl font-bold font-mono text-primary">{String(val).padStart(2, "0")}</span>
      <span className="mt-0.5 text-[10px] text-muted-foreground uppercase">{label}</span>
    </div>
  );

  return (
    <AppShell title="Countdown Timer" back={{ to: "/tools", label: "Tools" }}>
      <div className="mt-4 space-y-5">
        {active && (
          <div className="flex justify-center gap-2">
            <UnitBox val={active.days} label="Days" />
            <UnitBox val={active.hours} label="Hours" />
            <UnitBox val={active.mins} label="Minutes" />
            <UnitBox val={active.secs} label="Seconds" />
          </div>
        )}

        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <div>
            <label className="text-sm text-foreground">Event name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Eid ul-Adha"
              className="mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-sm text-foreground">Target date & time</label>
            <input type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" />
          </div>
          <button type="button" onClick={addCountdown} disabled={!name || !target || countdowns.length >= 5}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            <Plus className="size-4" /> Add countdown
          </button>
        </div>

        {countdowns.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Saved countdowns</p>
            {countdowns.map((c) => (
              <div key={c.id} onClick={() => setTarget(c.target)}
                className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 cursor-pointer hover:border-primary/40">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(c.target).toLocaleString()}</p>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); remove(c.id); }}
                  className="p-2 text-muted-foreground hover:text-red"><Trash2 className="size-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
