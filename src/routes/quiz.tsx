import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Clock, Trophy, RotateCcw, Share2, Flame, CheckCircle2 } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";

/* ═══════════════════════════════════════════════
   CONSTANTS & TYPES
   ═══════════════════════════════════════════════ */

const CATEGORY_EMOJIS: Record<number, string> = {
  9: "\u{1F30D}", 10: "\u{1F4DA}", 11: "\u{1F3AC}", 12: "\u{1F3B5}",
  13: "\u{1F3AD}", 14: "\u{1F4FA}", 15: "\u{1F3AE}", 16: "\u{1F579}\u{FE0F}",
  17: "\u{1F52C}", 18: "\u{1F4BB}", 19: "\u{1F522}", 20: "\u26A1",
  21: "\u26BD", 22: "\u{1F5FA}\u{FE0F}", 23: "\u{1F3DB}\u{FE0F}", 24: "\u{1F3DB}\u{FE0F}",
  25: "\u{1F3A8}", 26: "\u2B50", 27: "\u{1F43E}", 28: "\u{1F697}",
  29: "\u{1F4A5}", 30: "\u{1F4F1}", 31: "\u{1F1EF}\u{1F1F5}", 32: "\u{1F3A0}",
};

const FALLBACK_CATEGORIES = [
  { id: 9, name: "General Knowledge" },
  { id: 17, name: "Science & Nature" },
  { id: 18, name: "Science: Computers" },
  { id: 23, name: "History" },
  { id: 22, name: "Geography" },
  { id: 21, name: "Sports" },
];

const DIFFICULTY_TIME: Record<string, number> = { easy: 25, medium: 20, hard: 15 };

type View = "picker" | "quiz" | "results";

interface OpenTDBQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface OpenTDBResponse {
  response_code: number;
  results: OpenTDBQuestion[];
}

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  answers: string[];
  category: string;
  difficulty: string;
}

/* ═══════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════ */

function decodeHTML(str: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0]!;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function getCacheKey(categoryId: number, difficulty: string): string {
  return `quiz-cache-${categoryId}-${difficulty}`;
}

function getCachedQuestions(categoryId: number, difficulty: string): QuizQuestion[] | null {
  try {
    const raw = localStorage.getItem(getCacheKey(categoryId, difficulty));
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (cached.date === todayStr()) return cached.questions;
    return null;
  } catch { return null; }
}

function setCachedQuestions(categoryId: number, difficulty: string, questions: QuizQuestion[]) {
  try {
    localStorage.setItem(getCacheKey(categoryId, difficulty), JSON.stringify({
      questions,
      date: todayStr(),
    }));
  } catch { /* ignore */ }
}

function getSessionToken(): string | null {
  return localStorage.getItem("quiz-session-token");
}

function setSessionToken(token: string) {
  try { localStorage.setItem("quiz-session-token", token); } catch { /* ignore */ }
}

function getStreak(): { count: number; best: number; lastDate: string } {
  try {
    return {
      count: parseInt(localStorage.getItem("quiz-streak") || "0", 10),
      best: parseInt(localStorage.getItem("quiz-best-streak") || "0", 10),
      lastDate: localStorage.getItem("quiz-last-date") || "",
    };
  } catch { return { count: 0, best: 0, lastDate: "" }; }
}

function updateStreak(score: number): { count: number; best: number; isNew: boolean } {
  const today = todayStr();
  const s = getStreak();
  if (s.lastDate === today) return { count: s.count, best: s.best, isNew: false };
  const newCount = score > 0 ? s.count + 1 : 0;
  const newBest = Math.max(newCount, s.best);
  try {
    localStorage.setItem("quiz-streak", String(newCount));
    localStorage.setItem("quiz-best-streak", String(newBest));
    localStorage.setItem("quiz-last-date", today);
  } catch { /* ignore */ }
  return { count: newCount, best: newBest, isNew: true };
}

