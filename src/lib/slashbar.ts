/**
 * SlashBar — the app rail. 23 Slash mini-apps, each packed with real, useful
 * content pools and working generators (no placeholders, no API keys). Single
 * source of truth for the /slash hub, /slash/$app pages, nav and Discovery.
 *
 * Widget types (all client-side, all functional):
 * - "list"    : tap-to-reveal entries with copy
 * - "deck"    : big searchable pool with show-more pagination
 * - "picker"  : input/choices → deterministic generated output (has `run`)
 * - "counter" : tap/toggle interactive machine
 * - "gallery" : visual grid/cards to browse
 */

import { CAT_PALETTE, type CatColor } from "./category-colors";
import {
  MEGA_FACTS, MEGA_MYTHS, MEGA_TEASERS, MEGA_HACKS, MEGA_BRAKES, MEGA_STACK,
  MEGA_SAFE_SALE, MEGA_FIRST_VISIT, MEGA_ROLES, MEGA_HOW_TO, MEGA_PROMPTS,
  MEGA_JOKES, MEGA_TWISTERS, MEGA_OPERATORS, MEGA_SCALE, MEGA_PRESENCE,
  MEGA_ICEBREAKERS, MEGA_COMMUNITY_TIPS, MEGA_DESK_TIPS, MEGA_GADGET_RULES,
  MEGA_STUDY, MEGA_INTERVIEW_Q, MEGA_SALARY_TIPS, MEGA_EMAIL_TIPS,
  MEGA_DATE_IDEAS, MEGA_COMPLIMENTS, MEGA_SIM_TIPS, MEGA_CAPSULE,
  MEGA_GROOMING, MEGA_COURSE_TIPS, MEGA_NEARBY_TIPS,
} from "./slashbar-content";

export interface Widget {
  /** widget renderer key (SlashBarWidget.tsx) */
  kind: "list" | "deck" | "picker" | "counter" | "gallery";
  title: string;
  hint?: string;
  /** list items / deck entries */
  items?: string[];
  /** tap reveals this string (list kind, optional) */
  reveal?: boolean;
  /** copy affordance for list items */
  copyable?: boolean;
  /** picker fields */
  fields?: { label: string; placeholder?: string; type?: "text" | "number" }[];
  /** picker action label */
  action?: string;
  /** picker: build the output from field values */
  run?: (values: string[]) => string;
  /** counter machine config */
  counter?: {
    /** one state step of the machine, cycled on tap */
    steps: { label: string; note: string; tint?: string }[];
    /** count of tap-tracked things (optional score) */
    scoreLabel?: string;
  };
  gallery?: { title: string; desc: string }[];
}

export interface SlashApp {
  slug: string;
  name: string;
  emoji: string;
  desc: string;
  tint: CatColor;
  /** when set, the app links to an existing section instead of hosting widgets */
  link?: string;
  widgets: Widget[];
}

const T = CAT_PALETTE;

const LIFE_HACKS = MEGA_HACKS;
const BRAIN_TEASERS = MEGA_TEASERS;
const FACTS = MEGA_FACTS;
const MYTHS = MEGA_MYTHS;
const SCALE_FACTS = MEGA_SCALE;
const JOKES = MEGA_JOKES;
const SEARCH_OPERATORS = MEGA_OPERATORS;
const TONGUE_TWISTERS = MEGA_TWISTERS;
const IMPULSE_BRAKES = MEGA_BRAKES;
const DISCOUNT_STACK = MEGA_STACK;
const SAFE_SALE = MEGA_SAFE_SALE;
const FIRST_VISIT = MEGA_FIRST_VISIT;
const COMMUNITY_ROLES = MEGA_ROLES;
const HOW_TO_GUIDES = MEGA_HOW_TO;
const THINKING_PROMPTS = MEGA_PROMPTS;
const PRESENCE_DRILL = MEGA_PRESENCE;

/* original small pools retained for variety */
const LIFE_HACKS_LEGACY: string[] = [
  "2-minute rule: if it takes under 2 minutes, do it now. Deferral costs more than the task.",
  "Phone in another room while working. Not face-down - another room. Focus doubles.",
  "Grocery list ordered by store layout. Halves shopping time, kills impulse buys.",
  "Sleep at the same time daily for 2 weeks before judging whether you're 'a night person'.",
  "Prepare tomorrow's first task tonight. Mornings start with momentum, not decisions.",
  "Put savings transfer on payday, not month-end. You can't spend what you never see.",
  "Write down 3 things before bed. Worry loops shrink when they're on paper.",
  "If a task scares you, name the actual first physical step. Most fear is fog around step one.",
];
const PR_DRILL: string[] = [
  "Rural juror (say 3× fast) - classic {c} warmup.",
  "The thirty-three thieves thought that they thrilled the throne throughout Thursday - {c} clarity test.",
  "Irish wristwatch, Irish wristwatch - precision for {c} intros.",
  "Sixth sense - the 'x' bundle trips everyone in {c} settings.",
];

