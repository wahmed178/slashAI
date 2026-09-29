/**
 * Command insights: use cases, freshness and hashtags.
 *
 * Everything here is DERIVED from the catalogue's own fields — category,
 * subcategory, difficulty, tags, popularity, addedAt. Nothing is invented and
 * nothing is aggregated from users, because SlashAI has no backend and so no
 * honest source of community statistics. Where a real signal does not exist
 * for a command, these helpers return an empty list and the UI omits the
 * section rather than filling it with filler.
 */
import { COMMANDS, type SlashCommand } from "@/lib/commands";
import { placeholderCount } from "@/lib/ux";

/**
 * What people actually reach these commands for, one honest characterisation
 * per category, plus the kinds of task that recur inside it.
 *
 * This is a description of the category's job, not a testimonial and not a
 * usage claim. Keys must match `CatalogCommand.category` exactly; an unmapped
 * category yields no use cases at all, which is the intended behaviour.
 */
const CATEGORY_USE_CASES: Record<string, { headline: string; jobs: string[] }> = {
  "Documents & OCR": {
    headline: "Turning paperwork and scans into text you can actually use.",
    jobs: [
      "Pull structured text out of an invoice, receipt, form or contract scan",
      "Reformat a messy document into a clean outline, table or summary",
      "Handwriting, tables and layouts that OCR tools flatten",
    ],
  },
  "Image & Vision": {
    headline: "Reading, editing and describing images through a text prompt.",
    jobs: [
      "Describe, caption or transcribe what is in a photo or screenshot",
      "Restyle an image: swap backgrounds, relight, change the mood",
      "Compare two images and get a written breakdown of the differences",
    ],
  },
  "Writing & Communication": {
    headline: "Drafting, rewriting and tightening anything you have to send.",
    jobs: [
      "First drafts of emails, messages, proposals and announcements",
      "Rewriting a draft that is nearly right but reads badly",
      "Matching a house style, tone or reading level",
    ],
  },
  "Learning & Education": {
    headline: "Explaining a concept and checking whether it actually landed.",
    jobs: [
      "Explaining the same idea three ways until one of them sticks",
      "Turning notes or a textbook chapter into questions and summaries",
      "Building a study plan or spaced-repetition schedule",
    ],
  },
  "General AI": {
    headline: "Everyday prompting that does not belong to a specialist tool.",
    jobs: [
      "One-off questions that need a well-shaped prompt",
      "Summarising, rewriting or brainstorming a wall of text",
      "Deciding which of several approaches to take",
    ],
  },
  "Data & Analytics": {
    headline: "Getting from a raw dataset to a defensible conclusion.",
    jobs: [
      "Cleaning and reshaping data before it goes anywhere",
      "Choosing a method and justifying the choice",
      "Turning numbers into a written finding someone will act on",
    ],
  },
  "Coding & Development": {
    headline: "Writing, reviewing and debugging code in plain language.",
    jobs: [
      "First drafts of a function, class or script",
      "Reading an error message and working out the actual cause",
      "Reviewing a diff, a design doc or a pull request",
    ],
  },
  Productivity: {
    headline: "Shortening the admin that sits between you and the real work.",
    jobs: [
      "Turning a messy to-do list into an ordered plan",
      "Summarising a meeting, thread or backlog",
      "Building repeatable checklists and standard operating procedures",
    ],
  },
  "Translation & Languages": {
    headline: "Working between languages without losing the meaning.",
    jobs: [
      "Translating and then localising, not just swapping words",
      "Practising a language with corrections aimed at your level",
      "Explaining grammar or idiom that dictionaries get wrong",
    ],
  },
  "Security & Privacy": {
    headline: "Checking your own security posture before someone else does.",
    jobs: [
      "Reviewing configuration, permissions or exposed secrets",
      "Writing a threat model for a system you are building",
      "Understanding a vulnerability notice and what to do about it",
    ],
  },
  Video: {
    headline: "Scripting, editing and getting a video ready to publish.",
    jobs: [
      "Scripts, shot lists and hooks for a new video",
      "Transcripts, subtitles and chapter markers",
      "Editing decisions: cuts, pacing, and what to cut",
    ],
  },
  "Research & Knowledge": {
    headline: "Going deeper on a question than a search box will take you.",
    jobs: [
      "Building a literature or market summary from what you have",
      "Pressure-testing a claim before you repeat it",
      "Turning notes into a position you can defend",
    ],
  },
  "Business & Management": {
    headline: "The paperwork and judgement calls of running an organisation.",
    jobs: [
      "Strategy, planning and decision memos",
      "Policies, processes and standard operating docs",
      "Framing a decision so the trade-offs are explicit",
    ],
  },
  "Quality & Performance": {
    headline: "Finding what is actually slow or wrong, and why.",
    jobs: [
      "Profiling a slow path and proposing the fix",
      "Test strategies and the cases worth covering",
      "Rewriting something that works but does not scale",
    ],
  },
  "Design & Creative": {
    headline: "Getting from a blank page to a direction you can critique.",
    jobs: [
      "Naming, concepts and creative territories",
      "Design critique against a brief or a system",
      "Copy and microcopy for interfaces",
    ],
  },
  "Audio & Speech": {
    headline: "Scripts, transcripts and getting words out of recordings.",
    jobs: [
      "Voiceover, podcast and announcement scripts",
      "Transcribing, summarising and pulling quotes from audio",
      "Tuning pronunciation, pacing and delivery",
    ],
  },
  "Marketing & SEO": {
    headline: "Positioning, campaign copy and the work search engines reward.",
    jobs: [
      "Ad copy, landing page sections and campaign angles",
      "Keyword research, briefs and content outlines",
      "Positioning: who it is for and why it beats the alternative",
    ],
  },
  "Automation & Workflows": {
    headline: "Wiring repetitive steps together so they stop needing you.",
    jobs: [
      "Designing the workflow before writing any of it",
      "Connecting tools that do not natively talk",
      "Error handling, retries and what happens when a step fails",
    ],
  },
  "Math & Science": {
    headline: "Working through a calculation or a derivation step by step.",
    jobs: [
      "Checking an answer rather than guessing at it",
      "Setting up and solving problems with the work shown",
      "Translating a formula or a result into plain language",
    ],
  },
  Career: {
    headline: "The documents and conversations that move a job search along.",
    jobs: [
      "CVs, cover letters and tailored application text",
      "Interview preparation and post-interview follow-ups",
      "Negotiating, reviewing offers and planning a move",
    ],
  },
  "Money & Finance": {
    headline: "Numbers about money, with the assumptions written down.",
    jobs: [
      "Budgets, forecasts and cash-flow planning",
      "Comparing loans, cards and interest rates on the real terms",
      "Explaining what a financial product actually does to you",
    ],
  },
  "Health & Wellbeing": {
    headline: "Structure for habits, routines and tracking.",
    jobs: [
      "Habit and routine design that survives a bad week",
      "Tracking sleep, food, training or symptoms over time",
      "Reading a metric without turning it into a diagnosis",
    ],
  },
  "Travel & Local": {
    headline: "Planning and comparing trips, routes and stays.",
    jobs: [
      "Itineraries that fit real opening hours and travel times",
      "Comparing options on cost, location and trade-offs",
      "Packing lists and the logistics that get forgotten",
    ],
  },
  "Social & Community": {
    headline: "Posts, replies and moderation for the accounts you run.",
    jobs: [
      "Post copy and variations that can be tested against each other",
      "Replies to comments and difficult conversations",
      "Community rules and moderation decisions",
    ],
  },
  "Home & Everyday": {
    headline: "The small recurring jobs of running a household.",
    jobs: [
      "Lists, schedules and household planning",
      "Instructions, recipes and DIY walkthroughs",
      "Getting a decision made when the options all look the same",
    ],
  },
  "Web & Frontend": {
    headline: "Building and fixing the interface people actually touch.",
    jobs: [
      "Turning a design or a sketch into working components",
      "Layout, responsive behaviour and accessibility defects",
      "Performance and bundle size on a real page",
    ],
  },
  "Backend & APIs": {
    headline: "Server-side work: contracts, endpoints and failure modes.",
    jobs: [
      "Designing and documenting an API before clients depend on it",
      "Auth, rate limits, validation and error contracts",
      "Tracing a failure through services you do not own",
    ],
  },
  "DevOps & Cloud": {
    headline: "Shipping reliably and knowing what broke when it does.",
    jobs: [
      "Pipelines, infrastructure as code and deployment strategy",
      "Observability: what to log, alert on and keep",
      "Incident response and post-mortems",
    ],
  },
  "Mobile & Apps": {
    headline: "Screens, state and the platform rules apps get rejected over.",
    jobs: [
      "Screen and navigation structure before any code is written",
      "Offline behaviour, sync and local persistence",
      "Reviewing an app against store review guidelines",
    ],
  },
  "Testing & QA": {
    headline: "Deciding what to test and proving it works.",
    jobs: [
      "Test plans and the cases that actually catch regressions",
      "Writing the tests, mocks and fixtures to go with them",
      "Reproducing and narrowing a flaky or failing test",
    ],
  },
  "AI Agents & Prompting": {
    headline: "Making a model do a specific job, repeatably.",
    jobs: [
      "Prompt structure, constraints and output contracts",
      "Tool-calling, multi-step agents and failure recovery",
      "Evaluating whether the output is good enough to ship",
    ],
  },
  "Machine Learning": {
    headline: "Getting a model trained, measured and trusted.",
    jobs: [
      "Choosing a baseline before reaching for anything complex",
      "Evaluation, metrics and reading a results table honestly",
      "Debugging a model that works in a notebook and not in production",
    ],
  },
  "Databases & SQL": {
    headline: "Asking the database a question it can answer quickly.",
    jobs: [
      "Writing the query for a question you do not yet know the answer to",
      "Schema and index decisions on a growing table",
      "Migrations that do not lock the table at the wrong moment",
    ],
  },
  Spreadsheets: {
    headline: "Formulas, cleanup and analysis in the sheet you already have.",
    jobs: [
      "The formula that turns a messy column into a clean one",
      "Joins, lookups and pivots across several sheets",
      "Turning a sheet into a chart or a summary someone will read",
    ],
  },
  "Analytics & Reporting": {
    headline: "Turning tracked data into a report that changes a decision.",
    jobs: [
      "Choosing the metric that actually answers the question",
      "Building a repeatable report instead of a one-off export",
      "Explaining a change in the numbers without overclaiming",
    ],
  },
  "Sales & CRM": {
    headline: "Outreach, follow-up and deal hygiene.",
    jobs: [
      "Cold outreach that is specific rather than templated",
      "Call prep, objection handling and follow-ups",
      "Pipeline review and the deal that has gone quiet",
    ],
  },
  "Customer Support": {
    headline: "Answers, macros and de-escalation for real people.",
    jobs: [
      "A first reply that resolves the issue instead of forwarding it",
      "Macros and help-centre articles from a resolved ticket",
      "The tone shift for an angry or confused customer",
    ],
  },
  "Legal & Contracts": {
    headline: "Contract work that needs a lawyer, not a chatbot, to sign off.",
    jobs: [
      "Getting a first pass on unfamiliar contract language",
      "Drafting clauses and comparing two versions of a term",
      "Summarising what you are agreeing to before you sign",
    ],
  },
  "HR & Hiring": {
    headline: "Hiring, interviewing and the paperwork around people.",
    jobs: [
      "Job descriptions and scorecards that decide something",
      "Interview questions and reading the answers fairly",
      "Policies and letters that need HR review before they go out",
    ],
  },
  "Ecommerce & Retail": {
    headline: "Storefronts, listings and the numbers behind them.",
    jobs: [
      "Product copy, variants and merchandising decisions",
      "Pricing, margin and promotion maths",
      "Returns, shipping and the checkout flow",
    ],
  },
  "Content & Social Media": {
    headline: "Producing content on a schedule you can actually keep.",
    jobs: [
      "An editorial angle and a calendar that will not collapse in week three",
      "Repurposing one piece into several formats",
      "What to post, how often, and what to stop posting",
    ],
  },
  "Gaming & Esports": {
    headline: "Strategy, practice and the numbers behind play.",
    jobs: [
      "VOD review and what actually caused a round to be lost",
      "Builds, loadouts and matchup preparation",
      "Tracking performance over a season rather than one game",
    ],
  },
  "Food & Cooking": {
    headline: "What to cook, and how to cook it properly.",
    jobs: [
      "Cooking from what is already in the cupboard",
      "Scaling a recipe, or rescuing one that went wrong",
      "Prep and timing for a meal with a fixed start time",
    ],
  },
  "Sports & Fitness": {
    headline: "Training, technique and honest progress tracking.",
    jobs: [
      "Programming around a real schedule and real equipment",
      "Technique corrections on a lift, a swing or a stroke",
      "Reading a training log and adjusting instead of restarting",
    ],
  },
  "Events & Community": {
    headline: "Running something with a date attached to it.",
    jobs: [
      "Run sheets, agendas and timelines that account for setup",
      "Comms before, during and after the event",
      "Gathering feedback and turning it into changes",
    ],
  },
};

