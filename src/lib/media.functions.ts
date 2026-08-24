import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/* --------------------------------- youtube -------------------------------- */

export interface VideoHit {
  id: string;
  title: string;
  author: string;
  duration: number;
  views: number;
  thumb: string;
}

const PIPED = [
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.adminforge.de",
  "https://api.piped.private.coffee",
];

const INVIDIOUS = ["https://inv.nadeko.net", "https://invidious.nerdvpn.de", "https://yewtu.be"];

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

async function fetchJson(url: string, ms = 6000): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(ms),
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

async function pipedSearch(q: string, music: boolean): Promise<VideoHit[]> {
  const filter = music ? "music_songs" : "videos";
  for (const base of PIPED) {
    const json = (await fetchJson(
      `${base}/search?q=${encodeURIComponent(q)}&filter=${filter}`,
    )) as { items?: Record<string, unknown>[] } | null;
    const items = json?.items;
    if (!Array.isArray(items) || items.length === 0) continue;
    const hits: VideoHit[] = [];
    for (const it of items) {
      const url = typeof it["url"] === "string" ? it["url"] : "";
      const id = url.split("v=")[1]?.split("&")[0] ?? "";
      if (!id) continue;
      hits.push({
        id,
        title: String(it["title"] ?? "Untitled"),
        author: String(it["uploaderName"] ?? ""),
        duration: num(it["duration"]),
        views: num(it["views"]),
        thumb: ytThumb(id),
      });
    }
    if (hits.length) return hits.slice(0, 30);
  }
  return [];
}

async function invidiousSearch(q: string, music: boolean): Promise<VideoHit[]> {
  const query = music ? `${q} official audio` : q;
  for (const base of INVIDIOUS) {
    const json = (await fetchJson(
      `${base}/api/v1/search?q=${encodeURIComponent(query)}&type=video`,
    )) as Record<string, unknown>[] | null;
    if (!Array.isArray(json) || json.length === 0) continue;
    const hits: VideoHit[] = [];
    for (const it of json) {
      const id = typeof it["videoId"] === "string" ? it["videoId"] : "";
      if (!id) continue;
      hits.push({
        id,
        title: String(it["title"] ?? "Untitled"),
        author: String(it["author"] ?? ""),
        duration: num(it["lengthSeconds"]),
        views: num(it["viewCount"]),
        thumb: ytThumb(id),
      });
    }
    if (hits.length) return hits.slice(0, 30);
  }
  return [];
}

/**
 * Keyless YouTube search. Tries Piped mirrors first (best music metadata) and
 * falls back to Invidious mirrors; every result is playable through the
 * privacy-friendly youtube-nocookie embed.
 */
export const searchVideos = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ q: z.string().trim().min(1).max(120), music: z.boolean() }).parse(data),
  )
  .handler(async ({ data }): Promise<{ hits: VideoHit[]; degraded: boolean }> => {
    const piped = await pipedSearch(data.q, data.music);
    if (piped.length) return { hits: piped, degraded: false };
    const inv = await invidiousSearch(data.q, data.music);
    return { hits: inv, degraded: inv.length === 0 };
  });

/* --------------------------------- movies --------------------------------- */

export interface MovieHit {
  id: string;
  title: string;
  year: string;
  poster: string | null;
  rating: string | null;
  genres: string[];
  description: string;
  cast: string[];
  runtime: string | null;
}

interface CinemetaMeta {
  imdb_id?: string;
  id?: string;
  name?: string;
  year?: string;
  releaseInfo?: string;
  poster?: string;
  imdbRating?: string;
  genres?: string[];
  genre?: string[];
  description?: string;
  cast?: string[];
  runtime?: string;
}

const toMovie = (m: CinemetaMeta): MovieHit | null => {
  const id = m.imdb_id ?? m.id ?? "";
  if (!id.startsWith("tt") || !m.name) return null;
  return {
    id,
    title: m.name,
    year: String(m.year ?? m.releaseInfo ?? "").slice(0, 9),
    poster: m.poster ?? null,
    rating: m.imdbRating ?? null,
    genres: (m.genres ?? m.genre ?? []).slice(0, 4),
    description: m.description ?? "",
    cast: (m.cast ?? []).slice(0, 5),
    runtime: m.runtime ?? null,
  };
};

/**
 * Regional movie discovery via Cinemeta (free, keyless IMDb metadata).
 * `mode` is either a text search or a curated regional query used as the seed.
 */
export const searchMovies = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({ q: z.string().trim().max(120), genre: z.string().trim().max(40) })
      .parse(data),
  )
  .handler(async ({ data }): Promise<MovieHit[]> => {
    const base = "https://v3-cinemeta.strem.io/catalog/movie";
    const url = data.q
      ? `${base}/top/search=${encodeURIComponent(data.q)}.json`
      : `${base}/top/genre=${encodeURIComponent(data.genre || "Bollywood")}.json`;
    const json = (await fetchJson(url, 8000)) as { metas?: CinemetaMeta[] } | null;
    const metas = json?.metas ?? [];
    const out: MovieHit[] = [];
    for (const m of metas) {
      const hit = toMovie(m);
      if (hit) out.push(hit);
    }
    return out.slice(0, 40);
  });

/** Full detail for one title, used by the watch panel. */
export const movieDetail = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ id: z.string().trim().max(20) }).parse(data))
  .handler(async ({ data }): Promise<MovieHit | null> => {
    if (!/^tt\d+$/.test(data.id)) return null;
    const json = (await fetchJson(`https://v3-cinemeta.strem.io/meta/movie/${data.id}.json`)) as
      | { meta?: CinemetaMeta }
      | null;
    return json?.meta ? toMovie(json.meta) : null;
  });
