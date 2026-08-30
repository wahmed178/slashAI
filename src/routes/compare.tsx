import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

interface Model {
  name: string;
  provider: string;
  free: string;
  context: string;
  coding: number;
  reasoning: number;
  vision: boolean;
  speed: string;
  speedColor: string;
  bestFor: string;
}

const MODELS: Model[] = [
  { name: "GPT-4o", provider: "OpenAI", free: "Limited (ChatGPT free)", context: "128K", coding: 5, reasoning: 5, vision: true, speed: "Fast", speedColor: "text-green", bestFor: "General use, coding, analysis" },
  { name: "Claude Sonnet 4.5", provider: "Anthropic", free: "Limited (Claude.ai)", context: "200K", coding: 5, reasoning: 5, vision: true, speed: "Fast", speedColor: "text-green", bestFor: "Long documents, writing, coding" },
  { name: "Gemini 1.5 Pro", provider: "Google", free: "Limited (AI Studio)", context: "1M", coding: 4, reasoning: 4, vision: true, speed: "Medium", speedColor: "text-yellow", bestFor: "Very long documents, multimodal" },
  { name: "Gemini Flash 2.0", provider: "Google", free: "Generous (AI Studio)", context: "1M", coding: 3, reasoning: 3, vision: true, speed: "Very fast", speedColor: "text-green", bestFor: "Quick tasks, high volume, free" },
  { name: "Grok 2", provider: "xAI", free: "Limited (X/Twitter)", context: "128K", coding: 4, reasoning: 4, vision: true, speed: "Fast", speedColor: "text-green", bestFor: "Real-time info, X integration" },
  { name: "DeepSeek V3", provider: "DeepSeek", free: "Generous API free tier", context: "128K", coding: 5, reasoning: 5, vision: false, speed: "Fast", speedColor: "text-green", bestFor: "Coding, cheap API alternative" },
  { name: "Llama 3.1 70B", provider: "Meta (open source)", free: "Free to download", context: "128K", coding: 4, reasoning: 4, vision: false, speed: "Varies", speedColor: "text-yellow", bestFor: "Self-hosting, privacy" },
  { name: "Mistral Large", provider: "Mistral AI", free: "API free trial", context: "128K", coding: 4, reasoning: 4, vision: false, speed: "Fast", speedColor: "text-green", bestFor: "European privacy, multilingual" },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="text-sm">
      {"⭐".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "AI Model Comparison 2026 — SlashAI" },
      { name: "description", content: "Side-by-side comparison of the best AI models available today — free and paid." },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  return (
    <AppShell wide title="Compare">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">AI Model Comparison 2026</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Side-by-side comparison of the best AI models available today — free and paid.
        </p>
        <span className="mt-2 inline-block rounded-full bg-surface-elevated px-2.5 py-1 text-[11px] text-muted-foreground">
          Last verified: August 2026
        </span>

        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-[10px] border border-border">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-border bg-[#21262d]">
                <th className="sticky left-0 z-10 bg-[#21262d] px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Model</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Free Tier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Context</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Coding</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Reasoning</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Vision</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Speed</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Best For</th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map((m, i) => (
                <tr
                  key={m.name}
                  className={`border-b border-border/50 transition-colors hover:bg-[#21262d] ${i % 2 === 0 ? "bg-surface" : "bg-[#1c2128]"}`}
                >
                  <td className="sticky left-0 z-10 bg-inherit px-4 py-3">
                    <div className="font-semibold text-foreground">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground">{m.provider}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded bg-green/15 px-2 py-0.5 text-[11px] font-medium text-green">
                      {m.free}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{m.context}</td>
                  <td className="px-4 py-3"><Stars count={m.coding} /></td>
                  <td className="px-4 py-3"><Stars count={m.reasoning} /></td>
                  <td className="px-4 py-3">
                    {m.vision ? (
                      <span className="text-green">✅ Yes</span>
                    ) : (
                      <span className="text-red">❌ No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={m.speedColor}>{m.speed}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Model capabilities change frequently. Always verify on the official provider website.
        </p>

        <div className="mt-6 flex gap-4">
          <Link to="/assistant" className="text-sm text-primary hover:underline">Try the AI Assistant →</Link>
          <Link to="/assistant/about" className="text-sm text-primary hover:underline">Learn more →</Link>
        </div>
      </div>
    </AppShell>
  );
}
