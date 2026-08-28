import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

import { AppShell } from "@/components/library/AppShell";
import { categoryIcon } from "@/components/library/icons";
import { CATEGORY_TREE, SUBCATEGORY_TOTAL, VERIFIED_TOTAL } from "@/lib/commands";
import { COMMANDS } from "@/lib/commands";

export const Route = createFileRoute("/explore/")({
  head: () => ({
    meta: [
      { title: "Explore — SlashAI" },
      {
        name: "description",
        content: `Browse ${VERIFIED_TOTAL} AI slash commands across ${CATEGORY_TREE.length} categories. Find commands for images, video, code, writing, learning and more.`,
      },
      { property: "og:title", content: "Explore — SlashAI" },
    ],
  }),
  component: ExplorePage,
});

/** Use-case sections — curated commands that show what SlashAI can actually do */
const USE_CASES = [
  {
    id: "images",
    icon: "🖼️",
    title: "Images & Design",
    description: "Generate, edit and upscale images",
    color: "#a78bfa",
    commands: ["/bokeh", "/hd", "/upscale", "/ghibli", "/cinematic", "/pixar"],
  },
  {
    id: "video",
    icon: "🎬",
    title: "Video & Audio",
    description: "Create video scripts and audio content",
    color: "#f472b6",
    commands: ["/WriteVideoScript", "/VoiceOver", "/storyboard", "/montage", "/subtitle"],
  },
  {
    id: "writing",
    icon: "✍️",
    title: "Writing & Content",
    description: "Blog posts, emails, social media and more",
    color: "#34d399",
    commands: ["/WriteEmail", "/WriteLinkedIn", "/WriteCoverLetter", "/Rewrite", "/bullets", "/thread"],
  },
  {
    id: "code",
    icon: "💻",
    title: "Code & Debug",
    description: "Fix bugs, explain code, build features",
    color: "#60a5fa",
    commands: ["/FixBug", "/ExplainCode", "/DebugError", "/WriteAPI", "/refactor", "/test"],
  },
  {
    id: "learn",
    icon: "🎓",
    title: "Learning & Study",
    description: "Summarize, translate, and create study plans",
    color: "#fbbf24",
    commands: ["/eli5", "/tldr", "/SummarizeDoc", "/TranslateText", "/CreateOutline", "/flashcards"],
  },
  {
    id: "business",
    icon: "🚀",
    title: "Business & Startup",
    description: "Pitch decks, business plans and SWOT analysis",
    color: "#fb923c",
    commands: ["/swot", "/risks", "/firstprinciples", "/steelman", "/critique", "/pro"],
  },
] as const;

/** A small command pill that copies on click */
function CommandPill({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(command).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [command]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group flex min-h-[44px] items-center gap-2 rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#58a6ff] sm:px-4"
    >
      <code
        className="flex-1 truncate text-left text-[13px] font-medium"
        style={{ fontFamily: "Geist Mono, ui-monospace, monospace", color: copied ? "#3fb950" : "#e6edf3" }}
      >
        {command}
      </code>
      {copied ? (
        <Check className="size-3.5 shrink-0 text-[#3fb950]" />
      ) : (
        <Copy className="size-3.5 shrink-0 text-[#8b949e] opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}

function ExplorePage() {
  return (
    <AppShell wide>
      <div className="animate-slide-in-up">
        {/* ── Header ── */}
        <header className="pt-2">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Commands
          </h1>
          <p className="mt-1 text-sm text-[#8b949e]">
            {VERIFIED_TOTAL.toLocaleString()} commands across {CATEGORY_TREE.length} categories ·
            Copy any command and paste it into ChatGPT, Claude, Gemini or any AI
          </p>
        </header>

        {/* ── Use-case sections ── */}
        <div className="mt-6 space-y-8">
          {USE_CASES.map((uc) => (
            <section key={uc.id}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl" aria-hidden>
                  {uc.icon}
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#e6edf3]">{uc.title}</h2>
                  <p className="text-xs text-[#8b949e]">{uc.description}</p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {uc.commands.map((cmd) => (
                  <CommandPill key={cmd} command={cmd} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="my-8 border-t border-[#30363d]" />

        {/* ── All categories grid ── */}
        <section>
          <h2 className="mb-3 text-base font-bold text-[#e6edf3]">
            All Categories
          </h2>
          <p className="mb-4 text-xs text-[#8b949e]">
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
                  className="group flex min-h-[72px] items-center gap-3 rounded-xl border border-[#30363d] bg-[#161b22] p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#58a6ff]"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#21262d] text-[#58a6ff]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-[#e6edf3]">
                      {c.category}
                    </span>
                    <span className="block truncate text-xs text-[#8b949e]">
                      {c.count} commands · {c.subcategories.length} subcategories
                    </span>
                  </span>
                  <ChevronRight
                    className="size-4 shrink-0 text-[#8b949e] transition-transform group-hover:translate-x-0.5"
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
