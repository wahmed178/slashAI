import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Lightbulb,
  Trophy,
  XCircle,
} from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { playTone } from "@/lib/play-sound";
import {
  courseByIdSafe,
  lessonIndexInCourse,
  lessonIdsOf,
  markLessonDone,
  moduleOfLesson,
  saveTestScore,
  notifyCoursesChanged,
  getProgress,
  COURSES_CHANGE_EVENT,
  type Lesson,
  type LessonBlock,
  type TestQuestion,
} from "@/lib/courses";

export const Route = createFileRoute("/learn/$courseId/$lessonId")({
  loader: ({ params }) => {
    const course = courseByIdSafe(params.courseId);
    if (!course) throw notFound();
    const lesson = course.modules.flatMap((m) => m.lessons).find((l) => l.id === params.lessonId);
    if (!lesson) throw notFound();
    return { course, lesson };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found - SlashAI" }, { name: "robots", content: "noindex" }] };
    const { course, lesson } = loaderData;
    return {
      meta: [
        { title: `${lesson.title} - ${course.title} | SlashAI` },
        {
          name: "description",
          content: `${lesson.title} — a ${lesson.minutes}-minute lesson in the free course "${course.title}" on SlashAI. Real lessons, graded tests, progress on your device.`,
        },
      ],
    };
  },
  notFoundComponent: LessonNotFound,
  component: LessonPage,
});

function LessonNotFound() {
  return (
    <AppShell back={{ to: "/learn", label: "Courses" }} title="Not found">
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-[40px]">📖</p>
        <p className="mt-2 text-sm font-semibold text-foreground">That lesson doesn't exist.</p>
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

/* ─────────────── block renderer ─────────────── */

function Block({ block, tint }: { block: LessonBlock; tint: string }) {
  switch (block.t) {
    case "p":
      return <p className="text-[14px] leading-[1.75] text-muted-foreground">{block.text}</p>;
    case "h":
      return <h2 className="mt-6 text-[16px] font-bold tracking-tight text-foreground">{block.text}</h2>;
    case "list":
      return (
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-muted-foreground">
              <span className="mt-[9px] size-1.5 shrink-0 rounded-full" style={{ background: tint }} aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-xl border border-border bg-surface-elevated p-3.5 font-mono text-[12.5px] leading-relaxed text-foreground">
          <code>{block.text}</code>
        </pre>
      );
    case "callout":
      return (
        <div
          className="flex items-start gap-2.5 rounded-xl border p-3.5"
          style={{
            borderColor: block.tone === "warn" ? "rgba(251,146,60,0.35)" : `color-mix(in oklab, ${tint} 35%, transparent)`,
            background: block.tone === "warn" ? "rgba(251,146,60,0.08)" : `color-mix(in oklab, ${tint} 7%, transparent)`,
          }}
        >
          <Lightbulb className="mt-0.5 size-4 shrink-0" style={{ color: block.tone === "warn" ? "#fb923c" : tint }} aria-hidden />
          <p className="text-[13px] leading-relaxed text-muted-foreground">{block.text}</p>
        </div>
      );
    case "practice":
      return (
        <div className="rounded-xl border border-dashed p-3.5" style={{ borderColor: `color-mix(in oklab, ${tint} 45%, transparent)` }}>
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tint }}>
            Practice
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground">{block.text}</p>
        </div>
      );
  }
}

/* ─────────────── module test ─────────────── */

