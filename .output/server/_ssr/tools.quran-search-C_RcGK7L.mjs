import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.quran-search-C_RcGK7L.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuranSearch() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [surah, setSurah] = (0, import_react.useState)("");
	const [juz, setJuz] = (0, import_react.useState)("");
	const search = async () => {
		if (!query.trim()) return;
		setLoading(true);
		try {
			const d = await (await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/en`)).json();
			if (d.data && d.data.matches) {
				let matches = d.data.matches;
				if (surah) matches = matches.filter((m) => m.surah.number === Number(surah));
				setResults(matches.slice(0, 50));
			} else setResults([]);
		} catch {
			setResults([]);
		}
		setLoading(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Quran Search",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📖 Quran Word Search"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Search any word across the entire Quran. Arabic + English side by side."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search any word or phrase...",
						className: "flex-1 h-10 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary/50",
						onKeyDown: (e) => e.key === "Enter" && search()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: search,
						disabled: loading,
						className: "rounded-xl bg-primary px-5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40",
						children: "Search"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: surah,
						onChange: (e) => setSurah(e.target.value),
						placeholder: "Surah # (optional)",
						className: "h-9 w-32 rounded-lg border border-border bg-surface px-3 text-xs focus:outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: juz,
						onChange: (e) => setJuz(e.target.value),
						placeholder: "Juz # (optional)",
						className: "h-9 w-32 rounded-lg border border-border bg-surface px-3 text-xs focus:outline-none"
					})]
				}),
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground",
					children: "Searching..."
				}) : results.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						results.length,
						" result",
						results.length !== 1 ? "s" : "",
						" found"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: results.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSelected(selected?.numberInSurah === r.numberInSurah && selected?.surah?.number === r.surah?.number ? null : r),
						className: "w-full text-left rounded-xl border border-border bg-surface p-4 transition-all hover:border-[#484f58]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary",
									children: [
										r.surah?.englishName,
										" ",
										r.surah?.number,
										":",
										r.numberInSurah
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: r.surah?.revelationType
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-right leading-relaxed text-foreground",
								dir: "rtl",
								style: { fontFamily: "'Amiri', serif" },
								children: r.text
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: r.edition?.name
							}),
							selected?.numberInSurah === r.numberInSurah && selected?.surah?.number === r.surah?.number && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 pt-2 border-t border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-foreground",
									children: "Click to copy"
								})
							})
						]
					}, i))
				})] }) : query && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground",
					children: [
						"No results for \"",
						query,
						"\""
					]
				}),
				!query && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-6 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Type a word to search across all Surahs."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2 justify-center",
						children: [
							"mercy",
							"patience",
							"paradise",
							"prayer",
							"believer",
							"light",
							"guidance",
							"truth"
						].map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setQuery(w);
								setTimeout(search, 100);
							},
							className: "rounded-full border border-border bg-surface-elevated px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors",
							children: w
						}, w))
					})]
				})
			]
		})]
	});
}
//#endregion
export { QuranSearch as component };
