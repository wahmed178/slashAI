import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Download,
  Lightbulb,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

import { AppShell } from "@/components/library/AppShell";
import {
  INTERVIEW_QUESTION_COUNT,
  pickInterviewQuestions,
  ROLES_META,
  type InterviewLevel,
  type InterviewQuestion,
  type InterviewRole,
  type InterviewType,
} from "@/lib/interview-questions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/interview")({
  head: () => ({
    meta: [
      { title: "Mock Interview Simulator — practice with feedback | SlashAI" },
      {
        name: "description",
        content:
          "Practice real interview questions for developer, design, data, product and more. Voice or typed answers with instant feedback on length, fillers, STAR and pace.",
      },
    ],
  }),
  component: InterviewTool,
});

/* ------------------------------ feedback ------------------------------ */

const FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "literally"] as const;

const STAR = {
  S: ["when", "during", "at my", "at the", "i was", "in my previous", "at [company]"],
  T: ["i had to", "needed to", "responsible for", "was asked to", "my task"],
  A: ["i did", "i created", "i implemented", "i spoke", "i built", "i wrote", "i designed", "i introduced", "i led"],
  R: ["resulted in", "increased", "reduced", "improved", "successfully", "outcome was", "led to", "as a result"],
} as const;

interface Feedback {
  words: number;
  fillers: Record<string, number>;
  fillerCount: number;
  star?: Record<keyof typeof STAR, boolean>;
  mentioned: string[];
  missing: string[];
  wpm: number | null;
  score: number;
}

function analyseAnswer(q: InterviewQuestion, text: string, seconds: number, voice: boolean): Feedback {
  const lower = ` ${text.toLowerCase()} `;
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  const fillers: Record<string, number> = {};
  let fillerCount = 0;
  for (const f of FILLER_WORDS) {
    const re = new RegExp(`\\b${f.replace(" ", "\\s+")}\\b`, "g");
    const m = lower.match(re);
    const n = m ? m.length : 0;
    if (n > 0) {
      fillers[f] = n;
      fillerCount += n;
    }
  }

  const mentioned: string[] = [];
  const missing: string[] = [];
  for (const k of q.keywords) {
    if (lower.includes(k.toLowerCase())) mentioned.push(k);
    else missing.push(k);
  }

  let star: Feedback["star"];
  if (q.type === "behavioral") {
    star = {
      S: STAR.S.some((p) => lower.includes(p)),
      T: STAR.T.some((p) => lower.includes(p)),
      A: STAR.A.some((p) => lower.includes(p)),
      R: STAR.R.some((p) => lower.includes(p)),
    };
  }

  const wpm = voice && seconds > 5 ? Math.round((words / seconds) * 60) : null;

  let score = 100;
  if (words < 50) score -= 10;
  else if (words > 300) score -= 12;
  score -= Math.min(20, fillerCount * 2);
  if (star) {
    for (const v of Object.values(star)) if (!v) score -= 5;
  }
  score -= Math.min(12, missing.length * 2);
  if (wpm !== null && (wpm < 100 || wpm > 180)) score -= 6;
  score = Math.max(0, Math.min(100, score));

  const fb: Feedback = { words, fillers, fillerCount, mentioned, missing, wpm, score };
  if (star) fb.star = star;
  return fb;
}

/* ------------------------------ speech ------------------------------- */

type RecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort?: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
};

function speechSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as any;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

/* -------------------------------- page ------------------------------- */

type Phase = "setup" | "active" | "feedback" | "summary";

