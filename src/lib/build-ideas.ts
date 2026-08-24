import { PART_1 } from "@/data/build-ideas/part-1";
import { PART_2 } from "@/data/build-ideas/part-2";
import { PART_3 } from "@/data/build-ideas/part-3";
import { PART_4 } from "@/data/build-ideas/part-4";
import { PART_5 } from "@/data/build-ideas/part-5";
import {
  IDEA_CATEGORIES,
  type BuildIdea,
  type BuildType,
  type BusinessModel,
  type Difficulty,
  type IdeaCategory,
  type RawIdea,
  type SuitableFor,
} from "@/lib/build-ideas-types";

const RAW: RawIdea[] = [...PART_1, ...PART_2, ...PART_3, ...PART_4, ...PART_5];

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Stable, deterministic dates so "Newest" sorting is meaningful offline. */
const SEED_DATE = Date.UTC(2026, 7, 24);

function expand(raw: RawIdea, index: number): BuildIdea {
  const stamp = new Date(SEED_DATE - index * 86_400_000).toISOString();
  return {
    id: `idea-${String(index + 1).padStart(3, "0")}`,
    slug: slugify(raw.title),
    title: raw.title,
    shortDescription: raw.short,
    problem: raw.problem,
    targetUsers: raw.targetUsers,
    proposedSolution: raw.solution,
    category: raw.category,
    difficulty: raw.difficulty,
    businessModel: raw.businessModel,
    buildType: raw.buildType,
    suitableFor: raw.suitableFor,
    keyFeatures: raw.key,
    mvpFeatures: raw.mvp,
    futureFeatures: raw.future,
    techStack: raw.stack,
    monetizationOptions: raw.money,
    pricingSuggestions: raw.pricing,
    customerAcquisition: raw.acquisition,
    first10Customers: raw.first10,
    buildSteps: raw.steps,
    risks: raw.risks,
    opportunityScore: raw.score,
    tags: raw.tags,
    isPublished: true,
    createdAt: stamp,
    updatedAt: stamp,
  };
}

export const BUILD_IDEAS: BuildIdea[] = RAW.map(expand).filter((i) => i.isPublished);

export const IDEA_TOTAL = BUILD_IDEAS.length;

export const IDEA_CATEGORY_COUNTS: { category: IdeaCategory; count: number }[] =
  IDEA_CATEGORIES.map((category) => ({
    category,
    count: BUILD_IDEAS.filter((i) => i.category === category).length,
  }));

export const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
export const BUSINESS_MODELS: BusinessModel[] = [
  "Subscription",
  "One-time",
  "Freemium",
  "Marketplace",
  "Advertising",
  "Service",
];
export const BUILD_TYPES: BuildType[] = ["Website", "SaaS", "Mobile App", "Internal Tool"];
export const SUITABLE_FOR: SuitableFor[] = ["Beginner", "Freelancer", "Startup", "Business"];

export function findIdea(slug: string) {
  return BUILD_IDEAS.find((i) => i.slug === slug);
}

const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

export type IdeaSort = "newest" | "opportunity" | "saved" | "easiest";

export interface IdeaFilters {
  query: string;
  categories: IdeaCategory[];
  difficulties: Difficulty[];
  models: BusinessModel[];
  types: BuildType[];
  suitable: SuitableFor[];
}

export const EMPTY_FILTERS: IdeaFilters = {
  query: "",
  categories: [],
  difficulties: [],
  models: [],
  types: [],
  suitable: [],
};

function haystack(idea: BuildIdea) {
  return [
    idea.title,
    idea.shortDescription,
    idea.problem,
    idea.targetUsers,
    idea.proposedSolution,
    idea.category,
    idea.buildType,
    idea.businessModel,
    ...idea.tags,
    ...idea.keyFeatures,
    ...idea.techStack,
  ]
    .join(" ")
    .toLowerCase();
}

export function filterIdeas(filters: IdeaFilters, sort: IdeaSort, savedIds: string[] = []) {
  const tokens = filters.query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const matched = BUILD_IDEAS.filter((idea) => {
    if (filters.categories.length && !filters.categories.includes(idea.category)) return false;
    if (filters.difficulties.length && !filters.difficulties.includes(idea.difficulty))
      return false;
    if (filters.models.length && !filters.models.includes(idea.businessModel)) return false;
    if (filters.types.length && !filters.types.includes(idea.buildType)) return false;
    if (filters.suitable.length && !filters.suitable.includes(idea.suitableFor)) return false;
    if (!tokens.length) return true;
    const hay = haystack(idea);
    return tokens.every((t) => hay.includes(t));
  });

  const sorted = [...matched];
  if (sort === "opportunity") sorted.sort((a, b) => b.opportunityScore - a.opportunityScore);
  else if (sort === "easiest")
    sorted.sort(
      (a, b) =>
        DIFFICULTY_WEIGHT[a.difficulty] - DIFFICULTY_WEIGHT[b.difficulty] ||
        b.opportunityScore - a.opportunityScore,
    );
  else if (sort === "saved")
    sorted.sort(
      (a, b) =>
        Number(savedIds.includes(b.id)) - Number(savedIds.includes(a.id)) ||
        b.opportunityScore - a.opportunityScore,
    );
  else sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return sorted;
}

export function relatedIdeas(idea: BuildIdea, limit = 3) {
  return BUILD_IDEAS.filter((i) => i.id !== idea.id && i.category === idea.category).slice(
    0,
    limit,
  );
}
