import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle2, Circle, Clock, Trophy } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import {
  courseByIdSafe,
  getProgress,
  courseCompleted,
  lessonProgress,
  COURSES_CHANGE_EVENT,
  type Course,
} from "@/lib/courses";
import { playTone } from "@/lib/play-sound";

export const Route = createFileRoute("/learn/$courseId")({
  loader: ({ params }) => {
    const course = courseByIdSafe(params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found - SlashAI" }, { name: "robots", content: "noindex" }] };
    const { course } = loaderData;
    const lessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
    return {
      meta: [
        { title: `${course.title} - free course | SlashAI` },
        { name: "description", content: `${course.tagline} ${lessons} lessons across ${course.modules.length} modules with graded tests - free, on-device progress, no account.` },
        { property: "og:title", content: course.title },
        { property: "og:description", content: course.tagline },
      ],
    };
  },
  notFoundComponent: CourseNotFound,
  component: CoursePage,
});

function CourseNotFound() {
  return (
    <AppShell back={{ to: "/learn", label: "Courses" }} title="Not found">
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-[40px]">🎓</p>
        <p className="mt-2 text-sm font-semibold text-foreground">That course doesn't exist.</p>
        <Link
          to="/learn"
          className="mt-4 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          All courses
        </Link>
      </div>
    </AppShell>
  );
}

function ModuleBlock({ course, mod }: { course: Course; mod: Course["modules"][number] }) {
  const [progress, setProgress] = useState(() => getProgress(course.id));

  useEffect(() => {
    const bump = () => setProgress(getProgress(course.id));
    window.addEventListener(COURSES_CHANGE_EVENT, bump);
    return () => window.removeEventListener(COURSES_CHANGE_EVENT, bump);
  }, [course]);

  const score = progress.tests[mod.title];
  const passed = score !== undefined && score >= mod.test.passScore;

  return (
    <section className="panel overflow-hidden rounded-2xl">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-4 py-3 sm:px-5">
        <h2 className="text-[14.5px] font-bold text-foreground">{mod.title}</h2>
        {passed ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-1 text-[11px] font-bold text-emerald-500">
            <Trophy className="size-3.5" aria-hidden /> Test passed · {Math.round(score! * 100)}%
          </span>
        ) : score !== undefined ? (
          <span className="rounded-full bg-amber-500/12 px-2.5 py-1 text-[11px] font-bold text-amber-500">
            Best {Math.round(score * 100)}% · retry to pass
          </span>
        ) : (
          <span className="rounded-full bg-surface-elevated px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {mod.test.questions.length}-question test at the end
          </span>
        )}
      </header>
      <ol className="divide-y divide-border/50">
        {mod.lessons.map((lesson) => {
          const done = progress.lessons.includes(lesson.id);
          return (
            <li key={lesson.id}>
              <Link
                to="/learn/$courseId/$lessonId"
                params={{ courseId: course.id, lessonId: lesson.id }}
                onClick={() => playTone("tap")}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40 sm:px-5"
              >
                {done ? (
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-500" aria-hidden />
                ) : (
                  <Circle className="size-5 shrink-0 text-muted-foreground/60" aria-hidden />
                )}
                <span className="min-w-0 flex-1">
                  <span className={`block text-[13.5px] font-semibold ${done ? "text-muted-foreground line-through decoration-border" : "text-foreground"}`}>
                    {lesson.title}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="size-3" aria-hidden /> {lesson.minutes} min read
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground/70" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function CoursePage() {
  const { courseId } = Route.useParams();
  // Resolve course from params (route files with children can't rely on loader typing).
  // Hooks must run unconditionally, so resolve first and guard during render.
  const course = courseByIdSafe(courseId);
  const [pct, setPct] = useState(() => (course ? lessonProgress(course) : 0));
  const done = course ? courseCompleted(course) : false;

  useEffect(() => {
    if (!course) return;
    const bump = () => setPct(lessonProgress(course));
    window.addEventListener(COURSES_CHANGE_EVENT, bump);
    return () => window.removeEventListener(COURSES_CHANGE_EVENT, bump);
  }, [course]);

  if (!course) return <CourseNotFound />;

  const lessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const minutes = course.modules.reduce((n, m) => n + m.lessons.reduce((k, l) => k + l.minutes, 0), 0);

  return (
    <AppShell wide hideHeaderSearch back={{ to: "/learn", label: "Courses" }} title={course.title}>
      <header
        className="page-enter overflow-hidden rounded-2xl border p-5 sm:p-7"
        style={{
          borderColor: `color-mix(in oklab, ${course.tint} 30%, transparent)`,
          background: `color-mix(in oklab, ${course.tint} 8%, transparent)`,
        }}
      >
        <div className="flex flex-wrap items-start gap-4">
          <span
            className="grid size-14 shrink-0 place-items-center rounded-2xl text-[30px]"
            style={{ background: `color-mix(in oklab, ${course.tint} 18%, transparent)` }}
            aria-hidden
          >
            {course.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
              {course.title}
            </h1>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{course.tagline}</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className="rounded-full px-2.5 py-0.5 text-[10.5px] font-bold" style={{ background: `color-mix(in oklab, ${course.tint} 15%, transparent)`, color: course.tint }}>
                {course.level}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-elevated px-2.5 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                <Clock className="size-3" aria-hidden /> ~{Math.round(minutes)} min total
              </span>
              <span className="rounded-full bg-surface-elevated px-2.5 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                {course.modules.length} modules · {lessons} lessons
              </span>
              {done && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-500">
                  <Trophy className="size-3" aria-hidden /> Completed
                </span>
              )}
            </div>
          </div>
        </div>

        {pct > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
              <span>{pct >= 1 ? "All lessons read — pass the tests to finish" : "Course progress"}</span>
              <span className="tabular-nums">{Math.round(pct * 100)}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${Math.round(pct * 100)}%`, background: course.tint }}
              />
            </div>
          </div>
        )}
      </header>

      {/* what you'll be able to do */}
      <section className="mt-5 panel rounded-2xl p-5">
        <h2 className="flex items-center gap-2 text-[15px] font-bold text-foreground">
          <BookOpen className="size-4.5 text-primary" aria-hidden /> After this course you can
        </h2>
        <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
          {course.outcome.map((o) => (
            <li key={o} className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" style={{ color: course.tint }} aria-hidden />
              {o}
            </li>
          ))}
        </ul>
      </section>

      <h2 className="mt-6 px-1 text-sm font-bold uppercase tracking-[0.06em] text-muted-foreground">
        Curriculum
      </h2>
      <div className="mt-2.5 space-y-3 pb-8">
        {course.modules.map((mod) => (
          <ModuleBlock key={mod.title} course={course} mod={mod} />
        ))}
      </div>
    </AppShell>
  );
}
