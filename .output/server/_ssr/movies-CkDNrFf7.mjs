import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn, n as Button } from "./slashkits-CB7bx4DD.mjs";
import { L as Search, T as Star, en as Film, i as X, in as ExternalLink } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as useServerFn } from "./createSsrRpc-DSyYfJsl.mjs";
import { t as feedback } from "./play-sound-4NQwUsQc.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as SHELF_LANGS } from "./regional-films-C66JSklZ.mjs";
import { n as searchMovies, t as regionalMovies } from "./media.functions-C2IgkuG3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/movies-CkDNrFf7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Legal, region-aware places to actually watch a title. */
var SOURCES = (title, year) => {
	const q = encodeURIComponent(year ? `${title} ${year}` : title);
	const plain = encodeURIComponent(title);
	return [
		{
			label: "Where to stream (JustWatch)",
			url: `https://www.justwatch.com/in/search?q=${plain}`
		},
		{
			label: "Prime Video",
			url: `https://www.primevideo.com/search?phrase=${plain}`
		},
		{
			label: "Netflix",
			url: `https://www.netflix.com/search?q=${plain}`
		},
		{
			label: "JioHotstar",
			url: `https://www.hotstar.com/in/explore?search_query=${plain}`
		},
		{
			label: "Zee5",
			url: `https://www.zee5.com/search?q=${plain}`
		},
		{
			label: "SonyLIV",
			url: `https://www.sonyliv.com/search?searchTerm=${plain}`
		},
		{
			label: "YouTube Movies (free & rent)",
			url: `https://www.youtube.com/results?search_query=${q}+full+movie`
		},
		{
			label: "IMDb page",
			url: `https://www.imdb.com/find/?q=${plain}`
		}
	];
};
function MoviesPage() {
	const runSearch = useServerFn(searchMovies);
	const runShelf = useServerFn(regionalMovies);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const [lang, setLang] = (0, import_react.useState)("hindi");
	const [open, setOpen] = (0, import_react.useState)(null);
	const { data, isFetching } = useQuery({
		queryKey: [
			"movies",
			q,
			lang
		],
		queryFn: () => q ? runSearch({ data: { q } }) : runShelf({ data: { lang } }),
		staleTime: 18e5
	});
	const movies = data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "Movies",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
					children: "Regional movie finder"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: "South Asian cinema — Hindi, Telugu, Tamil, Malayalam, Urdu, Bengali, Nepali and more — with legal watch pages for every title."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-3 sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						feedback("tap");
						setQ(draft.trim());
					},
					className: "flex flex-col gap-2 sm:flex-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: draft,
								onChange: (e) => setDraft(e.target.value),
								"aria-label": "Search movies",
								placeholder: "Search any film — e.g. Jawan, Sairat, Joyland…",
								className: "h-11 w-full rounded-xl border border-border bg-surface pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "min-h-11",
							children: "Search"
						}),
						q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							className: "min-h-11",
							onClick: () => {
								setDraft("");
								setQ("");
							},
							children: "Clear"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: SHELF_LANGS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: s.region,
						"aria-pressed": !q && lang === s.lang,
						onClick: () => {
							feedback("tap");
							setQ("");
							setDraft("");
							setLang(s.lang);
						},
						className: cn("min-h-9 rounded-full border px-3.5 text-sm transition-colors", !q && lang === s.lang ? "border-primary bg-accent text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
						children: s.label
					}, s.lang))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: isFetching && movies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5",
					children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[2/3] animate-pulse rounded-2xl bg-surface-elevated" }, i))
				}) : movies.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5",
					children: movies.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						role: "button",
						tabIndex: 0,
						"aria-label": `Watch options for ${m.title}`,
						onClick: () => {
							feedback("tap");
							setOpen(m);
						},
						onKeyDown: (e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								setOpen(m);
							}
						},
						className: "glass lift group cursor-pointer overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[2/3] overflow-hidden bg-surface-elevated",
							children: [m.poster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: m.poster,
								alt: `${m.title} poster`,
								loading: "lazy",
								className: "size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-full place-items-center text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, {
									className: "size-7",
									"aria-hidden": true
								})
							}), m.rating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
										className: "size-3 fill-current",
										"aria-hidden": true
									}),
									" ",
									m.rating
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "line-clamp-2 text-sm font-medium text-foreground",
								children: m.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 truncate text-xs text-muted-foreground",
								children: [m.year, m.genres[0]].filter(Boolean).join(" · ")
							})]
						})]
					}, m.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl px-6 py-14 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-semibold text-foreground",
						children: "Nothing found"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground",
						children: "Try the film's original title, or pick a language shelf above."
					})]
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": `Watch ${open.title}`,
				className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6",
				onClick: () => setOpen(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: (e) => e.stopPropagation(),
					className: "glass max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-2xl p-5 sm:rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-semibold text-foreground",
									children: open.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: [
										open.year,
										open.runtime,
										open.genres.join(", ")
									].filter(Boolean).join(" · ")
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Close",
								onClick: () => setOpen(null),
								className: "rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})]
						}),
						open.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: open.description
						}),
						open.cast.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: ["Cast: ", open.cast.join(", ")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
							children: "Legal ways to watch"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid gap-2 sm:grid-cols-2",
							children: SOURCES(open.title, open.year).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: s.url,
								target: "_blank",
								rel: "noreferrer noopener",
								className: "flex min-h-11 items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: s.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5 shrink-0 text-muted-foreground" })]
							}, s.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[11px] text-muted-foreground",
							children: "SlashAI links only to official platforms and store pages — availability depends on your country and subscriptions."
						})
					]
				})
			})
		]
	});
}
//#endregion
export { MoviesPage as component };
