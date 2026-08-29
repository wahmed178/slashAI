import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CloudSun,
  Coins,
  Compass,
  Droplets,
  Landmark,
  Moon,
  Newspaper,
  RefreshCw,
  Rocket,
  Satellite,
  Search,
  Trophy,
  Wind,
  Radio,
} from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import {
  getAirQuality,
  getCrypto,
  getForex,
  getCommodities,
  getIndiaNews,
  getMatches,
  getNews,
  getPrayerTimes,
  getSpace,
  getStocks,
  getWeather,
  type MatchItem,
} from "@/lib/live.functions";
import { feedback } from "@/lib/play-sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live — markets, news, weather, prayers & space | SlashAI" },
      {
        name: "description",
        content:
          "One live dashboard: NIFTY & SENSEX, crypto prices, forex rates, India headlines, weather, air quality, prayer times with Hijri date, cricket, football and the ISS — all free, no sign-in.",
      },
      { property: "og:title", content: "Live — markets, news, weather & more | SlashAI" },
      {
        property: "og:description",
        content:
          "Live Indian markets, crypto, forex, India news, weather, AQI, prayer times and space data in one calm dashboard.",
      },
    ],
  }),
  component: LivePage,
});

function Card({
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("glass lift aurora overflow-hidden rounded-2xl p-5", className)}>
      <header className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          <Icon className="size-4 text-primary" /> {title}
        </h2>
        {action}
      </header>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 animate-pulse rounded-lg bg-surface-elevated" />
      ))}
    </div>
  );
}

function RefreshButton({ spinning, onClick, label }: { spinning: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        feedback("tap");
        onClick();
      }}
      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
    >
      <RefreshCw className={cn("size-4", spinning && "animate-spin")} />
    </button>
  );
}

function CityInput({
  draft,
  setDraft,
  onSubmit,
  placeholder,
}: {
  draft: string;
  setDraft: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        feedback("tap");
        onSubmit();
      }}
      className="relative"
    >
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        aria-label="City"
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-border bg-surface pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
      />
    </form>
  );
}

// ------------------------------------------------------------------ weather