const DURATIONS = [
  { id: "15", label: "15 min", desc: "5 questions", q: 5 },
  { id: "30", label: "30 min", desc: "10 questions", q: 10 },
  { id: "full", label: "Full", desc: "20 questions", q: 20 },
] as const;

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function InterviewTool() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [role, setRole] = useState<InterviewRole>("developer");
  const [level, setLevel] = useState<InterviewLevel>("mid");
  const [type, setType] = useState<InterviewType | "mixed">("behavioral");
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>(DURATIONS[1]!);

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [answer, setAnswer] = useState("");
  const [liveText, setLiveText] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [showTip, setShowTip] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [results, setResults] = useState<{ q: InterviewQuestion; text: string; seconds: number; voice: boolean; fb: Feedback }[]>([]);

  const recognitionRef = useRef<RecognitionLike | null>(null);
  const voiceSupported = useMemo(() => speechSupported(), []);
  const speakStartRef = useRef<number | null>(null);

  const question = questions[qi];

  const stopRecognition = useCallback(() => {
    setListening(false);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  useEffect(
    () => () => {
      recognitionRef.current?.abort?.();
    },
    [],
  );

  // question timer
  useEffect(() => {
    if (phase !== "active") return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase, qi]);

  // voice recogniser while a question is live
  useEffect(() => {
    if (phase !== "active" || !listening) return;
    const w = window as any;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setVoiceError("Voice capture needs Chrome or Edge — type your answer instead.");
      setListening(false);
      return;
    }
    setVoiceError("");
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript as string;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      if (final) setAnswer((a) => (a ? `${a} ${final}` : final).trim());
      if (interim) setLiveText(interim);
    };
    rec.onerror = (e: any) => {
      setListening(false);
      setVoiceError(
        e?.error === "not-allowed"
          ? "Microphone permission denied — allow mic access and try again."
          : "Voice capture failed — you can type your answer instead.",
      );
    };
    rec.onend = () => {
      setListening(false);
      setLiveText("");
      recognitionRef.current = null;
    };
    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      setVoiceError("Could not start the microphone — type your answer instead.");
      setListening(false);
    }
  }, [phase, listening, qi]);

  const startInterview = () => {
    const qs = pickInterviewQuestions({ role, type, level, count: duration.q });
    if (qs.length === 0) {
      toast("No questions match that combination — try a different type.");
      return;
    }
    setQuestions(qs);
    setQi(0);
    setSeconds(0);
    setAnswer("");
    setLiveText("");
    setResults([]);
    setFeedback(null);
    setShowTip(false);
    setPhase("active");
  };

  const toggleListening = () => {
    if (listening) {
      stopRecognition();
      return;
    }
    setAnswer("");
    speakStartRef.current = Math.floor(Date.now() / 1000);
    setListening(true);
  };

  const finishAnswer = () => {
    if (listening) stopRecognition();
    const text = answer.trim() || liveText.trim();
    if (!text) {
      toast("Say or type something first — even a rough draft counts.");
      return;
    }
    const voice = Boolean(speakStartRef.current) && answer.trim().length > 0;
    const spokenSecs = voice && speakStartRef.current
      ? Math.max(1, Math.floor(Date.now() / 1000) - speakStartRef.current)
      : seconds;
    speakStartRef.current = null;
    const fb = analyseAnswer(question!, text, spokenSecs, voice);
    setFeedback(fb);
    setResults((prev) => [...prev, { q: question!, text, seconds: spokenSecs, voice, fb }]);
    setPhase("feedback");
  };

  const next = () => {
    setAnswer("");
    setLiveText("");
    setFeedback(null);
    setShowTip(false);
    if (qi + 1 >= questions.length) {
      setPhase("summary");
    } else {
      setQi((i) => i + 1);
      setSeconds(0);
      setPhase("active");
    }
  };

  const overallScore = useMemo(() => {
    if (results.length === 0) return 0;
    return Math.round(results.reduce((s, r) => s + r.fb.score, 0) / results.length);
  }, [results]);

  const worstArea = useMemo(() => {
    if (results.length === 0) return "—";
    const areas: Record<string, number> = { "answer length": 0, fillers: 0, keywords: 0, pace: 0, STAR: 0 };
    for (const r of results) {
      if (r.fb.words < 50) areas["answer length"] = (areas["answer length"] ?? 0) + 1;
      if (r.fb.words > 300) areas["answer length"] = (areas["answer length"] ?? 0) + 1;
      if (r.fb.fillerCount > 0) areas["fillers"] = (areas["fillers"] ?? 0) + 1;
      if (r.fb.missing.length > 0) areas["keywords"] = (areas["keywords"] ?? 0) + 1;
      if (r.fb.star) for (const v of Object.values(r.fb.star)) if (!v) areas["STAR"] = (areas["STAR"] ?? 0) + 1;
      if (r.fb.wpm !== null && (r.fb.wpm < 100 || r.fb.wpm > 180)) areas["pace"] = (areas["pace"] ?? 0) + 1;
    }
    return (Object.entries(areas).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—").replace("STAR", "the STAR method");
  }, [results]);

  const gradeOf = (s: number) => (s >= 85 ? "A" : s >= 70 ? "B" : s >= 55 ? "C" : s >= 40 ? "D" : "F");
  const gradeColor = (s: number) =>
    s >= 85 ? "text-chart-2" : s >= 70 ? "text-chart-3" : s >= 55 ? "text-[#d29922]" : "text-[#f85149]";

  const downloadReport = () => {
    if (results.length === 0) return;
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Mock Interview Report", 14, 18);
    pdf.setFontSize(11);
    pdf.text(
      `${ROLES_META.find((r) => r.id === role)?.label} · ${level} · ${type} · ${results.length} questions`,
      14,
      26,
    );
    pdf.text(`Overall score: ${overallScore} (${gradeOf(overallScore)}) — weakest area: ${worstArea}`, 14, 33);
    let y = 43;
    pdf.setFontSize(10);
    results.forEach((r, i) => {
      if (y > 275) {
        pdf.addPage();
        y = 18;
      }
      pdf.text(`${i + 1}. ${r.q.question.slice(0, 70)}`, 14, y);
      pdf.text(`   Score ${r.fb.score}/100 · ${r.fb.words} words${r.fb.wpm ? ` · ~${r.fb.wpm} wpm` : ""}`, 16, y + 5);
      y += 12;
    });
    pdf.save("interview-report.pdf");
    toast("Report downloaded");
  };

  const restart = () => {
    setPhase("setup");
    setQuestions([]);
    setResults([]);
    setQi(0);
    setAnswer("");
  };

  const timerColor =
    seconds > 120 ? "text-red-400" : seconds > 60 ? "text-[#d29922]" : "text-chart-2";

  /* ------------------------------ setup ------------------------------ */
  if (phase === "setup") {
    return (
      <AppShell title="Mock Interview" back={{ to: "/tools", label: "SlashKits" }}>
        <header className="pt-2">
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            🎤 Mock Interview
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Practice with {INTERVIEW_QUESTION_COUNT.toLocaleString()} real-style questions and get instant
            feedback on every answer.
          </p>
        </header>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="panel rounded-xl p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-foreground">Set up your interview</h2>

            <label className="mt-4 block text-[12px] font-medium text-muted-foreground">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as InterviewRole)}
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary/60"
            >
              {ROLES_META.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-[12px] font-medium text-muted-foreground">Experience level</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {(["junior", "mid", "senior"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-[13px] font-medium capitalize transition-colors",
                    level === l
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-[12px] font-medium text-muted-foreground">Interview type</label>
            <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                [
                  { id: "behavioral", label: "Behavioral" },
                  { id: "technical", label: "Technical" },
                  { id: "situational", label: "Situational" },
                  { id: "hr", label: "HR" },
                  { id: "mixed", label: "Mixed" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors",
                    type === t.id
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-[12px] font-medium text-muted-foreground">Duration</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left transition-colors",
                    duration.id === d.id
                      ? "border-primary/50 bg-primary/15"
                      : "border-border bg-surface hover:border-primary/30",
                  )}
                >
                  <span className="block text-[14px] font-semibold text-foreground">{d.label}</span>
                  <span className="block text-[11px] text-muted-foreground">{d.desc}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={startInterview}
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[15px] font-bold text-background transition-opacity hover:opacity-90"
            >
              <Play className="size-4" /> Start interview
            </button>
            {!voiceSupported && (
              <p className="mt-3 text-[12px] text-muted-foreground">
                🎙️ Voice answers work best in Chrome or Edge — typing answers works everywhere.
              </p>
            )}
          </div>

          <aside className="min-w-0">
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="text-sm font-semibold text-foreground">How it works</h3>
              <ol className="mt-2 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
                <li>1. Answer each question out loud (or by typing).</li>
                <li>2. Get instant feedback — length, filler words, STAR, keywords, pace.</li>
                <li>3. Finish with a score, your weakest area, and a PDF report.</li>
              </ol>
              <p className="mt-3 rounded-lg border border-border bg-surface-elevated p-2.5 text-[12px] leading-relaxed text-muted-foreground">
                💡 Behavioral answers land best with the <strong className="text-foreground">STAR</strong>{" "}
                method: Situation → Task → Action → Result.
              </p>
            </div>
            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              100% free, on-device.{" "}
              <Link to="/tools" className="text-primary hover:underline">
                More tools →
              </Link>
            </p>
          </aside>
        </div>
      </AppShell>
    );
  }

  /* ---------------------------- feedback view ---------------------------- */
  if (phase === "feedback" && feedback && question) {
    const lv =
      feedback.words < 50
        ? { ok: false, msg: "Too brief — aim for 1–2 minutes of substance." }
        : feedback.words > 300
          ? { ok: false, msg: "Too long — be more concise and structured." }
          : { ok: true, msg: "Good length." };
    const pace =
      feedback.wpm === null
        ? null
        : feedback.wpm < 100
          ? { ok: false, msg: `Speaking slowly (~${feedback.wpm} wpm) — a more confident pace reads better.` }
          : feedback.wpm > 180
            ? { ok: false, msg: `Speaking quickly (~${feedback.wpm} wpm) — slow down a little.` }
            : { ok: true, msg: `Good pace (~${feedback.wpm} wpm).` };

    return (
      <AppShell title="Mock Interview" back={{ to: "/tools", label: "SlashKits" }}>
        <header className="pt-2">
          <p className="text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
            Feedback — question {qi + 1} of {questions.length}
          </p>
        </header>

        <div className="panel mt-3 rounded-xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[13px] text-muted-foreground">{question.type} · {question.level.join("/")}</span>
            <span className={cn("text-2xl font-black", gradeColor(feedback.score))}>
              {feedback.score}
              <span className="text-sm font-semibold text-muted-foreground">/100</span>
            </span>
          </div>
          <p className="mt-1 text-[13px] font-medium text-foreground">{question.question}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2 rounded-lg border border-border bg-surface-elevated/60 p-3">
              <Check className={cn("mt-0.5 size-4 shrink-0", lv.ok ? "text-chart-2" : "text-[#d29922]")} />
              <div>
                <p className="text-[13px] text-foreground">
                  <strong>{feedback.words}</strong> words —{" "}
                  <span className={lv.ok ? "text-chart-2" : "text-[#d29922]"}>{lv.msg}</span>
                </p>
                {feedback.words >= 50 && feedback.words <= 200 && (
                  <p className="text-[11px] text-muted-foreground">✓ Good length for a first pass.</p>
                )}
              </div>
            </div>

            {feedback.fillerCount > 0 && (
              <div className="flex items-start gap-2 rounded-lg border border-border bg-surface-elevated/60 p-3">
                <X className="mt-0.5 size-4 shrink-0 text-[#d29922]" />
                <p className="text-[13px] text-foreground">
                  You used filler words{" "}
                  <strong>{feedback.fillerCount} time{feedback.fillerCount > 1 ? "s" : ""}</strong> —{" "}
                  {Object.entries(feedback.fillers)
                    .map(([w, n]) => `“${w}” ${n}×`)
                    .join(", ")}
                </p>
              </div>
            )}

            {feedback.star && (
              <div className="rounded-lg border border-border bg-surface-elevated/60 p-3">
                <p className="text-[13px] font-semibold text-foreground">STAR structure</p>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                  {(["S", "T", "A", "R"] as const).map((k) => (
                    <span
                      key={k}
                      className={cn(
                        "flex items-center justify-between rounded-md border px-2 py-1 text-[12px]",
                        feedback.star![k]
                          ? "border-chart-2/40 text-chart-2"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {k}
                      {feedback.star![k] ? " ✓" : " ✗"}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-border bg-surface-elevated/60 p-3">
              <p className="text-[13px] font-semibold text-foreground">Keywords from the question</p>
              <p className="mt-1 flex flex-wrap gap-1.5 text-[12px]">
                {question.keywords.slice(0, 8).map((k) => (
                  <span
                    key={k}
                    className={cn(
                      "rounded-full border px-2 py-0.5",
                      feedback.mentioned.includes(k)
                        ? "border-chart-2/40 text-chart-2"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {k} {feedback.mentioned.includes(k) ? "✓" : "✗"}
                  </span>
                ))}
              </p>
              {feedback.missing.length > 0 && (
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Try working in: {feedback.missing.slice(0, 5).join(", ")}
                </p>
              )}
            </div>

            {pace && (
              <div className="flex items-start gap-2 rounded-lg border border-border bg-surface-elevated/60 p-3">
                <span className={cn("mt-0.5 size-2 rounded-full", pace.ok ? "bg-chart-2" : "bg-[#d29922]")} />
                <p className="text-[13px] text-foreground">{pace.msg}</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowTip((v) => !v)}
              className="flex items-center gap-1.5 text-[13px] text-[#d29922] transition-colors hover:text-[#e3b341]"
            >
              <Lightbulb className="size-4" /> {showTip ? "Hide tip" : "Tip"}
            </button>
            <button
              type="button"
              onClick={next}
              className="flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[14px] font-bold text-background transition-opacity hover:opacity-90"
            >
              {qi + 1 >= questions.length ? "See results" : "Next question"} <ArrowRight className="size-4" />
            </button>
          </div>
          {showTip && (
            <p className="mt-3 rounded-lg border border-[rgba(210,153,34,0.3)] bg-[rgba(210,153,34,0.08)] p-3 text-[13px] leading-relaxed text-foreground">
              💡 {question.tips}
            </p>
          )}
        </div>
      </AppShell>
    );
  }

  /* ----------------------------- summary ----------------------------- */
  if (phase === "summary") {
    return (
      <AppShell title="Mock Interview" back={{ to: "/tools", label: "SlashKits" }}>
        <header className="pt-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Interview complete 🎉</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {results.length} answers · {ROLES_META.find((r) => r.id === role)?.label} · {level}
          </p>
        </header>

        <div className="panel mt-4 rounded-xl p-5 text-center">
          <p className="text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">Overall score</p>
          <p className={cn("mt-1 text-6xl font-black tracking-tight", gradeColor(overallScore))}>
            {overallScore}
          </p>
          <p className="mt-1 text-lg font-bold text-foreground">Grade {gradeOf(overallScore)}</p>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
            Weakest area: <strong className="text-foreground">{worstArea}</strong> — focus your next practice
            session there.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={downloadReport}
              className="flex min-h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-bold text-background transition-opacity hover:opacity-90"
            >
              <Download className="size-4" /> Download report (PDF)
            </button>
            <button
              type="button"
              onClick={restart}
              className="flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-4 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/50"
            >
              <RotateCcw className="size-4" /> Start again
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {results.map((r, i) => (
            <details key={r.q.id} className="panel group rounded-xl p-0 open:pb-0">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg font-bold", gradeColor(r.fb.score))}>
                  {r.fb.score}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-foreground">{r.q.question}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {r.fb.words} words · {r.q.type}
                  </span>
                </span>
                <span className="text-muted-foreground">▾</span>
              </summary>
              <div className="border-t border-border px-4 py-3">
                <p className="text-[12px] text-muted-foreground">
                  <span className="font-semibold text-foreground">Your answer:</span> “{r.text.slice(0, 240)}
                  {r.text.length > 240 ? "…" : ""}”
                </p>
                <p className="mt-1.5 text-[12px] text-muted-foreground">
                  💡 {r.q.tips}
                </p>
              </div>
            </details>
          ))}
        </div>
      </AppShell>
    );
  }

  /* ----------------------------- active ----------------------------- */
  return (
    <AppShell title="Mock Interview" back={{ to: "/tools", label: "SlashKits" }}>
      <header className="pt-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
            Question {qi + 1} of {questions.length}
          </p>
          <span className={cn("font-mono text-[13px] font-bold", timerColor)}>{fmt(seconds)}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((qi + 1) / questions.length) * 100}%` }}
          />
        </div>
      </header>

      <div className="panel mt-4 rounded-xl p-5 text-center sm:p-6">
        <h2 className="mx-auto max-w-xl text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
          {question?.question}
        </h2>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-[11px] capitalize text-muted-foreground">
            {question?.type}
          </span>
          <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-[11px] text-muted-foreground">
            level: {level}
          </span>
          <button
            type="button"
            onClick={() => setShowTip((v) => !v)}
            className="flex items-center gap-1 rounded-full border border-[rgba(210,153,34,0.35)] bg-[rgba(210,153,34,0.08)] px-2.5 py-0.5 text-[11px] text-[#d29922] transition-colors hover:text-[#e3b341]"
          >
            <Lightbulb className="size-3" /> {showTip ? "Hide tip" : "Tip"}
          </button>
        </div>
        {showTip && question && (
          <p className="mx-auto mt-3 max-w-lg rounded-lg border border-[rgba(210,153,34,0.3)] bg-[rgba(210,153,34,0.08)] p-3 text-left text-[13px] leading-relaxed text-muted-foreground">
            💡 {question.tips}
          </p>
        )}
      </div>

      <div className="panel mt-4 rounded-xl p-4">
        {voiceSupported && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-xl px-4 text-[13px] font-bold transition-colors",
                listening
                  ? "bg-[rgba(248,81,73,0.15)] text-red-400 ring-1 ring-red-500/40"
                  : "bg-primary text-background hover:opacity-90",
              )}
            >
              {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              {listening ? "Stop speaking" : "Start speaking"}
            </button>
            {listening && (
              <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                <span className="size-2 animate-pulse rounded-full bg-red-400" /> Listening… speak naturally
              </span>
            )}
            {voiceError && <span className="text-[12px] text-red-300">{voiceError}</span>}
          </div>
        )}

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here… (or use the microphone above)"
          rows={7}
          className="mt-3 w-full resize-y rounded-xl border border-border bg-surface p-3 text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60"
        />
        {listening && liveText && (
          <p className="mt-2 text-[13px] text-muted-foreground">
            <span className="text-red-300">Speaking…</span> “{liveText}”
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[12px] text-muted-foreground">
            {answer.trim() ? `${answer.trim().split(/\s+/).length} words` : "0 words"}
          </span>
          <button
            type="button"
            onClick={finishAnswer}
            disabled={!answer.trim()}
            className="flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[14px] font-bold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Finish answer <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
