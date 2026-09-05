import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { F as trackInteraction, _ as commandTemplate, h as cn, m as VERIFIED_TOTAL, r as CATEGORY_ICONS, v as filterCommands, y as getCommand } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Cn as ChevronUp, Dt as Link2Off, E as Sparkles, En as Check, Et as Link2, Gn as ArrowDown, Gt as GripVertical, L as Search, R as Save, Tn as ChevronDown, X as Plus, dn as Copy, i as X, o as Workflow, y as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as categoryIcon } from "./icons-BxDbBHfu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workflow-BWPADbv2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAVED_KEY = "slashai-workflows";
var ACTIVE_KEY = "slashai-workflow-active";
function readJSON(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
function readSaved() {
	const list = readJSON(SAVED_KEY, []);
	return Array.isArray(list) ? list.filter((w) => Boolean(w) && typeof w.id === "string" && typeof w.name === "string" && Array.isArray(w.steps)).map((w) => ({
		...w,
		steps: w.steps.filter((s) => Boolean(s) && typeof s.commandId === "string")
	})) : [];
}
function writeSaved(list) {
	try {
		localStorage.setItem(SAVED_KEY, JSON.stringify(list));
	} catch {}
}
function uid() {
	return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
/** One step's block inside the chained prompt. */
function stepBlock(cmd, no, total, carry, prev) {
	const inputLine = carry && prev ? `Input: <paste the OUTPUT from STEP ${no - 1} (${prev.command}) here — the previous step's final answer>` : "Input: <paste your input here>";
	return [
		`STEP ${no} of ${total} — ${cmd.command}  [${cmd.category}]`,
		`# ${cmd.title}`,
		`What it does: ${cmd.description}`,
		`How to use: ${cmd.howToUse}`,
		"",
		inputLine,
		"Goal: <what a great result looks like>",
		"Constraints: <tone, length, format>",
		"",
		"--- Example of this step ---",
		cmd.example
	].join("\n");
}
function buildChainPrompt(name, resolved) {
	if (resolved.length === 0) return "";
	const total = resolved.length;
	const blocks = resolved.map(({ cmd, carry }, i) => {
		const prev = i > 0 ? resolved[i - 1].cmd : void 0;
		return stepBlock(cmd, i + 1, total, carry, prev);
	});
	return [
		`WORKFLOW — ${name.trim() || "Untitled chain"} (${total} step${total > 1 ? "s" : ""})`,
		"",
		"Run this as ONE continuous session in your AI chat: finish STEP 1 first, then let every later step build on the output you already got. Never restart the conversation between steps.",
		"",
		blocks.join("\n\n"),
		"",
		"---",
		"Built with SlashAI AI Workflows"
	].join("\n");
}
var QUICK_QUERIES = [
	"summarize",
	"plan",
	"write",
	"research",
	"rewrite",
	"email",
	"brainstorm",
	"code"
];
var EMPTY = [];
function WorkflowPage() {
	const [steps, setSteps] = (0, import_react.useState)(EMPTY);
	const [name, setName] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)([]);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [copiedChain, setCopiedChain] = (0, import_react.useState)(false);
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const dragIndex = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const active = readJSON(ACTIVE_KEY, null);
		if (active && Array.isArray(active.steps)) {
			setName(active.name ?? "");
			setSteps(active.steps.filter((s) => Boolean(s) && typeof s.commandId === "string").map((s) => ({
				commandId: s.commandId,
				carry: Boolean(s.carry)
			})));
		}
		setSaved(readSaved());
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		try {
			sessionStorage.setItem(ACTIVE_KEY, JSON.stringify({
				name,
				steps
			}));
		} catch {}
	}, [
		name,
		steps,
		hydrated
	]);
	const resolved = (0, import_react.useMemo)(() => steps.map((s, i) => ({
		cmd: getCommand(s.commandId),
		carry: s.carry,
		index: i
	})).filter((x) => Boolean(x.cmd)), [steps]);
	const results = (0, import_react.useMemo)(() => {
		if (!query.trim()) return [];
		return filterCommands({
			q: query,
			category: "all",
			type: "all",
			difficulty: "all",
			sort: "relevance",
			onlyFavorites: false,
			favorites: []
		}).slice(0, 14);
	}, [query]);
	const addCommand = (cmd) => {
		setSteps((prev) => [...prev, {
			commandId: cmd.id,
			carry: false
		}]);
		trackInteraction(cmd.id, "open", query);
		toast(`${cmd.command} added to the chain`);
	};
	const removeAt = (i) => setSteps((prev) => prev.filter((_, idx) => idx !== i));
	const move = (i, dir) => {
		setSteps((prev) => {
			const next = [...prev];
			const target = i + dir;
			if (target < 0 || target >= next.length) return prev;
			[next[i], next[target]] = [next[target], next[i]];
			return next;
		});
	};
	const toggleCarry = (i) => {
		setSteps((prev) => prev.map((s, idx) => idx === i ? {
			...s,
			carry: i > 0 ? !s.carry : false
		} : s));
	};
	const copyText = async (text, what, key) => {
		if (!text) return;
		try {
			await navigator.clipboard.writeText(text);
			toast(`${what} copied`);
			if (key === "chain") {
				setCopiedChain(true);
				window.setTimeout(() => setCopiedChain(false), 1600);
			} else if (key) {
				setCopiedId(key);
				window.setTimeout(() => setCopiedId(null), 1600);
			}
		} catch {
			toast("Couldn't copy — clipboard not available");
		}
	};
	const saveWorkflow = () => {
		if (steps.length === 0) {
			toast("Add at least one command first");
			return;
		}
		const title = name.trim() || `Workflow — ${resolved[0]?.cmd.command ?? ""}`.trim();
		const wf = {
			id: activeId ?? uid(),
			name: title,
			updatedAt: Date.now(),
			steps
		};
		const list = [...readSaved().filter((w) => w.id !== wf.id), wf].sort((a, b) => b.updatedAt - a.updatedAt);
		writeSaved(list);
		setSaved(list);
		setActiveId(wf.id);
		setName(title);
		toast("Workflow saved on this device");
	};
	const loadWorkflow = (wf) => {
		setSteps(wf.steps.map((s) => ({
			commandId: s.commandId,
			carry: Boolean(s.carry)
		})));
		setName(wf.name);
		setActiveId(wf.id);
		setSaved(readSaved());
		toast(`Loaded “${wf.name}”`);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	const deleteWorkflow = (id) => {
		const list = readSaved().filter((w) => w.id !== id);
		writeSaved(list);
		setSaved(list);
		if (activeId === id) setActiveId(null);
		toast("Workflow deleted");
	};
	const clearChain = () => {
		setSteps([]);
		setActiveId(null);
		setName("");
		toast("Chain cleared");
	};
	const chainText = (0, import_react.useMemo)(() => buildChainPrompt(name, resolved.map((r) => ({
		cmd: r.cmd,
		carry: r.carry
	}))), [name, resolved]);
	const charCount = chainText.length;
	const tokenEstimate = Math.max(1, Math.round(charCount / 4));
	const inChainCount = (id) => steps.filter((s) => s.commandId === id).length;
	const handleDrop = (toIndex) => {
		const from = dragIndex.current;
		dragIndex.current = null;
		if (from === null || from === toIndex) return;
		setSteps((prev) => {
			const next = [...prev];
			const [moved] = next.splice(from, 1);
			if (!moved) return prev;
			next.splice(toIndex, 0, moved);
			return next;
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		title: "AI Workflows",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "flex items-center gap-2 text-2xl font-black tracking-tight text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workflow, {
						className: "size-6 text-primary",
						"aria-hidden": true
					}), " AI Workflows"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary",
					children: "New"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted-foreground",
				children: "Chain SlashAI commands into a single runnable prompt. Pick the steps, set the order, and let each step build on the previous one — then copy the whole workflow into any AI chat."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel rounded-xl p-3 sm:p-4 lg:sticky lg:top-4 lg:self-start",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "size-3.5 text-primary",
							"aria-hidden": true
						}), " Add a step"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3 focus-within:border-primary/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								className: "size-4 shrink-0 text-muted-foreground",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (e) => setQuery(e.target.value),
								type: "text",
								placeholder: `Search ${VERIFIED_TOTAL.toLocaleString()} commands…`,
								className: "w-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
							}),
							query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Clear search",
								onClick: () => setQuery(""),
								className: "text-muted-foreground transition-colors hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})
						]
					}),
					query.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 flex max-h-[420px] flex-col gap-1 overflow-y-auto pr-0.5",
						children: results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg border border-border bg-surface px-3 py-6 text-center text-xs text-muted-foreground",
							children: [
								"No command matches “",
								query,
								"”."
							]
						}) : results.map((cmd) => {
							const Icon = categoryIcon(CATEGORY_ICONS[cmd.category]);
							const inChain = inChainCount(cmd.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => addCommand(cmd),
								className: "flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-2 text-left transition-colors hover:border-border hover:bg-surface focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											className: "size-4",
											"aria-hidden": true
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate font-mono text-[13px] font-semibold text-foreground",
											children: cmd.command
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block truncate text-[11px] text-muted-foreground",
											children: [
												cmd.title,
												" · ",
												cmd.category
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("flex size-6 shrink-0 items-center justify-center rounded-md transition-colors", inChain > 0 ? "bg-primary/15 text-primary" : "bg-surface-elevated text-muted-foreground"),
										children: inChain > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] font-bold",
											children: [inChain, "×"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
											className: "size-4",
											"aria-hidden": true
										})
									})
								]
							}) }, cmd.id);
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Try one of these:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 flex flex-wrap gap-1.5",
								children: QUICK_QUERIES.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setQuery(q),
									className: "rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
									children: q
								}, q))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 rounded-lg border border-dashed border-border bg-surface/60 p-4 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									className: "mx-auto size-5 text-primary",
									"aria-hidden": true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs leading-relaxed text-muted-foreground",
									children: [
										"Search for what you want each step to do — ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "summarize" }),
										", ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "rewrite" }),
										",",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "plan" }),
										"… — then tap a result to add it."
									]
								})]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel rounded-xl p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: name,
										onChange: (e) => setName(e.target.value),
										type: "text",
										placeholder: "Name this workflow (e.g. Research → Draft → Polish)",
										className: "h-10 min-w-[180px] flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void copyText(chainText, "Workflow prompt", "chain"),
										disabled: resolved.length === 0,
										className: "flex h-10 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-bold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
										children: [
											copiedChain ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden sm:inline",
												children: copiedChain ? "Copied!" : "Copy chain prompt"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "sm:hidden",
												children: "Copy"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: saveWorkflow,
										disabled: steps.length === 0,
										className: "flex h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), " Save"]
									}),
									steps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: clearChain,
										className: "flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-[13px] text-muted-foreground transition-colors hover:text-red-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Clear"]
									})
								]
							}),
							steps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 pt-2 text-[11px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: steps.length
										}),
										" step",
										steps.length > 1 ? "s" : ""
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"≈ ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: charCount.toLocaleString()
										}),
										" characters · ~",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: tokenEstimate.toLocaleString()
										}),
										" tokens"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Drag cards or use ↑ ↓ to reorder"
									})
								]
							}),
							saved.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "Saved:"
								}), saved.map((wf) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-colors", activeId === wf.id ? "border-primary/50 bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => loadWorkflow(wf),
										className: "font-medium hover:text-foreground",
										children: wf.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": `Delete ${wf.name}`,
										onClick: () => deleteWorkflow(wf.id),
										className: "rounded-full p-0.5 hover:bg-accent hover:text-red-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
									})]
								}, wf.id))]
							})
						]
					}),
					resolved.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel mt-4 flex flex-col items-center rounded-xl px-6 py-14 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workflow, {
									className: "size-7",
									"aria-hidden": true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 text-base font-bold text-foreground",
								children: "Build your first chain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-sm text-[13px] leading-relaxed text-muted-foreground",
								children: "Search for a command on the left and tap it to add a step. Steps run top to bottom — add “uses previous output” when a step needs the result of the one before it."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex gap-1.5",
								children: [
									"STEP 1",
									"STEP 2",
									"STEP 3"
								].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground",
									children: [s, i < 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
										className: "size-3 text-primary",
										"aria-hidden": true
									})]
								}, s))
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 flex flex-col gap-2",
						children: resolved.map(({ cmd, carry, index }, i) => {
							const Icon = categoryIcon(CATEGORY_ICONS[cmd.category]);
							const prevCmd = i > 0 ? resolved[i - 1].cmd : void 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								draggable: true,
								onDragStart: (e) => {
									dragIndex.current = i;
									e.dataTransfer.effectAllowed = "move";
								},
								onDragOver: (e) => e.preventDefault(),
								onDrop: (e) => {
									e.preventDefault();
									handleDrop(i);
								},
								className: "panel group flex items-start gap-3 rounded-xl p-3 transition-colors hover:border-primary/40 sm:items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex shrink-0 flex-col items-center gap-1 self-center sm:flex-row sm:gap-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex size-7 items-center justify-center rounded-lg bg-primary/15 font-mono text-[12px] font-bold text-primary",
											children: i + 1
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "cursor-grab text-muted-foreground/70 transition-colors group-hover:text-foreground sm:ml-1 active:cursor-grabbing",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, {
												className: "size-4",
												"aria-hidden": true
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-x-2 gap-y-0.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate font-mono text-sm font-bold text-primary",
														children: cmd.command
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-md border border-border bg-surface-elevated px-1.5 py-0.5 text-[10px] text-muted-foreground",
														children: cmd.category
													}),
													carry && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, {
																className: "size-3",
																"aria-hidden": true
															}),
															" feeds from step ",
															i
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 line-clamp-1 text-xs text-muted-foreground",
												children: cmd.description
											}),
											prevCmd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 line-clamp-1 font-mono text-[10px] text-muted-foreground/70",
												children: ["↓ ", prevCmd.command]
											}),
											i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => toggleCarry(i),
												"aria-pressed": carry,
												className: cn("mt-1.5 inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none", carry ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
												children: [
													carry ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, {
														className: "size-3.5",
														"aria-hidden": true
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2Off, {
														className: "size-3.5",
														"aria-hidden": true
													}),
													carry ? "Uses" : "Use",
													" output of step ",
													i,
													" as its input"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex shrink-0 items-center gap-0.5 self-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden sm:block",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
													className: "size-4 text-muted-foreground",
													"aria-hidden": true
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "ml-1 flex flex-col sm:flex-row",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Move up",
													disabled: i === 0,
													onClick: () => move(i, -1),
													className: "rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Move down",
													disabled: i === resolved.length - 1,
													onClick: () => move(i, 1),
													className: "rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": `Copy ${cmd.command} template`,
												onClick: () => {
													copyText(commandTemplate(cmd), `${cmd.command} template`, cmd.id);
													trackInteraction(cmd.id, "copy");
												},
												className: "rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
												children: copiedId === cmd.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": `Remove step ${i + 1}`,
												onClick: () => removeAt(i),
												className: "rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-red-400",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
											})
										]
									})
								]
							}, `${cmd.id}-${index}`);
						})
					}),
					resolved.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "panel mt-4 rounded-xl p-3.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "min-w-0 flex-1 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: "How it works:"
									}),
									" copy the chain prompt, paste it into any AI chat, then complete each step in order — steps marked",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "“uses output”"
									}),
									" expect you to paste the previous answer where the prompt says."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => void copyText(chainText, "Workflow prompt", "chain"),
								className: "flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-background transition-opacity hover:opacity-90",
								children: [copiedChain ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copiedChain ? "Copied!" : "Copy chain prompt"]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-[11px] text-muted-foreground",
						children: [
							"Everything stays on this device — no account, no uploads.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/search",
								className: "text-primary hover:underline",
								children: [
									"Or browse all ",
									VERIFIED_TOTAL.toLocaleString(),
									" commands →"
								]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { WorkflowPage as component };
