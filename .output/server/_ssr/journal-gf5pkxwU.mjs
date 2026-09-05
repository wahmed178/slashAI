import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { I as useLibrary, h as cn, n as Button } from "./slashkits-CB7bx4DD.mjs";
import { An as CalendarDays, Bt as Heart, I as Send, Qt as Flame, fn as Compass, g as Trophy, it as NotebookPen, y as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as Textarea } from "./textarea-B8ksLbD-.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DQVddJ8f.mjs";
import { t as feedback } from "./play-sound-4NQwUsQc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journal-gf5pkxwU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BADGES = [
	{
		id: "first-copy",
		name: "First Command",
		hint: "Copy your first slash command",
		icon: "copy",
		value: (s) => s.stats.copies,
		goal: 1
	},
	{
		id: "copy-25",
		name: "Command Runner",
		hint: "Copy 25 commands",
		icon: "copy",
		value: (s) => s.stats.copies,
		goal: 25
	},
	{
		id: "collector-10",
		name: "Collector",
		hint: "Save 10 commands to favourites",
		icon: "heart",
		value: (s) => s.favoritesCount,
		goal: 10
	},
	{
		id: "curious-10",
		name: "Curious Mind",
		hint: "Open 10 command details",
		icon: "compass",
		value: (s) => s.stats.opens,
		goal: 10
	},
	{
		id: "explorer-50",
		name: "Explorer",
		hint: "Open 50 command details",
		icon: "compass",
		value: (s) => s.stats.opens,
		goal: 50
	},
	{
		id: "streak-3",
		name: "Warming Up",
		hint: "Reach a 3-day streak",
		icon: "flame",
		value: (s) => Math.max(s.streak.count, s.streak.best),
		goal: 3
	},
	{
		id: "streak-7",
		name: "Week Warrior",
		hint: "Reach a 7-day streak",
		icon: "flame",
		value: (s) => Math.max(s.streak.count, s.streak.best),
		goal: 7
	},
	{
		id: "streak-30",
		name: "Habit Formed",
		hint: "Reach a 30-day streak",
		icon: "trophy",
		value: (s) => Math.max(s.streak.count, s.streak.best),
		goal: 30
	},
	{
		id: "journal-1",
		name: "Building in Public",
		hint: "Write your first journal entry",
		icon: "pen",
		value: (s) => s.journalCount,
		goal: 1
	},
	{
		id: "journal-5",
		name: "Progress Logger",
		hint: "Write 5 journal entries",
		icon: "pen",
		value: (s) => s.journalCount,
		goal: 5
	},
	{
		id: "journal-days-7",
		name: "Seven Check-ins",
		hint: "Log progress on 7 different days",
		icon: "calendar",
		value: (s) => s.journalDays,
		goal: 7
	},
	{
		id: "all-rounder",
		name: "All Rounder",
		hint: "Copy, save and log at least once each",
		icon: "trophy",
		value: (s) => (s.stats.copies > 0 ? 1 : 0) + (s.favoritesCount > 0 ? 1 : 0) + (s.journalCount > 0 ? 1 : 0),
		goal: 3
	}
];
function evaluateBadges(s) {
	return BADGES.map((b) => {
		const v = b.value(s);
		return {
			...b,
			unlocked: v >= b.goal,
			progress: Math.min(1, b.goal === 0 ? 1 : v / b.goal)
		};
	});
}
var MOOD_META = {
	win: {
		label: "Win",
		emoji: "🎉",
		cls: "text-emerald-400"
	},
	progress: {
		label: "Progress",
		emoji: "🚀",
		cls: "text-primary"
	},
	struggle: {
		label: "Stuck",
		emoji: "🧱",
		cls: "text-amber-400"
	},
	idea: {
		label: "Idea",
		emoji: "💡",
		cls: "text-sky-400"
	}
};
var BADGE_ICONS = {
	flame: Flame,
	copy: Send,
	heart: Heart,
	compass: Compass,
	pen: NotebookPen,
	trophy: Trophy,
	calendar: CalendarDays
};
function formatDate(iso) {
	const d = /* @__PURE__ */ new Date(`${iso}T00:00:00`);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleDateString(void 0, {
		weekday: "short",
		month: "short",
		day: "numeric"
	});
}
function EntryCard({ entry, onDelete }) {
	const meta = MOOD_META[entry.mood];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "panel rounded-xl p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-2 text-sm font-semibold text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						children: meta.emoji
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: meta.cls,
						children: meta.label
					}),
					entry.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "truncate text-foreground",
						children: ["· ", entry.title]
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Delete entry",
				onClick: () => {
					feedback("tap");
					onDelete(entry.id);
				},
				className: "shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
					className: "size-4",
					"aria-hidden": true
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground",
			children: entry.body
		})]
	});
}
function Composer() {
	const { addJournal } = useLibrary();
	const [mood, setMood] = (0, import_react.useState)("progress");
	const [body, setBody] = (0, import_react.useState)("");
	const submit = () => {
		const text = body.trim();
		if (!text) return;
		addJournal({
			mood,
			title: "",
			body: text
		});
		setBody("");
		feedback("win");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel rounded-2xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "-mx-1 flex gap-2 overflow-x-auto px-1 pb-2",
				children: Object.keys(MOOD_META).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-pressed": mood === m,
					onClick: () => {
						feedback("tap");
						setMood(m);
					},
					className: cn("min-h-9 shrink-0 rounded-full border px-3.5 text-sm transition-colors", mood === m ? "border-primary bg-accent text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
					children: [
						MOOD_META[m].emoji,
						" ",
						MOOD_META[m].label
					]
				}, m))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 3,
				value: body,
				onChange: (e) => setBody(e.target.value),
				placeholder: "What did you build, learn or break today?",
				"aria-label": "Journal entry",
				className: "mt-1 resize-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: submit,
					disabled: !body.trim(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
						className: "size-4",
						"aria-hidden": true
					}), " Log it"]
				})
			})
		]
	});
}
function JournalTab() {
	const { journal, deleteJournal } = useLibrary();
	const grouped = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const e of [...journal].sort((a, b) => b.date.localeCompare(a.date))) {
			const arr = map.get(e.date);
			if (arr) arr.push(e);
			else map.set(e.date, [e]);
		}
		return [...map.entries()];
	}, [journal]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {}), grouped.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-8 text-center text-sm text-muted-foreground",
		children: "No entries yet. One honest line a day beats a perfect update next month."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-5 space-y-5 pb-8",
		children: grouped.map(([date, entries]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
				className: "size-3.5 text-primary",
				"aria-hidden": true
			}), formatDate(date)]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2.5",
			children: entries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
				entry: e,
				onDelete: deleteJournal
			}, e.id))
		})] }, date))
	})] });
}
function BadgesTab() {
	const { streak, stats, favorites, journal } = useLibrary();
	const badges = (0, import_react.useMemo)(() => evaluateBadges({
		streak,
		stats,
		favoritesCount: favorites.length,
		journalCount: journal.length,
		journalDays: new Set(journal.map((e) => e.date)).size
	}), [
		streak,
		stats,
		favorites.length,
		journal
	]);
	const unlocked = badges.filter((b) => b.unlocked).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			"aria-live": "polite",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-bold text-foreground",
					children: unlocked
				}),
				" of ",
				badges.length,
				" unlocked"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-2",
			children: badges.map((b) => {
				const Icon = BADGE_ICONS[b.icon];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: cn("panel flex items-start gap-3 rounded-xl p-4", b.unlocked && "border-primary/50"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("flex size-10 shrink-0 items-center justify-center rounded-xl", b.unlocked ? "bg-accent text-primary" : "bg-surface-elevated text-muted-foreground/50"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							"aria-hidden": true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: cn("text-sm font-bold", b.unlocked ? "text-foreground" : "text-muted-foreground"),
								children: b.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed text-muted-foreground",
								children: b.hint
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								role: "progressbar",
								"aria-valuenow": Math.round(b.progress * 100),
								"aria-valuemin": 0,
								"aria-valuemax": 100,
								className: "mt-2 h-1.5 overflow-hidden rounded-full bg-surface-elevated",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("h-full rounded-full transition-all duration-500", b.unlocked ? "bg-primary" : "bg-primary/40"),
									style: { width: `${Math.round(b.progress * 100)}%` }
								})
							})
						]
					})]
				}, b.id);
			})
		})]
	});
}
function JournalPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideHeaderSearch: true,
		title: "Build journal",
		wide: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-2xl font-black tracking-tight text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookPen, {
					className: "size-6 text-primary",
					"aria-hidden": true
				}), "Build Journal"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-sm text-muted-foreground",
				children: "Log progress in public — stored on this device, yours alone."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "journal",
			className: "mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "journal",
						className: "flex-1 sm:flex-none",
						children: "Journal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "badges",
						className: "flex-1 sm:flex-none",
						children: "Achievements"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "journal",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JournalTab, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "badges",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgesTab, {})
				})
			]
		})]
	});
}
//#endregion
export { JournalPage as component };