function todayCompletedCategories(): Set<number> {
  try {
    const raw = localStorage.getItem("quiz-completed-today");
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (parsed.date === todayStr()) return new Set(parsed.ids);
    return new Set();
  } catch { return new Set(); }
}

function markCategoryCompleted(categoryId: number) {
  try {
    const today = todayStr();
    const existing = todayCompletedCategories();
    existing.add(categoryId);
    localStorage.setItem("quiz-completed-today", JSON.stringify({
      date: today,
      ids: [...existing],
    }));
  } catch { /* ignore */ }
}

/* ═══════════════════════════════════════════════
   API
   ═══════════════════════════════════════════════ */

async function ensureToken(): Promise<string> {
  let token = getSessionToken();
  if (token) return token;
  try {
    const res = await fetch("https://opentdb.com/api_token.php?command=request");
    const data = await res.json();
    token = data.token;
    if (token) setSessionToken(token);
  } catch { /* ignore */ }
  return token || "";
}

async function fetchQuestions(
  categoryId: number,
  difficulty: string,
): Promise<{ questions: QuizQuestion[]; responseCode: number }> {
  const token = await ensureToken();
  const url = `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=multiple${token ? `&token=${token}` : ""}`;

  try {
    const res = await fetch(url);
    const data: OpenTDBResponse = await res.json();

    // Token exhausted — reset and retry once
    if (data.response_code === 4 && token) {
      try { await fetch(`https://opentdb.com/api_token.php?command=reset&token=${token}`); } catch { /* ignore */ }
      localStorage.removeItem("quiz-session-token");
      return fetchQuestions(categoryId, difficulty);
    }

    // Rate limited — wait and retry once
    if (data.response_code === 5) {
      await new Promise((r) => setTimeout(r, 6000));
      const retryRes = await fetch(url);
      const retryData: OpenTDBResponse = await retryRes.json();
      if (retryData.response_code !== 0 || !retryData.results?.length) {
        return { questions: [], responseCode: retryData.response_code };
      }
      return {
        questions: retryData.results.map(parseQuestion),
        responseCode: 0,
      };
    }

    if (data.response_code !== 0 || !data.results?.length) {
      return { questions: [], responseCode: data.response_code };
    }

    return {
      questions: data.results.map(parseQuestion),
      responseCode: 0,
    };
  } catch {
    return { questions: [], responseCode: -1 };
  }
}

function parseQuestion(raw: OpenTDBQuestion): QuizQuestion {
  const allAnswers = [...raw.incorrect_answers, raw.correct_answer];
  return {
    question: decodeHTML(raw.question),
    correctAnswer: decodeHTML(raw.correct_answer),
    answers: shuffleArray(allAnswers.map(decodeHTML)),
    category: decodeHTML(raw.category),
    difficulty: raw.difficulty,
  };
}

async function fetchCategories(): Promise<{ id: number; name: string }[]> {
  try {
    const res = await fetch("https://opentdb.com/api_category.php");
    const data = await res.json();
    return data.trivia_categories || [];
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

/* ═══════════════════════════════════════════════
   ROUTE
   ═══════════════════════════════════════════════ */

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Daily Quiz — SlashAI" },
      { name: "description", content: "Test your knowledge with daily trivia quizzes across 24 categories. Fresh questions every day." },
    ],
  }),
  component: QuizPage,
});

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */

