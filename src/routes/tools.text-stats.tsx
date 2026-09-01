import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/text-stats")({ component: TextStatistics });

function TextStatistics() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const readingTime = Math.ceil(words.length / 200);
    const speakingTime = Math.ceil(words.length / 130);
    const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ""))).size;

    return { words: words.length, sentences, paragraphs, chars, charsNoSpaces, readingTime, speakingTime, uniqueWords };
  }, [text]);

  return (
    <AppShell title="Text Statistics">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📊 Text Statistics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Word count, reading time, character count, and more.</p>
      </header>
      <div className="mx-auto max-w-2xl space-y-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type text to analyze..."
          className="h-40 w-full rounded-xl border border-border bg-surface p-4 text-sm focus:outline-none focus:border-primary/50 resize-none" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["Words", stats.words], ["Characters", stats.chars], ["Characters (no spaces)", stats.charsNoSpaces],
            ["Sentences", stats.sentences], ["Paragraphs", stats.paragraphs], ["Unique Words", stats.uniqueWords],
            ["Reading Time", `${stats.readingTime} min`], ["Speaking Time", `${stats.speakingTime} min`],
          ].map(([label, val]) => (
            <div key={label as string} className="rounded-xl border border-border bg-surface p-3 text-center">
              <p className="text-lg font-bold text-foreground">{val}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