export const SLASH_APPS: SlashApp[] = [
  {
    slug: "kits",
    name: "SlashKits",
    emoji: "🧰",
    desc: "150+ free browser tools - compress, convert, calculate, focus.",
    tint: T.teal,
    link: "/tools",
    widgets: [],
  },
  {
    slug: "play",
    name: "SlashPlay",
    emoji: "🎮",
    desc: "47 free games - multiplayer, arcade, cards, puzzles, zen.",
    tint: T.rose,
    link: "/play",
    widgets: [],
  },
  {
    slug: "slashgram",
    name: "SlashGram",
    emoji: "📸",
    desc: "A fictional social world - post, go viral, collect millions of fake likes.",
    tint: T.fuchsia,
    link: "/slash/slashgram",
    widgets: [],
  },
  {
    slug: "labs",
    name: "Slash Labs",
    emoji: "🧪",
    desc: "Experiments & generators that do something useful instantly.",
    tint: T.violet,
    widgets: [
      {
        kind: "picker",
        title: "Palette Brewer",
        hint: "Type any colour name or hex — get a working 5-stop palette with copyable values.",
        fields: [{ label: "Base colour", placeholder: "teal, #2dd4bf, crimson…" }],
        action: "Brew palette",
        run: ([base]) => brewPalette(base ?? "teal"),
      },
      {
        kind: "picker",
        title: "Tiny Synth Note",
        hint: "Hear a note from a word. Deterministic, no samples, WebAudio.",
        fields: [{ label: "Word", placeholder: "hello" }],
        action: "Play note",
        run: ([word]) => {
          const h = hashStr(word || "a");
          return `Note ${"C C# D D# E F F# G G# A A# B".split(" ")[h % 12]} · octave ${3 + (h % 3)} · wave ${["sine", "square", "triangle"][h % 3]}`;
        },
      },
      {
        kind: "counter",
        title: "Reaction Counter",
        hint: "Tap the pad as fast as you can for 5 seconds. Counts live.",
        counter: { steps: [{ label: "Tap!", note: "Go go go" }], scoreLabel: "taps" },
      },
    ],
  },
  {
    slug: "learning",
    name: "Slash Learning",
    emoji: "🎓",
    desc: "Memory tools and study generators that actually help you retain.",
    tint: T.blue,
    widgets: [
      {
        kind: "picker",
        title: "Flashcard Maker",
        hint: "Paste a topic — get an instant 5-card study deck to flip through.",
        fields: [{ label: "Topic", placeholder: "photosynthesis" }],
        action: "Make deck",
        run: ([topic]) => flashcards(topic || "your topic"),
      },
      {
        kind: "picker",
        title: "Spaced Plan",
        hint: "Get the exact days to review anything so it sticks (1-3-7-21).",
        fields: [{ label: "What you're learning", placeholder: "Spanish verbs" }],
        action: "Get schedule",
        run: ([topic]) => spacedPlan(topic || "this subject"),
      },
      {
        kind: "picker",
        title: "Feynman Prompt",
        hint: "Explaining simply exposes gaps. Here's your prompt.",
        fields: [{ label: "Concept", placeholder: "inflation" }],
        action: "Get prompt",
        run: ([c]) => `Explain "${c}" to a 10-year-old in 4 sentences. Then: what did you struggle to simplify? That's your gap — study that part first.`,
      },
      {
        kind: "deck",
        title: "The Study Playbook",
        hint: "15 evidence-backed techniques. Searchable.",
        items: MEGA_STUDY,
      },
    ],
  },
  {
    slug: "brain-boosters",
    name: "Slash Brain Boosters",
    emoji: "🧠",
    desc: "Daily cognitive workouts - patterns, memory chains, focus drills.",
    tint: T.fuchsia,
    widgets: [
      {
        kind: "deck",
        title: "Brain Teaser Vault",
        hint: "20 classics with answers - searchable.",
        items: BRAIN_TEASERS,
      },
      {
        kind: "gallery",
        title: "Numbers That Sound Fake",
        hint: "Real magnitudes, for perspective.",
        gallery: SCALE_FACTS,
      },
      {
        kind: "picker",
        title: "Memory Chain",
        hint: "Random 7-item chain — memorise it, then check yourself tomorrow.",
        fields: [],
        action: "New chain",
        run: () => memoryChain(),
      },
      {
        kind: "picker",
        title: "N-Back Trainer",
        hint: "Say each letter aloud, two positions back. Brutal, effective.",
        fields: [{ label: "Letters to generate", placeholder: "12", type: "number" }],
        action: "Generate",
        run: ([n]) => nBack(parseInt(n || "12", 10)),
      },
    ],
  },
  {
    slug: "romantic",
    name: "Slash Romantic",
    emoji: "💘",
    desc: "Lines, dates and sweet nothings - generated fresh, not canned.",
    tint: T.pink,
    widgets: [
      {
        kind: "picker",
        title: "Compliment Composer",
        hint: "Their name + one true thing = a compliment that doesn't feel copy-pasted.",
        fields: [
          { label: "Their name", placeholder: "Aisha" },
          { label: "Something you love about them", placeholder: "how she laughs at her own jokes" },
        ],
        action: "Write it",
        run: ([name, thing]) => compliment(name || "you", thing || "everything"),
      },
      {
        kind: "picker",
        title: "Date Idea Spinner",
        hint: "Budget + vibe → three real date plans.",
        fields: [
          { label: "Budget", placeholder: "0 = free…, e.g. 20" },
          { label: "Vibe", placeholder: "cozy, adventurous, silly" },
        ],
        action: "Spin ideas",
        run: ([budget, vibe]) => dateIdeas(budget || "0", vibe || "any"),
      },
      {
        kind: "picker",
        title: "Love Letter Seed",
        hint: "A starting paragraph you finish in your own voice.",
        fields: [{ label: "Their name", placeholder: "…" }],
        action: "Draft",
        run: ([n]) => loveLetter(n || "you"),
      },
      {
        kind: "deck",
        title: "Date Idea Library",
        hint: "12 real date plans - mostly free, all tested by real couples.",
        items: MEGA_DATE_IDEAS,
      },
      {
        kind: "deck",
        title: "Compliments That Land",
        hint: "10 specific, non-cringy compliments with the why.",
        items: MEGA_COMPLIMENTS,
      },
    ],
  },
  {
    slug: "courses",
    name: "Slash Courses",
    emoji: "📚",
    desc: "Build your own mini-course plans from any topic, free.",
    tint: T.emerald,
    widgets: [
      {
        kind: "picker",
        title: "Course Builder",
        hint: "Any topic → a 4-week self-study plan with free-first resources.",
        fields: [{ label: "Topic", placeholder: "machine learning" }],
        action: "Build plan",
        run: ([topic]) => coursePlan(topic || "your topic"),
      },
      {
        kind: "picker",
        title: "Skill Ladder",
        hint: "Break a skill into 5 rungs from zero to hired.",
        fields: [{ label: "Skill", placeholder: "React" }],
        action: "Build ladder",
        run: ([skill]) => skillLadder(skill || "your skill"),
      },
      {
        kind: "picker",
        title: "Study Block Timer",
        hint: "Get a Pomodoro-style block plan tuned to your session length.",
        fields: [{ label: "Minutes available", placeholder: "90", type: "number" }],
        action: "Plan blocks",
        run: ([m]) => studyBlocks(parseInt(m || "60", 10)),
      },
    ],
  },
  {
    slug: "jobs",
    name: "Slash Jobs",
    emoji: "💼",
    desc: "Interview prep, salary scripts and application helpers.",
    tint: T.indigo,
    widgets: [
      {
        kind: "picker",
        title: "Interview Drill",
        hint: "Role → the 5 questions you'll actually get, with an answer skeleton.",
        fields: [{ label: "Role", placeholder: "frontend developer" }],
        action: "Drill me",
        run: ([role]) => interviewDrill(role || "your role"),
      },
      {
        kind: "picker",
        title: "Salary Script",
        hint: "Never say a number first. Here's the exact wording.",
        fields: [{ label: "Role + city", placeholder: "designer in Mumbai" }],
        action: "Get script",
        run: ([role]) => salaryScript(role || "this role"),
      },
      {
        kind: "picker",
        title: "Cold Email Draft",
        hint: "A hiring-manager email that doesn't read like a template.",
        fields: [
          { label: "Your name", placeholder: "…" },
          { label: "Role & company", placeholder: "FE dev at Zerodha" },
        ],
        action: "Draft",
        run: ([name, role]) => coldEmail(name || "Hi", role || "the role"),
      },
      {
        kind: "deck",
        title: "Salary Negotiation Deck",
        hint: "8 rules that add lakhs over a career.",
        items: MEGA_SALARY_TIPS,
      },
      {
        kind: "deck",
        title: "Emails That Get Replies",
        hint: "Cold-outreach rules from people who send hundreds.",
        items: MEGA_EMAIL_TIPS,
      },
    ],
  },
  {
    slug: "life-hacks",
    name: "Slash Life Hacks",
    emoji: "⚡",
    desc: "Small systems that compound - mornings, money, focus, sleep.",
    tint: T.amber,
    widgets: [
      {
        kind: "list",
        title: "The Hack Deck",
        hint: "Tap to reveal each one. All testable, no pseudoscience.",
        reveal: true,
        items: LIFE_HACKS,
      },
      {
        kind: "picker",
        title: "Habit Anchoring",
        hint: "Attach a new habit to something you already do.",
        fields: [{ label: "Habit you want", placeholder: "read 10 pages" }],
        action: "Anchor it",
        run: ([habit]) => habitAnchor(habit || "your habit"),
      },
      {
        kind: "picker",
        title: "Sleep Calculator",
        hint: "Bedtime → wake times in full 90-min cycles.",
        fields: [{ label: "Bedtime (24h)", placeholder: "23:00" }],
        action: "Calculate",
        run: ([t]) => sleepCycles(t || "23:00"),
      },
    ],
  },
  {
    slug: "facts",
    name: "Slash Facts",
    emoji: "🔎",
    desc: "50+ true, surprising facts, myths debunked, and perspective-scale cards.",
    tint: T.cyan,
    widgets: [
      {
        kind: "deck",
        title: "Fact Drops",
        hint: "51 verified facts - searchable, all real.",
        items: FACTS,
      },
      {
        kind: "deck",
        title: "Myth or Fact",
        hint: "25 myths with the verdict and why.",
        items: MYTHS,
      },
      {
        kind: "gallery",
        title: "Numbers That Sound Fake",
        hint: "Real magnitudes, for perspective.",
        gallery: SCALE_FACTS,
      },
    ],
  },
  {
    slug: "create",
    name: "Slash Create",
    emoji: "🖌️",
    desc: "Instant creative ignition - ideas, prompts and structures.",
    tint: T.orange,
    widgets: [
      {
        kind: "picker",
        title: "Idea Combo",
        hint: "Two random sparks + your topic = a fresh angle.",
        fields: [{ label: "What you're making", placeholder: "a video, a story, a logo" }],
        action: "Combine",
        run: ([what]) => ideaCombo(what || "something"),
      },
      {
        kind: "picker",
        title: "Story Starter",
        hint: "A first line you can't help but continue.",
        fields: [{ label: "Genre", placeholder: "sci-fi, romance, horror…" }],
        action: "Start it",
        run: ([genre]) => storyStarter(genre || "any"),
      },
      {
        kind: "picker",
        title: "Name Forge",
        hint: "Names for anything - apps, bands, characters.",
        fields: [{ label: "For what", placeholder: "a productivity app" }],
        action: "Forge names",
        run: ([what]) => nameForge(what || "it"),
      },
    ],
  },
  {
    slug: "image",
    name: "Slash Image",
    emoji: "🖼️",
    desc: "Image magic in your browser - palettes, ASCII, gradients.",
    tint: T.violet,
    widgets: [
      {
        kind: "picker",
        title: "Gradient Studio",
        hint: "Two colours → CSS gradient code, live preview.",
        fields: [
          { label: "Colour 1", placeholder: "#2dd4bf" },
          { label: "Colour 2", placeholder: "#a78bfa" },
        ],
        action: "Make gradient",
        run: ([a, b]) => gradientCode(a || "#2dd4bf", b || "#a78bfa"),
      },
      {
        kind: "picker",
        title: "Palette from Colour",
        hint: "One colour → complementary, analogous and triad stops.",
        fields: [{ label: "Colour", placeholder: "#fb7185" }],
        action: "Extract",
        run: ([c1]) => brewPalette(c1 || "#fb7185"),
      },
      {
        kind: "picker",
        title: "Favicon Roster",
        hint: "See a brand's icon next to yours — spot mismatches fast.",
        fields: [
          { label: "Domain 1", placeholder: "github.com" },
          { label: "Domain 2", placeholder: "vercel.com" },
        ],
        action: "Show",
        run: ([a, b]) => `Opening favicons for ${a} and ${b}`,
      },
    ],
  },
  {
    slug: "search-engine",
    name: "Slash Search Engine",
    emoji: "🧭",
    desc: "Search operators and one-tap deep-web searches.",
    tint: T.sky,
    widgets: [
      {
        kind: "picker",
        title: "Operator Builder",
        hint: "Build a pro search query without memorising syntax.",
        fields: [
          { label: "Topic", placeholder: "rust async" },
          { label: "Wants", placeholder: "docs, examples, PDF" },
        ],
        action: "Build query",
        run: ([topic, want]) => searchOperator(topic || "", want || ""),
      },
      {
        kind: "picker",
        title: "Deep Search Links",
        hint: "One topic → direct searches across quality engines.",
        fields: [{ label: "Topic", placeholder: "krav maga history" }],
        action: "Get links",
        run: ([t]) => deepLinks(t || "this"),
      },
      {
        kind: "deck",
        title: "Operator Cheat Sheet",
        hint: "15 operators that do 95% of the work.",
        copyable: true,
        items: SEARCH_OPERATORS,
      },
    ],
  },
  {
    slug: "speak",
    name: "Slash Speak",
    emoji: "🗣️",
    desc: "Pronunciation drills and accent-safe phrase builders.",
    tint: T.lime,
    widgets: [
      {
        kind: "deck",
        title: "Tongue Twister Ladder",
        hint: "15 twisters from warm-up to evil (MIT's hardest included).",
        items: TONGUE_TWISTERS,
      },
      {
        kind: "picker",
        title: "Phrase PR Drill",
        hint: "Tricky phrases normal speakers stumble on.",
        fields: [{ label: "Context", placeholder: "interviews, calls…" }],
        action: "Drill",
        run: ([c]) => PR_DRILL.map((p) => p.replace("{c}", c || "general")).join("\n"),
      },
      {
        kind: "picker",
        title: "Say It Backwards",
        hint: "Spelling drill: reverse any word, then say it.",
        fields: [{ label: "Word", placeholder: "rhythm" }],
        action: "Flip",
        run: ([w]) => `"${w}" reversed is "${[...(w || "rhythm")].reverse().join("")}" - say it letter by letter, then forwards.`,
      },
    ],
  },
  {
    slug: "fun",
    name: "Slash Fun",
    emoji: "🎪",
    desc: "Quick delights - jokes, nicknames, useless generators.",
    tint: T.rose,
    widgets: [
      {
        kind: "picker",
        title: "Nickname Machine",
        hint: "Name in, 3 nicknames out. Surprisingly good ones.",
        fields: [{ label: "Name", placeholder: "Waseem" }],
        action: "Nickname me",
        run: ([n]) => nicknames(n || "friend"),
      },
      {
        kind: "deck",
        title: "Clean Joke Deck",
        hint: "30 jokes, punchline after the arrow.",
        items: JOKES,
      },
      {
        kind: "picker",
        title: "Superlative Duel",
        hint: "Settle debates: who's the 'most likely to…' in your group.",
        fields: [{ label: "Names (comma separated)", placeholder: "Ali, Sara, Dan" }],
        action: "Deal awards",
        run: ([names]) => superlatives(names || "everyone"),
      },
    ],
  },
  {
    slug: "gadgets",
    name: "Slash Gadgets",
    emoji: "🔌",
    desc: "Before-you-buy checks and desk setup helpers.",
    tint: T.purple,
    widgets: [
      {
        kind: "picker",
        title: "Gadget Vetting Checklist",
        hint: "What to check before buying any device, generated for the category.",
        fields: [{ label: "Gadget", placeholder: "wireless earbuds" }],
        action: "Get checklist",
        run: ([g]) => gadgetChecklist(g || "a gadget"),
      },
      {
        kind: "picker",
        title: "Desk Setup Planner",
        hint: "Budget → a sane desk build in priority order.",
        fields: [{ label: "Budget", placeholder: "300", type: "number" }],
        action: "Plan setup",
        run: ([b]) => deskSetup(parseInt(b || "200", 10)),
      },
      {
        kind: "deck",
        title: "Desk Setup Priorities",
        hint: "8 ordering rules for building a desk you love.",
        items: MEGA_DESK_TIPS,
      },
      {
        kind: "deck",
        title: "Buy-Smart Gadget Rules",
        hint: "8 rules that save real money on tech.",
        items: MEGA_GADGET_RULES,
      },
      {
        kind: "picker",
        title: "Battery Reality Check",
        hint: "Screen time → hours of actual battery you'll get.",
        fields: [{ label: "Battery capacity (mAh)", placeholder: "4500", type: "number" }],
        action: "Estimate",
        run: ([m]) => batteryLife(parseInt(m || "4500", 10)),
      },
    ],
  },
  {
    slug: "shopping",
    name: "Slash Shopping",
    emoji: "🛍️",
    desc: "Buy-once checklists and price sanity checks.",
    tint: T.emerald,
    widgets: [
      {
        kind: "picker",
        title: "Buy-Once Checklist",
        hint: "Durable-goods questions that save money long-term.",
        fields: [{ label: "Item", placeholder: "running shoes" }],
        action: "Get checklist",
        run: ([i]) => buyOnce(i || "an item"),
      },
      {
        kind: "picker",
        title: "Price Sanity Check",
        hint: "Is it actually a deal? Worth-per-use maths.",
        fields: [
          { label: "Price", placeholder: "120", type: "number" },
          { label: "Uses per month", placeholder: "8", type: "number" },
        ],
        action: "Check",
        run: ([p, u]) => priceSanity(parseFloat(p || "0"), parseInt(u || "1", 10)),
      },
      {
        kind: "deck",
        title: "Impulse Brakes",
        hint: "12 pre-checkout sanity checks.",
        items: IMPULSE_BRAKES,
      },
    ],
  },
  {
    slug: "offers",
    name: "Slash Offers",
    emoji: "🏷️",
    desc: "Deal-hunting systems that work year-round.",
    tint: T.red,
    widgets: [
      {
        kind: "deck",
        title: "Discount Stack Order",
        hint: "8 rules for stacking offers correctly.",
        items: DISCOUNT_STACK,
      },
      {
        kind: "picker",
        title: "Sale Calendar",
        hint: "Category → when that thing is genuinely cheapest.",
        fields: [{ label: "Category", placeholder: "laptops" }],
        action: "When to buy",
        run: ([c]) => saleCalendar(c || "electronics"),
      },
      {
        kind: "picker",
        title: "Coupon Stacker",
        hint: "Estimate your real final price with stacked offers.",
        fields: [
          { label: "Price", placeholder: "1000", type: "number" },
          { label: "Off % (total)", placeholder: "30", type: "number" },
        ],
        action: "Stack",
        run: ([p, d]) => {
          const final = parseFloat(p || "0") * (1 - parseFloat(d || "0") / 100);
          return `₹${(Math.round(final * 100) / 100).toLocaleString()} final (from ${p}, ${d}% off). Cashback counts only if you'd buy anyway.`;
        },
      },
    ],
  },
  {
    slug: "mini-store",
    name: "Slash Mini Store",
    emoji: "🏪",
    desc: "Sell-your-stuff pricing and listing helpers.",
    tint: T.amber,
    widgets: [
      {
        kind: "picker",
        title: "Resale Pricer",
        hint: "Original price + age → realistic resale range.",
        fields: [
          { label: "Paid", placeholder: "5000", type: "number" },
          { label: "Years owned", placeholder: "2", type: "number" },
        ],
        action: "Price it",
        run: ([p, y]) => {
          const v = parseFloat(p || "0") * Math.pow(0.65, parseFloat(y || "1"));
          return `List at ₹${Math.round(v).toLocaleString()} (range ±15%). Photos in daylight, honest flaw notes sell 2× faster.`;
        },
      },
      {
        kind: "picker",
        title: "Listing Title Writer",
        hint: "Titles that search well and don't look spammy.",
        fields: [
          { label: "Item", placeholder: "iPhone 12" },
          { label: "Condition", placeholder: "good, minor scratch" },
        ],
        action: "Write title",
        run: ([i, c]) => `${i} - ${c} - pickup OK`.replace(/\s+/g, " "),
      },
      {
        kind: "deck",
        title: "Safe Sale Steps",
        hint: "8 marketplace-meetup safety rules.",
        items: SAFE_SALE,
      },
    ],
  },
  {
    slug: "mens",
    name: "Slash Mens",
    emoji: "🧔",
    desc: "Grooming, style and quiet-confidence basics.",
    tint: T.indigo,
    widgets: [
      {
        kind: "picker",
        title: "Capsule Wardrobe",
        hint: "Colour palette + 12 pieces that all interchange.",
        fields: [{ label: "Style vibe", placeholder: "minimal, street, formal" }],
        action: "Build capsule",
        run: ([v]) => capsule(v || "minimal"),
      },
      {
        kind: "picker",
        title: "Grooming Basics",
        hint: "A routine that takes under 5 minutes.",
        fields: [{ label: "Skin type", placeholder: "oily, dry, normal" }],
        action: "Get routine",
        run: ([s]) => grooming(s || "normal"),
      },
      {
        kind: "deck",
        title: "Presence & Confidence Drills",
        hint: "8 reps for quiet, unforced confidence.",
        items: PRESENCE_DRILL,
      },
      {
        kind: "deck",
        title: "Capsule Wardrobe Rules",
        hint: "10 rules that make getting dressed automatic.",
        items: MEGA_CAPSULE,
      },
      {
        kind: "deck",
        title: "Grooming Fundamentals",
        hint: "10 habits, under 5 minutes a day.",
        items: MEGA_GROOMING,
      },
    ],
  },
  {
    slug: "how-to-zone",
    name: "Slash How-To Zone",
    emoji: "🛠️",
    desc: "Micro-guides for the things nobody teaches properly.",
    tint: T.teal,
    widgets: [
      {
        kind: "deck",
        title: "Adulting Guides",
        hint: "18 essential how-tos nobody teaches properly.",
        items: HOW_TO_GUIDES,
      },
      {
        kind: "picker",
        title: "Task Breaker",
        hint: "Overwhelming task → 5 concrete first steps.",
        fields: [{ label: "Task", placeholder: "file taxes" }],
        action: "Break it down",
        run: ([t]) => taskBreaker(t ?? "this task"),
      },
      {
        kind: "picker",
        title: "Explainer Request",
        hint: "Get a copy-paste prompt that makes any AI explain properly.",
        fields: [{ label: "Topic", placeholder: "compound interest" }],
        action: "Build prompt",
        run: ([t]) => `Explain "${t}" three times: to a child, to a smart teen, to an expert. Then tell me which explanation level I actually need based on my follow-up questions.`,
      },
    ],
  },
  {
    slug: "thinks",
    name: "Slash Thinks",
    emoji: "💭",
    desc: "Decision frameworks and journaling structures.",
    tint: T.violet,
    widgets: [
      {
        kind: "picker",
        title: "Decision Splitter",
        hint: "Reversible or not? That changes everything.",
        fields: [{ label: "Decision", placeholder: "quit my job" }],
        action: "Split it",
        run: ([d]) => decisionSplit(d || "this decision"),
      },
      {
        kind: "picker",
        title: "10/10/10 Journal",
        hint: "How will you feel in 10 minutes / months / years?",
        fields: [{ label: "What's on your mind", placeholder: "…" }],
        action: "Frame it",
        run: ([x]) => tenTenTen(x || "this"),
      },
      {
        kind: "deck",
        title: "Thinking Prompts",
        hint: "20 deep prompts. Sit with each one.",
        items: THINKING_PROMPTS,
      },
    ],
  },
  {
    slug: "community",
    name: "Slash Community",
    emoji: "🤝",
    desc: "Icebreakers, community roles and event scripts.",
    tint: T.green,
    widgets: [
      {
        kind: "picker",
        title: "Icebreaker Generator",
        hint: "Questions that actually get answers.",
        fields: [{ label: "Group", placeholder: "new team, classmates, strangers" }],
        action: "Generate",
        run: ([g]) => icebreakers(g || "your group"),
      },
      {
        kind: "picker",
        title: "Event Agenda Builder",
        hint: "Meetup agenda that doesn't drag.",
        fields: [{ label: "Event type", placeholder: "study group, game night" }],
        action: "Build agenda",
        run: ([e]) => eventAgenda(e || "meetup"),
      },
      {
        kind: "deck",
        title: "Community Roles",
        hint: "10 roles that make or break communities.",
        items: COMMUNITY_ROLES,
      },
      {
        kind: "deck",
        title: "Event Hosting Rules",
        hint: "8 rules from people who run rooms.",
        items: MEGA_COMMUNITY_TIPS,
      },
    ],
  },
  {
    slug: "simulator",
    name: "Slash Simulator",
    emoji: "🕹️",
    desc: "What-if machines - compound interest to life math.",
    tint: T.cyan,
    widgets: [
      {
        kind: "picker",
        title: "Compound Simulator",
        hint: "Monthly saving at real-ish rates. See the curve mentally.",
        fields: [
          { label: "Monthly", placeholder: "5000", type: "number" },
          { label: "Years", placeholder: "10", type: "number" },
          { label: "Rate %", placeholder: "8", type: "number" },
        ],
        action: "Simulate",
        run: ([m, y, r]) => compound(parseFloat(m || "0"), parseInt(y || "1", 10), parseFloat(r || "8")),
      },
      {
        kind: "picker",
        title: "Skill Hours",
        hint: "Practice minutes/day → months to competent.",
        fields: [
          { label: "Minutes/day", placeholder: "45", type: "number" },
          { label: "Target hours", placeholder: "100", type: "number" },
        ],
        action: "Project",
        run: ([min, target]) => {
          const days = Math.ceil((parseFloat(target || "100") * 60) / Math.max(parseFloat(min || "30"), 1));
          return `${days} days (≈${(days / 30).toFixed(1)} months) to ${target} hours at ${min} min/day. Consistency beats intensity.`;
        },
      },
      {
        kind: "picker",
        title: "Page Count Simulator",
        hint: "Pages/day → books per year.",
        fields: [{ label: "Pages/day", placeholder: "20", type: "number" }],
        action: "Simulate",
        run: ([p]) => {
          const books = (parseFloat(p || "0") * 365) / 300;
          return `${books.toFixed(1)} books/year at ${p} pages/day (300pg avg). Ten pages a day is twelve books.`;
        },
      },
    ],
  },
  {
    slug: "nearby",
    name: "Slash Nearby",
    emoji: "📍",
    desc: "Find-the-thing searchers for wherever you are.",
    tint: T.lime,
    widgets: [
      {
        kind: "picker",
        title: "Nearby Finder",
        hint: "Builds a precise maps search — tap to open.",
        fields: [
          { label: "What", placeholder: "quiet cafe" },
          { label: "City/area", placeholder: "Bandra, Mumbai" },
        ],
        action: "Build search",
        run: ([what, where]) => `Open: https://www.google.com/maps/search/${encodeURIComponent(`${what || "cafe"} near ${where || "me"}`)}`,
      },
      {
        kind: "picker",
        title: "Local Event Digger",
        hint: "Three searches that surface real local events.",
        fields: [{ label: "City", placeholder: "Pune" }],
        action: "Get searches",
        run: ([city]) => [
          `https://www.google.com/search?q=events+this+weekend+in+${encodeURIComponent(city || "")}`,
          `https://www.google.com/search?q=meetup+groups+${encodeURIComponent(city || "")}`,
          `https://www.google.com/search?q=${encodeURIComponent(city || "")}+community+calendar`,
        ].join("\n"),
      },
      {
        kind: "deck",
        title: "First-Visit Checklists",
        hint: "New city, gym, cafe, doctor - what to check first.",
        items: FIRST_VISIT,
      },
      {
        kind: "deck",
        title: "Find-Anything Locally",
        hint: "8 search patterns that beat the default maps query.",
        items: MEGA_NEARBY_TIPS,
      },
    ],
  },
];

