import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronRight, Clock, GraduationCap, Route as RouteIcon, Trophy, Users } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import {
  COURSES,
  COURSE_COUNT,
  TOTAL_LESSONS,
  TOTAL_TEST_QUESTIONS,
  lessonProgress,
  courseCompleted,
  COURSES_CHANGE_EVENT,
  type Course,
} from "@/lib/courses";
import {
  COURSE_TRACK,
  LEARNING_PATHS,
  pathCourseIds,
  pathSummary,
  type LearningPath,
} from "@/lib/learning-paths";
import { hasStarted, markStarted } from "@/lib/ux";
import { useUxTick } from "@/hooks/use-ux";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      {
        title: `Slash Courses - ${COURSE_COUNT} free courses with real lessons & tests | SlashAI`,
      },
      {
        name: "description",
        content:
          "Learn for free with structured courses: real lessons, graded module tests and progress tracking - on your device, no account. Prompt engineering, how the web works, and shipping your first app.",
      },
      { property: "og:title", content: "Slash Courses - learn real skills, free | SlashAI" },
      {
        property: "og:description",
        content:
          "Structured courses with real lessons and module tests. Progress saved on your device. Free forever.",
      },
    ],
  }),
  component: LearnIndex,
});

function Meta({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
      <Icon className="size-3.5" aria-hidden />
      {children}
    </span>
  );
}

function totalMinutes(c: Course) {
  return c.modules.reduce((n, m) => n + m.lessons.reduce((k, l) => k + l.minutes, 0), 0);
}

/** "4h 20m" / "35m" — the readable estimate shown on every card. */
function humanTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h <= 0) return `${m} min`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** Filters reflect what the catalogue actually contains — nothing invented. */
const FILTERS = ["All", "Beginner", "Intermediate", "Advanced", "AI", "Web & Dev", "Shipping"] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(course: Course, filter: Filter) {
  if (filter === "All") return true;
  if (filter === course.level) return true;
  return COURSE_TRACK[course.id] === filter;
}

