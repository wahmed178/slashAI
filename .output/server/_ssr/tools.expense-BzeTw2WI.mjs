import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.expense-BzeTw2WI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function minimizeTransactions(balances) {
	const txns = [];
	const debtors = [];
	const creditors = [];
	balances.forEach((amt, name) => {
		if (amt < -.01) debtors.push({
			name,
			amount: -amt
		});
		else if (amt > .01) creditors.push({
			name,
			amount: amt
		});
	});
	debtors.sort((a, b) => b.amount - a.amount);
	creditors.sort((a, b) => b.amount - a.amount);
	let i = 0, j = 0;
	while (i < debtors.length && j < creditors.length) {
		const d = debtors[i], c = creditors[j];
		const amt = Math.min(d.amount, c.amount);
		if (amt > .01) txns.push({
			from: d.name,
			to: c.name,
			amount: Math.round(amt)
		});
		d.amount -= amt;
		c.amount -= amt;
		if (d.amount < .01) i++;
		if (c.amount < .01) j++;
	}
	return txns;
}
function ExpenseSplitter() {
	const [event, setEvent] = (0, import_react.useState)("");
	const [people, setPeople] = (0, import_react.useState)([]);
	const [personName, setPersonName] = (0, import_react.useState)("");
	const [expenses, setExpenses] = (0, import_react.useState)([]);
	const [expDesc, setExpDesc] = (0, import_react.useState)("");
	const [expAmount, setExpAmount] = (0, import_react.useState)("");
	const [expPaidBy, setExpPaidBy] = (0, import_react.useState)("");
	const addPerson = () => {
		if (!personName.trim()) return;
		setPeople((p) => [...p, {
			id: crypto.randomUUID(),
			name: personName.trim()
		}]);
		setPersonName("");
	};
	const addExpense = () => {
		if (!expDesc.trim() || !expAmount || !expPaidBy) return;
		setExpenses((e) => [...e, {
			id: crypto.randomUUID(),
			desc: expDesc.trim(),
			amount: parseFloat(expAmount),
			paidBy: expPaidBy
		}]);
		setExpDesc("");
		setExpAmount("");
	};
	const removeExpense = (id) => setExpenses((e) => e.filter((x) => x.id !== id));
	const transactions = (0, import_react.useMemo)(() => {
		if (!people.length || !expenses.length) return [];
		const perPerson = expenses.reduce((s, e) => s + e.amount, 0) / people.length;
		const balances = new Map(people.map((p) => [p.name, 0]));
		expenses.forEach((e) => {
			balances.set(e.paidBy, (balances.get(e.paidBy) || 0) + e.amount);
		});
		people.forEach((p) => {
			balances.set(p.name, (balances.get(p.name) || 0) - perPerson);
		});
		return minimizeTransactions(balances);
	}, [people, expenses]);
	const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
	const perPerson = people.length > 0 ? totalSpent / people.length : 0;
	const handleCopy = async () => {
		let text = `💰 ${event || "Expense Split"}\n\n`;
		text += `Total: ₹${totalSpent} | Per person: ₹${Math.round(perPerson)}\n\n`;
		text += `Expenses:\n`;
		expenses.forEach((e) => {
			text += `• ${e.desc}: ₹${e.amount} (paid by ${e.paidBy})\n`;
		});
		text += `\nSettlements:\n`;
		transactions.forEach((t) => {
			text += `→ ${t.from} pays ${t.to} ₹${t.amount}\n`;
		});
		try {
			await navigator.clipboard.writeText(text);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Expense Splitter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "💸 Trip Expense Splitter"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Split expenses fairly. Calculates minimum transactions to settle."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs text-muted-foreground",
						children: "Event Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: event,
						onChange: (e) => setEvent(e.target.value),
						placeholder: "e.g. Goa Trip 2026",
						className: "h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary/60 focus:outline-none"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-xs font-semibold text-foreground",
								children: "People"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: personName,
									onChange: (e) => setPersonName(e.target.value),
									onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), addPerson()),
									placeholder: "Add person...",
									className: "h-8 flex-1 rounded-lg border border-border bg-surface-elevated px-2.5 text-xs focus:border-primary/60 focus:outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: addPerson,
									className: "h-8 rounded-lg bg-primary px-3 text-xs text-primary-foreground",
									children: "Add"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-1",
								children: people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 rounded-md bg-surface-elevated px-2 py-0.5 text-[10px]",
									children: [p.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setPeople((pe) => pe.filter((x) => x.id !== p.id));
											setExpenses((ex) => ex.filter((e) => e.paidBy !== p.name));
										},
										className: "text-muted-foreground hover:text-red-400",
										children: "×"
									})]
								}, p.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-xs font-semibold text-foreground",
								children: "Add Expense"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: expDesc,
										onChange: (e) => setExpDesc(e.target.value),
										placeholder: "Description",
										className: "h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: expAmount,
										onChange: (e) => setExpAmount(e.target.value),
										placeholder: "Amount ₹",
										className: "h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: expPaidBy,
										onChange: (e) => setExpPaidBy(e.target.value),
										className: "h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Paid by"
										}), people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: p.name,
											children: p.name
										}, p.id))]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: addExpense,
								className: "mt-2 h-8 w-full rounded-lg bg-surface-elevated text-xs font-medium text-foreground hover:bg-accent",
								children: "+ Add Expense"
							}),
							expenses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 space-y-1",
								children: expenses.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-lg bg-surface-elevated px-2.5 py-1.5 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.desc }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [
												"₹",
												e.amount,
												" · ",
												e.paidBy
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => removeExpense(e.id),
											className: "text-muted-foreground hover:text-red-400",
											children: "×"
										})]
									})]
								}, e.id))
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 text-sm font-semibold text-foreground",
							children: "Summary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-surface-elevated p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xl font-bold text-primary",
									children: ["₹", totalSpent]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "Total Spent"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-surface-elevated p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xl font-bold text-foreground",
									children: ["₹", Math.round(perPerson)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "Per Person"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 text-sm font-semibold text-foreground",
							children: "💸 Settlements"
						}), transactions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: transactions.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: t.from
										}),
										" pays ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: t.to
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-bold text-primary",
									children: ["₹", t.amount]
								})]
							}, i))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Add people and expenses to see settlements"
						})]
					}),
					transactions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleCopy,
						className: "h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90",
						children: "Copy Summary"
					})
				]
			})]
		})]
	});
}
//#endregion
export { ExpenseSplitter as component };
