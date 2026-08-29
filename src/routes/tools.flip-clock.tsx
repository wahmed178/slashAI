import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/flip-clock")({
  head: () => ({ meta: [{ title: "Flip Clock — SlashAI" }] }),
  component: FlipClock,
});

function FlipCard({ digit, prev }: { digit: string; prev: string }) {
  const [flipping, setFlipping] = useState(false);
  useEffect(() => {
    if (digit !== prev) { setFlipping(true); const t = setTimeout(() => setFlipping(false), 300); return () => clearTimeout(t); }
    return undefined;
  }, [digit, prev]);

  return (
    <div className="relative size-[72px] sm:size-[96px] perspective-[400px]">
      <div className={`size-full rounded-lg bg-surface border border-border flex items-center justify-center text-3xl sm:text-5xl font-bold font-mono text-foreground transition-transform duration-300 ${flipping ? "rotate-x-[-90deg]" : ""}`}
        style={{ transformStyle: "preserve-3d" }}>
        {digit}
      </div>
    </div>
  );
}

function FlipClock() {
  const [now, setNow] = useState(new Date());
  const [prev, setPrev] = useState("000000");
  const [h24, setH24] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setPrev(now.toTimeString().slice(0, 6).replace(/:/g, ""));
      setNow(d);
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  const timeStr = h24
    ? now.toLocaleTimeString("en-GB", { hour12: false })
    : now.toLocaleTimeString("en-US", { hour12: true });
  const chars = timeStr.replace(/:/g, "").padStart(6, "0");
  const prevChars = prev.padStart(6, "0");
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const hasColon = timeStr.includes(":");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4" style={{ background: "#0d1117" }}>
      <div className="flex items-center gap-2">
        {[0, 1].map((i) => (
          <FlipCard key={`h${i}`} digit={chars[i] ?? "0"} prev={prevChars[i] ?? "0"} />
        ))}
        {hasColon && <span className="text-3xl font-bold text-muted-foreground mx-1 animate-pulse">:</span>}
        {[2, 3].map((i) => (
          <FlipCard key={`m${i}`} digit={chars[i] ?? "0"} prev={prevChars[i] ?? "0"} />
        ))}
        {hasColon && <span className="text-3xl font-bold text-muted-foreground mx-1 animate-pulse">:</span>}
        {[4, 5].map((i) => (
          <FlipCard key={`s${i}`} digit={chars[i] ?? "0"} prev={prevChars[i] ?? "0"} />
        ))}
      </div>
      <p className="mt-4 text-base text-muted-foreground">{dateStr}</p>
      <div className="fixed bottom-4 right-4 flex gap-2">
        <button type="button" onClick={() => setH24(!h24)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {h24 ? "24H" : "12H"}
        </button>
      </div>
    </div>
  );
}
