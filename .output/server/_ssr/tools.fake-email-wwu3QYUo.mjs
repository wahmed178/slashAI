import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.fake-email-wwu3QYUo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GuerrillaNote() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 rounded-lg border border-border bg-surface px-3 py-2 text-[11px] text-muted-foreground",
		children: "Inbox powered by guerrillamail.com — may not always be available."
	});
}
function TempEmailGenerator() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [token, setToken] = (0, import_react.useState)("");
	const [sid, setSid] = (0, import_react.useState)("");
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const intervalRef = (0, import_react.useRef)(null);
	const createEmail = async () => {
		setLoading(true);
		try {
			const d = await (await fetch("https://api.guerrillamail.com/ajax.php?f=get_email_address")).json();
			setEmail(d.email_addr);
			setToken(d.token);
			setSid(d.sid_token);
		} catch {}
		setLoading(false);
	};
	const fetchMessages = async () => {
		if (!sid || !token) return;
		try {
			const d = await (await fetch(`https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${sid}&token=${token}`)).json();
			if (d.list) setMessages(d.list);
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		if (email) {
			fetchMessages();
			intervalRef.current = setInterval(fetchMessages, 5e3);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [email]);
	(0, import_react.useEffect)(() => () => {
		if (intervalRef.current) clearInterval(intervalRef.current);
	}, []);
	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(email);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Temp Email",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground",
					children: "📧 Temporary Email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Generate a disposable email address and read incoming messages right here."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuerrillaNote, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-2xl space-y-4",
				children: !email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: createEmail,
					disabled: loading,
					className: "w-full rounded-xl bg-primary py-4 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
					children: loading ? "Generating..." : "Generate Temporary Email"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-primary/20 bg-primary/5 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mb-1",
							children: "Your temporary email:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "flex-1 text-lg font-mono font-bold text-primary",
								children: email
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: copyEmail,
								className: "shrink-0 rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors",
								children: copied ? "✓ Copied" : "Copy"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[10px] text-muted-foreground",
							children: "Emails auto-refresh every 5 seconds. Auto-expires when you leave."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: [
							"Inbox (",
							messages.length,
							")"
						]
					}), messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm text-muted-foreground py-6",
						children: "No emails yet. They'll appear here automatically."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: messages.map((msg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-surface-elevated p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-foreground",
									children: msg.mail_from
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: msg.mail_subject
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground line-clamp-2",
									children: msg.mail_excerpt
								})
							]
						}, i))
					})]
				})] })
			})
		]
	});
}
//#endregion
export { TempEmailGenerator as component };
