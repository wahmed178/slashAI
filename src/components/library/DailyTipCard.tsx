import { useState } from "react";
import { Lightbulb, Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DAILY_AI_TIPS = [
  "Use [brackets] in commands to mark what you need to customize before running the prompt.",
  "Chain 2 commands together — paste the output of one as input to the next for compounded quality.",
  "Add 'in bullet points' to any command to get scannable, instantly actionable results.",
  "Start every AI session with context: state your role, your goal, and your hard constraints.",
  "Use the Pomodoro tool in SlashKits to stay focused and avoid context-switching while using AI.",
  "Ask the AI to critique its own first draft — it often spots logical gaps humans miss.",
  "Specify 'No conversational filler, no polite preamble' to save reading time and context tokens.",
  "Provide 1–2 real examples (few-shot prompting) to drastically improve format accuracy.",
  "When brainstorming, tell the model: 'Generate 10 ideas, then highlight the 3 most unconventional ones.'",
  "Ask the AI to explain complex concepts at two levels: 'Explain to a beginner, then to a senior practitioner.'",
  "Use temperature tags: specify 'be strictly analytical and conservative' for data, or 'be highly creative' for hooks.",
  "Before asking for code, ask the model to list potential edge cases and security gotchas first.",
  "Keep a personal build journal in SlashAI to track which prompt patterns consistently deliver results.",
  "Assign the model a specific persona (e.g. senior code reviewer, venture partner) for sharper critical feedback.",
  "When debugging, paste the exact stack trace and error message directly alongside the minimal code block.",
  "State negative constraints clearly: telling an AI what NOT to include is as important as what to include.",
  "Ask for comparison output in markdown tables to quickly contrast alternatives, pricing, or features.",
  "Use the 'ELI5' technique when reading dense research papers or architectural specifications.",
  "Deconstruct complex workflows into steps: plan first, execute phase-by-phase, verify at each step.",
  "Ask the AI: 'What crucial assumptions did you make in generating this response?' to audit its reasoning.",
  "When drafting emails or copy, ask for 3 distinct tones: concise, persuasive, and conversational.",
  "Use 'Think step-by-step and write your chain of logic' when asking the model to solve math or algorithmic problems.",
  "Save your most-used commands to Favorites (⭐) for instant offline access without re-searching.",
  "Ask the AI to generate the questions it needs you to answer before giving a high-stakes recommendation.",
  "Use 'Try in AI' quick buttons on command detail pages to jump straight into ChatGPT, Gemini, or Claude.",
  "When summarizing meeting notes, instruct the AI to cleanly separate 'Decisions Made' from 'Action Items & Owners'.",
  "Cross-test your hardest prompts across multiple models — different LLMs excel at different reasoning styles.",
  "Take short breaks with SlashPlay games to refresh mental clarity and maintain deep work momentum.",
  "Give strict word or paragraph caps: 'Keep response under 120 words' prevents rambling answers.",
  "Install SlashAI as a PWA or add to your home screen for zero-latency, offline-ready command access.",
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

interface Props {
  className?: string;
}

export function DailyTipCard({ className }: Props) {
  const dayOfYear = getDayOfYear();
  const tipIndex = dayOfYear % DAILY_AI_TIPS.length;
  const tip: string = DAILY_AI_TIPS[tipIndex] ?? (DAILY_AI_TIPS[0] as string);
  const [copied, setCopied] = useState(false);

  const copyTip = async () => {
    try {
      await navigator.clipboard.writeText(tip);
      setCopied(true);
      toast.success("Copied daily tip to clipboard!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard blocked by browser");
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-surface p-4.5 sm:p-5 transition-all duration-150 hover:border-primary/40",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
            <Lightbulb className="size-4" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
                Daily AI Tip
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                #{tipIndex + 1}/30
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              A bite-sized technique to get 10x better results from AI
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={copyTip}
          aria-label="Copy today's AI tip"
          title="Copy tip"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
        </button>
      </div>

      <div className="mt-3 rounded-xl border border-border/60 bg-surface-elevated/80 p-3 text-sm font-medium leading-relaxed text-foreground">
        “{tip}”
      </div>
    </div>
  );
}
