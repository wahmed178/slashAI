import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/poll")({ component: PollCreator });

function PollCreator() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [createdPoll, setCreatedPoll] = useState<{ id: string; question: string; options: string[]; votes: number[] } | null>(null);
  const [voted, setVoted] = useState<number | null>(null);

  const addOption = () => { if (options.length < 6) setOptions(o => [...o, ""]); };
  const removeOption = (i: number) => { if (options.length > 2) setOptions(o => o.filter((_, idx) => idx !== i)); };

  const createPoll = () => {
    if (!question.trim() || options.filter(o => o.trim()).length < 2) return;
    const id = Math.random().toString(36).slice(2, 8);
    const poll = { id, question: question.trim(), options: options.filter(o => o.trim()), votes: options.filter(o => o.trim()).map(() => 0) };
    setCreatedPoll(poll);
    setVoted(null);
  };

  const castVote = (idx: number) => {
    if (!createdPoll || voted !== null) return;
    setVoted(idx);
    setCreatedPoll(p => p ? { ...p, votes: p.votes.map((v, i) => i === idx ? v + 1 : v) } : null);
  };

  const totalVotes = createdPoll ? createdPoll.votes.reduce<number>((s, v) => s + v, 0) : 0;

  const embedCode = createdPoll ? `<iframe src="${window.location.origin}/poll?id=${createdPoll.id}" width="400" height="300" frameborder="0"></iframe>` : "";

  return (
    <AppShell title="Poll Creator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📊 Instant Poll Creator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a poll, share the link, see results as a live bar chart.</p>
      </header>

      {!createdPoll ? (
        <div className="mx-auto max-w-lg space-y-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Question</label>
            <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="What do you want to ask?"
              className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm focus:border-primary/60 focus:outline-none" />
          </div>
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input value={opt} onChange={e => { const n = [...options]; n[i] = e.target.value; setOptions(n); }}
                placeholder={`Option ${i + 1}`}
                className="h-9 flex-1 rounded-lg border border-border bg-surface px-3 text-sm focus:border-primary/60 focus:outline-none" />
              {options.length > 2 && <button onClick={() => removeOption(i)} className="h-9 rounded-lg px-2 text-muted-foreground hover:text-red-400">×</button>}
            </div>
          ))}
          {options.length < 6 && <button onClick={addOption} className="h-8 w-full rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-foreground">+ Add option</button>}
          <button onClick={createPoll} className="h-10 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90">Create Poll</button>
        </div>
      ) : (
        <div className="mx-auto max-w-lg">
          <h2 className="mb-4 text-lg font-semibold text-foreground">{createdPoll.question}</h2>
          <div className="space-y-2">
            {createdPoll.options.map((opt, i) => {
              const pct = totalVotes > 0 ? Math.round(((createdPoll.votes[i] ?? 0) / totalVotes) * 100) : 0;
              return (
                <button key={i} onClick={() => castVote(i)} disabled={voted !== null}
                  className={`relative w-full overflow-hidden rounded-xl border p-3 text-left transition-colors ${voted === i ? "border-primary" : voted !== null ? "border-border" : "border-border hover:border-primary/40"}`}>
                  <div className="absolute inset-0 bg-primary/10 transition-all duration-500" style={{ width: voted !== null ? `${pct}%` : "0%" }} />
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm text-foreground">{opt}</span>
                    {voted !== null && <span className="text-xs font-medium text-primary">{pct}%</span>}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">{totalVotes} vote{totalVotes !== 1 ? "s" : ""}</p>

          {voted !== null && (
            <div className="mt-4 rounded-xl border border-border bg-surface p-3">
              <p className="mb-2 text-xs font-semibold text-foreground">Embed Code</p>
              <code className="block whitespace-pre-wrap rounded-lg bg-surface-elevated p-2 text-[10px] text-muted-foreground">{embedCode}</code>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
