/**
 * SlashBar categories — the single hub for the whole site.
 *
 * SlashBar used to be a launcher: 27 tiles, most of which were a `link` to some
 * other page and carried no content of their own, sitting next to a separate
 * "Hubs" section that duplicated the same job. This collapses the two.
 *
 * A category here is not a filter over one table. It is an index over every
 * content type SlashAI has — commands, tools, games, articles, resources and
 * SlashBar apps — so that "Islam" is not a list of links to a few tools, it is
 * every command, tool, game, guide and resource in the catalogue that actually
 * has something to do with Islam.
 *
 * Two rules govern the matching, and both exist so a count on screen is always
 * a count of real rows:
 *
 *   1. Nothing is generated. A command lands in a category because one of its
 *      own catalogued fields (category, subcategory, tag, title, description)
 *      contains one of that category's keywords. A resource lands there because
 *      its `audience` array names the audience, or because it is in that hub's
 *      dedicated list.
 *   2. A category with no matches for a content type renders no section for
 *      it. There is no "coming soon" and no filler row, so the counts on a
 *      category page always add up to something that exists.
 */
import { COMMANDS, type SlashCommand } from "@/lib/commands";
import { ALL_SLASH_TOOLS } from "@/lib/slashkits";
import { DECLARATIVE_TOOLS } from "@/lib/toolkit/catalog";
import { ALL_PLAY_GAMES } from "@/lib/slashplay";
import { ALL_BLOG_POSTS } from "@/lib/blog-guides";
import { RESOURCES, type Resource } from "@/lib/resources";
import { ALL_SLASH_APPS, type SlashApp } from "@/lib/slashbar";
import { FOUNDERS_RESOURCES } from "@/lib/hub-founders";
import { INDIA_RESOURCES } from "@/lib/hub-india";
import { FINANCE_RESOURCES } from "@/lib/hub-finance";
import { HEALTH_RESOURCES } from "@/lib/hub-health";
import { ISLAM_RESOURCES, ISLAM_SECTIONS, type IslamResource } from "@/lib/hub-islam";
import { URDU_RESOURCES, type UrduResource } from "@/lib/hub-urdu";
import {
  ARABIC_ALPHABET,
  ARABIC_PHRASES,
  ARABIC_RESOURCES,
  type ArabicLetter,
  type ArabicPhrase,
  type ArabicResource,
} from "@/lib/hub-arabic";
import { FUN_SITES, type FunSite } from "@/lib/hub-fun";
import { QUOTES, type SlashQuote } from "@/lib/hub-quotes";

export { ISLAM_SECTIONS, ARABIC_ALPHABET, ARABIC_PHRASES, QUOTES };
export type {
  IslamResource,
  UrduResource,
  ArabicResource,
  ArabicLetter,
  ArabicPhrase,
  FunSite,
  SlashQuote,
};

/* ─────────────────────────────── the categories ─────────────────────────────── */

export interface SlashCategoryDef {
  slug: string;
  name: string;
  emoji: string;
  desc: string;
  /** tile hue, used for the glow on the category card */
  hue: number;
  /** values matched against Resource.audience */
  audiences: string[];
  /** a dedicated resource list, for the hubs that never used `audience` */
  dedicated?: "founders" | "india" | "finance" | "health";
  /**
   * Curated lists that were defined inline inside the old hub route and are not
   * in the main resource catalogue. These are the reason the hub routes had to
   * be extracted before they could be redirected.
   */
  curated?: "islam" | "urdu" | "arabic" | "fun" | "quotes";
  /** exact command category names from the 45 in the catalogue */
  commandCategories?: string[];
  /**
   * Free-text keywords. Matched case-insensitively as whole words against the
   * real fields listed per content type below. Keep them specific: a bare word
   * like "app" or "tool" would drag in most of the catalogue.
   */
  keywords: string[];
  /** SlashBar app slugs that belong in this category */
  apps?: string[];
  /**
   * The whole game library belongs to this category. Used by "fun" only: all
   * 96 games are entertainment, and keyword-matching them put only 4 in the one
   * category that exists to list them.
   */
  includeAllGames?: boolean;
}