function CourseCard({ course }: { course: Course }) {
  const [pct, setPct] = useState(lessonProgress(course));
  useUxTick();
  const done = courseCompleted(course);
  const started = hasStarted(course.id);

  useEffect(() => {
    const bump = () => setPct(lessonProgress(course));
    window.addEventListener(COURSES_CHANGE_EVENT, bump);
    return () => window.removeEventListener(COURSES_CHANGE_EVENT, bump);
  }, [course]);

  const lessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <Link
      to="/learn/$courseId"
      params={{ courseId: course.id }}
      onClick={() => markStarted(course.id)}
      className="group panel block overflow-hidden rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div
        className="flex items-start gap-3.5 p-4 sm:p-5"
        style={{ background: `color-mix(in oklab, ${course.tint} 7%, transparent)` }}
      >
        <span
          className="grid size-12 shrink-0 place-items-center rounded-xl text-[26px]"
          style={{ background: `color-mix(in oklab, ${course.tint} 16%, transparent)` }}
          aria-hidden
        >
          {course.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[16px] font-bold text-foreground">{course.title}</h3>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: `color-mix(in oklab, ${course.tint} 15%, transparent)`, color: course.tint }}
            >
              {course.level}
            </span>
            {done && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                <Trophy className="size-3" aria-hidden /> Completed
              </span>
            )}
            {!done && started && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                <Check className="size-3" aria-hidden /> Started
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] leading-snug text-muted-foreground">{course.tagline}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1">
            <Meta icon={Clock}>⏱ {humanTime(totalMinutes(course))}</Meta>
            <Meta icon={GraduationCap}>
              {course.modules.length} modules · {lessons} lessons
            </Meta>
            <Meta icon={Users}>Free · {course.audience}</Meta>
          </div>
          {pct > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10.5px] font-semibold text-muted-foreground">
                <span>{pct >= 1 ? "All lessons read" : "In progress"}</span>
                <span className="tabular-nums">{Math.round(pct * 100)}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${Math.round(pct * 100)}%`, background: course.tint }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function PathCard({ path }: { path: LearningPath }) {
  useUxTick();
  const courseIds = pathCourseIds(path);
  const doneCount = courseIds.filter((id) => {
    const c = COURSES.find((x) => x.id === id);
    return c ? courseCompleted(c) : false;
  }).length;

  return (
    <article className="panel flex flex-col rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-[22px]" aria-hidden>
          {path.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold text-foreground">{path.title}</h3>
          <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{path.blurb}</p>
        </div>
      </div>

      <p className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <RouteIcon className="size-3.5" aria-hidden />
          {pathSummary(path)}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5">{path.audience}</span>
        {courseIds.length > 0 && doneCount > 0 && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold text-emerald-500">
            {doneCount}/{courseIds.length} courses complete
          </span>
        )}
      </p>

      <ol className="mt-3 space-y-1.5">
        {path.steps.map((step, i) => {
          const course = step.courseId ? COURSES.find((c) => c.id === step.courseId) : undefined;
          const finished = course ? courseCompleted(course) : hasStarted(step.id);
          const inner = (
            <>
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  finished ? "bg-emerald-500/20 text-emerald-500" : "bg-accent text-primary",
                )}
              >
                {finished ? <Check className="size-3" aria-hidden /> : i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-[12.5px] text-foreground">{step.title}</span>
              <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            </>
          );
          return (
            <li key={`${path.id}-${step.id}`}>
              {course ? (
                <Link
                  to="/learn/$courseId"
                  params={{ courseId: course.id }}
                  onClick={() => markStarted(course.id)}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-elevated"
                >
                  {inner}
                </Link>
              ) : (
                <a
                  href={step.to}
                  onClick={() => markStarted(step.id)}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-elevated"
                >
                  {inner}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </article>
  );
}

function LearnIndex() {
  const [filter, setFilter] = useState<Filter>("All");
  const tick = useUxTick();
  const visible = useMemo(() => COURSES.filter((c) => matchesFilter(c, filter)), [filter]);

  const startedCount = useMemo(
    () => COURSES.filter((c) => hasStarted(c.id) || lessonProgress(c) > 0).length,
    // re-read whenever progress or our own UX store changes
    [tick],
  );

  return (
    <AppShell wide hideHeaderSearch title="Slash Courses">
      <header className="page-enter pt-2">
        <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          <GraduationCap className="size-7 text-primary" aria-hidden />
          Slash Courses
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Structured courses with real lessons and graded module tests — inspired by roadmap.sh,
          built for doing. {COURSE_COUNT} courses · {TOTAL_LESSONS} lessons ·{" "}
          {TOTAL_TEST_QUESTIONS} test questions. Progress is saved on your device; no account, free
          forever.
        </p>
      </header>

      {/* Learning paths — numbered, finite, finishable */}
      <section className="mt-6">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h2 className="text-[15px] font-bold text-foreground">Learning paths</h2>
          <span className="text-[12px] text-muted-foreground">
            Not sure where to start? Follow one path in order.
          </span>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {LEARNING_PATHS.map((p) => (
            <PathCard key={p.id} path={p} />
          ))}
        </div>
      </section>

      {/* Filters + progress */}
      <section className="mt-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[15px] font-bold text-foreground">All courses</h2>
          <span className="text-[11.5px] text-muted-foreground">
            {startedCount === 0
              ? "My progress: nothing started yet"
              : `My progress: ${startedCount} of ${COURSE_COUNT} courses started`}
          </span>
        </div>
        <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors",
                filter === f
                  ? "bg-primary text-background"
                  : "border border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "All" ? `All (${COURSE_COUNT})` : f}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-4 rounded-xl border border-border bg-surface p-6 text-center text-sm text-muted-foreground">
            No courses match “{filter}” yet. Try “All”.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {visible.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>

      <section className="panel mt-7 mb-6 rounded-2xl p-5">
        <h2 className="text-[15px] font-bold text-foreground">How courses work</h2>
        <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
          <li>
            📖 <b className="text-foreground">Read</b> — each lesson is a short, focused read with
            practice at the end.
          </li>
          <li>
            ✅ <b className="text-foreground">Mark done</b> — progress saves instantly on your
            device.
          </li>
          <li>
            🧪 <b className="text-foreground">Pass the test</b> — every module ends with a graded
            quiz; 70% passes and scores save.
          </li>
          <li>
            🏆 <b className="text-foreground">Finish</b> — pass every module test and the course is
            marked complete.
          </li>
        </ul>
      </section>
    </AppShell>
  );
}