function WeatherCard() {
  const fetchWeather = useServerFn(getWeather);
  const [place, setPlace] = useState(() => localStorage.getItem("slashai-weather-city") || "Hyderabad");
  const [draft, setDraft] = useState(place);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["weather", place],
    queryFn: () => fetchWeather({ data: { place } }),
    staleTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  return (
    <Card
      title="Weather"
      icon={CloudSun}
      action={<RefreshButton label="Refresh weather" spinning={isFetching} onClick={() => void refetch()} />}
    >
      <CityInput
        draft={draft}
        setDraft={setDraft}
        onSubmit={() => {
          const p = draft.trim() || "Hyderabad";
          setPlace(p);
          localStorage.setItem("slashai-weather-city", p);
        }}
        placeholder="Any city in the world"
      />

      {isFetching && !data ? (
        <div className="mt-4">
          <Skeleton rows={3} />
        </div>
      ) : data ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-foreground">{data.place}</p>
          <div className="mt-1 flex items-end gap-3">
            <span className="text-5xl leading-none font-bold text-foreground">{data.tempC}°</span>
            <span className="pb-1 text-sm text-muted-foreground">{data.summary}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Feels {data.feelsC}°</span>
            <span className="inline-flex items-center gap-1">
              <Wind className="size-3.5" /> {data.windKph} km/h
            </span>
            <span className="inline-flex items-center gap-1">
              <Droplets className="size-3.5" /> {data.humidity}%
            </span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {data.days.map((d) => (
              <div key={d.date} className="panel rounded-xl px-2 py-2 text-center">
                <p className="text-[11px] text-muted-foreground">
                  {new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{d.maxC}°</p>
                <p className="text-[11px] text-muted-foreground">{d.minC}°</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Couldn&apos;t find that place — try another spelling.
        </p>
      )}
    </Card>
  );
}

// ------------------------------------------------------------- prayer times

interface PrayerRow {
  name: string;
  time: string;
}

/** Great-circle bearing from a coordinate to the Kaaba, in degrees from true north. */
function qiblaBearing(lat: number, lng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const kaaba = { lat: toRad(21.4225), lng: toRad(39.8262) };
  const dLng = kaaba.lng - toRad(lng);
  const y = Math.sin(dLng);
  const x = Math.cos(toRad(lat)) * Math.tan(kaaba.lat) - Math.sin(toRad(lat)) * Math.cos(dLng);
  return (((Math.atan2(y, x) * 180) / Math.PI) + 360) % 360;
}

function parseTime(t: string): [number, number] | null {
  const parts = t.split(":").map(Number);
  const h = parts[0] ?? NaN;
  const m = parts[1] ?? NaN;
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return [h, m];
}

function nextPrayer(rows: PrayerRow[], now: Date): { name: string; time: string; at: Date } | null {
  for (const r of rows) {
    const hm = parseTime(r.time);
    if (!hm) continue;
    const at = new Date(now);
    at.setHours(hm[0], hm[1], 0, 0);
    if (at > now) return { name: r.name, time: r.time, at };
  }
  // past Isha — count down to tomorrow's Fajr (≈ today's Fajr + 24 h)
  const fajr = rows[0];
  if (!fajr) return null;
  const hm = parseTime(fajr.time);
  if (!hm) return null;
  const at = new Date(now);
  at.setDate(at.getDate() + 1);
  at.setHours(hm[0], hm[1], 0, 0);
  return { name: "Fajr", time: fajr.time, at };
}

function PrayerCard() {
  const fetchPrayer = useServerFn(getPrayerTimes);
  const [city, setCity] = useState(() => localStorage.getItem("slashai-prayer-city") || "Hyderabad");
  const [country, setCountry] = useState(() => localStorage.getItem("slashai-prayer-country") || "India");
  const [draft, setDraft] = useState(city);
  const [locating, setLocating] = useState(false);
  const [, setTick] = useState(0);

  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const { data, isFetching, refetch, isError } = useQuery({
    queryKey: ["prayer", city.toLowerCase(), country.toLowerCase(), todayKey],
    queryFn: () => fetchPrayer({ data: { city, country } }),
    staleTime: 12 * 60 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const detectCity = () => {
    if (!navigator.geolocation) return;
    feedback("tap");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`,
          );
          const j = (await res.json()) as { city?: string; locality?: string; principalSubdivision?: string; countryName?: string };
          const name = j.city || j.locality || j.principalSubdivision;
          if (name) savePlace(name, j.countryName || country);
        } catch {
          /* keep current city */
        }
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 },
    );
  };

  const savePlace = (c: string, co: string) => {
    setCity(c);
    setCountry(co);
    setDraft(c);
    localStorage.setItem("slashai-prayer-city", c);
    localStorage.setItem("slashai-prayer-country", co);
  };

  const now = new Date();
  const next = data?.timings ? nextPrayer(data.timings, now) : null;
  const countdown = next
    ? (() => {
        const diff = Math.max(0, Math.floor((next.at.getTime() - now.getTime()) / 1000));
        const h = String(Math.floor(diff / 3600)).padStart(2, "0");
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
        const s = String(diff % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
      })()
    : null;

  return (
    <Card
      title="Prayer times"
      icon={Compass}
      action={<RefreshButton label="Refresh prayer times" spinning={isFetching} onClick={() => void refetch()} />}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <CityInput
            draft={draft}
            setDraft={setDraft}
            onSubmit={() => savePlace(draft.trim() || city, country)}
            placeholder={`City (${country})`}
          />
        </div>
        <Button variant="outline" size="sm" type="button" disabled={locating} onClick={detectCity}>
          {locating ? "Locating…" : "Locate me"}
        </Button>
      </div>

      {!data && !isError ? (
        <div className="mt-4">
          <Skeleton rows={4} />
        </div>
      ) : data ? (
        <div className="mt-4">
          {next && countdown ? (
            <div className="panel mb-3 rounded-xl p-3">
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Next prayer · {next.name}</p>
              <p className="mt-1 font-mono text-2xl font-bold text-primary tabular-nums">{countdown}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">at {next.time}</p>
            </div>
          ) : null}
          <ul className="space-y-1">
            {data.timings.map((t) => {
              const active = next?.name === t.name;
              return (
                <li
                  key={t.name}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-1.5 text-sm",
                    active ? "bg-accent font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span>{t.name}</span>
                  <span className="font-mono tabular-nums text-foreground">{t.time}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            {data.hijri && <span>☪ {data.hijri}</span>}
            <span>{city}, {country}</span>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Couldn&apos;t find that city — check the spelling or tap “Locate me”.
        </p>
      )}
    </Card>
  );
}

// -------------------------------------------------------------- air quality

const AQI_TONE: Record<string, string> = {
  Good: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  Moderate: "bg-yellow-500/15 text-yellow-400 border-yellow-500/40",
  "Unhealthy (sensitive)": "bg-orange-500/15 text-orange-400 border-orange-500/40",
  Unhealthy: "bg-red-500/15 text-red-400 border-red-500/40",
};

function AQICard() {
  const fetchAqi = useServerFn(getAirQuality);
  const [place, setPlace] = useState(() => localStorage.getItem("slashai-aqi-city") || "Hyderabad");
  const [draft, setDraft] = useState(place);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["aqi", place],
    queryFn: () => fetchAqi({ data: { place } }),
    staleTime: 15 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });

  return (
    <Card title="Air quality" icon={Wind} action={<RefreshButton label="Refresh air quality" spinning={isFetching} onClick={() => void refetch()} />}>
      <CityInput
        draft={draft}
        setDraft={setDraft}
        onSubmit={() => {
          const p = draft.trim() || "Hyderabad";
          setPlace(p);
          localStorage.setItem("slashai-aqi-city", p);
        }}
        placeholder="City for AQI"
      />
      {!data ? (
        <div className="mt-4">
          <Skeleton rows={2} />
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none font-bold text-foreground">{data.aqi ?? "—"}</span>
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-semibold",
                AQI_TONE[data.category] ?? "border-border bg-surface text-muted-foreground",
              )}
            >
              {data.category}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">US AQI · {data.place}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="panel rounded-xl px-3 py-2">
              <p className="text-[11px] text-muted-foreground">PM2.5</p>
              <p className="text-sm font-semibold text-foreground">
                {data.pm25 !== null ? `${Math.round(data.pm25)} µg/m³` : "—"}
              </p>
            </div>
            <div className="panel rounded-xl px-3 py-2">
              <p className="text-[11px] text-muted-foreground">PM10</p>
              <p className="text-sm font-semibold text-foreground">
                {data.pm10 !== null ? `${Math.round(data.pm10)} µg/m³` : "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// --------------------------------------------------------------- india news

const NEWS_TABS: { id: "india" | "business" | "tech" | "sports"; label: string }[] = [
  { id: "india", label: "India" },
  { id: "business", label: "Business" },
  { id: "tech", label: "Tech" },
  { id: "sports", label: "Sports" },
];

function IndiaNewsCard() {
  const fetchNews = useServerFn(getIndiaNews);
  const [tab, setTab] = useState<(typeof NEWS_TABS)[number]["id"]>("india");

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["india-news", tab],
    queryFn: () => fetchNews({ data: { category: tab } }),
    staleTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  return (
    <Card
      title="India news"
      icon={Newspaper}
      className="lg:col-span-2"
      action={<RefreshButton label="Refresh India news" spinning={isFetching} onClick={() => void refetch()} />}
    >
      <div className="-mt-1 mb-3 flex flex-wrap gap-1.5">
        {NEWS_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              feedback("tap");
              setTab(t.id);
            }}
            className={cn(
              "rounded-full px-3 py-1 text-xs transition-colors",
              tab === t.id ? "bg-accent font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {!data ? (
        <Skeleton rows={6} />
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Headlines are unavailable right now.</p>
      ) : (
        <ul className="space-y-1.5">
          {data.map((n) => (
            <li key={n.id}>
              <a
                href={n.url}
                target="_blank"
                rel="noreferrer noopener"
                className="panel lift flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:border-primary/50"
              >
                {n.thumbnail ? (
                  <img src={n.thumbnail} alt="" loading="lazy" className="size-12 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent">
                    <Newspaper className="size-5 text-primary" aria-hidden />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 block text-sm font-medium text-foreground">{n.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {n.source}
                    {n.published
                      ? ` · ${new Date(n.published).toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}`
                      : ""}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ------------------------------------------------------------ hacker news

function HackerNewsCard() {
  const fetchNews = useServerFn(getNews);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["news"],
    queryFn: () => fetchNews(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  return (
    <Card title="World tech" icon={Radio} action={<RefreshButton label="Refresh stories" spinning={isFetching} onClick={() => void refetch()} />}>
      {!data ? (
        <Skeleton rows={6} />
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Stories are unavailable right now.</p>
      ) : (
        <ul className="space-y-1">
          {data.slice(0, 10).map((n) => (
            <li key={n.id}>
              <a
                href={n.url}
                target="_blank"
                rel="noreferrer noopener"
                className="block rounded-lg px-2 py-2 transition-colors hover:bg-accent"
              >
                <p className="line-clamp-2 text-sm font-medium text-foreground">{n.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {n.source} · {n.points} points · {n.comments} comments
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ------------------------------------------------------------------ markets

/** 60 s refresh while NSE/BSE are open (Mon–Fri, 09:15–15:30 IST); off otherwise. */
function marketInterval(): number | false {
  const now = new Date(Date.now() + 5.5 * 3600_000); // shift to IST
  const day = now.getUTCDay();
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  if (day >= 1 && day <= 5 && mins >= 555 && mins <= 930) return 60_000;
  return false;
}

function ChangePct({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums",
        up ? "text-emerald-400" : "text-red-400",
      )}
    >
      {up ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
      {up ? "+" : ""}
      {pct.toFixed(2)}%
    </span>
  );
}

function StocksCard() {
  const fetchStocks = useServerFn(getStocks);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["stocks"],
    queryFn: () => fetchStocks(),
    staleTime: 55 * 1000,
    refetchInterval: marketInterval,
    retry: 1,
  });

  const gainers = data?.movers.filter((m) => m.changePct >= 0).slice(0, 5) ?? [];
  const losers = [...(data?.movers ?? [])].reverse().filter((m) => m.changePct < 0).slice(0, 5);

  return (
    <Card title="Indian markets" icon={Landmark} action={<RefreshButton label="Refresh market data" spinning={isFetching} onClick={() => void refetch()} />}>
      {!data ? (
        <Skeleton rows={3} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            {data.indices.map((i) => (
              <div key={i.symbol} className="panel rounded-xl p-3">
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{i.name}</p>
                <p className="mt-1 text-xl font-bold text-foreground tabular-nums">
                  {i.value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
                <ChangePct pct={i.changePct} />
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-[11px] font-semibold tracking-wide text-emerald-400 uppercase">Top gainers</p>
              <ul className="space-y-1">
                {gainers.map((m) => (
                  <li key={m.symbol} className="flex items-center justify-between text-xs">
                    <span className="truncate text-foreground">{m.name}</span>
                    <span className="ml-2 shrink-0 font-medium text-emerald-400 tabular-nums">+{m.changePct.toFixed(2)}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold tracking-wide text-red-400 uppercase">Top losers</p>
              <ul className="space-y-1">
                {losers.length > 0 ? (
                  losers.map((m) => (
                    <li key={m.symbol} className="flex items-center justify-between text-xs">
                      <span className="truncate text-foreground">{m.name}</span>
                      <span className="ml-2 shrink-0 font-medium text-red-400 tabular-nums">{m.changePct.toFixed(2)}%</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-muted-foreground">All green today 🎉</li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

const COIN_NAMES: Record<string, string> = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Solana",
  binancecoin: "BNB",
};

function CryptoCard() {
  const fetchCrypto = useServerFn(getCrypto);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["crypto"],
    queryFn: () => fetchCrypto(),
    staleTime: 55 * 1000,
    refetchInterval: 60_000,
  });

  return (
    <Card title="Crypto" icon={Coins} action={<RefreshButton label="Refresh crypto prices" spinning={isFetching} onClick={() => void refetch()} />}>
      {!data ? (
        <Skeleton rows={4} />
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Prices are unavailable right now.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((c) => (
            <li key={c.id} className="panel flex items-center justify-between rounded-xl px-3 py-2.5">
              <div>
                <p className="text-sm font-semibold text-foreground">{COIN_NAMES[c.id] ?? c.id}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  ₹{c.inr.toLocaleString("en-IN", { maximumFractionDigits: 0 })} · $
                  {c.usd.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </p>
              </div>
              <ChangePct pct={c.change24h} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function ForexCard() {
  const fetchForex = useServerFn(getForex);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["forex"],
    queryFn: () => fetchForex(),
    staleTime: 30 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
  });

  return (
    <Card title="Currency" icon={Coins} action={<RefreshButton label="Refresh exchange rates" spinning={isFetching} onClick={() => void refetch()} />}>
      {!data ? (
        <Skeleton rows={5} />
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Rates are unavailable right now.</p>
      ) : (
        <ul className="space-y-1.5">
          {data.map((f) => (
            <li key={f.pair} className="panel flex items-center justify-between rounded-xl px-3 py-2">
              <span className="flex items-center gap-2 text-sm text-foreground">
                <span aria-hidden>{f.flag}</span> {f.pair}
              </span>
              <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
                ₹{f.rate.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ------------------------------------------------------------------ commodities

function CommoditiesCard() {
  const fetchCommodities = useServerFn(getCommodities);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["commodities"],
    queryFn: () => fetchCommodities(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  return (
    <Card title="Commodities" icon={BarChart3} action={<RefreshButton label="Refresh commodity prices" spinning={isFetching} onClick={() => void refetch()} />}>
      {!data ? (
        <Skeleton rows={5} />
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Commodity prices are unavailable right now.</p>
      ) : (
        <ul className="space-y-1.5">
          {data.map((c) => {
            const change = c.price - c.prev;
            const pct = c.prev > 0 ? ((change / c.prev) * 100) : 0;
            const up = change >= 0;
            return (
              <li key={c.symbol} className="panel flex items-center justify-between rounded-xl px-3 py-2">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">{c.name}</span>
                  <span className="text-[11px] text-muted-foreground">{c.unit}</span>
                </span>
                <span className="text-right">
                  <span className="block font-mono text-sm font-semibold text-foreground tabular-nums">
                    ${c.price.toFixed(2)}
                  </span>
                  <span className={`block text-[11px] font-medium tabular-nums ${up ? "text-green" : "text-red"}`}>
                    {up ? "+" : ""}{change.toFixed(2)} ({up ? "+" : ""}{pct.toFixed(1)}%)
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

// ------------------------------------------------------------------- scores

function MatchRow({ m }: { m: MatchItem }) {
  const live = /(1st|2nd|half|live|in play|innings)/i.test(m.status);
  return (
    <li className="panel lift flex items-center gap-3 rounded-xl px-3 py-2.5">
      {m.badge ? (
        <img src={m.badge} alt="" loading="lazy" className="size-8 shrink-0 rounded object-contain" />
      ) : (
        <Trophy className="size-8 shrink-0 p-1.5 text-primary" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {m.home && m.away ? `${m.home} vs ${m.away}` : m.event}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {m.league}
          {m.time
            ? ` · ${new Date(m.time).toLocaleString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "short",
              })}`
            : ""}
        </p>
      </div>
      <div className="shrink-0 text-right">
        {m.homeScore !== null && m.awayScore !== null ? (
          <p className="font-mono text-sm font-semibold text-foreground">
            {m.homeScore} – {m.awayScore}
          </p>
        ) : null}
        <p className={cn("text-[11px]", live ? "font-semibold text-primary" : "text-muted-foreground")}>
          {live && <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-primary align-middle" />}
          {m.status}
        </p>
      </div>
    </li>
  );
}

function ScoresCard({ sport, title }: { sport: "Soccer" | "Cricket"; title: string }) {
  const fetchMatches = useServerFn(getMatches);
  const [offset, setOffset] = useState(0);
  const { data, isFetching } = useQuery({
    queryKey: ["matches", sport, offset],
    queryFn: () => fetchMatches({ data: { sport, offsetDays: offset } }),
    staleTime: 60 * 1000,
    refetchInterval: 60_000,
  });

  const label = offset === 0 ? "Today" : offset === -1 ? "Yesterday" : "Tomorrow";

  return (
    <Card
      title={title}
      icon={Trophy}
      action={
        <div className="flex items-center gap-1">
          {[-1, 0, 1].map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => {
                feedback("tap");
                setOffset(o);
              }}
              className={cn(
                "rounded-lg px-2 py-1 text-xs transition-colors",
                offset === o ? "bg-accent font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o === -1 ? "Yest" : o === 0 ? "Today" : "Tmrw"}
            </button>
          ))}
        </div>
      }
    >
      {!data && isFetching ? (
        <Skeleton rows={5} />
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {title.toLowerCase()} listed for {label.toLowerCase()}.</p>
      ) : (
        <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
          {data.map((m) => (
            <MatchRow key={m.id} m={m} />
          ))}
        </ul>
      )}
    </Card>
  );
}

// -------------------------------------------------------------------- space

const MOON_PHASES: [number, string][] = [
  [0.03, "New Moon"],
  [0.22, "Waxing Crescent"],
  [0.28, "First Quarter"],
  [0.47, "Waxing Gibbous"],
  [0.53, "Full Moon"],
  [0.72, "Waning Gibbous"],
  [0.78, "Last Quarter"],
  [0.97, "Waning Crescent"],
];

function moonInfo(date = new Date()) {
  const synodic = 29.53058867;
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14);
  const days = (date.getTime() - knownNewMoon) / 86_400_000;
  const age = ((days % synodic) + synodic) % synodic;
  const fraction = age / synodic;
  const illum = Math.round(((1 - Math.cos(2 * Math.PI * fraction)) / 2) * 100);
  let name = MOON_PHASES[MOON_PHASES.length - 1]![1];
  for (const [limit, label] of MOON_PHASES) {
    if (fraction <= limit) {
      name = label;
      break;
    }
  }
  return { name, age, illum, emoji: name === "Full Moon" ? "🌕" : name === "New Moon" ? "🌑" : fraction < 0.5 ? "🌒" : "🌘" };
}

function MoonCard() {
  const info = useMemo(() => moonInfo(), []);
  return (
    <Card title="Moon tonight" icon={Moon}>
      <div className="flex items-center gap-4">
        <span className="text-5xl" aria-hidden>
          {info.emoji}
        </span>
        <div>
          <p className="text-base font-bold text-foreground">{info.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Day {info.age.toFixed(1)} of the cycle · {info.illum}% illuminated
          </p>
        </div>
      </div>
    </Card>
  );
}

function IssCard() {
  const fetchSpace = useServerFn(getSpace);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["iss"],
    queryFn: () => fetchSpace(),
    select: (d) => d.iss,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
  return (
    <Card
      title="ISS tracker"
      icon={Satellite}
      action={<RefreshButton label="Refresh ISS position" spinning={isFetching} onClick={() => void refetch()} />}
    >
      {!data ? (
        <Skeleton rows={2} />
      ) : (
        <ul className="space-y-1.5 text-sm">
          <li className="flex justify-between">
            <span className="text-muted-foreground">Latitude</span>
            <span className="font-mono text-foreground tabular-nums">{data.latitude.toFixed(2)}°</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Longitude</span>
            <span className="font-mono text-foreground tabular-nums">{data.longitude.toFixed(2)}°</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Altitude</span>
            <span className="font-mono text-foreground tabular-nums">{data.altitudeKm.toLocaleString()} km</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Speed</span>
            <span className="font-mono text-foreground tabular-nums">{data.velocityKph.toLocaleString()} km/h</span>
          </li>
        </ul>
      )}
    </Card>
  );
}

function ApodCard() {
  const fetchSpace = useServerFn(getSpace);
  const { data, isFetching } = useQuery({
    queryKey: ["apod"],
    queryFn: () => fetchSpace(),
    select: (d) => d.apod,
    staleTime: 6 * 60 * 60 * 1000,
  });
  return (
    <Card
      title="NASA picture of the day"
      icon={Rocket}
      className="lg:col-span-2"
      action={
        isFetching ? <RefreshCw className="size-4 animate-spin text-muted-foreground" /> : undefined
      }
    >
      {!data ? (
        <Skeleton rows={3} />
      ) : !data.imageUrl ? (
        <p className="text-sm text-muted-foreground">Today&apos;s picture is unavailable (NASA&apos;s demo key has daily limits — it usually recovers within the hour).</p>
      ) : (
        <a href={data.imageUrl} target="_blank" rel="noreferrer noopener" className="group block">
          <img
            src={data.imageUrl}
            alt={data.title}
            loading="lazy"
            className="aspect-video w-full rounded-xl object-cover transition-opacity group-hover:opacity-90"
          />
          <p className="mt-3 text-sm font-bold text-foreground">{data.title}</p>
          <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{data.explanation}</p>
        </a>
      )}
    </Card>
  );
}

// --------------------------------------------------------------------- page

function LivePage() {
  return (
    <AppShell wide title="Live">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Radio className="size-5 text-primary" /> Live
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Markets, crypto, currency, India headlines, weather, air quality, prayer times and space — one calm
          dashboard, all from free public data. No account, no keys.
        </p>
      </header>

      <div className="mt-5 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <WeatherCard />
        <PrayerCard />
        <AQICard />
        <IndiaNewsCard />
        <HackerNewsCard />
        <StocksCard />
        <CryptoCard />
        <ForexCard />
        <CommoditiesCard />
        <ScoresCard sport="Cricket" title="Cricket" />
        <ScoresCard sport="Soccer" title="Football" />
        <ApodCard />
        <MoonCard />
        <IssCard />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Data: Yahoo Finance (markets), CoinGecko (crypto), open.er-api.com (currency), NDTV/Gadgets360 feeds via
        rss2json (India news), Open-Meteo (weather & air quality), Aladhan (prayer times), Hacker News, NASA APOD,
        WhereTheISS.at, TheSportsDB. Markets auto-refresh during NSE hours.
      </p>
    </AppShell>
  );
}