const DEDICATED_LISTS: Record<
  NonNullable<SlashCategoryDef["dedicated"]>,
  { id: string; name: string; desc: string; url: string }[]
> = {
  founders: FOUNDERS_RESOURCES as never,
  india: INDIA_RESOURCES as never,
  finance: FINANCE_RESOURCES as never,
  health: HEALTH_RESOURCES as never,
};

/** Curated lists, normalised to the same loose shape as the other resources. */
const CURATED_LISTS: Record<NonNullable<SlashCategoryDef["curated"]>, unknown[]> = {
  islam: ISLAM_RESOURCES,
  urdu: URDU_RESOURCES,
  arabic: ARABIC_RESOURCES,
  fun: FUN_SITES,
  quotes: QUOTES,
};

export const SLASH_CATEGORIES: SlashCategoryDef[] = [
  {
    slug: "students",
    name: "Students",
    emoji: "🎓",
    desc: "Study, revision, exams and coursework — plus the tools that make them faster.",
    hue: 200,
    audiences: ["Students", "Teachers"],
    commandCategories: ["Learning & Education"],
    keywords: [
      "student",
      "study",
      "revision",
      "exam",
      "homework",
      "assignment",
      "essay",
      "thesis",
      "notes",
      "flashcard",
      "quiz",
      "course",
      "tutor",
      "learn",
      "school",
      "university",
      "textbook",
      "summarise",
      "summarize",
      "explain",
    ],
    apps: ["learning", "courses"],
  },
  {
    slug: "developers",
    name: "Developers",
    emoji: "💻",
    desc: "Code, APIs, databases and cloud — commands and tools for shipping software.",
    hue: 160,
    audiences: ["Developers", "Researchers"],
    commandCategories: [
      "Coding & Development",
      "Backend & APIs",
      "DevOps & Cloud",
      "Databases & SQL",
      "Testing & QA",
      "Data & Analytics",
    ],
    keywords: [
      "code",
      "coding",
      "api",
      "sql",
      "database",
      "regex",
      "debug",
      "bug",
      "compile",
      "terminal",
      "bash",
      "git",
      "github",
      "devops",
      "cloud",
      "docker",
      "kubernetes",
      "function",
      "class",
      "python",
      "javascript",
      "typescript",
      "react",
      "server",
      "deploy",
      "test",
      "algorithm",
    ],
    apps: ["labs", "simulator"],
  },
  {
    slug: "creators",
    name: "Creators",
    emoji: "🎨",
    desc: "Images, video, voice and social — everything for making and publishing things.",
    hue: 320,
    audiences: ["Creators"],
    commandCategories: [
      "Design & Creative",
      "Image & Vision",
      "Video",
      "Audio & Speech",
      "Content & Social Media",
      "Social & Community",
      "Events & Community",
    ],
    keywords: [
      "image",
      "photo",
      "video",
      "audio",
      "voice",
      "podcast",
      "design",
      "logo",
      "thumbnail",
      "caption",
      "instagram",
      "youtube",
      "tiktok",
      "reel",
      "content",
      "creator",
      "edit",
      "render",
      "screenshot",
      "meme",
      "storyboard",
    ],
    apps: ["create", "image", "speak", "slashgram", "gadgets"],
  },
  {
    slug: "professionals",
    name: "Professionals",
    emoji: "💼",
    desc: "Email, meetings, reports and the admin that eats a working day.",
    hue: 250,
    audiences: ["Professionals", "Everyone"],
    commandCategories: [
      "Business & Management",
      "Productivity",
      "Writing & Communication",
      "Quality & Performance",
      "Analytics & Reporting",
      "Spreadsheets",
      "HR & Hiring",
    ],
    keywords: [
      "email",
      "meeting",
      "minutes",
      "report",
      "presentation",
      "agenda",
      "proposal",
      "memo",
      "spreadsheet",
      "excel",
      "calendar",
      "workflow",
      "sop",
      "checklist",
      "handover",
      "standup",
      "kpi",
      "okr",
    ],
    apps: ["how-to-zone", "thinks"],
  },
  {
    slug: "founders",
    name: "Founders",
    emoji: "🚀",
    desc: "Idea to revenue: validating, building, pitching and getting funded.",
    hue: 15,
    audiences: ["Entrepreneurs"],
    dedicated: "founders",
    commandCategories: ["Business & Management", "Ecommerce & Retail", "Sales & CRM"],
    keywords: [
      "startup",
      "founder",
      "pitch",
      "investor",
      "funding",
      "validate",
      "product-market",
      "mvp",
      "revenue",
      "runway",
      "churn",
      "saas",
      "business model",
    ],
    apps: ["mini-store", "shopping", "offers"],
  },
  {
    slug: "india",
    name: "India",
    emoji: "🇮🇳",
    desc: "Free tools, courses and APIs built for and available in India.",
    hue: 130,
    audiences: ["Everyone"],
    dedicated: "india",
    keywords: [
      "india",
      "indian",
      "rupee",
      "upi",
      "gst",
      "hiring",
      "iit",
      "delhi",
      "mumbai",
      "bangalore",
      "bengaluru",
      "hyderabad",
      "chennai",
      "pune",
      "hindi",
      "diwali",
      "ipl",
      "cricket",
    ],
    apps: [],
  },
  {
    slug: "islam",
    name: "Islam",
    emoji: "🕌",
    desc: "Quran, hadith, prayer times, duas and halal finance — in one place.",
    hue: 165,
    audiences: [],
    curated: "islam",
    commandCategories: [],
    keywords: [
      "quran",
      "qur'an",
      "hadith",
      "sura",
      "surah",
      "ayah",
      "dua",
      "duas",
      "prayer",
      "salah",
      "namaz",
      "mosque",
      "islam",
      "islamic",
      "muslim",
      "ramadan",
      "ramzan",
      "hijri",
      "hijrah",
      "muharram",
      "tasbeeh",
      "wudu",
      "adhan",
      "qibla",
      "kaaba",
      "sunnah",
      "shariah",
      "zakat",
      "sadaqah",
    ],
    apps: ["nearby"],
  },
  {
    slug: "urdu",
    name: "Urdu",
    emoji: "📜",
    desc: "Urdu poetry, fonts, dictionaries and learning material.",
    hue: 300,
    audiences: [],
    curated: "urdu",
    keywords: [
      "urdu",
      "shayari",
      "poetry",
      "poem",
      "ghazal",
      "shaayari",
      "sher",
      "shayari",
      "bollywood",
      "hindi",
      "devanagari",
      "nastaliq",
    ],
    apps: [],
  },
  {
    slug: "arabic",
    name: "Arabic",
    emoji: "🅰️",
    desc: "The alphabet, keyboard, phrases and courses for learning Arabic.",
    hue: 95,
    audiences: [],
    curated: "arabic",
    // Deliberately narrow. "letter", "keyboard", "translate" and "phrase" on
    // their own pulled 131 unrelated commands into this category.
    keywords: [
      "arabic",
      "alphabet",
      "phonetic",
      "pronunciation",
      "nastaliq",
      "conjugate",
      "arabic keyboard",
      "alif",
      "msa",
      "transliteration",
    ],
    apps: [],
  },
  {
    slug: "designers",
    name: "Designers",
    emoji: "🖌️",
    desc: "Colour, type, layout and design systems that actually work.",
    hue: 340,
    audiences: ["Designers"],
    commandCategories: ["Design & Creative", "Web & Frontend"],
    keywords: [
      "design",
      "colour",
      "color",
      "palette",
      "typography",
      "font",
      "logo",
      "wireframe",
      "mockup",
      "figma",
      "ui",
      "ux",
      "layout",
      "gradient",
      "contrast",
      "accessibility",
    ],
    apps: ["image", "create"],
  },
  {
    slug: "fun",
    name: "Fun",
    emoji: "🎉",
    desc: "Games, jokes, brain teasers and gloriously pointless things.",
    hue: 55,
    audiences: [],
    curated: "fun",
    includeAllGames: true,
    keywords: [
      "game",
      "quiz",
      "joke",
      "riddle",
      "puzzle",
      "meme",
      "trivia",
      "brain teaser",
      "funny",
      "lol",
      "party",
      "useless",
      "weird",
      "random",
    ],
    apps: ["fun", "brain-boosters", "life-hacks", "facts"],
  },
  {
    slug: "finance",
    name: "Finance",
    emoji: "💰",
    desc: "Money, markets, tax and the calculators nobody else gets right.",
    hue: 145,
    audiences: [],
    dedicated: "finance",
    commandCategories: ["Money & Finance"],
    keywords: [
      "money",
      "finance",
      "financial",
      "invest",
      "investment",
      "stock",
      "crypto",
      "bitcoin",
      "trading",
      "tax",
      "gst",
      "vat",
      "emi",
      "loan",
      "interest",
      "budget",
      "salary",
      "invoice",
      "expense",
      "profit",
      "bank",
    ],
    apps: ["shopping", "offers"],
  },
  {
    slug: "health",
    name: "Health",
    emoji: "🩺",
    desc: "Fitness, nutrition, sleep and wellbeing — evidence, not hype.",
    hue: 175,
    audiences: [],
    dedicated: "health",
    commandCategories: ["Health & Wellbeing"],
    keywords: [
      "health",
      "fitness",
      "workout",
      "exercise",
      "nutrition",
      "diet",
      "calorie",
      "protein",
      "sleep",
      "water",
      "weight",
      "bmi",
      "meditation",
      "mindfulness",
      "anxiety",
      "posture",
      "stretch",
      "yoga",
    ],
    apps: ["life-hacks"],
  },
  {
    slug: "quotes",
    name: "Quotes",
    emoji: "💬",
    desc: "Sayings worth keeping, from the people who actually said them.",
    hue: 275,
    audiences: [],
    curated: "quotes",
    keywords: [
      "quote",
      "quotes",
      "saying",
      "proverb",
      "idiom",
      "citation",
      "attributed",
      "motivational",
      "inspiration",
    ],
    apps: ["romantic", "thinks"],
  },
];

