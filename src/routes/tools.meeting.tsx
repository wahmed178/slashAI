import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/meeting")({
  component: MeetingNotesFormatter,
});

function formatMeetingNotes(raw: string): { decisions: string[]; actions: { person: string; task: string }[]; budget: string; nextMeeting: string; notes: string[] } {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
  const decisions: string[] = [];
  const actions: { person: string; task: string }[] = [];
  let budget = "";
  let nextMeeting = "";
  const notes: string[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Budget detection
    if (lower.match(/budget|cost|price|spend|rupee|inr|usd|\$|₹/)) {
      const match = line.match(/([\d,]+(?:\.\d+)?)\s*(k|lakh|lac|crore)?/i);
      if (match) {
        budget = match[0].trim();
        continue;
      }
    }

    // Next meeting detection
    if (lower.match(/next\s+(meeting|call|sync|standup|huddle)/)) {
      nextMeeting = line.replace(/^[-*•]\s*/, "").replace(/^(sarah|john|team|everyone|we|i)\s+(said|mentioned|noted|agreed|will|should)\s*/i, "").trim();
      continue;
    }

    // Action items — person will/should/needs to do something
    const actionMatch = line.match(/^[-*•]?\s*(\w+)\s+(will|should|needs? to|is going to|gonna|has to|can|shall)\s+(.+)/i);
    if (actionMatch) {
      actions.push({ person: capitalize(actionMatch[1] ?? ""), task: (actionMatch[3] ?? "").trim().replace(/\.$/, "") });
      continue;
    }

    // Decision detection
    if (lower.match(/decided|agreed|approved|confirmed|resolved|conclusion|the plan/)) {
      decisions.push(line.replace(/^[-*•]\s*/, "").replace(/^(we|the team|everyone|i)\s+(decided|agreed|confirmed)\s*/i, "").trim());
      continue;
    }

    // Time/date detection
    if (lower.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/) || lower.match(/\b\d{1,2}:\d{2}\s*(am|pm)?\b/i)) {
      nextMeeting = line.replace(/^[-*•]\s*/, "").trim();
      continue;
    }

    notes.push(line.replace(/^[-*•]\s*/, "").trim());
  }

  return { decisions, actions, budget, nextMeeting, notes };
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); }

const SAMPLE = `john said we need to finish the report by friday
sarah will handle the design
budget is 50k
next meeting tuesday 3pm
we decided to use react for the frontend
ahmed should review the api documentation
team agreed on the new naming convention`;

function MeetingNotesFormatter() {
  const [input, setInput] = useState("");
  const result = useMemo(() => input.trim() ? formatMeetingNotes(input) : null, [input]);

  const handleCopy = async () => {
    if (!result) return;
    let md = "";
    if (result.decisions.length) { md += "**Decisions Made:**\n"; result.decisions.forEach(d => { md += `→ ${d}\n`; }); md += "\n"; }
    if (result.actions.length) { md += "**Action Items:**\n"; result.actions.forEach(a => { md += `→ ${a.person} — ${a.task}\n`; }); md += "\n"; }
    if (result.budget) { md += `**Budget:** ₹${result.budget}\n\n`; }
    if (result.nextMeeting) { md += `**Next Meeting:** ${result.nextMeeting}\n\n`; }
    if (result.notes.length) { md += "**Notes:**\n"; result.notes.forEach(n => { md += `• ${n}\n`; }); }
    try { await navigator.clipboard.writeText(md); } catch {}
  };

  return (
    <AppShell title="Meeting Notes">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📋 Meeting Notes Formatter</h1>
        <p className="mt-1 text-sm text-muted-foreground">Paste messy meeting notes → get clean decisions, action items, and budget.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium text-foreground">Raw Meeting Notes</label>
            <button type="button" onClick={() => setInput(SAMPLE)} className="text-xs text-primary hover:underline">Load example</button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={12} placeholder="Paste your messy meeting notes here..."
            className="w-full rounded-xl border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none" />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          {result ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Formatted Output</h2>
                <button type="button" onClick={handleCopy} className="text-xs text-primary hover:underline">Copy as Markdown</button>
              </div>

              {result.decisions.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-1 text-xs font-semibold text-primary">✓ Decisions Made</h3>
                  {result.decisions.map((d, i) => (
                    <p key={i} className="ml-3 text-sm text-foreground">→ {d}</p>
                  ))}
                </div>
              )}

              {result.actions.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-1 text-xs font-semibold text-primary">⚡ Action Items</h3>
                  {result.actions.map((a, i) => (
                    <p key={i} className="ml-3 text-sm text-foreground">→ <span className="font-medium">{a.person}</span> — {a.task}</p>
                  ))}
                </div>
              )}

              {result.budget && (
                <div className="mb-4">
                  <h3 className="mb-1 text-xs font-semibold text-primary">💰 Budget</h3>
                  <p className="ml-3 text-sm text-foreground">{result.budget}</p>
                </div>
              )}

              {result.nextMeeting && (
                <div className="mb-4">
                  <h3 className="mb-1 text-xs font-semibold text-primary">📅 Next Meeting</h3>
                  <p className="ml-3 text-sm text-foreground">{result.nextMeeting}</p>
                </div>
              )}

              {result.notes.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-1 text-xs font-semibold text-primary">📝 Notes</h3>
                  {result.notes.map((n, i) => (
                    <p key={i} className="ml-3 text-sm text-foreground">• {n}</p>
                  ))}
                </div>
              )}

              {result.decisions.length === 0 && result.actions.length === 0 && !result.budget && !result.nextMeeting && result.notes.length === 0 && (
                <p className="text-sm text-muted-foreground">No patterns detected. Try adding more specific notes.</p>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg">📋</p>
              <p className="mt-2 text-sm text-muted-foreground">Paste notes on the left to format</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
