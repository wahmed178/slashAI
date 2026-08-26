import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Sparkles } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GENERATORS, FREE_DAILY_RUNS, readRunCount } from "@/lib/generators";
import { useLibrary } from "@/hooks/use-library";

const TABS = [
  { value: "all", label: "All" },
  { value: "business", label: "Business" },
  { value: "content", label: "Content" },
  { value: "legal", label: "Legal & Ops" },
  { value: "growth", label: "Growth" },
] as const;

const CATEGORY_MAP: Record<string, string[]> = {
  business: ["business-names", "mvp-planner", "business-model-canvas", "pricing-page", "competitor-research", "financial-projection", "qbr-template", "okr"],
  content: ["landing-copy", "pitch-deck", "twitter-thread", "linkedin-post", "app-store", "seo-meta", "pivot-story", "product-hunt", "newsletter"],
  legal: ["privacy-policy", "terms-of-service", "sop"],
  growth: ["cold-email", "welcome-email", "partnership-email", "ab-test"],
};

export const Route = createFileRoute("/generators/")({
  head: () => ({
    meta: [
      { title: "25 Free AI Generators for Founders — SlashAI" },
      {
        name: "description",
        content:
          "25 free AI-powered generators for startup work: business names, MVP plans, pitch decks, cold emails, job descriptions and more. 5/day free.",
      },
      { property: "og:title", content: "Founder AI Toolkit — SlashAI" },
      { property: "og:description", content: "25 free Claude-powered generators for startup work." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GeneratorsIndex,
});

function GeneratorsIndex() {
  const runs = typeof window !== "undefined" ? readRunCount() : 0;
  const left = Math.max(0, FREE_DAILY_RUNS - runs);
  const [activeTab, setActiveTab] = useState("all");
  const { recents } = useLibrary();

  const filtered = useMemo(() => {
    if (activeTab === "all") return GENERATORS;
    const ids = new Set(CATEGORY_MAP[activeTab] ?? []);
    return GENERATORS.filter((g) => ids.has(g.id));
  }, [activeTab]);

  const recentGenerators = useMemo(() => {
    const recentIds = recents
      .filter((id) => id.startsWith("gen:"))
      .map((id) => id.replace("gen:", ""));
    return recentIds
      .map((id) => GENERATORS.find((g) => g.id === id))
      .filter(Boolean)
      .slice(0, 5);
  }, [recents]);

  return (
    <AppShell hideHeaderSearch title="AI Toolkit">
      <header className="pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
          <Sparkles className="size-6 text-primary" aria-hidden />
          Founder AI toolkit
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          25 focused generators that do one job well. Powered by Claude — every output is built
          from your inputs.
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">Free tier</Badge>
          <span>
            {left} of {FREE_DAILY_RUNS} generations left today · resets at midnight UTC
          </span>
        </div>
      </header>

      {recentGenerators.length > 0 && (
        <section className="mt-5">
          <h2 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <Clock className="size-3.5 text-primary" aria-hidden /> Recently used
          </h2>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {recentGenerators.map((g) => (
              <Link
                key={g!.id}
                to="/generators/$id"
                params={{ id: g!.id }}
                className="panel flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:border-primary/50"
              >
                <span>{g!.emoji}</span>
                <span className="font-medium text-foreground">{g!.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-5">
        <TabsList className="w-full overflow-x-auto">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-1 sm:flex-none">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((g) => (
              <Link
                key={g.id}
                to="/generators/$id"
                params={{ id: g.id }}
                className="panel group flex flex-col rounded-2xl p-4 transition-transform active:scale-[0.98]"
              >
                <span className="text-2xl" aria-hidden>
                  {g.emoji}
                </span>
                <h2 className="mt-2.5 font-bold text-foreground group-hover:text-primary">
                  {g.title}
                </h2>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{g.tagline}</p>
                <span className="mt-3 text-xs font-medium text-primary/80">
                  {g.fields.length} inputs → full draft
                </span>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