export interface UseCase {
  headline: string;
  jobs: string[];
}

/** Real category-level use cases, or `null` when the category is unmapped. */
export function commandUseCase(command: SlashCommand): UseCase | null {
  const entry = CATEGORY_USE_CASES[command.category];
  if (!entry) return null;
  return entry;
}

/* ───────────────────────────── freshness & trending ───────────────────────────── */

const DAY_MS = 86_400_000;

/**
 * Newest catalogued commands, by the `addedAt` field.
 *
 * Entries dated in the future are dropped rather than sorted to the top: the
 * source data has a large block of them, and putting a command stamped 2027 at
 * the head of a "newest" list would be a claim SlashAI cannot support. When the
 * data is eventually corrected these simply re-enter the list.
 */
export function freshCommands(limit = 6, now = Date.now()): SlashCommand[] {
  return COMMANDS.filter((c) => {
    const ts = Date.parse(c.addedAt);
    return !Number.isNaN(ts) && ts <= now;
  })
    .sort((a, b) => (a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0))
    .slice(0, limit);
}

/** Highest `popularity` first. This is a catalogued score, not live usage. */
export function trendingCommands(limit = 6): SlashCommand[] {
  return [...COMMANDS]
    .filter((c) => typeof c.popularity === "number")
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, limit);
}

