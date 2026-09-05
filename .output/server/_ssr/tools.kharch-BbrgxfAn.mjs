import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.kharch-BbrgxfAn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LABELS = {
	en: {
		title: "Kharch Tracker",
		income: "Income",
		expense: "Expense",
		amount: "Amount",
		desc: "Description",
		cat: "Category",
		add: "Add",
		total: "Total",
		remaining: "Remaining",
		savings: "Savings Rate"
	},
	ur: {
		title: "خرچ ٹریکر",
		income: "آمدنی",
		expense: "اخراجات",
		amount: "رقم",
		desc: "تفصیل",
		cat: "زمرہ",
		add: "شامل کریں",
		total: "کل",
		remaining: "بچت",
		savings: "بچت کا شرح"
	},
	hi: {
		title: "खर्च ट्रैकर",
		income: "आय",
		expense: "खर्च",
		amount: "रकम",
		desc: "विवरण",
		cat: "श्रेणी",
		add: "जोड़ें",
		total: "कुल",
		remaining: "शेष",
		savings: "बचत दर"
	}
};
var CATEGORIES_EN = [
	"Rent",
	"Groceries",
	"Utilities",
	"Transport",
	"Food",
	"Recharge",
	"OTT",
	"Savings",
	"EMI",
	"Medical",
	"Education",
	"Misc"
];
function KharchTracker() {
	const [lang, setLang] = (0, import_react.useState)("en");
	const [entries, setEntries] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("slashai.kharch") || "[]");
		} catch {
			return [];
		}
	});
	const [amount, setAmount] = (0, import_react.useState)("");
	const [desc, setDesc] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("Misc");
	const [entryType, setEntryType] = (0, import_react.useState)("expense");
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("slashai.kharch", JSON.stringify(entries));
		} catch {}
	}, [entries]);
	const L = LABELS[lang];
	const totalIncome = entries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0);
	const totalExpense = entries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);
	const remaining = totalIncome - totalExpense;
	const savingsRate = totalIncome > 0 ? Math.round((totalIncome - totalExpense) / totalIncome * 100) : 0;
	const addEntry = () => {
		const amt = parseFloat(amount);
		if (!amt || amt <= 0) return;
		setEntries((e) => [...e, {
			id: crypto.randomUUID(),
			type: entryType,
			amount: amt,
			desc: desc.trim() || cat,
			cat
		}]);
		setAmount("");
		setDesc("");
	};
	const removeEntry = (id) => setEntries((e) => e.filter((x) => x.id !== id));
	const byCategory = (0, import_react.useMemo)(() => {
		const map = {};
		entries.filter((e) => e.type === "expense").forEach((e) => {
			map[e.cat] = (map[e.cat] || 0) + e.amount;
		});
		return Object.entries(map).sort((a, b) => b[1] - a[1]);
	}, [entries]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: L["title"] ?? "Kharch Tracker",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "mb-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground",
					children: L["title"] ?? "Kharch Tracker"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: lang === "en" ? "Track income and expenses with Indian categories" : lang === "ur" ? "آمدنی اور اخراجات کو ٹریک کریں" : "आय और खर्च को ट्रैक करें"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1",
					children: [
						"en",
						"ur",
						"hi"
					].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setLang(l),
						className: `rounded-lg border px-2 py-1 text-xs uppercase transition-colors ${lang === l ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`,
						children: l
					}, l))
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-surface p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-lg font-bold text-green-400",
									children: ["₹", totalIncome.toLocaleString()]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: L["income"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-surface p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-lg font-bold text-red-400",
									children: ["₹", totalExpense.toLocaleString()]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: L["expense"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-surface p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: `text-lg font-bold ${remaining >= 0 ? "text-primary" : "text-red-400"}`,
									children: ["₹", remaining.toLocaleString()]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground",
									children: [
										L["remaining"],
										" · ",
										savingsRate,
										"%"
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1.5",
								children: ["income", "expense"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setEntryType(t),
									className: `flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${entryType === t ? t === "income" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400" : "bg-surface-elevated text-muted-foreground"}`,
									children: L[t]
								}, t))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: amount,
									onChange: (e) => setAmount(e.target.value),
									placeholder: L["amount"],
									className: "h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: desc,
									onChange: (e) => setDesc(e.target.value),
									placeholder: L["desc"],
									className: "h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: cat,
									onChange: (e) => setCat(e.target.value),
									className: "h-8 flex-1 rounded-lg border border-border bg-surface-elevated px-2 text-xs",
									children: CATEGORIES_EN.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										children: c
									}, c))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: addEntry,
									className: "h-8 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground",
									children: L["add"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: entries.slice(-10).reverse().map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: e.desc
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-muted-foreground",
								children: e.cat
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: e.type === "income" ? "text-green-400" : "text-red-400",
									children: [
										e.type === "income" ? "+" : "-",
										"₹",
										e.amount.toLocaleString()
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeEntry(e.id),
									className: "text-muted-foreground hover:text-red-400",
									children: "×"
								})]
							})]
						}, e.id))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-xs font-semibold text-foreground",
				children: lang === "en" ? "Spending by Category" : lang === "ur" ? "زمرے کے مطابق خرچ" : "श्रेणी के अनुसार खर्च"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [byCategory.map(([cat, amt]) => {
					const pct = totalExpense > 0 ? amt / totalExpense * 100 : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: cat
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									"₹",
									amt.toLocaleString(),
									" (",
									Math.round(pct),
									"%)"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 h-1.5 overflow-hidden rounded-full bg-surface-elevated",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-primary",
								style: { width: `${pct}%` }
							})
						})]
					}, cat);
				}), byCategory.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: lang === "en" ? "No expenses yet" : "ابھی تک کوئی اخراجات نہیں"
				})]
			})] })]
		})]
	});
}
//#endregion
export { KharchTracker as component };
