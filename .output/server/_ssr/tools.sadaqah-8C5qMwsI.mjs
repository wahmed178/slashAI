import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.sadaqah-8C5qMwsI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"Zakat",
	"Sadaqah",
	"Fitrana",
	"General"
];
function CharityTracker() {
	const [donations, setDonations] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("slashai.sadaqah") || "[]");
		} catch {
			return [];
		}
	});
	const [showAdd, setShowAdd] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		amount: "",
		recipient: "",
		category: "Sadaqah",
		date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
	});
	const save = (d) => {
		setDonations(d);
		try {
			localStorage.setItem("slashai.sadaqah", JSON.stringify(d));
		} catch {}
	};
	const addDonation = () => {
		if (!form.amount || Number(form.amount) <= 0) return;
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		save([...donations, {
			id: Date.now(),
			amount: Number(form.amount),
			recipient: form.recipient,
			date: form.date || today,
			category: form.category
		}]);
		setForm({
			amount: "",
			recipient: "",
			category: "Sadaqah",
			date: today
		});
		setShowAdd(false);
	};
	const removeDonation = (id) => save(donations.filter((d) => d.id !== id));
	const total = donations.reduce((a, d) => a + d.amount, 0);
	const thisMonth = donations.filter((d) => d.date.startsWith((/* @__PURE__ */ new Date()).toISOString().slice(0, 7))).reduce((a, d) => a + d.amount, 0);
	const thisYear = donations.filter((d) => d.date.startsWith((/* @__PURE__ */ new Date()).getFullYear().toString())).reduce((a, d) => a + d.amount, 0);
	const byCategory = (0, import_react.useMemo)(() => {
		const map = {};
		donations.forEach((d) => {
			map[d.category] = (map[d.category] || 0) + d.amount;
		});
		return map;
	}, [donations]);
	const exportCSV = () => {
		const csv = "Date,Amount,Recipient,Category\n" + donations.map((d) => `${d.date},${d.amount},"${d.recipient}","${d.category}"`).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "sadaqah.csv";
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Charity Tracker",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🤲 Sadaqah & Charity Tracker"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Track your charitable giving. Private — stored locally only."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold text-primary",
								children: total.toLocaleString()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Total Given"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold text-foreground",
								children: thisMonth.toLocaleString()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "This Month"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold text-foreground",
								children: thisYear.toLocaleString()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "This Year"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: "By Category"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 rounded-lg bg-surface-elevated p-2 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-foreground",
								children: (byCategory[cat] || 0).toLocaleString()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: cat
							})]
						}, cat))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowAdd(!showAdd),
						className: "flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90",
						children: "+ Add Donation"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: exportCSV,
						className: "rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
						children: "Export"
					})]
				}),
				showAdd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.amount,
							onChange: (e) => setForm({
								...form,
								amount: e.target.value
							}),
							placeholder: "Amount",
							className: "h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.recipient,
							onChange: (e) => setForm({
								...form,
								recipient: e.target.value
							}),
							placeholder: "Recipient / Organization",
							className: "h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: form.category,
							onChange: (e) => setForm({
								...form,
								category: e.target.value
							}),
							className: "h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none",
							children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: form.date,
							onChange: (e) => setForm({
								...form,
								date: e.target.value
							}),
							className: "h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addDonation,
							disabled: !form.amount || Number(form.amount) <= 0,
							className: "w-full rounded-lg bg-primary py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40",
							children: "Add"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: donations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm text-muted-foreground py-8",
						children: "No donations yet. Start tracking your sadaqah."
					}) : [...donations].reverse().map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-foreground",
									children: d.amount.toLocaleString()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										d.recipient || "Anonymous",
										" · ",
										d.date
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground",
								children: d.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => removeDonation(d.id),
								className: "text-xs text-muted-foreground hover:text-red-400",
								children: "✕"
							})
						]
					}, d.id))
				})
			]
		})]
	});
}
//#endregion
export { CharityTracker as component };
