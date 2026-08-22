/**
 * Curated directory of AI tools with a usable free tier. Static data only —
 * no tracking, no affiliate links, no account required to use any of them.
 */
export interface AiTool {
  id: string;
  name: string;
  vendor: string;
  category: ToolCategory;
  bestFor: string;
  freeTier: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  url: string;
  /** search query used by "See commands" */
  query: string;
}

export type ToolCategory =
  | "General AI"
  | "Writing"
  | "Image"
  | "Coding"
  | "Learning"
  | "Productivity"
  | "Research"
  | "Design"
  | "Voice";

export const TOOL_CATEGORIES: ToolCategory[] = [
  "General AI",
  "Writing",
  "Image",
  "Coding",
  "Learning",
  "Productivity",
  "Research",
  "Design",
  "Voice",
];

export const TOOLS: AiTool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    category: "General AI",
    bestFor: "Writing, Q&A, everyday tasks",
    freeTier: "Free tier with a capable default model",
    difficulty: "Beginner",
    url: "https://chat.openai.com",
    query: "writing",
  },
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    category: "General AI",
    bestFor: "Long documents, careful reasoning",
    freeTier: "Free plan with daily limits",
    difficulty: "Beginner",
    url: "https://claude.ai",
    query: "summarize",
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    category: "General AI",
    bestFor: "Search-grounded answers, images",
    freeTier: "Free",
    difficulty: "Beginner",
    url: "https://gemini.google.com",
    query: "research",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    vendor: "Perplexity AI",
    category: "Research",
    bestFor: "Cited research and fact-finding",
    freeTier: "Free with unlimited quick searches",
    difficulty: "Beginner",
    url: "https://www.perplexity.ai",
    query: "research",
  },
  {
    id: "copilot",
    name: "Microsoft Copilot",
    vendor: "Microsoft",
    category: "Productivity",
    bestFor: "Documents, spreadsheets, email",
    freeTier: "Free web version",
    difficulty: "Beginner",
    url: "https://copilot.microsoft.com",
    query: "email",
  },
  {
    id: "mimo",
    name: "Mimo",
    vendor: "Mimo",
    category: "Coding",
    bestFor: "Learning to code on mobile",
    freeTier: "Free lessons",
    difficulty: "Beginner",
    url: "https://mimo.org",
    query: "learn code",
  },
  {
    id: "gamma",
    name: "Gamma",
    vendor: "Gamma",
    category: "Productivity",
    bestFor: "Slide decks and one-pagers",
    freeTier: "Free credits on signup",
    difficulty: "Beginner",
    url: "https://gamma.app",
    query: "presentation",
  },
  {
    id: "canva",
    name: "Canva AI",
    vendor: "Canva",
    category: "Design",
    bestFor: "Social posts, posters, quick design",
    freeTier: "Free plan",
    difficulty: "Beginner",
    url: "https://www.canva.com",
    query: "design",
  },
  {
    id: "bing-image",
    name: "Bing Image Creator",
    vendor: "Microsoft",
    category: "Image",
    bestFor: "Free text-to-image generation",
    freeTier: "Free with daily boosts",
    difficulty: "Beginner",
    url: "https://www.bing.com/images/create",
    query: "image",
  },
  {
    id: "leonardo",
    name: "Leonardo AI",
    vendor: "Leonardo",
    category: "Image",
    bestFor: "Stylised art and concept images",
    freeTier: "Daily free credits",
    difficulty: "Intermediate",
    url: "https://leonardo.ai",
    query: "illustration",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    vendor: "ElevenLabs",
    category: "Voice",
    bestFor: "Natural text-to-speech",
    freeTier: "Free monthly characters",
    difficulty: "Intermediate",
    url: "https://elevenlabs.io",
    query: "voiceover",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    vendor: "Notion",
    category: "Productivity",
    bestFor: "Notes, docs and task write-ups",
    freeTier: "Limited free responses",
    difficulty: "Beginner",
    url: "https://www.notion.so/product/ai",
    query: "notes",
  },
  {
    id: "grammarly",
    name: "Grammarly",
    vendor: "Grammarly",
    category: "Writing",
    bestFor: "Grammar, clarity and tone",
    freeTier: "Free plan",
    difficulty: "Beginner",
    url: "https://www.grammarly.com",
    query: "proofread",
  },
  {
    id: "copyai",
    name: "Copy.ai",
    vendor: "Copy.ai",
    category: "Writing",
    bestFor: "Marketing copy and ads",
    freeTier: "Free plan",
    difficulty: "Beginner",
    url: "https://www.copy.ai",
    query: "copywriting",
  },
  {
    id: "khanmigo",
    name: "Khan Academy",
    vendor: "Khan Academy",
    category: "Learning",
    bestFor: "Structured study and practice",
    freeTier: "Free courses",
    difficulty: "Beginner",
    url: "https://www.khanacademy.org",
    query: "study plan",
  },
  {
    id: "codeium",
    name: "Windsurf / Codeium",
    vendor: "Codeium",
    category: "Coding",
    bestFor: "Code completion in your editor",
    freeTier: "Free for individuals",
    difficulty: "Intermediate",
    url: "https://codeium.com",
    query: "refactor",
  },
];

export const getTool = (id: string | undefined) => TOOLS.find((t) => t.id === id);

/** Tools worth trying first for a given persona id. */
export function toolsForPersona(personaId: string | undefined): AiTool[] {
  const map: Record<string, ToolCategory[]> = {
    professional: ["Productivity", "Writing", "General AI"],
    student: ["Learning", "Research", "General AI"],
    healthcare: ["Research", "Writing", "General AI"],
    developer: ["Coding", "General AI"],
    creator: ["Image", "Design", "Voice"],
    homemaker: ["Productivity", "General AI"],
    senior: ["General AI", "Writing"],
    entrepreneur: ["Writing", "Productivity", "Design"],
    analyst: ["Research", "Productivity", "Coding"],
  };
  const cats = new Set(map[personaId ?? ""] ?? ["General AI", "Writing"]);
  return TOOLS.filter((t) => cats.has(t.category)).slice(0, 6);
}
