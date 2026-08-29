import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  points: number;
  comments: number;
}

export interface WeatherNow {
  place: string;
  tempC: number;
  feelsC: number;
  windKph: number;
  humidity: number;
  code: number;
  summary: string;
  days: { date: string; maxC: number; minC: number; code: number }[];
}

export interface MatchItem {
  id: string;
  event: string;
  league: string;
  time: string;
  home: string;
  away: string;
  homeScore: string | null;
  awayScore: string | null;
  status: string;
  badge: string | null;
}

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Freezing fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Heavy showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm",
};

/** Top tech/world stories from the keyless Hacker News search API. */
export const getNews = createServerFn({ method: "GET" }).handler(async (): Promise<NewsItem[]> => {
  try {
    const res = await fetch("https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=18");
    if (!res.ok) return [];
    const json = (await res.json()) as {
      hits?: {
        objectID: string;
        title?: string | null;
        url?: string | null;
        points?: number | null;
        num_comments?: number | null;
      }[];
    };
    return (json.hits ?? [])
      .filter((h) => h.title)
      .map((h) => {
        const url = h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`;
        let source = "news.ycombinator.com";
        try {
          source = new URL(url).hostname.replace(/^www\./, "");
        } catch {
          /* keep fallback */
        }
        return {
          id: h.objectID,
          title: h.title as string,
          url,
          source,
          points: h.points ?? 0,
          comments: h.num_comments ?? 0,
        };
      });
  } catch {
    return [];
  }
});

/** Current conditions + 4-day outlook from Open-Meteo (no API key required). */
export const getWeather = createServerFn({ method: "GET" })
  .validator((data) => z.object({ place: z.string().trim().min(1).max(60) }).parse(data))
  .handler(async ({ data }): Promise<WeatherNow | null> => {
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(data.place)}&count=1&language=en&format=json`,
      );
      if (!geoRes.ok) return null;
      const geo = (await geoRes.json()) as {
        results?: { latitude: number; longitude: number; name: string; country?: string }[];
      };
      const hit = geo.results?.[0];
      if (!hit) return null;

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${hit.latitude}&longitude=${hit.longitude}` +
          "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +
          "&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto",
      );
      if (!res.ok) return null;
      const w = (await res.json()) as {
        current?: {
          temperature_2m: number;
          apparent_temperature: number;
          relative_humidity_2m: number;
          weather_code: number;
          wind_speed_10m: number;
        };
        daily?: {
          time: string[];
          weather_code: number[];
          temperature_2m_max: number[];
          temperature_2m_min: number[];
        };
      };
      if (!w.current) return null;

      const days = (w.daily?.time ?? []).slice(1, 5).map((date, i) => ({
        date,
        maxC: Math.round(w.daily?.temperature_2m_max[i + 1] ?? 0),
        minC: Math.round(w.daily?.temperature_2m_min[i + 1] ?? 0),
        code: w.daily?.weather_code[i + 1] ?? 0,
      }));

      return {
        place: hit.country ? `${hit.name}, ${hit.country}` : hit.name,
        tempC: Math.round(w.current.temperature_2m),
        feelsC: Math.round(w.current.apparent_temperature),
        humidity: Math.round(w.current.relative_humidity_2m),
        windKph: Math.round(w.current.wind_speed_10m),
        code: w.current.weather_code,
        summary: WEATHER_CODES[w.current.weather_code] ?? "Current conditions",
        days,
      };
    } catch {
      return null;
    }
  });

// ------------------------------------------------------------------ markets

export interface IndexQuote {
  symbol: string;
  name: string;
  value: number;
  previousClose: number;
  changePct: number;
}

export interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
}

export interface StocksData {
  indices: IndexQuote[];
  movers: MarketMover[];
  fetchedAt: string;
}

const INDEX_SYMBOLS: [string, string][] = [
  ["^NSEI", "NIFTY 50"],
  ["^BSESN", "SENSEX"],
];

/** Liquid large caps used to derive real gainers/losers without Yahoo's authed screener. */
const WATCHLIST: [string, string][] = [
  ["RELIANCE.NS", "Reliance"],
  ["TCS.NS", "TCS"],
  ["HDFCBANK.NS", "HDFC Bank"],
  ["ICICIBANK.NS", "ICICI Bank"],
  ["INFY.NS", "Infosys"],
  ["SBIN.NS", "SBI"],
  ["BHARTIARTL.NS", "Bharti Airtel"],
  ["LT.NS", "Larsen & Toubro"],
  ["ITC.NS", "ITC"],
  ["AXISBANK.NS", "Axis Bank"],
];

interface YahooChart {
  chart?: {
    result?: {
      meta?: { symbol?: string; regularMarketPrice?: number; chartPreviousClose?: number } | null;
    }[] | null;
  } | null;
}

async function yahooQuote(symbol: string) {
  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`,
    { headers: { accept: "application/json", "user-agent": "Mozilla/5.0 SlashAI" } },
  );
  if (!res.ok) return null;
  const json = (await res.json()) as YahooChart;
  const meta = json.chart?.result?.[0]?.meta;
  if (!meta || typeof meta.regularMarketPrice !== "number") return null;
  return {
    symbol,
    price: meta.regularMarketPrice,
    prev: meta.chartPreviousClose ?? meta.regularMarketPrice,
  };
}

/** NIFTY 50 + SENSEX levels and real large-cap movers from Yahoo Finance (keyless). */
export const getStocks = createServerFn({ method: "GET" }).handler(async (): Promise<StocksData | null> => {
  try {
    const symbols = [...INDEX_SYMBOLS, ...WATCHLIST].map(([s]) => s);
    const quotes = await Promise.all(symbols.map((s) => yahooQuote(s)));
    const bySymbol = new Map(quotes.filter((q): q is NonNullable<typeof q> => q !== null).map((q) => [q.symbol, q]));

    const indices: IndexQuote[] = [];
    for (const [symbol, name] of INDEX_SYMBOLS) {
      const q = bySymbol.get(symbol);
      if (!q || q.prev === 0) continue;
      indices.push({
        symbol,
        name,
        value: q.price,
        previousClose: q.prev,
        changePct: ((q.price - q.prev) / q.prev) * 100,
      });
    }

    const movers: MarketMover[] = WATCHLIST.filter(([s]) => bySymbol.has(s))
      .map(([s, name]) => {
        const q = bySymbol.get(s)!;
        return { symbol: s, name, price: q.price, changePct: q.prev ? ((q.price - q.prev) / q.prev) * 100 : 0 };
      })
      .sort((a, b) => b.changePct - a.changePct);

    if (indices.length === 0 && movers.length === 0) return null;
    return { indices, movers, fetchedAt: new Date().toISOString() };
  } catch {
    return null;
  }
});

export interface CryptoCoin {
  id: string;
  inr: number;
  usd: number;
  change24h: number;
}

/** BTC/ETH/SOL/BNB prices in ₹ and $ from CoinGecko (free, no key). */
export const getCrypto = createServerFn({ method: "GET" }).handler(async (): Promise<CryptoCoin[]> => {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=inr,usd&include_24hr_change=true",
    );
    if (!res.ok) return [];
    const json = (await res.json()) as Record<
      string,
      { inr?: number; usd?: number; inr_24h_change?: number; usd_24h_change?: number }
    >;
    return Object.entries(json)
      .filter(([, v]) => typeof v.inr === "number")
      .map(([id, v]) => ({
        id,
        inr: v.inr as number,
        usd: v.usd ?? 0,
        change24h: v.inr_24h_change ?? v.usd_24h_change ?? 0,
      }));
  } catch {
    return [];
  }
});