function ModuleTest({
  courseId,
  courseTitle,
  mod,
  tint,
}: {
  courseId: string;
  courseTitle: string;
  mod: NonNullable<ReturnType<typeof moduleOfLesson>>;
  tint: string;
}) {
  const total = mod.test.questions.length;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState<number | null>(() => getProgress(courseId).tests[mod.title] ?? null);

  const q: TestQuestion | undefined = mod.test.questions[idx];

  if (!q) return null;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.a) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (idx + 1 >= total) {
      const score = (correct + 0) / total;
      const finalScore = correct / total;
      void score;
      saveTestScore(courseId, mod.title, finalScore);
      setBest((b) => Math.max(b ?? 0, finalScore));
      setFinished(true);
      notifyCoursesChanged();
      playTone("success");
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
    }
  };

  const scorePct = Math.round((correct / total) * 100);
  const passed = (best ?? 0) >= mod.test.passScore;

  if (finished) {
    return (
      <section className="panel rounded-2xl p-6 text-center">
        <div
          className="mx-auto grid size-14 place-items-center rounded-full"
          style={{ background: passed ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.15)" }}
        >
          {passed ? (
            <Trophy className="size-7 text-emerald-500" aria-hidden />
          ) : (
            <XCircle className="size-7 text-amber-500" aria-hidden />
          )}
        </div>
        <h2 className="mt-3 text-[17px] font-black text-foreground">
          {passed ? "Module passed!" : `Almost — ${scorePct}%`}
        </h2>
        <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
          {passed
            ? `You scored ${scorePct}% on "${mod.title}". The next module unlocks naturally — keep reading.`
            : `You need ${Math.round(mod.test.passScore * 100)}% to pass. Re-read the lesson and try again — your best score is saved.`}
        </p>
        <button
          type="button"
          onClick={() => {
            setIdx(0);
            setPicked(null);
            setCorrect(0);
            setFinished(false);
          }}
          className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-xl px-5 text-[13px] font-bold text-white transition-transform active:scale-95"
          style={{ background: tint }}
        >
          Retry test
        </button>
      </section>
    );
  }

  return (
    <section className="panel rounded-2xl p-5 sm:p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-foreground">Module test</h2>
        <span className="text-[11.5px] font-semibold text-muted-foreground">
          Question {idx + 1} / {total}
        </span>
      </header>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${((idx + (picked !== null ? 1 : 0)) / total) * 100}%`, background: tint }}
        />
      </div>

      <p className="mt-4 text-[15px] font-semibold leading-snug text-foreground">{q.q}</p>
      <div className="mt-3 space-y-2">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isRight = picked !== null && i === q.a;
          const isWrongPick = isPicked && i !== q.a;
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              disabled={picked !== null}
              className={`flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-[13.5px] font-medium transition-all ${
                isRight
                  ? "border-emerald-500/50 bg-emerald-500/10 text-foreground"
                  : isWrongPick
                    ? "border-red-500/50 bg-red-500/10 text-foreground"
                    : picked !== null
                      ? "border-border bg-surface text-muted-foreground"
                      : "border-border bg-surface text-foreground hover:border-primary/40"
              }`}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-[11px] font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-3 rounded-xl border border-border bg-surface-elevated p-3.5">
          <p className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
            <Lightbulb className="mt-0.5 size-4 shrink-0" style={{ color: tint }} aria-hidden />
            {q.why}
          </p>
          <button
            type="button"
            onClick={next}
            className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-[12.5px] font-bold text-white transition-transform active:scale-95"
            style={{ background: tint }}
          >
            {idx + 1 >= total ? "Finish test" : "Next question"} <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      )}
      <p className="mt-3 text-[11px] text-muted-foreground">
        Pass at {Math.round(mod.test.passScore * 100)}% · best score saves on your device
      </p>
    </section>
  );
}

/* ─────────────── page ─────────────── */

function LessonPage() {
  const { courseId, lessonId } = Route.useParams();
  // Resolve from params (route files with children can't rely on loader typing).
  const course = courseByIdSafe(courseId);
  const lesson = course?.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  const tint = course?.tint ?? "#2dd4bf";
  const idx = course && lesson ? lessonIndexInCourse(course, lesson.id) : { index: 0, total: 0 };
  const allIds = course ? lessonIdsOf(course) : [];
  const prevId = idx.index > 0 ? allIds[idx.index - 1] : null;
  const nextId = idx.index < idx.total - 1 ? allIds[idx.index + 1] : null;
  const mod = useMemo(() => (course && lesson ? moduleOfLesson(course, lesson.id) : null), [course, lesson]);
  const [done, setDone] = useState(() => (course && lesson ? getProgress(course.id).lessons.includes(lesson.id) : false));
  const [lastInModule, setLastInModule] = useState(false);

  useEffect(() => {
    if (!course || !lesson) return;
    const bump = () => setDone(getProgress(course.id).lessons.includes(lesson.id));
    window.addEventListener(COURSES_CHANGE_EVENT, bump);
    return () => window.removeEventListener(COURSES_CHANGE_EVENT, bump);
  }, [course, lesson]);

  // after marking done, if this is the module's last lesson, reveal the test
  const isLastOfModule = mod && lesson ? mod.lessons[mod.lessons.length - 1]!.id === lesson.id : false;
  useEffect(() => {
    setLastInModule(isLastOfModule && done);
  }, [isLastOfModule, done]);

  const markDone = () => {
    if (!course || !lesson) return;
    markLessonDone(course.id, lesson.id);
    setDone(true);
    notifyCoursesChanged();
    playTone("success");
  };

  const findLesson = (id: string | null | undefined) => {
    if (!id || !course) return null;
    for (const m of course.modules) {
      const l = m.lessons.find((x) => x.id === id);
      if (l) return l;
    }
    return null;
  };
  const prev = findLesson(prevId);
  const next = findLesson(nextId);

  if (!course || !lesson) return <LessonNotFound />;

  return (
    <AppShell wide back={{ to: `/learn/${course.id}`, label: course.title }} title={lesson.title}>
      <article className="mx-auto max-w-2xl pb-6">
        <header className="pt-2">
          <p className="text-[11.5px] font-bold uppercase tracking-wider" style={{ color: tint }}>
            {course.title} · {mod?.title}
          </p>
          <h1 className="mt-1.5 text-[22px] font-black leading-tight tracking-tight text-foreground sm:text-[26px]">
            {lesson.title}
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Clock className="size-3.5" aria-hidden /> {lesson.minutes} min read · lesson {idx.index + 1} of {idx.total}
          </p>
        </header>

        <div className="mt-5 space-y-3.5">
          {lesson.body.map((b, i) => (
            <Block key={i} block={b} tint={tint} />
          ))}
        </div>

        {/* mark done + next */}
        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          {!done ? (
            <button
              type="button"
              onClick={markDone}
              className="ripple-press inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[13.5px] font-bold text-white transition-transform active:scale-95"
              style={{ background: tint }}
            >
              <CheckCircle2 className="size-4.5" aria-hidden /> Mark lesson done
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/12 px-4 py-2.5 text-[13px] font-bold text-emerald-500">
              <CheckCircle2 className="size-4.5" aria-hidden /> Lesson completed
            </span>
          )}
          {next && (
            <Link
              to="/learn/$courseId/$lessonId"
              params={{ courseId: course.id, lessonId: next.id }}
              className="ripple-press inline-flex h-11 items-center gap-1.5 rounded-xl border border-border bg-surface px-5 text-[13.5px] font-bold text-foreground transition-colors hover:border-primary/40"
            >
              Next: {next.title.length > 26 ? `${next.title.slice(0, 26)}…` : next.title} <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>

        {/* prev link */}
        {prev && (
          <Link
            to="/learn/$courseId/$lessonId"
            params={{ courseId: course.id, lessonId: prev.id }}
            className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> Previous: {prev.title}
          </Link>
        )}

        {/* module test - revealed after the last lesson is done, but always accessible */}
        {mod && (lastInModule || getProgress(course.id).lessons.includes(lesson.id)) && (
          <div className="mt-8">
            <ModuleTest courseId={course.id} courseTitle={course.title} mod={mod} tint={tint} />
          </div>
        )}
      </article>
    </AppShell>
  );
}
