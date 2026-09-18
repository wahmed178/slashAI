import { COURSES, courseByIdSafe, type Course } from "./courses";

/**
 * Structured learning paths — an ordered route through courses plus the
 * SlashKits tool and hub that belongs at that point in the journey.
 * Inspired by roadmap.sh: numbered, finite, and finishable.
 */

export interface PathStep {
  /** stable key (course id, or a route slug) */
  id: string;
  title: string;
  /** present when the step is a course */
  courseId?: string;
  /** present when the step is not a course */
  to?: string;
  /** rough minutes for a non-course step */
  minutes?: number;
}

export interface LearningPath {
  id: string;
  emoji: string;
  title: string;
  blurb: string;
  /** who this is for, shown as a chip */
  audience: string;
  steps: PathStep[];
}

/** Which track each course belongs to, for the topic filter chips. */
export const COURSE_TRACK: Record<string, string> = {
  "prompt-engineering": "AI",
  "web-fundamentals": "Web & Dev",
  "ship-a-web-app": "Shipping",
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "ai-beginner",
    emoji: "🤖",
    title: "AI Beginner Path",
    blurb: "Go from copy-pasting prompts to writing prompts that land the same way every time.",
    audience: "Anyone new to AI tools",
    steps: [
      {
        id: "prompt-engineering",
        title: "Prompt Engineering: Zero to Reliable",
        courseId: "prompt-engineering",
      },
      { id: "glossary", title: "Learn the vocabulary", to: "/glossary", minutes: 25 },
      { id: "workflow", title: "Chain prompts into a workflow", to: "/workflow", minutes: 15 },
    ],
  },
  {
    id: "developer",
    emoji: "💻",
    title: "Developer Path",
    blurb:
      "Understand what actually happens between a URL and a rendered page, then ship something real.",
    audience: "New and self-taught developers",
    steps: [
      { id: "web-fundamentals", title: "How the Web Actually Works", courseId: "web-fundamentals" },
      { id: "ship-a-web-app", title: "Ship Your First Web App", courseId: "ship-a-web-app" },
      {
        id: "api-tester",
        title: "Test an API in the browser",
        to: "/tools/api-tester",
        minutes: 15,
      },
    ],
  },
  {
    id: "creator",
    emoji: "🎨",
    title: "Creator Path",
    blurb: "Write, design and publish faster with prompts and free browser tools.",
    audience: "Writers, designers and content creators",
    steps: [
      {
        id: "prompt-engineering",
        title: "Prompt Engineering: Zero to Reliable",
        courseId: "prompt-engineering",
      },
      { id: "creators", title: "Browse the Creator Hub", to: "/hub/creators", minutes: 20 },
      { id: "quote-maker", title: "Make a quote card", to: "/tools/quote-maker", minutes: 10 },
    ],
  },
  {
    id: "career",
    emoji: "💼",
    title: "Career Growth Path",
    blurb: "Sharpen everyday work — emails, reports, interviews and negotiation.",
    audience: "Working professionals",
    steps: [
      {
        id: "professionals",
        title: "Start in the Professional Hub",
        to: "/hub/professionals",
        minutes: 20,
      },
      { id: "cv", title: "Build an ATS-friendly resume", to: "/tools/cv", minutes: 20 },
      { id: "interview", title: "Run a mock interview", to: "/tools/interview", minutes: 30 },
    ],
  },
];

function courseMinutes(course: Course): number {
  return course.modules.reduce((n, m) => n + m.lessons.reduce((k, l) => k + l.minutes, 0), 0);
}

export function pathMinutes(path: LearningPath): number {
  return path.steps.reduce((n, step) => {
    if (step.courseId) {
      const c = courseByIdSafe(step.courseId);
      return n + (c ? courseMinutes(c) : 0);
    }
    return n + (step.minutes ?? 15);
  }, 0);
}

/** Human summary, e.g. "3 steps · ~2h 15m · Beginner". */
export function pathSummary(path: LearningPath): string {
  const mins = pathMinutes(path);
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  const time = hours > 0 ? `${hours}h${rem ? ` ${rem}m` : ""}` : `${rem}m`;
  const levels = path.steps
    .map((s) => (s.courseId ? courseByIdSafe(s.courseId)?.level : undefined))
    .filter((v): v is Course["level"] => Boolean(v));
  const level = levels[0] ?? "Beginner";
  return `${path.steps.length} steps · ~${time} · ${level}`;
}

/** Course ids used by a path, so we can compute per-path completion. */
export function pathCourseIds(path: LearningPath): string[] {
  return path.steps
    .map((s) => s.courseId)
    .filter((id): id is string => Boolean(id) && Boolean(courseByIdSafe(id)));
}

/** Every course must appear in at least one path — cheap integrity check. */
export function pathsCoverAllCourses(): boolean {
  const covered = new Set(LEARNING_PATHS.flatMap(pathCourseIds));
  return COURSES.every((c) => covered.has(c.id));
}