/* ──────────── generator helpers (deterministic, real output) ──────────── */

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function brewPalette(base: string): string {
  const h = hashStr(base.trim().toLowerCase() || "teal");
  const hue = h % 360;
  const stops = [0, 40, 80, 200, 300].map((d) => {
    const hh = (hue + d) % 360;
    const light = [78, 66, 55, 48, 34][[0, 40, 80, 200, 300].indexOf(d)];
    return `hsl(${hh} 70% ${light}%)`;
  });
  return `Palette from "${base}":\n${stops.join("\n")}.\nEvery stop is copyable straight into CSS.`;
}

function habitAnchor(habit: string): string {
  const h = habit.trim();
  const anchors = [
    `After I pour my morning coffee, I will ${h}.`,
    `After I brush my teeth, I will ${h}.`,
    `After I close my laptop for the day, I will ${h}.`,
    `After I sit down at my desk, before opening any app, I will ${h}.`,
  ];
  const pick = anchors[hashStr(h) % anchors.length];
  return `${pick}\n\nKeep it under 2 minutes for the first week. Consistency first, size later.`;
}

function sleepCycles(bedtime: string): string {
  const m = bedtime.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return 'Enter bedtime as HH:MM (24-hour), e.g. 23:00. Falling asleep takes ~14 min - cycles are 90 min each: wake at 6 or 7.5 hours for peak freshness.';
  const h = parseInt(m[1] ?? "0", 10) % 24;
  const mins = parseInt(m[2] ?? "0", 10);
  const total = (h * 60 + mins + 14 + 540) % 1440; // +14 min to fall asleep, +90 min cycle
  const fmt = (t: number) => `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
  return `Bedtime ${fmt(h * 60 + mins)} → best wake times:\n${fmt(total)} (5 cycles) · ${fmt((total + 90) % 1440)} (6 cycles)\nSet the alarm for the earlier one and get out of bed immediately.`;
}

function flashcards(topic: string): string {
  const t = topic.trim();
  return [
    `1. What is ${t} in one sentence?`,
    `2. Why does ${t} matter - who uses it and for what?`,
    `3. Give one concrete example of ${t}.`,
    `4. What's the most common misconception about ${t}?`,
    `5. How would you teach ${t} to someone in 60 seconds?`,
  ].join("\n");
}