export interface ForexRate {
  pair: string;
  flag: string;
  rate: number;
}

/** USD/EUR/GBP/AED/SAR → INR from open.er-api.com (completely free, no key). */
export const getForex = createServerFn({ method: "GET" }).handler(async (): Promise<ForexRate[]> => {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!res.ok) return [];
    const json = (await res.json()) as { rates?: Record<string, number> };
    const rates = json.rates;
    if (!rates) return [];
    const inr = rates["INR"];
    if (!inr) return [];
    const cross = (code: string) => {
      const v = rates[code];
      return v ? inr / v : NaN;
    };
    const rows: [string, string, number][] = [
      ["USD → INR", "🇺🇸", inr],
      ["EUR → INR", "🇪🇺", cross("EUR")],
      ["GBP → INR", "🇬🇧", cross("GBP")],
      ["AED → INR", "🇦🇪", cross("AED")],
      ["SAR → INR", "🇸🇦", cross("SAR")],
    ];
    return rows
      .filter(([, , rate]) => Number.isFinite(rate))
      .map(([pair, flag, rate]) => ({ pair, flag, rate }));
  } catch {
    return [];
  }
});

// --------------------------------------------------------------------- news

export interface IndiaNewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  published: string;
  thumbnail: string | null;
}

const INDIA_FEEDS: Record<string, { url: string; label: string }> = {
  india: { url: "https://feeds.feedburner.com/ndtvnews-india-news", label: "NDTV" },
  business: { url: "https://feeds.feedburner.com/ndtvprofit-latest", label: "NDTV Profit" },
  tech: { url: "https://feeds.feedburner.com/gadgets360-latest", label: "Gadgets360" },
  sports: { url: "https://feeds.feedburner.com/ndtvnews-sports-news", label: "NDTV Sports" },
};

