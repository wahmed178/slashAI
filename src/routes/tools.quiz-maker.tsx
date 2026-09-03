import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/quiz-maker")({ component: QuizMaker });

interface Question {
  text: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
}

interface Quiz {
  title: string;
  questions: Question[];
}

const emptyQuestion = (): Question => ({ text: "", options: ["", "", "", ""], correct: 0, explanation: "" });

const STORAGE_KEY = "slashai-my-quizzes";

export default function QuizMaker() {
  const [mode, setMode] = useState<"build" | "play" | "list">(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) return "play";
    return "list";
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });

  const [quiz, setQuiz] = useState<Quiz>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) {
      try { return JSON.parse(decodeURIComponent(atob(params.get("q")!))); } catch { /* ignore */ }
    }
    return { title: "", questions: [emptyQuestion()] };
  });

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const addQuestion = () => setQuiz((q) => ({ ...q, questions: [...q.questions, emptyQuestion()] }));
  const removeQuestion = (i: number) => setQuiz((q) => ({ ...q, questions: q.questions.filter((_, idx) => idx !== i) }));
  const updateQuestion = (i: number, field: keyof Question, value: unknown) => {
    setQuiz((q) => {
      const questions = [...q.questions];
      const existing = questions[i];
      if (!existing) return q;
      questions[i] = { ...existing, [field]: value };
      return { ...q, questions };
    });
  };
  const updateOption = (qi: number, oi: number, val: string) => {
    setQuiz((q) => {
      const questions = [...q.questions];
      const existing = questions[qi];
      if (!existing) return q;
      const opts = [...existing.options] as [string, string, string, string];
      opts[oi] = val;
      questions[qi] = { ...existing, options: opts };
      return { ...q, questions };
    });
  };

  const saveQuiz = () => {
    setQuizzes((prev) => {
      const updated = [...prev, quiz];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setMode("list");
  };

  const startPlay = (q: Quiz) => {
    setQuiz(q);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setMode("play");
  };

  const answerQuestion = (idx: number) => {
    if (answers.length > currentQ) return;
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setShowResult(false);
    }
  };

  const generateShare = () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(quiz)));
    const url = `${window.location.origin}/tools/quiz-maker?q=${encoded}`;
    setShareUrl(url);
    navigator.clipboard?.writeText(url);
  };

  const deleteQuiz = (i: number) => {
    setQuizzes((prev) => {
      const updated = prev.filter((_, idx) => idx !== i);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const score = answers.filter((a, i) => a === (quiz.questions[i]?.correct ?? 0)).length;

  // Play mode
  if (mode === "play" && quiz.questions.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const q = quiz.questions[currentQ]!;
    const answered = currentQ < answers.length;
    const finished = currentQ >= quiz.questions.length - 1 && answered;

    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          <button onClick={() => setMode("list")} className="text-sm text-primary hover:underline">← Back to quizzes</button>
          <h1 className="text-xl font-bold text-foreground">{quiz.title || "Quiz"}</h1>

          {/* Progress */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }} />
          </div>
          <div className="text-xs text-muted-foreground">Question {currentQ + 1} of {quiz.questions.length}</div>

          {finished ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center space-y-4">
              <div className="text-5xl">{score === quiz.questions.length ? "🎉" : score > quiz.questions.length / 2 ? "👍" : "💪"}</div>
              <h2 className="text-2xl font-bold text-foreground">{score}/{quiz.questions.length}</h2>
              <p className="text-muted-foreground">{score === quiz.questions.length ? "Perfect score!" : `You got ${Math.round((score / quiz.questions.length) * 100)}% correct`}</p>
              <div className="flex gap-2 justify-center">
                <button onClick={generateShare} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background">🔗 Share Quiz</button>
                <button onClick={() => startPlay(quiz)} className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground">🔄 Try Again</button>
              </div>
              {shareUrl && <p className="text-xs text-primary break-all">{shareUrl}</p>}
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">{q.text}</h2>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  if (!opt) return null;
                  const isCorrect = i === q.correct;
                  const isSelected = answered && answers[currentQ] === i;
                  let cls = "border border-border bg-surface hover:bg-background";
                  if (answered && isCorrect) cls = "border border-green-500/50 bg-green-500/10";
                  else if (answered && isSelected) cls = "border border-red-500/50 bg-red-500/10";
                  return (
                    <button key={i} onClick={() => answerQuestion(i)} disabled={answered} className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-colors ${cls}`}>
                      <span className="font-medium text-foreground">{String.fromCharCode(65 + i)}.</span> {opt}
                    </button>
                  );
                })}
              </div>
              {showResult && q.explanation && (
                <div className="rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground">
                  💡 {q.explanation}
                </div>
              )}
              {showResult && (
                <button onClick={nextQuestion} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90">
                  {currentQ < quiz.questions.length - 1 ? "Next Question →" : "See Results"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Build mode
  if (mode === "build") {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">❓ Quiz Builder</h1>
            <button onClick={() => setMode("list")} className="text-sm text-primary hover:underline">← Back</button>
          </div>

          <input value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} placeholder="Quiz title..." className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-lg font-semibold text-foreground" />

          {quiz.questions.map((q, qi) => (
            <div key={qi} className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Q{qi + 1}</h3>
                {quiz.questions.length > 1 && <button onClick={() => removeQuestion(qi)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
              </div>
              <input value={q.text} onChange={(e) => updateQuestion(qi, "text", e.target.value)} placeholder="Question text..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <button onClick={() => updateQuestion(qi, "correct", oi)} className={`h-6 w-6 rounded-full border-2 text-xs ${q.correct === oi ? "border-green-500 bg-green-500/20 text-green-400" : "border-border text-muted-foreground"}`}>
                      {String.fromCharCode(65 + oi)}
                    </button>
                    <input value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oi)}`} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground" />
                  </div>
                ))}
              </div>
              <input value={q.explanation} onChange={(e) => updateQuestion(qi, "explanation", e.target.value)} placeholder="Explanation (shown after answer)..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground" />
            </div>
          ))}

          <div className="flex gap-2">
            <button onClick={addQuestion} className="flex-1 rounded-xl border border-border bg-surface py-3 text-sm text-foreground hover:bg-background">+ Add Question</button>
            <button onClick={saveQuiz} disabled={!quiz.title || quiz.questions.some((q) => !q.text)} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">💾 Save Quiz</button>
          </div>
        </div>
      </div>
    );
  }

  // List mode
  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">❓ Quiz Builder</h1>
            <p className="text-sm text-muted-foreground">Build and share quizzes — no account needed</p>
          </div>
          <button onClick={() => setMode("build")} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-background hover:opacity-90">+ Create Quiz</button>
        </div>

        {quizzes.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-12 text-center">
            <div className="mb-4 text-5xl">📝</div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">No quizzes yet</h3>
            <p className="text-sm text-muted-foreground">Create your first quiz and share it with anyone!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {quizzes.map((q, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                <div>
                  <h3 className="font-semibold text-foreground">{q.title}</h3>
                  <p className="text-xs text-muted-foreground">{q.questions.length} questions</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startPlay(q)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-background">▶ Play</button>
                  <button onClick={() => { setQuiz(q); setMode("build"); }} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">✏️ Edit</button>
                  <button onClick={() => deleteQuiz(i)} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-red-400">🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