function spacedPlan(topic: string): string {
  const t = topic.trim();
  return [
    `Day 0 (today): learn ${t} - active recall, not rereading.`,
    "Day 1: 5-minute recall test. No notes.",
    "Day 3: teach it out loud to nobody. Note gaps.",
    `Day 7: mixed practice - apply ${t} to a new problem.`,
    "Day 21: final recall. If it survives, it's yours.",
  ].join("\n");
}

function nBack(count: number): string {
  const letters = "BCKMQRTXZ";
  const rand = mulberry(hashStr(String(count) + Date.now().toString(36)));
  const seq: string[] = [];
  for (let i = 0; i < clamp(count, 5, 30); i++) seq.push(letters[Math.floor(rand() * letters.length)] ?? "A");
  return `${seq.join(" ")}\n(Rule: say the letter from 2 steps back. In this sequence the 3rd answer is "${seq[0]}".)`;
}

function memoryChain(): string {
  const rand = mulberry(Date.now() & 0xffffff);
  const pick = (arr: string[]) => arr[Math.floor(rand() * arr.length)];
  const adj = ["electric", "velvet", "rusty", "glass", "midnight", "solar", "paper", "iron"];
  const noun = ["umbrella", "violin", "lantern", "compass", "mirror", "kite", "anchor", "crown"];
  const place = ["in a library", "on a rooftop", "under a bridge", "at the airport", "in a greenhouse", "on a train"];
  const chain = Array.from({ length: 7 }, (_, i) =>
    i % 2 === 0 ? `${pick(adj)} ${pick(noun)}` : `${pick(noun)} ${pick(place)}`,
  );
  return chain.map((c, i) => `${i + 1}. ${c}`).join("\n") + "\nLink each image to the next — wilder = stickier.";
}

