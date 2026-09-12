import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/word-frequency")({ component: WordFrequency });

const STOP_WORDS = new Set(
  "a,an,the,and,or,but,if,in,on,at,to,for,of,with,by,from,up,about,into,over,after,is,are,was,were,be,been,being,have,has,had,do,does,did,will,would,can,could,should,may,might,must,shall,this,that,these,those,i,you,he,she,it,we,they,me,him,her,us,them,my,your,his,its,our,their,as,so,than,too,very,just,not,no,nor,only,own,same,such,then,there,here,when,where,why,how,all,any,both,each,few,more,most,other,some,what,which,who,whom".split(","),
);

function WordFrequency() {
  const [text, setText] = useState("");
  const [ignoreStop, setIgnoreStop] = useState(true);

  const { top, totalWords, unique } = useMemo(() => {
    const words = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1 && (!ignoreStop || !STOP_WORDS.has(w)));
    const counts = new Map<string, number>();
    for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return { top: sorted.slice(0, 30), totalWords: words.length, unique: counts.size };
  }, [text, ignoreStop]);

  const max = top[0]?.[1] ?? 1;

  return (
    <AppShell title="Word Frequency Analyser">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔠 Word Frequency Analyser</h1>
        <p className="mt-1 text-sm text-muted-foreground">Top words, density and repetition in any text - great for SEO and essays.</p>
      </header>
      <div className="mx-auto max-w-2xl space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste an article, essay or caption..."
          rows={6}
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
        />
        <label className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <input type="checkbox" checked={ignoreStop} onChange={(e) => setIgnoreStop(e.target.checked)} className="accent-primary" />
          Ignore common words (the, and, is…)
        </label>
        {text.trim() && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Words", value: totalWords },
                { label: "Unique", value: unique },
                { label: "Density", value: totalWords ? Math.round((unique / totalWords) * 100) + "%" : "0%" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-surface p-3 text-center">
                  <p className="text-lg font-bold text-primary">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 rounded-xl border border-border bg-surface p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Top words</p>
              {top.length === 0 && <p className="text-sm text-muted-foreground">No words to show.</p>}
              {top.map(([word, n], i) => (
                <div key={word} className="flex items-center gap-2">
                  <span className="w-6 text-right font-mono text-[11px] text-muted-foreground">{i + 1}</span>
                  <span className="w-24 truncate text-[13px] font-semibold text-foreground">{word}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-elevated">
                    <div className="h-full rounded-full bg-primary transition-all duration-150" style={{ width: `${(n / max) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right font-mono text-[11px] text-muted-foreground">{n}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
