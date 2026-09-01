import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/spelling")({
  component: SpellingChecker,
});

const COMMON_CONFUSIONS: Record<string, string> = {
  "your": "you're", "youre": "you're", "their": "there/they're", "there": "their/they're",
  "its": "it's", "its'": "its", "then": "than (comparison)", "than": "then (sequence)",
  "affect": "effect (noun)", "effect": "affect (verb)", "loose": "lose", "lose": "loose",
  "accept": "except", "except": "accept", "advice": "advise", "advise": "advice",
  "practice": "practise (verb)", "practise": "practice (noun)",
  "definitely": "definately/difenitely", "separate": "seperate", "occurrence": "occurence",
  "necessary": "neccessary", "accommodate": "accomodate",
  "millennium": "millenium", "embarass": "embarrass",
};

function SpellingChecker() {
  const [text, setText] = useState("");
  const [corrections, setCorrections] = useState<{ word: string; suggestion: string; index: number }[]>([]);

  const check = () => {
    const found: { word: string; suggestion: string; index: number }[] = [];

    // Check repeated words
    const repeatedMatch = text.match(/\b(\w+)\s+\1\b/gi);
    if (repeatedMatch) {
      repeatedMatch.forEach((m) => {
        const word = m.split(/\s+/)[0];
        const idx = text.toLowerCase().indexOf(m.toLowerCase());
        found.push({ word: m.trim(), suggestion: `Remove duplicate "${word}"`, index: idx });
      });
    }

    // Check common confusions
    const words = text.split(/\s+/);
    words.forEach((word, i) => {
      const clean = word.toLowerCase().replace(/[^a-z]/g, "");
      if (COMMON_CONFUSIONS[clean]) {
        const idx = text.indexOf(word);
        found.push({ word, suggestion: COMMON_CONFUSIONS[clean], index: idx });
      }
    });

    // Double spaces
    if (text.includes("  ")) {
      found.push({ word: "(double space)", suggestion: "Use single space", index: text.indexOf("  ") });
    }

    // Capitalization after period
    const capMatch = text.match(/\.\s+[a-z]/g);
    if (capMatch) {
      capMatch.forEach((m) => {
        const idx = text.indexOf(m);
        found.push({ word: m, suggestion: `Capitalize after period: "${m[0]}${m[2]?.toUpperCase() ?? ''}${m.slice(3)}"`, index: idx });
      });
    }

    setCorrections(found);
  };

  const stats = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
    return { words: words.length, sentences, characters: text.length };
  }, [text]);

  return (
    <AppShell title="Spelling Checker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">✍️ Spelling & Grammar Checker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Offline spell check — repeated words, common mistakes, capitalization. No API needed.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text to check..."
          className="h-40 w-full rounded-xl border border-border bg-surface p-4 text-sm focus:outline-none focus:border-primary/50 resize-none"
        />

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-surface p-2"><p className="text-lg font-bold text-foreground">{stats.words}</p><p className="text-[10px] text-muted-foreground">Words</p></div>
          <div className="rounded-lg bg-surface p-2"><p className="text-lg font-bold text-foreground">{stats.sentences}</p><p className="text-[10px] text-muted-foreground">Sentences</p></div>
          <div className="rounded-lg bg-surface p-2"><p className="text-lg font-bold text-foreground">{stats.characters}</p><p className="text-[10px] text-muted-foreground">Characters</p></div>
        </div>

        <button onClick={check} disabled={!text.trim()}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">
          Check Text
        </button>

        {corrections.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{corrections.length} issue{corrections.length !== 1 ? "s" : ""} found</p>
            <div className="space-y-1.5">
              {corrections.map((c, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-surface-elevated px-3 py-2">
                  <span className="text-xs text-red-400 font-mono">{c.word}</span>
                  <span className="text-xs text-muted-foreground">→</span>
                  <span className="text-xs text-green font-medium">{c.suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {text && corrections.length === 0 && (
          <div className="rounded-xl border border-green/20 bg-green/5 p-4 text-center">
            <p className="text-sm text-green">✓ No issues found</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
