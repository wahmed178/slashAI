/**
 * Types for the Build Ideas Library.
 *
 * Authoring shape (`RawIdea`) is deliberately terse so the data files stay
 * readable; `src/lib/build-ideas.ts` expands each record into a full
 * `BuildIdea` with slug, id, timestamps and publish flag.
 */

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type BusinessModel =
  | "Subscription"
  | "One-time"
  | "Freemium"
  | "Marketplace"
  | "Advertising"
  | "Service";

export type BuildType = "Website" | "SaaS" | "Mobile App" | "Internal Tool";

export type SuitableFor = "Beginner" | "Freelancer" | "Startup" | "Business";

export const IDEA_CATEGORIES = [
  "AI",
  "SaaS",
  "Productivity",
  "Business",
  "Finance",
  "Education",
  "Healthcare",
  "HR",
  "Marketing",
  "E-commerce",
  "Creator Tools",
  "Developer Tools",
  "Quality & Operations",
  "Personal Tools",
] as const;

export type IdeaCategory = (typeof IDEA_CATEGORIES)[number];

/** Compact authoring record used inside `src/data/build-ideas/*`. */
export interface RawIdea {
  title: string;
  category: IdeaCategory;
  difficulty: Difficulty;
  businessModel: BusinessModel;
  buildType: BuildType;
  suitableFor: SuitableFor;
  /** one-line pitch shown on cards */
  short: string;
  problem: string;
  targetUsers: string;
  solution: string;
  key: string[];
  mvp: string[];
  future: string[];
  stack: string[];
  money: string[];
  pricing: string;
  acquisition: string;
  first10: string;
  steps: string[];
  risks: string[];
  /** 1–10 */
  score: number;
  tags: string[];
}

/** Expanded record consumed by the UI. */
export interface BuildIdea {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  problem: string;
  targetUsers: string;
  proposedSolution: string;
  category: IdeaCategory;
  difficulty: Difficulty;
  businessModel: BusinessModel;
  buildType: BuildType;
  suitableFor: SuitableFor;
  keyFeatures: string[];
  mvpFeatures: string[];
  futureFeatures: string[];
  techStack: string[];
  monetizationOptions: string[];
  pricingSuggestions: string;
  customerAcquisition: string;
  first10Customers: string;
  buildSteps: string[];
  risks: string[];
  opportunityScore: number;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
