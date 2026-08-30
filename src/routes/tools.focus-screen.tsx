import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/focus-screen")({
  head: () => ({ meta: [{ title: "Focus Screen — SlashAI" }] }),
  component: FocusScreen,
});

function FocusScreen() {
  const [now, setNow] = useState(new Date());
  const [showControls, setShowControls] = useState(false);
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [prayer, setPrayer] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("https://zenquotes.io/api/today").then(r => r.json()).then(([q]: any[]) => {
      if (q) setQuote({ text: q.q, author: q.a });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch("https://api.aladhan.com/v1/timingsByCity?city=Hyderabad&country=India").then(r => r.json()).then((data: any) => {
      const t = data.data?.timings;
      if (!t) return;
      const nowH = now.getHours();
      const prayers = [
        { name: "Fajr", time: t.Fajr },
        { name: "Sunrise", time: t.Sunrise },
        { name: "Dhuhr", time: t.Dhuhr },
        { name: "Asr", time: t.Asr },
        { name: "Maghrib", time: t.Maghrib },
        { name: "Isha", time: t.Isha },
      ];
      for (const p of prayers) {
        const [h, m] = p.time.split(":").map(Number);          if (h !== undefined && m !== undefined && (h > nowH || (h === nowH && m > now.getMinutes()))) {
          setPrayer(`${p.name} at ${p.time}`);
          return;
        }
      }
      if (prayers[0]) setPrayer("Fajr at " + prayers[0].time);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => setShowControls(true);
    const hide = setTimeout(() => setShowControls(false), 3000);
    window.addEventListener("mousemove", handler);
    return () => { window.removeEventListener("mousemove", handler); clearTimeout(hide); };
  }, [showControls]);

  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--background), rgba(10,22,40,1), rgba(26,13,40,1), var(--background))", backgroundSize: "400% 400%", animation: "gradientShift 60s ease infinite" }}>
      <style>{`@keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }`}</style>

      <p className="text-6xl sm:text-8xl font-bold font-mono text-foreground tracking-tight">{timeStr}</p>
      <p className="mt-2 text-lg text-muted-foreground">{dateStr}</p>
      {prayer && <p className="mt-3 text-sm" style={{ color: "#d29922" }}>{prayer}</p>}
      {quote && (
        <div className="mt-6 max-w-md text-center px-8">
          <p className="text-base italic text-muted-foreground">"{quote.text}"</p>
          <p className="mt-2 text-sm text-muted-foreground/60">— {quote.author}</p>
        </div>
      )}

      <div className={`fixed bottom-4 right-4 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}>
        <button type="button" onClick={() => window.history.back()}
          className="rounded-lg border border-border bg-surface/80 backdrop-blur px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
          Close
        </button>
      </div>
    </div>
  );
}
