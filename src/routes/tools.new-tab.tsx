import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

const DEFAULT_BOOKMARKS = [
  { icon: "\u{1F310}", name: "SlashAI", url: "https://slashai-nu.vercel.app" },
  { icon: "\u{2709}\u{FE0F}", name: "Gmail", url: "https://mail.google.com" },
  { icon: "\u{1F3AC}", name: "YouTube", url: "https://youtube.com" },
  { icon: "\u{1F4AC}", name: "WhatsApp", url: "https://web.whatsapp.com" },
  { icon: "\u{1F50D}", name: "Google", url: "https://google.com" },
  { icon: "\u{1F419}", name: "GitHub", url: "https://github.com" },
];

function getGreeting(hour: number) {
  if (hour < 5) return "Working late \u{1F319}";
  if (hour < 12) return "Good morning \u{2600}\u{FE0F}";
  if (hour < 18) return "Good afternoon \u{26C5}";
  return "Good evening \u{1F319}";
}

export const Route = createFileRoute("/tools/new-tab")({
  head: () => ({ meta: [{ title: "New Tab Screen — SlashAI" }] }),
  component: NewTabScreen,
});

function NewTabScreen() {
  const [now, setNow] = useState(new Date());
  const [name, setName] = useState(() => localStorage.getItem("newtab-name") || "");
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("newtab-bookmarks") || "null") || DEFAULT_BOOKMARKS; } catch { return DEFAULT_BOOKMARKS; }
  });

  // Live widgets state
  const [weather, setWeather] = useState<{ temp: string; icon: string; city: string } | null>(null);
  const [prayer, setPrayer] = useState<{ name: string; time: string; remaining: string } | null>(null);
  const [nifty, setNifty] = useState<string>("");
  const [btc, setBtc] = useState<string>("");

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  // Fetch weather (Open-Meteo, Hyderabad default)
  useEffect(() => {
    const cached = localStorage.getItem("newtab-weather");
    if (cached) { try { setWeather(JSON.parse(cached)); } catch {} }
    fetch("https://api.open-meteo.com/v1/forecast?latitude=17.385&longitude=78.4867&current_weather=true")
      .then(r => r.json()).then(d => {
        const w = d.current_weather;
        const codes: Record<number, string> = { 0: "\u{2600}\u{FE0F}", 1: "\u{1F324}\u{FE0F}", 2: "\u{26C5}", 3: "\u{2601}\u{FE0F}", 45: "\u{1F32B}\u{FE0F}", 51: "\u{1F326}\u{FE0F}", 61: "\u{1F327}\u{FE0F}", 71: "\u{2744}\u{FE0F}", 80: "\u{1F326}\u{FE0F}" };
        const item = { temp: `${Math.round(w.temperature)}°C`, icon: codes[w.weathercode] || "\u{1F324}\u{FE0F}", city: "Hyderabad" };
        setWeather(item);
        localStorage.setItem("newtab-weather", JSON.stringify(item));
      }).catch(() => {});
  }, []);

  // Fetch prayer times (Aladhan)
  useEffect(() => {
    const cached = localStorage.getItem("newtab-prayer");
    if (cached) { try { setPrayer(JSON.parse(cached)); } catch {} }
    const now = new Date();
    const dateStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=17.385&longitude=78.4867&method=2`)
      .then(r => r.json()).then(d => {
        const t = d.data.timings;
        const prayers = [
          { name: "Fajr", time: t.Fajr },
          { name: "Dhuhr", time: t.Dhuhr },
          { name: "Asr", time: t.Asr },
          { name: "Maghrib", time: t.Maghrib },
          { name: "Isha", time: t.Isha },
        ];
        const nowMin = now.getHours() * 60 + now.getMinutes();
        for (const p of prayers) {
          const [h, m] = p.time.split(":").map(Number);
          if (h * 60 + m > nowMin) {
            const diff = h * 60 + m - nowMin;
            const hrs = Math.floor(diff / 60);
            const mins = diff % 60;
            setPrayer({ name: p.name, time: p.time, remaining: hrs > 0 ? `in ${hrs}h ${mins}m` : `in ${mins}m` });
            localStorage.setItem("newtab-prayer", JSON.stringify({ name: p.name, time: p.time, remaining: hrs > 0 ? `in ${hrs}h ${mins}m` : `in ${mins}m` }));
            break;
          }
        }
      }).catch(() => {});
  }, []);

  // Fetch NIFTY + BTC
  useEffect(() => {
    // NIFTY from Yahoo Finance
    fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d&range=1d")
      .then(r => r.json()).then(d => {
        const price = d.chart?.result?.[0]?.meta?.regularMarketPrice;
        if (price) setNifty(`\u{1F1EE}\u{1F1F3} NIFTY ${Math.round(price).toLocaleString("en-IN")}`);
      }).catch(() => setNifty("\u{1F1EE}\u{1F1F3} NIFTY —"));
    // BTC from CoinGecko
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
      .then(r => r.json()).then(d => {
        if (d.bitcoin?.usd) setBtc(`\u{26A1} BTC $${d.bitcoin.usd.toLocaleString()}`);
      }).catch(() => setBtc("\u{26A1} BTC —"));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    if (search.startsWith("/")) window.location.href = `https://slashai-nu.vercel.app/search?q=${encodeURIComponent(search)}`;
    else window.location.href = `https://www.google.com/search?q=${encodeURIComponent(search)}`;
  };

  const saveName = () => { localStorage.setItem("newtab-name", name); };
  const saveBookmarks = () => { localStorage.setItem("newtab-bookmarks", JSON.stringify(bookmarks)); setEditMode(false); };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4" style={{ background: "#0d1117" }}>
      {/* Greeting */}
      <p className="text-lg text-muted-foreground">
        {getGreeting(now.getHours())}{name ? `, ${name}` : ", builder"}
      </p>
      {!name && (
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} onBlur={saveName}
          onKeyDown={(e) => e.key === "Enter" && saveName()}
          placeholder="What's your name?"
          className="mt-1 bg-transparent text-center text-lg text-foreground border-b border-border focus:border-primary focus:outline-none" />
      )}

      {/* Time */}
      <p className="mt-6 text-7xl sm:text-9xl font-bold font-mono text-foreground tracking-tight">
        {now.toLocaleTimeString("en-US", { hour12: false })}
      </p>
      <p className="mt-2 text-lg text-muted-foreground">
        {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      </p>

      {/* Search */}
      <form onSubmit={handleSearch} className="mt-8 w-full max-w-md">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search the web or /command…"
          className="w-full rounded-xl border border-border bg-surface px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
      </form>

      {/* Bottom widgets: Weather | Prayer | Markets */}
      <div className="mt-8 grid w-full max-w-lg grid-cols-3 gap-2">
        <div className="rounded-lg border border-border bg-surface p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Weather</p>
          {weather ? (
            <>
              <p className="mt-1 text-lg">{weather.icon}</p>
              <p className="text-xs font-medium text-foreground">{weather.temp}</p>
              <p className="text-[10px] text-muted-foreground">{weather.city}</p>
            </>
          ) : <p className="mt-2 text-xs text-muted-foreground">Loading…</p>}
        </div>
        <div className="rounded-lg border border-border bg-surface p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Prayer</p>
          {prayer ? (
            <>
              <p className="mt-1 text-sm font-semibold text-foreground">{prayer.name}</p>
              <p className="text-[11px]" style={{ color: "#d29922" }}>{prayer.remaining}</p>
              <p className="text-[10px] text-muted-foreground">{prayer.time}</p>
            </>
          ) : <p className="mt-2 text-xs text-muted-foreground">Loading…</p>}
        </div>
        <div className="rounded-lg border border-border bg-surface p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Markets</p>
          <p className="mt-1 text-xs font-medium text-foreground">{nifty || "—"}</p>
          <p className="mt-1 text-xs font-medium" style={{ color: "#d29922" }}>{btc || "—"}</p>
        </div>
      </div>

      {/* Bookmarks */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {bookmarks.map((b: any, i: number) => (
          <a key={i} href={b.url} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface p-3 w-16 transition-all hover:border-primary/40 hover:-translate-y-0.5">
            <span className="text-xl">{b.icon}</span>
            <span className="text-[10px] text-muted-foreground truncate w-full text-center">{b.name}</span>
          </a>
        ))}
        <button type="button" onClick={() => setEditMode(!editMode)}
          className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-border p-3 w-16 text-muted-foreground hover:text-foreground">
          <span className="text-xl">+</span>
          <span className="text-[10px]">Edit</span>
        </button>
      </div>

      {editMode && (
        <div className="mt-4 rounded-xl border border-border bg-surface p-4 max-w-sm w-full">
          <p className="text-xs text-muted-foreground mb-2">Edit bookmarks (icon | name | url, one per line)</p>
          <textarea
            defaultValue={bookmarks.map((b: any) => `${b.icon} | ${b.name} | ${b.url}`).join("\n")}
            onBlur={(e) => {
              const lines = e.target.value.split("\n").filter(Boolean);
              const newBookmarks = lines.map((l) => {
                const parts = l.split("|").map((s) => s.trim());
                return { icon: parts[0] || "\u{1F516}", name: parts[1] || "Link", url: parts[2] || "#" };
              });
              setBookmarks(newBookmarks);
            }}
            className="w-full rounded-lg border border-border bg-surface-elevated p-2 font-mono text-xs text-foreground h-32 focus:border-primary focus:outline-none" />
          <button type="button" onClick={saveBookmarks}
            className="mt-2 min-h-[36px] w-full rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground">Save</button>
        </div>
      )}

      {/* Tip */}
      <p className="mt-8 text-[11px] text-muted-foreground/50">
        Set this page as your browser homepage for a beautiful new tab
      </p>
    </div>
  );
}
