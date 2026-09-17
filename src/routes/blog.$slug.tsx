import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Copy, CalendarDays } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";
import { getCommand, type SlashCommand } from "@/lib/commands";
import { useCommandActions } from "@/hooks/use-command-actions";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found - SlashAI" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        {
          title: "Best Free AI Prompts for Professionals in India (2026) | SlashAI",
        },
        {
          name: "description",
          content:
            "10 free copy-ready AI prompts for Indian professionals: emails, meeting notes, reports, resumes and appraisals. Works in free ChatGPT, Gemini and Claude. No account needed.",
        },
        { property: "og:title", content: "Best Free AI Prompts for Professionals in India (2026)" },
        {
          property: "og:description",
          content:
            "10 copy-ready prompts for email, reports, meetings and career growth — free, no account, works in ChatGPT, Gemini and Claude.",
        },
        { property: "og:type", content: "article" },
        { property: "og:url", content: "https://slashai.in/blog/best-free-ai-prompts-for-professionals-in-india-2026" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Best Free AI Prompts for Professionals in India (2026)" },
        {
          name: "twitter:description",
          content: "10 free copy-ready AI prompts for Indian professionals. No signup, works in free AI tools.",
        },
      ],
      links: [{ rel: "canonical", href: "https://slashai.in/blog/best-free-ai-prompts-for-professionals-in-india-2026" }],
    };
  },
  notFoundComponent: PostNotFound,
  component: BlogPost,
});

const POSTS = [
  {
    slug: "best-free-ai-prompts-for-professionals-in-india-2026",
    title: "Best Free AI Prompts for Professionals in India (2026)",
    date: "16 Sep 2026",
    readTime: "7 min read",
  },
];

const PROMPT_IDS = [
  "draftemail",
  "rewriteemail",
  "shortenemail",
  "meetingrecap",
  "prioritizemeeting",
  "planmeeting",
  "draftreport",
  "rewritereport",
  "tailorresume",
  "reviewresume",
] as const;

interface Section {
  id: string;
  heading: string;
  intro: string;
}

const SECTIONS: Section[] = [
  {
    id: "email",
    heading: "Email prompts that get replies",
    intro:
      "Indian workplace email is a genre of its own: polite, hierarchical, and often written at 11pm. These three prompts draft, soften and shrink emails so you send better ones faster.",
  },
  {
    id: "meetings",
    heading: "Meeting prompts that save an hour a week",
    intro:
      "Meetings multiply in Indian offices — and so do the notes nobody reads. Use AI to summarise, prioritise and plan instead of typing minutes by hand.",
  },
  {
    id: "reports",
    heading: "Report prompts for the weekly grind",
    intro:
      "Whether it's a status update to your manager or a monthly review, these prompts turn rough points into a structured draft you can defend in the meeting.",
  },
  {
    id: "career",
    heading: "Career prompts for the next move",
    intro:
      "From tailoring your resume for an ATS to practising tough interview answers — the highest-leverage AI use for your career is preparation.",
  },
];

function PromptCard({ cmd }: { cmd: SlashCommand }) {
  const { copyCommand } = useCommandActions();
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
          onClick={() => copyCommand(cmd)}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 text-[12px] font-bold text-foreground transition-colors hover:border-primary/40"
        >
          <Copy className="size-3.5" aria-hidden /> Copy
        </button>
      </div>
      <p className="mt-0.5 text-[12px] font-semibold text-foreground">{cmd.title}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{cmd.description}</p>
      <p className="mt-2 rounded-lg bg-surface-elevated/70 px-2.5 py-1.5 text-[11.5px] text-muted-foreground">
        <b className="text-foreground">Use it in:</b> ChatGPT / Gemini / Claude · copy → paste →
        replace the placeholders with your details
      </p>
    </article>
  );
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
  const prompts = PROMPT_IDS.map((id) => getCommand(id)).filter(
    (c): c is SlashCommand => Boolean(c),
  );

  return (
    <AppShell wide hideHeaderSearch title="Blog">
      <article className="mx-auto max-w-3xl pb-10">
        <nav aria-label="Breadcrumb" className="pt-2">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> Blog
          </Link>
        </nav>

        <header className="mt-3">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-primary">
            <CalendarDays className="size-3" aria-hidden /> 16 Sep 2026 · 7 min read · Prompts
          </p>
          <h1 className="mt-3 text-[24px] font-black leading-tight tracking-tight text-foreground sm:text-[30px]">
            Best Free AI Prompts for Professionals in India (2026)
          </h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">
            AI tools are free. Knowing what to type into them is the real skill — and it's the
            part nobody teaches. This guide fixes that with ten copy-ready prompts built for the
            realities of Indian work life: the polite email to your manager, the meeting that
            needed to be an email, the weekly report nobody reads, and the resume stuck in 2022.
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
            Every prompt works in the free tiers of <b className="text-foreground">ChatGPT</b>,{" "}
            <b className="text-foreground">Gemini</b> and <b className="text-foreground">Claude</b>.
            Tap Copy, paste, and replace anything in &lt;angle brackets&gt; with your own details.
            No account, no paywall — every prompt lives in the{" "}
            <Link to="/prompts" className="font-semibold text-primary hover:underline">
              free SlashAI library
            </Link>{" "}
            of 5,600+ commands.
          </p>
        </header>

        <div className="mt-7 space-y-8">
          {SECTIONS.map((section) => {
            const sectionPrompts = prompts.filter((p) => {
              if (section.id === "email") return ["draftemail", "rewriteemail", "shortenemail"].includes(p.id);
              if (section.id === "meetings") return ["meetingrecap", "prioritizemeeting", "planmeeting"].includes(p.id);
              if (section.id === "reports") return ["draftreport", "rewritereport"].includes(p.id);
              return ["tailorresume", "reviewresume"].includes(p.id);
            });
            if (sectionPrompts.length === 0) return null;
            return (
              <section key={section.id} aria-labelledby={`h-${section.id}`}>
                <h2 id={`h-${section.id}`} className="text-[18px] font-bold tracking-tight text-foreground">
                  {section.heading}
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{section.intro}</p>
                <div className="mt-3 space-y-3">
                  {sectionPrompts.map((cmd) => (
                    <PromptCard key={cmd.id} cmd={cmd} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* how to get better results */}
        <section className="mt-9 rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-[16px] font-bold text-foreground">One rule for better output</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
            Every prompt above follows the same skeleton: <b className="text-foreground">role, task,
            context, format</b>. If a result feels generic, you're usually missing context — the
            specifics only you know (your audience, your numbers, your constraints). Add one line of
            context before regenerating, and the output improves more than any clever trick.
          </p>
        </section>

        {/* CTA back to the library */}
        <section className="mt-5 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-surface to-surface p-6 text-center">
          <h2 className="font-display text-[19px] font-black text-foreground">
            Ready for the full library?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
            These 10 prompts are a taste — SlashAI has 5,600+ copy-ready commands across writing,
            coding, marketing, study and business. Search by what you want to get done.
          </p>
          <Link
            to="/explore"
            className="ripple-press mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#2dd4bf] to-[#818cf8] px-5 text-[14px] font-black text-white shadow-lg transition-transform active:scale-95"
          >
            Explore all commands <ArrowRight className="size-4" aria-hidden />
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
