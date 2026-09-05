import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { X as Plus, on as Download, y as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.budget-Cxl-0XZl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EXPENSE_CATS = [
	"Rent/EMI",
	"Groceries",
	"Fuel",
	"Recharge",
	"OTT",
	"Eating Out",
	"Shopping",
	"Health",
	"Education",
	"Transport",
	"Utilities",
	"Other"
];
var MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
function BudgetTracker() {
	const [data, setData] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("budget_data") || "{}");
		} catch {
			return {};
		}
	});
	const [month, setMonth] = (0, import_react.useState)(() => {
		const d = /* @__PURE__ */ new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
	});
	const [newIncome, setNewIncome] = (0, import_react.useState)({
		source: "",
		amount: ""
	});
	const [newExpense, setNewExpense] = (0, import_react.useState)({
		category: "Rent/EMI",
		amount: ""
	});
	const current = data[month] || {
		income: [],
		expenses: []
	};
	const totalIncome = current.income.reduce((s, i) => s + i.amount, 0);
	const totalExpense = current.expenses.reduce((s, e) => s + e.amount, 0);
	const savings = totalIncome - totalExpense;
	const savingsRate = totalIncome > 0 ? Math.round(savings / totalIncome * 100) : 0;
	const save = (next) => {
		setData(next);
		try {
			localStorage.setItem("budget_data", JSON.stringify(next));
		} catch {}
	};
	const addIncome = () => {
		if (!newIncome.source || !newIncome.amount) return;
		const d = {
			...data,
			[month]: {
				...current,
				income: [...current.income, {
					source: newIncome.source,
					amount: parseFloat(newIncome.amount)
				}]
			}
		};
		save(d);
		setNewIncome({
			source: "",
			amount: ""
		});
	};
	const addExpense = () => {
		if (!newExpense.amount) return;
		const d = {
			...data,
			[month]: {
				...current,
				expenses: [...current.expenses, {
					category: newExpense.category,
					amount: parseFloat(newExpense.amount)
				}]
			}
		};
		save(d);
		setNewExpense({
			...newExpense,
			amount: ""
		});
	};
	const removeIncome = (idx) => {
		const d = {
			...data,
			[month]: {
				...current,
				income: current.income.filter((_, i) => i !== idx)
			}
		};
		save(d);
	};
	const removeExpense = (idx) => {
		const d = {
			...data,
			[month]: {
				...current,
				expenses: current.expenses.filter((_, i) => i !== idx)
			}
		};
		save(d);
	};
	const exportCSV = () => {
		let csv = "Type,Category/Source,Amount\n";
		current.income.forEach((i) => {
			csv += `Income,${i.source},${i.amount}\n`;
		});
		current.expenses.forEach((e) => {
			csv += `Expense,${e.category},${e.amount}\n`;
		});
		csv += `\nTotal Income,,${totalIncome}\nTotal Expenses,,${totalExpense}\nSavings,,${savings}\n`;
		const blob = new Blob([csv], { type: "text/csv" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `budget-${month}.csv`;
		a.click();
	};
	const categoryTotals = (0, import_react.useMemo)(() => {
		const map = {};
		current.expenses.forEach((e) => {
			map[e.category] = (map[e.category] || 0) + e.amount;
		});
		return Object.entries(map).sort((a, b) => b[1] - a[1]);
	}, [current.expenses]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Monthly Budget Tracker",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-6 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-foreground",
						children: "Budget Tracker"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Track income vs expenses — all stored locally."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: exportCSV,
						className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Export CSV"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: MONTHS.map((m, i) => {
						const key = `${(/* @__PURE__ */ new Date()).getFullYear()}-${String(i + 1).padStart(2, "0")}`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMonth(key),
							className: `rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${month === key ? "bg-primary/10 text-primary border border-primary/30" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
							children: m
						}, m);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: [
						{
							label: "Income",
							value: `₹${totalIncome.toLocaleString("en-IN")}`,
							color: "text-green"
						},
						{
							label: "Expenses",
							value: `₹${totalExpense.toLocaleString("en-IN")}`,
							color: "text-red"
						},
						{
							label: "Savings",
							value: `₹${savings.toLocaleString("en-IN")}`,
							color: savings >= 0 ? "text-green" : "text-red"
						},
						{
							label: "Savings Rate",
							value: `${savingsRate}%`,
							color: savingsRate >= 20 ? "text-green" : savingsRate >= 0 ? "text-yellow" : "text-red"
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[10px] border border-border bg-surface p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-lg font-bold ${s.color}`,
							children: s.value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground",
							children: s.label
						})]
					}, s.label))
				}),
				totalIncome > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[10px] border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs font-medium text-muted-foreground",
							children: "Income vs Expenses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-6 overflow-hidden rounded-full bg-surface-elevated",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-green transition-all",
									style: { width: `${Math.min(totalExpense / totalIncome * 100, 100)}%` }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-primary/30 transition-all",
									style: { width: `${Math.min(savingsRate, 100)}%` }
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex justify-between text-[10px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-green",
								children: ["Expenses ₹", totalExpense.toLocaleString("en-IN")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-primary",
								children: ["Saved ₹", savings.toLocaleString("en-IN")]
							})]
						})
					]
				}),
				categoryTotals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[10px] border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-xs font-medium text-muted-foreground",
						children: "Category Breakdown"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: categoryTotals.map(([cat, amt]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-28 text-xs text-foreground",
									children: cat
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 h-2 overflow-hidden rounded-full bg-surface-elevated",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-primary/50",
										style: { width: `${amt / totalExpense * 100}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "w-20 text-right text-xs text-muted-foreground",
									children: ["₹", amt.toLocaleString("en-IN")]
								})
							]
						}, cat))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[10px] border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs font-semibold uppercase text-muted-foreground",
							children: "Add Income"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: newIncome.source,
									onChange: (e) => setNewIncome((p) => ({
										...p,
										source: e.target.value
									})),
									placeholder: "Source (Salary, Freelance)",
									className: "h-9 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: newIncome.amount,
									onChange: (e) => setNewIncome((p) => ({
										...p,
										amount: e.target.value
									})),
									placeholder: "₹ Amount",
									className: "h-9 w-32 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: addIncome,
									className: "flex size-9 items-center justify-center rounded-lg bg-green/10 text-green hover:bg-green/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
								})
							]
						}),
						current.income.map((inc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: inc.source
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-green",
									children: ["+₹", inc.amount.toLocaleString("en-IN")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeIncome(idx),
									className: "text-muted-foreground hover:text-red",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
								})]
							})]
						}, idx))
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[10px] border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs font-semibold uppercase text-muted-foreground",
							children: "Add Expense"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: newExpense.category,
									onChange: (e) => setNewExpense((p) => ({
										...p,
										category: e.target.value
									})),
									className: "h-9 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground focus:outline-none",
									children: EXPENSE_CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: newExpense.amount,
									onChange: (e) => setNewExpense((p) => ({
										...p,
										amount: e.target.value
									})),
									placeholder: "₹ Amount",
									className: "h-9 w-32 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: addExpense,
									className: "flex size-9 items-center justify-center rounded-lg bg-red/10 text-red hover:bg-red/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
								})
							]
						}),
						current.expenses.map((exp, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: exp.category
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-red",
									children: ["-₹", exp.amount.toLocaleString("en-IN")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeExpense(idx),
									className: "text-muted-foreground hover:text-red",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
								})]
							})]
						}, idx))
					]
				})
			]
		})
	});
}
//#endregion
export { BudgetTracker as component };
