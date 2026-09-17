import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, GraduationCap, Trophy, Users } from "lucide-react";

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

function Meta({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
      <Icon className="size-3.5" aria-hidden />
      {children}
    </span>
  );
}

function totalMinutes(c: Course) {
  return c.modules.reduce(
    (n, m) => n + m.lessons.reduce((k, l) => k + l.minutes, 0),
    0,
  );
}

function CourseCard({ course }: { course: Course }) {
  const [pct, setPct] = useState(lessonProgress(course));
  const done = courseCompleted(course);

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
            <h2 className="text-[16px] font-bold text-foreground">{course.title}</h2>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: `color-mix(in oklab, ${course.tint} 15%, transparent)`, color: course.tint }}
            >
              {course.level}
            </span>
            {done && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                <Trophy className="size-3" aria-hidden /> Completed
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] leading-snug text-muted-foreground">{course.tagline}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1">
            <Meta icon={Clock}>{Math.round(totalMinutes(course))} min</Meta>
            <Meta icon={GraduationCap}>
              {course.modules.length} modules · {lessons} lessons
            </Meta>
            <Meta icon={Users}>{course.audience}</Meta>
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

function LearnIndex() {
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

      <div className="mt-5 grid gap-3 pb-8 lg:grid-cols-2">
        {COURSES.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>

      <section className="panel mb-6 rounded-2xl p-5">
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
