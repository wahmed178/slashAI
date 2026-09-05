import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.poll-B7kOZ6xh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PollCreator() {
	const [question, setQuestion] = (0, import_react.useState)("");
	const [options, setOptions] = (0, import_react.useState)(["", ""]);
	const [createdPoll, setCreatedPoll] = (0, import_react.useState)(null);
	const [voted, setVoted] = (0, import_react.useState)(null);
	const addOption = () => {
		if (options.length < 6) setOptions((o) => [...o, ""]);
	};
	const removeOption = (i) => {
		if (options.length > 2) setOptions((o) => o.filter((_, idx) => idx !== i));
	};
	const createPoll = () => {
		if (!question.trim() || options.filter((o) => o.trim()).length < 2) return;
		const poll = {
			id: Math.random().toString(36).slice(2, 8),
			question: question.trim(),
			options: options.filter((o) => o.trim()),
			votes: options.filter((o) => o.trim()).map(() => 0)
		};
		setCreatedPoll(poll);
		setVoted(null);
	};
	const castVote = (idx) => {
		if (!createdPoll || voted !== null) return;
		setVoted(idx);
		setCreatedPoll((p) => p ? {
			...p,
			votes: p.votes.map((v, i) => i === idx ? v + 1 : v)
		} : null);
	};
	const totalVotes = createdPoll ? createdPoll.votes.reduce((s, v) => s + v, 0) : 0;
	const embedCode = createdPoll ? `<iframe src="${window.location.origin}/poll?id=${createdPoll.id}" width="400" height="300" frameborder="0"></iframe>` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Poll Creator",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📊 Instant Poll Creator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Create a poll, share the link, see results as a live bar chart."
			})]
		}), !createdPoll ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs text-muted-foreground",
					children: "Question"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: question,
					onChange: (e) => setQuestion(e.target.value),
					placeholder: "What do you want to ask?",
					className: "h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm focus:border-primary/60 focus:outline-none"
				})] }),
				options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: opt,
						onChange: (e) => {
							const n = [...options];
							n[i] = e.target.value;
							setOptions(n);
						},
						placeholder: `Option ${i + 1}`,
						className: "h-9 flex-1 rounded-lg border border-border bg-surface px-3 text-sm focus:border-primary/60 focus:outline-none"
					}), options.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => removeOption(i),
						className: "h-9 rounded-lg px-2 text-muted-foreground hover:text-red-400",
						children: "×"
					})]
				}, i)),
				options.length < 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: addOption,
					className: "h-8 w-full rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-foreground",
					children: "+ Add option"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: createPoll,
					className: "h-10 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90",
					children: "Create Poll"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-lg font-semibold text-foreground",
					children: createdPoll.question
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: createdPoll.options.map((opt, i) => {
						const pct = totalVotes > 0 ? Math.round((createdPoll.votes[i] ?? 0) / totalVotes * 100) : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => castVote(i),
							disabled: voted !== null,
							className: `relative w-full overflow-hidden rounded-xl border p-3 text-left transition-colors ${voted === i ? "border-primary" : voted !== null ? "border-border" : "border-border hover:border-primary/40"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 bg-primary/10 transition-all duration-500",
								style: { width: voted !== null ? `${pct}%` : "0%" }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-foreground",
									children: opt
								}), voted !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-medium text-primary",
									children: [pct, "%"]
								})]
							})]
						}, i);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-center text-xs text-muted-foreground",
					children: [
						totalVotes,
						" vote",
						totalVotes !== 1 ? "s" : ""
					]
				}),
				voted !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl border border-border bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-semibold text-foreground",
						children: "Embed Code"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "block whitespace-pre-wrap rounded-lg bg-surface-elevated p-2 text-[10px] text-muted-foreground",
						children: embedCode
					})]
				})
			]
		})]
	});
}
//#endregion
export { PollCreator as component };
