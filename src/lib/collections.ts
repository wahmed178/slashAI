import { COMMANDS, type SlashCommand } from "./commands";

/**
 * Curated, use-case oriented discovery layer.
 *
 * Collections NEVER duplicate command records — each one is a *selector* over
 * the existing catalog and is resolved to real command ids at module load.
 * A command can appear in several collections. Collections are optional
 * discovery paths: every collection is open to every user.
 */
export interface CollectionDef {
  id: string;
  title: string;
  blurb: string;
  icon: string;
  /** interest ids (see INTERESTS) used by the optional "For you" surface */
  interests: string[];
  categories?: string[];
  subcategories?: string[];
  tags?: string[];
  keywords?: RegExp;
}

export const INTERESTS: { id: string; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "study", label: "Study" },
  { id: "fitness", label: "Fitness" },
  { id: "fashion", label: "Fashion" },
  { id: "gaming", label: "Gaming" },
  { id: "business", label: "Business" },
  { id: "content", label: "Content" },
  { id: "travel", label: "Travel" },
  { id: "technology", label: "Technology" },
  { id: "lifestyle", label: "Lifestyle" },
];

const DEFS: CollectionDef[] = [
  {
    id: "for-women",
    title: "For Women",
    blurb: "A lifestyle mix — wellbeing, style, home and career commands.",
    icon: "Sparkles",
    interests: ["lifestyle", "fashion", "fitness", "work"],
    categories: ["Health & Wellbeing", "Home & Everyday"],
    subcategories: ["Moodboards", "Color", "Retouch", "Personal Brand", "Routines", "Habits"],
  },
  {
    id: "for-men",
    title: "For Men",
    blurb: "A lifestyle mix — fitness, finances, home projects and career.",
    icon: "Sparkles",
    interests: ["lifestyle", "fitness", "work", "business"],
    categories: ["Health & Wellbeing", "Money & Finance"],
    subcategories: ["Routines", "Habits", "Estimates", "Troubleshooting", "Personal Brand"],
  },
  {
    id: "for-students",
    title: "For Students",
    blurb: "Study smarter: explainers, flashcards, practice and research.",
    icon: "GraduationCap",
    interests: ["study"],
    categories: ["Learning & Education", "Math & Science"],
    subcategories: ["Deep Research", "Glossaries"],
  },
  {
    id: "for-creators",
    title: "For Creators",
    blurb: "Scripts, hooks, thumbnails, edits and repurposing.",
    icon: "Clapperboard",
    interests: ["content"],
    categories: ["Video", "Social & Community"],
    subcategories: ["Moodboards", "Thumbnails", "Hooks"],
  },
  {
    id: "for-professionals",
    title: "For Professionals",
    blurb: "Meetings, writing, planning and everyday desk work.",
    icon: "Briefcase",
    interests: ["work"],
    categories: ["Productivity", "Writing & Communication"],
    subcategories: ["Recaps", "Follow-ups"],
  },
  {
    id: "for-entrepreneurs",
    title: "For Entrepreneurs",
    blurb: "Positioning, pricing, launches and lean operations.",
    icon: "Megaphone",
    interests: ["business"],
    categories: ["Business & Management", "Marketing & SEO"],
    subcategories: ["Budgeting", "Decisions"],
  },
  {
    id: "work-career",
    title: "Work & Career",
    blurb: "CVs, interviews, negotiation and growth conversations.",
    icon: "UserRound",
    interests: ["work"],
    categories: ["Career"],
    subcategories: ["Delegation", "Prioritization"],
  },
  {
    id: "study-learning",
    title: "Study & Learning",
    blurb: "Break down hard topics and remember them longer.",
    icon: "GraduationCap",
    interests: ["study"],
    categories: ["Learning & Education"],
    subcategories: ["Explanation", "Analogies"],
  },
  {
    id: "social-content",
    title: "Social & Content",
    blurb: "Posts, captions, hooks and repurposing across platforms.",
    icon: "Users",
    interests: ["content"],
    categories: ["Social & Community"],
    subcategories: ["Copywriting", "Repurposing", "Hooks"],
  },
  {
    id: "fashion-style",
    title: "Fashion & Style",
    blurb: "Colour, styling, moodboards and product photography.",
    icon: "Palette",
    interests: ["fashion"],
    subcategories: ["Moodboards", "Color", "Style Transfer", "Retouch", "Type"],
    tags: ["style", "branding", "portrait"],
  },
  {
    id: "beauty-lifestyle",
    title: "Beauty & Lifestyle",
    blurb: "Routines, self-care planning and everyday polish.",
    icon: "HeartPulse",
    interests: ["lifestyle"],
    subcategories: ["Routines", "Habits", "Retouch", "Organising"],
  },
  {
    id: "fitness",
    title: "Fitness",
    blurb: "Training plans, habit tracking and progress reviews.",
    icon: "HeartPulse",
    interests: ["fitness"],
    categories: ["Health & Wellbeing"],
    tags: ["fitness", "health"],
  },
  {
    id: "travel",
    title: "Travel",
    blurb: "Itineraries, packing, budgets and local phrases.",
    icon: "Compass",
    interests: ["travel"],
    categories: ["Travel & Local"],
  },
  {
    id: "gaming",
    title: "Gaming",
    blurb: "Game ideas, streaming prep and community posts.",
    icon: "Zap",
    interests: ["gaming"],
    keywords: /\b(game|gaming|stream|twitch|esports|player)\b/i,
  },
  {
    id: "home-everyday",
    title: "Home & Everyday",
    blurb: "Chores, repairs, letters and household planning.",
    icon: "House",
    interests: ["lifestyle"],
    categories: ["Home & Everyday"],
  },
  {
    id: "tech-coding",
    title: "Tech & Coding",
    blurb: "Reviews, debugging, regex, tests and refactors.",
    icon: "Code2",
    interests: ["technology"],
    categories: ["Coding & Development", "Automation & Workflows"],
  },
];

