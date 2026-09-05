import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.bio-CV-SpGCw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function generate(name, role, company, years, skills, achievement, location) {
	const y = years || "several";
	const s = skills || "technology";
	const a = achievement || "delivered impactful projects";
	const c = company || "the industry";
	return {
		twitter: `${role || "Professional"} at ${c} | ${y}+ yrs in ${s} | ${a} | ${location || ""}`.slice(0, 160),
		linkedin: `${name || "I am"} a ${role || "professional"} with ${y} years of experience in ${s}. Currently at ${c}, where I ${a}. Based in ${location || "the world"}, I'm passionate about building products that make a difference. My expertise spans ${s}, and I'm always open to connecting with like-minded professionals.`,
		website: `About ${name || "Me"}\n\n${name || "I am"} is a ${role || "professional"} with ${y}+ years of experience in ${s}. Currently working at ${c}, where ${achievement || "I have delivered impactful projects"}.\n\nBased in ${location || "various locations"}, ${name || "I"} bring a unique perspective to every project, combining technical expertise with creative problem-solving.\n\nWhen not working, ${name || "I"} enjoy exploring new technologies and sharing knowledge with the community.`,
		conference: `${name || "Speaker"} is a ${role || "professional"} at ${c} with ${y} years of experience in ${s}. ${achievement || "They have delivered impactful projects"} and are based in ${location || "the region"}.`
	};
}
function BioGenerator() {
	const [f, setF] = (0, import_react.useState)({
		name: "",
		role: "",
		company: "",
		years: "",
		skills: "",
		achievement: "",
		location: ""
	});
	const update = (k, v) => setF((p) => ({
		...p,
		[k]: v
	}));
	const bios = generate(f.name, f.role, f.company, f.years, f.skills, f.achievement, f.location);
	const [active, setActive] = (0, import_react.useState)("twitter");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(bios[active]);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Bio Generator",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "✍️ Professional Bio Generator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Fill in details → get 4 bio variations for different platforms."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: [
					[
						"name",
						"Full Name",
						"Waseem Ahmed"
					],
					[
						"role",
						"Role",
						"Software Engineer"
					],
					[
						"company",
						"Company",
						"Google"
					],
					[
						"years",
						"Years Experience",
						"5"
					],
					[
						"skills",
						"Top Skills",
						"React, TypeScript, Node.js"
					],
					[
						"achievement",
						"Key Achievement",
						"built products used by millions"
					],
					[
						"location",
						"Location",
						"Hyderabad, India"
					]
				].map(([k, l, p]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-0.5 block text-[10px] text-muted-foreground",
					children: l
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: f[k],
					onChange: (e) => update(k, e.target.value),
					placeholder: p,
					className: "h-8 w-full rounded-lg border border-border bg-surface px-2.5 text-xs focus:outline-none"
				})] }, k))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 flex gap-1",
					children: [
						"twitter",
						"linkedin",
						"website",
						"conference"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActive(t),
						className: `rounded-lg px-2.5 py-1 text-[10px] capitalize transition-colors ${active === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`,
						children: t
					}, t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 min-h-[200px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "whitespace-pre-wrap text-xs leading-relaxed text-foreground",
						children: bios[active]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: copy,
						className: "mt-3 h-8 rounded-lg bg-primary px-3 text-xs text-primary-foreground hover:opacity-90",
						children: copied ? "Copied!" : "Copy"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[10px] text-muted-foreground",
					children: active === "twitter" ? `${bios.twitter.length}/160 characters` : ""
				})
			] })]
		})]
	});
}
//#endregion
export { BioGenerator as component };
