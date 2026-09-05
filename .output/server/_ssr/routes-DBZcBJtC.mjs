import { o as __toESM } from "../_runtime.mjs";
import { t as GENERATORS } from "./generators-BQMEiZJM.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as interactionCount, I as useLibrary, M as todayKey, N as toolOfTheDay, O as resolveCommands, P as topPersonalCommands, T as onIntelligenceChange, b as getDailyCommand, h as cn, m as VERIFIED_TOTAL, n as Button, r as CATEGORY_ICONS, x as getRandomCommand, y as getCommand } from "./slashkits-CB7bx4DD.mjs";
import { r as GLOSSARY_TOTAL } from "./glossary-CH5u11uF.mjs";
import { t as ALL_ROADMAPS } from "./roadmaps-JDCJRZid.mjs";
import { c as RESOURCE_TOTAL, d as dropItems, n as DROPS } from "./resources-sbNg_EgT.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { An as CalendarDays, E as Sparkles, En as Check, In as BookOpen, L as Search, Qt as Flame, T as Star, Un as ArrowRight, _t as Map, dn as Copy, it as NotebookPen, j as Shuffle, n as Zap, q as RefreshCw, qn as Activity, rt as Package, x as Terminal, zt as History } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as ResourceGrid } from "./ResourceCard-GrkmTIKp.mjs";
import { t as categoryIcon } from "./icons-BxDbBHfu.mjs";
import { t as useCommandActions } from "./use-command-actions-VhrigLFg.mjs";
import { a as recommendedCommands, n as INTERESTS, t as COLLECTIONS } from "./collections-OIdjX1d6.mjs";
import { t as PERSONAS } from "./personas-DBrTON6n.mjs";
import { t as VoiceSearchButton } from "./VoiceSearchButton-BhC7OFz4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DBZcBJtC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getCache(key, ttlMs) {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;
		const { data, ts } = JSON.parse(raw);
		if (Date.now() - ts > ttlMs) return null;
		return data;
	} catch {
		return null;
	}
}
function setCache(key, data) {
	try {
		localStorage.setItem(key, JSON.stringify({
			data,
			ts: Date.now()
		}));
	} catch {}
}
async function fetchStocks() {
	const cached = getCache("ticker-stocks", 6e4);
	if (cached) return cached;
	try {
		const res = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d&range=2d");
		if (!res.ok) return [];
		const meta = (await res.json()).chart?.result?.[0]?.meta;
		if (!meta) return [];
		const price = meta.regularMarketPrice;
		const prev = meta.previousClose;
		const pct = prev ? (price - prev) / prev * 100 : 0;
		const items = [{
			label: "NIFTY 50",
			value: price.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
			change: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
			color: pct >= 0 ? "#3fb950" : "#f85149"
		}];
		setCache("ticker-stocks", items);
		return items;
	} catch {
		return [];
	}
}
async function fetchSensex() {
	const cached = getCache("ticker-sensex", 6e4);
	if (cached) return cached;
	try {
		const res = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5ESENSEX?interval=1d&range=2d");
		if (!res.ok) return [];
		const meta = (await res.json()).chart?.result?.[0]?.meta;
		if (!meta) return [];
		const price = meta.regularMarketPrice;
		const prev = meta.previousClose;
		const pct = prev ? (price - prev) / prev * 100 : 0;
		const items = [{
			label: "SENSEX",
			value: price.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
			change: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
			color: pct >= 0 ? "#3fb950" : "#f85149"
		}];
		setCache("ticker-sensex", items);
		return items;
	} catch {
		return [];
	}
}
async function fetchCrypto() {
	const cached = getCache("ticker-crypto", 6e4);
	if (cached) return cached;
	try {
		const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr&include_24hr_change=true");
		if (!res.ok) return [];
		const json = await res.json();
		const items = [];
		if (json.bitcoin) {
			const pct = json.bitcoin.inr_24h_change ?? 0;
			items.push({
				label: "BTC",
				value: `₹${Math.round(json.bitcoin.inr).toLocaleString("en-IN")}`,
				change: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
				color: pct >= 0 ? "#3fb950" : "#f85149"
			});
		}
		if (json.ethereum) {
			const pct = json.ethereum.inr_24h_change ?? 0;
			items.push({
				label: "ETH",
				value: `₹${Math.round(json.ethereum.inr).toLocaleString("en-IN")}`,
				change: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
				color: pct >= 0 ? "#3fb950" : "#f85149"
			});
		}
		setCache("ticker-crypto", items);
		return items;
	} catch {
		return [];
	}
}
async function fetchForex() {
	const cached = getCache("ticker-forex", 3e5);
	if (cached) return cached;
	try {
		const res = await fetch("https://open.er-api.com/v6/latest/USD");
		if (!res.ok) return [];
		const rate = (await res.json()).rates?.INR;
		if (!rate) return [];
		const items = [{
			label: "USD/INR",
			value: rate.toFixed(2)
		}];
		setCache("ticker-forex", items);
		return items;
	} catch {
		return [];
	}
}
async function fetchPrayer() {
	const cached = getCache("ticker-prayer", 36e5);
	if (cached) return cached;
	try {
		const city = localStorage.getItem("slashai-prayer-city") || "Hyderabad";
		const country = localStorage.getItem("slashai-prayer-country") || "India";
		const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`);
		if (!res.ok) return [];
		const timings = (await res.json()).data?.timings;
		if (!timings) return [];
		const now = /* @__PURE__ */ new Date();
		for (const name of [
			"Fajr",
			"Sunrise",
			"Dhuhr",
			"Asr",
			"Maghrib",
			"Isha"
		]) {
			const time = timings[name];
			if (!time) continue;
			const parts = time.split(":").map(Number);
			const h = parts[0];
			const m = parts[1];
			if (h === void 0 || m === void 0) continue;
			const at = new Date(now);
			at.setHours(h, m, 0, 0);
			if (at > now) {
				const diff = at.getTime() - now.getTime();
				const hrs = Math.floor(diff / 36e5);
				const mins = Math.floor(diff % 36e5 / 6e4);
				const items = [{
					label: "Next Prayer",
					value: `${name} in ${hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`}`,
					color: "#d29922"
				}];
				setCache("ticker-prayer", items);
				return items;
			}
		}
		return [];
	} catch {
		return [];
	}
}
async function fetchWeather() {
	const cached = getCache("ticker-weather", 18e5);
	if (cached) return cached;
	try {
		const city = localStorage.getItem("slashai-weather-city") || "Hyderabad";
		const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
		if (!geoRes.ok) return [];
		const loc = (await geoRes.json()).results?.[0];
		if (!loc?.latitude || !loc?.longitude) return [];
		const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,weather_code`);
		if (!wRes.ok) return [];
		const wJson = await wRes.json();
		const temp = wJson.current?.temperature_2m;
		if (temp === void 0) return [];
		const items = [{
			label: "Weather",
			value: `${{
				0: "☀️",
				1: "🌤",
				2: "⛅",
				3: "☁️",
				45: "🌫",
				48: "🌫",
				51: "🌦",
				53: "🌧",
				55: "🌧",
				61: "🌧",
				63: "🌧",
				65: "🌧",
				71: "❄",
				73: "❄",
				75: "❄",
				80: "🌦",
				81: "🌧",
				82: "⛈",
				95: "⛈",
				96: "⛈",
				99: "⛈"
			}[wJson.current?.weather_code ?? 0] ?? "🌤"} ${city} ${Math.round(temp)}°C`
		}];
		setCache("ticker-weather", items);
		return items;
	} catch {
		return [];
	}
}
function LiveTicker() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function load() {
			const results = await Promise.allSettled([
				fetchStocks(),
				fetchSensex(),
				fetchCrypto(),
				fetchForex(),
				fetchPrayer(),
				fetchWeather()
			]);
			if (cancelled) return;
			const all = [];
			for (const r of results) if (r.status === "fulfilled" && r.value.length > 0) all.push(...r.value);
			setItems(all);
			setLoading(false);
		}
		load();
		const interval = setInterval(load, 6e4);
		return () => {
			cancelled = true;
			clearInterval(interval);
		};
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton-block h-9 w-full" });
	if (items.length === 0) return null;
	const allItems = [...items, ...items];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative overflow-hidden border-b border-border bg-surface",
		style: { height: 36 },
		onMouseEnter: (e) => {
			const track = e.currentTarget.querySelector("[data-ticker-track]");
			if (track) track.style.animationPlayState = "paused";
		},
		onMouseLeave: (e) => {
			const track = e.currentTarget.querySelector("[data-ticker-track]");
			if (track) track.style.animationPlayState = "running";
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ticker-track": true,
			className: "flex h-full items-center whitespace-nowrap",
			style: { animation: `ticker ${Math.max(allItems.length * 6, 40)}s linear infinite` },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mr-3 inline-flex items-center gap-1 px-3 text-[11px] font-semibold text-red-500",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-1.5 animate-pulse rounded-full bg-[#f85149]" }), "LIVE"]
			}), allItems.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2 px-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-muted-foreground",
						children: item.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[12px] font-semibold text-foreground",
						children: item.value
					}),
					item.change && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-medium",
						style: { color: item.color ?? "#8b949e" },
						children: item.change
					}),
					i < allItems.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2 text-border",
						children: "·"
					})
				]
			}, `${item.label}-${i}`))]
		})
	});
}
function DiscoverCard({ label, icon: Badge, command, onRefresh }) {
	const Icon = categoryIcon(CATEGORY_ICONS[command.category]);
	const { copyCommand } = useCommandActions();
	const { isFavorite, toggleFavorite } = useLibrary();
	const favorite = isFavorite(command.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "panel flex flex-col rounded-2xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-primary uppercase",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "size-3.5",
							"aria-hidden": true
						}),
						" ",
						label
					]
				}), onRefresh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					className: "ml-auto h-8 gap-1.5 text-xs",
					onClick: onRefresh,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), " Surprise me"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/c/$slug",
				params: { slug: command.id },
				className: "mt-3 flex items-start gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "size-5",
						"aria-hidden": true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate font-mono text-base font-semibold text-foreground",
						children: command.command
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-xs text-muted-foreground",
						children: command.category
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2.5 line-clamp-2 text-sm text-muted-foreground",
				children: command.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/c/$slug",
							params: { slug: command.id },
							children: "Open"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "gap-1.5",
						onClick: () => copyCommand(command),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), " Copy"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						"aria-pressed": favorite,
						"aria-label": favorite ? "Remove from favorites" : "Add to favorites",
						onClick: () => toggleFavorite(command.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-4", favorite && "fill-primary text-primary") })
					})
				]
			})
		]
	});
}
/** The calm, finite discovery pair: one deterministic daily pick + one reroll. */
function Discover() {
	const [daily, setDaily] = (0, import_react.useState)(() => getDailyCommand("2026-01-01"));
	const [random, setRandom] = (0, import_react.useState)(() => getDailyCommand("random-seed"));
	(0, import_react.useEffect)(() => {
		setDaily(getDailyCommand(todayKey()));
		setRandom(getRandomCommand());
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscoverCard, {
			label: "Command of the day",
			icon: CalendarDays,
			command: daily
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscoverCard, {
			label: "Random command",
			icon: Shuffle,
			command: random,
			onRefresh: () => setRandom(getRandomCommand(random.id))
		})]
	});
}
/**
* Three-slide, skippable first-run wizard. Everything it collects is optional
* and stored on-device; skipping leaves the app fully usable.
*/
function Onboarding({ onDone }) {
	const { settings, updateSettings } = useLibrary();
	const [step, setStep] = (0, import_react.useState)(0);
	const [persona, setPersona] = (0, import_react.useState)(settings.persona);
	const [interests, setInterests] = (0, import_react.useState)(settings.interests);
	const finish = (patch = {}) => {
		updateSettings({
			onboarded: true,
			persona,
			interests,
			...patch
		});
		onDone?.();
	};
	const skip = () => {
		updateSettings({ onboarded: true });
		onDone?.();
	};
	const toggleInterest = (id) => setInterests((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Welcome to SlashAI",
		className: "fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-lg flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, {
								className: "size-4",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-foreground",
							children: "SlashAI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: skip,
							className: "ml-auto min-h-10 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:text-foreground",
							children: "Skip"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex gap-1.5",
					"aria-hidden": true,
					children: [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-border") }, i))
				}),
				step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex flex-1 flex-col justify-center py-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-14 items-center justify-center rounded-2xl bg-accent text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								className: "size-7",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-5 text-3xl font-black tracking-tight text-foreground",
							children: "AI made simple. For everyone."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-base text-muted-foreground",
							children: [VERIFIED_TOTAL.toLocaleString(), " ready-to-use commands. Find yours in seconds, copy it, paste it into any AI."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							className: "mt-7 gap-2 self-start",
							onClick: () => setStep(1),
							children: ["Get started ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					]
				}),
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex-1 py-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-black tracking-tight text-foreground",
							children: "Who are you?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-muted-foreground",
							children: "Pick the closest one — it only shapes what we suggest first."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 grid grid-cols-2 gap-2",
							children: PERSONAS.map((p) => {
								const on = persona === p.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": on,
									onClick: () => setPersona(on ? "" : p.id),
									className: cn("flex min-h-16 items-center gap-2.5 rounded-xl border px-3 text-left transition-colors", on ? "border-primary bg-accent text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl",
										"aria-hidden": true,
										children: p.emoji
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 text-sm font-medium",
										children: p.label
									})]
								}, p.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "gap-2",
								onClick: () => setStep(2),
								children: ["Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setStep(0),
								children: "Back"
							})]
						})
					]
				}),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex-1 py-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-black tracking-tight text-foreground",
							children: "What do you use AI for?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-muted-foreground",
							children: "Choose as many as you like, or none at all."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 flex flex-wrap gap-2",
							children: INTERESTS.map((i) => {
								const on = interests.includes(i.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": on,
									onClick: () => toggleInterest(i.id),
									className: cn("flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors", on ? "border-primary bg-accent text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
									children: [on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										className: "size-3.5",
										"aria-hidden": true
									}), i.label]
								}, i.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "gap-2",
								onClick: () => finish(),
								children: ["Start exploring ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setStep(1),
								children: "Back"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-xs text-muted-foreground",
							children: "No account, no tracking — all of this stays on your device and can be changed any time from the Me tab."
						})
					]
				})
			]
		})
	});
}
var trending_tools_default = {
	updated: "2026-08-28",
	week: "2026-W35",
	items: [
		{
			"name": "Gemini Omni 1.1 Flash",
			"url": "https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-omni-1-1-flash/",
			"description": "294 points on Hacker News",
			"source": "HackerNews",
			"category": "AI Tools",
			"badge": "Free"
		},
		{
			"name": "Anthropic's best AI model struggles to attract users as chea",
			"url": "https://www.ft.com/content/5ee49718-c258-4f01-aa32-7e5b76ae5245",
			"description": "818 points on Hacker News",
			"source": "HackerNews",
			"category": "AI Tools",
			"badge": "Free"
		},
		{
			"name": "Show HN: OzBrain, a shared brain for knowledge between agent",
			"url": "https://ozbrain.com",
			"description": "92 points on Hacker News",
			"source": "HackerNews",
			"category": "AI Tools",
			"badge": "Free"
		},
		{
			"name": "GLM-5.3 (open-weight) beat Anthropic/OpenAI models – for 1/5",
			"url": "https://reinvently.co.uk/tools/ed-o-meter/",
			"description": "239 points on Hacker News",
			"source": "HackerNews",
			"category": "AI Tools",
			"badge": "Free"
		}
	]
};
var HERO_TOOL = toolOfTheDay();
function StatsBar() {
	const stats = [
		{
			number: VERIFIED_TOTAL.toLocaleString(),
			label: "COMMANDS",
			color: "var(--primary)",
			icon: Terminal
		},
		{
			number: RESOURCE_TOTAL.toLocaleString(),
			label: "RESOURCES",
			color: "var(--primary)",
			icon: Package
		},
		{
			number: GENERATORS.length.toLocaleString(),
			label: "GENERATORS",
			color: "#d29922",
			icon: Zap
		},
		{
			number: ALL_ROADMAPS.length.toLocaleString(),
			label: "ROADMAPS",
			color: "#3fb950",
			icon: Map
		},
		{
			number: GLOSSARY_TOTAL.toLocaleString(),
			label: "GLOSSARY",
			color: "#a78bfa",
			icon: BookOpen
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-6 rounded-[10px] border border-sidebar-border bg-surface px-3 py-3 sm:px-6 sm:py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-5 items-center gap-1 sm:flex sm:items-center sm:justify-between sm:gap-6",
			children: stats.map((stat, i) => {
				const Icon = stat.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 sm:gap-2.5 justify-center",
					children: [
						i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden sm:block h-[24px] w-px bg-surface-elevated" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-4 sm:size-[18px] shrink-0",
							style: { color: stat.color },
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[14px] sm:text-[22px] font-bold text-foreground leading-tight",
								style: { fontFamily: "var(--font-mono, monospace)" },
								children: stat.number
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[7px] sm:text-[10px] uppercase tracking-[0.04em] sm:tracking-[0.06em] text-muted-foreground leading-tight",
								children: stat.label
							})]
						})
					]
				}, stat.label);
			})
		})
	});
}
function YourWeekDigest() {
	const { streak, stats, favorites, journal } = useLibrary();
	const weekAgo = (0, import_react.useMemo)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setUTCDate(d.getUTCDate() - 7);
		return d.toISOString().slice(0, 10);
	}, []);
	const entriesThisWeek = journal.filter((e) => e.date >= weekAgo).length;
	const tiles = [
		{
			icon: Flame,
			label: "Streak",
			value: streak.count,
			to: "/journal"
		},
		{
			icon: Copy,
			label: "Copied",
			value: stats.copies,
			to: "/recent"
		},
		{
			icon: Star,
			label: "Saved",
			value: favorites.length,
			to: "/favorites"
		},
		{
			icon: NotebookPen,
			label: "Logs",
			value: entriesThisWeek,
			to: "/journal"
		}
	];
	const allZero = tiles.every((t) => t.value === 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel mt-6 rounded-2xl p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "flex items-center justify-between gap-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
					className: "size-3.5 text-primary",
					"aria-hidden": true
				}), " Your week"]
			})
		}), allZero ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 rounded-[10px] border border-border bg-surface p-5 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[32px]",
					children: "⚡"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[15px] font-semibold text-foreground",
					children: "Your stats appear here"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[13px] text-muted-foreground",
					children: "Copy a command to start your streak"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/search",
					className: "mt-3 inline-block rounded-[6px] border border-border bg-surface-elevated px-5 py-2 text-[13px] text-primary no-underline transition-colors hover:border-border",
					children: "Browse commands →"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 grid grid-cols-4 gap-2",
			children: tiles.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: t.to,
				className: "rounded-xl bg-surface-elevated p-2.5 text-center transition-colors hover:bg-accent",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, {
						className: "mx-auto size-4 text-primary",
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-lg font-black leading-none text-foreground",
						children: t.value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block truncate text-[11px] text-muted-foreground",
						children: t.label
					})
				]
			}, t.label))
		})]
	});
}
function Section({ title, hint, action, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-12 animate-fade-in-up sm:mt-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-[18px] w-[3px] shrink-0 rounded-[2px] bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "truncate text-lg font-semibold tracking-tight text-foreground",
						children: title
					}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-xs text-muted-foreground",
						children: hint
					})]
				})]
			}), action]
		}), children]
	});
}
function CommandRow({ commands }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "stagger-children grid gap-2 sm:grid-cols-2",
		children: commands.map((c) => {
			const Icon = categoryIcon(CATEGORY_ICONS[c.category]);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/c/$slug",
				params: { slug: c.id },
				className: "ripple-press flex min-h-14 items-center gap-3 rounded-xl border border-border bg-surface px-3 transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-4.5 shrink-0 text-primary",
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate font-mono text-sm text-foreground",
						children: c.command
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate text-xs text-muted-foreground",
						children: c.title
					})]
				})]
			}, c.id);
		})
	});
}
function MostUsedCommands() {
	const [count, setCount] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const update = () => setCount(interactionCount());
		update();
		return onIntelligenceChange(update);
	}, []);
	if (count < 10) return null;
	const commands = resolveCommands(topPersonalCommands(5), getCommand);
	if (commands.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "Your most used",
		hint: "Ranked from the commands you copy, open and save on this device.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/search",
			className: "flex items-center gap-1 text-sm font-medium text-primary hover:underline",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
				className: "size-4",
				"aria-hidden": true
			}), " Search"]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandRow, { commands })
	});
}
function HomePage() {
	const { hydrated, favorites, recents, settings } = useLibrary();
	const [heroQuery, setHeroQuery] = (0, import_react.useState)("");
	const recentCommands = (0, import_react.useMemo)(() => recents.slice(0, 4).map((id) => getCommand(id)).filter((c) => Boolean(c)), [recents]);
	const favoriteCommands = (0, import_react.useMemo)(() => favorites.slice(0, 4).map((id) => getCommand(id)).filter((c) => Boolean(c)), [favorites]);
	const forYou = (0, import_react.useMemo)(() => hydrated ? recommendedCommands(settings.interests, recents, favorites, 4) : [], [
		hydrated,
		settings.interests,
		recents,
		favorites
	]);
	const { streak } = useLibrary();
	const showOnboarding = hydrated && !settings.onboarded;
	const weeklyFinds = (0, import_react.useMemo)(() => {
		const weekly = DROPS.find((d) => d.cadence === "Weekly");
		return weekly ? dropItems(weekly).slice(0, 6) : [];
	}, []);
	const trendingTools = (0, import_react.useMemo)(() => {
		return (trending_tools_default.items || []).slice(0, 5);
	}, []);
	const trendingUpdated = trending_tools_default.updated || "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideHeaderSearch: true,
		title: "SlashAI",
		children: [
			showOnboarding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTicker, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden rounded-2xl bg-surface border border-sidebar-border p-4 pt-6 sm:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 overflow-hidden md:flex-row md:items-center md:justify-between md:gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.08)] px-2.5 py-1 text-[9px] sm:text-[11px] uppercase tracking-[0.05em] sm:tracking-[0.08em] text-primary",
								children: "YOUR AI COMMAND VAULT — FREE FOREVER"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-3 text-[26px] font-bold leading-[1.15] tracking-tight text-foreground sm:mt-4 sm:text-[36px]",
								children: [
									"Find the right AI command",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "in seconds"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-[13px] text-muted-foreground sm:mt-3 sm:text-[14px]",
								children: [
									VERIFIED_TOTAL.toLocaleString(),
									" commands · ",
									RESOURCE_TOTAL,
									" curated resources · Free forever"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-5 flex h-[48px] max-w-[460px] items-center gap-3 rounded-[8px] border border-sidebar-border bg-surface px-4 transition-colors focus-within:border-primary",
								onSubmit: (e) => {
									e.preventDefault();
									if (heroQuery.trim()) window.location.href = `/search?q=${encodeURIComponent(heroQuery.trim())}`;
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
										className: "size-[16px] shrink-0 text-muted-foreground",
										"aria-hidden": true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										name: "q",
										value: heroQuery,
										onChange: (e) => setHeroQuery(e.target.value),
										type: "text",
										placeholder: "Search commands, tools, topics...",
										className: "flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceSearchButton, {
										size: "sm",
										onResult: (t) => {
											setHeroQuery(t);
											window.location.href = `/search?q=${encodeURIComponent(t.trim())}`;
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-5 items-center rounded border border-border bg-surface-elevated px-1.5 font-mono text-[10px] text-muted-foreground",
										children: "⌘K"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [
									{
										emoji: "✍️",
										label: "Write something"
									},
									{
										emoji: "💻",
										label: "Code something"
									},
									{
										emoji: "🔍",
										label: "Do research"
									},
									{
										emoji: "💼",
										label: "Get work done"
									}
								].map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/search",
									search: { q: chip.label.toLowerCase() },
									className: "flex items-center gap-1.5 rounded-full border border-sidebar-border bg-surface px-3.5 py-1.5 text-[12px] text-muted-foreground transition-all duration-150 hover:border-[rgba(45,212,191,0.3)] hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: chip.emoji }), chip.label]
								}, chip.label))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-center",
							style: {
								width: "180px",
								height: "180px",
								background: "radial-gradient(circle at 30% 30%, rgba(45,212,191,0.3) 0%, rgba(88,166,255,0.15) 40%, rgba(45,212,191,0.05) 70%, transparent 100%)",
								border: "1px solid rgba(45,212,191,0.2)",
								borderRadius: "24px",
								transform: "rotate(15deg)",
								boxShadow: "0 0 60px rgba(45,212,191,0.15), inset 0 0 40px rgba(45,212,191,0.05)",
								animation: "float 4s ease-in-out infinite"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									fontSize: "64px",
									filter: "drop-shadow(0 0 20px #2dd4bf)"
								},
								children: "⚡"
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes float { 0%, 100% { transform: rotate(15deg) translateY(0px); } 50% { transform: rotate(15deg) translateY(-10px); } }` })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-2xl border border-sidebar-border bg-surface p-6 sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-center text-lg font-bold tracking-tight text-foreground sm:text-xl",
						children: "How SlashAI Works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-center text-[13px] text-muted-foreground",
						children: "Three steps. No sign-up. No uploads. 100% free."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3",
						children: [
							{
								step: "1",
								emoji: "🔍",
								title: "Search a command",
								desc: "Type what you want to do — write, code, design, plan — and find a copy-ready AI prompt in seconds.",
								color: "var(--primary)"
							},
							{
								step: "2",
								emoji: "📋",
								title: "Copy to clipboard",
								desc: "One click copies the perfect prompt. Edit it if you like, then paste it into ChatGPT, Claude, Gemini or any AI.",
								color: "#d29922"
							},
							{
								step: "3",
								emoji: "⚡",
								title: "Get results instantly",
								desc: "Get expert-level output every time. Save favorites, build streaks, and explore 5,600+ commands across 30+ categories.",
								color: "#3fb950"
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex size-14 items-center justify-center rounded-2xl text-2xl",
									style: {
										background: `${item.color}10`,
										border: `1px solid ${item.color}30`
									},
									children: item.emoji
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-3 inline-flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-muted-foreground border border-border bg-surface-elevated",
									children: item.step
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 text-[15px] font-semibold text-foreground",
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 max-w-[260px] text-[13px] leading-relaxed text-muted-foreground",
									children: item.desc
								})
							]
						}, item.step))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-8 overflow-hidden rounded-2xl border border-sidebar-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 p-6 sm:p-8 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-primary",
								children: "⭐ Tool of the day"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 text-xl font-bold text-foreground sm:text-2xl",
								children: HERO_TOOL.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-[14px] text-muted-foreground",
								children: HERO_TOOL.desc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-border bg-surface-elevated px-2.5 py-1 text-[11px] text-muted-foreground",
									children: "100% Free"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-border bg-surface-elevated px-2.5 py-1 text-[11px] text-muted-foreground",
									children: "Browser only"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: `/tools/${HERO_TOOL.slug}`,
								className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[13px] font-bold text-background transition-colors hover:bg-primary/90",
								children: ["Try it now ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "size-4",
									"aria-hidden": true
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:flex size-32 items-center justify-center rounded-2xl bg-surface-elevated text-6xl",
						children: HERO_TOOL.icon
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
					children: [
						{
							to: "/assistant",
							emoji: "🤖",
							title: "AI Assistant",
							desc: "Free-tier AI chat — no subscription"
						},
						{
							to: "/quiz",
							emoji: "🧠",
							title: "Daily Quiz",
							desc: "24 categories, fresh daily"
						},
						{
							to: "/live",
							emoji: "📡",
							title: "Live",
							desc: "Markets, prayer, cricket, weather"
						},
						{
							to: "/deals",
							emoji: "🛍️",
							title: "Deals",
							desc: "Live deals from Indian communities"
						},
						{
							to: "/generators",
							emoji: "⚡",
							title: "Generators",
							desc: `${GENERATORS.length} AI-powered tools`
						},
						{
							to: "/roadmaps",
							emoji: "🗺️",
							title: "Roadmaps",
							desc: `${ALL_ROADMAPS.length} step-by-step guides`
						},
						{
							to: "/glossary",
							emoji: "📖",
							title: "Glossary",
							desc: `${GLOSSARY_TOTAL} AI & startup terms`
						},
						{
							to: "/discover",
							emoji: "🧭",
							title: "Discover",
							desc: `${RESOURCE_TOTAL}+ free tools and APIs`
						}
					].map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: card.to,
						className: "group flex flex-col items-center justify-center rounded-[10px] border border-border bg-surface p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58] min-h-[120px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[26px]",
								children: card.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 block text-[13px] font-semibold text-foreground",
								children: card.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block max-w-full truncate text-[11px] text-muted-foreground",
								children: card.desc
							})
						]
					}, card.to))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "SlashKits",
				hint: "Free browser tools — nothing uploads, no account needed.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/tools",
					className: "flex items-center gap-1 text-sm font-medium text-primary hover:underline",
					children: ["See all tools ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
						className: "size-4",
						"aria-hidden": true
					})]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6",
					children: [
						{
							slug: "image-compress",
							icon: "🖼️",
							name: "Image Compressor",
							desc: "Reduce size in-browser"
						},
						{
							slug: "qr-code",
							icon: "📱",
							name: "QR Generator",
							desc: "URLs, WiFi, text"
						},
						{
							slug: "pomodoro",
							icon: "🍅",
							name: "Pomodoro Timer",
							desc: "25/5/15 focus"
						},
						{
							slug: "sip-calculator",
							icon: "💰",
							name: "SIP Calculator",
							desc: "Mutual fund returns"
						},
						{
							slug: "typing-test",
							icon: "⌨️",
							name: "Typing Test",
							desc: "WPM & accuracy"
						},
						{
							slug: "color-palette",
							icon: "🎨",
							name: "Color Palette",
							desc: "Generate palettes"
						}
					].map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: `/tools/${tool.slug}`,
						className: "group flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-3 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58] min-h-[110px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[26px]",
								children: tool.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1.5 block text-[12px] font-semibold text-foreground leading-tight",
								children: tool.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block max-w-full truncate text-[10px] text-muted-foreground leading-tight",
								children: tool.desc
							})
						]
					}, tool.slug))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Fun Time",
				hint: "Games, quizzes and creative tools — all free.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6",
					children: [
						{
							to: "/tools/meme",
							emoji: "😂",
							title: "Meme Maker",
							desc: "Create memes"
						},
						{
							to: "/quiz",
							emoji: "🧠",
							title: "Daily Quiz",
							desc: "24 categories"
						},
						{
							to: "/tools/dice",
							emoji: "🎲",
							title: "Dice Roller",
							desc: "D4–D100"
						},
						{
							to: "/tools/coin-flip",
							emoji: "🪙",
							title: "Coin Flip",
							desc: "Virtual flip"
						},
						{
							to: "/tools/sticker",
							emoji: "🎭",
							title: "Sticker Maker",
							desc: "WhatsApp stickers"
						},
						{
							to: "/tools/quiz-maker",
							emoji: "❓",
							title: "Quiz Builder",
							desc: "Create & share"
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: "group flex flex-col items-center rounded-xl border border-border bg-surface p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[32px]",
								children: item.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 block text-[13px] font-semibold text-foreground",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-[11px] text-muted-foreground",
								children: item.desc
							})
						]
					}, item.to))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-10 overflow-hidden rounded-2xl border border-sidebar-border bg-surface p-6 sm:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1.5 rounded-full border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-[#fbbf24]",
								children: "🎓 Free Learning"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 text-xl font-bold text-foreground",
								children: "Free courses & resources"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-[14px] text-muted-foreground",
								children: "Curated free courses from top platforms — no hidden fees, no credit card required."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3",
								children: [
									{
										emoji: "🎨",
										label: "Free Udemy Courses",
										to: "/hub/creators"
									},
									{
										emoji: "💻",
										label: "Free Dev Courses",
										to: "/hub/developers"
									},
									{
										emoji: "📈",
										label: "Free Business Courses",
										to: "/hub/professionals"
									},
									{
										emoji: "✍️",
										label: "Free Writing Tools",
										to: "/search?q=writing"
									},
									{
										emoji: "🔍",
										label: "5,600+ AI Commands",
										to: "/search"
									},
									{
										emoji: "📦",
										label: "319+ Free Resources",
										to: "/discover"
									}
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									className: "flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-[12px] font-medium text-foreground transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.emoji }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
								}, item.label))
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Command of the day",
				hint: "One fresh pick a day, plus a reroll whenever you want one.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Discover, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YourWeekDigest, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MostUsedCommands, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "This week's free finds",
				hint: trendingUpdated ? `Auto-updated ${trendingUpdated}` : "Hand-picked, with a last-checked date on every entry.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/whats-new",
					className: "flex items-center gap-1 text-sm font-medium text-primary hover:underline",
					children: ["All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
						className: "size-4",
						"aria-hidden": true
					})]
				}),
				children: trendingTools.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: trendingTools.map((tool, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: tool.url,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-sm font-bold text-primary",
								children: tool.name?.[0] || "?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-semibold text-foreground",
									children: tool.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-xs text-muted-foreground",
									children: tool.description
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 rounded border border-border bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground",
								children: tool.source
							})
						]
					}, i))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceGrid, { resources: weeklyFinds })
			}),
			recentCommands.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Continue where you left off",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/recent",
					className: "flex items-center gap-1 text-sm font-medium text-primary hover:underline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, {
						className: "size-4",
						"aria-hidden": true
					}), " All"]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandRow, { commands: recentCommands })
			}),
			favoriteCommands.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Your favorites",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/favorites",
					className: "flex items-center gap-1 text-sm font-medium text-primary hover:underline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
						className: "size-4",
						"aria-hidden": true
					}), " All"]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandRow, { commands: favoriteCommands })
			}),
			forYou.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "For you",
				hint: "Based on what you saved and opened on this device.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandRow, { commands: forYou })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Collections",
				hint: "Curated starting points — every collection is open to everyone.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/collections",
					className: "flex items-center gap-1 text-sm font-medium text-primary hover:underline",
					children: ["All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
						className: "size-4",
						"aria-hidden": true
					})]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2.5 overflow-x-auto pb-2 scrollbar-none",
					children: COLLECTIONS.slice(0, 6).map((c) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/collections/$id",
							params: { id: c.id },
							className: "flex shrink-0 flex-col items-center rounded-[12px] bg-surface p-4 text-center transition-all duration-150 hover:-translate-y-0.5 w-[150px] sm:w-auto",
							style: { border: `1px solid ${{
								"For Women": "rgba(244,114,182,0.4)",
								"For Men": "rgba(96,165,250,0.4)",
								"For Students": "rgba(251,191,36,0.4)",
								"For Creators": "rgba(251,146,60,0.4)",
								"For Professionals": "rgba(52,211,153,0.4)",
								"For Entrepreneurs": "rgba(167,139,250,0.4)"
							}[c.title] || "#21262d"}` },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[32px]",
									children: {
										"For Women": "👩",
										"For Men": "👨",
										"For Students": "🎓",
										"For Creators": "🎨",
										"For Professionals": "💼",
										"For Entrepreneurs": "🚀"
									}[c.title] || c.icon
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-2 block text-[13px] font-semibold text-foreground",
									children: c.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-0.5 block text-[11px] text-muted-foreground",
									children: [c.count, " commands"]
								})
							]
						}, c.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Hubs",
				hint: "Everything gathered for one kind of person.",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5",
					children: [
						{
							to: "/hub/students",
							emoji: "🎓",
							title: "Student Hub",
							desc: "Courses & tools"
						},
						{
							to: "/hub/developers",
							emoji: "💻",
							title: "Developer Hub",
							desc: "APIs & open-source"
						},
						{
							to: "/hub/creators",
							emoji: "🎨",
							title: "Creator Hub",
							desc: "Design & content"
						},
						{
							to: "/hub/professionals",
							emoji: "💼",
							title: "Professional Hub",
							desc: "Productivity"
						},
						{
							to: "/hub/islam",
							emoji: "☪",
							title: "Islam Hub",
							desc: "Quran, Hadith & learning"
						}
					].map((hub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: hub.to,
						className: "group flex items-center gap-3 rounded-[10px] border border-border bg-surface p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-[22px]",
								"aria-hidden": true,
								children: hub.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[13px] font-semibold text-foreground",
									children: hub.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[11px] text-muted-foreground truncate",
									children: hub.desc
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-1 group-hover:text-foreground",
								"aria-hidden": true
							})
						]
					}, hub.to))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/hub",
					className: "mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80",
					children: ["See all hubs ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
						className: "size-4",
						"aria-hidden": true
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "mt-14 border-t border-sidebar-border pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-6 sm:grid-cols-4",
					children: [
						{
							title: "Commands & Tools",
							links: [
								{
									label: "Commands",
									to: "/explore"
								},
								{
									label: "Generators",
									to: "/generators"
								},
								{
									label: "Roadmaps",
									to: "/roadmaps"
								},
								{
									label: "Glossary",
									to: "/glossary"
								},
								{
									label: "SlashKits",
									to: "/tools"
								}
							]
						},
						{
							title: "Discover & Live",
							links: [
								{
									label: "Discover",
									to: "/discover"
								},
								{
									label: "Live Dashboard",
									to: "/live"
								},
								{
									label: "Deals",
									to: "/deals"
								},
								{
									label: "What's New",
									to: "/whats-new"
								}
							]
						},
						{
							title: "Hubs & Collections",
							links: [
								{
									label: "All Hubs",
									to: "/hub"
								},
								{
									label: "Student Hub",
									to: "/hub/students"
								},
								{
									label: "Developer Hub",
									to: "/hub/developers"
								},
								{
									label: "Islam Hub",
									to: "/hub/islam"
								},
								{
									label: "Collections",
									to: "/collections"
								},
								{
									label: "Favorites",
									to: "/favorites"
								}
							]
						},
						{
							title: "Info",
							links: [
								{
									label: "About",
									to: "/about"
								},
								{
									label: "Changelog",
									to: "/changelog"
								},
								{
									label: "Journal",
									to: "/journal"
								},
								{
									label: "Settings",
									to: "/me"
								}
							]
						}
					].map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground",
						children: col.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: col.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							className: "text-[13px] text-muted-foreground transition-colors hover:text-foreground",
							children: link.label
						}) }, link.label))
					})] }, col.title))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col items-center justify-between gap-3 border-t border-sidebar-border py-5 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[12px] text-muted-foreground",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" SlashAI · Free forever · No account needed"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://github.com/wahmed178/slashAI",
						target: "_blank",
						rel: "noopener",
						"aria-label": "SlashAI on GitHub",
						className: "text-[18px] text-muted-foreground transition-colors hover:text-foreground",
						children: "🐙"
					})]
				})]
			})
		]
	});
}
//#endregion
export { HomePage as component };
