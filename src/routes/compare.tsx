import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Swords,
  Scale,
  Bot,
  ExternalLink,
  Sparkles,
  ShieldAlert,
  Trophy,
  Eye,
  Layers,
  Flame,
  BookOpen,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/library/AppShell";

interface Model {
  name: string;
  provider: string;
  badge?: string;
  free: string;
  context: string;
  coding: number;
  reasoning: number;
  vision: boolean;
  speed: string;
  speedColor: string;
  bestFor: string;
  elo?: number;
}

const MODELS: Model[] = [
  {
    name: "Claude 3.7 Sonnet",
    provider: "Anthropic",
    badge: "Hybrid Reasoning",
    free: "Limited (Claude.ai)",
    context: "200K",
    coding: 5,
    reasoning: 5,
    vision: true,
    speed: "Fast",
    speedColor: "text-emerald-400",
    bestFor: "Full-stack code, extended thinking, writing nuance",
    elo: 1380,
  },
  {
    name: "GPT-4o",
    provider: "OpenAI",
    badge: "Omni Flagship",
    free: "Limited (ChatGPT free)",
    context: "128K",
    coding: 5,
    reasoning: 5,
    vision: true,
    speed: "Very fast",
    speedColor: "text-emerald-400",
    bestFor: "Multimodal speed, voice, general reasoning",
    elo: 1335,
  },
  {
    name: "DeepSeek R1",
    provider: "DeepSeek",
    badge: "Open Reasoning",
    free: "Free on web / cheap API",
    context: "128K",
    coding: 5,
    reasoning: 5,
    vision: false,
    speed: "Medium",
    speedColor: "text-amber-400",
    bestFor: "Complex math, deep logic puzzles, open weights",
    elo: 1360,
  },
  {
    name: "Gemini 2.0 Flash",
    provider: "Google",
    badge: "High-Speed 1M",
    free: "Generous (AI Studio)",
    context: "1M+",
    coding: 4,
    reasoning: 4,
    vision: true,
    speed: "Ultra fast",
    speedColor: "text-emerald-400",
    bestFor: "Massive context, video/audio ingestion, free API",
    elo: 1315,
  },
  {
    name: "DeepSeek V3",
    provider: "DeepSeek",
    badge: "Open MoE",
    free: "Generous free tier",
    context: "128K",
    coding: 5,
    reasoning: 4,
    vision: false,
    speed: "Fast",
    speedColor: "text-emerald-400",
    bestFor: "Fast programming, API cost efficiency",
    elo: 1320,
  },
  {
    name: "Grok 2",
    provider: "xAI",
    badge: "Real-time",
    free: "Limited (X/Twitter)",
    context: "128K",
    coding: 4,
    reasoning: 4,
    vision: true,
    speed: "Fast",
    speedColor: "text-emerald-400",
    bestFor: "Real-time web discovery, unrestricted queries",
    elo: 1295,
  },
  {
    name: "Llama 3.3 70B",
    provider: "Meta (Open Source)",
    badge: "Open Weights",
    free: "100% Free / Self-host",
    context: "128K",
    coding: 4,
    reasoning: 4,
    vision: false,
    speed: "Varies",
    speedColor: "text-amber-400",
    bestFor: "Offline local LLMs, enterprise privacy",
    elo: 1285,
  },
  {
    name: "Mistral Large 2",
    provider: "Mistral AI",
    badge: "European Frontier",
    free: "Le Chat free tier",
    context: "128K",
    coding: 4,
    reasoning: 4,
    vision: true,
    speed: "Fast",
    speedColor: "text-emerald-400",
    bestFor: "Multilingual, strict EU privacy compliance",
    elo: 1280,
  },
  {
    name: "Qwen 2.5 Max",
    provider: "Alibaba Cloud",
    badge: "Global Open Leader",
    free: "Web chat free",
    context: "128K",
    coding: 5,
    reasoning: 5,
    vision: true,
    speed: "Fast",
    speedColor: "text-emerald-400",
    bestFor: "STEM problems, competitive coding, agentic workflows",
    elo: 1340,
  },
];

