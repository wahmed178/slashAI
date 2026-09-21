export default [
  {
    category: "Coding & Development",
    type: "coding",
    icon: "Code2",
    groups: [
      {
        variants: ["chatgpt", "gemini", "claude", "perplexity", "copilot", "deepseek"],
        verbs: [
          ["Vibe", "Vibe Coding", "build a working first version of", "Describe the app like you would to a friend: what it does, for whom, what feels magical. No spec language needed.", "a running prototype plus the exact follow-up prompts for v2"],
          ["PromptStack", "Prompt Stacks", "turn a feature idea into a stack of copy-paste AI prompts for", "Name the stack (Lovable, v0, Cursor, Bolt) and paste any error output you already have.", "a numbered prompt stack: scaffold, feature, polish, debug"],
          ["ShipIt", "Shipping", "carry an AI-built project from working demo to real launch for", "Say what works already and what scares you about real users.", "a launch checklist: env vars, error states, analytics, deploy notes"],
          ["DebugVibe", "Debugging", "turn a cryptic AI-coding error into the exact next prompt for", "Paste the full error, the prompt that caused it and one line on what you expected.", "a diagnosis in plain English plus the fixed prompt"],
          ["FeatureSlice", "Scoping", "slice a vague app idea into weekend-sized feature chunks for", "Describe the app in one breath. Mention your free hours per week.", "a slice list, each shippable alone, ordered by wow-per-effort"],
          ["StackPick", "Stack Choice", "pick the simplest stack that can ship", "State the app idea, your skill level and whether you want to pay for hosting.", "a recommendation with two alternatives and why the winner won"],
          ["ClonePlan", "Clones", "plan a minimal clone of", "Name the product and the one feature you actually care about.", "a cut list: what to steal, what to skip, what to reinvent"],
          ["RefactorVibe", "Refactoring", "clean up AI-generated code without breaking it in", "Paste the file and say what feels off: naming, repetition, magic numbers.", "a refactored version with a change log of every risky move"],
          ["DeployWalk", "Deployment", "walk me through deploying", "Name the host (Vercel, Netlify, Cloudflare) and any error from the last attempt.", "step-by-step deploy instructions with the exact error fixed"],
          ["PromptRetro", "Retrospectives", "retro the prompts that built", "Paste the final code and two prompts that failed hardest.", "a rewritten prompt library tuned to this project"],
        ],
        objects: [
          ["LandingPage", "a landing page", "landing, marketing, page", "a waitlist page with an email capture and three feature blocks"],
          ["Dashboard", "a dashboard app", "dashboard, data, charts", "a habit tracker with streaks and a weekly chart"],
          ["ChromeExt", "a Chrome extension", "extension, browser, chrome", "a tab that replaces your new-tab page with a daily focus line"],
          ["TelegramBot", "a Telegram bot", "bot, telegram, chat", "a bot that pings you your daily plan at 7am"],
          ["PWA", "a PWA", "pwa, installable, offline", "an offline-first shopping list the whole family can install"],
          ["Scraper", "a scraper", "scraper, data, crawl", "a price watcher for one product page, daily check"],
          ["SlackApp", "a Slack app", "slack, integrations, bot", "a standup collector that DMs the team at 9:30"],
          ["WhatsappBot", "a WhatsApp bot", "whatsapp, bot, automation", "a reminder bot for clinic appointments"],
          ["Api", "a REST API", "api, backend, rest", "a bookmarks API with tags and full-text search"],
          ["Game", "a browser game", "game, canvas, browser", "a one-button reflex game for the homepage"],
        ],
      },
    ],
  },
];
