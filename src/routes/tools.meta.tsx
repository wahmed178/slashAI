import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/meta")({ component: SEOMetaGenerator });

function SEOMetaGenerator() {
  const [f, setF] = useState({ title: "", description: "", url: "", image: "", site: "", twitter: "" });
  const update = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  const tags = `<title>${f.title}</title>\n<meta name="description" content="${f.description}">\n<meta name="robots" content="index, follow">\n<link rel="canonical" href="${f.url}">\n\n<!-- Open Graph -->\n<meta property="og:type" content="website">\n<meta property="og:title" content="${f.title}">\n<meta property="og:description" content="${f.description}">\n<meta property="og:url" content="${f.url}">\n${f.image ? `<meta property="og:image" content="${f.image}">\n` : ""}${f.site ? `<meta property="og:site_name" content="${f.site}">\n` : ""}\n<!-- Twitter Card -->\n<meta name="twitter:card" content="${f.image ? "summary_large_image" : "summary"}">\n<meta name="twitter:title" content="${f.title}">\n<meta name="twitter:description" content="${f.description}">\n${f.twitter ? `<meta name="twitter:site" content="@${f.twitter.replace("@", "")}">\n` : ""}${f.image ? `<meta name="twitter:image" content="${f.image}">\n` : ""}\n\n<!-- Schema.org -->\n<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: f.title, description: f.description, url: f.url }, null, 2)}\n</script>`;

  const copy = async () => { try { await navigator.clipboard.writeText(tags); } catch {} };
  const fields: [string, string, string][] = [["title", "Page Title", "My Awesome Page"], ["description", "Description", "A brief description..."], ["url", "Page URL", "https://example.com/page"], ["image", "OG Image URL", "https://example.com/image.jpg"], ["site", "Site Name", "My Site"], ["twitter", "Twitter Handle", "username"]];

  return (
    <AppShell title="SEO Meta Tags">
      <header className="mb-5"><h1 className="text-2xl font-bold tracking-tight text-foreground">🔍 SEO Meta Tag Generator</h1><p className="mt-1 text-sm text-muted-foreground">Fill in page details → get Open Graph, Twitter Card, and Schema.org tags.</p></header>
      <div className="mx-auto max-w-2xl space-y-3">
        {fields.map(([k, l, p]) => (
          <div key={k}><label className="mb-1 block text-[10px] text-muted-foreground">{l}</label>
            <input value={(f as any)[k]} onChange={e => update(k, e.target.value)} placeholder={p} className="h-8 w-full rounded-lg border border-border bg-surface px-2.5 text-xs focus:outline-none" /></div>
        ))}
        <div className="rounded-xl border border-border bg-surface p-3">
          <div className="flex items-center justify-between mb-2"><p className="text-xs font-semibold text-foreground">Generated Tags</p><button onClick={copy} className="text-xs text-primary hover:underline">Copy All</button></div>
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-surface-elevated p-3 font-mono text-[10px] leading-relaxed text-foreground">{tags}</pre>
        </div>
      </div>
    </AppShell>
  );
}
