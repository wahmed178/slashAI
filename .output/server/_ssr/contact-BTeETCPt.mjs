import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-BTeETCPt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const handleSubmit = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		if (!name.trim() || !email.trim() || !body.trim()) return;
		const msg = {
			id: crypto.randomUUID(),
			name: name.trim(),
			email: email.trim(),
			subject: subject.trim() || "No subject",
			body: body.trim(),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const existing = JSON.parse(localStorage.getItem("slashai-messages") || "[]");
		existing.push(msg);
		localStorage.setItem("slashai-messages", JSON.stringify(existing));
		setSubmitted(true);
	}, [
		name,
		email,
		subject,
		body
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		hideHeaderSearch: true,
		title: "Contact",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-xl pt-2 pb-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground",
					children: "Contact us"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Feedback, bugs, feature requests, or just say hello. We read every message."
				})] }),
				submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl",
							children: "📬"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm font-medium text-green-500",
							children: "Message saved!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Stored locally on this device. Since SlashAI has no backend server, we can't receive emails — but your message is saved here. Thank you for the feedback!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setSubmitted(false);
								setName("");
								setEmail("");
								setSubject("");
								setBody("");
							},
							className: "mt-4 text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors",
							children: "Send another message"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "contact-name",
							className: "block text-xs font-medium text-muted-foreground",
							children: "Name *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "contact-name",
							type: "text",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Your name",
							required: true,
							className: "mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "contact-email",
							className: "block text-xs font-medium text-muted-foreground",
							children: "Email *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "contact-email",
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "you@example.com",
							required: true,
							className: "mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "contact-subject",
							className: "block text-xs font-medium text-muted-foreground",
							children: "Subject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "contact-subject",
							type: "text",
							value: subject,
							onChange: (e) => setSubject(e.target.value),
							placeholder: "Bug report, feature request, feedback…",
							className: "mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "contact-body",
							className: "block text-xs font-medium text-muted-foreground",
							children: "Message *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "contact-body",
							value: body,
							onChange: (e) => setBody(e.target.value),
							placeholder: "Tell us what's on your mind…",
							required: true,
							rows: 5,
							className: "mt-1.5 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground/60",
								children: "* Required fields"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: !name.trim() || !email.trim() || !body.trim(),
								className: "rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-40",
								children: "Send message"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10 border-t border-border pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-foreground",
						children: "Other ways to reach us"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "mailto:hello@slashai.app",
							className: "flex items-center gap-3 rounded-lg border border-border bg-surface p-3 text-sm text-foreground transition-colors hover:border-primary/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg",
								children: "✉️"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "hello@slashai.app"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "https://github.com/wahmed178/slashAI/issues",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "flex items-center gap-3 rounded-lg border border-border bg-surface p-3 text-sm text-foreground transition-colors hover:border-primary/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg",
								children: "🐙"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: "GitHub Issues"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Report bugs or request features"
							})] })]
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { ContactPage as component };
