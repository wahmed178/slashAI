export interface HubResource {
  id: string;
  name: string;
  url: string;
  description: string;
  type: string;
  category: string;
  pricing: "Completely Free" | "Free Tier" | "Open Source" | "Freemium";
  tags: string[];
  lastVerified: string;
}

export const FOUNDERS_RESOURCES: HubResource[] = [
  // ── AI Business Tools
  { id: "f1", name: "ChatGPT", url: "https://chat.openai.com", description: "General-purpose AI for market research, pitch writing, copy and strategy.", type: "AI Tool", category: "AI Business Tools", pricing: "Freemium", tags: ["ai", "writing", "research"], lastVerified: "2026-08-27" },
  { id: "f2", name: "Claude", url: "https://claude.ai", description: "Long-context AI for business plans, analysis and detailed strategy docs.", type: "AI Tool", category: "AI Business Tools", pricing: "Freemium", tags: ["ai", "analysis", "long-context"], lastVerified: "2026-08-27" },
  { id: "f3", name: "Perplexity", url: "https://www.perplexity.ai", description: "AI search engine with sources — ideal for competitive research.", type: "AI Tool", category: "AI Business Tools", pricing: "Freemium", tags: ["ai", "search", "research"], lastVerified: "2026-08-27" },
  { id: "f4", name: "Gemini", url: "https://gemini.google.com", description: "Google's AI grounded in web search — strong for market data.", type: "AI Tool", category: "AI Business Tools", pricing: "Completely Free", tags: ["ai", "search", "market"], lastVerified: "2026-08-27" },
  { id: "f5", name: "DeepSeek", url: "https://chat.deepseek.com", description: "Free reasoning AI for complex business analysis.", type: "AI Tool", category: "AI Business Tools", pricing: "Free Tier", tags: ["ai", "reasoning", "analysis"], lastVerified: "2026-08-27" },

  // ── Startup Resources
  { id: "f6", name: "Y Combinator Startup School", url: "https://www.startupschool.org", description: "Free structured course on launching startups — lessons from YC founders.", type: "Course", category: "Startup Learning", pricing: "Completely Free", tags: ["startup", "course", "launch"], lastVerified: "2026-08-27" },
  { id: "f7", name: "Product Hunt", url: "https://www.producthunt.com", description: "Launch your product to an engaged early-adopter community.", type: "Website", category: "Launch Platforms", pricing: "Completely Free", tags: ["launch", "community", "saas"], lastVerified: "2026-08-27" },
  { id: "f8", name: "Indie Hackers", url: "https://www.indiehackers.com", description: "Community of founders building profitable businesses. Revenue milestones shared openly.", type: "Community", category: "Startup Communities", pricing: "Completely Free", tags: ["community", "indie", "revenue"], lastVerified: "2026-08-27" },
  { id: "f9", name: "Hacker News", url: "https://news.ycombinator.com", description: "Tech community where startup launches get visibility with builders and investors.", type: "Website", category: "Startup Communities", pricing: "Completely Free", tags: ["community", "tech", "launch"], lastVerified: "2026-08-27" },
  { id: "f10", name: "Notion", url: "https://www.notion.so", description: "All-in-one workspace for business plans, wikis, roadmaps and team docs.", type: "Software", category: "Productivity", pricing: "Freemium", tags: ["productivity", "docs", "planning"], lastVerified: "2026-08-27" },

  // ── Finance & Payments
  { id: "f11", name: "Stripe", url: "https://stripe.com", description: "Payment processing for internet businesses. Free to set up, pay only per transaction.", type: "API", category: "Payments", pricing: "Freemium", tags: ["payments", "saas", "billing"], lastVerified: "2026-08-27" },
  { id: "f12", name: "Razorpay", url: "https://razorpay.com", description: "Indian payment gateway — UPI, cards, netbanking. Essential for India-focused startups.", type: "API", category: "Payments", pricing: "Freemium", tags: ["payments", "india", "upi"], lastVerified: "2026-08-27" },
  { id: "f13", name: "Mercury", url: "https://mercury.com", description: "Startup-focused banking — free accounts, invoicing, and financial tools.", type: "Website", category: "Finance", pricing: "Completely Free", tags: ["banking", "startup", "finance"], lastVerified: "2026-08-27" },
  { id: "f14", name: "Wise", url: "https://wise.com", description: "Low-cost international transfers — critical for remote teams and global customers.", type: "Website", category: "Finance", pricing: "Freemium", tags: ["finance", "transfers", "global"], lastVerified: "2026-08-27" },

  // ── Design & Branding
  { id: "f15", name: "Figma", url: "https://www.figma.com", description: "Professional design tool for mockups, pitch decks and brand assets.", type: "Software", category: "Design", pricing: "Free Tier", tags: ["design", "mockups", "brand"], lastVerified: "2026-08-27" },
  { id: "f16", name: "Canva", url: "https://www.canva.com", description: "Quick graphic design for social posts, pitch decks and marketing materials.", type: "Software", category: "Design", pricing: "Freemium", tags: ["design", "marketing", "social"], lastVerified: "2026-08-27" },
  { id: "f17", name: "Excalidraw", url: "https://excalidraw.com", description: "Hand-drawn style diagrams for architecture, flowcharts and pitch visuals.", type: "Software", category: "Design", pricing: "Open Source", tags: ["diagrams", "visual", "open-source"], lastVerified: "2026-08-27" },

  // ── Founder Learning
  { id: "f18", name: "a16z Startup Guide", url: "https://a16z.com/guides/", description: "Andreessen Horowitz guides on fundraising, growth, product and team building.", type: "Wiki", category: "Startup Guides", pricing: "Completely Free", tags: ["guides", "fundraising", "growth"], lastVerified: "2026-08-27" },
  { id: "f19", name: "Lean Stack", url: "https://leanstack.com", description: "Lean Canvas and business model tools — free templates for early-stage founders.", type: "Website", category: "Startup Tools", pricing: "Completely Free", tags: ["canvas", "business-model", "planning"], lastVerified: "2026-08-27" },
  { id: "f20", name: "Crunchbase Free", url: "https://www.crunchbase.com", description: "Research companies, funding rounds and market landscape.", type: "Website", category: "Research", pricing: "Free Tier", tags: ["research", "funding", "companies"], lastVerified: "2026-08-27" },

  // ── YouTube (Founders)
  { id: "f21", name: "Y Combinator", url: "https://www.youtube.com/@ycombinator", description: "Startup advice, demo days and talks from successful founders.", type: "YouTube", category: "YouTube (Founders)", pricing: "Completely Free", tags: ["youtube", "startup", "advice"], lastVerified: "2026-08-27" },
  { id: "f22", name: "Starter Story", url: "https://www.youtube.com/@StarterStory", description: "How real businesses started — revenue breakdowns and growth tactics.", type: "YouTube", category: "YouTube (Founders)", pricing: "Completely Free", tags: ["youtube", "revenue", "growth"], lastVerified: "2026-08-27" },
  { id: "f23", name: "How I Built This", url: "https://www.youtube.com/@HowIBuiltThis", description: "Guy Raz interviews founders of iconic companies — origin stories and lessons.", type: "YouTube", category: "YouTube (Founders)", pricing: "Completely Free", tags: ["youtube", "founders", "stories"], lastVerified: "2026-08-27" },
  { id: "f24", name: "My First Million", url: "https://www.youtube.com/@myfirstmillion", description: "Brainstorming startup ideas, market analysis and business model breakdowns.", type: "YouTube", category: "YouTube (Founders)", pricing: "Completely Free", tags: ["youtube", "ideas", "analysis"], lastVerified: "2026-08-27" },

  // ── Launch & Growth Tools
  { id: "f25", name: "Vercel", url: "https://vercel.com", description: "Free hosting for web apps and landing pages — deploy in seconds.", type: "Software", category: "Hosting", pricing: "Free Tier", tags: ["hosting", "deploy", "web"], lastVerified: "2026-08-27" },
  { id: "f26", name: "Resend", url: "https://resend.com", description: "Transactional email API with a generous free tier — for onboarding and notifications.", type: "API", category: "Email", pricing: "Free Tier", tags: ["email", "api", "onboarding"], lastVerified: "2026-08-27" },
  { id: "f27", name: "Plausible Analytics", url: "https://plausible.io", description: "Privacy-first web analytics — free for open-source, affordable for startups.", type: "Software", category: "Analytics", pricing: "Free Tier", tags: ["analytics", "privacy", "web"], lastVerified: "2026-08-27" },
  { id: "f28", name: "Crisp", url: "https://crisp.chat", description: "Free live chat for your website — essential for early customer support.", type: "Software", category: "Support", pricing: "Free Tier", tags: ["support", "chat", "customer"], lastVerified: "2026-08-27" },
];