/* ─────────────────────────────── matching ─────────────────────────────── */

/** Whole-word, case-insensitive match of any keyword in a haystack. */
function matches(haystack: string, keywords: string[]): boolean {
  if (!haystack) return false;
  const text = ` ${haystack.toLowerCase()} `;
  return keywords.some((k) => {
    const needle = k.trim().toLowerCase();
    if (!needle) return false;
    // Multi-word keywords match as a phrase; single words need a word boundary
    // so "ai" cannot match "email" and "test" cannot match "contest".
    if (needle.includes(" ")) return text.includes(needle);
    return new RegExp(
      `(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`,
    ).test(text);
  });
}

/* ─────────────────────── the content types, normalised ─────────────────────── */

export interface SlashToolRef {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  href: string;
}

export interface SlashGameRef {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  href: string;
}

export interface SlashArticleRef {
  slug: string;
  title: string;
  desc: string;
  emoji: string;
  tag: string;
  readTime: string;
  href: string;
}

const TOOLS: SlashToolRef[] = [
  ...ALL_SLASH_TOOLS.map((t) => ({
    slug: t.slug,
    name: t.name,
    desc: t.desc,
    icon: t.icon,
    href: `/tools/${t.slug}`,
  })),
  ...DECLARATIVE_TOOLS.map((t) => ({
    slug: t.slug,
    name: t.name,
    desc: t.desc,
    icon: t.icon,
    href: `/tools/${t.slug}`,
  })),
];