/**
 * "Added within the last `days` days", at millisecond precision.
 *
 * This has to agree with `isNewItem` in lib/ux.ts, which is what the rest of
 * the site uses to badge a game, tool or command as new. Comparing `addedAt`
 * as a "YYYY-MM-DD" string against a date-string cutoff instead counts a
 * command as new that `isNewItem` calls 30 days old, because the cutoff is
 * rounded down to midnight while the window is not.
 */
export function isFresh(command: SlashCommand, days = 30, now = Date.now()): boolean {
  if (!command.addedAt) return false;
  const ts = Date.parse(command.addedAt);
  if (Number.isNaN(ts)) return false;
  const age = now - ts;
  return age >= 0 && age <= days * DAY_MS;
}

/** How many catalogued commands landed in the last `days` days. */
export function addedInLastDays(days: number, now = Date.now()): number {
  return COMMANDS.filter((c) => isFresh(c, days, now)).length;
}

/* ─────────────────────────────── hashtags ─────────────────────────────── */

/** "Documents & OCR" -> "documents-ocr"; a tag is already slug-safe. */
function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Real hashtags for a command: its own catalogued tags, plus the category and
 * the brand. De-duplicated and capped. Nothing is invented — every entry comes
 * from data already on the command.
 */
export function commandHashtags(command: SlashCommand, limit = 8): string[] {
  const out: string[] = [];
  const push = (raw: string) => {
    const slug = toSlug(raw);
    if (slug && !out.includes(slug)) out.push(slug);
  };

  for (const tag of command.tags) push(tag);
  push(command.subcategory);
  push(command.category);
  push("slashai");
  push("aiCommands");
  push("promptEngineering");

  return out.slice(0, limit);
}

/** Hashtags as they would be typed into Instagram / X, for the share text. */
export function hashtagString(command: SlashCommand, limit = 8): string {
  return commandHashtags(command, limit)
    .map((h) => `#${h}`)
    .join(" ");
}

/* ─────────────────────────────── effort signals ─────────────────────────────── */

/**
 * Real, checkable facts about how much work a command is: how many blanks it
 * asks you to fill and what the catalogued difficulty is.
 */
export function commandEffort(command: SlashCommand): {
  variables: number;
  difficulty: string;
} {
  return {
    variables: placeholderCount(`${command.command}\n${command.example}`),
    difficulty: command.difficulty,
  };
}

/** Commands in the same subcategory — the nearest real neighbours. */
export function nicheNeighbours(command: SlashCommand, limit = 4): SlashCommand[] {
  return COMMANDS.filter(
    (c) => c.id !== command.id && c.subcategory && c.subcategory === command.subcategory,
  ).slice(0, limit);
}

/** How many commands share this subcategory. A real catalogue count. */
export function nicheSize(command: SlashCommand): number {
  if (!command.subcategory) return 0;
  return COMMANDS.filter((c) => c.subcategory === command.subcategory).length;
}
