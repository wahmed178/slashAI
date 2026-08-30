import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/tools/quote-screen")({
  head: () => ({ meta: [{ title: "Quote of the Day — SlashAI" }] }),
  component: QuoteScreen,
});

function QuoteScreen() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://zenquotes.io/api/random");
      const data = await res.json();
      if (data?.[0]) setQuote({ text: data[0].q, author: data[0].a });
    } catch {
      try {
        const res = await fetch("https://api.adviceslip.com/advice");
        const data = await res.json();
        setQuote({ text: data.slip?.advice || "The best time to start was yesterday.", author: "Unknown" });
      } catch { setQuote({ text: "The best time to start was yesterday.", author: "Unknown" }); }
    }
    setLoading(false);
  };

  useEffect(() => { fetchQuote(); }, []);

  const copy = () => {
    if (!quote) return;
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "linear-gradient(135deg, #0d1117, #0a1628, #1a0d28, #0d1117)", backgroundSize: "400% 400%", animation: "gradientShift 60s ease infinite" }}>

      {/* Back button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="fixed top-4 left-4 z-50 h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-150 active:scale-95"
        style={{
          borderColor: "rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      <style>{`@keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }`}</style>

      {loading ? (
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="size-3 rounded-full bg-primary" style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
          <style>{`@keyframes pulse { 0%,80%,100%{opacity:0.3;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
        </div>
      ) : quote ? (
        <div className="max-w-xl">
          <p className="text-2xl sm:text-3xl italic text-foreground leading-relaxed" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            "{quote.text}"
          </p>
          <p className="mt-4 text-base text-muted-foreground">— {quote.author}</p>
        </div>
      ) : null}

      <div className="mt-8 flex gap-3">
        <button type="button" onClick={fetchQuote}
          className="flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface/80 backdrop-blur px-5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="size-4" /> Next quote
        </button>
        <button type="button" onClick={copy}
          className="flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface/80 backdrop-blur px-5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="size-4 text-green" /> : <Copy className="size-4" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
