/**
 * Founder toolkit — a suite of focused AI generators for startup work.
 *
 * Each generator is a small form over a carefully engineered Claude system
 * prompt (see generators.server.ts). One shared server function dispatches by
 * id, so adding a generator is data-only on this side.
 */

export interface GeneratorField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface GeneratorDef {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  /** free tier allows N runs of this generator per day */
  cost: number;
  fields: GeneratorField[];
}

export const GENERATORS: GeneratorDef[] = [
  {
    id: "business-names",
    title: "Business Name Generator",
    tagline: "20 name ideas with domains, taglines and a shortlist verdict.",
    emoji: "🏷️",
    cost: 1,
    fields: [
      { name: "description", label: "What does the business do?", type: "textarea", required: true, placeholder: "A mobile app that turns receipts into automatic expense reports for freelancers." },
      { name: "audience", label: "Target audience", type: "text", placeholder: "Freelancers and solo consultants" },
      { name: "vibe", label: "Name vibe", type: "select", options: ["Any", "Playful", "Professional", "Techy", "Premium", "Minimal"] },
    ],
  },
  {
    id: "mvp-planner",
    title: "MVP Planner",
    tagline: "Features, sprints, stack, timeline and a realistic budget.",
    emoji: "🛠️",
    cost: 1,
    fields: [
      { name: "idea", label: "Product idea", type: "textarea", required: true, placeholder: "A booking tool for boutique fitness studios with waitlists and class packs." },
      { name: "budget", label: "Budget range", type: "select", options: ["Under $1k", "$1k–$5k", "$5k–$20k", "$20k+"] },
      { name: "timeline", label: "Target timeline", type: "select", options: ["2 weeks", "1 month", "3 months", "6 months"] },
      { name: "skills", label: "Your skills / team", type: "text", placeholder: "Solo founder, can code basic React" },
    ],
  },
  {
    id: "landing-copy",
    title: "Landing Page Copy",
    tagline: "Hero, benefits, social proof, FAQ — ready to paste.",
    emoji: "📝",
    cost: 1,
    fields: [
      { name: "product", label: "Product & what it does", type: "textarea", required: true },
      { name: "audience", label: "Who it's for", type: "text", required: true },
      { name: "tone", label: "Tone", type: "select", options: ["Direct", "Friendly", "Bold", "Technical", "Playful"] },
      { name: "differentiator", label: "Main differentiator", type: "text", placeholder: "Works offline, no account needed" },
    ],
  },
  {
    id: "pitch-deck",
    title: "Pitch Deck Generator",
    tagline: "A 10-slide outline with the exact story beats investors expect.",
    emoji: "📊",
    cost: 1,
    fields: [
      { name: "idea", label: "Startup idea", type: "textarea", required: true },
      { name: "stage", label: "Stage", type: "select", options: ["Idea", "Pre-seed", "Seed", "Series A"] },
      { name: "traction", label: "Traction so far", type: "textarea", placeholder: "200 waitlist signups, 15 pilot users" },
      { name: "market", label: "Market / geography", type: "text" },
    ],
  },
  {
    id: "business-model-canvas",
    title: "Business Model Canvas",
    tagline: "All nine blocks, filled in and stress-tested.",
    emoji: "🧩",
    cost: 1,
    fields: [
      { name: "idea", label: "Business idea", type: "textarea", required: true },
      { name: "model", label: "Revenue model hint", type: "text", placeholder: "Subscription + usage fees" },
    ],
  },
  {
    id: "cold-email",
    title: "Cold Email Generator",
    tagline: "Three variants — direct, story-led and value-first.",
    emoji: "✉️",
    cost: 1,
    fields: [
      { name: "offer", label: "What you offer", type: "textarea", required: true },
      { name: "recipient", label: "Who you're emailing", type: "text", required: true, placeholder: "Heads of ops at mid-size e-commerce brands" },
      { name: "goal", label: "Desired action", type: "text", placeholder: "Book a 15-min call" },
    ],
  },
  {
    id: "sop",
    title: "SOP & Process Doc",
    tagline: "A repeatable checklist anyone on the team can follow.",
    emoji: "📋",
    cost: 1,
    fields: [
      { name: "process", label: "Process to document", type: "textarea", required: true, placeholder: "Onboarding a new client from signed proposal to kickoff call." },
      { name: "team", label: "Who performs it", type: "text" },
      { name: "tools", label: "Tools involved", type: "text", placeholder: "Notion, Stripe, Slack" },
    ],
  },
  {
    id: "okr",
    title: "OKR Generator",
    tagline: "Objectives and measurable key results for the quarter.",
    emoji: "🎯",
    cost: 1,
    fields: [
      { name: "context", label: "Team / company context", type: "textarea", required: true, placeholder: "Early-stage SaaS, 4 people, pre-revenue." },
      { name: "focus", label: "Biggest priority right now", type: "text", required: true },
      { name: "period", label: "Period", type: "select", options: ["Next quarter", "Next 6 weeks", "Next year"] },
    ],
  },
  {
    id: "pricing-page",
    title: "Pricing Page Generator",
    tagline: "Tiers, prices, feature splits and upgrade nudges.",
    emoji: "💳",
    cost: 1,
    fields: [
      { name: "product", label: "Product & audience", type: "textarea", required: true },
      { name: "currency", label: "Currency", type: "select", options: ["USD ($)", "EUR (€)", "GBP (£)", "INR (₹)"] },
      { name: "model", label: "Pricing model", type: "select", options: ["Let AI decide", "Monthly subscription", "Annual + monthly", "One-time", "Usage-based"] },
    ],
  },
  {
    id: "competitor-research",
    title: "Competitor Research",
    tagline: "Landscape map, positioning gaps and where to win.",
    emoji: "🔍",
    cost: 1,
    fields: [
      { name: "idea", label: "Your product idea", type: "textarea", required: true },
      { name: "known", label: "Competitors you already know", type: "textarea", placeholder: "Calendly, SavvyCal" },
      { name: "market", label: "Market / region", type: "text" },
    ],
  },
  // ──── New generators (11–25) ────
  {
    id: "job-description",
    title: "Job Description Generator",
    tagline: "Full JD with responsibilities, requirements and ATS keywords.",
    emoji: "🧑‍💼",
    cost: 1,
    fields: [
      { name: "role", label: "Role title", type: "text", required: true, placeholder: "Senior Frontend Engineer" },
      { name: "stage", label: "Company stage", type: "select", options: ["Solo", "Startup", "SMB", "Enterprise"] },
      { name: "mode", label: "Work mode", type: "select", options: ["Remote", "Hybrid", "Onsite"] },
      { name: "skills", label: "3 key skills", type: "text", required: true, placeholder: "React, TypeScript, performance" },
    ],
  },
  {
    id: "welcome-email",
    title: "Welcome Email Sequence",
    tagline: "5-email onboarding sequence with subjects and bodies.",
    emoji: "📧",
    cost: 1,
    fields: [
      { name: "product", label: "Product name", type: "text", required: true },
      { name: "user", label: "Target user", type: "text", required: true, placeholder: "New signups" },
      { name: "benefit", label: "Main benefit", type: "text", required: true },
      { name: "tone", label: "Tone", type: "select", options: ["Friendly", "Professional", "Bold"] },
    ],
  },
  {
    id: "twitter-thread",
    title: "Twitter/X Thread Generator",
    tagline: "Hook, body and CTA tweets — ready to post.",
    emoji: "🐦",
    cost: 1,
    fields: [
      { name: "topic", label: "Topic", type: "textarea", required: true },
      { name: "audience", label: "Target audience", type: "text" },
      { name: "goal", label: "Goal", type: "select", options: ["Educate", "Build audience", "Drive traffic"] },
      { name: "length", label: "Thread length", type: "select", options: ["5 tweets", "10 tweets", "15 tweets"] },
    ],
  },
  {
    id: "app-store",
    title: "App Store Description",
    tagline: "Short description, long description, keywords and subtitles.",
    emoji: "📱",
    cost: 1,
    fields: [
      { name: "app", label: "App name", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true, placeholder: "Productivity" },
      { name: "features", label: "3 key features", type: "text", required: true },
      { name: "platform", label: "Platform", type: "select", options: ["iOS", "Android", "Both"] },
    ],
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy Generator",
    tagline: "Plain-English privacy policy covering GDPR basics.",
    emoji: "🔑",
    cost: 1,
    fields: [
      { name: "name", label: "App / site name", type: "text", required: true },
      { name: "data", label: "Data collected", type: "textarea", required: true, placeholder: "Email, usage analytics, preferences" },
      { name: "email", label: "Contact email", type: "text", required: true },
      { name: "country", label: "Country of operation", type: "text", required: true },
    ],
  },
  {
    id: "product-hunt",
    title: "Product Hunt Launch Copy",
    tagline: "PH tagline, description, first comment and maker story.",
    emoji: "📣",
    cost: 1,
    fields: [
      { name: "product", label: "Product name", type: "text", required: true },
      { name: "tagline", label: "One-line tagline", type: "text", required: true },
      { name: "benefit", label: "Main benefit", type: "textarea", required: true },
      { name: "offer", label: "Launch day special offer", type: "text" },
    ],
  },
  {
    id: "newsletter",
    title: "Newsletter Issue Generator",
    tagline: "Subject, intro hook, main section and resource roundup.",
    emoji: "📰",
    cost: 1,
    fields: [
      { name: "name", label: "Newsletter name", type: "text", required: true },
      { name: "number", label: "Issue number", type: "text" },
      { name: "topic", label: "Main topic", type: "textarea", required: true },
      { name: "resources", label: "3 resources to mention", type: "textarea", required: true },
    ],
  },
  {
    id: "linkedin-post",
    title: "LinkedIn Post Generator",
    tagline: "3 post variants with hooks, body and engagement CTAs.",
    emoji: "💬",
    cost: 1,
    fields: [
      { name: "topic", label: "Topic", type: "textarea", required: true },
      { name: "tone", label: "Tone", type: "select", options: ["Personal story", "Insight", "List", "Opinion"] },
      { name: "goal", label: "Goal", type: "text" },
      { name: "words", label: "Word count target", type: "select", options: ["100 words", "200 words", "300 words"] },
    ],
  },
  {
    id: "financial-projection",
    title: "Startup Financial Projection",
    tagline: "12-month MRR, users, expenses and profit/loss table.",
    emoji: "🧮",
    cost: 1,
    fields: [
      { name: "type", label: "Product type", type: "text", required: true, placeholder: "SaaS tool for designers" },
      { name: "pricing", label: "Pricing model", type: "select", options: ["Monthly subscription", "One-time", "Freemium + paid"] },
      { name: "users", label: "Estimated users at month 1", type: "text", required: true, placeholder: "50" },
      { name: "growth", label: "Monthly growth rate %", type: "text", placeholder: "15" },
      { name: "costs", label: "Monthly costs (hosting, tools, ads)", type: "text", placeholder: "$200" },
    ],
  },
  {
    id: "terms-of-service",
    title: "Terms of Service Generator",
    tagline: "Basic ToS covering usage, liability, IP and termination.",
    emoji: "📝",
    cost: 1,
    fields: [
      { name: "name", label: "Site / app name", type: "text", required: true },
      { name: "service", label: "Service type", type: "text", required: true, placeholder: "SaaS platform" },
      { name: "country", label: "Country", type: "text", required: true },
      { name: "refund", label: "Refund policy", type: "select", options: ["No refunds", "14-day refund", "Pro-rated refund"] },
      { name: "email", label: "Contact email", type: "text", required: true },
    ],
  },
  {
    id: "seo-meta",
    title: "SEO Meta Tags Generator",
    tagline: "Full HTML meta block ready to paste into your page.",
    emoji: "🌐",
    cost: 1,
    fields: [
      { name: "title", label: "Page title", type: "text", required: true },
      { name: "description", label: "Page description", type: "textarea", required: true },
      { name: "keyword", label: "Target keyword", type: "text", required: true },
      { name: "type", label: "Page type", type: "select", options: ["Homepage", "Blog post", "Product page", "Landing page"] },
    ],
  },
  {
    id: "pivot-story",
    title: "Pivot Story Generator",
    tagline: "Compelling narrative for blog, investors or LinkedIn.",
    emoji: "🔄",
    cost: 1,
    fields: [
      { name: "original", label: "Original idea", type: "textarea", required: true },
      { name: "failed", label: "Why it failed", type: "textarea", required: true },
      { name: "learned", label: "What you learned", type: "textarea", required: true },
      { name: "new", label: "New direction", type: "textarea", required: true },
    ],
  },
  {
    id: "ab-test",
    title: "A/B Test Hypothesis",
    tagline: "Structured IF / THEN / BECAUSE with success metrics.",
    emoji: "🧪",
    cost: 1,
    fields: [
      { name: "testing", label: "What you're testing", type: "select", options: ["Button", "Headline", "Pricing", "Onboarding flow", "Email subject"] },
      { name: "current", label: "Current version", type: "textarea", required: true },
      { name: "hypothesis", label: "Your hypothesis", type: "textarea", required: true },
    ],
  },
  {
    id: "partnership-email",
    title: "Partnership Outreach Email",
    tagline: "3 email variants: direct, value-first and warm intro.",
    emoji: "🤝",
    cost: 1,
    fields: [
      { name: "product", label: "Your product", type: "text", required: true },
      { name: "partner", label: "Target partner / company type", type: "text", required: true },
      { name: "benefit", label: "Mutual benefit", type: "textarea", required: true },
      { name: "ask", label: "Specific ask", type: "text", required: true, placeholder: "15-min call to explore integration" },
    ],
  },
  {
    id: "qbr-template",
    title: "Quarterly Business Review",
    tagline: "Full QBR doc: executive summary, metrics, wins and next steps.",
    emoji: "📊",
    cost: 1,
    fields: [
      { name: "team", label: "Company / team name", type: "text", required: true },
      { name: "quarter", label: "Quarter", type: "select", options: ["Q1", "Q2", "Q3", "Q4"] },
      { name: "metric", label: "Key metric", type: "text", required: true, placeholder: "MRR, ARR, active users" },
      { name: "win", label: "Biggest win", type: "textarea", required: true },
      { name: "miss", label: "Biggest miss", type: "textarea", required: true },
      { name: "next", label: "Next quarter goal", type: "textarea", required: true },
    ],
  },
];

export const GENERATOR_IDS = new Set(GENERATORS.map((g) => g.id));

export function getGenerator(id: string): GeneratorDef | undefined {
  return GENERATORS.find((g) => g.id === id);
}

/* ------------------------------ free tier gate ----------------------------- */

const RUNS_KEY = "slashai.aiRuns";
/** Free tier: this many paid-model runs per UTC day. Pro removes the cap. */
export const FREE_DAILY_RUNS = 5;

interface RunLog {
  day: string;
  count: number;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function readRunCount(): number {
  try {
    const raw = localStorage.getItem(RUNS_KEY);
    if (!raw) return 0;
    const log = JSON.parse(raw) as RunLog;
    return log.day === todayKey() ? log.count : 0;
  } catch {
    return 0;
  }
}

export function recordRun(): void {
  localStorage.setItem(
    RUNS_KEY,
    JSON.stringify({ day: todayKey(), count: readRunCount() + 1 } satisfies RunLog),
  );
}
