import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Sparkles, Hash, Copy, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/library/AppShell";
import { useReveal } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";
import {
  CONTENT_SECTIONS,
  SLASH_CATEGORIES,
  categoryContents,
  type CategoryContents,
  type SlashResourceRef,
} from "@/lib/slashbar-categories";

export const Route = createFileRoute("/slashbar/$category")({
  head: ({ params }) => {
    const contents = categoryContents(params.category);
    if (!contents) {
      return {
        meta: [{ title: "Category not found - SlashAI" }, { name: "robots", content: "noindex" }],
      };
    }
    const { def, counts } = contents;
    // The count is the number of real rows behind it, so the description cannot
    // drift away from what the page actually lists.
    const parts = [
      counts.commands ? `${counts.commands} slash commands` : null,
      counts.tools ? `${counts.tools} tools` : null,
      counts.articles ? `${counts.articles} guides` : null,
      counts.resources ? `${counts.resources} resources` : null,
      counts.quotes ? `${counts.quotes} quotes` : null,
      counts.games ? `${counts.games} games` : null,
    ].filter(Boolean);
    const description = `${def.desc} ${parts.join(", ")} — all free, all in one place.`;
    return {
      meta: [
        { title: `${def.name} - commands, tools, guides and resources | SlashAI` },
        { name: "description", content: description },
        { property: "og:title", content: `${def.name} | SlashAI` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:title", content: `${def.name} | SlashAI` },
        { name: "twitter:description", content: description },
        {
          name: "keywords",
          content: [def.name, "slashai", "free ai tools", ...def.keywords.slice(0, 6)].join(", "),
        },
      ],
      links: [{ rel: "manifest", href: "/manifest.webmanifest" }],
    };
  },
  component: SlashCategoryPage,
});

/** how many rows of each kind to show before the "see all" link takes over */
const PAGE = 12;

function CategoryPageBody({ contents }: { contents: CategoryContents }) {
  const { def, counts } = contents;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const shown = <T,>(key: string, rows: T[]) => (expanded[key] ? rows : rows.slice(0, PAGE));

  const sectionCount = (key: (typeof CONTENT_SECTIONS)[number]["key"]) =>
    counts[key as keyof typeof counts] ?? 0;

  // Only render a section that actually has rows. No "coming soon" blocks.
  const sections = CONTENT_SECTIONS.filter((s) => sectionCount(s.key) > 0);

  return (
    <div className="space-y-10">
      {/* header */}
      <header
        className="panel spotlight relative overflow-hidden rounded-2xl p-5 sm:p-7"
        data-spotlight
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(120% 100% at 0% 0%, hsl(${def.hue} 70% 50% / 0.16), transparent 60%)`,
          }}
        />
        <div className="relative">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            SlashBar category
          </p>
          <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <span aria-hidden>{def.emoji}</span>
            {def.name}
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] text-muted-foreground">{def.desc}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s.key}
                href={`#${s.key}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-[12px] text-foreground transition-colors hover:border-primary/50"
              >
                <span aria-hidden>{s.emoji}</span>
                <b className="tabular-nums">{counts[s.key]}</b>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* sections */}
      {sections.map((s) => {
        const n = sectionCount(s.key);
        return (
          <section key={s.key} id={s.key} className="scroll-mt-24 space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="flex items-center gap-1.5 text-lg font-semibold tracking-tight text-foreground">
                  <span aria-hidden>{s.emoji}</span>
                  {s.label}
                  <span className="text-sm font-normal text-muted-foreground tabular-nums">
                    ({n})
                  </span>
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.blurb}</p>
              </div>
              {n > PAGE && (
                <button
                  type="button"
                  onClick={() => setExpanded((e) => ({ ...e, [s.key]: !e[s.key] }))}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary/50"
                >
                  {expanded[s.key] ? "Show less" : `Show all ${n}`}
                </button>
              )}
            </div>

            {s.key === "commands" && (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {shown("commands", contents.commands).map((c) => (
                  <Link
                    key={c.id}
                    to="/c/$slug"
                    params={{ slug: c.id }}
                    className="group spotlight flex min-h-[56px] items-center gap-2.5 rounded-xl border border-border bg-surface px-3 py-2.5 transition-colors hover:border-primary/50"
                    data-spotlight
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-foreground">
                        {c.command}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {c.title}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                ))}
              </div>
            )}

            {s.key === "tools" && (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {shown("tools", contents.tools).map((t) => (
                  <Link
                    key={t.slug}
                    to={t.href}
                    className="group spotlight flex min-h-[56px] items-center gap-2.5 rounded-xl border border-border bg-surface px-3 py-2.5 transition-colors hover:border-primary/50"
                    data-spotlight
                  >
                    <span aria-hidden className="text-lg">
                      {t.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-foreground">
                        {t.name}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {t.desc}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {s.key === "articles" && (
              <div className="grid gap-2 sm:grid-cols-2">
                {shown("articles", contents.articles).map((a) => (
                  <Link
                    key={a.slug}
                    to={a.href}
                    className="group spotlight flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 transition-colors hover:border-primary/50"
                    data-spotlight
                  >
                    <span aria-hidden className="text-xl">
                      {a.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-foreground">
                        {a.title}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {a.tag} · {a.readTime}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {s.key === "games" && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {shown("games", contents.games).map((g) => (
                  <Link
                    key={g.slug}
                    to={g.href}
                    className="group flex flex-col items-center gap-1 rounded-xl border border-border bg-surface px-3 py-4 text-center transition-colors hover:border-primary/50"
                  >
                    <span aria-hidden className="text-2xl">
                      {g.icon}
                    </span>
                    <span className="text-[12px] font-semibold text-foreground">{g.name}</span>
                    <span className="line-clamp-2 text-[10.5px] text-muted-foreground">
                      {g.desc}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {s.key === "resources" && (
              <div className="grid gap-2 sm:grid-cols-2">
                {shown("resources", contents.resources).map((r) => (
                  <ResourceRow key={r.key} resource={r} />
                ))}
              </div>
            )}

            {s.key === "quotes" && (
              <div className="grid gap-2 sm:grid-cols-2">
                {shown("quotes", contents.quotes).map((q) => (
                  <QuoteRow key={q.text} quote={q} />
                ))}
              </div>
            )}

            {s.key === "apps" && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {shown("apps", contents.apps).map((a) => (
                  <Link
                    key={a.slug}
                    to="/slash/$app"
                    params={{ app: a.slug }}
                    className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface px-3 py-4 text-center transition-colors hover:border-primary/50"
                  >
                    <span aria-hidden className="text-2xl">
                      {a.emoji}
                    </span>
                    <span className="text-[12px] font-semibold text-foreground">{a.name}</span>
                    <span className="line-clamp-2 text-[10.5px] text-muted-foreground">
                      {a.desc}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        );
      })}

      {/* other categories */}
      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Other categories</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {SLASH_CATEGORIES.filter((c) => c.slug !== def.slug).map((c) => (
            <Link
              key={c.slug}
              to="/slashbar/$category"
              params={{ category: c.slug }}
              className="group flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 transition-colors hover:border-primary/50"
            >
              <span aria-hidden>{c.emoji}</span>
              <span className="truncate text-[12.5px] font-semibold text-foreground">{c.name}</span>
              <ArrowRight
                className="ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function ResourceRow({ resource }: { resource: SlashResourceRef }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 transition-colors hover:border-primary/50"
    >
      <span aria-hidden className="text-lg leading-none">
        {resource.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[13px] font-semibold text-foreground">
            {resource.name}
          </span>
          {resource.source === "curated" && (
            <span
              className="shrink-0 rounded-full border border-border bg-surface-elevated px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-muted-foreground uppercase"
              title="Hand-picked for this category"
            >
              <Sparkles className="mr-0.5 inline size-2" aria-hidden />
              Picked
            </span>
          )}
        </span>
        {resource.desc && (
          <span className="mt-0.5 line-clamp-2 block text-[11.5px] text-muted-foreground">
            {resource.desc}
          </span>
        )}
        {resource.category && (
          <span className="mt-1 inline-block text-[10px] text-muted-foreground/80">
            {resource.category}
          </span>
        )}
      </span>
      <ExternalLink
        className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
        aria-hidden
      />
    </a>
  );
}

function QuoteRow({
  quote,
}: {
  quote: { text: string; author: string; source?: string; category: string };
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      const suffix = quote.source ? ` (${quote.source})` : "";
      await navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}${suffix}`);
      setCopied(true);
      toast.success("Quote copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not access the clipboard");
    }
  };
  return (
    <blockquote className="flex items-start gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-3">
      <Hash className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] leading-relaxed text-foreground">{quote.text}</span>
        <span className="mt-1 block text-[11px] text-muted-foreground">
          — {quote.author}
          {quote.source ? `, ${quote.source}` : ""} · {quote.category}
        </span>
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy quote"
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        {copied ? (
          <Check className="size-3.5 text-primary" aria-hidden />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
      </button>
    </blockquote>
  );
}

function SlashCategoryPage() {
  const { category } = Route.useParams();
  const contents = categoryContents(category);
  const { ref } = useReveal<HTMLDivElement>();

  if (!contents) {
    return (
      <AppShell title="Category" back={{ to: "/slash", label: "SlashBar" }}>
        <div className="panel rounded-2xl p-8 text-center">
          <p className="text-3xl" aria-hidden>
            🧭
          </p>
          <h1 className="mt-3 text-lg font-bold text-foreground">No such category</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            There is no SlashBar category called &ldquo;{category}&rdquo;.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SLASH_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/slashbar/$category"
                params={{ category: c.slug }}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] text-foreground hover:border-primary/50"
              >
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={contents.def.name} back={{ to: "/slash", label: "SlashBar" }}>
      <div ref={ref} data-reveal>
        <CategoryPageBody contents={contents} />
      </div>
    </AppShell>
  );
}
