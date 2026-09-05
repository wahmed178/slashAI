import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { En as Check, dn as Copy, on as Download } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.namecard-CyMrMag6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NameCard() {
	const [card, setCard] = (0, import_react.useState)({
		name: "",
		role: "",
		company: "",
		email: "",
		phone: "",
		upi: "",
		linkedin: "",
		github: "",
		website: ""
	});
	const [copied, setCopied] = (0, import_react.useState)(false);
	const update = (field, val) => setCard((p) => ({
		...p,
		[field]: val
	}));
	const initials = (0, import_react.useMemo)(() => {
		if (!card.name) return "?";
		return card.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
	}, [card.name]);
	const vcard = (0, import_react.useMemo)(() => {
		return `BEGIN:VCARD\nVERSION:3.0\nFN:${card.name}\nORG:${card.company}\nTITLE:${card.role}\nEMAIL:${card.email}\nTEL:${card.phone}\nURL:${card.website}\nEND:VCARD`;
	}, [card]);
	const downloadVCard = () => {
		const blob = new Blob([vcard], { type: "text/vcard" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `${card.name.replace(/\s+/g, "_")}.vcf`;
		a.click();
	};
	const copyCard = () => {
		const lines = [
			card.name,
			card.role && `${card.role}${card.company ? ` at ${card.company}` : ""}`,
			card.email,
			card.phone,
			card.upi && `UPI: ${card.upi}`,
			card.linkedin,
			card.github,
			card.website
		].filter(Boolean);
		navigator.clipboard.writeText(lines.join("\n"));
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Digital Business Card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-6 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "Digital Business Card"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Create a shareable card. Download as vCard or copy text."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						["name", "Full Name"],
						["role", "Role / Title"],
						["company", "Company"],
						["email", "Email"],
						["phone", "Phone"],
						["upi", "UPI ID"],
						["linkedin", "LinkedIn URL"],
						["github", "GitHub URL"],
						["website", "Website URL"]
					].map(([field, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: card[field],
						onChange: (e) => update(field, e.target.value),
						placeholder: label,
						className: `h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none ${field === "name" ? "col-span-2" : ""}`
					}, field))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-[10px] border border-border bg-surface p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-sm text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary",
								children: initials
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-bold text-foreground",
								children: card.name || "Your Name"
							}),
							card.role && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-primary",
								children: [card.role, card.company ? ` at ${card.company}` : ""]
							}),
							card.company && !card.role && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: card.company
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mx-auto mt-4 space-y-1.5 text-sm",
								children: [
									card.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: ["✉ ", card.email]
									}),
									card.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: ["☎ ", card.phone]
									}),
									card.upi && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: ["💰 ", card.upi]
									}),
									card.linkedin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: ["🔗 ", card.linkedin]
									}),
									card.github && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: ["⚡ ", card.github]
									}),
									card.website && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: ["🌐 ", card.website]
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: downloadVCard,
						className: "flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download vCard"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: copyCard,
						className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground",
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copied!" : "Copy Text"]
					})]
				})
			]
		})
	});
}
//#endregion
export { NameCard as component };