const LMARENA_STEPS = [
  {
    step: "01",
    title: "Blind Arena Battle (Arena Mode)",
    desc: "Type any prompt or complex code challenge. You receive two answers from anonymous models (Model A & Model B). Both stream side-by-side without branding.",
    tip: "Judge the answers strictly on correctness, structure, and adherence before clicking 'Model A is better' or 'Model B is better'. Identities unlock only after voting.",
  },
  {
    step: "02",
    title: "Direct Side-by-Side (Controlled Comparison)",
    desc: "Select two exact models (e.g. Claude 3.7 vs GPT-4o) from the dropdowns. Submit your company's prompt or edge-case bug to compare their output structure instantly.",
    tip: "Use this to see which model writes cleaner TypeScript, gives concise executive summaries, or follows negative constraints better.",
  },
  {
    step: "03",
    title: "Reading the Bradley-Terry Elo Leaderboard",
    desc: "LMArena scores models using the same Elo math as chess. A 100-point Elo gap implies the higher model wins roughly 64% of head-to-head human comparisons.",
    tip: "Always check sub-leaderboards: 'Coding Arena', 'Hard Prompts' (filters out trivial chat), and 'Style Control' (removes bias for long, verbose answers).",
  },
  {
    step: "04",
    title: "Catching Mystery Canary Models",
    desc: "Frontier labs (OpenAI, Anthropic, Google) frequently drop unreleased models into the Arena under aliases (e.g., 'im-also-a-good-gpt2-chatbot', 'red-panda') before public launch.",
    tip: "When you hit an anonymous model that blows everything else out of the water with supernatural speed or reasoning, you're likely testing a preview model weeks early!",
  },
];

