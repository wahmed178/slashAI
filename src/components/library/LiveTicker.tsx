import { useEffect, useState } from "react";

interface TickerItem {
  label: string;
  value: string;
  change?: string;
  color?: string;
}

function getCache<T>(key: string, ttlMs: number): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: T; ts: number };
    if (Date.now() - ts > ttlMs) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* quota */ }
}

async function fetchStocks(): Promise<TickerItem[]> {
  const cached = getCache<TickerItem[]>("ticker-stocks", 60_000);
  if (cached) return cached;
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d&range=2d",
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      chart?: { result?: { meta: { regularMarketPrice: number; previousClose: number } }[] };
    };
    const meta = json.chart?.result?.[0]?.meta;
    if (!meta) return [];
    const price = meta.regularMarketPrice;
    const prev = meta.previousClose;
    const pct = prev ? ((price - prev) / prev) * 100 : 0;
    const items: TickerItem[] = [
      {
        label: "NIFTY 50",
        value: price.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        change: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
        color: pct >= 0 ? "#3fb950" : "#f85149",
      },
    ];
    setCache("ticker-stocks", items);
    return items;
  } catch {
    return [];
  }
}

async function fetchSensex(): Promise<TickerItem[]> {
  const cached = getCache<TickerItem[]>("ticker-sensex", 60_000);
  if (cached) return cached;
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5ESENSEX?interval=1d&range=2d",
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      chart?: { result?: { meta: { regularMarketPrice: number; previousClose: number } }[] };
    };
    const meta = json.chart?.result?.[0]?.meta;
    if (!meta) return [];
    const price = meta.regularMarketPrice;
    const prev = meta.previousClose;
    const pct = prev ? ((price - prev) / prev) * 100 : 0;
    const items: TickerItem[] = [
      {
        label: "SENSEX",
        value: price.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        change: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
        color: pct >= 0 ? "#3fb950" : "#f85149",
      },
    ];
    setCache("ticker-sensex", items);
    return items;
  } catch {
    return [];
  }
}

async function fetchCrypto(): Promise<TickerItem[]> {
  const cached = getCache<TickerItem[]>("ticker-crypto", 60_000);
  if (cached) return cached;
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr&include_24hr_change=true",
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      bitcoin?: { inr: number; inr_24h_change?: number };
      ethereum?: { inr: number; inr_24h_change?: number };
    };
    const items: TickerItem[] = [];
    if (json.bitcoin) {
      const pct = json.bitcoin.inr_24h_change ?? 0;
      items.push({
        label: "BTC",
        value: `₹${Math.round(json.bitcoin.inr).toLocaleString("en-IN")}`,
        change: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
        color: pct >= 0 ? "#3fb950" : "#f85149",
      });
    }
    if (json.ethereum) {
      const pct = json.ethereum.inr_24h_change ?? 0;
      items.push({
        label: "ETH",
        value: `₹${Math.round(json.ethereum.inr).toLocaleString("en-IN")}`,
        change: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
        color: pct >= 0 ? "#3fb950" : "#f85149",
      });
    }
    setCache("ticker-crypto", items);
    return items;
  } catch {
    return [];
  }
}

async function fetchForex(): Promise<TickerItem[]> {
  const cached = getCache<TickerItem[]>("ticker-forex", 300_000);
  if (cached) return cached;
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!res.ok) return [];
    const json = (await res.json()) as { rates?: { INR?: number } };
    const rate = json.rates?.INR;
    if (!rate) return [];
    const items: TickerItem[] = [
      { label: "USD/INR", value: rate.toFixed(2) },
    ];
    setCache("ticker-forex", items);
    return items;
  } catch {
    return [];
  }
}

