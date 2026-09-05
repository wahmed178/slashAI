import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.meeting-D3Ou0aT7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatMeetingNotes(raw) {
	const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
	const decisions = [];
	const actions = [];
	let budget = "";
	let nextMeeting = "";
	const notes = [];
	for (const line of lines) {
		const lower = line.toLowerCase();
		if (lower.match(/budget|cost|price|spend|rupee|inr|usd|\$|₹/)) {
			const match = line.match(/([\d,]+(?:\.\d+)?)\s*(k|lakh|lac|crore)?/i);
			if (match) {
				budget = match[0].trim();
				continue;
			}
		}
		if (lower.match(/next\s+(meeting|call|sync|standup|huddle)/)) {
			nextMeeting = line.replace(/^[-*•]\s*/, "").replace(/^(sarah|john|team|everyone|we|i)\s+(said|mentioned|noted|agreed|will|should)\s*/i, "").trim();
			continue;
		}
		const actionMatch = line.match(/^[-*•]?\s*(\w+)\s+(will|should|needs? to|is going to|gonna|has to|can|shall)\s+(.+)/i);
		if (actionMatch) {
			actions.push({
				person: capitalize(actionMatch[1] ?? ""),
				task: (actionMatch[3] ?? "").trim().replace(/\.$/, "")
			});
			continue;
		}
		if (lower.match(/decided|agreed|approved|confirmed|resolved|conclusion|the plan/)) {
			decisions.push(line.replace(/^[-*•]\s*/, "").replace(/^(we|the team|everyone|i)\s+(decided|agreed|confirmed)\s*/i, "").trim());
			continue;
		}
		if (lower.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/) || lower.match(/\b\d{1,2}:\d{2}\s*(am|pm)?\b/i)) {
			nextMeeting = line.replace(/^[-*•]\s*/, "").trim();
			continue;
		}
		notes.push(line.replace(/^[-*•]\s*/, "").trim());
	}
	return {
		decisions,
		actions,
		budget,
		nextMeeting,
		notes
	};
}
function capitalize(s) {
	return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
var SAMPLE = `john said we need to finish the report by friday
sarah will handle the design
budget is 50k
next meeting tuesday 3pm
we decided to use react for the frontend
ahmed should review the api documentation
team agreed on the new naming convention`;
function MeetingNotesFormatter() {
	const [input, setInput] = (0, import_react.useState)("");
	const result = (0, import_react.useMemo)(() => input.trim() ? formatMeetingNotes(input) : null, [input]);
	const handleCopy = async () => {
		if (!result) return;
		let md = "";
		if (result.decisions.length) {
			md += "**Decisions Made:**\n";
			result.decisions.forEach((d) => {
				md += `→ ${d}\n`;
			});
			md += "\n";
		}
		if (result.actions.length) {
			md += "**Action Items:**\n";
			result.actions.forEach((a) => {
				md += `→ ${a.person} — ${a.task}\n`;
			});
			md += "\n";
		}
		if (result.budget) md += `**Budget:** ₹${result.budget}\n\n`;
		if (result.nextMeeting) md += `**Next Meeting:** ${result.nextMeeting}\n\n`;
		if (result.notes.length) {
			md += "**Notes:**\n";
			result.notes.forEach((n) => {
				md += `• ${n}\n`;
			});
		}
		try {
			await navigator.clipboard.writeText(md);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Meeting Notes",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📋 Meeting Notes Formatter"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Paste messy meeting notes → get clean decisions, action items, and budget."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-medium text-foreground",
					children: "Raw Meeting Notes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setInput(SAMPLE),
					className: "text-xs text-primary hover:underline",
					children: "Load example"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: input,
				onChange: (e) => setInput(e.target.value),
				rows: 12,
				placeholder: "Paste your messy meeting notes here...",
				className: "w-full rounded-xl border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold text-foreground",
							children: "Formatted Output"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleCopy,
							className: "text-xs text-primary hover:underline",
							children: "Copy as Markdown"
						})]
					}),
					result.decisions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-1 text-xs font-semibold text-primary",
							children: "✓ Decisions Made"
						}), result.decisions.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "ml-3 text-sm text-foreground",
							children: ["→ ", d]
						}, i))]
					}),
					result.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-1 text-xs font-semibold text-primary",
							children: "⚡ Action Items"
						}), result.actions.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "ml-3 text-sm text-foreground",
							children: [
								"→ ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: a.person
								}),
								" — ",
								a.task
							]
						}, i))]
					}),
					result.budget && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-1 text-xs font-semibold text-primary",
							children: "💰 Budget"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "ml-3 text-sm text-foreground",
							children: result.budget
						})]
					}),
					result.nextMeeting && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-1 text-xs font-semibold text-primary",
							children: "📅 Next Meeting"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "ml-3 text-sm text-foreground",
							children: result.nextMeeting
						})]
					}),
					result.notes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-1 text-xs font-semibold text-primary",
							children: "📝 Notes"
						}), result.notes.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "ml-3 text-sm text-foreground",
							children: ["• ", n]
						}, i))]
					}),
					result.decisions.length === 0 && result.actions.length === 0 && !result.budget && !result.nextMeeting && result.notes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No patterns detected. Try adding more specific notes."
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-20 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg",
						children: "📋"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Paste notes on the left to format"
					})]
				})
			})]
		})]
	});
}
//#endregion
export { MeetingNotesFormatter as component };
