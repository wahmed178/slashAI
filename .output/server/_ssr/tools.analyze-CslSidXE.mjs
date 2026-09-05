import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn, n as Button } from "./slashkits-CB7bx4DD.mjs";
import { En as Check, L as Search, N as ShieldAlert, _ as TriangleAlert, bt as LoaderCircle, i as X, q as RefreshCw, qt as Globe } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.analyze-CslSidXE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PROXY_RAW = (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`;
var PROXY_GET = (u) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`;
async function fetchWithTimeout(url, ms = 18e3) {
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), ms);
	try {
		return await fetch(url, { signal: ctrl.signal });
	} finally {
		clearTimeout(t);
	}
}
function normUrl(input) {
	return `https://${input.trim().replace(/^https?:\/\//i, "")}`;
}
function hostnameOf(url) {
	try {
		return new URL(url).hostname;
	} catch {
		return url;
	}
}
/** crude but honest fingerprinting from raw HTML — no external service needed */
function detectTech(html, headers) {
	const out = [];
	const has = (re, tech, detail) => {
		if (re.test(html)) out.push({
			tech,
			detail
		});
	};
	has(/wp-content|wp-includes|wordpress/i, "WordPress", "wp-content paths in HTML");
	has(/shopify|cdn\.shopify/i, "Shopify", "Shopify CDN markers");
	has(/__next|next\/|_next\/static/i, "Next.js", "__next / _next markers");
	has(/nuxt|__NUXT__/i, "Nuxt", "Nuxt runtime markers");
	has(/gatsby|___gatsby/i, "Gatsby", "Gatsby markers");
	has(/__remixContext|remix/i, "Remix", "Remix markers");
	has(/__sveltekit|svelte/i, "SvelteKit", "Svelte markers");
	has(/data-reactroot|__react/i, "React", "React markers");
	has(/ng-version|ng-app/i, "Angular", "ng-* attributes");
	has(/data-v-[a-f0-9]{6,}/i, "Vue", "data-v scoped attributes");
	has(/astro/i, "Astro", "Astro markers");
	has(/jekyll/i, "Jekyll", "Jekyll markers");
	const server = headers["server"] || headers["x-powered-by"] || "";
	if (server) out.push({
		tech: server.split(/[,\s]/)[0] || server,
		detail: `${server} server header`
	});
	if (out.length === 0) out.push({
		tech: "Unknown",
		detail: "No platform markers found in HTML or headers"
	});
	return out;
}
function grade(score) {
	if (score === null) return {
		letter: "—",
		color: "text-muted-foreground"
	};
	if (score >= 90) return {
		letter: "A",
		color: "text-chart-2"
	};
	if (score >= 80) return {
		letter: "B",
		color: "text-chart-2"
	};
	if (score >= 70) return {
		letter: "C",
		color: "text-chart-3"
	};
	if (score >= 60) return {
		letter: "D",
		color: "text-[#d29922]"
	};
	return {
		letter: "F",
		color: "text-[#f85149]"
	};
}
function AnalyzeTool() {
	const [url, setUrl] = (0, import_react.useState)("");
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)("");
	const [sections, setSections] = (0, import_react.useState)([]);
	const [tech, setTech] = (0, import_react.useState)([]);
	const [pageSpeed, setPageSpeed] = (0, import_react.useState)({});
	const [analysedUrl, setAnalysedUrl] = (0, import_react.useState)("");
	const run = async () => {
		if (!url.trim()) {
			setError("Paste a website URL first — e.g. example.com");
			setPhase("error");
			return;
		}
		const target = normUrl(url);
		setAnalysedUrl(target);
		setPhase("running");
		setError("");
		setSections([]);
		setTech([]);
		setPageSpeed({});
		const results = [];
		hostnameOf(target);
		let html = "";
		let headers = {};
		try {
			html = await (await fetchWithTimeout(PROXY_RAW(target))).text();
			const proxyResp = await fetchWithTimeout(PROXY_GET(target));
			try {
				const j = await proxyResp.json();
				if (j?.status?.headers) headers = j.status.headers;
			} catch {}
		} catch (e) {
			setError(e instanceof DOMException && e.name === "AbortError" ? "The site took too long to respond. Try again or check the URL." : "Could not reach that site from the browser. Check the URL and try again.");
			setPhase("error");
			return;
		}
		const doc = (() => {
			try {
				return new DOMParser().parseFromString(html, "text/html");
			} catch {
				return null;
			}
		})();
		const title = doc?.querySelector("title")?.textContent?.trim() ?? "";
		const metaDesc = doc?.querySelector("meta[name=\"description\"]")?.getAttribute("content")?.trim() ?? "";
		const h1 = doc?.querySelectorAll("h1").length ?? 0;
		const ogTitle = doc?.querySelector("meta[property=\"og:title\"]")?.getAttribute("content")?.trim() ?? "";
		const ogImage = doc?.querySelector("meta[property=\"og:image\"]")?.getAttribute("content")?.trim() ?? "";
		const twCard = doc?.querySelector("meta[name=\"twitter:card\"]")?.getAttribute("content")?.trim() ?? "";
		const seoChecks = [
			{
				label: `<title> tag present`,
				ok: title.length > 0,
				detail: title ? `${title.length} chars` : void 0
			},
			{
				label: "Title length 50–60 chars",
				ok: title.length >= 50 && title.length <= 60 ? true : title.length > 0 ? false : null,
				detail: title ? `${title.length} chars` : void 0
			},
			{
				label: "Meta description present",
				ok: metaDesc.length > 0,
				detail: metaDesc ? `${metaDesc.length} chars` : void 0
			},
			{
				label: "Meta description 150–160 chars",
				ok: metaDesc.length >= 150 && metaDesc.length <= 160 ? true : metaDesc.length > 0 ? false : null,
				detail: metaDesc ? `${metaDesc.length} chars` : void 0
			},
			{
				label: "At least one H1 heading",
				ok: h1 > 0,
				detail: `${h1} found`
			}
		];
		results.push({
			id: "seo",
			title: "SEO basics",
			icon: "🔍",
			checks: seoChecks
		});
		results.push({
			id: "social",
			title: "Social sharing",
			icon: "🔗",
			checks: [
				{
					label: "og:title set",
					ok: ogTitle.length > 0,
					detail: ogTitle.slice(0, 60) || void 0
				},
				{
					label: "og:image set",
					ok: ogImage.length > 0,
					detail: void 0
				},
				{
					label: "twitter:card set",
					ok: twCard.length > 0,
					detail: twCard || void 0
				}
			]
		});
		const hd = (k) => (headers[k.toLowerCase()] ?? "").toString().toLowerCase();
		results.push({
			id: "security",
			title: "Security headers",
			icon: "🛡️",
			checks: [
				{
					label: "X-Frame-Options",
					ok: hd("x-frame-options") !== "" || hd("content-security-policy").includes("frame-ancestors"),
					detail: hd("x-frame-options") || void 0
				},
				{
					label: "Content-Security-Policy",
					ok: hd("content-security-policy") !== "",
					detail: hd("content-security-policy")?.slice(0, 50) || void 0
				},
				{
					label: "Strict-Transport-Security",
					ok: hd("strict-transport-security") !== "",
					detail: hd("strict-transport-security") ? "HSTS enabled" : void 0
				},
				{
					label: "X-Content-Type-Options",
					ok: hd("x-content-type-options") === "nosniff",
					detail: hd("x-content-type-options") || void 0
				},
				{
					label: "HTTPS only",
					ok: target.startsWith("https://"),
					detail: hostnameOf(target)
				}
			]
		});
		const probes = [{
			label: "robots.txt",
			path: "/robots.txt"
		}, {
			label: "sitemap.xml",
			path: "/sitemap.xml"
		}];
		const probeChecks = [];
		for (const p of probes) {
			const probeUrl = `${target}${p.path}`;
			try {
				const body = await (await fetchWithTimeout(PROXY_RAW(probeUrl), 1e4)).text();
				const looksLikeBlocked = body.length < 300 && /captcha|error|access denied|cloudflare|blocked/i.test(body) && !p.path.includes("robots");
				const ok = p.path.includes("robots") ? body.toLowerCase().includes("user-agent") || /allow|disallow/i.test(body) : body.toLowerCase().includes("urlset") || /<url>|<loc>/i.test(body);
				probeChecks.push({
					label: `${p.path} reachable`,
					ok: ok ? true : null,
					detail: looksLikeBlocked ? "blocked by bot protection" : body.length > 0 ? `${body.length} chars` : "empty"
				});
			} catch {
				probeChecks.push({
					label: `${p.path} reachable`,
					ok: null,
					detail: "timed out / blocked"
				});
			}
		}
		results.push({
			id: "crawl",
			title: "Crawlability",
			icon: "🕷️",
			checks: probeChecks
		});
		let ps = {};
		try {
			const psResp = await fetchWithTimeout(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(target)}&strategy=mobile&category=performance&category=accessibility&category=seo`, 2e4);
			if (psResp.ok) {
				const lh = (await psResp.json())?.lighthouseResult?.categories ?? {};
				ps = {
					performance: lh.performance?.score != null ? Math.round(lh.performance.score * 100) : null,
					accessibility: lh.accessibility?.score != null ? Math.round(lh.accessibility.score * 100) : null,
					seo: lh.seo?.score != null ? Math.round(lh.seo.score * 100) : null
				};
			}
		} catch {}
		setPageSpeed(ps);
		const speedChecks = [...[
			"performance",
			"accessibility",
			"seo"
		].map((k) => ({
			label: `PageSpeed ${k === "seo" ? "SEO" : k[0].toUpperCase() + k.slice(1)} (mobile)`,
			ok: ps[k] != null ? ps[k] >= 60 : null,
			detail: ps[k] != null ? `${ps[k]}/100` : "couldn't reach the API"
		}))];
		results.push({
			id: "speed",
			title: "Speed (PageSpeed)",
			icon: "⚡",
			checks: speedChecks
		});
		setTech(detectTech(html, headers));
		setSections(results);
		setPhase("done");
	};
	const totalChecks = sections.reduce((a, s) => a + s.checks.length, 0);
	const passed = sections.reduce((a, s) => a + s.checks.filter((c) => c.ok === true).length, 0);
	const failed = sections.reduce((a, s) => a + s.checks.filter((c) => c.ok === false).length, 0);
	const gradeOf = grade(totalChecks > 0 ? Math.round((passed + (totalChecks - passed - failed) * .5) / totalChecks * 100) : null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		title: "Website Analyser",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "page-enter pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "flex items-center gap-2.5 text-2xl font-black tracking-tight text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 items-center justify-center rounded-xl bg-surface-elevated text-[18px]",
						children: "🔍"
					}), "Website Analyser"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: "Paste any URL for a free audit — PageSpeed, security headers, SEO basics, social meta and tech stack. No sign-up, no API key."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
						className: "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: url,
						onChange: (e) => setUrl(e.target.value),
						onKeyDown: (e) => e.key === "Enter" && run(),
						placeholder: "example.com or https://example.com",
						inputMode: "url",
						className: "h-11 w-full rounded-lg border border-border bg-surface pr-3 pl-10 text-sm text-foreground outline-none focus:border-primary/60"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: run,
					disabled: phase === "running",
					className: "h-11 shrink-0",
					children: [phase === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						className: "size-4 animate-spin",
						"aria-hidden": true
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "size-4",
						"aria-hidden": true
					}), phase === "running" ? "Analysing…" : "Analyse"]
				})]
			}),
			phase === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/25 bg-red-500/5 p-3.5 text-[13px] text-red-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "mt-0.5 size-4 shrink-0",
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
			}),
			phase === "running" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-2.5",
				children: [
					"Fetching the page…",
					"Checking headers & security…",
					"Running SEO & social checks…",
					"Asking Google PageSpeed…"
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 rounded-lg border border-border bg-surface p-3 text-[13px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						className: cn("size-3.5 animate-spin text-primary", i > 0 && "opacity-0"),
						style: { animationDelay: `${i * .4}s` },
						"aria-hidden": true
					}), s]
				}, s))
			}),
			phase === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "page-enter mt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("flex size-16 shrink-0 items-center justify-center rounded-2xl border text-4xl font-black", gradeOf.color),
								style: { borderColor: "currentColor" },
								children: gradeOf.letter
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[15px] font-bold text-foreground",
									children: ["Overall grade for ", hostnameOf(analysedUrl)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-[13px] text-muted-foreground",
									children: [
										passed,
										" passed · ",
										failed,
										" failed · ",
										totalChecks - passed - failed,
										" unknown across ",
										sections.length,
										" sections"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								size: "sm",
								onClick: run,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 size-3.5" }), " Re-run"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-3 gap-2.5",
						children: [
							"performance",
							"accessibility",
							"seo"
						].map((k) => {
							const v = pageSpeed[k] ?? null;
							const label = k === "seo" ? "SEO" : k[0].toUpperCase() + k.slice(1);
							const g = grade(v);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-surface p-3 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-bold tracking-wider text-muted-foreground uppercase",
										children: label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cn("mt-1 text-2xl font-black", g.color),
										children: v != null ? v : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[10px] text-muted-foreground",
										children: v != null ? "/100" : "unavailable"
									})
								]
							}, k);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-xl border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[13px] font-bold text-foreground",
							children: "Tech stack detected"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1.5",
							children: tech.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								title: t.detail,
								className: "rounded-full border border-border bg-surface-elevated px-2.5 py-1 font-mono text-[11px] text-foreground",
								children: t.tech
							}, t.tech + t.detail))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-2.5 sm:grid-cols-2",
						children: sections.map((s) => {
							const okCount = s.checks.filter((c) => c.ok === true).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								open: s.checks.length <= 6,
								className: "group rounded-xl border border-border bg-surface p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
									className: "flex cursor-pointer list-none items-center gap-2.5 [&::-webkit-details-marker]:hidden",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg",
											children: s.icon
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1 text-[13px] font-bold text-foreground",
											children: s.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] text-muted-foreground",
											children: [
												okCount,
												"/",
												s.checks.length
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 space-y-1.5",
									children: s.checks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2 text-[12.5px]",
										children: [
											c.ok === true && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
												className: "mt-0.5 size-3.5 shrink-0 text-chart-2",
												"aria-hidden": true
											}),
											c.ok === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
												className: "mt-0.5 size-3.5 shrink-0 text-[#f85149]",
												"aria-hidden": true
											}),
											c.ok === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-0.5 size-3.5 shrink-0 text-muted-foreground/50",
												children: "·"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: c.ok === false ? "text-muted-foreground" : "text-foreground/90",
												children: [c.label, c.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground",
													children: [" — ", c.detail]
												}) : null]
											})
										]
									}, c.label))
								})]
							}, s.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-start gap-2 rounded-lg border border-border bg-surface/50 p-3 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
							className: "mt-0.5 size-3.5 shrink-0",
							"aria-hidden": true
						}), "Analysis uses publicly available data only (fetched through a CORS proxy). Some sites block automated fetching, so a ✗ or “unknown” may be a bot-detection false negative rather than a real problem. Results are approximate and for reference only."]
					})
				]
			})
		]
	});
}
//#endregion
export { AnalyzeTool as component };
