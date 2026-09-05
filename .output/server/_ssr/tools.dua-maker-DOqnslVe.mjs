import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.dua-maker-DOqnslVe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"Health",
	"Family",
	"Career",
	"Wealth",
	"Guidance",
	"Forgiveness",
	"General"
];
var LS_KEY = "slashai.duas";
var SAMPLE_DUAS = [
	{
		text: "Rabbi zidni ilma",
		meaning: "My Lord, increase me in knowledge",
		category: "Guidance"
	},
	{
		text: "Hasbunallahu wa ni'mal wakeel",
		meaning: "Allah is sufficient for us, and He is the best Disposer of affairs",
		category: "General"
	},
	{
		text: "Allahumma inni as'aluka al-afiyah",
		meaning: "O Allah, I ask You for well-being",
		category: "Health"
	}
];
function DuaMaker() {
	const [duas, setDuas] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
		} catch {
			return [];
		}
	});
	const [text, setText] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("General");
	const [showReading, setShowReading] = (0, import_react.useState)(false);
	const [readingIdx, setReadingIdx] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(LS_KEY, JSON.stringify(duas));
		} catch {}
	}, [duas]);
	const addDua = () => {
		if (!text.trim()) return;
		setDuas((d) => [...d, {
			id: crypto.randomUUID(),
			text: text.trim(),
			category,
			answered: false,
			created: (/* @__PURE__ */ new Date()).toISOString()
		}]);
		setText("");
	};
	const markAnswered = (id) => setDuas((d) => d.map((dua) => dua.id === id ? {
		...dua,
		answered: true,
		answeredDate: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")
	} : dua));
	const removeDua = (id) => setDuas((d) => d.filter((dua) => dua.id !== id));
	const loadSamples = () => {
		const newDuas = SAMPLE_DUAS.map((s) => ({
			id: crypto.randomUUID(),
			text: s.text,
			category: s.category,
			answered: false,
			created: (/* @__PURE__ */ new Date()).toISOString()
		}));
		setDuas((d) => [...newDuas, ...d]);
	};
	const currentDua = duas[readingIdx];
	if (showReading && currentDua) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Dua Reading",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-[60vh] flex-col items-center justify-center px-4 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-xs text-muted-foreground",
					children: [
						"Dua ",
						readingIdx + 1,
						" of ",
						duas.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 max-w-lg text-2xl font-bold leading-relaxed text-foreground",
					children: currentDua.text
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-1 text-xs text-muted-foreground",
					children: ["Category: ", currentDua.category]
				}),
				currentDua.answered && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-green-400",
					children: ["✓ Answered on ", currentDua.answeredDate]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setReadingIdx((i) => i > 0 ? i - 1 : duas.length - 1),
						className: "h-10 rounded-lg border border-border px-4 text-sm",
						children: "← Previous"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setReadingIdx((i) => (i + 1) % duas.length),
						className: "h-10 rounded-lg border border-border px-4 text-sm",
						children: "Next →"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowReading(false),
					className: "mt-4 text-xs text-muted-foreground hover:text-foreground",
					children: "Exit reading mode"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Dua Maker",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🤲 Personal Dua List"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Your private list of duas. All data stays in your browser."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: text,
								onChange: (e) => setText(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && addDua(),
								placeholder: "Enter dua text...",
								className: "h-9 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: category,
								onChange: (e) => setCategory(e.target.value),
								className: "h-9 rounded-lg border border-border bg-surface-elevated px-2 text-xs",
								children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: c
								}, c))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: addDua,
								className: "h-9 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground",
								children: "Add"
							})
						]
					}), duas.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: loadSamples,
						className: "mt-2 text-xs text-primary hover:underline",
						children: "Load sample duas"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: duas.map((dua) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-xl border bg-surface p-3 ${dua.answered ? "border-green-500/30" : "border-border"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-foreground",
								children: dua.text
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1",
								children: [!dua.answered && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => markAnswered(dua.id),
									className: "rounded px-1.5 text-[10px] text-green-400 hover:bg-green-500/10",
									children: "✓ Answered"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeDua(dua.id),
									className: "rounded px-1.5 text-[10px] text-muted-foreground hover:text-red-400",
									children: "×"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-surface-elevated px-1.5 py-0.5 text-[10px] text-muted-foreground",
								children: dua.category
							}), dua.answered && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-green-400",
								children: ["✓ Answered ", dua.answeredDate]
							})]
						})]
					}, dua.id))
				}),
				duas.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setShowReading(true);
						setReadingIdx(0);
					},
					className: "h-10 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90",
					children: [
						"🤲 Start Reading Mode (",
						duas.length,
						" duas)"
					]
				})
			]
		})]
	});
}
//#endregion
export { DuaMaker as component };