const GAMES: SlashGameRef[] = ALL_PLAY_GAMES.map((g) => ({
  slug: g.slug,
  name: g.name,
  desc: g.desc,
  icon: g.icon,
  href: `/play/${g.slug}`,
}));

const ARTICLES: SlashArticleRef[] = ALL_BLOG_POSTS.map((p) => ({
  slug: p.slug,
  title: p.title,
  desc: p.desc,
  emoji: p.emoji,
  tag: p.tag,
  readTime: p.readTime,
  href: `/blog/${p.slug}`,
}));

/* ─────────────────────────────── the index ─────────────────────────────── */

/**
 * Every resource shape in the catalogue normalised to one renderable row.
 *
 * The main catalogue, the four dedicated hub lists and the five extracted
 * curated lists all describe a link slightly differently — some use
 * `description`, some `desc`; some carry an emoji, some an icon. Normalising
 * here means the category page has exactly one card component instead of six.
 */
export interface SlashResourceRef {
  key: string;
  name: string;
  desc: string;
  url: string;
  emoji: string;
  category: string;
  /**
   * Where the row came from. "dedicated" and "curated" are the lists that were
   * written by hand for a specific audience; "catalogue" is the main resource
   * table, which is matched by keyword and is therefore weaker evidence.
   */
  source: "catalogue" | "curated" | "dedicated";
}

