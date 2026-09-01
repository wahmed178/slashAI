import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/thread-maker")({
  component: ThreadMaker,
});

function ThreadMaker() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState<"twitter" | "linkedin">("twitter");
  const MAX_CHARS = 280;

  const splitIntoTweets = useMemo(() => {
    if (!text.trim()) return [];
    if (format === "linkedin") {
      return text.split(/\n\n+/).filter((p) => p.trim()).map((p, i) => `${i + 1}. ${p.trim()}`);
    }
    const sentences = text.replace(/\n/g, " ").split(/(?<=[.!?])\s+/).filter(Boolean);
    const tweets: string[] = [];
    let current = "";
    sentences.forEach((s) => {
      if ((current + " " + s).trim().length > MAX_CHARS - 4) {
        if (current.trim()) tweets.push(current.trim());
        current = s;
      } else {
        current = (current + " " + s).trim();
      }
    });
    if (current.trim()) tweets.push(current.trim());
    return tweets.map((t, i) => `${i + 1}/${tweets.length} ${t}`);
  }, [text, format]);

  const copyAll = async () => {
    const all = splitIntoTweets.join("\n\n");
    try { await navigator.clipboard.writeText(all); } catch {}
  };

  const copySingle = async (tweet: string) => {
    try { await navigator.clipboard.writeText(tweet); } catch {}
  };

  return (
    <AppShell title="Thread Maker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🧵 Social Media Thread Formatter</h1>
        <p className="mt-1 text-sm text-muted-foreground">Auto-split text into Twitter/X threads (280 chars) or LinkedIn posts.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setFormat("twitter")} className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${format === "twitter" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>🐦 Twitter/X</button>
          <button onClick={() => setFormat("linkedin")} className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${format === "linkedin" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>💼 LinkedIn</button>
        </div>

        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your long-form text here..." className="h-40 w-full rounded-xl border border-border bg-surface p-4 text-sm focus:outline-none focus:border-primary/50 resize-none" />

        {splitIntoTweets.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{splitIntoTweets.length} {format === "twitter" ? "tweets" : "paragraphs"}</p>
              <button onClick={copyAll} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-background hover:opacity-90">Copy All</button>
            </div>

            <div className="space-y-2">
              {splitIntoTweets.map((tweet, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-3">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{tweet}</p>
                  <div className="mt-2 flex items-center justify-between">
                    {format === "twitter" && <span className="text-[10px] text-muted-foreground">{tweet.length}/{MAX_CHARS}</span>}
                    <button onClick={() => copySingle(tweet)} className="text-[11px] text-primary hover:underline">Copy</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
