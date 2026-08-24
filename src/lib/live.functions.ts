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
  .inputValidator((data) => z.object({ place: z.string().trim().min(1).max(60) }).parse(data))
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

/** Fixtures and scores for a sport on a given day from TheSportsDB's free tier. */
export const getMatches = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ sport: z.enum(["Soccer", "Cricket"]), offsetDays: z.number().min(-3).max(3) }).parse(
      data,
    ),
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
