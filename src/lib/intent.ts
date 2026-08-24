/**
 * Intent engine — turns free-text keywords into a shortlist of app features,
 * catalog matches and a ready-to-copy prompt. Purely local and deterministic,
 * so it works offline and never spends credits.
 */
import { COMMANDS, scoreCommand, type SlashCommand } from "./commands";
import { BUILD_IDEAS } from "./build-ideas";
import { searchResources } from "./resources";
import type { BuildIdea } from "./build-ideas-types";
import type { Resource } from "./resources";

export interface FeatureTarget {
  id: string;
  label: string;
  blurb: string;
  to: string;
  /** search params passed through when the destination needs them */
  search?: Record<string, string>;
  keywords: string[];
  icon: string;
}

/** Everything in SlashAI a keyword can resolve to. */
export const FEATURES: FeatureTarget[] = [
  {
    id: "commands",
    label: "Command library",
    blurb: "Slash commands for any AI assistant, with copy-ready examples.",
    to: "/search",
    keywords: [
      "command",
      "prompt",
      "slash",
      "ai",
      "chatgpt",
      "gemini",
      "claude",
      "write",
      "image",
      "code",
      "summarize",
    ],
    icon: "Terminal",
  },
  {
    id: "ideas",
    label: "Build ideas",
    blurb: "Validated product ideas with MVP scope, monetisation and build steps.",
    to: "/build-ideas",
    keywords: [
      "idea",
      "startup",
      "saas",
      "business",
      "side project",
      "build",
      "app idea",
      "product",
      "mvp",
    ],
    icon: "Lightbulb",
  },
  {
    id: "validate",
    label: "Idea validator",
    blurb: "Pressure-test an idea before you build it.",
    to: "/build-ideas/validate",
    keywords: ["validate", "validation", "market", "competition", "risk", "demand"],
    icon: "Sparkles",
  },
  {
    id: "projects",
    label: "My projects",
    blurb: "Track the ideas you saved and what stage they're at.",
    to: "/build-ideas/projects",
    keywords: ["project", "tracker", "progress", "stage", "saved"],
    icon: "FolderKanban",
  },
  {
    id: "assistant",
    label: "Assistant & tasks",
    blurb: "Ask in plain words, get a workflow plus tasks you can tick off.",
    to: "/assistant",
    keywords: [
      "assistant",
      "bot",
      "help",
      "task",
      "todo",
      "workflow",
      "plan",
      "steps",
      "checklist",
      "reminder",
    ],
    icon: "Bot",
  },
  {
    id: "youtube",
    label: "YouTube hub",
    blurb: "Search videos and music, play them in an embedded player.",
    to: "/youtube",
    keywords: [
      "youtube",
      "video",
      "music",
      "song",
      "songs",
      "watch",
      "lofi",
      "playlist",
      "audio",
      "tutorial",
    ],
    icon: "Youtube",
  },
  {
    id: "movies",
    label: "Movie finder",
    blurb: "Regional films from India, Pakistan and neighbours with legal watch links.",
    to: "/movies",
    keywords: [
      "movie",
      "movies",
      "film",
      "cinema",
      "bollywood",
      "telugu",
      "tamil",
      "hindi",
      "urdu",
      "malayalam",
      "pakistani",
      "netflix",
      "streaming",
    ],
    icon: "Film",
  },
  {
    id: "live",
    label: "Live dashboard",
    blurb: "News, weather and cricket + football scores in one place.",
    to: "/live",
    keywords: [
      "news",
      "weather",
      "cricket",
      "football",
      "score",
      "match",
      "live",
      "today",
      "temperature",
      "forecast",
    ],
    icon: "Radio",
  },
  {
    id: "tools",
    label: "Free tools",
    blurb: "Hand-checked free AI tools and web apps.",
    to: "/tools",
    keywords: ["tool", "tools", "free", "app", "software", "generator", "editor", "converter"],
    icon: "Wrench",
  },
  {
    id: "discover",
    label: "Discover hub",
    blurb: "Free AI, GitHub gems, Reddit wikis, websites and learning resources.",
    to: "/discover",
    keywords: [
      "discover",
      "resource",
      "github",
      "reddit",
      "website",
      "learn",
      "course",
      "free stuff",
      "open source",
    ],
    icon: "Compass",
  },
  {
    id: "play",
    label: "Play & decide",
    blurb: "Coin toss, dice, decision wheel and a surprise command.",
    to: "/play",
    keywords: [
      "play",
      "game",
      "bored",
      "toss",
      "coin",
      "dice",
      "random",
      "decide",
      "fun",
      "time pass",
    ],
    icon: "Dices",
  },
  {
    id: "collections",
    label: "Collections",
    blurb: "Curated command bundles for a specific job.",
    to: "/collections",
    keywords: ["collection", "bundle", "pack", "curated", "workflow"],
    icon: "Layers",
  },
  {
    id: "favorites",
    label: "Saved items",
    blurb: "Everything you starred, in one list.",
    to: "/favorites",
    keywords: ["saved", "favorite", "favourite", "starred", "bookmark"],
    icon: "Heart",
  },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
const tokens = (s: string) =>
  norm(s)
    .split(/\s+/)
    .filter((t) => t.length > 1);

export interface FeatureMatch {
  feature: FeatureTarget;
  score: number;
  hits: string[];
}

export function matchFeatures(query: string, limit = 5): FeatureMatch[] {
  const q = norm(query).trim();
  if (!q) return [];
  const words = tokens(q);
  const out: FeatureMatch[] = [];

  for (const feature of FEATURES) {
    let score = 0;
    const hits: string[] = [];
    for (const kw of feature.keywords) {
      if (q.includes(kw)) {
        score += kw.includes(" ") ? 60 : 40;
        hits.push(kw);
        continue;
      }
      for (const w of words) {
        if (kw.startsWith(w) || w.startsWith(kw)) {
          score += 18;
          hits.push(kw);
          break;
        }
      }
    }
    if (norm(feature.label).includes(q)) score += 80;
    if (score > 0) out.push({ feature, score, hits: [...new Set(hits)].slice(0, 4) });
  }

  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

export interface IntentResult {
  query: string;
  features: FeatureMatch[];
  commands: SlashCommand[];
  ideas: BuildIdea[];
  resources: Resource[];
  prompt: string;
  steps: string[];
}

function topCommands(q: string, limit: number): SlashCommand[] {
  const scored: { c: SlashCommand; s: number }[] = [];
  for (const c of COMMANDS) {
    const s = scoreCommand(c, q);
    if (s > 0) scored.push({ c, s });
  }
  return scored
    .sort((a, b) => b.s - a.s || b.c.popularity - a.c.popularity)
    .slice(0, limit)
    .map((x) => x.c);
}

function topIdeas(q: string, limit: number): BuildIdea[] {
  const words = tokens(q);
  if (words.length === 0) return [];
  const scored = BUILD_IDEAS.map((idea) => {
    const hay = norm(
      [idea.title, idea.shortDescription, idea.category, idea.tags.join(" ")].join(" "),
    );
    let s = 0;
    for (const w of words) if (hay.includes(w)) s += w.length > 4 ? 3 : 2;
    return { idea, s };
  }).filter((x) => x.s > 0);
  return scored
    .sort((a, b) => b.s - a.s || b.idea.opportunityScore - a.idea.opportunityScore)
    .slice(0, limit)
    .map((x) => x.idea);
}

/** Build a copy-ready prompt from the query and the strongest catalog matches. */
export function buildPrompt(query: string, commands: SlashCommand[]): string {
  const goal = query.trim().replace(/\s+/g, " ");
  const useful = commands.slice(0, 3);
  const lines = [
    `Goal: ${goal || "help me get this done"}`,
    "Role: act as an expert who has shipped this exact thing many times.",
    "",
    "Do this:",
    "1. Ask me at most 3 questions only if something blocks you — otherwise start.",
    "2. Give a short plan, then the actual output (not a description of it).",
    "3. Flag assumptions and the one thing most likely to go wrong.",
    "",
    "Output format: headed sections, no filler, copy-paste ready.",
  ];
  if (useful.length) {
    lines.push(
      "",
      `Related SlashAI commands you can chain: ${useful.map((c) => c.command).join(", ")}`,
    );
  }
  return lines.join("\n");
}

/** Turn a query into an ordered, actionable workflow. */
export function buildWorkflow(query: string, features: FeatureMatch[]): string[] {
  const goal = query.trim() || "your goal";
  const steps = [
    `Write the outcome in one sentence: "${goal}" — done means what exactly?`,
    "Collect the inputs first (files, links, numbers) so nothing stalls mid-flow.",
  ];
  for (const f of features.slice(0, 3)) {
    steps.push(`Open ${f.feature.label} — ${f.feature.blurb}`);
  }
  steps.push(
    "Run the generated prompt in your AI assistant and paste the raw output back.",
    "Review against the outcome sentence, then keep only what moves it forward.",
  );
  return steps;
}

export function resolveIntent(query: string): IntentResult {
  const features = matchFeatures(query, 5);
  const commands = topCommands(query, 8);
  const ideas = topIdeas(query, 4);
  const resources = query.trim() ? searchResources(query, 4) : [];
  return {
    query,
    features,
    commands,
    ideas,
    resources,
    prompt: buildPrompt(query, commands),
    steps: buildWorkflow(query, features),
  };
}
