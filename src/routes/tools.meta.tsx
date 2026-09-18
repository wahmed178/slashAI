import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Check, Copy, CircleAlert, Search } from "lucide-react";

export const Route = createFileRoute("/tools/meta")({ component: SEOMetaGenerator });

const TITLE_MAX = 60;
const DESC_MAX = 155;

function SEOMetaGenerator() {
  const [f, setF] = useState({
    title: "",
    description: "",
    url: "",
    image: "",
    site: "",
    twitter: "",
  });
  const [copied, setCopied] = useState(false);
  const update = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const tags = `<title>${f.title}</title>\n<meta name="description" content="${f.description}">\n<meta name="robots" content="index, follow">\n<link rel="canonical" href="${f.url}">\n\n<!-- Open Graph -->\n<meta property="og:type" content="website">\n<meta property="og:title" content="${f.title}">\n<meta property="og:description" content="${f.description}">\n<meta property="og:url" content="${f.url}">\n${f.image ? `<meta property="og:image" content="${f.image}">\n` : ""}${f.site ? `<meta property="og:site_name" content="${f.site}">\n` : ""}\n<!-- Twitter Card -->\n<meta name="twitter:card" content="${f.image ? "summary_large_image" : "summary"}">\n<meta name="twitter:title" content="${f.title}">\n<meta name="twitter:description" content="${f.description}">\n${f.twitter ? `<meta name="twitter:site" content="@${f.twitter.replace("@", "")}">\n` : ""}${f.image ? `<meta name="twitter:image" content="${f.image}">\n` : ""}\n\n<!-- Schema.org -->\n<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: f.title, description: f.description, url: f.url }, null, 2)}\n</script>`;

  const titleState = useMemo(
    () => (f.title.length > TITLE_MAX ? "over" : f.title.length >= TITLE_MAX - 10 ? "close" : "ok"),
    [f.title],
  );
  const descState = useMemo(
    () =>
      f.description.length > DESC_MAX
        ? "over"
        : f.description.length >= DESC_MAX - 20
          ? "close"
          : "ok",
    [f.description],
  );

  const issues = useMemo(() => {
    const out: string[] = [];
    if (!f.title.trim())
      out.push("Add a page title — it is the single biggest ranking factor you control here.");
    if (!f.description.trim())
      out.push("Add a meta description — Google often shows it as the snippet under your link.");
    if (f.title.length > TITLE_MAX)
      out.push(
        `Title is ${f.title.length - TITLE_MAX} characters over ~${TITLE_MAX}; Google will cut it off.`,
      );
    if (f.description.length > DESC_MAX)
      out.push(
        `Description is ${f.description.length - DESC_MAX} characters over ~${DESC_MAX}; the snippet will be truncated.`,
      );
    if (f.url && !f.url.startsWith("http"))
      out.push("Page URL should start with https:// — canonical URLs must be absolute.");
    if (f.description.length > 0 && f.description.length < 70)
      out.push("Description is quite short — 120–155 characters usually performs best.");
    return out;
  }, [f]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tags);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — copy button is a convenience, not a requirement */
    }
  };

  const fields: [string, string, string][] = [
    ["title", "Page Title", "My Awesome Page"],
    ["description", "Description", "A brief description..."],
    ["url", "Page URL", "https://example.com/page"],
    ["image", "OG Image URL", "https://example.com/image.jpg"],
    ["site", "Site Name", "My Site"],
    ["twitter", "Twitter Handle", "username"],
  ];

  return (
    <AppShell title="SEO Meta Tags">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          🔍 SEO Meta Tag Generator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in page details → get Open Graph, Twitter Card, and Schema.org tags, with a live
          search preview.
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        {fields.map(([k, l, p]) => (
          <div key={k}>
            <div className="mb-1 flex items-baseline justify-between">
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {l}
              </label>
              {k === "title" && f.title && (
                <span
                  className={`text-[10px] ${titleState === "over" ? "font-bold text-red-500" : "text-muted-foreground"}`}
                >
                  {f.title.length}/{TITLE_MAX}
                </span>
              )}
              {k === "description" && f.description && (
                <span
                  className={`text-[10px] ${descState === "over" ? "font-bold text-red-500" : "text-muted-foreground"}`}
                >
                  {f.description.length}/{DESC_MAX}
                </span>
              )}
            </div>
            {k === "description" ? (
              <textarea
                value={f.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder={p}
                rows={2}
                className="w-full resize-none rounded-lg border border-border bg-surface px-2.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            ) : (
              <input
                value={(f as Record<string, string>)[k]}
                onChange={(e) => update(k, e.target.value)}
                placeholder={p}
                className="h-8 w-full rounded-lg border border-border bg-surface px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            )}
          </div>
        ))}

        {/* live search preview */}
        <div className="rounded-xl border border-border bg-surface p-3.5">
          <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            <Search className="size-3" /> Search preview
          </p>
          <div className="rounded-lg bg-white p-3 font-sans">
            <p className="truncate text-[12px] text-[#4d5156]">{f.url || "https://example.com"}</p>
            <p className="truncate text-[16px] leading-snug text-[#1a0dab]">
              {f.title || "Your page title appears here"}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-[#4d5156]">
              {f.description ||
                "Your meta description appears here. Aim for 120–155 characters so it is not truncated."}
              <span className="text-[#70757a]">
                {" "}
                {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })} —{" "}
              </span>
            </p>
          </div>
          <p className="mt-2 text-[10.5px] text-muted-foreground">
            Approximation of how your page can appear in search results. Keep the title under{" "}
            {TITLE_MAX} characters so it is not cut.
          </p>
        </div>

        {/* social card preview */}
        <div className="rounded-xl border border-border bg-surface p-3.5">
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Social card preview
          </p>
          <div className="overflow-hidden rounded-lg border border-border bg-surface-elevated">
            <div className="flex h-28 items-center justify-center bg-gradient-to-br from-primary/25 to-primary/5 text-[11px] text-muted-foreground">
              {f.image
                ? "🖼 OG image will render here"
                : "No OG image set — a plain link card will show instead"}
            </div>
            <div className="p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {f.site || "your site"}
              </p>
              <p className="truncate text-[13px] font-semibold text-foreground">
                {f.title || "Page title"}
              </p>
              <p className="line-clamp-2 text-[11.5px] text-muted-foreground">
                {f.description || "Description shown in link previews on WhatsApp, X and LinkedIn."}
              </p>
            </div>
          </div>
        </div>

        {/* checks */}
        {issues.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-3.5">
            <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              <CircleAlert className="size-3" /> Checks ({issues.length})
            </p>
            <ul className="space-y-1.5">
              {issues.map((issue) => (
                <li
                  key={issue}
                  className="flex items-start gap-2 text-[12px] leading-relaxed text-muted-foreground"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-yellow-500" /> {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl border border-border bg-surface p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-foreground">Generated Tags</p>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}{" "}
              {copied ? "Copied" : "Copy All"}
            </button>
          </div>
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-surface-elevated p-3 font-mono text-[10px] leading-relaxed text-foreground">
            {tags}
          </pre>
        </div>
      </div>
    </AppShell>
  );
}
