/** Server-only media helpers: keyless YouTube search and movie metadata. */
import { REGIONAL_SHELVES } from "./regional-films";
import type { MovieHit, VideoHit } from "./media-types";

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

export async function runVideoSearch(
  q: string,
  music: boolean,
): Promise<{ hits: VideoHit[]; degraded: boolean }> {
  const piped = await pipedSearch(q, music);
  if (piped.length) return { hits: piped, degraded: false };
  const inv = await invidiousSearch(q, music);
  return { hits: inv, degraded: inv.length === 0 };
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

const CINEMETA = "https://v3-cinemeta.strem.io";

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

async function searchMetas(term: string): Promise<CinemetaMeta[]> {
  const json = (await fetchJson(
    `${CINEMETA}/catalog/movie/top/search=${encodeURIComponent(term)}.json`,
    8000,
  )) as { metas?: CinemetaMeta[] } | null;
  return json?.metas ?? [];
}

/** Free-text movie search. */
export async function runMovieSearch(q: string): Promise<MovieHit[]> {
  const out: MovieHit[] = [];
  for (const m of await searchMetas(q)) {
    const hit = toMovie(m);
    if (hit) out.push(hit);
  }
  return out.slice(0, 40);
}

/**
 * Curated regional shelf. The upstream catalog has no language dimension, so
 * each shelf resolves hand-picked titles and falls back to the seed itself when
 * metadata is unavailable — the shelf never renders empty.
 */
export async function runRegionalShelf(lang: string): Promise<MovieHit[]> {
  const shelf = REGIONAL_SHELVES.find((s) => s.lang === lang) ?? REGIONAL_SHELVES[0]!;
  return Promise.all(
    shelf.films.map(async (seed) => {
      const metas = await searchMetas(seed.title);
      const wanted = seed.title.toLowerCase();
      const best =
        metas.find(
          (m) =>
            (m.name ?? "").toLowerCase() === wanted &&
            String(m.year ?? m.releaseInfo ?? "").startsWith(seed.year),
        ) ??
        metas.find((m) => (m.name ?? "").toLowerCase() === wanted) ??
        metas[0];
      return (
        (best ? toMovie(best) : null) ?? {
          id: `seed-${seed.title.toLowerCase().replace(/\s+/g, "-")}`,
          title: seed.title,
          year: seed.year,
          poster: null,
          rating: null,
          genres: [],
          description: "",
          cast: [],
          runtime: null,
        }
      );
    }),
  );
}

export async function runMovieDetail(id: string): Promise<MovieHit | null> {
  if (!/^tt\d+$/.test(id)) return null;
  const json = (await fetchJson(`${CINEMETA}/meta/movie/${id}.json`)) as {
    meta?: CinemetaMeta;
  } | null;
  return json?.meta ? toMovie(json.meta) : null;
}