export interface CategoryContents {
  def: SlashCategoryDef;
  commands: SlashCommand[];
  tools: SlashToolRef[];
  games: SlashGameRef[];
  articles: SlashArticleRef[];
  resources: SlashResourceRef[];
  /** quotes are not links, so they get their own bucket */
  quotes: SlashQuote[];
  apps: SlashApp[];
  /** real row counts, used for the tiles and the page copy */
  counts: {
    commands: number;
    tools: number;
    games: number;
    articles: number;
    resources: number;
    quotes: number;
    apps: number;
    total: number;
  };
}

const cache = new Map<string, CategoryContents>();

/** Curated entries are not Resource-shaped; pull a link row out of one. */
function normaliseCurated(
  raw: unknown,
  source: SlashResourceRef["source"],
): SlashResourceRef | null {
  const r = raw as Record<string, unknown>;
  const url = typeof r["url"] === "string" ? r["url"] : "";
  // Quotes have no url; they are rendered separately, not as dead links.
  if (!url) return null;
  const name = String(r["name"] ?? r["title"] ?? "");
  if (!name) return null;
  const desc = String(r["desc"] ?? r["description"] ?? "");
  return {
    // Keyed by url alone so one link can never be rendered twice, even when it
    // appears in two different source lists.
    key: url,
    name,
    desc,
    url,
    emoji: String(r["emoji"] ?? r["icon"] ?? "🔗"),
    category: String(r["category"] ?? ""),
    source,
  };
}

function build(def: SlashCategoryDef): CategoryContents {
  const k = def.keywords;
  const catNames = new Set((def.commandCategories ?? []).map((c) => c.toLowerCase()));

  const commands = COMMANDS.filter(
    (c) =>
      catNames.has(c.category.toLowerCase()) ||
      matches(`${c.category} ${c.subcategory} ${c.title} ${c.description}`, k) ||
      matches(c.tags.join(" "), k),
  );

  const tools = TOOLS.filter((t) => matches(`${t.name} ${t.desc}`, k));

  const games = def.includeAllGames
    ? GAMES
    : GAMES.filter((g) => matches(`${g.name} ${g.desc}`, k));

  const articles = ARTICLES.filter((a) => matches(`${a.title} ${a.desc} ${a.tag}`, k));

  // Resources use their own `audience` array as the primary signal, which is
  // stronger than keyword matching, then fall back to the dedicated list and
  // finally to keywords for the hubs that predate the audience field.
  const byAudience = RESOURCES.filter((r) =>
    (r.audience ?? []).some((a) =>
      def.audiences.some((want) => want.toLowerCase() === a.toLowerCase()),
    ),
  );
  const dedicated = def.dedicated ? DEDICATED_LISTS[def.dedicated] : [];
  const curatedRaw = def.curated ? (CURATED_LISTS[def.curated] as unknown[]) : [];
  const byKeyword = RESOURCES.filter(
    (r) =>
      !byAudience.includes(r) &&
      !dedicated.some((d) => d.id === r.id) &&
      matches(`${r.name} ${r.description} ${r.tags?.join(" ") ?? ""}`, k),
  );

  // Curated rows first for these categories: they were hand-picked for exactly
  // this audience, so they lead, and the keyword-matched tail follows.
  const curatedRows = curatedRaw
    .map((r) => normaliseCurated(r, "curated"))
    .filter((r): r is SlashResourceRef => r !== null);
  const dedicatedRows = dedicated
    .map((r) => normaliseCurated(r, "dedicated"))
    .filter((r): r is SlashResourceRef => r !== null);

  // De-duplicate by URL, not by (source, url). The same link can sit in both a
  // hand-written list and the main catalogue - Aladhan is in both - and keying
  // on the source would have rendered it twice.
  const deduped = new Map<string, SlashResourceRef>();
  for (const row of [
    ...curatedRows,
    ...dedicatedRows,
    ...byAudience.map((r) => catalogueRow(r)),
    ...byKeyword.map((r) => catalogueRow(r)),
  ]) {
    if (!deduped.has(row.key)) deduped.set(row.key, row);
  }
  const resources = [...deduped.values()];

  const quotes = def.curated === "quotes" ? (QUOTES as SlashQuote[]) : [];

  const apps = def.apps?.length ? ALL_SLASH_APPS.filter((a) => def.apps?.includes(a.slug)) : [];

  return {
    def,
    commands,
    tools,
    games,
    articles,
    resources,
    quotes,
    apps,
    counts: {
      commands: commands.length,
      tools: tools.length,
      games: games.length,
      articles: articles.length,
      resources: resources.length,
      quotes: quotes.length,
      apps: apps.length,
      total:
        commands.length +
        tools.length +
        games.length +
        articles.length +
        resources.length +
        quotes.length +
        apps.length,
    },
  };
}

