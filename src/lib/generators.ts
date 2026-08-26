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
