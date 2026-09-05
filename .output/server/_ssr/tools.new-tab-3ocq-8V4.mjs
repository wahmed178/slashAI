import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.new-tab-3ocq-8V4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_BOOKMARKS = [
	{
		icon: "🌐",
		name: "SlashAI",
		url: "https://slashai-nu.vercel.app"
	},
	{
		icon: "✉️",
		name: "Gmail",
		url: "https://mail.google.com"
	},
	{
		icon: "🎬",
		name: "YouTube",
		url: "https://youtube.com"
	},
	{
		icon: "💬",
		name: "WhatsApp",
		url: "https://web.whatsapp.com"
	},
	{
		icon: "🔍",
		name: "Google",
		url: "https://google.com"
	},
	{
		icon: "🐙",
		name: "GitHub",
		url: "https://github.com"
	}
];
function getGreeting(hour) {
	if (hour < 5) return "Working late 🌙";
	if (hour < 12) return "Good morning ☀️";
	if (hour < 18) return "Good afternoon ⛅";
	return "Good evening 🌙";
}
function NewTabScreen() {
	const [now, setNow] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [name, setName] = (0, import_react.useState)(() => localStorage.getItem("newtab-name") || "");
	const [search, setSearch] = (0, import_react.useState)("");
	const [editMode, setEditMode] = (0, import_react.useState)(false);
	const [bookmarks, setBookmarks] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("newtab-bookmarks") || "null") || DEFAULT_BOOKMARKS;
		} catch {
			return DEFAULT_BOOKMARKS;
		}
	});
	const [weather, setWeather] = (0, import_react.useState)(null);
	const [prayer, setPrayer] = (0, import_react.useState)(null);
	const [nifty, setNifty] = (0, import_react.useState)("");
	const [btc, setBtc] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		const cached = localStorage.getItem("newtab-weather");
		if (cached) try {
			setWeather(JSON.parse(cached));
		} catch {}
		fetch("https://api.open-meteo.com/v1/forecast?latitude=17.385&longitude=78.4867&current_weather=true").then((r) => r.json()).then((d) => {
			const w = d.current_weather;
			const item = {
				temp: `${Math.round(w.temperature)}°C`,
				icon: {
					0: "☀️",
					1: "🌤️",
					2: "⛅",
					3: "☁️",
					45: "🌫️",
					51: "🌦️",
					61: "🌧️",
					71: "❄️",
					80: "🌦️"
				}[w.weathercode] || "🌤️",
				city: "Hyderabad"
			};
			setWeather(item);
			localStorage.setItem("newtab-weather", JSON.stringify(item));
		}).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		const cached = localStorage.getItem("newtab-prayer");
		if (cached) try {
			setPrayer(JSON.parse(cached));
		} catch {}
		const now = /* @__PURE__ */ new Date();
		const dateStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
		fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=17.385&longitude=78.4867&method=2`).then((r) => r.json()).then((d) => {
			const t = d.data.timings;
			const prayers = [
				{
					name: "Fajr",
					time: t.Fajr
				},
				{
					name: "Dhuhr",
					time: t.Dhuhr
				},
				{
					name: "Asr",
					time: t.Asr
				},
				{
					name: "Maghrib",
					time: t.Maghrib
				},
				{
					name: "Isha",
					time: t.Isha
				}
			];
			const nowMin = now.getHours() * 60 + now.getMinutes();
			for (const p of prayers) {
				const [h, m] = p.time.split(":").map(Number);
				if (h * 60 + m > nowMin) {
					const diff = h * 60 + m - nowMin;
					const hrs = Math.floor(diff / 60);
					const mins = diff % 60;
					setPrayer({
						name: p.name,
						time: p.time,
						remaining: hrs > 0 ? `in ${hrs}h ${mins}m` : `in ${mins}m`
					});
					localStorage.setItem("newtab-prayer", JSON.stringify({
						name: p.name,
						time: p.time,
						remaining: hrs > 0 ? `in ${hrs}h ${mins}m` : `in ${mins}m`
					}));
					break;
				}
			}
		}).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d&range=1d").then((r) => r.json()).then((d) => {
			const price = d.chart?.result?.[0]?.meta?.regularMarketPrice;
			if (price) setNifty(`\u{1F1EE}\u{1F1F3} NIFTY ${Math.round(price).toLocaleString("en-IN")}`);
		}).catch(() => setNifty("🇮🇳 NIFTY —"));
		fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd").then((r) => r.json()).then((d) => {
			if (d.bitcoin?.usd) setBtc(`\u{26A1} BTC $${d.bitcoin.usd.toLocaleString()}`);
		}).catch(() => setBtc("⚡ BTC —"));
	}, []);
	const [showControls, setShowControls] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const show = () => {
			setShowControls(true);
		};
		const hide = setTimeout(() => setShowControls(false), 3e3);
		window.addEventListener("mousemove", show);
		window.addEventListener("touchstart", show);
		return () => {
			window.removeEventListener("mousemove", show);
			window.removeEventListener("touchstart", show);
			clearTimeout(hide);
		};
	}, [showControls]);
	const handleSearch = (e) => {
		e.preventDefault();
		if (!search) return;
		if (search.startsWith("/")) window.location.href = `https://slashai-nu.vercel.app/search?q=${encodeURIComponent(search)}`;
		else window.location.href = `https://www.google.com/search?q=${encodeURIComponent(search)}`;
	};
	const saveName = () => {
		localStorage.setItem("newtab-name", name);
	};
	const saveBookmarks = () => {
		localStorage.setItem("newtab-bookmarks", JSON.stringify(bookmarks));
		setEditMode(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center px-4",
		style: { background: "var(--background)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `fixed top-4 left-4 z-50 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => window.history.back(),
					className: "rounded-lg border border-border bg-surface/80 backdrop-blur px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
					children: "Close"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-lg text-muted-foreground",
				children: [getGreeting(now.getHours()), name ? `, ${name}` : ", builder"]
			}),
			!name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				value: name,
				onChange: (e) => setName(e.target.value),
				onBlur: saveName,
				onKeyDown: (e) => e.key === "Enter" && saveName(),
				placeholder: "What's your name?",
				className: "mt-1 bg-transparent text-center text-lg text-foreground border-b border-border focus:border-primary focus:outline-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-7xl sm:text-9xl font-bold font-mono text-foreground tracking-tight",
				children: now.toLocaleTimeString("en-US", { hour12: false })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-lg text-muted-foreground",
				children: now.toLocaleDateString("en-US", {
					weekday: "long",
					month: "long",
					day: "numeric",
					year: "numeric"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				onSubmit: handleSearch,
				className: "mt-8 w-full max-w-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Search the web or /command…",
					className: "w-full rounded-xl border border-border bg-surface px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid w-full max-w-lg grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground uppercase tracking-wider",
							children: "Weather"
						}), weather ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-lg",
								children: weather.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-foreground",
								children: weather.temp
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: weather.city
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Loading…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground uppercase tracking-wider",
							children: "Prayer"
						}), prayer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-semibold text-foreground",
								children: prayer.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px]",
								style: { color: "#d29922" },
								children: prayer.remaining
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: prayer.time
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Loading…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-3 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground uppercase tracking-wider",
								children: "Markets"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs font-medium text-foreground",
								children: nifty || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs font-medium",
								style: { color: "#d29922" },
								children: btc || "—"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap justify-center gap-3",
				children: [bookmarks.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: b.url,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "flex flex-col items-center gap-1 rounded-lg border border-border bg-surface p-3 w-16 transition-all hover:border-primary/40 hover:-translate-y-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl",
						children: b.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground truncate w-full text-center",
						children: b.name
					})]
				}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setEditMode(!editMode),
					className: "flex flex-col items-center gap-1 rounded-lg border border-dashed border-border p-3 w-16 text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl",
						children: "+"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px]",
						children: "Edit"
					})]
				})]
			}),
			editMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl border border-border bg-surface p-4 max-w-sm w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mb-2",
						children: "Edit bookmarks (icon | name | url, one per line)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						defaultValue: bookmarks.map((b) => `${b.icon} | ${b.name} | ${b.url}`).join("\n"),
						onBlur: (e) => {
							const newBookmarks = e.target.value.split("\n").filter(Boolean).map((l) => {
								const parts = l.split("|").map((s) => s.trim());
								return {
									icon: parts[0] || "🔖",
									name: parts[1] || "Link",
									url: parts[2] || "#"
								};
							});
							setBookmarks(newBookmarks);
						},
						className: "w-full rounded-lg border border-border bg-surface-elevated p-2 font-mono text-xs text-foreground h-32 focus:border-primary focus:outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: saveBookmarks,
						className: "mt-2 min-h-[36px] w-full rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground",
						children: "Save"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-[11px] text-muted-foreground/50",
				children: "Set this page as your browser homepage for a beautiful new tab"
			})
		]
	});
}
//#endregion
export { NewTabScreen as component };
