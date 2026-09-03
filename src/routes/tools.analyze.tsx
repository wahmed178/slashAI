import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Check, Globe, Loader2, RefreshCw, Search, ShieldAlert, X } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/analyze")({
  head: () => ({
    meta: [
      { title: "Website Analyser — free SEO, speed & security audit | SlashAI" },
      {
        name: "description",
        content:
          "Paste any URL for a free instant audit: PageSpeed scores, security headers, SEO basics, social meta tags and tech-stack detection. No sign-up, no API key.",
      },
    ],
  }),
  component: AnalyzeTool,
});

interface PageSpeedResult {
  performance?: number | null;
  accessibility?: number | null;
  seo?: number | null;
}

interface SectionResult {
  id: string;
  title: string;
  icon: string;
  checks: { label: string; ok: boolean | null; detail: string | undefined }[];
}

type Phase = "idle" | "running" | "done" | "error";

const PROXY_RAW = (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`;
const PROXY_GET = (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`;

async function fetchWithTimeout(url: string, ms = 18000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

function normUrl(input: string): string {
  const v = input.trim().replace(/^https?:\/\//i, "");
  return `https://${v}`;
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/** crude but honest fingerprinting from raw HTML — no external service needed */
function detectTech(html: string, headers: Record<string, string>): { tech: string; detail: string }[] {
  const out: { tech: string; detail: string }[] = [];
  const has = (re: RegExp, tech: string, detail: string) => {
    if (re.test(html)) out.push({ tech, detail });
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
  if (server) out.push({ tech: server.split(/[,\s]/)[0] || server, detail: `${server} server header` });
  if (out.length === 0) out.push({ tech: "Unknown", detail: "No platform markers found in HTML or headers" });
  return out;
}

function grade(score: number | null): { letter: string; color: string } {
  if (score === null) return { letter: "—", color: "text-muted-foreground" };
  if (score >= 90) return { letter: "A", color: "text-chart-2" };
  if (score >= 80) return { letter: "B", color: "text-chart-2" };
  if (score >= 70) return { letter: "C", color: "text-chart-3" };
  if (score >= 60) return { letter: "D", color: "text-[#d29922]" };
  return { letter: "F", color: "text-[#f85149]" };
}

function AnalyzeTool() {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [sections, setSections] = useState<SectionResult[]>([]);
  const [tech, setTech] = useState<{ tech: string; detail: string }[]>([]);
  const [pageSpeed, setPageSpeed] = useState<PageSpeedResult>({});
  const [analysedUrl, setAnalysedUrl] = useState("");

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

    const results: SectionResult[] = [];
    const base = hostnameOf(target);
    let html = "";
    let headers: Record<string, string> = {};

    try {
      /* 1 — fetch the page HTML through a CORS proxy */
      const htmlResp = await fetchWithTimeout(PROXY_RAW(target));
      html = await htmlResp.text();
      const proxyResp = await fetchWithTimeout(PROXY_GET(target));
      try {
        const j = await proxyResp.json();
        if (j?.status?.headers) headers = j.status.headers as Record<string, string>;
      } catch {
        /* headers unavailable — non-fatal */
      }
    } catch (e) {
      setError(
        e instanceof DOMException && e.name === "AbortError"
          ? "The site took too long to respond. Try again or check the URL."
          : "Could not reach that site from the browser. Check the URL and try again.",
      );
      setPhase("error");
      return;
    }

    /* 2 — SEO: parse what we actually received */
    const doc = (() => {
      try {
        return new DOMParser().parseFromString(html, "text/html");
      } catch {
        return null;
      }
    })();
    const title = doc?.querySelector("title")?.textContent?.trim() ?? "";
    const metaDesc = doc?.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "";
    const h1 = doc?.querySelectorAll("h1").length ?? 0;
    const ogTitle = doc?.querySelector('meta[property="og:title"]')?.getAttribute("content")?.trim() ?? "";
    const ogImage = doc?.querySelector('meta[property="og:image"]')?.getAttribute("content")?.trim() ?? "";
    const twCard = doc?.querySelector('meta[name="twitter:card"]')?.getAttribute("content")?.trim() ?? "";

    const seoChecks: SectionResult["checks"] = [
      { label: `<title> tag present`, ok: title.length > 0, detail: title ? `${title.length} chars` : undefined },
      {
        label: "Title length 50–60 chars",
        ok: title.length >= 50 && title.length <= 60 ? true : title.length > 0 ? false : null,
        detail: title ? `${title.length} chars` : undefined,
      },
      { label: "Meta description present", ok: metaDesc.length > 0, detail: metaDesc ? `${metaDesc.length} chars` : undefined },
      {
        label: "Meta description 150–160 chars",
        ok: metaDesc.length >= 150 && metaDesc.length <= 160 ? true : metaDesc.length > 0 ? false : null,
        detail: metaDesc ? `${metaDesc.length} chars` : undefined,
      },
      { label: "At least one H1 heading", ok: h1 > 0, detail: `${h1} found` },
    ];
    results.push({ id: "seo", title: "SEO basics", icon: "🔍", checks: seoChecks });

    /* 3 — social meta tags */
    results.push({
      id: "social",
      title: "Social sharing",
      icon: "🔗",
      checks: [
        { label: "og:title set", ok: ogTitle.length > 0, detail: ogTitle.slice(0, 60) || undefined },
        { label: "og:image set", ok: ogImage.length > 0, detail: undefined },
        { label: "twitter:card set", ok: twCard.length > 0, detail: twCard || undefined },
      ],
    });

    /* 4 — security headers (when the proxy could see them) */
    const hd = (k: string) => (headers[k.toLowerCase()] ?? "").toString().toLowerCase();
    results.push({
      id: "security",
      title: "Security headers",
      icon: "🛡️",
      checks: [
        { label: "X-Frame-Options", ok: hd("x-frame-options") !== "" || hd("content-security-policy").includes("frame-ancestors"), detail: hd("x-frame-options") || undefined },
        { label: "Content-Security-Policy", ok: hd("content-security-policy") !== "", detail: hd("content-security-policy")?.slice(0, 50) || undefined },
        { label: "Strict-Transport-Security", ok: hd("strict-transport-security") !== "", detail: hd("strict-transport-security") ? "HSTS enabled" : undefined },
        { label: "X-Content-Type-Options", ok: hd("x-content-type-options") === "nosniff", detail: hd("x-content-type-options") || undefined },
        { label: "HTTPS only", ok: target.startsWith("https://"), detail: hostnameOf(target) },
      ],
    });

    /* 5 — robots.txt + sitemap.xml probes */
    const probes: { label: string; path: string }[] = [
      { label: "robots.txt", path: "/robots.txt" },
      { label: "sitemap.xml", path: "/sitemap.xml" },
    ];
    const probeChecks: SectionResult["checks"] = [];
    for (const p of probes) {
      const probeUrl = `${target}${p.path}`;
      try {
        const resp = await fetchWithTimeout(PROXY_RAW(probeUrl), 10000);
        const body = await resp.text();
        const looksLikeBlocked =
          body.length < 300 && /captcha|error|access denied|cloudflare|blocked/i.test(body) && !p.path.includes("robots");
        const ok = p.path.includes("robots") ? body.toLowerCase().includes("user-agent") || /allow|disallow/i.test(body) : body.toLowerCase().includes("urlset") || /<url>|<loc>/i.test(body);
        probeChecks.push({
          label: `${p.path} reachable`,
          ok: ok ? true : null,
          detail: looksLikeBlocked ? "blocked by bot protection" : body.length > 0 ? `${body.length} chars` : "empty",
        });
      } catch {
        probeChecks.push({ label: `${p.path} reachable`, ok: null, detail: "timed out / blocked" });
      }
    }
    results.push({ id: "crawl", title: "Crawlability", icon: "🕷️", checks: probeChecks });

    /* 6 — PageSpeed (mobile) — free Google API, optional */
    let ps: PageSpeedResult = {};
    try {
      const psResp = await fetchWithTimeout(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(target)}&strategy=mobile&category=performance&category=accessibility&category=seo`,
        20000,
      );
      if (psResp.ok) {
        const j = await psResp.json();
        const lh = j?.lighthouseResult?.categories ?? {};
        ps = {
          performance: lh.performance?.score != null ? Math.round(lh.performance.score * 100) : null,
          accessibility: lh.accessibility?.score != null ? Math.round(lh.accessibility.score * 100) : null,
          seo: lh.seo?.score != null ? Math.round(lh.seo.score * 100) : null,
        };
      }
    } catch {
      /* PageSpeed is best-effort — the rest of the audit still stands */
    }
    setPageSpeed(ps);

    const speedChecks: SectionResult["checks"] = [
      ...(["performance", "accessibility", "seo"] as const).map((k) => ({
        label: `PageSpeed ${k === "seo" ? "SEO" : k[0]!.toUpperCase() + k.slice(1)} (mobile)`,
        ok: ps[k] != null ? ps[k]! >= 60 : null,
        detail: ps[k] != null ? `${ps[k]}/100` : "couldn't reach the API",
      })),
    ];
    results.push({ id: "speed", title: "Speed (PageSpeed)", icon: "⚡", checks: speedChecks });

    setTech(detectTech(html, headers));
    setSections(results);
    setPhase("done");
  };

  const totalChecks = sections.reduce((a, s) => a + s.checks.length, 0);
  const passed = sections.reduce((a, s) => a + s.checks.filter((c) => c.ok === true).length, 0);
  const failed = sections.reduce((a, s) => a + s.checks.filter((c) => c.ok === false).length, 0);
  const overall = totalChecks > 0 ? Math.round(((passed + (totalChecks - passed - failed) * 0.5) / totalChecks) * 100) : null;
  const gradeOf = grade(overall);

  return (
    <AppShell wide title="Website Analyser" back={{ to: "/tools", label: "SlashKits" }}>
      <header className="page-enter pt-2">
        <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-foreground">
          <span className="flex size-10 items-center justify-center rounded-xl bg-surface-elevated text-[18px]">🔍</span>
          Website Analyser
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Paste any URL for a free audit — PageSpeed, security headers, SEO basics, social meta and tech stack. No sign-up, no API key.
        </p>
      </header>

      {/* input */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Globe className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="example.com or https://example.com"
            inputMode="url"
            className="h-11 w-full rounded-lg border border-border bg-surface pr-3 pl-10 text-sm text-foreground outline-none focus:border-primary/60"
          />
        </div>
        <Button onClick={run} disabled={phase === "running"} className="h-11 shrink-0">
          {phase === "running" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Search className="size-4" aria-hidden />}
          {phase === "running" ? "Analysing…" : "Analyse"}
        </Button>
      </div>

      {phase === "error" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/25 bg-red-500/5 p-3.5 text-[13px] text-red-400">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      )}

      {phase === "running" && (
        <div className="mt-5 space-y-2.5">
          {["Fetching the page…", "Checking headers & security…", "Running SEO & social checks…", "Asking Google PageSpeed…"].map((s, i) => (
            <div key={s} className="flex items-center gap-2.5 rounded-lg border border-border bg-surface p-3 text-[13px] text-muted-foreground">
              <Loader2 className={cn("size-3.5 animate-spin text-primary", i > 0 && "opacity-0")} style={{ animationDelay: `${i * 0.4}s` }} aria-hidden />
              {s}
            </div>
          ))}
        </div>
      )}

      {phase === "done" && (
        <div className="page-enter mt-5">
          {/* overall score */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
            <div className={cn("flex size-16 shrink-0 items-center justify-center rounded-2xl border text-4xl font-black", gradeOf.color)} style={{ borderColor: "currentColor" }}>
              {gradeOf.letter}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-foreground">Overall grade for {hostnameOf(analysedUrl)}</p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {passed} passed · {failed} failed · {totalChecks - passed - failed} unknown across {sections.length} sections
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={run}>
              <RefreshCw className="mr-1.5 size-3.5" /> Re-run
            </Button>
          </div>

          {/* PageSpeed quick scores */}
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {(["performance", "accessibility", "seo"] as const).map((k) => {
              const v = pageSpeed[k] ?? null;
              const label = k === "seo" ? "SEO" : k[0]!.toUpperCase() + k.slice(1);
              const g = grade(v);
              return (
                <div key={k} className="rounded-xl border border-border bg-surface p-3 text-center">
                  <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{label}</p>
                  <p className={cn("mt-1 text-2xl font-black", g.color)}>{v != null ? v : "—"}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{v != null ? "/100" : "unavailable"}</p>
                </div>
              );
            })}
          </div>

          {/* tech detection */}
          <div className="mt-3 rounded-xl border border-border bg-surface p-4">
            <h2 className="text-[13px] font-bold text-foreground">Tech stack detected</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tech.map((t) => (
                <span key={t.tech + t.detail} title={t.detail} className="rounded-full border border-border bg-surface-elevated px-2.5 py-1 font-mono text-[11px] text-foreground">
                  {t.tech}
                </span>
              ))}
            </div>
          </div>

          {/* section cards */}
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {sections.map((s) => {
              const okCount = s.checks.filter((c) => c.ok === true).length;
              return (
                <details key={s.id} open={s.checks.length <= 6} className="group rounded-xl border border-border bg-surface p-4">
                  <summary className="flex cursor-pointer list-none items-center gap-2.5 [&::-webkit-details-marker]:hidden">
                    <span className="text-lg">{s.icon}</span>
                    <span className="flex-1 text-[13px] font-bold text-foreground">{s.title}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {okCount}/{s.checks.length}
                    </span>
                  </summary>
                  <div className="mt-3 space-y-1.5">
                    {s.checks.map((c) => (
                      <div key={c.label} className="flex items-start gap-2 text-[12.5px]">
                        {c.ok === true && <Check className="mt-0.5 size-3.5 shrink-0 text-chart-2" aria-hidden />}
                        {c.ok === false && <X className="mt-0.5 size-3.5 shrink-0 text-[#f85149]" aria-hidden />}
                        {c.ok === null && <span className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/50">·</span>}
                        <span className={c.ok === false ? "text-muted-foreground" : "text-foreground/90"}>
                          {c.label}
                          {c.detail ? <span className="text-muted-foreground"> — {c.detail}</span> : null}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-surface/50 p-3 text-[11px] text-muted-foreground">
            <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Analysis uses publicly available data only (fetched through a CORS proxy). Some sites block automated fetching, so a ✗ or “unknown” may be a bot-detection false negative rather than a real problem. Results are approximate and for reference only.
          </div>
        </div>
      )}
    </AppShell>
  );
}
