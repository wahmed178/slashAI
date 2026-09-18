import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Copy, CalendarDays, Check } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";
import { getCommand, type SlashCommand } from "@/lib/commands";
import { useCommandActions } from "@/hooks/use-command-actions";
import { getBlogPost, type BlogBlock, type BlogPost as BlogPostData, type BlogSection } from "@/lib/blogs";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Not found - SlashAI" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${post.metaTitle}` },
        { name: "description", content: post.metaDesc },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://slashai.in/blog/${post.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.desc },
      ],
      links: [{ rel: "canonical", href: `https://slashai.in/blog/${post.slug}` }],
    };
  },
  notFoundComponent: PostNotFound,
  component: BlogPost,
});

function PromptCard({ cmd }: { cmd: SlashCommand }) {
  const { copyCommand } = useCommandActions();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyCommand(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <Link
          to="/c/$slug"
          params={{ slug: cmd.id }}
          className="min-w-0 font-mono text-[13.5px] font-semibold text-primary hover:underline"
        >
          {cmd.command}
        </Link>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 text-[12px] font-bold text-foreground transition-colors hover:border-primary/40"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-primary" aria-hidden /> Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden /> Copy
            </>
          )}
        </button>
      </div>
      <p className="mt-0.5 text-[12px] font-semibold text-foreground">{cmd.title}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{cmd.description}</p>
      <p className="mt-2 rounded-lg bg-surface-elevated/70 px-2.5 py-1.5 text-[11.5px] text-muted-foreground">
        <b className="text-foreground">Use it in:</b> ChatGPT / Gemini / Claude · copy → paste →
        replace bracketed placeholders with your details
      </p>
    </article>
  );
}

function RenderBlock({ block }: { block: BlogBlock }) {
  if (block.type === "p" && block.text) {
    return <p className="text-[14px] leading-relaxed text-muted-foreground">{block.text}</p>;
  }

  if (block.type === "h" && block.text) {
    return (
      <h3 className="pt-2 text-[16px] font-bold tracking-tight text-foreground">{block.text}</h3>
    );
  }

  if (block.type === "list" && block.items) {
    return (
      <ul className="space-y-1.5 pl-5 text-[13.5px] text-muted-foreground list-disc marker:text-primary">
        {block.items.map((it, idx) => (
          <li key={idx} className="leading-relaxed">
            {it}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "code" && block.text) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
        {block.lang && (
          <div className="border-b border-border/60 bg-surface/50 px-3.5 py-1 text-[11px] font-mono font-medium text-muted-foreground">
            {block.lang}
          </div>
        )}
        <pre className="overflow-x-auto p-3.5 font-mono text-[12.5px] leading-relaxed text-foreground">
          <code>{block.text}</code>
        </pre>
      </div>
    );
  }

  if (block.type === "callout" && block.text) {
    const isWarn = block.tone === "warn";
    return (
      <div
        className={`rounded-xl border p-3.5 text-[13px] leading-relaxed ${
          isWarn
            ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
            : "border-primary/30 bg-primary/10 text-foreground"
        }`}
      >
        <span className="font-semibold">{isWarn ? "⚠️ Note: " : "💡 Pro Tip: "}</span>
        {block.text}
      </div>
    );
  }

  if (block.type === "prompts" && block.promptIds) {
    const commands = block.promptIds
      .map((id) => getCommand(id))
      .filter((c): c is SlashCommand => Boolean(c));

    return (
      <div className="space-y-3 pt-1">
        {commands.map((cmd) => (
          <PromptCard key={cmd.id} cmd={cmd} />
        ))}
      </div>
    );
  }

  return null;
}

function PostNotFound() {
  return (
    <AppShell back={{ to: "/blog", label: "Blog" }} title="Not found">
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-[40px]">📰</p>
        <p className="mt-2 text-sm font-semibold text-foreground">That post doesn't exist.</p>
        <Link
          to="/blog"
          className="mt-4 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          All posts
        </Link>
      </div>
    </AppShell>
  );
}

function BlogPost() {
  const { post } = Route.useLoaderData() as { post: BlogPostData };

  return (
    <AppShell wide hideHeaderSearch title={post.title}>
      <article className="mx-auto max-w-3xl pb-10">
        <nav aria-label="Breadcrumb" className="pt-2">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> Back to Blog
          </Link>
        </nav>

        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              <CalendarDays className="size-3" aria-hidden /> {post.date} · {post.readTime}
            </span>
            <span className="rounded-full bg-surface-elevated px-2.5 py-1 text-[10.5px] font-semibold text-muted-foreground border border-border">
              {post.tag}
            </span>
          </div>

          <h1 className="mt-3.5 text-[24px] font-black leading-tight tracking-tight text-foreground sm:text-[32px]">
            {post.title}
          </h1>

          <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">
            {post.summary}
          </p>
        </header>

        <div className="mt-8 space-y-9">
          {post.sections.map((section) => (
            <section key={section.id} aria-labelledby={`h-${section.id}`} className="space-y-3">
              <h2
                id={`h-${section.id}`}
                className="text-[18px] font-bold tracking-tight text-foreground sm:text-[20px]"
              >
                {section.heading}
              </h2>
              {section.intro && (
                <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                  {section.intro}
                </p>
              )}
              <div className="space-y-3">
                {section.blocks.map((b, i) => (
                  <RenderBlock key={i} block={b} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA back to library */}
        <section className="mt-10 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-surface to-surface p-6 text-center">
          <h2 className="font-display text-[19px] font-black text-foreground">
            Explore the Full SlashAI Library
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
            Every prompt in our guides is part of our offline-ready vault of verified commands
            and instant browser tools. Free forever, no account required.
          </p>
          <Link
            to="/explore"
            className="ripple-press mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#2dd4bf] to-[#818cf8] px-5 text-[14px] font-black text-white shadow-lg transition-transform active:scale-95"
          >
            Browse All Commands <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>

        <FaqSection />

        <nav aria-label="More posts" className="mt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> Back to all posts
          </Link>
        </nav>
      </article>
    </AppShell>
  );
}
