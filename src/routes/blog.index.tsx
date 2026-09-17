import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Newspaper } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";
import { VERIFIED_TOTAL } from "@/lib/commands";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog - plain-English AI guides | SlashAI" },
      {
        name: "description",
        content:
          "Free, practical guides on using AI better: copy-ready prompts for work, study and business in India and beyond. No fluff, no jargon, no paywall.",
      },
      { property: "og:title", content: "SlashAI Blog - free AI guides" },
      {
        property: "og:description",
        content: "Practical AI guides and copy-ready prompt collections. Free forever.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BlogIndex,
});

const POSTS = [
  {
    slug: "best-free-ai-prompts-for-professionals-in-india-2026",
    title: "Best Free AI Prompts for Professionals in India (2026)",
    emoji: "🇮🇳",
    desc: "10 copy-ready prompts for email, reports, meetings and career growth — built for Indian workplaces and free AI tools.",
    date: "16 Sep 2026",
    readTime: "7 min read",
    tag: "Prompts",
  },
];

function BlogIndex() {
  return (
    <AppShell wide hideHeaderSearch title="Blog">
      <div className="mx-auto max-w-3xl pb-10">
        <header className="page-enter pt-2">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-primary">
            <Newspaper className="size-3" aria-hidden /> Blog
          </p>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Plain-English guides to using AI better
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Short, honest guides with copy-ready prompts you can use today — in ChatGPT, Gemini or
            Claude. Written for people who don't want to become prompt engineers. Free, like
            everything else on SlashAI.
          </p>
        </header>

        <div className="mt-6 space-y-3">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="ripple-press block rounded-2xl border border-border bg-surface p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-elevated text-[24px]" aria-hidden>
                  {p.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="rounded-full bg-surface-elevated px-2 py-0.5 font-semibold">{p.tag}</span>
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
          <h2 className="text-[15px] font-bold text-foreground">Want all {VERIFIED_TOTAL.toLocaleString()} commands?</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            Every prompt in every guide comes from the SlashAI library — search it by what you want
            to get done.
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
