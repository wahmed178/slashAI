import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.meta-DlckH8Sf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SEOMetaGenerator() {
	const [f, setF] = (0, import_react.useState)({
		title: "",
		description: "",
		url: "",
		image: "",
		site: "",
		twitter: ""
	});
	const update = (k, v) => setF((p) => ({
		...p,
		[k]: v
	}));
	const tags = `<title>${f.title}</title>\n<meta name="description" content="${f.description}">\n<meta name="robots" content="index, follow">\n<link rel="canonical" href="${f.url}">\n\n<!-- Open Graph -->\n<meta property="og:type" content="website">\n<meta property="og:title" content="${f.title}">\n<meta property="og:description" content="${f.description}">\n<meta property="og:url" content="${f.url}">\n${f.image ? `<meta property="og:image" content="${f.image}">\n` : ""}${f.site ? `<meta property="og:site_name" content="${f.site}">\n` : ""}\n<!-- Twitter Card -->\n<meta name="twitter:card" content="${f.image ? "summary_large_image" : "summary"}">\n<meta name="twitter:title" content="${f.title}">\n<meta name="twitter:description" content="${f.description}">\n${f.twitter ? `<meta name="twitter:site" content="@${f.twitter.replace("@", "")}">\n` : ""}${f.image ? `<meta name="twitter:image" content="${f.image}">\n` : ""}\n\n<!-- Schema.org -->\n<script type="application/ld+json">\n${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: f.title,
		description: f.description,
		url: f.url
	}, null, 2)}\n<\/script>`;
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(tags);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "SEO Meta Tags",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🔍 SEO Meta Tag Generator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Fill in page details → get Open Graph, Twitter Card, and Schema.org tags."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-3",
			children: [[
				[
					"title",
					"Page Title",
					"My Awesome Page"
				],
				[
					"description",
					"Description",
					"A brief description..."
				],
				[
					"url",
					"Page URL",
					"https://example.com/page"
				],
				[
					"image",
					"OG Image URL",
					"https://example.com/image.jpg"
				],
				[
					"site",
					"Site Name",
					"My Site"
				],
				[
					"twitter",
					"Twitter Handle",
					"username"
				]
			].map(([k, l, p]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mb-1 block text-[10px] text-muted-foreground",
				children: l
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: f[k],
				onChange: (e) => update(k, e.target.value),
				placeholder: p,
				className: "h-8 w-full rounded-lg border border-border bg-surface px-2.5 text-xs focus:outline-none"
			})] }, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-foreground",
						children: "Generated Tags"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: copy,
						className: "text-xs text-primary hover:underline",
						children: "Copy All"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-surface-elevated p-3 font-mono text-[10px] leading-relaxed text-foreground",
					children: tags
				})]
			})]
		})]
	});
}
//#endregion
export { SEOMetaGenerator as component };
