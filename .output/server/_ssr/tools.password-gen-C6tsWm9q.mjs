import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.password-gen-C6tsWm9q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PasswordGenerator() {
	const [length, setLength] = (0, import_react.useState)(16);
	const [options, setOptions] = (0, import_react.useState)({
		uppercase: true,
		lowercase: true,
		numbers: true,
		symbols: true
	});
	const [password, setPassword] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const generate = (0, import_react.useCallback)(() => {
		let chars = "";
		if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
		if (options.numbers) chars += "0123456789";
		if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
		if (!chars) {
			setPassword("Select at least one option");
			return;
		}
		const arr = new Uint32Array(length);
		crypto.getRandomValues(arr);
		setPassword(Array.from(arr, (v) => chars[v % chars.length]).join(""));
	}, [length, options]);
	const copy = async () => {
		await navigator.clipboard.writeText(password);
		setCopied(true);
		setTimeout(() => setCopied(false), 1200);
	};
	const strength = password.length >= 20 ? {
		label: "Very Strong",
		color: "text-green"
	} : password.length >= 14 ? {
		label: "Strong",
		color: "text-primary"
	} : password.length >= 8 ? {
		label: "Medium",
		color: "text-yellow"
	} : {
		label: "Weak",
		color: "text-red-400"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Password Generator",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🔐 Password Generator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Generate cryptographically secure random passwords."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-[60px] rounded-lg bg-surface-elevated p-3 flex items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "flex-1 font-mono text-lg text-foreground break-all",
							children: password || "Click Generate"
						})
					}), password && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: `mt-2 text-xs font-medium ${strength.color}`,
						children: [
							strength.label,
							" · ",
							password.length,
							" characters"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Length"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-foreground",
						children: length
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 4,
					max: 64,
					value: length,
					onChange: (e) => setLength(Number(e.target.value)),
					className: "w-full accent-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						["uppercase", "Uppercase (A-Z)"],
						["lowercase", "Lowercase (a-z)"],
						["numbers", "Numbers (0-9)"],
						["symbols", "Symbols (!@#$)"]
					].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 rounded-lg border border-border bg-surface p-2.5 text-xs cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: options[key],
							onChange: (e) => setOptions({
								...options,
								[key]: e.target.checked
							}),
							className: "accent-primary"
						}), label]
					}, key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: generate,
						className: "flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90",
						children: "Generate"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: copy,
						disabled: !password,
						className: "rounded-xl border border-border bg-surface px-6 py-3 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40",
						children: copied ? "✓ Copied" : "Copy"
					})]
				})
			]
		})]
	});
}
//#endregion
export { PasswordGenerator as component };