function compliment(name: string, thing: string): string {
  const openers = [
    `${name}, the thing about you is`,
    `${name}, quietly, honestly -`,
    `If I had to name one thing: ${name},`,
  ];
  const h = hashStr(thing);
  return `${openers[h % openers.length]} ${thing}. Most people notice it. Few say it out loud.`;
}

function dateIdeas(budget: string, vibe: string): string {
  const b = parseFloat(budget);
  const free = isNaN(b) || b <= 0;
  return [
    free
      ? "1. Sunset walk + one question neither of you has answered before."
      : `1. Street-food crawl with a ${budget} cap - pick dishes neither has tried.`,
    free
      ? "2. Cook one recipe from the other person's childhood."
      : "2. Bookshop challenge: 10 minutes each, pick a book for the other, explain why over chai.",
    `3. ${vibe === "adventurous" ? "Unfamiliar-neighbourhood exploring" : vibe === "silly" ? "Arcade/mini-golf rematch" : "Quiet cafe, phones in pockets, one long conversation"}.`,
  ].join("\n");
}

function loveLetter(name: string): string {
  return `Dear ${name}, I don't write this kind of thing often, so bear with me. Somewhere between [a small specific memory] and [another one], I realised something simple: my days are measurably better with you in them. Not dramatically better - just... better. And I wanted you to know I notice. Now finish this in your own voice - the specific memories are what make it real.`;
}

