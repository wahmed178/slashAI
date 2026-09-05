import { t as REGIONAL_SHELVES } from "./regional-films-C66JSklZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/media.server-CUIBVsVq.js
/** Server-only media helpers: keyless YouTube search and movie metadata. */
var PIPED = [
	"https://pipedapi.kavin.rocks",
	"https://pipedapi.adminforge.de",
	"https://api.piped.private.coffee"
];
var INVIDIOUS = [
	"https://inv.nadeko.net",
	"https://invidious.nerdvpn.de",
	"https://yewtu.be"
];
var num = (v) => typeof v === "number" && Number.isFinite(v) ? v : 0;
async function fetchJson(url, ms = 6e3) {
	try {
		const res = await fetch(url, {
			signal: AbortSignal.timeout(ms),
			headers: { accept: "application/json" }
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}
var ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
async function pipedSearch(q, music) {
	const filter = music ? "music_songs" : "videos";
	for (const base of PIPED) {
		const items = (await fetchJson(`${base}/search?q=${encodeURIComponent(q)}&filter=${filter}`))?.items;
		if (!Array.isArray(items) || items.length === 0) continue;
		const hits = [];
		for (const it of items) {
			const id = (typeof it["url"] === "string" ? it["url"] : "").split("v=")[1]?.split("&")[0] ?? "";
			if (!id) continue;
			hits.push({
				id,
				title: String(it["title"] ?? "Untitled"),
				author: String(it["uploaderName"] ?? ""),
				duration: num(it["duration"]),
				views: num(it["views"]),
				thumb: ytThumb(id)
			});
		}
		if (hits.length) return hits.slice(0, 30);
	}
	return [];
}
async function invidiousSearch(q, music) {
	const query = music ? `${q} official audio` : q;
	for (const base of INVIDIOUS) {
		const json = await fetchJson(`${base}/api/v1/search?q=${encodeURIComponent(query)}&type=video`);
		if (!Array.isArray(json) || json.length === 0) continue;
		const hits = [];
		for (const it of json) {
			const id = typeof it["videoId"] === "string" ? it["videoId"] : "";
			if (!id) continue;
			hits.push({
				id,
				title: String(it["title"] ?? "Untitled"),
				author: String(it["author"] ?? ""),
				duration: num(it["lengthSeconds"]),
				views: num(it["viewCount"]),
				thumb: ytThumb(id)
			});
		}
		if (hits.length) return hits.slice(0, 30);
	}
	return [];
}
async function runVideoSearch(q, music) {
	const piped = await pipedSearch(q, music);
	if (piped.length) return {
		hits: piped,
		degraded: false
	};
	const inv = await invidiousSearch(q, music);
	return {
		hits: inv,
		degraded: inv.length === 0
	};
}
var CINEMETA = "https://v3-cinemeta.strem.io";
var toMovie = (m) => {
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
		runtime: m.runtime ?? null
	};
};
async function searchMetas(term) {
	return (await fetchJson(`${CINEMETA}/catalog/movie/top/search=${encodeURIComponent(term)}.json`, 8e3))?.metas ?? [];
}
/** Free-text movie search. */
async function runMovieSearch(q) {
	const out = [];
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
async function runRegionalShelf(lang) {
	const shelf = REGIONAL_SHELVES.find((s) => s.lang === lang) ?? REGIONAL_SHELVES[0];
	return Promise.all(shelf.films.map(async (seed) => {
		const metas = await searchMetas(seed.title);
		const wanted = seed.title.toLowerCase();
		const best = metas.find((m) => (m.name ?? "").toLowerCase() === wanted && String(m.year ?? m.releaseInfo ?? "").startsWith(seed.year)) ?? metas.find((m) => (m.name ?? "").toLowerCase() === wanted) ?? metas[0];
		return (best ? toMovie(best) : null) ?? {
			id: `seed-${seed.title.toLowerCase().replace(/\s+/g, "-")}`,
			title: seed.title,
			year: seed.year,
			poster: null,
			rating: null,
			genres: [],
			description: "",
			cast: [],
			runtime: null
		};
	}));
}
async function runMovieDetail(id) {
	if (!/^tt\d+$/.test(id)) return null;
	const json = await fetchJson(`${CINEMETA}/meta/movie/${id}.json`);
	return json?.meta ? toMovie(json.meta) : null;
}
//#endregion
export { runMovieDetail, runMovieSearch, runRegionalShelf, runVideoSearch };