/** Top India headlines via rss2json over public NDTV/Gadgets360 feeds (no key). */
export const getIndiaNews = createServerFn({ method: "GET" })
  .validator((data) => z.object({ category: z.enum(["india", "business", "tech", "sports"]) }).parse(data))
  .handler(async ({ data }): Promise<IndiaNewsItem[]> => {
    try {
      const feed = INDIA_FEEDS[data.category] ?? INDIA_FEEDS["india"]!;
      const res = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`,
      );
      if (!res.ok) return [];
      const json = (await res.json()) as {
        status?: string;
        items?: { title: string; link: string; pubDate: string; guid?: string; thumbnail?: string; enclosure?: { link?: string }; description?: string }[];
      };
      if (json.status !== "ok") return [];
      return (json.items ?? []).slice(0, 8).map((item, i) => ({
        id: item.guid ?? `${data.category}-${i}-${item.link}`,
        title: item.title,
        url: item.link,
        source: feed.label,
        published: item.pubDate ?? "",
        thumbnail:
          item.thumbnail ??
          item.enclosure?.link ??
          // fall back to the first image inside the HTML description
          (item.description?.match(/<img[^>]+src="([^"]+)"/)?.[1] ?? null),
      }));
    } catch {
      return [];
    }
  });

// -------------------------------------------------------------- prayer times

export interface PrayerTimesData {
  city: string;
  timings: { name: string; time: string }[];
  hijri: string;
  gregorian: string;
  tomorrowFajr: string | null;
}

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

/** Prayer times + Hijri date from Aladhan (completely free, no key). */
export const getPrayerTimes = createServerFn({ method: "GET" })
  .validator((data) =>
    z.object({ city: z.string().trim().min(1).max(60), country: z.string().trim().min(1).max(60) }).parse(data),
  )
  .handler(async ({ data }): Promise<PrayerTimesData | null> => {
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(data.city)}&country=${encodeURIComponent(data.country)}&method=1`,
      );
      if (!res.ok) return null;
      const json = (await res.json()) as {
        data?: {
          timings?: Record<string, string>;
          date?: {
            hijri?: { day?: string; month?: { en?: string }; year?: string };
            gregorian?: { date?: string };
          };
        };
      };
      const d = json.data;
      if (!d?.timings) return null;
      const clean = (t: string | undefined) => (t ?? "").split(" ")[0] ?? "";
      const timings = PRAYER_ORDER.map((name) => ({ name, time: clean(d.timings?.[name]) })).filter(
        (x) => /^\d{1,2}:\d{2}$/.test(x.time),
      );
      if (timings.length < 5) return null;
      const h = d.date?.hijri;
      return {
        city: data.city,
        timings,
        hijri: h?.day && h.month?.en && h.year ? `${h.day} ${h.month.en} ${h.year} AH` : "",
        gregorian: d.date?.gregorian?.date ?? "",
        tomorrowFajr: null,
      };
    } catch {
      return null;
    }
  });

// ------------------------------------------------------------ air quality

export interface AirQualityData {
  place: string;
  aqi: number | null;
  pm25: number | null;
  pm10: number | null;
}