function QuizPage() {
  const [view, setView] = useState<View>("picker");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [difficulty, setDifficulty] = useState<string>(() => {
    try { return localStorage.getItem("quiz-difficulty") || "medium"; } catch { return "medium"; }
  });
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<{ question: string; correct: string; userAnswer: string; wasCorrect: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_TIME[difficulty] || 20);
  const [showReview, setShowReview] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [completedCategories, setCompletedCategories] = useState<Set<number>>(() => todayCompletedCategories());

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Featured category (date-seeded rotation)
  const featuredId = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return (dayOfYear % 24) + 9; // IDs 9-32
  }, []);

  // Load categories on mount
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  // Set difficulty in localStorage
  useEffect(() => {
    try { localStorage.setItem("quiz-difficulty", difficulty); } catch { /* ignore */ }
  }, [difficulty]);

  // Featured category info
  const featuredCategory = useMemo(() => {
    const cats = categories.length ? categories : FALLBACK_CATEGORIES;
    return cats.find((c) => c.id === featuredId) || cats[0]!;
  }, [categories, featuredId]);

  const streak = useMemo(() => getStreak(), [view]);

  // Start quiz
  const startQuiz = useCallback(async (catId: number, catName: string) => {
    setSelectedCategory({ id: catId, name: catName });
    setLoading(true);
    setError(null);
    setView("quiz");
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAnswers([]);
    setShowReview(false);
    setQuizCompleted(false);
    setTimeLeft(DIFFICULTY_TIME[difficulty] || 20);

    // Try cache first
    const cached = getCachedQuestions(catId, difficulty);
    if (cached && cached.length === 10) {
      setQuestions(cached);
      setLoading(false);
      return;
    }

    const { questions: fetched, responseCode } = await fetchQuestions(catId, difficulty);

    if (responseCode === 1) {
      // No results for this difficulty — retry with medium
      if (difficulty !== "medium") {
        const retry = await fetchQuestions(catId, "medium");
        if (retry.questions.length) {
          setQuestions(retry.questions);
          setCachedQuestions(catId, difficulty, retry.questions);
          setLoading(false);
          return;
        }
      }
      setError("No questions available for this category and difficulty. Try another combination.");
      setLoading(false);
      return;
    }

    if (!fetched.length) {
      setError("Questions couldn\u2019t load. Try again in a moment.");
      setLoading(false);
      return;
    }

    setCachedQuestions(catId, difficulty, fetched);
    setQuestions(fetched);
    setLoading(false);
  }, [difficulty]);

  // Timer
  const maxTime = DIFFICULTY_TIME[difficulty] || 20;

  useEffect(() => {
    if (view !== "quiz" || !questions.length || quizCompleted || selectedAnswer) return;

    // Pause timer if tab hidden
    const handleVisibility = () => {
      if (document.hidden) {
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        startTimer();
      }
    };

    const startTimer = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            // Auto-mark as wrong and advance
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const handleTimeout = () => {
      setSelectedAnswer("\u0000"); // sentinel
      setIsCorrect(false);
      setAnswers((prev) => [
        ...prev,
        {
          question: questions[currentQ]!.question,
          correct: questions[currentQ]!.correctAnswer,
          userAnswer: "Timed out",
          wasCorrect: false,
        },
      ]);
      autoAdvanceRef.current = setTimeout(() => advanceQuestion(), 1500);
    };

    startTimer();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [view, questions, currentQ, quizCompleted, selectedAnswer, difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset timer on new question
  useEffect(() => {
    setTimeLeft(maxTime);
  }, [currentQ, maxTime]);

  // Answer selection
  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null) return; // already answered
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQ]!.correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);

    setAnswers((prev) => [
      ...prev,
      {
        question: questions[currentQ]!.question,
        correct: questions[currentQ]!.correctAnswer,
        userAnswer: answer,
        wasCorrect: correct,
      },
    ]);

    autoAdvanceRef.current = setTimeout(() => advanceQuestion(), 1500);
  }, [selectedAnswer, questions, currentQ]); // eslint-disable-line react-hooks/exhaustive-deps

  const advanceQuestion = useCallback(() => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    if (currentQ + 1 >= questions.length) {
      // Quiz complete
      setQuizCompleted(true);
      if (selectedCategory) {
        markCategoryCompleted(selectedCategory.id);
        setCompletedCategories(todayCompletedCategories());
      }
      // Update streak
      updateStreak(score);
      setView("results");
    } else {
      setCurrentQ((c) => c + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(maxTime);
    }
  }, [currentQ, questions.length, selectedCategory, score, maxTime]);

  const manualNext = useCallback(() => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    advanceQuestion();
  }, [advanceQuestion]);

  const playAgain = useCallback(() => {
    if (selectedCategory) {
      // Bypass daily cache — fetch fresh
      localStorage.removeItem(getCacheKey(selectedCategory.id, difficulty));
      startQuiz(selectedCategory.id, selectedCategory.name);
    }
  }, [selectedCategory, difficulty, startQuiz]);

  const goBackToPicker = useCallback(() => {
    setView("picker");
    setSelectedCategory(null);
    setQuestions([]);
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAnswers([]);
    setShowReview(false);
    setQuizCompleted(false);
    setError(null);
  }, []);

  const shareScore = useCallback(async () => {
    const text = `I scored ${score}/${questions.length} on the ${selectedCategory?.name} quiz! \u{1F9E0} Try it free at slashai.app`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "SlashAI Daily Quiz", text, url: "https://slashai-nu.vercel.app/quiz" });
      } catch { /* user cancelled */ }
    } else {
      try { await navigator.clipboard.writeText(text + "\nhttps://slashai-nu.vercel.app/quiz"); } catch { /* ignore */ }
    }
  }, [score, questions.length, selectedCategory]);

  // Timer circle
  const timerPct = (timeLeft / maxTime) * 100;
  const timerColor = timeLeft > 10 ? "#3fb950" : timeLeft > 5 ? "#d29922" : "#f85149";
  const circumference = 2 * Math.PI * 26;

  return (
    <AppShell title="Daily Quiz">
      <div className="page-enter">
        {view === "picker" && (
          <CategoryPicker
            categories={categories}
            featuredCategory={featuredCategory}
            featuredId={featuredId}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            completedCategories={completedCategories}
            streak={streak}
            onSelect={(id, name) => startQuiz(id, name)}
          />
        )}

        {view === "quiz" && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="size-3 rounded-full bg-primary"
                      style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Loading questions\u2026</p>
                <style>{`@keyframes pulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }`}</style>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24">
                <p className="text-sm text-muted-foreground">{error}</p>
                <button
                  type="button"
                  onClick={goBackToPicker}
                  className="mt-4 min-h-[44px] rounded-lg border border-border bg-surface px-6 text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Back to categories
                </button>
              </div>
            ) : questions.length > 0 ? (
              <QuizInProgress
                questions={questions}
                currentQ={currentQ}
                score={score}
                selectedAnswer={selectedAnswer}
                isCorrect={isCorrect}
                timeLeft={timeLeft}
                maxTime={maxTime}
                timerPct={timerPct}
                timerColor={timerColor}
                circumference={circumference}
                onAnswer={handleAnswer}
                onNext={manualNext}
                selectedCategory={selectedCategory}
                difficulty={difficulty}
              />
            ) : null}
          </>
        )}

        {view === "results" && selectedCategory && (
          <ResultsScreen
            score={score}
            total={questions.length}
            answers={answers}
            selectedCategory={selectedCategory}
            difficulty={difficulty}
            showReview={showReview}
            onToggleReview={() => setShowReview(!showReview)}
            onPlayAgain={playAgain}
            onBackToPicker={goBackToPicker}
            onShare={shareScore}
          />
        )}
      </div>
    </AppShell>
  );
}