async function fetchPrayer(): Promise<TickerItem[]> {
  const cached = getCache<TickerItem[]>("ticker-prayer", 3_600_000);
  if (cached) return cached;
  try {
    const city = localStorage.getItem("slashai-prayer-city") || "Hyderabad";
    const country = localStorage.getItem("slashai-prayer-country") || "India";
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`,
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: { timings?: Record<string, string>; hijri?: string };
    };
    const timings = json.data?.timings;
    if (!timings) return [];
    const now = new Date();
    const names = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    for (const name of names) {
      const time = timings[name];
      if (!time) continue;
      const parts = time.split(":").map(Number);
      const h = parts[0];
      const m = parts[1];
      if (h === undefined || m === undefined) continue;
      const at = new Date(now);
      at.setHours(h, m, 0, 0);
      if (at > now) {
        const diff = at.getTime() - now.getTime();
        const hrs = Math.floor(diff / 3_600_000);
        const mins = Math.floor((diff % 3_600_000) / 60_000);
        const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
        const items: TickerItem[] = [
          {
            label: "Next Prayer",
            value: `${name} in ${timeStr}`,
            color: "#d29922",
          },
        ];
        setCache("ticker-prayer", items);
        return items;
      }
    }
    return [];
  } catch {
    return [];
  }
}

async function fetchWeather(): Promise<TickerItem[]> {
  const cached = getCache<TickerItem[]>("ticker-weather", 1_800_000);
  if (cached) return cached;
  try {
    const city = localStorage.getItem("slashai-weather-city") || "Hyderabad";
    // Use Open-Meteo geocoding + weather
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
    );
    if (!geoRes.ok) return [];
    const geo = (await geoRes.json()) as {
      results?: { latitude?: number; longitude?: number; name?: string }[];
    };
    const loc = geo.results?.[0];
    if (!loc?.latitude || !loc?.longitude) return [];
    const wRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,weather_code`,
    );
    if (!wRes.ok) return [];
    const wJson = (await wRes.json()) as {
      current?: { temperature_2m?: number; weather_code?: number };
    };
    const temp = wJson.current?.temperature_2m;
    if (temp === undefined) return [];
    const WEATHER_EMOJI: Record<number, string> = {
      0: "☀️", 1: "🌤", 2: "⛅", 3: "☁️",
      45: "🌫", 48: "🌫", 51: "🌦", 53: "🌧", 55: "🌧",
      61: "🌧", 63: "🌧", 65: "🌧", 71: "❄", 73: "❄", 75: "❄",
      80: "🌦", 81: "🌧", 82: "⛈", 95: "⛈", 96: "⛈", 99: "⛈",
    };
    const code = wJson.current?.weather_code ?? 0;
    const emoji = WEATHER_EMOJI[code] ?? "🌤";
    const items: TickerItem[] = [
      {
        label: "Weather",
        value: `${emoji} ${city} ${Math.round(temp)}°C`,
      },
    ];
    setCache("ticker-weather", items);
    return items;
  } catch {
    return [];
  }
}

export function LiveTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const results = await Promise.allSettled([
        fetchStocks(),
        fetchSensex(),
        fetchCrypto(),
        fetchForex(),
        fetchPrayer(),
        fetchWeather(),
      ]);

      if (cancelled) return;

      const all: TickerItem[] = [];
      for (const r of results) {
        if (r.status === "fulfilled" && r.value.length > 0) {
          all.push(...r.value);
        }
      }

      setItems(all);
      setLoading(false);
    }

    load();
    const interval = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="skeleton-block h-9 w-full" />
    );
  }

  if (items.length === 0) return null;

  // Duplicate items for seamless loop
  const allItems = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-b border-[#30363d] bg-[#161b22]"
      style={{ height: 36 }}
      onMouseEnter={(e) => {
        const track = e.currentTarget.querySelector("[data-ticker-track]");
        if (track) (track as HTMLElement).style.animationPlayState = "paused";
      }}
      onMouseLeave={(e) => {
        const track = e.currentTarget.querySelector("[data-ticker-track]");
        if (track) (track as HTMLElement).style.animationPlayState = "running";
      }}
    >
      <div
        data-ticker-track
        className="flex h-full items-center whitespace-nowrap"
        style={{
          animation: `ticker ${Math.max(allItems.length * 6, 40)}s linear infinite`,
        }}
      >
        {/* LIVE dot */}
        <span className="mr-3 inline-flex items-center gap-1 px-3 text-[11px] font-semibold text-[#f85149]">
          <span className="inline-block size-1.5 animate-pulse rounded-full bg-[#f85149]" />
          LIVE
        </span>

        {allItems.map((item, i) => (
          <span key={`${item.label}-${i}`} className="inline-flex items-center gap-2 px-3">
            <span className="text-[11px] text-[#8b949e]">{item.label}</span>
            <span className="text-[12px] font-semibold text-[#e6edf3]">{item.value}</span>
            {item.change && (
              <span className="text-[11px] font-medium" style={{ color: item.color ?? "#8b949e" }}>
                {item.change}
              </span>
            )}
            {i < allItems.length - 1 && (
              <span className="mx-2 text-[#30363d]">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