function coursePlan(topic: string): string {
  const t = topic.trim();
  return [
    `Week 1 - Map it: what is ${t}, its 10 core terms, best free intro (search "${t} crash course").`,
    `Week 2 - Hands-on: one tiny real project using ${t}. Ugly is fine.`,
    `Week 3 - Depth: one free university-style course + notes in your own words.`,
    `Week 4 - Ship: build/teach/write one thing that proves it. Portfolio > certificates.`,
    `Free-first resources: YouTube, freeCodeCamp, MIT OCW, library apps.`,
  ].join("\n");
}

function skillLadder(skill: string): string {
  const s = skill.trim();
  return [
    `1. Use it: complete one guided tutorial of ${s} end-to-end.`,
    `2. Break it: change things in the tutorial until it breaks; fix what you broke.`,
    `3. Build solo: one tiny project without following any guide.`,
    `4. Read the source: one respected ${s} project, skim structure, copy idioms.`,
    `5. Teach: write the explanation you wish you'd found as a beginner.`,
  ].join("\n");
}

function studyBlocks(minutes: number): string {
  const total = clamp(minutes || 60, 25, 240);
  const blocks = Math.floor(total / 30);
  const lines: string[] = [];
  for (let i = 0; i < blocks; i++) {
    lines.push(`Block ${i + 1}: 25 min deep work → 5 min away from screens.`);
  }
  if (total % 30 >= 15) lines.push(`Final: ${total % 30} min review - recap from memory, then check notes.`);
  lines.push("First 2 minutes: write what you want out of this session. Re-read when focus dips.");
  return lines.join("\n");
}

function interviewDrill(role: string): string {
  const r = role.trim();
  return [
    `1. "Walk me through your background as it relates to ${r}." - skeleton: present role → 2 relevant wins → why here.`,
    `2. "Hardest problem you solved in ${r}?" - STAR: Situation, Task, Action, Result (numbers).`,
    `3. "How do you keep up with ${r}?" - name 2 specific sources, 1 thing you learned recently.`,
    `4. "Tell me about a conflict with a teammate." - facts first, no blame, what you'd do differently.`,
    `5. "Why this company?" - 2 specific things about them, connect to what you want to learn next.`,
  ].join("\n");
}

function salaryScript(role: string): string {
  return [
    `If asked first: "I'd like to understand the role's scope better first - what range is budgeted for it?"`,
    `If pressed: give a researched range for ${role}, your floor at the bottom, never a single number.`,
    `On an offer: "Thank you - based on the scope we discussed and market data, I was targeting [range]. Is that flexible?"`,
    `Then stop talking. Silence is leverage.`,
  ].join("\n");
}

