import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/standup")({ component: StandupGenerator });

const LS_KEY = "slashai.standups";

function StandupGenerator() {
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [blockers, setBlockers] = useState("");
  const [history, setHistory] = useState<{ date: string; text: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(history.slice(0, 30))); } catch {} }, [history]);

  const formatStandup = (style: string): string => {
    const d = new Date().toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
    if (style === "slack") {
      let s = `*Standup ${d}*\n\n`;
      if (yesterday) s += `:white_check_mark: *Yesterday:*\n${yesterday.split("\n").map(l => `• ${l}`).join("\n")}\n\n`;
      if (today) s += `:rocket: *Today:*\n${today.split("\n").map(l => `• ${l}`).join("\n")}\n\n`;
      if (blockers) s += `:warning: *Blockers:*\n${blockers.split("\n").map(l => `• ${l}`).join("\n")}\n`;
      return s;
    }
    if (style === "bullet") {
      let s = `Standup — ${d}\n\n`;
      if (yesterday) s += `Yesterday:\n${yesterday.split("\n").map(l => `• ${l}`).join("\n")}\n\n`;
      if (today) s += `Today:\n${today.split("\n").map(l => `• ${l}`).join("\n")}\n\n`;
      if (blockers) s += `Blockers:\n${blockers.split("\n").map(l => `• ${l}`).join("\n")}\n`;
      return s;
    }
    if (style === "email") {
      let s = `Subject: Daily Standup — ${d}\n\nHi team,\n\nHere's my standup:\n\nYesterday I completed:\n${yesterday.split("\n").map(l => `  - ${l}`).join("\n") || "  (none)"}`;
      s += `\n\nToday I will work on:\n${today.split("\n").map(l => `  - ${l}`).join("\n") || "  (none)"}`;
      if (blockers) s += `\n\nBlockers:\n${blockers.split("\n").map(l => `  - ${l}`).join("\n")}`;
      s += `\n\nThanks,\n`;
      return s;
    }
    return `Yesterday: ${yesterday}\nToday: ${today}\nBlockers: ${blockers || "None"}`;
  };

  const handleCopy = async (style: string) => {
    try { await navigator.clipboard.writeText(formatStandup(style)); } catch {}
  };

  const handleSave = () => {
    const text = formatStandup("bullet");
    setHistory(h => [{ date: new Date().toLocaleDateString("en-IN"), text }, ...h]);
    setYesterday(""); setToday(""); setBlockers("");
  };

  return (
    <AppShell title="Standup Generator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📋 Daily Standup Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Fill in 3 sections → get a formatted standup message instantly.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-surface p-3">
            <label className="mb-1 block text-xs font-semibold text-foreground">Yesterday I did:</label>
            <textarea value={yesterday} onChange={e => setYesterday(e.target.value)} rows={3} placeholder="What did you accomplish yesterday?"
              className="w-full rounded-lg border border-border bg-surface-elevated p-2 text-xs text-foreground focus:outline-none" />
          </div>
          <div className="rounded-xl border border-border bg-surface p-3">
            <label className="mb-1 block text-xs font-semibold text-foreground">Today I will:</label>
            <textarea value={today} onChange={e => setToday(e.target.value)} rows={3} placeholder="What are you working on today?"
              className="w-full rounded-lg border border-border bg-surface-elevated p-2 text-xs text-foreground focus:outline-none" />
          </div>
          <div className="rounded-xl border border-border bg-surface p-3">
            <label className="mb-1 block text-xs font-semibold text-foreground">Blockers (optional):</label>
            <textarea value={blockers} onChange={e => setBlockers(e.target.value)} rows={2} placeholder="Any blockers?"
              className="w-full rounded-lg border border-border bg-surface-elevated p-2 text-xs text-foreground focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleCopy("slack")} className="flex-1 h-9 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:opacity-90">Copy Slack</button>
            <button onClick={() => handleCopy("bullet")} className="flex-1 h-9 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent">Copy Bullet</button>
            <button onClick={() => handleCopy("email")} className="flex-1 h-9 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent">Copy Email</button>
          </div>
          <button onClick={handleSave} className="h-9 w-full rounded-lg bg-surface-elevated text-xs font-medium text-foreground hover:bg-accent">Save & Clear</button>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Preview</h2>
          <div className="rounded-xl border border-border bg-surface p-4">
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">{formatStandup("bullet")}</pre>
          </div>
          {history.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-xs font-semibold text-foreground">History (last 10)</h3>
              <div className="space-y-2 max-h-60 overflow-auto">
                {history.slice(0, 10).map((h, i) => (
                  <div key={i} className="rounded-lg border border-border bg-surface p-2.5">
                    <p className="text-[10px] text-muted-foreground">{h.date}</p>
                    <p className="mt-1 whitespace-pre-wrap text-[11px] text-foreground line-clamp-3">{h.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