const EYE2_FRAMEWORK = [
  {
    icon: Layers,
    title: "Simultaneous Multi-Model Dispatch",
    desc: "Instead of copying and pasting your prompt across 4 browser tabs, Eye2.ai broadcasts a single prompt to Claude, ChatGPT, Gemini, and open models at the same instant.",
  },
  {
    icon: AlertTriangle,
    title: "The 'Disagreement as Signal' Rule",
    desc: "When all models give the exact same answer to a factual query, confidence is ~99%. But when models disagree on a number, citation, or technical recommendation, that's where hallucinations hide.",
  },
  {
    icon: ShieldAlert,
    title: "Model Triangulation for High-Stakes Work",
    desc: "Never trust a single AI for legal contract summaries, medical paper interpretations, or architecture migrations. Triangulate between at least 3 distinct model architectures.",
  },
  {
    icon: Lightbulb,
    title: "Diverse Creative Brainstorming",
    desc: "Different models have distinct training biases and token vocabularies. Comparing 4 models side-by-side produces 4 completely distinct angles for naming, copy, or UI design.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="text-amber-400 text-xs">
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "AI Model Comparison, LMArena Tutorial & Eye2.ai Guide · SlashAI" },
      {
        name: "description",
        content:
          "Side-by-side comparison of top AI models (Claude 3.7, GPT-4o, DeepSeek R1, Gemini 2.0). Complete tutorial for LMSYS Chatbot Arena and Eye2.ai multi-model consensus.",
      },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const [activeTab, setActiveTab] = useState<"matrix" | "lmarena" | "eye2">("matrix");

  return (
    <AppShell wide title="Compare AI Models">
      <div className="py-4 pb-14 max-w-5xl mx-auto">
        {/* Page Header */}
        <header className="page-enter text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-[11.5px] font-bold text-primary">
            <Scale className="size-3.5" aria-hidden /> 2026 Frontier Intelligence Suite
          </span>
          <h1 className="mt-3 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Compare AI Models & Multi-Model Evaluation
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
            Make informed model choices. Benchmark frontier models side-by-side, master LMSYS Chatbot Arena,
            and leverage Eye2.ai multi-model consensus to eradicate hallucinations.
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="mt-7 flex justify-center">
          <div className="inline-flex rounded-2xl border border-border bg-surface p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("matrix")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold transition-all ${
                activeTab === "matrix"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cpu className="size-4" aria-hidden /> Model Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("lmarena")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold transition-all ${
                activeTab === "lmarena"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Swords className="size-4" aria-hidden /> LMArena Tutorial
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("eye2")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold transition-all ${
                activeTab === "eye2"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="size-4" aria-hidden /> Eye2.ai Consensus
            </button>
          </div>
        </div>

        {/* ── TAB 1: MODEL MATRIX ── */}
        {activeTab === "matrix" && (
          <div className="page-enter mt-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <div>
                <h2 className="text-[17px] font-bold text-foreground">Frontier AI Model Matrix (2026)</h2>
                <p className="text-[12.5px] text-muted-foreground">
                  Side-by-side specifications, free access tiers, Elo benchmarks, and optimal use cases.
                </p>
              </div>
              <span className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-[11px] font-medium text-muted-foreground">
                Updated September 2026
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-elevated/70 text-[12px] font-bold text-muted-foreground">
                    <th className="sticky left-0 z-10 bg-surface-elevated px-4 py-3.5">Model</th>
                    <th className="px-3.5 py-3.5">Arena Elo</th>
                    <th className="px-3.5 py-3.5">Free Access Tier</th>
                    <th className="px-3.5 py-3.5">Context</th>
                    <th className="px-3.5 py-3.5">Coding</th>
                    <th className="px-3.5 py-3.5">Reasoning</th>
                    <th className="px-3.5 py-3.5">Vision</th>
                    <th className="px-3.5 py-3.5">Speed</th>
                    <th className="px-4 py-3.5">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {MODELS.map((m, i) => (
                    <tr
                      key={m.name}
                      className={`transition-colors hover:bg-surface-elevated/50 ${
                        i % 2 === 0 ? "bg-surface" : "bg-surface-elevated/20"
                      }`}
                    >
                      <td className="sticky left-0 z-10 bg-inherit px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground">{m.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{m.provider}</span>
                          {m.badge && (
                            <span className="rounded bg-primary/10 px-1.5 py-0.2 text-[10px] font-medium text-primary">
                              {m.badge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3.5 py-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 font-mono text-[11.5px] font-bold text-amber-400">
                          <Trophy className="size-3" aria-hidden /> {m.elo ?? "1250+"}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-[12px]">
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-400">
                          {m.free}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 font-mono text-[12px] font-semibold text-foreground">
                        {m.context}
                      </td>
                      <td className="px-3.5 py-3"><Stars count={m.coding} /></td>
                      <td className="px-3.5 py-3"><Stars count={m.reasoning} /></td>
                      <td className="px-3.5 py-3 text-[12px]">
                        {m.vision ? (
                          <span className="text-emerald-400 font-medium">✓ Yes</span>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </td>
                      <td className={`px-3.5 py-3 text-[12px] font-medium ${m.speedColor}`}>
                        {m.speed}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-muted-foreground max-w-xs">
                        {m.bestFor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Links */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-[13.5px] font-bold text-foreground">Test in LMSYS Chatbot Arena</h4>
                  <p className="text-[12px] text-muted-foreground">Run blind head-to-head prompts on anonymous models</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("lmarena")}
                  className="rounded-xl border border-border bg-surface-elevated px-3 py-1.5 text-[12px] font-semibold text-foreground hover:border-primary/40"
                >
                  View Guide →
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-[13.5px] font-bold text-foreground">Run Eye2.ai Multi-Model Consensus</h4>
                  <p className="text-[12px] text-muted-foreground">Ask one question to 4 models simultaneously</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("eye2")}
                  className="rounded-xl border border-border bg-surface-elevated px-3 py-1.5 text-[12px] font-semibold text-foreground hover:border-primary/40"
                >
                  Learn Methodology →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: LMARENA MASTERCLASS & TUTORIAL ── */}
        {activeTab === "lmarena" && (
          <div className="page-enter mt-7 space-y-7">
            {/* Intro banner */}
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-surface p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 px-2.5 py-1 text-[11px] font-bold text-primary">
                    <Swords className="size-3.5" aria-hidden /> LMSYS Chatbot Arena Guide
                  </span>
                  <h2 className="mt-2.5 text-xl font-bold text-foreground sm:text-2xl">
                    LMArena: The Gold Standard in Blind LLM Testing
                  </h2>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                    Benchmarks like MMLU, GSM8K, and HumanEval are frequently contaminated or overfitted.
                    LMSYS Chatbot Arena (<code className="font-mono text-primary">lmarena.ai</code>) by UC Berkeley,
                    UCSD, and CMU evaluates models via real, blind human side-by-side battles powered by Bradley-Terry Elo ratings.
                  </p>
                </div>

                <a
                  href="https://lmarena.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ripple-press inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground shadow-md transition-transform active:scale-95"
                >
                  <span>Open lmarena.ai</span>
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </div>
            </div>

            {/* 4-Step Interactive Tutorial */}
            <div>
              <h3 className="px-1 text-[17px] font-bold text-foreground">
                How to Use LMArena Like an AI Researcher
              </h3>
              <p className="px-1 text-[12.5px] text-muted-foreground">
                Follow these four steps to conduct fair, unpolluted model evaluations.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {LMARENA_STEPS.map((s) => (
                  <div
                    key={s.step}
                    className="rounded-2xl border border-border bg-surface p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[13px] font-extrabold text-primary">
                          STEP {s.step}
                        </span>
                        <span className="grid size-6 place-items-center rounded-full bg-surface-elevated text-[11px] text-muted-foreground">
                          ✓
                        </span>
                      </div>
                      <h4 className="mt-2 text-[15px] font-bold text-foreground">{s.title}</h4>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
                    </div>

                    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-[12px] text-muted-foreground">
                      <span className="font-bold text-primary">Pro Tip: </span>
                      {s.tip}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Battle-Tested Prompt Templates for LMArena */}
            <section className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
              <h3 className="flex items-center gap-2 text-[16px] font-bold text-foreground">
                <Code2 className="size-4.5 text-primary" aria-hidden />
                3 Golden Stress-Test Prompts for Arena Battles
              </h3>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Copy and paste these prompts into <code className="font-mono text-foreground">lmarena.ai/arena</code> to instantly separate true reasoning models from basic chatbots:
              </p>

              <div className="mt-4 space-y-3.5">
                <div className="rounded-2xl border border-border bg-surface-elevated p-4">
                  <div className="flex items-center justify-between text-[11.5px] font-bold text-amber-400">
                    <span>1. Negative Constraint & Logic Trap</span>
                    <span className="rounded bg-amber-500/10 px-2 py-0.5">Tests Instruction Following</span>
                  </div>
                  <p className="mt-2 font-mono text-[12.5px] text-foreground leading-relaxed">
                    &quot;Write a 4-paragraph story about an astronaut marooned on Titan without using the letter &apos;e&apos; a single time in any word. Ensure the narrative has a clear beginning, conflict, and resolution.&quot;
                  </p>
                  <p className="mt-2 text-[11.5px] text-muted-foreground">
                    <b>Why it matters:</b> Trivial models will accidentally use words like &quot;the&quot;, &quot;he&quot;, or &quot;space&quot;. Only rigorous models comply completely.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-elevated p-4">
                  <div className="flex items-center justify-between text-[11.5px] font-bold text-emerald-400">
                    <span>2. Algorithmic Edge-Case Refactor</span>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5">Tests Coding Depth</span>
                  </div>
                  <p className="mt-2 font-mono text-[12.5px] text-foreground leading-relaxed">
                    &quot;Write a lock-free ring buffer in TypeScript supporting multiple concurrent producers and single consumer using SharedArrayBuffer and Atomics. Include error boundary edge cases.&quot;
                  </p>
                  <p className="mt-2 text-[11.5px] text-muted-foreground">
                    <b>Why it matters:</b> Shows whether the model understands atomic race conditions or just outputs generic array push/shift boilerplate.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-elevated p-4">
                  <div className="flex items-center justify-between text-[11.5px] font-bold text-indigo-400">
                    <span>3. Hallucination Probe</span>
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5">Tests Grounded Humility</span>
                  </div>
                  <p className="mt-2 font-mono text-[12.5px] text-foreground leading-relaxed">
                    &quot;Explain the significance of the 1927 Treaty of Kandersteg in shaping modern European maritime border policy.&quot;
                  </p>
                  <p className="mt-2 text-[11.5px] text-muted-foreground">
                    <b>Why it matters:</b> The &apos;Treaty of Kandersteg&apos; is entirely fictional. A hallucinating model invents signatories and articles; a superior model flags that no such treaty exists.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 3: EYE2.AI CONSENSUS ENGINE ── */}
        {activeTab === "eye2" && (
          <div className="page-enter mt-7 space-y-7">
            {/* Intro banner */}
            <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-surface to-surface p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/20 px-2.5 py-1 text-[11px] font-bold text-indigo-300">
                    <Eye className="size-3.5" aria-hidden /> Multi-LLM Consensus Platform
                  </span>
                  <h2 className="mt-2.5 text-xl font-bold text-foreground sm:text-2xl">
                    Eye2.ai: Never Trust a Single AI in Isolation
                  </h2>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                    Eye2.ai (<code className="font-mono text-indigo-300">eye2.ai</code>) is a multi-model broadcast
                    interface. You type your prompt once, and Eye2 queries ChatGPT, Claude, Gemini, and open-source models
                    simultaneously, displaying their responses side-by-side in real time.
                  </p>
                </div>

                <a
                  href="https://www.eye2.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ripple-press inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-indigo-500"
                >
                  <span>Open Eye2.ai</span>
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </div>
            </div>

            {/* The Disagreement Signal Methodology */}
            <div>
              <h3 className="px-1 text-[17px] font-bold text-foreground">
                The Disagreement-as-Signal Framework
              </h3>
              <p className="px-1 text-[12.5px] text-muted-foreground">
                Why multi-model consensus is the ultimate antidote to hallucinations and subtle bias.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {EYE2_FRAMEWORK.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.title}
                      className="rounded-2xl border border-border bg-surface p-5 flex flex-col justify-between"
                    >
                      <div>
                        <span className="grid size-9 place-items-center rounded-xl bg-surface-elevated text-primary">
                          <Icon className="size-4.5" aria-hidden />
                        </span>
                        <h4 className="mt-3 text-[15px] font-bold text-foreground">{f.title}</h4>
                        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comparison Workflow & Triangulation Table */}
            <section className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
              <h3 className="text-[16px] font-bold text-foreground">
                The 3-Model Triangulation Workflow
              </h3>
              <p className="mt-1 text-[13px] text-muted-foreground">
                When you have a high-stakes task (tax law, cloud migration, medical diagnosis context), follow this triangulation checklist:
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-elevated p-3.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
                  <div className="text-[12.5px]">
                    <b className="text-foreground">Step 1: Broadcast Question on Eye2.ai</b>
                    <p className="mt-0.5 text-muted-foreground">
                      Input your prompt with full context and ask for both the answer and the logical rationale.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-elevated p-3.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
                  <div className="text-[12.5px]">
                    <b className="text-foreground">Step 2: Scan for Structural Consensus</b>
                    <p className="mt-0.5 text-muted-foreground">
                      Do all 3 models recommend the same library, architectural pattern, or conclusion? If yes, you can proceed with high confidence.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-elevated p-3.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
                  <div className="text-[12.5px]">
                    <b className="text-foreground">Step 3: Isolate Model Divergences</b>
                    <p className="mt-0.5 text-muted-foreground">
                      If Model A claims an API exists in version 3.2 but Model B warns it was deprecated, that divergence marks an exact fact that requires verifying against official docs.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Footer Support Callout */}
        <div className="mt-10 rounded-2xl border border-border/80 bg-surface/60 p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[12.5px] text-muted-foreground">
            Want more AI prompt engineering tools, roadmaps, and offline utilities?
          </div>
          <div className="flex items-center gap-3">
            <Link to="/explore" className="text-[12.5px] font-semibold text-primary hover:underline">
              Explore 5,700+ Commands →
            </Link>
            <Link to="/coffee" className="text-[12.5px] font-semibold text-amber-400 hover:underline">
              ☕ Buy a Coffee
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