const MAX_PER_COLLECTION = 48;
const MIN_PER_COLLECTION = 6;

function resolve(def: CollectionDef): string[] {
  const cats = new Set(def.categories ?? []);
  const subs = new Set(def.subcategories ?? []);
  const tags = new Set(def.tags ?? []);
  return COMMANDS.filter((c) => {
    if (cats.has(c.category)) return true;
    if (subs.has(c.subcategory)) return true;
    if (c.tags.some((t) => tags.has(t))) return true;
    if (def.keywords?.test(`${c.title} ${c.description} ${c.tags.join(" ")}`)) return true;
    return false;
  })
    .sort((a, b) => b.popularity - a.popularity || a.command.localeCompare(b.command))
    .slice(0, MAX_PER_COLLECTION)
    .map((c) => c.id);
}

export interface Collection extends CollectionDef {
  commandIds: string[];
  count: number;
}

export const COLLECTIONS: Collection[] = DEFS.map((def) => {
  const commandIds = resolve(def);
  return { ...def, commandIds, count: commandIds.length };
}).filter((c) => c.count >= MIN_PER_COLLECTION);

const byId = new Map(COLLECTIONS.map((c) => [c.id, c]));

export const getCollection = (id: string | undefined) => (id ? byId.get(id) : undefined);

const commandById = new Map(COMMANDS.map((c) => [c.id, c]));

export function collectionCommands(id: string): SlashCommand[] {
  const collection = byId.get(id);
  if (!collection) return [];
  return collection.commandIds
    .map((cid) => commandById.get(cid))
    .filter((c): c is SlashCommand => Boolean(c));
}

/**
 * Local-only recommendations. Uses the interests the user opted into plus the
 * categories they actually opened. Returns [] when there is nothing to go on.
 */
export function recommendedCommands(
  interests: string[],
  recents: string[],
  favorites: string[],
  limit = 6,
): SlashCommand[] {
  const seen = new Set([...recents, ...favorites]);
  const interestSet = new Set(interests);

  const fromInterests = COLLECTIONS.filter((c) =>
    c.interests.some((i) => interestSet.has(i)),
  ).flatMap((c) => c.commandIds);

  const usedCategories = new Set(
    [...recents, ...favorites]
      .map((id) => commandById.get(id)?.category)
      .filter((x): x is string => Boolean(x)),
  );

  const pool = new Set(fromInterests);
  if (usedCategories.size > 0) {
    for (const c of COMMANDS) {
      if (usedCategories.has(c.category) && c.popularity >= 70) pool.add(c.id);
    }
  }

  const picks = [...pool]
    .filter((id) => !seen.has(id))
    .map((id) => commandById.get(id))
    .filter((c): c is SlashCommand => Boolean(c))
    .sort((a, b) => b.popularity - a.popularity);

  return picks.slice(0, limit);
}
