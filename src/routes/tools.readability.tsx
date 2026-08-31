import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/readability")({
  head: () => ({ meta: [{ title: "Text Readability Analyser — SlashAI" }] }),
  component: ReadabilityAnalyser,
});

const SAMPLE = `The quick brown fox jumps over the lazy dog. This is a simple sentence. However, the utilization of polysyllabic terminology significantly diminishes comprehension thresholds among general audiences. It is imperative that content creators prioritize accessibility in their written communications.`;

function syllableCount(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function ReadabilityAnalyser() {
  const [text, setText] = useState(SAMPLE);

  const stats = useMemo(() => {
    if (!text.trim()) return null;
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const syllables = words.reduce((sum, w) => sum + syllableCount(w), 0);
    const complexWords = words.filter((w) => syllableCount(w) >= 3).length;

    // Flesch Reading Ease
    const asl = words.length / Math.max(sentences.length, 1);
    const asw = syllables / Math.max(words.length, 1);
    const flesch = Math.max(0, Math.min(100, 206.835 - 1.015 * asl - 84.6 * asw));

    // Flesch-Kincaid Grade
    const fkGrade = Math.max(0, 0.39 * asl + 11.8 * asw - 15.59);

    // Passive voice (simple heuristic: "was/is/are/been/being" + past participle)
    const passiveMatches = text.match(/\b(was|is|are|were|be|been|being)\s+\w+ed\b/gi) || [];

    // Long sentences (over 25 words)
    const longSentences = sentences.filter((s) => s.split(/\s+/).length > 25);

    // Avg word length
    const avgWordLen = words.reduce((sum, w) => sum + w.replace(/[^a-z]/gi, "").length, 0) / Math.max(words.length, 1);

    return {
      words: words.length,
      sentences: sentences.length,
      syllables,
      complexWords,
      flesch: Math.round(flesch),
      fkGrade: fkGrade.toFixed(1),
      avgSentenceLength: Math.round(asl),
      avgWordLen: avgWordLen.toFixed(1),
      passiveCount: passiveMatches.length,
      longSentences: longSentences.map((s) => s.trim().slice(0, 80)),
      readingTime: Math.max(1, Math.ceil(words.length / 200)),
    };
  }, [text]);

  const fleschColor = (score: number) => {
    if (score >= 80) return "text-green";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-yellow";
    return "text-red";
  };

  const fleschLabel = (score: number) => {
    if (score >= 80) return "Easy to read";
    if (score >= 60) return "Standard";
    if (score >= 40) return "Difficult";
    return "Very difficult";
  };

  return (
    <AppShell title="Text Readability Analyser">
      <div className="mx-auto max-w-3xl space-y-5 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Readability Analyser</h1>
          <p className="mt-1 text-sm text-muted-foreground">Analyse any text for readability, grade level, and writing quality.</p>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-40 w-full resize-none rounded-[10px] border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          placeholder="Paste or type text to analyse..."
        />

        {stats && (
          <div className="space-y-4">
            {/* Flesch score */}
            <div className="rounded-[10px] border border-border bg-surface p-5 text-center">
              <p className={`text-5xl font-bold ${fleschColor(stats.flesch)}`}>{stats.flesch}</p>
              <p className="mt-1 text-sm text-muted-foreground">Flesch Reading Ease</p>
              <p className={`text-xs font-medium ${fleschColor(stats.flesch)}`}>{fleschLabel(stats.flesch)}</p>
              <div className="mx-auto mt-3 h-2 w-48 overflow-hidden rounded-full bg-surface-elevated">
                <div className={`h-full rounded-full transition-all ${fleschColor(stats.flesch).replace("text-", "bg-")}`} style={{ width: `${stats.flesch}%` }} />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {[
                { label: "Grade Level", value: stats.fkGrade },
                { label: "Words", value: String(stats.words) },
                { label: "Sentences", value: String(stats.sentences) },
                { label: "Avg Words/Sentence", value: String(stats.avgSentenceLength) },
                { label: "Reading Time", value: `${stats.readingTime} min` },
                { label: "Avg Word Length", value: `${stats.avgWordLen} chars` },
                { label: "Complex Words", value: String(stats.complexWords) },
                { label: "Passive Voice", value: String(stats.passiveCount) },
                { label: "Long Sentences", value: String(stats.longSentences.length) },
                { label: "Syllables", value: String(stats.syllables) },
              ].map((s) => (
                <div key={s.label} className="rounded-[10px] border border-border bg-surface p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Long sentences */}
            {stats.longSentences.length > 0 && (
              <div className="rounded-[10px] border border-yellow/30 bg-yellow/5 p-4">
                <p className="mb-2 text-xs font-semibold text-yellow">Long sentences (over 25 words):</p>
                {stats.longSentences.map((s, i) => (
                  <p key={i} className="mt-1 text-xs text-muted-foreground">• {s}...</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
