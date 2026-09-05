import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn, n as Button } from "./slashkits-CB7bx4DD.mjs";
import { Dn as ChartColumn, Hn as ArrowUpRight, J as Radio, Kn as ArrowDownRight, L as Search, Mt as Landmark, W as Rocket, an as Droplets, at as Newspaper, fn as Compass, g as Trophy, mn as Coins, q as RefreshCw, s as Wind, st as Moon, vn as CloudSun, z as Satellite } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, i as numberType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-DSyYfJsl.mjs";
import { t as feedback } from "./play-sound-4NQwUsQc.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-CIT1804v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Top tech/world stories from the keyless Hacker News search API. */
var getNews = createServerFn({ method: "GET" }).handler(createSsrRpc("72e59b5dc7bf00dfc5823aeee2f889360ad616f3e6b2fd6b66db8f4644e649e5"));
/** Current conditions + 4-day outlook from Open-Meteo (no API key required). */
var getWeather = createServerFn({ method: "GET" }).validator((data) => objectType({ place: stringType().trim().min(1).max(60) }).parse(data)).handler(createSsrRpc("0a990cae3c31c623a6ac6158c5f89b0d405f39c2be8225325c35b59a6c71a99e"));
/** NIFTY 50 + SENSEX levels and real large-cap movers from Yahoo Finance (keyless). */
var getStocks = createServerFn({ method: "GET" }).handler(createSsrRpc("903e952a32b77fda772c5dd4b46cf99f1c2249ec5aab61d34a15c2614f221803"));
/** BTC/ETH/SOL/BNB prices in ₹ and $ from CoinGecko (free, no key). */
var getCrypto = createServerFn({ method: "GET" }).handler(createSsrRpc("33e7fc2a150c04f07e3eafcde029e94b700f7e9a2703453a64e311427a38e093"));
/** Gold, silver, crude oil, natural gas, copper, platinum from Yahoo Finance (keyless). */
var getCommodities = createServerFn({ method: "GET" }).handler(createSsrRpc("a7bff83ff8d3cbe7497bbfc6cba6cfd56d987f9a471cc201fef3fc07467065f8"));
/** USD/EUR/GBP/AED/SAR → INR from open.er-api.com (completely free, no key). */
var getForex = createServerFn({ method: "GET" }).handler(createSsrRpc("1bc887bfa1ab3d839f45c5ca60023f6c34dadc9c420bf54dd442702af13d53d7"));
/** Top India headlines via rss2json over public NDTV/Gadgets360 feeds (no key). */
var getIndiaNews = createServerFn({ method: "GET" }).validator((data) => objectType({ category: enumType([
	"india",
	"business",
	"tech",
	"sports"
]) }).parse(data)).handler(createSsrRpc("2fc7204499561c00291c4f98a87cadbc4773e92064af74d3a8f5e5acf1183727"));
/** Prayer times + Hijri date from Aladhan (completely free, no key). */
var getPrayerTimes = createServerFn({ method: "GET" }).validator((data) => objectType({
	city: stringType().trim().min(1).max(60),
	country: stringType().trim().min(1).max(60)
}).parse(data)).handler(createSsrRpc("4a3c30f789c20a5174b92a6dfb336042fee950f4efe411d18c4d1b4fb5fbff8e"));
/** US AQI + particulates from Open-Meteo's air-quality API (same provider as weather). */
var getAirQuality = createServerFn({ method: "GET" }).validator((data) => objectType({ place: stringType().trim().min(1).max(60) }).parse(data)).handler(createSsrRpc("b2add670000f93d5d2bc2e8fe0d8c843e00ccb367ed0b40f8b516602d0a1f415"));
/** NASA Astronomy Picture of the Day + live ISS position (both free). */
var getSpace = createServerFn({ method: "GET" }).handler(createSsrRpc("da3275b77468df0d891e0789b43199ecfb404e1995c92bfc6d65d25c232e3fd9"));
/** Fixtures and scores for a sport on a given day from TheSportsDB's free tier. */
var getMatches = createServerFn({ method: "GET" }).validator((data) => objectType({
	sport: enumType(["Soccer", "Cricket"]),
	offsetDays: numberType().min(-3).max(3)
}).parse(data)).handler(createSsrRpc("3de91ee12c38e61e20c22a8fa890a5614a376b695ca6cc2d1d111285b08c7284"));
function Card({ title, icon: Icon, action, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("glass lift aurora overflow-hidden rounded-2xl p-5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-primary" }),
					" ",
					title
				]
			}), action]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children
		})]
	});
}
function Skeleton({ rows = 4 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-9 animate-pulse rounded-lg bg-surface-elevated" }, i))
	});
}
function RefreshButton({ spinning, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick: () => {
			feedback("tap");
			onClick();
		},
		className: "rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-4", spinning && "animate-spin") })
	});
}
function CityInput({ draft, setDraft, onSubmit, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			feedback("tap");
			onSubmit();
		},
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: draft,
			onChange: (e) => setDraft(e.target.value),
			"aria-label": "City",
			placeholder,
			className: "h-10 w-full rounded-xl border border-border bg-surface pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
		})]
	});
}
function WeatherCard() {
	const fetchWeather = useServerFn(getWeather);
	const [place, setPlace] = (0, import_react.useState)(() => localStorage.getItem("slashai-weather-city") || "Hyderabad");
	const [draft, setDraft] = (0, import_react.useState)(place);
	const { data, isFetching, refetch } = useQuery({
		queryKey: ["weather", place],
		queryFn: () => fetchWeather({ data: { place } }),
		staleTime: 6e5,
		refetchInterval: 6e5
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Weather",
		icon: CloudSun,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshButton, {
			label: "Refresh weather",
			spinning: isFetching,
			onClick: () => void refetch()
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityInput, {
			draft,
			setDraft,
			onSubmit: () => {
				const p = draft.trim() || "Hyderabad";
				setPlace(p);
				localStorage.setItem("slashai-weather-city", p);
			},
			placeholder: "Any city in the world"
		}), isFetching && !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { rows: 3 })
		}) : data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-foreground",
					children: data.place
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-end gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-5xl leading-none font-bold text-foreground",
						children: [data.tempC, "°"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "pb-1 text-sm text-muted-foreground",
						children: data.summary
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Feels ",
							data.feelsC,
							"°"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "size-3.5" }),
								" ",
								data.windKph,
								" km/h"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "size-3.5" }),
								" ",
								data.humidity,
								"%"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid grid-cols-4 gap-2",
					children: data.days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel rounded-xl px-2 py-2 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: new Date(d.date).toLocaleDateString(void 0, { weekday: "short" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm font-semibold text-foreground",
								children: [d.maxC, "°"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [d.minC, "°"]
							})
						]
					}, d.date))
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted-foreground",
			children: "Couldn't find that place — try another spelling."
		})]
	});
}
function parseTime(t) {
	const parts = t.split(":").map(Number);
	const h = parts[0] ?? NaN;
	const m = parts[1] ?? NaN;
	if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
	return [h, m];
}
function nextPrayer(rows, now) {
	for (const r of rows) {
		const hm = parseTime(r.time);
		if (!hm) continue;
		const at = new Date(now);
		at.setHours(hm[0], hm[1], 0, 0);
		if (at > now) return {
			name: r.name,
			time: r.time,
			at
		};
	}
	const fajr = rows[0];
	if (!fajr) return null;
	const hm = parseTime(fajr.time);
	if (!hm) return null;
	const at = new Date(now);
	at.setDate(at.getDate() + 1);
	at.setHours(hm[0], hm[1], 0, 0);
	return {
		name: "Fajr",
		time: fajr.time,
		at
	};
}
function PrayerCard() {
	const fetchPrayer = useServerFn(getPrayerTimes);
	const [city, setCity] = (0, import_react.useState)(() => localStorage.getItem("slashai-prayer-city") || "Hyderabad");
	const [country, setCountry] = (0, import_react.useState)(() => localStorage.getItem("slashai-prayer-country") || "India");
	const [draft, setDraft] = (0, import_react.useState)(city);
	const [locating, setLocating] = (0, import_react.useState)(false);
	const [, setTick] = (0, import_react.useState)(0);
	const todayKey = (0, import_react.useMemo)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), []);
	const { data, isFetching, refetch, isError } = useQuery({
		queryKey: [
			"prayer",
			city.toLowerCase(),
			country.toLowerCase(),
			todayKey
		],
		queryFn: () => fetchPrayer({ data: {
			city,
			country
		} }),
		staleTime: 432e5,
		retry: 1
	});
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setTick((x) => x + 1), 1e3);
		return () => clearInterval(t);
	}, []);
	const detectCity = () => {
		if (!navigator.geolocation) return;
		feedback("tap");
		setLocating(true);
		navigator.geolocation.getCurrentPosition(async (pos) => {
			try {
				const j = await (await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`)).json();
				const name = j.city || j.locality || j.principalSubdivision;
				if (name) savePlace(name, j.countryName || country);
			} catch {}
			setLocating(false);
		}, () => setLocating(false), { timeout: 8e3 });
	};
	const savePlace = (c, co) => {
		setCity(c);
		setCountry(co);
		setDraft(c);
		localStorage.setItem("slashai-prayer-city", c);
		localStorage.setItem("slashai-prayer-country", co);
	};
	const now = /* @__PURE__ */ new Date();
	const next = data?.timings ? nextPrayer(data.timings, now) : null;
	const countdown = next ? (() => {
		const diff = Math.max(0, Math.floor((next.at.getTime() - now.getTime()) / 1e3));
		return `${String(Math.floor(diff / 3600)).padStart(2, "0")}:${String(Math.floor(diff % 3600 / 60)).padStart(2, "0")}:${String(diff % 60).padStart(2, "0")}`;
	})() : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Prayer times",
		icon: Compass,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshButton, {
			label: "Refresh prayer times",
			spinning: isFetching,
			onClick: () => void refetch()
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0 flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityInput, {
					draft,
					setDraft,
					onSubmit: () => savePlace(draft.trim() || city, country),
					placeholder: `City (${country})`
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				type: "button",
				disabled: locating,
				onClick: detectCity,
				children: locating ? "Locating…" : "Locate me"
			})]
		}), !data && !isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { rows: 4 })
		}) : data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [
				next && countdown ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel mb-3 rounded-xl p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] tracking-wide text-muted-foreground uppercase",
							children: ["Next prayer · ", next.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-2xl font-bold text-primary tabular-nums",
							children: countdown
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: ["at ", next.time]
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: data.timings.map((t) => {
						const active = next?.name === t.name;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("flex items-center justify-between rounded-lg px-3 py-1.5 text-sm", active ? "bg-accent font-semibold text-foreground" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono tabular-nums text-foreground",
								children: t.time
							})]
						}, t.name);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between text-xs text-muted-foreground",
					children: [data.hijri && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["☪ ", data.hijri] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						city,
						", ",
						country
					] })]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted-foreground",
			children: "Couldn't find that city — check the spelling or tap “Locate me”."
		})]
	});
}
var AQI_TONE = {
	Good: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
	Moderate: "bg-yellow-500/15 text-yellow-400 border-yellow-500/40",
	"Unhealthy (sensitive)": "bg-orange-500/15 text-orange-400 border-orange-500/40",
	Unhealthy: "bg-red-500/15 text-red-400 border-red-500/40"
};
function AQICard() {
	const fetchAqi = useServerFn(getAirQuality);
	const [place, setPlace] = (0, import_react.useState)(() => localStorage.getItem("slashai-aqi-city") || "Hyderabad");
	const [draft, setDraft] = (0, import_react.useState)(place);
	const { data, isFetching, refetch } = useQuery({
		queryKey: ["aqi", place],
		queryFn: () => fetchAqi({ data: { place } }),
		staleTime: 9e5,
		refetchInterval: 9e5
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Air quality",
		icon: Wind,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshButton, {
			label: "Refresh air quality",
			spinning: isFetching,
			onClick: () => void refetch()
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityInput, {
			draft,
			setDraft,
			onSubmit: () => {
				const p = draft.trim() || "Hyderabad";
				setPlace(p);
				localStorage.setItem("slashai-aqi-city", p);
			},
			placeholder: "City for AQI"
		}), !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { rows: 2 })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-4xl leading-none font-bold text-foreground",
						children: data.aqi ?? "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("rounded-full border px-2.5 py-1 text-xs font-semibold", AQI_TONE[data.category] ?? "border-border bg-surface text-muted-foreground"),
						children: data.category
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: ["US AQI · ", data.place]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel rounded-xl px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "PM2.5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-foreground",
							children: data.pm25 !== null ? `${Math.round(data.pm25)} µg/m³` : "—"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel rounded-xl px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "PM10"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-foreground",
							children: data.pm10 !== null ? `${Math.round(data.pm10)} µg/m³` : "—"
						})]
					})]
				})
			]
		})]
	});
}
var NEWS_TABS = [
	{
		id: "india",
		label: "India"
	},
	{
		id: "business",
		label: "Business"
	},
	{
		id: "tech",
		label: "Tech"
	},
	{
		id: "sports",
		label: "Sports"
	}
];
function IndiaNewsCard() {
	const fetchNews = useServerFn(getIndiaNews);
	const [tab, setTab] = (0, import_react.useState)("india");
	const { data, isFetching, refetch } = useQuery({
		queryKey: ["india-news", tab],
		queryFn: () => fetchNews({ data: { category: tab } }),
		staleTime: 6e5,
		refetchInterval: 6e5
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "India news",
		icon: Newspaper,
		className: "lg:col-span-2",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshButton, {
			label: "Refresh India news",
			spinning: isFetching,
			onClick: () => void refetch()
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "-mt-1 mb-3 flex flex-wrap gap-1.5",
			children: NEWS_TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					feedback("tap");
					setTab(t.id);
				},
				className: cn("rounded-full px-3 py-1 text-xs transition-colors", tab === t.id ? "bg-accent font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"),
				children: t.label
			}, t.id))
		}), !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { rows: 6 }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Headlines are unavailable right now."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1.5",
			children: data.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: n.url,
				target: "_blank",
				rel: "noreferrer noopener",
				className: "panel lift flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:border-primary/50",
				children: [n.thumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: n.thumbnail,
					alt: "",
					loading: "lazy",
					className: "size-12 shrink-0 rounded-lg object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, {
						className: "size-5 text-primary",
						"aria-hidden": true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "line-clamp-2 block text-sm font-medium text-foreground",
						children: n.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-0.5 block text-xs text-muted-foreground",
						children: [n.source, n.published ? ` · ${new Date(n.published).toLocaleString(void 0, {
							hour: "2-digit",
							minute: "2-digit",
							day: "numeric",
							month: "short"
						})}` : ""]
					})]
				})]
			}) }, n.id))
		})]
	});
}
function HackerNewsCard() {
	const fetchNews = useServerFn(getNews);
	const { data, isFetching, refetch } = useQuery({
		queryKey: ["news"],
		queryFn: () => fetchNews(),
		staleTime: 3e5,
		refetchInterval: 6e5
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "World tech",
		icon: Radio,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshButton, {
			label: "Refresh stories",
			spinning: isFetching,
			onClick: () => void refetch()
		}),
		children: !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { rows: 6 }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Stories are unavailable right now."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1",
			children: data.slice(0, 10).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: n.url,
				target: "_blank",
				rel: "noreferrer noopener",
				className: "block rounded-lg px-2 py-2 transition-colors hover:bg-accent",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "line-clamp-2 text-sm font-medium text-foreground",
					children: n.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 text-xs text-muted-foreground",
					children: [
						n.source,
						" · ",
						n.points,
						" points · ",
						n.comments,
						" comments"
					]
				})]
			}) }, n.id))
		})
	});
}
/** 60 s refresh while NSE/BSE are open (Mon–Fri, 09:15–15:30 IST); off otherwise. */
function marketInterval() {
	const now = new Date(Date.now() + 198e5);
	const day = now.getUTCDay();
	const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
	if (day >= 1 && day <= 5 && mins >= 555 && mins <= 930) return 6e4;
	return false;
}
function ChangePct({ pct }) {
	const up = pct >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums", up ? "text-emerald-400" : "text-red-400"),
		children: [
			up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "size-4" }),
			up ? "+" : "",
			pct.toFixed(2),
			"%"
		]
	});
}
function StocksCard() {
	const fetchStocks = useServerFn(getStocks);
	const { data, isFetching, refetch } = useQuery({
		queryKey: ["stocks"],
		queryFn: () => fetchStocks(),
		staleTime: 55e3,
		refetchInterval: marketInterval,
		retry: 1
	});
	const gainers = data?.movers.filter((m) => m.changePct >= 0).slice(0, 5) ?? [];
	const losers = [...data?.movers ?? []].reverse().filter((m) => m.changePct < 0).slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Indian markets",
		icon: Landmark,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshButton, {
			label: "Refresh market data",
			spinning: isFetching,
			onClick: () => void refetch()
		}),
		children: !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { rows: 3 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2",
			children: data.indices.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel rounded-xl p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-wide text-muted-foreground uppercase",
						children: i.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl font-bold text-foreground tabular-nums",
						children: i.value.toLocaleString("en-IN", { maximumFractionDigits: 2 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangePct, { pct: i.changePct })
				]
			}, i.symbol))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid grid-cols-2 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-[11px] font-semibold tracking-wide text-emerald-400 uppercase",
				children: "Top gainers"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1",
				children: gainers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-foreground",
						children: m.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-2 shrink-0 font-medium text-emerald-400 tabular-nums",
						children: [
							"+",
							m.changePct.toFixed(2),
							"%"
						]
					})]
				}, m.symbol))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-[11px] font-semibold tracking-wide text-red-400 uppercase",
				children: "Top losers"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1",
				children: losers.length > 0 ? losers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-foreground",
						children: m.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-2 shrink-0 font-medium text-red-400 tabular-nums",
						children: [m.changePct.toFixed(2), "%"]
					})]
				}, m.symbol)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-xs text-muted-foreground",
					children: "All green today 🎉"
				})
			})] })]
		})] })
	});
}
var COIN_NAMES = {
	bitcoin: "Bitcoin",
	ethereum: "Ethereum",
	solana: "Solana",
	binancecoin: "BNB"
};
function CryptoCard() {
	const fetchCrypto = useServerFn(getCrypto);
	const { data, isFetching, refetch } = useQuery({
		queryKey: ["crypto"],
		queryFn: () => fetchCrypto(),
		staleTime: 55e3,
		refetchInterval: 6e4
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Crypto",
		icon: Coins,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshButton, {
			label: "Refresh crypto prices",
			spinning: isFetching,
			onClick: () => void refetch()
		}),
		children: !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { rows: 4 }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Prices are unavailable right now."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: data.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "panel flex items-center justify-between rounded-xl px-3 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-foreground",
					children: COIN_NAMES[c.id] ?? c.id
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground tabular-nums",
					children: [
						"₹",
						c.inr.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
						" · $",
						c.usd.toLocaleString("en-US", { maximumFractionDigits: 2 })
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangePct, { pct: c.change24h })]
			}, c.id))
		})
	});
}
function ForexCard() {
	const fetchForex = useServerFn(getForex);
	const { data, isFetching, refetch } = useQuery({
		queryKey: ["forex"],
		queryFn: () => fetchForex(),
		staleTime: 18e5,
		refetchInterval: 18e5
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Currency",
		icon: Coins,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshButton, {
			label: "Refresh exchange rates",
			spinning: isFetching,
			onClick: () => void refetch()
		}),
		children: !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { rows: 5 }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Rates are unavailable right now."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1.5",
			children: data.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "panel flex items-center justify-between rounded-xl px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2 text-sm text-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							children: f.flag
						}),
						" ",
						f.pair
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-sm font-semibold text-foreground tabular-nums",
					children: ["₹", f.rate.toFixed(2)]
				})]
			}, f.pair))
		})
	});
}
function CommoditiesCard() {
	const fetchCommodities = useServerFn(getCommodities);
	const { data, isFetching, refetch } = useQuery({
		queryKey: ["commodities"],
		queryFn: () => fetchCommodities(),
		staleTime: 3e5,
		refetchInterval: 3e5
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Commodities",
		icon: ChartColumn,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshButton, {
			label: "Refresh commodity prices",
			spinning: isFetching,
			onClick: () => void refetch()
		}),
		children: !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { rows: 5 }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Commodity prices are unavailable right now."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1.5",
			children: data.map((c) => {
				const change = c.price - c.prev;
				const pct = c.prev > 0 ? change / c.prev * 100 : 0;
				const up = change >= 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "panel flex items-center justify-between rounded-xl px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-medium text-foreground",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: c.unit
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block font-mono text-sm font-semibold text-foreground tabular-nums",
							children: ["$", c.price.toFixed(2)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `block text-[11px] font-medium tabular-nums ${up ? "text-green" : "text-red"}`,
							children: [
								up ? "+" : "",
								change.toFixed(2),
								" (",
								up ? "+" : "",
								pct.toFixed(1),
								"%)"
							]
						})]
					})]
				}, c.symbol);
			})
		})
	});
}
function MatchRow({ m }) {
	const live = /(1st|2nd|half|live|in play|innings)/i.test(m.status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "panel lift flex items-center gap-3 rounded-xl px-3 py-2.5",
		children: [
			m.badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: m.badge,
				alt: "",
				loading: "lazy",
				className: "size-8 shrink-0 rounded object-contain"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
				className: "size-8 shrink-0 p-1.5 text-primary",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-medium text-foreground",
					children: m.home && m.away ? `${m.home} vs ${m.away}` : m.event
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate text-xs text-muted-foreground",
					children: [m.league, m.time ? ` · ${new Date(m.time).toLocaleString(void 0, {
						hour: "2-digit",
						minute: "2-digit",
						day: "numeric",
						month: "short"
					})}` : ""]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 text-right",
				children: [m.homeScore !== null && m.awayScore !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-sm font-semibold text-foreground",
					children: [
						m.homeScore,
						" – ",
						m.awayScore
					]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("text-[11px]", live ? "font-semibold text-primary" : "text-muted-foreground"),
					children: [live && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-1 inline-block size-1.5 animate-pulse rounded-full bg-primary align-middle" }), m.status]
				})]
			})
		]
	});
}
function ScoresCard({ sport, title }) {
	const fetchMatches = useServerFn(getMatches);
	const [offset, setOffset] = (0, import_react.useState)(0);
	const { data, isFetching } = useQuery({
		queryKey: [
			"matches",
			sport,
			offset
		],
		queryFn: () => fetchMatches({ data: {
			sport,
			offsetDays: offset
		} }),
		staleTime: 6e4,
		refetchInterval: 6e4
	});
	const label = offset === 0 ? "Today" : offset === -1 ? "Yesterday" : "Tomorrow";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title,
		icon: Trophy,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-1",
			children: [
				-1,
				0,
				1
			].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					feedback("tap");
					setOffset(o);
				},
				className: cn("rounded-lg px-2 py-1 text-xs transition-colors", offset === o ? "bg-accent font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"),
				children: o === -1 ? "Yest" : o === 0 ? "Today" : "Tmrw"
			}, o))
		}),
		children: !data && isFetching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { rows: 5 }) : !data || data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [
				"No ",
				title.toLowerCase(),
				" listed for ",
				label.toLowerCase(),
				"."
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "max-h-96 space-y-2 overflow-y-auto pr-1",
			children: data.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchRow, { m }, m.id))
		})
	});
}
var MOON_PHASES = [
	[.03, "New Moon"],
	[.22, "Waxing Crescent"],
	[.28, "First Quarter"],
	[.47, "Waxing Gibbous"],
	[.53, "Full Moon"],
	[.72, "Waning Gibbous"],
	[.78, "Last Quarter"],
	[.97, "Waning Crescent"]
];
function moonInfo(date = /* @__PURE__ */ new Date()) {
	const synodic = 29.53058867;
	const knownNewMoon = Date.UTC(2e3, 0, 6, 18, 14);
	const age = ((date.getTime() - knownNewMoon) / 864e5 % synodic + synodic) % synodic;
	const fraction = age / synodic;
	const illum = Math.round((1 - Math.cos(2 * Math.PI * fraction)) / 2 * 100);
	let name = MOON_PHASES[MOON_PHASES.length - 1][1];
	for (const [limit, label] of MOON_PHASES) if (fraction <= limit) {
		name = label;
		break;
	}
	return {
		name,
		age,
		illum,
		emoji: name === "Full Moon" ? "🌕" : name === "New Moon" ? "🌑" : fraction < .5 ? "🌒" : "🌘"
	};
}
function MoonCard() {
	const info = (0, import_react.useMemo)(() => moonInfo(), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Moon tonight",
		icon: Moon,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-5xl",
				"aria-hidden": true,
				children: info.emoji
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base font-bold text-foreground",
				children: info.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: [
					"Day ",
					info.age.toFixed(1),
					" of the cycle · ",
					info.illum,
					"% illuminated"
				]
			})] })]
		})
	});
}
function IssCard() {
	const fetchSpace = useServerFn(getSpace);
	const { data, isFetching, refetch } = useQuery({
		queryKey: ["iss"],
		queryFn: () => fetchSpace(),
		select: (d) => d.iss,
		staleTime: 3e4,
		refetchInterval: 3e4
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "ISS tracker",
		icon: Satellite,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshButton, {
			label: "Refresh ISS position",
			spinning: isFetching,
			onClick: () => void refetch()
		}),
		children: !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { rows: 2 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "space-y-1.5 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Latitude"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-foreground tabular-nums",
						children: [data.latitude.toFixed(2), "°"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Longitude"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-foreground tabular-nums",
						children: [data.longitude.toFixed(2), "°"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Altitude"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-foreground tabular-nums",
						children: [data.altitudeKm.toLocaleString(), " km"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Speed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-foreground tabular-nums",
						children: [data.velocityKph.toLocaleString(), " km/h"]
					})]
				})
			]
		})
	});
}
function ApodCard() {
	const fetchSpace = useServerFn(getSpace);
	const { data, isFetching } = useQuery({
		queryKey: ["apod"],
		queryFn: () => fetchSpace(),
		select: (d) => d.apod,
		staleTime: 216e5
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "NASA picture of the day",
		icon: Rocket,
		className: "lg:col-span-2",
		action: isFetching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4 animate-spin text-muted-foreground" }) : void 0,
		children: !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { rows: 3 }) : !data.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Today's picture is unavailable (NASA's demo key has daily limits — it usually recovers within the hour)."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: data.imageUrl,
			target: "_blank",
			rel: "noreferrer noopener",
			className: "group block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: data.imageUrl,
					alt: data.title,
					loading: "lazy",
					className: "aspect-video w-full rounded-xl object-cover transition-opacity group-hover:opacity-90"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm font-bold text-foreground",
					children: data.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground",
					children: data.explanation
				})
			]
		})
	});
}
function LivePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		title: "Live",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-2xl font-bold text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-5 text-primary" }), " Live"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Markets, crypto, currency, India headlines, weather, air quality, prayer times and space — one calm dashboard, all from free public data. No account, no keys."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeatherCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrayerCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AQICard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndiaNewsCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HackerNewsCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StocksCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CryptoCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForexCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommoditiesCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoresCard, {
						sport: "Cricket",
						title: "Cricket"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoresCard, {
						sport: "Soccer",
						title: "Football"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApodCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoonCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssCard, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-muted-foreground",
				children: "Data: Yahoo Finance (markets), CoinGecko (crypto), open.er-api.com (currency), NDTV/Gadgets360 feeds via rss2json (India news), Open-Meteo (weather & air quality), Aladhan (prayer times), Hacker News, NASA APOD, WhereTheISS.at, TheSportsDB. Markets auto-refresh during NSE hours."
			})
		]
	});
}
//#endregion
export { LivePage as component };