function aqiCategory(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy (sensitive)";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

export interface AirQualityResult extends AirQualityData {
  category: string;
}

/** US AQI + particulates from Open-Meteo's air-quality API (same provider as weather). */
export const getAirQuality = createServerFn({ method: "GET" })
  .validator((data) => z.object({ place: z.string().trim().min(1).max(60) }).parse(data))
  .handler(async ({ data }): Promise<AirQualityResult | null> => {
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(data.place)}&count=1&language=en&format=json`,
      );
      const geo = (await geoRes.json()) as {
        results?: { latitude: number; longitude: number; name: string; country?: string }[];
      };
      const hit = geo.results?.[0];
      if (!hit) return null;

      const res = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${hit.latitude}&longitude=${hit.longitude}&current=pm10,pm2_5,us_aqi&timezone=auto`,
      );
      if (!res.ok) return null;
      const json = (await res.json()) as {
        current?: { pm10?: number; pm2_5?: number; us_aqi?: number };
      };
      const cur = json.current;
      if (!cur) return null;
      const aqi = typeof cur.us_aqi === "number" ? Math.round(cur.us_aqi) : null;
      return {
        place: hit.country ? `${hit.name}, ${hit.country}` : hit.name,
        aqi,
        category: aqi === null ? "Unknown" : aqiCategory(aqi),
        pm25: cur.pm2_5 ?? null,
        pm10: cur.pm10 ?? null,
      };
    } catch {
      return null;
    }
  });

// ------------------------------------------------------------------- space

export interface SpaceData {
  apod: { title: string; explanation: string; imageUrl: string; date: string } | null;
  iss: { latitude: number; longitude: number; altitudeKm: number; velocityKph: number } | null;
}

/** NASA Astronomy Picture of the Day + live ISS position (both free). */
export const getSpace = createServerFn({ method: "GET" }).handler(async (): Promise<SpaceData> => {
  const out: SpaceData = { apod: null, iss: null };
  const results = await Promise.allSettled([
    fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&thumbs=true"),
    fetch("https://api.wheretheiss.at/v1/satellites/25544"),
  ]);

  const [apodRes, issRes] = results;
  if (apodRes.status === "fulfilled" && apodRes.value.ok) {
    try {
      const j = (await apodRes.value.json()) as {
        title?: string;
        explanation?: string;
        url?: string;
        thumbnail_url?: string;
        media_type?: string;
        date?: string;
      };
      if (j.title && j.explanation) {
        out.apod = {
          title: j.title,
          explanation: j.explanation,
          imageUrl: (j.media_type === "image" ? j.url : j.thumbnail_url) ?? "",
          date: j.date ?? "",
        };
      }
    } catch {
      /* leave null */
    }
  }
  if (issRes.status === "fulfilled" && issRes.value.ok) {
    try {
      const j = (await issRes.value.json()) as {
        latitude?: number;
        longitude?: number;
        altitude?: number;
        velocity?: number;
      };
      if (typeof j.latitude === "number" && typeof j.longitude === "number") {
        out.iss = {
          latitude: j.latitude,
          longitude: j.longitude,
          altitudeKm: Math.round(j.altitude ?? 0),
          velocityKph: Math.round(j.velocity ?? 0),
        };
      }
    } catch {
      /* leave null */
    }
  }
  return out;
});

/** Fixtures and scores for a sport on a given day from TheSportsDB's free tier. */
export const getMatches = createServerFn({ method: "GET" })
  .validator((data) =>
    z
      .object({ sport: z.enum(["Soccer", "Cricket"]), offsetDays: z.number().min(-3).max(3) })
      .parse(data),
  )
  .handler(async ({ data }): Promise<MatchItem[]> => {
    try {
      const day = new Date(Date.now() + data.offsetDays * 86_400_000).toISOString().slice(0, 10);
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${day}&s=${data.sport}`,
      );
      if (!res.ok) return [];
      const json = (await res.json()) as {
        events?: {
          idEvent: string;
          strEvent?: string | null;
          strLeague?: string | null;
          strTimestamp?: string | null;
          strHomeTeam?: string | null;
          strAwayTeam?: string | null;
          intHomeScore?: string | null;
          intAwayScore?: string | null;
          strStatus?: string | null;
          strLeagueBadge?: string | null;
        }[];
      };
      return (json.events ?? []).slice(0, 24).map((e) => ({
        id: e.idEvent,
        event: e.strEvent ?? "Match",
        league: e.strLeague ?? "",
        time: e.strTimestamp ?? "",
        home: e.strHomeTeam ?? "",
        away: e.strAwayTeam ?? "",
        homeScore: e.intHomeScore ?? null,
        awayScore: e.intAwayScore ?? null,
        status: e.strStatus && e.strStatus !== "NS" ? e.strStatus : "Scheduled",
        badge: e.strLeagueBadge ?? null,
      }));
    } catch {
      return [];
    }
  });
