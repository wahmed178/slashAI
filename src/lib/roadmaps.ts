/**
 * Founder Roadmaps — visual, step-by-step paths for the journeys every
 * builder repeats: validating, shipping, growing, raising and learning AI.
 * Static data, opinionated by design.
 */

import { EXTRA_ROADMAPS } from "./roadmaps-extra";

export interface RoadmapStep {
  title: string;
  detail: string;
}

export interface RoadmapPhase {
  name: string;
  steps: RoadmapStep[];
}

export interface Roadmap {
  id: string;
  title: string;
  tagline: string;
  audience: string;
  duration: string;
  phases: RoadmapPhase[];
}

export const ROADMAPS: Roadmap[] = [
  {
    id: "validate-idea",
    title: "Validate an idea in 14 days",
    tagline: "Before you write code, prove someone cares.",
    audience: "Anyone with an idea and no users",
    duration: "~2 weeks",
    phases: [
      {
        name: "Days 1–3 · Sharpen the problem",
        steps: [
          { title: "Write the one-sentence problem", detail: "‘[Who] struggles with [what] because [why existing options fail].’ If you can't fill the blanks, interview first." },
          { title: "Define the smallest proof", detail: "Decide what evidence would change your mind — e.g. 10 people give an email, or 3 pre-pay. No proof point = no validation." },
          { title: "List 20 target people", detail: "Communities, LinkedIn, your own network. Specific roles beat ‘people who like productivity’." },
        ],
      },
      {
        name: "Days 4–9 · Talk before you build",
        steps: [
          { title: "Run 10 problem interviews", detail: "Ask about their last time hitting the problem — stories, not hypotheticals. Never pitch; listen." },
          { title: "Score pain with money", detail: "‘What do you do about it today?’ If the honest answer is ‘nothing’, the pain is weak regardless of what they say." },
          { title: "Test willingness to pay", detail: "Offer a paid pilot or waitlist with a price on it. Interest is free; commitment costs something." },
        ],
      },
      {
        name: "Days 10–14 · Fake door, real signal",
        steps: [
          { title: "Ship a one-page offer", detail: "Landing page stating the outcome, price and a single CTA. Use any free page builder or SlashAI's landing copy generator." },
          { title: "Send 100 targeted visits", detail: "Post where your 20 targets already hang out. Track clicks → signups honestly." },
          { title: "Make the call", detail: "Hit your proof point? Build. Close but promising? Iterate the offer. Nothing? Next idea — cheap exit is a win." },
        ],
      },
    ],
  },
  {
    id: "ship-mvp",
    title: "Ship an MVP in 30 days",
    tagline: "The version that teaches you the most per day spent.",
    audience: "Builders ready to start coding",
    duration: "~4 weeks",
    phases: [
      {
        name: "Week 1 · Ruthless scope",
        steps: [
          { title: "Write the core job", detail: "One sentence: user does X, gets Y. Everything that doesn't serve it is v2." },
          { title: "Pick boring tech", detail: "Stack you already know > stack trending this week. Managed auth + managed DB + one framework." },
          { title: "Sketch the 3 screens", detail: "Most MVPs are list, detail, form. Paper first — it's faster than Figma at this stage." },
        ],
      },
      {
        name: "Weeks 2–3 · Build the spine",
        steps: [
          { title: "Walk the happy path daily", detail: "Every evening, use your own app end-to-end. Broken today means fix tomorrow morning." },
          { title: "Hardcode what you can", detail: "Fake the data, skip the admin panel, email from your own address. Real infrastructure comes after demand." },
          { title: "Instrument as you go", detail: "One analytics event per key action (signup, core action, upgrade) so week 4 isn't guesswork." },
        ],
      },
      {
        name: "Week 4 · Polish just enough",
        steps: [
          { title: "Fix only embarrassing flaws", detail: "Broken flows and confusing empty states. Not dark mode, not micro-animations." },
          { title: "Add a feedback loop", detail: "Visible ‘talk to us’ link plus an in-app way to report issues — every early user is a co-designer." },
          { title: "Deploy and tell 10 people", detail: "Ship to your interview group first. Their confusion is your launch-prep checklist." },
        ],
      },
    ],
  },
  {
    id: "first-100-users",
    title: "First 100 users",
    tagline: "Manual, unscalable, and completely necessary.",
    audience: "Founders with a working product",
    duration: "~6 weeks",
    phases: [
      {
        name: "Weeks 1–2 · Pick two channels, ignore the rest",
        steps: [
          { title: "Go where they already are", detail: "Two communities max — subreddits, Discord servers, industry Slack groups. Read the rules; be a member before being a marketer." },
          { title: "Lead with usefulness", detail: "Answer questions genuinely, mention your product only when it truly solves the asked problem." },
          { title: "DM your interview list", detail: "Your validation contacts already trusted you with their time. Convert them first." },
        ],
      },
      {
        name: "Weeks 3–4 · Make onboarding foolproof",
        steps: [
          { title: "Time-to-value under 5 minutes", detail: "Users should feel the core benefit in one session. Delete every step between signup and the wow moment." },
          { title: "Do things that don't scale", detail: "Onboard users personally over video call. You'll learn more than any dashboard can teach." },
          { title: "Watch sessions", detail: "Recordings of 5 real users beat 500 survey responses. Note where they hesitate, then fix exactly that." },
        ],
      },
      {
        name: "Weeks 5–6 · Turn users into a flywheel",
        steps: [
          { title: "Find your retention floor", detail: "Week-2 return rate tells you if you have a product. Below ~20% for weekly-use products, fix retention before growth." },
          { title: "Ask for one referral each", detail: "Happy users introduce you to one peer. That's 2x without a marketing budget." },
          { title: "Document what worked", detail: "Write down which messages and channels produced activated users. That's your growth playbook for the next 1,000." },
        ],
      },
    ],
  },
  {
    id: "learn-ai-engineering",
    title: "Learn AI engineering in 60 days",
    tagline: "From API calls to production-grade AI features.",
    audience: "Developers adding AI to their toolkit",
    duration: "~8 weeks",
    phases: [
      {
        name: "Weeks 1–2 · Prompting fluency",
        steps: [
          { title: "Master one provider playground", detail: "Spend hours, not minutes: system prompts, temperature, stop sequences. Feel how each dial changes output." },
          { title: "Learn token economics", detail: "Count tokens, estimate costs, understand context windows. Every architecture decision downstream depends on this." },
          { title: "Build 5 prompt patterns", detail: "Few-shot, chain-of-thought, role prompting, structured JSON output, self-critique. Keep them in a personal library." },
        ],
      },
      {
        name: "Weeks 3–4 · Retrieval (RAG)",
        steps: [
          { title: "Chunk a real document set", detail: "Take docs you know well. Experiment with chunk sizes until retrieval finds what YOU know is there." },
          { title: "Build search + generation", detail: "Embeddings into a vector store, top-k retrieval, grounded answer with citations." },
          { title: "Break it deliberately", detail: "Feed tricky questions. Learn failure modes: wrong chunks, missing context, confident nonsense." },
        ],
      },
      {
        name: "Weeks 5–6 · Tools and agents",
        steps: [
          { title: "Function calling end-to-end", detail: "Let the model call 2–3 real functions — weather, calculator, DB lookup. Validate every argument yourself." },
          { title: "Build one reliable agent loop", detail: "Think → act → observe → repeat, with a step cap. Reliability beats autonomy; ship suggest-mode first." },
          { title: "Add guardrails", detail: "Input filtering, output schema checks, spend limits. Assume the model will misbehave eventually." },
        ],
      },
      {
        name: "Weeks 7–8 · Ship something real",
        steps: [
          { title: "One feature, real users", detail: "Add an AI feature to an existing project. Streaming responses, error states, fallbacks when the API fails." },
          { title: "Set up evals", detail: "20 golden examples, scored automatically. Now you can change prompts without fear." },
          { title: "Track cost and latency", detail: "Log both per request. Optimize the expensive slow path — usually by caching or routing to smaller models." },
        ],
      },
    ],
  },
  {
    id: "fundraise-prep",
    title: "Fundraising prep",
    tagline: "Investors fund evidence, not enthusiasm.",
    audience: "Founders considering outside capital",
    duration: "~6 weeks prep",
    phases: [
      {
        name: "Weeks 1–2 · Know your numbers cold",
        steps: [
          { title: "Build the simple model", detail: "Users, growth rate, revenue, burn, runway. One sheet, defensible assumptions, no hockey sticks without reasons." },
          { title: "Nail the story in 3 sentences", detail: "Who it's for, what changes with your product, why now. If a friend can't repeat it, simplify again." },
          { title: "Collect proof", detail: "Retention curves, revenue screenshots, letters of intent, waitlist growth. Evidence per claim, organized in one folder." },
        ],
      },
      {
        name: "Weeks 3–4 · Materials that get meetings",
        steps: [
          { title: "Draft the 10-slide deck", detail: "Problem → solution → market → traction → business model → team → ask. Use the Pitch Deck generator for structure, then make every number yours." },
          { title: "Write the one-pager", detail: "Many investors read the memo before the deck. Same story, denser, sendable as PDF." },
          { title: "Rehearse the hard questions", detail: "Why you? Why now? What if BigCo ships this? Honest answers build more trust than smooth dodges." },
        ],
      },
      {
        name: "Weeks 5–6 · Run a tight process",
        steps: [
          { title: "Build the target list", detail: "30 investors who actually fund your stage and sector. Warm intros through founders they backed beat cold emails 10-to-1." },
          { title: "Batch the meetings", detail: "Compress into 2–3 weeks so momentum and urgency work for you, not against you." },
          { title: "Drive to a clear close", detail: "Know your minimum raise, acceptable terms and walk-away line before term sheets arrive." },
        ],
      },
    ],
  },
  {
    id: "launch-day",
    title: "Launch like a pro",
    tagline: "A great launch is 90% preparation.",
    audience: "Founders one week from going public",
    duration: "~7 days",
    phases: [
      {
        name: "T-minus 7 days · Freeze and polish",
        steps: [
          { title: "Code freeze", detail: "Bug fixes only. New features during launch week are how launches break." },
          { title: "Prepare assets", detail: "Screenshots, demo GIF/video under 60s, logo pack, one-line description in 5 lengths (tweet, post, directory, press, bio)." },
          { title: "Line up the first wave", detail: "DM 20 supporters asking them to upvote/comment on launch morning. Authentic comments, not copy-paste spam." },
        ],
      },
      {
        name: "T-minus 1 day · Dry run",
        steps: [
          { title: "Full dress rehearsal", detail: "Fresh browser, incognito, mobile too. Signup, core action, share, payment — click everything." },
          { title: "Check status and support paths", detail: "Status page or pinned note, error monitoring live, inbox ready to answer fast." },
          { title: "Schedule posts", detail: "Draft your launch post and tweets tonight. Launch day should be conversations, not writing." },
        ],
      },
      {
        name: "Launch day · Be relentlessly present",
        steps: [
          { title: "Reply to everything fast", detail: "Every comment, question and bug report within the hour. Speed signals care; lurkers notice." },
          { title: "Fix critical bugs immediately", detail: "Ship fixes and say so publicly — ‘fixed 20 min after report’ wins trust." },
          { title: "Log everything", detail: "Objections, praise, confusion, feature requests. Tomorrow's roadmap writes itself from today's replies." },
        ],
      },
    ],
  },
];

export const ALL_ROADMAPS: Roadmap[] = [...ROADMAPS, ...EXTRA_ROADMAPS];
export const ROADMAP_TOTAL = ALL_ROADMAPS.length;

export function roadmapById(id: string): Roadmap | undefined {
  return ROADMAPS.find((r) => r.id === id);
}
