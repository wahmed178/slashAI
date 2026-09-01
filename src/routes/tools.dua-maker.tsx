import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/dua-maker")({ component: DuaMaker });

interface Dua { id: string; text: string; category: string; answered: boolean; answeredDate?: string; created: string }

const CATEGORIES = ["Health", "Family", "Career", "Wealth", "Guidance", "Forgiveness", "General"];
const LS_KEY = "slashai.duas";

const SAMPLE_DUAS = [
  { text: "Rabbi zidni ilma", meaning: "My Lord, increase me in knowledge", category: "Guidance" },
  { text: "Hasbunallahu wa ni'mal wakeel", meaning: "Allah is sufficient for us, and He is the best Disposer of affairs", category: "General" },
  { text: "Allahumma inni as'aluka al-afiyah", meaning: "O Allah, I ask You for well-being", category: "Health" },
];

function DuaMaker() {
  const [duas, setDuas] = useState<Dua[]>(() => { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; } });
  const [text, setText] = useState("");
  const [category, setCategory] = useState("General");
  const [showReading, setShowReading] = useState(false);
  const [readingIdx, setReadingIdx] = useState(0);

  useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(duas)); } catch {} }, [duas]);

  const addDua = () => {
    if (!text.trim()) return;
    setDuas(d => [...d, { id: crypto.randomUUID(), text: text.trim(), category, answered: false, created: new Date().toISOString() }]);
    setText("");
  };

  const markAnswered = (id: string) => setDuas(d => d.map(dua => dua.id === id ? { ...dua, answered: true, answeredDate: new Date().toLocaleDateString("en-IN") } : dua));
  const removeDua = (id: string) => setDuas(d => d.filter(dua => dua.id !== id));

  const loadSamples = () => {
    const newDuas = SAMPLE_DUAS.map(s => ({
      id: crypto.randomUUID(), text: s.text, category: s.category, answered: false, created: new Date().toISOString(),
    }));
    setDuas(d => [...newDuas, ...d]);
  };

  const currentDua = duas[readingIdx];

  if (showReading && currentDua) {
    return (
      <AppShell title="Dua Reading">
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <p className="mb-2 text-xs text-muted-foreground">Dua {readingIdx + 1} of {duas.length}</p>
          <p className="mb-4 max-w-lg text-2xl font-bold leading-relaxed text-foreground">{currentDua.text}</p>
          <p className="mb-1 text-xs text-muted-foreground">Category: {currentDua.category}</p>
          {currentDua.answered && <p className="text-xs text-green-400">✓ Answered on {currentDua.answeredDate}</p>}
          <div className="mt-6 flex gap-3">
            <button onClick={() => setReadingIdx(i => i > 0 ? i - 1 : duas.length - 1)} className="h-10 rounded-lg border border-border px-4 text-sm">← Previous</button>
            <button onClick={() => setReadingIdx(i => (i + 1) % duas.length)} className="h-10 rounded-lg border border-border px-4 text-sm">Next →</button>
          </div>
          <button onClick={() => setShowReading(false)} className="mt-4 text-xs text-muted-foreground hover:text-foreground">Exit reading mode</button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Dua Maker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🤲 Personal Dua List</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your private list of duas. All data stays in your browser.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-xl border border-border bg-surface p-3">
          <div className="flex gap-2">
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && addDua()} placeholder="Enter dua text..."
              className="h-9 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none" />
            <select value={category} onChange={e => setCategory(e.target.value)} className="h-9 rounded-lg border border-border bg-surface-elevated px-2 text-xs">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={addDua} className="h-9 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground">Add</button>
          </div>
          {duas.length === 0 && <button onClick={loadSamples} className="mt-2 text-xs text-primary hover:underline">Load sample duas</button>}
        </div>

        <div className="space-y-2">
          {duas.map(dua => (
            <div key={dua.id} className={`rounded-xl border bg-surface p-3 ${dua.answered ? "border-green-500/30" : "border-border"}`}>
              <div className="flex items-start justify-between">
                <p className="text-sm text-foreground">{dua.text}</p>
                <div className="flex gap-1">
                  {!dua.answered && <button onClick={() => markAnswered(dua.id)} className="rounded px-1.5 text-[10px] text-green-400 hover:bg-green-500/10">✓ Answered</button>}
                  <button onClick={() => removeDua(dua.id)} className="rounded px-1.5 text-[10px] text-muted-foreground hover:text-red-400">×</button>
                </div>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-md bg-surface-elevated px-1.5 py-0.5 text-[10px] text-muted-foreground">{dua.category}</span>
                {dua.answered && <span className="text-[10px] text-green-400">✓ Answered {dua.answeredDate}</span>}
              </div>
            </div>
          ))}
        </div>

        {duas.length > 0 && (
          <button onClick={() => { setShowReading(true); setReadingIdx(0); }}
            className="h-10 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90">
            🤲 Start Reading Mode ({duas.length} duas)
          </button>
        )}
      </div>
    </AppShell>
  );
}
