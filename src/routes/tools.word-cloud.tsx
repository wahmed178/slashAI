import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Download } from "lucide-react";

export const Route = createFileRoute("/tools/word-cloud")({ component: WordCloud });

const STOP_WORDS = new Set("the a an and or but if then of to in on at for with by from as is are was were be been it its this that these those you your we our they their he she his her i me my not no so do does did can will just about into over under more most some such only than very".split(" "));

function WordCloud() {
  const [text, setText] = useState("");

  const words = useMemo(() => {
    const counts = new Map<string, number>();
    for (const w of text.toLowerCase().match(/[a-z][a-z'-]{1,}/g) ?? []) {
      if (STOP_WORDS.has(w)) continue;
      counts.set(w, (counts.get(w) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 60);
  }, [text]);

  const max = words[0]?.[1] ?? 1;
  const palette = ["#2dd4bf", "#60a5fa", "#a78bfa", "#f472b6", "#fbbf24", "#34d399", "#f87171"];

  const download = () => {
    const svg = document.getElementById("word-cloud-svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "word-cloud.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell title="Word Cloud Maker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">☁️ Word Cloud Maker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Turn any text into a word cloud. Rendered locally, download as SVG.</p>
      </header>
      <div className="mx-auto max-w-3xl space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste an article, essay, notes... the cloud builds as you type."
          rows={6}
          className="w-full rounded-xl border border-border bg-surface p-3 text-sm"
        />
        {words.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <svg id="word-cloud-svg" viewBox="0 0 600 340" className="w-full">
              {words.map(([word, count], i) => {
                const font = 14 + (count / max) * 34;
                const angle = [0, 0, 0, 90][i % 4];
                const cols = 7;
                const x = 60 + ((i * 97) % 480);
                const y = 40 + (((i * 53) % 13) / 13) * 260 + (angle === 90 ? font : 0);
                return (
                  <text
                    key={word}
                    x={x}
                    y={y}
                    fontSize={font}
                    fontWeight={count === max ? 800 : 500}
                    fill={palette[i % palette.length]}
                    transform={angle === 90 ? `rotate(90 ${x} ${y})` : undefined}
                    style={{ fontFamily: "Space Grotesk, sans-serif", opacity: 0.55 + 0.45 * (count / max) }}
                  >
                    {word}
                  </text>
                );
              })}
            </svg>
            <div className="mt-2 flex justify-end">
              <button type="button" onClick={download} className="flex min-h-[34px] items-center gap-1.5 rounded-md bg-primary px-3 text-[12.5px] font-semibold text-background hover:bg-primary/90">
                <Download className="size-4" /> SVG
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
