/**
 * Where you can actually run a slash command, and how to phrase it there.
 *
 * Slash commands are a shorthand, not a standard — no assistant parses them
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
}

export const AI_TARGETS: AiTarget[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chat.openai.com",
    tip: "Paste the command, then attach the file or text on the same message — it handles mixed input well.",
    free: "Free tier",
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
    tip: "Strong on images and current information — good for anything visual or web-grounded.",
    free: "Free",
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
    tip: "Use it when you want sources — ask the command to cite links in the answer.",
    free: "Free",
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
    tip: "Anonymous and no sign-in — the safest place for anything personal.",
    free: "Completely free",
  },
];

export const defaultAiTarget = AI_TARGETS[0]!;
