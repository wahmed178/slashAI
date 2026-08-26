import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Check, Heart, Share2, ExternalLink, ArrowLeft } from "lucide-react";

import { VIRAL_PROMPTS, CATEGORY_GRADIENTS, CATEGORY_EMOJI } from "@/lib/viral-prompts";

/* ═══════════════════════════════════════════════════════════════════
   COPY BUTTON
   ═══════════════════════════════════════════════════════════════════ */
function CopyBtn({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);
  return (
    <button
      type="button"
      onClick={copy}
      className={`flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ${
        copied
          ? "bg-emerald-500/90 text-white"
          : "bg-white text-gray-900 hover:bg-white/90"
      } ${className}`}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied!" : "Copy Prompt"}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REEL CARD
   ═══════════════════════════════════════════════════════════════════ */
function ReelCard({
  prompt,
  index,
  isActive,
}: {
  prompt: (typeof VIRAL_PROMPTS)[number];
  index: number;
  isActive: boolean;
}) {
  const [saved, setSaved] = useState(false);

  return (
    <div
      className="relative flex h-full w-full snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 py-12"
      style={{ background: CATEGORY_GRADIENTS[prompt.category] }}
    >
      {/* Top: badge + back */}
      <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {prompt.category}
        </span>
        <span className="rounded-full bg-red-500/80 px-2.5 py-1 text-[11px] font-bold text-white">
          {prompt.badge}
        </span>
      </div>

      {/* Center: content */}
      <div className="flex max-w-md flex-col items-center text-center">
        <span className="text-5xl">{CATEGORY_EMOJI[prompt.category]}</span>
        <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
          {prompt.title}
        </h2>
        <p className="mt-2 text-base text-white/80">{prompt.teaser}</p>

        {/* Prompt text */}
        <div className="mt-5 max-h-40 w-full overflow-y-auto rounded-xl bg-black/30 p-4 text-left text-sm text-white/90 backdrop-blur-sm">
          <p className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed">
            {prompt.prompt}
          </p>
        </div>

        <p className="mt-3 text-xs text-white/50">
          {prompt.worksWith}
        </p>
      </div>

      {/* Right sidebar icons (TikTok-style) */}
      <div className="absolute bottom-28 right-4 flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={() => setSaved(!saved)}
          className="flex flex-col items-center gap-1"
        >
          <Heart
            className={`size-7 transition-all ${
              saved ? "fill-white text-white scale-110" : "text-white"
            }`}
          />
          <span className="text-[10px] text-white/80">{saved ? "Saved" : "Save"}</span>
        </button>

        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText(prompt.prompt)
          }
          className="flex flex-col items-center gap-1"
        >
          <Copy className="size-7 text-white" />
          <span className="text-[10px] text-white/80">Copy</span>
        </button>

        <a
          href={`https://chat.openai.com/?q=${encodeURIComponent(prompt.prompt)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1"
        >
          <ExternalLink className="size-7 text-white" />
          <span className="text-[10px] text-white/80">Try it</span>
        </a>
      </div>

      {/* Bottom: progress dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-xs text-white/60">
        {index + 1} / {VIRAL_PROMPTS.length}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export const Route = createFileRoute("/discover/reels")({
  head: () => ({
    meta: [
      { title: "Reels — SlashAI Viral Prompts" },
      {
        name: "description",
        content:
          "Swipe through viral AI prompts in a TikTok-style full-screen feed. Copy, save, and try instantly.",
      },
    ],
  }),
  component: ReelsPage,
});

function ReelsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, VIRAL_PROMPTS.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Scroll to active card
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const child = container.children[activeIndex] as HTMLElement | undefined;
    if (child) {
      child.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeIndex]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Back button */}
      <Link
        to="/discover"
        className="absolute left-4 top-4 z-50 flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
      >
        <ArrowLeft className="size-5" />
      </Link>

      {/* Snap scroll container */}
      <div
        ref={containerRef}
        className="h-full snap-y snap-mandatory overflow-y-scroll"
        onScroll={(e) => {
          const container = e.currentTarget;
          const scrollTop = container.scrollTop;
          const childHeight = container.children[0]
            ? (container.children[0] as HTMLElement).offsetHeight
            : 1;
          const idx = Math.round(scrollTop / childHeight);
          if (idx !== activeIndex && idx >= 0 && idx < VIRAL_PROMPTS.length) {
            setActiveIndex(idx);
          }
        }}
      >
        {VIRAL_PROMPTS.map((prompt, i) => (
          <ReelCard
            key={prompt.id}
            prompt={prompt}
            index={i}
            isActive={i === activeIndex}
          />
        ))}
      </div>
    </div>
  );
}
