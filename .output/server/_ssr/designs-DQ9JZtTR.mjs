import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { I as useLibrary } from "./slashkits-CB7bx4DD.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/designs-DQ9JZtTR.js
var import_jsx_runtime = require_jsx_runtime();
var DESIGNS = [
	{
		id: "linear",
		name: "Linear",
		brand: "Linear.app",
		description: "Ultra-minimal dark canvas with lavender-blue accent. Dense, technical, quietly luxurious.",
		accent: "#5e6ad2",
		accentLabel: "Lavender Blue",
		vibe: "Developer productivity",
		bgPreview: "#010102",
		surfacePreview: "#0f1011",
		borderPreview: "#23252a",
		features: [
			"Near-pure black canvas (#010102)",
			"4-step surface ladder",
			"Hairline borders only",
			"Negative tracking display",
			"Single chromatic accent"
		]
	},
	{
		id: "notion",
		name: "Notion",
		brand: "Notion",
		description: "Confident, illustration-rich brand voice with deep navy hero and signature purple CTA.",
		accent: "#5645d4",
		accentLabel: "Notion Purple",
		vibe: "All-in-one workspace",
		bgPreview: "#0a1530",
		surfacePreview: "#1a2a52",
		borderPreview: "#2a3a62",
		features: [
			"Deep navy hero band",
			"Signature purple pill CTA",
			"Pastel feature cards",
			"8px rectangular buttons",
			"Notion-Sans typography"
		]
	},
	{
		id: "vercel",
		name: "Vercel",
		brand: "Vercel",
		description: "Black-and-white precision with a multi-color mesh gradient at hero scale.",
		accent: "#171717",
		accentLabel: "Ink Black",
		vibe: "Frontend platform",
		bgPreview: "#fafafa",
		surfacePreview: "#ffffff",
		borderPreview: "#ebebeb",
		features: [
			"Near-white canvas",
			"Ink-near-black primary",
			"Multi-color mesh gradient",
			"Geist font family",
			"Stacked shadow elevation"
		]
	},
	{
		id: "stripe",
		name: "Stripe",
		brand: "Stripe",
		description: "Financial infrastructure brand with electric indigo primary and atmospheric gradient mesh.",
		accent: "#533afd",
		accentLabel: "Electric Indigo",
		vibe: "Payment infrastructure",
		bgPreview: "#ffffff",
		surfacePreview: "#f6f9fc",
		borderPreview: "#e3e8ee",
		features: [
			"Gradient mesh hero backdrop",
			"Indigo primary CTA",
			"Thin weight typography (300)",
			"Tabular figures for money",
			"Cream band interludes"
		]
	},
	{
		id: "supabase",
		name: "Supabase",
		brand: "Supabase",
		description: "Clean white canvas with a single signature emerald-green CTA. Quietly technical.",
		accent: "#3ecf8e",
		accentLabel: "Emerald Green",
		vibe: "Open-source database",
		bgPreview: "#ffffff",
		surfacePreview: "#fafafa",
		borderPreview: "#dfdfdf",
		features: [
			"White canvas marketing",
			"Single emerald primary",
			"Product UI mockups",
			"6px button radii",
			"Code blocks in dark"
		]
	},
	{
		id: "framer",
		name: "Framer",
		brand: "Framer",
		description: "Confident dark-canvas builder with white display type and vibrant gradient spotlight cards.",
		accent: "#ffffff",
		accentLabel: "Pure White",
		vibe: "Website builder",
		bgPreview: "#090909",
		surfacePreview: "#141414",
		borderPreview: "#262626",
		features: [
			"Pure black canvas",
			"White pill CTAs",
			"Gradient spotlight cards",
			"Massive negative tracking",
			"Inter Variable body type"
		]
	}
];
function DesignsPage() {
	const { settings, updateSettings } = useLibrary();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Designs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
					children: "Designs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: "Complete design systems inspired by the world's best products — Linear, Notion, Vercel, Stripe, Supabase and Framer. Click any design to apply it instantly. Every design is free."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: DESIGNS.map((design) => {
					const isActive = settings.theme === design.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							updateSettings({ theme: design.id });
						},
						className: `group relative overflow-hidden rounded-xl border text-left transition-all duration-200 ${isActive ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40 hover:shadow-lg"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-24 items-end gap-0 overflow-hidden",
							style: { background: design.bgPreview },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full w-1/4",
									style: { background: design.surfacePreview }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full w-1/4",
									style: {
										background: design.surfacePreview,
										borderLeft: `1px solid ${design.borderPreview}`
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-full w-2/4 items-center justify-center",
									style: { background: design.bgPreview },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-md px-3 py-1 text-xs font-semibold",
										style: {
											background: design.accent,
											color: design.id === "vercel" || design.id === "supabase" ? "#ffffff" : design.accent === "#ffffff" ? "#000000" : "#ffffff"
										},
										children: "Get Started"
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-semibold text-foreground",
										children: design.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: design.vibe
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-4 rounded-full",
										style: { background: design.accent },
										title: design.accentLabel
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs leading-relaxed text-muted-foreground",
									children: design.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-wrap gap-1",
									children: design.features.slice(0, 3).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground",
										children: f
									}, f))
								}),
								isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex h-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-medium text-primary",
									children: "✓ Active"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex h-8 items-center justify-center rounded-lg border border-border bg-surface-elevated text-xs font-medium text-foreground transition-colors group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary",
									children: ["Apply ", design.name]
								})
							]
						})]
					}, design.id);
				})
			}),
			settings.theme !== "dark" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => updateSettings({ theme: "dark" }),
					className: "inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-xs text-muted-foreground transition-colors hover:text-foreground",
					children: "Reset to Dark theme"
				})
			})
		]
	});
}
//#endregion
export { DesignsPage as component };
