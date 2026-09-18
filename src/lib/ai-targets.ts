/**
 * Where you can actually run a slash command, and how to phrase it there.
 *
 * Slash commands are a shorthand, not a standard - no assistant parses them
 * natively. Each target below gets a short, honest tip about how to paste the
 * command so the model does the right thing.
 */
export interface AiTarget {
  id: string;
  name: string;
  url: string;
  /** one line of practical advice for this specific assistant */
  tip: string;
  free: string;
  /**
   * True when the assistant accepts a `?q=` prompt in its URL, so a
   * quick-launch button can drop the command straight into the box.
   * Only set this where the query param is genuinely supported.
   */
  prefill?: boolean;
  /** emoji shown on the compact "Try it in" buttons */
  emoji?: string;
}

export const AI_TARGETS: AiTarget[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chat.openai.com",
    tip: "Paste the command, then attach the file or text on the same message - it handles mixed input well.",
    free: "Free tier",
    prefill: true,
    emoji: "🟢",
  },
  {
    id: "claude",
    name: "Claude",
    url: "https://claude.ai",
    tip: "Best with long input. Put the command first, then the document underneath it.",
    free: "Free plan",
  },
  {
    id: "gemini",
    name: "Gemini",
    url: "https://gemini.google.com",
    tip: "Strong on images and current information - good for anything visual or web-grounded.",
    free: "Free",
    emoji: "🔵",
  },
  {
    id: "grok",
    name: "Grok",
    url: "https://grok.com",
    tip: "Add 'be concise' after the command; it defaults to a chatty tone.",
    free: "Free tier",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    url: "https://www.perplexity.ai",
    tip: "Use it when you want sources - ask the command to cite links in the answer.",
    free: "Free",
    prefill: true,
    emoji: "🔍",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    url: "https://chat.deepseek.com",
    tip: "Turn on the reasoning mode for analysis, maths and multi-step commands.",
    free: "Free tier",
  },
  {
    id: "duck",
    name: "Duck.ai",
    url: "https://duck.ai",
    tip: "Anonymous and no sign-in - the safest place for anything personal.",
    free: "Completely free",
  },
];

export const defaultAiTarget = AI_TARGETS[0]!;

/** The three assistants shown on the compact "Try it in" row. */
export const QUICK_TARGET_IDS = ["chatgpt", "gemini", "claude"] as const;

export const QUICK_TARGETS: AiTarget[] = QUICK_TARGET_IDS.map(
  (id) => AI_TARGETS.find((t) => t.id === id),
).filter((t): t is AiTarget => Boolean(t));

/**
 * Opens-with-prompt URL for an assistant, or the plain URL when that assistant
 * has no documented query-param prefill. Long prompts fall back to the plain
 * URL so we never hand the browser an unusable mega-URL.
 */
export function targetUrl(target: AiTarget, prompt: string): string {
  const canPrefill = target.prefill === true && prompt.trim().length > 0;
  if (!canPrefill) return target.url;
  const q = encodeURIComponent(prompt.slice(0, 1800));
  if (target.id === "chatgpt") return `${target.url}/?q=${q}`;
  if (target.id === "perplexity") return `${target.url}/search?q=${q}`;
  return `${target.url}?q=${q}`;
}
