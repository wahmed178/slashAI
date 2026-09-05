import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn, n as Button } from "./slashkits-CB7bx4DD.mjs";
import { $ as Pause, Ct as ListPlus, G as Repeat, L as Search, O as SkipForward, St as ListVideo, Z as Play, f as Video, i as X, in as ExternalLink, j as Shuffle, k as SkipBack, nn as Eye, ot as Music2, y as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as useServerFn } from "./createSsrRpc-DSyYfJsl.mjs";
import { t as feedback } from "./play-sound-4NQwUsQc.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as searchVideos } from "./media.functions-C2IgkuG3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/youtube-qRW15OZ4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ORIGIN = "https://www.youtube-nocookie.com";
var STATE_MAP = {
	[-1]: "unstarted",
	0: "ended",
	1: "playing",
	2: "paused",
	3: "buffering"
};
function useYouTubePlayer(onEnded) {
	const frameRef = (0, import_react.useRef)(null);
	const [state, setState] = (0, import_react.useState)("unstarted");
	const [time, setTime] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const endedRef = (0, import_react.useRef)(onEnded);
	endedRef.current = onEnded;
	const command = (0, import_react.useCallback)((func, args = []) => {
		frameRef.current?.contentWindow?.postMessage(JSON.stringify({
			event: "command",
			func,
			args
		}), ORIGIN);
	}, []);
	/** Handshake — call whenever the iframe (re)loads. */
	const attach = (0, import_react.useCallback)(() => {
		const win = frameRef.current?.contentWindow;
		if (!win) return;
		win.postMessage(JSON.stringify({
			event: "listening",
			id: 1,
			channel: "widget"
		}), ORIGIN);
	}, []);
	(0, import_react.useEffect)(() => {
		const onMessage = (e) => {
			if (e.origin !== ORIGIN || typeof e.data !== "string") return;
			let payload;
			try {
				payload = JSON.parse(e.data);
			} catch {
				return;
			}
			const info = payload.info;
			if (payload.event === "onStateChange") {
				const next = STATE_MAP[(typeof info === "number" ? info : info?.playerState) ?? -1] ?? "unstarted";
				setState(next);
				if (next === "ended") endedRef.current();
			}
			if (payload.event === "infoDelivery" && info && typeof info === "object") {
				if (typeof info.currentTime === "number") setTime(info.currentTime);
				if (typeof info.duration === "number" && info.duration > 0) setDuration(info.duration);
				if (typeof info.playerState === "number") {
					const next = STATE_MAP[info.playerState] ?? "unstarted";
					setState(next);
					if (next === "ended") endedRef.current();
				}
			}
		};
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	}, []);
	return {
		frameRef,
		attach,
		state,
		time,
		duration,
		play: () => command("playVideo"),
		pause: () => command("pauseVideo"),
		toggle: () => command(state === "playing" ? "pauseVideo" : "playVideo"),
		seek: (seconds) => command("seekTo", [seconds, true]),
		mute: () => command("mute"),
		unmute: () => command("unMute"),
		reset: () => {
			setTime(0);
			setDuration(0);
			setState("unstarted");
		}
	};
}
var QUICK = [
	"lofi beats to study",
	"bollywood hits 2026",
	"javascript crash course",
	"telugu melody songs",
	"productivity system",
	"ambient focus music"
];
var fmtDuration = (s) => {
	if (!s) return "";
	const h = Math.floor(s / 3600);
	const m = Math.floor(s % 3600 / 60);
	const sec = Math.floor(s % 60);
	return h ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
};
var fmtViews = (v) => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${Math.round(v / 1e3)}K` : `${v}`;
var QUEUE_KEY = "slashai.yt.queue.v1";
function loadQueue() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(QUEUE_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.slice(0, 100) : [];
	} catch {
		return [];
	}
}
function YouTubePage() {
	const run = useServerFn(searchVideos);
	const [draft, setDraft] = (0, import_react.useState)("lofi beats to study");
	const [q, setQ] = (0, import_react.useState)("lofi beats to study");
	const [music, setMusic] = (0, import_react.useState)(false);
	const [queue, setQueue] = (0, import_react.useState)([]);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [repeat, setRepeat] = (0, import_react.useState)(false);
	const [shuffle, setShuffle] = (0, import_react.useState)(false);
	const [queueOpen, setQueueOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setQueue(loadQueue()), []);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(0, 100)));
		} catch {}
	}, [queue]);
	const now = queue[index] ?? null;
	const advance = (0, import_react.useCallback)((step) => {
		setIndex((i) => {
			if (queue.length === 0) return 0;
			if (shuffle && step === 1) {
				if (queue.length === 1) return 0;
				let next = i;
				while (next === i) next = Math.floor(Math.random() * queue.length);
				return next;
			}
			const next = i + step;
			if (next >= queue.length) return repeat ? 0 : i;
			if (next < 0) return repeat ? queue.length - 1 : 0;
			return next;
		});
	}, [
		queue.length,
		repeat,
		shuffle
	]);
	const player = useYouTubePlayer(() => advance(1));
	const { attach, reset } = player;
	(0, import_react.useEffect)(() => {
		if (now) reset();
	}, [
		now?.id,
		reset,
		now
	]);
	const { data, isFetching } = useQuery({
		queryKey: [
			"yt",
			q,
			music
		],
		queryFn: () => run({ data: {
			q,
			music
		} }),
		enabled: q.trim().length > 0,
		staleTime: 3e5
	});
	const hits = data?.hits ?? [];
	const queuedIds = (0, import_react.useMemo)(() => new Set(queue.map((v) => v.id)), [queue]);
	const search = (term) => {
		const next = term.trim();
		if (!next) return;
		feedback("tap");
		setDraft(next);
		setQ(next);
	};
	/** Play now: put the track at the front of the "up next" run and jump to it. */
	const playNow = (video) => {
		feedback("tap");
		setQueue((prev) => {
			const existing = prev.findIndex((v) => v.id === video.id);
			if (existing >= 0) {
				setIndex(existing);
				return prev;
			}
			const next = [...prev];
			next.splice(index + (prev.length ? 1 : 0), 0, video);
			setIndex(prev.length ? index + 1 : 0);
			return next;
		});
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	const enqueue = (video) => {
		feedback("tap");
		setQueue((prev) => prev.some((v) => v.id === video.id) ? prev : [...prev, video]);
	};
	const removeAt = (i) => {
		setQueue((prev) => prev.filter((_, n) => n !== i));
		setIndex((cur) => i < cur ? cur - 1 : Math.max(0, Math.min(cur, queue.length - 2)));
	};
	const handoff = now ? `https://www.youtube.com/watch?v=${now.id}${player.time > 3 ? `&t=${Math.floor(player.time)}s` : ""}` : "#";
	const progress = player.duration > 0 ? Math.min(100, player.time / player.duration * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "YouTube",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
					children: "YouTube hub"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: "Search videos or music and play them right here — no ads-page detour, no sign-in."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-3 sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						search(draft);
					},
					className: "flex flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							"aria-label": music ? "Search music" : "Search videos",
							placeholder: music ? "Search songs, artists, albums…" : "Search any video or topic…",
							className: "h-11 w-full rounded-xl border border-border bg-surface pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "tablist",
							"aria-label": "Result type",
							className: "flex rounded-xl border border-border bg-surface p-1",
							children: [{
								key: false,
								label: "Videos",
								icon: Video
							}, {
								key: true,
								label: "Music",
								icon: Music2
							}].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "tab",
								"aria-selected": music === t.key,
								onClick: () => {
									feedback("tap");
									setMusic(t.key);
								},
								className: cn("flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm transition-colors", music === t.key ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "size-4" }),
									" ",
									t.label
								]
							}, String(t.key)))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "min-h-11",
							children: "Search"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: QUICK.map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => search(term),
						className: "rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
						children: term
					}, term))
				})]
			}),
			now && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "glass lift mt-5 overflow-hidden rounded-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-video w-full bg-black",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							ref: player.frameRef,
							onLoad: attach,
							title: now.title,
							src: `https://www.youtube-nocookie.com/embed/${now.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${typeof window === "undefined" ? "" : encodeURIComponent(window.location.origin)}`,
							allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
							allowFullScreen: true,
							loading: "lazy",
							referrerPolicy: "strict-origin-when-cross-origin",
							className: "size-full border-0"
						}, now.id)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "progressbar",
						"aria-label": "Playback progress",
						"aria-valuenow": Math.round(progress),
						"aria-valuemin": 0,
						"aria-valuemax": 100,
						className: "h-1 w-full bg-surface-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary transition-[width] duration-500",
							style: { width: `${progress}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "truncate text-sm font-semibold text-foreground",
									children: now.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 truncate text-xs text-muted-foreground",
									children: [
										now.author,
										player.duration > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-2 tabular-nums",
											children: [
												fmtDuration(player.time),
												" / ",
												fmtDuration(player.duration)
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-2",
											children: [
												"· ",
												index + 1,
												" of ",
												queue.length
											]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: handoff,
								target: "_blank",
								rel: "noreferrer noopener",
								"aria-label": "Continue on YouTube at this timestamp",
								className: "rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Close player",
								onClick: () => {
									setQueue([]);
									setIndex(0);
								},
								className: "rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 border-t border-border px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Previous",
								onClick: () => {
									feedback("tap");
									advance(-1);
								},
								className: "rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": player.state === "playing" ? "Pause" : "Play",
								onClick: () => {
									feedback("tap");
									player.toggle();
								},
								className: "grid size-10 place-items-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95",
								children: player.state === "playing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Next",
								onClick: () => {
									feedback("tap");
									advance(1);
								},
								className: "rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": shuffle,
								"aria-label": "Shuffle",
								onClick: () => setShuffle((s) => !s),
								className: cn("rounded-lg p-2 transition-colors hover:bg-accent", shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": repeat,
								"aria-label": "Repeat queue",
								onClick: () => setRepeat((r) => !r),
								className: cn("rounded-lg p-2 transition-colors hover:bg-accent", repeat ? "text-primary" : "text-muted-foreground hover:text-foreground"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setQueueOpen((o) => !o),
								"aria-expanded": queueOpen,
								className: "ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-xs text-foreground hover:bg-accent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "size-4" }),
									" Queue (",
									queue.length,
									")"
								]
							})
						]
					}),
					queueOpen && queue.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "max-h-72 divide-y divide-border overflow-y-auto border-t border-border",
						children: queue.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("flex items-center gap-3 px-4 py-2", i === index && "bg-accent/60"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setIndex(i),
								className: "min-w-0 flex-1 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "line-clamp-1 text-xs font-medium text-foreground",
									children: [
										i + 1,
										". ",
										v.title
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "line-clamp-1 text-[11px] text-muted-foreground",
									children: v.author
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `Remove ${v.title} from queue`,
								onClick: () => removeAt(i),
								className: "rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						}, `${v.id}-${i}`))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: isFetching && hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-44 animate-pulse rounded-2xl bg-surface-elevated" }, i))
				}) : hits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
					children: hits.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: cn("glass lift group overflow-hidden rounded-2xl outline-none", now?.id === v.id && "ring-2 ring-primary"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-label": `Play ${v.title}`,
							onClick: () => playNow(v),
							className: "block w-full text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-video overflow-hidden bg-surface-elevated",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: v.thumb,
										alt: "",
										loading: "lazy",
										className: "size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
											className: "size-9 text-white drop-shadow",
											"aria-hidden": true
										})
									}),
									v.duration > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-2 bottom-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white",
										children: fmtDuration(v.duration)
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "line-clamp-2 text-sm font-medium text-foreground",
									children: v.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 flex items-center gap-2 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: v.author
									}), v.views > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex shrink-0 items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3" }),
											" ",
											fmtViews(v.views)
										]
									})]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-t border-border px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => enqueue(v),
								disabled: queuedIds.has(v.id),
								className: "inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs text-foreground transition-colors hover:bg-accent disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPlus, { className: "size-3.5" }), queuedIds.has(v.id) ? "Queued" : "Add to queue"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `https://www.youtube.com/watch?v=${v.id}`,
								target: "_blank",
								rel: "noreferrer noopener",
								"aria-label": `Open ${v.title} on YouTube`,
								className: "ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })
							})]
						})]
					}, v.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl px-6 py-14 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-semibold text-foreground",
							children: "No results right now"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground",
							children: data?.degraded ? "The free search mirrors are busy. Try again in a moment, or open the search on YouTube." : "Try a different phrase, an artist name, or one of the suggestions above."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
							target: "_blank",
							rel: "noreferrer noopener",
							className: "mt-4 inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border px-4 text-sm text-foreground hover:bg-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), " Search on YouTube"]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { YouTubePage as component };