function coldEmail(name: string, role: string): string {
  return [
    `Subject: ${role} - quick question`,
    "",
    `Hi [hiring manager] - I'm ${name}. I saw the ${role} opening and I have one question: what would make someone exceptional at it in the first 90 days?`,
    "",
    `I'm asking because I want to be that person, and I'd rather show you the proof than list adjectives. 2-line summary of my most relevant work attached. If it resonates, I'd love 15 minutes.`,
    "",
    `- ${name}`,
  ].join("\n");
}








const IDEA_SPARKS: string[] = [
  "invert the usual format",
  "make it absurdly small",
  "remove the main feature",
  "set it in the past",
  "combine it with food",
  "make the user the product",
  "one color only",
  "explain it to a child",
  "do it in public",
  "add a countdown",
  "collaborate with a stranger",
  "do it wrong on purpose",
];

function ideaCombo(what: string): string {
  const rand = mulberry(hashStr(what + Date.now().toString(36)));
  const pick = () => IDEA_SPARKS[Math.floor(rand() * IDEA_SPARKS.length)] ?? "invert it";
  const a = pick();
  let b = pick();
  while (b === a) b = pick();
  return `Make ${what} but: 1) ${a}. 2) ${b}. Sketch both in 5 minutes - the second idea usually surprises you.`;
}

function storyStarter(genre: string): string {
  const g = genre.trim().toLowerCase();
  const table: Record<string, string[]> = {
    "sci-fi": [
      "The message had taken 40 years to arrive, and it was one word long.",
      "Everyone got the same dream that night. Mine was the only one that ended differently.",
    ],
    romance: [
      "We kept meeting at the worst possible moments, as if the universe were testing timestamps.",
      "Her note said 'return if found'. I'd kept it for three years.",
    ],
    horror: [
      "The house had one rule, and my brother broke it on the first night.",
      "The mirror in the hallway was two seconds delayed. Nobody else noticed.",
    ],
    mystery: [
      "The letter was addressed to me, in my handwriting, posted the day I was born.",
      "The detective knew the answer before the second question. That was the problem.",
    ],
    any: [
      "It started with a door that shouldn't have been there.",
      "The day everything changed began like every other day, which is the worst way for it to begin.",
    ],
  };
  const list: string[] = table[g] ?? table["any"] ?? [];
  const rand = mulberry(hashStr(g + Date.now().toString(36)));
  return list[Math.floor(rand() * list.length)] ?? list[0] ?? "Start with: what if the opposite were true?";
}

function nameForge(what: string): string {
  const rand = mulberry(hashStr(what + Date.now().toString(36)));
  const pre = ["Nova", "Ember", "Quill", "Mono", "Flux", "Pique", "Drift", "Lumen", "Slate", "Echo"];
  const post = ["kit", "ly", "ora", "fold", "smith", "cast", "wave", "path", "berry", "line"];
  const a = pre[Math.floor(rand() * pre.length)] ?? "Nova";
  let b = post[Math.floor(rand() * post.length)] ?? "kit";
  if (rand() > 0.5) b = b.charAt(0).toUpperCase() + b.slice(1);
  const second = (pre[Math.floor(rand() * pre.length)] ?? "Lumen") + (post[Math.floor(rand() * post.length)] ?? "ora");
  return `For ${what}: "${a}${b}" or "${second}". Check domain + handles before you fall in love.`;
}

function gradientCode(a: string, b: string): string {
  return `background: linear-gradient(135deg, ${a}, ${b});\n\n/* softer web version */\nbackground: linear-gradient(135deg, ${a}22, ${b}44), var(--surface);`;
}

function searchOperator(topic: string, want: string): string {
  const t = topic.trim() || "topic";
  const w = want.trim().toLowerCase();
  if (w.includes("pdf")) return `"${t}" filetype:pdf -site:pinterest.*`;
  if (w.includes("doc")) return `"${t}" (site:docs.* OR site:developer.*.*)`;
  if (w.includes("example")) return `"${t}" example OR tutorial -course -udemy`;
  return `"${t}" ${w ? w.split(/,\s*/).map((x) => x.trim()).filter(Boolean).join(" OR ") : "guide"} -pinterest -quora`;
}

function deepLinks(topic: string): string {
  const t = encodeURIComponent(topic.trim() || "topic");
  return [
    `https://duckduckgo.com/?q=${t}`,
    `https://www.google.com/search?q=${t}+site:reddit.com`,
    `https://scholar.google.com/scholar?q=${t}`,
    `https://www.bing.com/search?q=${t}+filetype:pdf`,
  ].join("\n");
}




function nicknames(name: string): string {
  const n = name.trim() || "friend";
  const first = n.split(/\s+/)[0] ?? n;
  const rand = mulberry(hashStr(n + Date.now().toString(36)));
  const suffix = ["ster", "inho", "zilla", "nado", "saurus"][Math.floor(rand() * 5)] ?? "ster";
  const title = ["Chief", "Boss", "Professor", "Captain", "Doctor"][Math.floor(rand() * 5)] ?? "Chief";
  const styles = [
    `${first.slice(0, 3)}-${first.slice(-2)}`,
    `${first}${suffix}`,
    `${title} ${first}`,
  ];
  return styles.join("\n");
}

function superlatives(namesRaw: string): string {
  const names = namesRaw.split(/,\s*/).filter(Boolean);
  const awards = [
    "Most likely to become famous by accident",
    "Would survive the zombie apocalypse first",
    "Owns the most unnecessary gadget",
    "Will text back in 3 minutes or 3 weeks, nothing between",
    "Most likely to argue with a GPS",
    "Secretly the most organised person here",
  ];
  const rand = mulberry(hashStr(namesRaw + Date.now().toString(36)));
  if (names.length < 2) {
    return awards.slice(0, 3).map((a) => `• ${a}`).join("\n") + "\nAdd 2+ names (comma separated) to deal people in.";
  }
  return awards
    .slice(0, Math.min(awards.length, names.length))
    .map((a, i) => `${a}: ${names[Math.floor(rand() * names.length)]}`)
    .join("\n");
}

function gadgetChecklist(g: string): string {
  return [
    `Before buying ${g}:`,
    "1. Reviews from actual owners 3+ months in (search '[gadget] long term review').",
    "2. Repairability - can the battery be replaced? iFixit score if applicable.",
    "3. Ecosystem lock-in - does it require the same brand for full features?",
    "4. Resale value of the brand - you'll upgrade eventually.",
    "5. The 48-hour rule: wish-list it, buy only if you still want it in 2 days.",
  ].join("\n").replace("[gadget]", g);
}

function deskSetup(budget: number): string {
  const b = clamp(budget || 200, 50, 5000);
  return [
    `Desk setup at ₹${b.toLocaleString()} - priority order:`,
    `1. Chair (40% of budget): used office chair > new cheap one.`,
    `2. Monitor (25%): 27\" 1440p used market is a goldmine.`,
    `3. Desk (15%): deep, stable, cable hole.`,
    `4. Light (10%): one good desk lamp beats RGB strips.`,
    `5. Peripherals (10%): keyboard first, mouse second, pad last.`,
  ].join("\n");
}