/** A row from the main catalogue, in the same shape as a curated one. */
function catalogueRow(r: Resource): SlashResourceRef {
  return {
    key: r.url,
    name: r.name,
    desc: r.description,
    url: r.url,
    emoji: "🔗",
    category: r.category,
    source: "catalogue",
  };
}

/** Everything in one category. Memoised, because the matcher is O(catalogue). */
export function categoryContents(slug: string): CategoryContents | null {
  const def = SLASH_CATEGORIES.find((c) => c.slug === slug);
  if (!def) return null;
  const hit = cache.get(slug);
  if (hit) return hit;
  const built = build(def);
  cache.set(slug, built);
  return built;
}

export function categoryBySlug(slug: string): SlashCategoryDef | undefined {
  return SLASH_CATEGORIES.find((c) => c.slug === slug);
}

/** Every category with its real total, for the launcher grid. */
export function categorySummaries(): {
  def: SlashCategoryDef;
  total: number;
  counts: CategoryContents["counts"];
}[] {
  return SLASH_CATEGORIES.map((def) => {
    const c = categoryContents(def.slug) as CategoryContents;
    return { def, total: c.counts.total, counts: c.counts };
  });
}

export const SLASH_CATEGORY_COUNT = SLASH_CATEGORIES.length;

/**
 * Old hub slug -> SlashBar category. `/hub/islam` becomes `/slashbar/islam`, so
 * the indexed hub URLs keep their equity instead of 404ing.
 */
export const HUB_REDIRECTS: Record<string, string> = {
  students: "students",
  developers: "developers",
  creators: "creators",
  professionals: "professionals",
  founders: "founders",
  india: "india",
  islam: "islam",
  urdu: "urdu",
  arabic: "arabic",
  designers: "designers",
  fun: "fun",
  finance: "finance",
  health: "health",
  quotes: "quotes",
};

/** Section titles for the category page, in the order they should appear. */
export const CONTENT_SECTIONS = [
  { key: "commands", label: "Slash commands", emoji: "⚡", blurb: "Copy and paste, ready to go." },
  { key: "tools", label: "Tools", emoji: "🧰", blurb: "Free, in your browser, nothing uploaded." },
  {
    key: "articles",
    label: "Guides & articles",
    emoji: "📚",
    blurb: "Written guides, free to read.",
  },
  { key: "resources", label: "Resources", emoji: "📦", blurb: "Hand-checked external links." },
  { key: "quotes", label: "Quotes", emoji: "💬", blurb: "Attributed to who actually said them." },
  { key: "games", label: "Games", emoji: "🎮", blurb: "Play in the browser, no download." },
  {
    key: "apps",
    label: "SlashBar apps",
    emoji: "⚡",
    blurb: "Interactive tools built into SlashAI.",
  },
] as const;
