import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Newspaper } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";
import { VERIFIED_TOTAL } from "@/lib/commands";
import { ALL_BLOG_POSTS, BLOG_TAGS } from "@/lib/blog-guides";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Slash Blogs - free guides on AI, prompts, skills and the web | SlashAI" },
      {
        name: "description",
        content:
          "Free, practical guides on English speaking, prompts, free learning resources, GitHub, YouTube channels, SEO keywords, LLMs, summaries and more. No fluff, no paywall.",
      },
      { property: "og:title", content: "Slash Blogs - free guides" },
      {
        property: "og:description",
        content: `${ALL_BLOG_POSTS.length} practical guides on using AI, learning skills and working online. Free forever.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [tag, setTag] = useState<string | null>(null);

  // Tag counts come from the posts themselves, so they can never drift.
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of ALL_BLOG_POSTS) map.set(p.tag, (map.get(p.tag) ?? 0) + 1);
    return map;
  }, []);

  const posts = useMemo(
    () => (tag ? ALL_BLOG_POSTS.filter((p) => p.tag === tag) : ALL_BLOG_POSTS),
    [tag],
  );

  return (
    <AppShell wide hideHeaderSearch title="Blogs">
      <div className="mx-auto max-w-3xl pb-10">
        <header className="page-enter pt-2">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-primary">
            <Newspaper className="size-3" aria-hidden /> Slash Blogs
          </p>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Plain-English guides to using AI better
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {ALL_BLOG_POSTS.length} short, honest guides with copy-ready prompts you can use today —
            in ChatGPT, Gemini or Claude. English speaking, prompting, GitHub, SEO, LLMs, learning
            and more. Free, like everything else on SlashAI.
          </p>
        </header>

        {/* topic filters - one chip per real tag, with the real count */}
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter guides by topic">
          <button
            type="button"
            onClick={() => setTag(null)}
            aria-pressed={tag === null}
            className={
              tag === null
                ? "rounded-full border border-primary/50 bg-primary/15 px-3 py-1 text-[12px] font-bold text-primary"
                : "rounded-full border border-border bg-surface px-3 py-1 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            }
          >
            All {ALL_BLOG_POSTS.length}
          </button>
          {BLOG_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(tag === t ? null : t)}
              aria-pressed={tag === t}
              className={
                tag === t
                  ? "rounded-full border border-primary/50 bg-primary/15 px-3 py-1 text-[12px] font-bold text-primary"
                  : "rounded-full border border-border bg-surface px-3 py-1 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              }
            >
              {t} {counts.get(t)}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[12px] text-muted-foreground" aria-live="polite">
          Showing {posts.length} {posts.length === 1 ? "guide" : "guides"}
          {tag ? ` in ${tag}` : ""}.
        </p>

        <div className="mt-3 space-y-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="ripple-press block rounded-2xl border border-border bg-surface p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-elevated text-[24px]"
                  aria-hidden
                >
                  {p.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="rounded-full bg-surface-elevated px-2 py-0.5 font-semibold">
                      {p.tag}
                    </span>
                    <span>{p.date}</span>
                    <span>· {p.readTime}</span>
                  </span>
                  <h2 className="mt-1.5 text-[15.5px] font-bold leading-snug text-foreground">
                    {p.title}
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{p.desc}</p>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-bold text-primary">
                    Read the guide <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-[15px] font-bold text-foreground">
            Want all {VERIFIED_TOTAL.toLocaleString()} commands?
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            Every prompt in every guide comes from the SlashAI library — search it by what you want
            to get done. Commands are their own section of the app.
          </p>
          <Link
            to="/explore"
            className="ripple-press mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-bold text-background"
          >
            Browse all commands <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>

        <FaqSection />
      </div>
    </AppShell>
  );
}
