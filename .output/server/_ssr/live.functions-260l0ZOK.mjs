import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { a as objectType, i as numberType, r as enumType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live.functions-260l0ZOK.js
var WEATHER_CODES = {
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
	99: "Severe thunderstorm"
};
/** Top tech/world stories from the keyless Hacker News search API. */
var getNews_createServerFn_handler = createServerRpc({
	id: "72e59b5dc7bf00dfc5823aeee2f889360ad616f3e6b2fd6b66db8f4644e649e5",
	name: "getNews",
	filename: "src/lib/live.functions.ts"
}, (opts) => getNews.__executeServer(opts));
var getNews = createServerFn({ method: "GET" }).handler(getNews_createServerFn_handler, async () => {
	try {
		const res = await fetch("https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=18");
		if (!res.ok) return [];
		return ((await res.json()).hits ?? []).filter((h) => h.title).map((h) => {
			const url = h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`;
			let source = "news.ycombinator.com";
			try {
				source = new URL(url).hostname.replace(/^www\./, "");
			} catch {}
			return {
				id: h.objectID,
				title: h.title,
				url,
				source,
				points: h.points ?? 0,
				comments: h.num_comments ?? 0
			};
		});
	} catch {
		return [];
	}
});
var getWeather_createServerFn_handler = createServerRpc({
	id: "0a990cae3c31c623a6ac6158c5f89b0d405f39c2be8225325c35b59a6c71a99e",
	name: "getWeather",
	filename: "src/lib/live.functions.ts"
}, (opts) => getWeather.__executeServer(opts));
var getWeather = createServerFn({ method: "GET" }).validator((data) => objectType({ place: stringType().trim().min(1).max(60) }).parse(data)).handler(getWeather_createServerFn_handler, async ({ data }) => {
	try {
		const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(data.place)}&count=1&language=en&format=json`);
		if (!geoRes.ok) return null;
		const hit = (await geoRes.json()).results?.[0];
		if (!hit) return null;
		const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${hit.latitude}&longitude=${hit.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`);
		if (!res.ok) return null;
		const w = await res.json();
		if (!w.current) return null;
		const days = (w.daily?.time ?? []).slice(1, 5).map((date, i) => ({
			date,
			maxC: Math.round(w.daily?.temperature_2m_max[i + 1] ?? 0),
			minC: Math.round(w.daily?.temperature_2m_min[i + 1] ?? 0),
			code: w.daily?.weather_code[i + 1] ?? 0
		}));
		return {
			place: hit.country ? `${hit.name}, ${hit.country}` : hit.name,
			tempC: Math.round(w.current.temperature_2m),
			feelsC: Math.round(w.current.apparent_temperature),
			humidity: Math.round(w.current.relative_humidity_2m),
			windKph: Math.round(w.current.wind_speed_10m),
			code: w.current.weather_code,
			summary: WEATHER_CODES[w.current.weather_code] ?? "Current conditions",
			days
		};
	} catch {
		return null;
	}
});
var INDEX_SYMBOLS = [["^NSEI", "NIFTY 50"], ["^BSESN", "SENSEX"]];
/** Liquid large caps used to derive real gainers/losers without Yahoo's authed screener. */
var WATCHLIST = [
	["RELIANCE.NS", "Reliance"],
	["TCS.NS", "TCS"],
	["HDFCBANK.NS", "HDFC Bank"],
	["ICICIBANK.NS", "ICICI Bank"],
	["INFY.NS", "Infosys"],
	["SBIN.NS", "SBI"],
	["BHARTIARTL.NS", "Bharti Airtel"],
	["LT.NS", "Larsen & Toubro"],
	["ITC.NS", "ITC"],
	["AXISBANK.NS", "Axis Bank"]
];
async function yahooQuote(symbol) {
	const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`, { headers: {
		accept: "application/json",
		"user-agent": "Mozilla/5.0 SlashAI"
	} });
	if (!res.ok) return null;
	const meta = (await res.json()).chart?.result?.[0]?.meta;
	if (!meta || typeof meta.regularMarketPrice !== "number") return null;
	return {
		symbol,
		price: meta.regularMarketPrice,
		prev: meta.chartPreviousClose ?? meta.regularMarketPrice
	};
}
/** NIFTY 50 + SENSEX levels and real large-cap movers from Yahoo Finance (keyless). */
var getStocks_createServerFn_handler = createServerRpc({
	id: "903e952a32b77fda772c5dd4b46cf99f1c2249ec5aab61d34a15c2614f221803",
	name: "getStocks",
	filename: "src/lib/live.functions.ts"
}, (opts) => getStocks.__executeServer(opts));
var getStocks = createServerFn({ method: "GET" }).handler(getStocks_createServerFn_handler, async () => {
	try {
		const symbols = [...INDEX_SYMBOLS, ...WATCHLIST].map(([s]) => s);
		const quotes = await Promise.all(symbols.map((s) => yahooQuote(s)));
		const bySymbol = new Map(quotes.filter((q) => q !== null).map((q) => [q.symbol, q]));
		const indices = [];
		for (const [symbol, name] of INDEX_SYMBOLS) {
			const q = bySymbol.get(symbol);
			if (!q || q.prev === 0) continue;
			indices.push({
				symbol,
				name,
				value: q.price,
				previousClose: q.prev,
				changePct: (q.price - q.prev) / q.prev * 100
			});
		}
		const movers = WATCHLIST.filter(([s]) => bySymbol.has(s)).map(([s, name]) => {
			const q = bySymbol.get(s);
			return {
				symbol: s,
				name,
				price: q.price,
				changePct: q.prev ? (q.price - q.prev) / q.prev * 100 : 0
			};
		}).sort((a, b) => b.changePct - a.changePct);
		if (indices.length === 0 && movers.length === 0) return null;
		return {
			indices,
			movers,
			fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
	} catch {
		return null;
	}
});
var getCrypto_createServerFn_handler = createServerRpc({
	id: "33e7fc2a150c04f07e3eafcde029e94b700f7e9a2703453a64e311427a38e093",
	name: "getCrypto",
	filename: "src/lib/live.functions.ts"
}, (opts) => getCrypto.__executeServer(opts));
var getCrypto = createServerFn({ method: "GET" }).handler(getCrypto_createServerFn_handler, async () => {
	try {
		const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=inr,usd&include_24hr_change=true");
		if (!res.ok) return [];
		const json = await res.json();
		return Object.entries(json).filter(([, v]) => typeof v.inr === "number").map(([id, v]) => ({
			id,
			inr: v.inr,
			usd: v.usd ?? 0,
			change24h: v.inr_24h_change ?? v.usd_24h_change ?? 0
		}));
	} catch {
		return [];
	}
});
var COMMODITY_TICKERS = [
	[
		"GC=F",
		"Gold",
		"$ / oz"
	],
	[
		"SI=F",
		"Silver",
		"$ / oz"
	],
	[
		"CL=F",
		"Crude Oil (WTI)",
		"$ / bbl"
	],
	[
		"NG=F",
		"Natural Gas",
		"$ / MMBtu"
	],
	[
		"HG=F",
		"Copper",
		"$ / lb"
	],
	[
		"PL=F",
		"Platinum",
		"$ / oz"
	]
];
/** Gold, silver, crude oil, natural gas, copper, platinum from Yahoo Finance (keyless). */
var getCommodities_createServerFn_handler = createServerRpc({
	id: "a7bff83ff8d3cbe7497bbfc6cba6cfd56d987f9a471cc201fef3fc07467065f8",
	name: "getCommodities",
	filename: "src/lib/live.functions.ts"
}, (opts) => getCommodities.__executeServer(opts));
var getCommodities = createServerFn({ method: "GET" }).handler(getCommodities_createServerFn_handler, async () => {
	try {
		return (await Promise.all(COMMODITY_TICKERS.map(([sym]) => yahooQuote(sym)))).filter((q) => q !== null).map((q) => {
			const def = COMMODITY_TICKERS.find(([s]) => s === q.symbol);
			return {
				name: def[1],
				symbol: q.symbol,
				price: q.price,
				prev: q.prev,
				unit: def[2]
			};
		});
	} catch {
		return [];
	}
});
var getForex_createServerFn_handler = createServerRpc({
	id: "1bc887bfa1ab3d839f45c5ca60023f6c34dadc9c420bf54dd442702af13d53d7",
	name: "getForex",
	filename: "src/lib/live.functions.ts"
}, (opts) => getForex.__executeServer(opts));
var getForex = createServerFn({ method: "GET" }).handler(getForex_createServerFn_handler, async () => {
	try {
		const res = await fetch("https://open.er-api.com/v6/latest/USD");
		if (!res.ok) return [];
		const rates = (await res.json()).rates;
		if (!rates) return [];
		const inr = rates["INR"];
		if (!inr) return [];
		const cross = (code) => {
			const v = rates[code];
			return v ? inr / v : NaN;
		};
		return [
			[
				"USD → INR",
				"🇺🇸",
				inr
			],
			[
				"EUR → INR",
				"🇪🇺",
				cross("EUR")
			],
			[
				"GBP → INR",
				"🇬🇧",
				cross("GBP")
			],
			[
				"AED → INR",
				"🇦🇪",
				cross("AED")
			],
			[
				"SAR → INR",
				"🇸🇦",
				cross("SAR")
			]
		].filter(([, , rate]) => Number.isFinite(rate)).map(([pair, flag, rate]) => ({
			pair,
			flag,
			rate
		}));
	} catch {
		return [];
	}
});
var INDIA_FEEDS = {
	india: {
		url: "https://feeds.feedburner.com/ndtvnews-india-news",
		label: "NDTV"
	},
	business: {
		url: "https://feeds.feedburner.com/ndtvprofit-latest",
		label: "NDTV Profit"
	},
	tech: {
		url: "https://feeds.feedburner.com/gadgets360-latest",
		label: "Gadgets360"
	},
	sports: {
		url: "https://feeds.feedburner.com/ndtvnews-sports-news",
		label: "NDTV Sports"
	}
};
/** Top India headlines via rss2json over public NDTV/Gadgets360 feeds (no key). */
var getIndiaNews_createServerFn_handler = createServerRpc({
	id: "2fc7204499561c00291c4f98a87cadbc4773e92064af74d3a8f5e5acf1183727",
	name: "getIndiaNews",
	filename: "src/lib/live.functions.ts"
}, (opts) => getIndiaNews.__executeServer(opts));
var getIndiaNews = createServerFn({ method: "GET" }).validator((data) => objectType({ category: enumType([
	"india",
	"business",
	"tech",
	"sports"
]) }).parse(data)).handler(getIndiaNews_createServerFn_handler, async ({ data }) => {
	try {
		const feed = INDIA_FEEDS[data.category] ?? INDIA_FEEDS["india"];
		const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
		if (!res.ok) return [];
		const json = await res.json();
		if (json.status !== "ok") return [];
		return (json.items ?? []).slice(0, 8).map((item, i) => ({
			id: item.guid ?? `${data.category}-${i}-${item.link}`,
			title: item.title,
			url: item.link,
			source: feed.label,
			published: item.pubDate ?? "",
			thumbnail: item.thumbnail ?? item.enclosure?.link ?? item.description?.match(/<img[^>]+src="([^"]+)"/)?.[1] ?? null
		}));
	} catch {
		return [];
	}
});
var PRAYER_ORDER = [
	"Fajr",
	"Dhuhr",
	"Asr",
	"Maghrib",
	"Isha"
];
/** Prayer times + Hijri date from Aladhan (completely free, no key). */
var getPrayerTimes_createServerFn_handler = createServerRpc({
	id: "4a3c30f789c20a5174b92a6dfb336042fee950f4efe411d18c4d1b4fb5fbff8e",
	name: "getPrayerTimes",
	filename: "src/lib/live.functions.ts"
}, (opts) => getPrayerTimes.__executeServer(opts));
var getPrayerTimes = createServerFn({ method: "GET" }).validator((data) => objectType({
	city: stringType().trim().min(1).max(60),
	country: stringType().trim().min(1).max(60)
}).parse(data)).handler(getPrayerTimes_createServerFn_handler, async ({ data }) => {
	try {
		const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(data.city)}&country=${encodeURIComponent(data.country)}&method=1`);
		if (!res.ok) return null;
		const d = (await res.json()).data;
		if (!d?.timings) return null;
		const clean = (t) => (t ?? "").split(" ")[0] ?? "";
		const timings = PRAYER_ORDER.map((name) => ({
			name,
			time: clean(d.timings?.[name])
		})).filter((x) => /^\d{1,2}:\d{2}$/.test(x.time));
		if (timings.length < 5) return null;
		const h = d.date?.hijri;
		return {
			city: data.city,
			timings,
			hijri: h?.day && h.month?.en && h.year ? `${h.day} ${h.month.en} ${h.year} AH` : "",
			gregorian: d.date?.gregorian?.date ?? "",
			tomorrowFajr: null
		};
	} catch {
		return null;
	}
});
function aqiCategory(aqi) {
	if (aqi <= 50) return "Good";
	if (aqi <= 100) return "Moderate";
	if (aqi <= 150) return "Unhealthy (sensitive)";
	if (aqi <= 200) return "Unhealthy";
	if (aqi <= 300) return "Very Unhealthy";
	return "Hazardous";
}
var getAirQuality_createServerFn_handler = createServerRpc({
	id: "b2add670000f93d5d2bc2e8fe0d8c843e00ccb367ed0b40f8b516602d0a1f415",
	name: "getAirQuality",
	filename: "src/lib/live.functions.ts"
}, (opts) => getAirQuality.__executeServer(opts));
var getAirQuality = createServerFn({ method: "GET" }).validator((data) => objectType({ place: stringType().trim().min(1).max(60) }).parse(data)).handler(getAirQuality_createServerFn_handler, async ({ data }) => {
	try {
		const hit = (await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(data.place)}&count=1&language=en&format=json`)).json()).results?.[0];
		if (!hit) return null;
		const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${hit.latitude}&longitude=${hit.longitude}&current=pm10,pm2_5,us_aqi&timezone=auto`);
		if (!res.ok) return null;
		const cur = (await res.json()).current;
		if (!cur) return null;
		const aqi = typeof cur.us_aqi === "number" ? Math.round(cur.us_aqi) : null;
		return {
			place: hit.country ? `${hit.name}, ${hit.country}` : hit.name,
			aqi,
			category: aqi === null ? "Unknown" : aqiCategory(aqi),
			pm25: cur.pm2_5 ?? null,
			pm10: cur.pm10 ?? null
		};
	} catch {
		return null;
	}
});
var getSpace_createServerFn_handler = createServerRpc({
	id: "da3275b77468df0d891e0789b43199ecfb404e1995c92bfc6d65d25c232e3fd9",
	name: "getSpace",
	filename: "src/lib/live.functions.ts"
}, (opts) => getSpace.__executeServer(opts));
var getSpace = createServerFn({ method: "GET" }).handler(getSpace_createServerFn_handler, async () => {
	const out = {
		apod: null,
		iss: null
	};
	const [apodRes, issRes] = await Promise.allSettled([fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&thumbs=true"), fetch("https://api.wheretheiss.at/v1/satellites/25544")]);
	if (apodRes.status === "fulfilled" && apodRes.value.ok) try {
		const j = await apodRes.value.json();
		if (j.title && j.explanation) out.apod = {
			title: j.title,
			explanation: j.explanation,
			imageUrl: (j.media_type === "image" ? j.url : j.thumbnail_url) ?? "",
			date: j.date ?? ""
		};
	} catch {}
	if (issRes.status === "fulfilled" && issRes.value.ok) try {
		const j = await issRes.value.json();
		if (typeof j.latitude === "number" && typeof j.longitude === "number") out.iss = {
			latitude: j.latitude,
			longitude: j.longitude,
			altitudeKm: Math.round(j.altitude ?? 0),
			velocityKph: Math.round(j.velocity ?? 0)
		};
	} catch {}
	return out;
});
var getMatches_createServerFn_handler = createServerRpc({
	id: "3de91ee12c38e61e20c22a8fa890a5614a376b695ca6cc2d1d111285b08c7284",
	name: "getMatches",
	filename: "src/lib/live.functions.ts"
}, (opts) => getMatches.__executeServer(opts));
var getMatches = createServerFn({ method: "GET" }).validator((data) => objectType({
	sport: enumType(["Soccer", "Cricket"]),
	offsetDays: numberType().min(-3).max(3)
}).parse(data)).handler(getMatches_createServerFn_handler, async ({ data }) => {
	try {
		const day = new Date(Date.now() + data.offsetDays * 864e5).toISOString().slice(0, 10);
		const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${day}&s=${data.sport}`);
		if (!res.ok) return [];
		return ((await res.json()).events ?? []).slice(0, 24).map((e) => ({
			id: e.idEvent,
			event: e.strEvent ?? "Match",
			league: e.strLeague ?? "",
			time: e.strTimestamp ?? "",
			home: e.strHomeTeam ?? "",
			away: e.strAwayTeam ?? "",
			homeScore: e.intHomeScore ?? null,
			awayScore: e.intAwayScore ?? null,
			status: e.strStatus && e.strStatus !== "NS" ? e.strStatus : "Scheduled",
			badge: e.strLeagueBadge ?? null
		}));
	} catch {
		return [];
	}
});
//#endregion
export { getAirQuality_createServerFn_handler, getCommodities_createServerFn_handler, getCrypto_createServerFn_handler, getForex_createServerFn_handler, getIndiaNews_createServerFn_handler, getMatches_createServerFn_handler, getNews_createServerFn_handler, getPrayerTimes_createServerFn_handler, getSpace_createServerFn_handler, getStocks_createServerFn_handler, getWeather_createServerFn_handler };