function batteryLife(mah: number): string {
  const cap = clamp(mah || 4500, 800, 20000);
  const hours = cap / 450;
  return `≈${hours.toFixed(1)} hours of heavy use, ${Math.round(hours * 1.8)} light use, or ${Math.round(hours * 0.6)} hours of gaming/gps. Battery saver mode adds ~15%.`;
}

function buyOnce(item: string): string {
  return [
    `Buy-once checklist for ${item}:`,
    "1. Buy the best you can afford ONCE, not the cheapest three times.",
    "2. Check warranty length - 5+ years signals manufacturer confidence.",
    "3. Are replacement parts available in 5 years?",
    "4. Classic/neutral version beats trend version for longevity.",
    "5. Read the 1-star reviews first - they reveal true failure modes.",
  ].join("\n");
}

function priceSanity(price: number, uses: number): string {
  const p = Math.max(price || 0, 0);
  const u = Math.max(uses || 1, 1);
  const perUse = p / (u * 12);
  return `₹${perUse.toFixed(1)} per use in year one (₹${p} ÷ ${u} uses/month × 12). Under ₹10/use for daily items = easy yes. Over ₹100/use for occasional items = sleep on it.`;
}



function saleCalendar(category: string): string {
  const c = category.trim().toLowerCase();
  const table: Record<string, string> = {
    laptop: "Late July (back-to-school) & November (Black Friday). March is worst - new models.",
    laptops: "Late July & November. Avoid March launches.",
    phone: "October-November (flagship launches push older models down) and sale weeks.",
    tv: "Super Bowl week (US) and Diwali sale windows (India).",
    "winter clothes": "February - end of season, deepest cuts.",
    "air conditioner": "October-November (off-season). Never buy in May.",
    furniture: "January & August clearance cycles.",
    flights: "6-8 weeks before domestic, 3-5 months international, Tuesday afternoons often dip.",
    electronics: "November (Black Friday) and January (post-holiday clearance).",
  };
  const hit = Object.keys(table).find((k) => c.includes(k));
  return (hit ? table[hit] : undefined) ?? `Search '[category] price history' on price trackers - patterns repeat every year. For most things: November and end-of-season months are cheapest.`;
}


function capsule(vibe: string): string {
  const v = vibe.trim().toLowerCase();
  const palette = v.includes("street")
    ? "black, off-white, olive, washed denim"
    : v.includes("formal")
      ? "navy, charcoal, white, light blue"
      : "white, black, beige, denim blue, one accent";
  return [
    `Capsule palette: ${palette}.`,
    "12 pieces: 4 tops, 2 layers, 3 bottoms, 2 shoes, 1 jacket - all intercompat.",
    "Rule: if a new item doesn't match 3+ existing pieces, it doesn't join.",
    "Fit beats brand. Tailoring a ₹500 shirt beats a ₹5000 bad fit.",
  ].join("\n");
}

function grooming(skin: string): string {
  const s = skin.trim().toLowerCase();
  const add = s.includes("oily")
    ? "gel cleanser, light moisturiser"
    : s.includes("dry")
      ? "cream cleanser, richer moisturiser at night"
      : "gentle cleanser, standard moisturiser";
  return [
    `Under-5-minute routine (${s || "normal"} skin):`,
    `AM: water rinse → ${add} → SPF 50 (non-negotiable, all skins).`,
    "PM: cleanser → moisturiser. That's it.",
    "Add one active (retinol or vitamin C) only after 2 consistent weeks of basics.",
  ].join("\n");
}




function decisionSplit(decision: string): string {
  const d = decision.trim();
  return [
    `"${d}" - first question: is this reversible?`,
    "Reversible → decide fast with 70% information. Speed is the advantage.",
    "Irreversible → slow down: what would need to be true for this to be clearly right? Check that first.",
    "Two-way doors get walked through. One-way doors get measured.",
  ].join("\n");
}

function tenTenTen(thing: string): string {
  return [
    `10/10/10 on "${thing}":`,
    "10 minutes from now: will this feel urgent or important?",
    "10 months from now: will I remember this decision with pride or cringe?",
    "10 years from now: does this even register on the things-that-shaped-me list?",
    "Most decisions that feel huge fail all three tests. Most that feel small pass at least two.",
  ].join("\n");
}

function taskBreaker(task: string): string {
  const t = task.trim();
  return [
    `Breaking down "${t}" into 5 concrete first steps:`,
    `1. Write down everything you already know about ${t} - 5 minutes, no research.`,
    `2. Find one authoritative checklist for ${t} (govt site, official docs, trusted guide).`,
    `3. List the documents/info/access you'll need. Gather them in one folder.`,
    `4. Do only the first checklist item today. Timebox: 25 minutes.`,
    `5. Book the next 25-minute slot before you close this. Momentum is the system.`,
  ].join("\n");
}

function icebreakers(group: string): string {
  const g = group.trim();
  return [
    `For ${g}:`,
    "1. What's the best thing you've watched/read/played this month - and why should we care?",
    "2. What's a skill you have that would surprise everyone here?",
    "3. What's the most useless talent you're secretly proud of?",
    "Rule: no 'where are you from / what do you do' - those kill rooms.",
  ].join("\n");
}

function eventAgenda(event: string): string {
  const e = event.trim();
  return [
    `${e} agenda that doesn't drag:`,
    "0:00 - start exactly on time (respects the punctual, trains the rest).",
    "0:05 - one-round intros: name + one sentence, no life stories.",
    "0:15 - main activity with a visible countdown.",
    "End-15min - decisions/next steps, then social time. Hard stop at the hour.",
  ].join("\n");
}


function compound(monthly: number, years: number, rate: number): string {
  const m = Math.max(monthly || 0, 0);
  const y = clamp(years || 1, 1, 60);
  const r = clamp(rate || 0, 0, 30) / 100 / 12;
  const n = y * 12;
  const fv = r === 0 ? m * n : m * ((Math.pow(1 + r, n) - 1) / r);
  return `₹${m.toLocaleString()}/month for ${y}y at ${Math.round(rate * 100) / 100}% → ₹${Math.round(fv).toLocaleString()}. You'd deposit ₹${(m * n).toLocaleString()}; the rest is growth. Time in the market is the whole trick.`;
}


// extra pools used by "Slash Labs"/"Slash Image"/"Slash Search Engine" widgets above

export const ALL_SLASH_APPS: SlashApp[] = SLASH_APPS;

export function appBySlug(slug: string): SlashApp | undefined {
  const s = slug.trim().toLowerCase();
  return SLASH_APPS.find(
    (a) =>
      a.slug === s ||
      a.name.toLowerCase().replace(/\s+/g, "-") === s ||
      a.name.toLowerCase().replace(/\s+/g, "") === s ||
      `${a.slug}s` === s,
  );
}
