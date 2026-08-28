import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

import { AppShell } from "@/components/library/AppShell";
import { categoryIcon } from "@/components/library/icons";
import { CATEGORY_TREE, SUBCATEGORY_TOTAL, VERIFIED_TOTAL } from "@/lib/commands";

export const Route = createFileRoute("/explore/")({
  head: () => ({
    meta: [
      { title: "Commands — SlashAI" },
      {
        name: "description",
        content: `Browse ${VERIFIED_TOTAL} AI slash commands across ${CATEGORY_TREE.length} categories. Copy any command and paste it into ChatGPT, Claude or Gemini.`,
      },
      { property: "og:title", content: "Commands — SlashAI" },
    ],
  }),
  component: ExplorePage,
});

/** Each command gets a one-line description so users know exactly what it does */
const USE_CASES = [
  {
    id: "images",
    icon: "🖼️",
    title: "Images & Design",
    description: "Generate, edit and upscale images",
    commands: [
      { cmd: "/bokeh", desc: "Add cinematic depth-of-field blur to photos" },
      { cmd: "/hd", desc: "Upscale any image to high resolution" },
      { cmd: "/upscale", desc: "Enhance image quality and detail" },
      { cmd: "/ghibli", desc: "Transform photos into Studio Ghibli art style" },
      { cmd: "/cinematic", desc: "Give images a dramatic movie look" },
      { cmd: "/pixar", desc: "Turn portraits into Pixar-style 3D characters" },
    ],
  },
  {
    id: "video",
    icon: "🎬",
    title: "Video & Audio",
    description: "Create video scripts, storyboards and audio content",
    commands: [
      { cmd: "/WriteVideoScript", desc: "Write a full video script with hooks and CTA" },
      { cmd: "/VoiceOver", desc: "Generate a voiceover script for any topic" },
      { cmd: "/storyboard", desc: "Break a scene into shot-by-shot frames" },
      { cmd: "/montage", desc: "Plan a montage sequence with transitions" },
      { cmd: "/subtitle", desc: "Generate SRT subtitles from transcript text" },
    ],
  },
  {
    id: "writing",
    icon: "✍️",
    title: "Writing & Content",
    description: "Blog posts, emails, social media and more",
    commands: [
      { cmd: "/WriteEmail", desc: "Draft professional emails with the right tone" },
      { cmd: "/WriteLinkedIn", desc: "Create engaging LinkedIn posts that get reach" },
      { cmd: "/WriteCoverLetter", desc: "Tailored cover letter for any job posting" },
      { cmd: "/Rewrite", desc: "Rewrite text for clarity, tone or audience" },
      { cmd: "/bullets", desc: "Turn long text into crisp bullet points" },
      { cmd: "/thread", desc: "Create a Twitter/X thread from any topic" },
    ],
  },
  {
    id: "code",
    icon: "💻",
    title: "Code & Debug",
    description: "Fix bugs, explain code and build features faster",
    commands: [
      { cmd: "/FixBug", desc: "Diagnose and fix errors with context" },
      { cmd: "/ExplainCode", desc: "Walk through any code line by line" },
      { cmd: "/DebugError", desc: "Trace error messages to root cause" },
      { cmd: "/WriteAPI", desc: "Scaffold a REST API endpoint with validation" },
      { cmd: "/refactor", desc: "Clean up messy code without changing behavior" },
      { cmd: "/test", desc: "Generate unit tests for any function" },
    ],
  },
  {
    id: "learn",
    icon: "🎓",
    title: "Learning & Study",
    description: "Summarize, translate and create study materials",
    commands: [
      { cmd: "/eli5", desc: "Explain any concept like you're five years old" },
      { cmd: "/tldr", desc: "Get the essential points in 3 sentences" },
      { cmd: "/SummarizeDoc", desc: "Condense articles, papers or notes" },
      { cmd: "/TranslateText", desc: "Translate with context-aware accuracy" },
      { cmd: "/CreateOutline", desc: "Build a structured outline for any topic" },
      { cmd: "/flashcards", desc: "Generate study flashcards from any content" },
    ],
  },
  {
    id: "business",
    icon: "🚀",
    title: "Business & Startup",
    description: "Strategy frameworks, pitch decks and analysis",
    commands: [
      { cmd: "/swot", desc: "Run a strengths / weaknesses / opportunities / threats analysis" },
      { cmd: "/risks", desc: "Identify and rank potential risks for any plan" },
      { cmd: "/firstprinciples", desc: "Break a problem down to fundamental truths" },
      { cmd: "/steelman", desc: "Build the strongest possible version of an argument" },
      { cmd: "/critique", desc: "Get constructive critique on any idea or draft" },
      { cmd: "/pro", desc: "Elevate any text to a professional, polished tone" },
    ],
  },
] as const;

/** Command card — shows name + description, copies on click */
function CommandCard({ cmd, desc }: { cmd: string; desc: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(cmd).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cmd]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group flex min-h-[56px] flex-col justify-center gap-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/50 sm:px-4"
    >
      <div className="flex items-center gap-2">
        <code
          className="min-w-0 flex-1 truncate text-[13px] font-semibold"
          style={{ fontFamily: "Geist Mono, ui-monospace, monospace", color: copied ? "#3fb950" : "#e6edf3" }}
        >
          {cmd}
        </code>
        {copied ? (
          <Check className="size-3.5 shrink-0 text-[#3fb950]" />
        ) : (
          <Copy className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
      <span className="line-clamp-1 text-[12px] text-muted-foreground">
        {desc}
      </span>
    </button>
  );
}

function ExplorePage() {
  return (
    <AppShell wide>
      <div className="page-content">
        {/* ── Header ── */}
        <header className="pt-2">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Commands
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {VERIFIED_TOTAL.toLocaleString()} commands across {CATEGORY_TREE.length} categories ·
            Copy any command and paste it into ChatGPT, Claude, Gemini or any AI
          </p>
        </header>

        {/* ── Use-case sections ── */}
        <div className="mt-6 space-y-8">
          {USE_CASES.map((uc) => (
            <section key={uc.id}>
              <div className="mb-3 flex items-center gap-3">
                <span className="text-xl" aria-hidden>
                  {uc.icon}
                </span>
                <div>
                  <h2 className="text-[15px] font-bold text-foreground">{uc.title}</h2>
                  <p className="text-[12px] text-muted-foreground">{uc.description}</p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {uc.commands.map((c) => (
                  <CommandCard key={c.cmd} cmd={c.cmd} desc={c.desc} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="my-8 border-t border-border" />

        {/* ── All categories grid ── */}
        <section>
          <h2 className="mb-3 text-[15px] font-bold text-foreground">
            All Categories
          </h2>
          <p className="mb-4 text-[12px] text-muted-foreground">
            {CATEGORY_TREE.length} categories · {SUBCATEGORY_TOTAL} subcategories
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_TREE.map((c) => {
              const Icon = categoryIcon(c.icon);
              return (
                <Link
                  key={c.category}
                  to="/explore/$category"
                  params={{ category: c.category }}
                  className="group flex min-h-[72px] items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/50"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-foreground">
                      {c.category}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {c.count} commands · {c.subcategories.length} subcategories
                    </span>
                  </span>
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