/* ═══════════════════════════════════════════════
   VIEW 1: CATEGORY PICKER
   ═══════════════════════════════════════════════ */

function CategoryPicker({
  categories,
  featuredCategory,
  featuredId,
  difficulty,
  setDifficulty,
  completedCategories,
  streak,
  onSelect,
}: {
  categories: { id: number; name: string }[];
  featuredCategory: { id: number; name: string };
  featuredId: number;
  difficulty: string;
  setDifficulty: (d: string) => void;
  completedCategories: Set<number>;
  streak: { count: number; best: number };
  onSelect: (id: number, name: string) => void;
}) {
  const displayCategories = categories.length ? categories : FALLBACK_CATEGORIES;

  return (
    <div>
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Daily Quiz
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Pick a category — fresh questions every day.
        </p>
        <span className="mt-2 inline-flex items-center rounded border border-border bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground">
          Questions reset daily at midnight
        </span>
      </div>

      {/* Streak */}
      <div className="mt-4 flex items-center gap-3">
        {streak.count > 0 ? (
          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Flame className="size-4 text-yellow" aria-hidden />
            {streak.count} day streak
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Start your streak today →</span>
        )}
        {streak.best > 0 && (
          <span className="text-[11px] text-muted-foreground">Best: {streak.best} days</span>
        )}
      </div>

      {/* Featured category */}
      <Link
        to="/quiz"
        onClick={(e) => {
          e.preventDefault();
          onSelect(featuredCategory.id, featuredCategory.name);
        }}
        className="mt-5 flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
      >
        <span className="text-[48px]" aria-hidden>{CATEGORY_EMOJIS[featuredCategory.id] || "\u{1F9E0}"}</span>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-medium text-primary">Featured today</span>
          <p className="text-[18px] font-bold text-foreground">{featuredCategory.name}</p>
          <p className="text-[13px] text-muted-foreground">10 questions</p>
        </div>
        <span className="shrink-0 min-h-[40px] flex items-center gap-1.5 rounded-lg border border-primary bg-accent px-4 text-sm font-medium text-foreground">
          Play today's quiz <ChevronRight className="size-4" aria-hidden />
        </span>
      </Link>

      {/* Difficulty selector */}
      <div className="mt-5 flex gap-2">
        {(["easy", "medium", "hard"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDifficulty(d)}
            className="min-h-[40px] flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors"
            style={{
              background: difficulty === d ? "#58a6ff" : "#21262d",
              borderColor: difficulty === d ? "transparent" : "#30363d",
              color: difficulty === d ? "#0d1117" : "#8b949e",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Category grid */}
      <h2 className="mt-6 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        All categories
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {displayCategories.map((cat) => {
          const completed = completedCategories.has(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id, cat.name)}
              className="group relative rounded-[10px] border bg-surface p-4 text-left transition-all duration-150 hover:-translate-y-0.5"
              style={{
                borderColor: completed ? "rgba(63,185,80,0.3)" : "#30363d",
              }}
            >
              <div className="flex items-start justify-between">
                <span className="text-[28px]" aria-hidden>{CATEGORY_EMOJIS[cat.id] || "\u{1F9E0}"}</span>
                {completed ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-green">
                    <CheckCircle2 className="size-3.5" aria-hidden /> Done
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-[14px] font-semibold text-foreground line-clamp-2">{cat.name}</p>
              {!completed && (
                <span className="mt-1 text-[11px] text-muted-foreground">10 questions</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   VIEW 2: QUIZ IN PROGRESS
   ═══════════════════════════════════════════════ */

function QuizInProgress({
  questions,
  currentQ,
  score,
  selectedAnswer,
  isCorrect,
  timeLeft,
  maxTime,
  timerPct,
  timerColor,
  circumference,
  onAnswer,
  onNext,
  selectedCategory,
  difficulty,
}: {
  questions: QuizQuestion[];
  currentQ: number;
  score: number;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  timeLeft: number;
  maxTime: number;
  timerPct: number;
  timerColor: string;
  circumference: number;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  selectedCategory: { id: number; name: string } | null;
  difficulty: string;
}) {
  const q = questions[currentQ];
  if (!q) return null;
  const wrongCount = currentQ - score + (isCorrect === false && selectedAnswer ? 1 : 0);
  const answered = currentQ + (selectedAnswer !== null ? 1 : 0);

  return (
    <div>
      {/* Sticky quiz header */}
      <div className="sticky top-0 z-10 -mx-4 -mt-5 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted-foreground">
            {CATEGORY_EMOJIS[selectedCategory?.id || 0] || "\u{1F9E0}"} {selectedCategory?.name}
          </span>
          <span className="text-[13px] font-medium text-foreground">
            Question {currentQ + 1} of {questions.length}
          </span>
          {/* Timer circle */}
          <div className="relative size-[50px]">
            <svg className="size-full -rotate-90" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="#21262d" strokeWidth="3" />
              <circle
                cx="30" cy="30" r="26" fill="none"
                stroke={timerColor}
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - timerPct / 100)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-[14px] font-bold"
              style={{ color: timerColor }}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2.5 h-1 rounded-full bg-surface-elevated">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${((currentQ + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100}%`, transition: "width 300ms ease" }}
          />
        </div>

        {/* Score tracker */}
        <div className="mt-1.5 flex justify-between text-[11px]">
          <span className="text-green">\u2713 {score} correct</span>
          <span className="text-red">\u2717 {answered - score} wrong</span>
        </div>
      </div>

      {/* Question card */}
      <div className="mt-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[17px] font-medium leading-relaxed text-foreground sm:text-[18px]">
            {q.question}
          </p>
          <span
            className="shrink-0 rounded px-2 py-0.5 text-[10px] font-medium capitalize"
            style={{
              background: q.difficulty === "easy" ? "rgba(63,185,80,0.1)" : q.difficulty === "hard" ? "rgba(248,81,73,0.1)" : "rgba(88,166,255,0.1)",
              color: q.difficulty === "easy" ? "#3fb950" : q.difficulty === "hard" ? "#f85149" : "#58a6ff",
            }}
          >
            {q.difficulty}
          </span>
        </div>

        {/* Answers */}
        <div className="mt-5 flex flex-col gap-2.5">
          {q.answers.map((answer) => {
            const isSelected = selectedAnswer === answer;
            const isCorrectAnswer = answer === q.correctAnswer;
            const showCorrect = selectedAnswer !== null && isCorrectAnswer;
            const showWrong = selectedAnswer !== null && isSelected && !isCorrectAnswer;

            let bg = "#21262d";
            let borderColor = "#30363d";
            let textColor = "#e6edf3";

            if (showCorrect) {
              bg = "rgba(63,185,80,0.15)";
              borderColor = "rgba(63,185,80,0.5)";
              textColor = "#3fb950";
            } else if (showWrong) {
              bg = "rgba(248,81,73,0.15)";
              borderColor = "rgba(248,81,73,0.5)";
              textColor = "#f85149";
            }

            return (
              <button
                key={answer}
                type="button"
                disabled={selectedAnswer !== null}
                onClick={() => onAnswer(answer)}
                className="min-h-[52px] w-full rounded-lg border px-4 py-3.5 text-left text-[15px] transition-all duration-150 disabled:cursor-default"
                style={{ background: bg, borderColor, color: textColor }}
              >
                <span className="line-clamp-3">{answer}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback + next */}
        {selectedAnswer !== null && (
          <div className="mt-4 flex items-center justify-between">
            <span
              className="text-[13px] font-medium"
              style={{ color: isCorrect ? "#3fb950" : "#f85149" }}
            >
              {isCorrect ? "\u2713 Correct!" : "\u2717 Wrong"}
            </span>
            <button
              type="button"
              onClick={onNext}
              className="min-h-[36px] rounded-lg border border-border bg-surface-elevated px-4 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {currentQ + 1 >= questions.length ? "See results" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   VIEW 3: RESULTS SCREEN
   ═══════════════════════════════════════════════ */

function ResultsScreen({
  score,
  total,
  answers,
  selectedCategory,
  difficulty,
  showReview,
  onToggleReview,
  onPlayAgain,
  onBackToPicker,
  onShare,
}: {
  score: number;
  total: number;
  answers: { question: string; correct: string; userAnswer: string; wasCorrect: boolean }[];
  selectedCategory: { id: number; name: string };
  difficulty: string;
  showReview: boolean;
  onToggleReview: () => void;
  onPlayAgain: () => void;
  onBackToPicker: () => void;
  onShare: () => void;
}) {
  const pct = Math.round((score / total) * 100);

  let emoji: string;
  let msg: string;
  let color: string;
  if (pct >= 90) { emoji = "\u{1F3C6}"; msg = "Perfect!"; color = "#d29922"; }
  else if (pct >= 70) { emoji = "\u{1F389}"; msg = "Great job!"; color = "#3fb950"; }
  else if (pct >= 50) { emoji = "\u{1F4AA}"; msg = "Good try!"; color = "#58a6ff"; }
  else { emoji = "\u{1F4DA}"; msg = "Keep learning!"; color = "#8b949e"; }

  const circumference = 2 * Math.PI * 52;
  const pctOffset = circumference * (1 - pct / 100);

  return (
    <div className="flex flex-col items-center pt-4">
      {/* Score circle */}
      <div className="relative size-[120px]">
        <svg className="size-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#21262d" strokeWidth="6" />
          <circle
            cx="60" cy="60" r="52" fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={pctOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[28px]">{emoji}</span>
          <span className="text-[20px] font-black" style={{ color }}>{pct}%</span>
        </div>
      </div>

      <p className="mt-3 text-[20px] font-bold text-foreground">
        {score} out of {total} correct
      </p>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {selectedCategory.name} \u2022 {difficulty}
      </p>

      {/* Streak */}
      {(() => {
        const s = getStreak();
        if (s.count > 1) return (
          <p className="mt-3 text-sm font-medium text-yellow">
            <Flame className="mr-1 inline size-4" aria-hidden />
            {s.count} day streak!
          </p>
        );
        return (
          <p className="mt-3 text-sm text-muted-foreground">Streak started!</p>
        );
      })()}

      {/* Review toggle */}
      <button
        type="button"
        onClick={onToggleReview}
        className="mt-5 min-h-[44px] rounded-lg border border-border bg-surface px-5 text-sm font-medium text-foreground transition-colors hover:text-primary"
      >
        {showReview ? "Hide review" : "Review your answers"}
      </button>

      {/* Review section */}
      {showReview && (
        <div className="mt-4 w-full max-w-lg">
          {answers.map((a, i) => (
            <div key={i} className="border-b border-border py-3">
              <p className="text-[13px] text-muted-foreground">
                {i + 1}. {a.question}
              </p>
              <p
                className="mt-1 text-[13px] font-medium"
                style={{ color: a.wasCorrect ? "#3fb950" : "#f85149" }}
              >
                {a.wasCorrect ? "\u2713" : "\u2717"} {a.userAnswer}
              </p>
              {!a.wasCorrect && (
                <p className="mt-0.5 text-[12px] text-green">
                  Correct: {a.correct}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex w-full max-w-sm flex-col gap-2.5">
        <button
          type="button"
          onClick={onPlayAgain}
          className="min-h-[44px] rounded-lg border border-primary bg-accent px-5 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          <RotateCcw className="mr-1.5 inline size-4" aria-hidden />
          Play again — same category
        </button>
        <button
          type="button"
          onClick={onBackToPicker}
          className="min-h-[44px] rounded-lg border border-border bg-surface px-5 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          Try a different category
        </button>
        <button
          type="button"
          onClick={onShare}
          className="min-h-[44px] rounded-lg border border-border bg-surface px-5 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          <Share2 className="mr-1.5 inline size-4" aria-hidden />
          Share your score
        </button>
      </div>
    </div>
  );
}
