import { o as __toESM } from "../_runtime.mjs";
import { a as recordRun, i as readRunCount, r as getGenerator, t as GENERATORS } from "./generators-BQMEiZJM.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn, n as Button } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Cn as ChevronUp, En as Check, Tn as ChevronDown, Wn as ArrowLeft, bt as LoaderCircle, dn as Copy } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, o as recordType, s as stringType } from "../_libs/zod.mjs";
import { t as Input } from "./input-DFGjVhGW.mjs";
import { t as Textarea } from "./textarea-B8ksLbD-.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-DSyYfJsl.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Markdown } from "./Markdown-C4_Kb83X.mjs";
import { t as Route } from "./generators._id-C9x5K1Ji.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generators._id-3iftnJ4p.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var runGenerator = createServerFn({ method: "POST" }).validator((data) => objectType({
	id: stringType().min(1),
	fields: recordType(stringType(), stringType().max(4e3))
}).parse(data)).handler(createSsrRpc("feec07b1db669a751b6f29024ff26053d66345e81c5d707ed4c070c164228953"));
function GeneratorPage() {
	const { id } = Route.useParams();
	const gen = getGenerator(id);
	const run = useServerFn(runGenerator);
	const initial = (0, import_react.useMemo)(() => {
		const out = {};
		for (const f of gen.fields) out[f.name] = f.type === "select" ? f.options?.[0] ?? "" : "";
		return out;
	}, [gen]);
	const [values, setValues] = (0, import_react.useState)(initial);
	const [markdown, setMarkdown] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const valid = gen.fields.every((f) => !f.required || (values[f.name]?.trim().length ?? 0) > 2);
	async function submit() {
		if (readRunCount() >= 5) {
			setError(`You've used all 5 free generations today. They reset at midnight UTC.`);
			return;
		}
		setLoading(true);
		setError(null);
		setMarkdown(null);
		try {
			const res = await run({ data: {
				id,
				fields: values
			} });
			setMarkdown(res.markdown);
			recordRun();
		} catch (e) {
			setError(e instanceof Error && e.message.length < 160 ? e.message : "Generation failed. Try again in a moment.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: gen.title,
		back: {
			to: "/generators",
			label: "AI Toolkit"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-3xl",
				"aria-hidden": true,
				children: gen.emoji
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-black tracking-tight text-foreground",
				children: gen.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: gen.tagline
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 space-y-4",
			children: [
				gen.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mb-1.5 block text-sm font-medium text-foreground",
						children: [f.label, f.required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-0.5 text-primary",
							children: "*"
						}) : null]
					}), f.type === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 3,
						placeholder: f.placeholder,
						value: values[f.name] ?? "",
						onChange: (e) => setValues((v) => ({
							...v,
							[f.name]: e.target.value
						}))
					}) : f.type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						...values[f.name] ? { value: values[f.name] } : {},
						onValueChange: (val) => setValues((v) => ({
							...v,
							[f.name]: val
						})),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: `Choose ${f.label.toLowerCase()}` })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (f.options ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: o,
							children: o
						}, o)) })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: f.placeholder,
						value: values[f.name] ?? "",
						onChange: (e) => setValues((v) => ({
							...v,
							[f.name]: e.target.value
						}))
					})]
				}, f.name)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: submit,
					disabled: !valid || loading,
					className: "min-h-11 w-full",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						className: "size-4 animate-spin",
						"aria-hidden": true
					}), " Generating…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Generate with Claude" })
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive",
					children: error
				}) : null,
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "panel animate-pulse rounded-2xl p-6 text-sm text-muted-foreground",
					children: "Thinking through your brief…"
				}) : null,
				markdown ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-label": "Generated result",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-bold tracking-wide text-muted-foreground uppercase",
							children: "Your draft"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								navigator.clipboard.writeText(markdown);
								toast.success("Copied to clipboard");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
								className: "mr-1.5 size-3.5",
								"aria-hidden": true
							}), " Copy"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						className: "panel mt-2 rounded-2xl p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { source: markdown })
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/generators",
					className: "flex min-h-10 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
						className: "size-4",
						"aria-hidden": true
					}), " All generators"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pb-2 text-center text-xs text-muted-foreground",
					children: [
						GENERATORS.length,
						" generators · ",
						5,
						" free runs per day"
					]
				})
			]
		})]
	});
}
//#endregion
export { GeneratorPage as component };
