import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/speech-rehearsal")({ component: SpeechRehearsal });

/**
 * Speech Rehearsal — paste a speech, read it out loud once, and get the
 * analysis a coach would give: how long it ran, whether your pace hits the
 * 130–150 wpm sweet spot audiences actually follow, which paragraphs blow
 * the schedule, and (on Chrome) which filler words kept slipping in.
 * The mic transcript, when available, is processed on-device only.
 */

const WPM_MIN = 130;
const WPM_MAX = 150;
const FILLERS = ["um", "uh", "like", "actually", "basically", "literally", "you know", "kind of", "sort of", "so yeah"];

function countWords(t: string): number {
  return t.trim() ? t.trim().split(/\s+/).length : 0;
}

function SpeechRehearsal() {
  const [text, setText] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState<{ seconds: number; wpm: number }[]>([]);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const words = useMemo(() => countWords(text), [text]);
  /** ideal duration at the sweet spot, shown before you start */
  const idealSecs = words > 0 ? Math.round((words / ((WPM_MIN + WPM_MAX) / 2)) * 60) : 0;

  const paragraphs = useMemo(
    () =>
      text
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => ({ i, w: countWords(p), secs: Math.round((countWords(p) / 140) * 60) })),
    [text],
  );

  const start = useCallback(() => {
    setSeconds(0);
    setRunning(true);
    setTranscript("");
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (seconds > 3 && words > 0) {
      setRuns((r) => [{ seconds, wpm: Math.round((words / seconds) * 60) }, ...r].slice(0, 5));
    }
    recRef.current?.stop();
    setListening(false);
  }, [seconds, words]);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recRef.current?.stop();
  }, []);

  const wpm = seconds > 3 && words > 0 ? Math.round((words / seconds) * 60) : null;
  const verdict =
    wpm === null
      ? null
      : wpm < WPM_MIN
        ? { tone: "slow", msg: `You're at ${wpm} wpm — slower than the 130–150 sweet spot. Deliberate is fine; drag is not. Trim text or pick up slightly.` }
        : wpm > WPM_MAX
          ? { tone: "fast", msg: `You're at ${wpm} wpm — faster than audiences can comfortably follow. Breathe at every paragraph break.` }
          : { tone: "good", msg: `${wpm} wpm — right in the pocket where audiences follow best. Keep that pace.` };

  /** filler-word analysis on the mic transcript */
  const fillerHits = useMemo(() => {
    if (!transcript) return [];
    const lower = transcript.toLowerCase();
    return FILLERS.map((f) => {
      const matches = lower.match(new RegExp(`\\b${f.replace(/ /g, "\\s+")}\\b`, "g"));
      return { word: f, count: matches ? matches.length : 0 };
    }).filter((x) => x.count > 0);
  }, [transcript]);

  const toggleMic = async () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    try {
      const SR = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike })
        .SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
      if (!SR) {
        setMicError(true);
        return;
      }
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-IN";
      let acc = "";
      rec.onresult = (e: SpeechEventLike) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i]!.isFinal) acc += e.results[i]![0]!.transcript + " ";
        }
        setTranscript(acc.trim());
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setMicError(true);
      rec.start();
      recRef.current = rec;
      setListening(true);
      setMicError(false);
    } catch {
      setMicError(true);
    }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <AppShell title="Speech Rehearsal">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎤 Speech Rehearsal</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Paste your speech, read it out loud once with the timer running, and get the coaching numbers:
          real duration, your words-per-minute against the 130–150 pocket, per-paragraph budget, and — if
          your browser supports it — which filler words crept in. All on-device.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={9}
          placeholder={"Paste your speech here. Blank lines split paragraphs.\n\nEach paragraph gets its own time budget."}
          className="w-full rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-foreground outline-none focus:border-primary/60"
        />

        {words > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm">
            <span className="text-muted-foreground">
              {words} words · <span className="font-bold text-foreground">~{fmt(idealSecs)}</span> at 140 wpm
            </span>
            <span className="text-xs text-muted-foreground">aim 130–150 wpm</span>
          </div>
        )}

        {/* the timer */}
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          <p className={`text-5xl font-black tabular-nums ${running ? "text-primary" : "text-foreground"}`}>{fmt(seconds)}</p>
          {wpm !== null && <p className="mt-1 text-sm font-semibold text-muted-foreground">{wpm} words per minute</p>}
          <div className="mt-4 flex justify-center gap-2">
            {!running ? (
              <button onClick={start} disabled={words < 10} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-background disabled:opacity-40">
                ▶ Start reading
              </button>
            ) : (
              <button onClick={stop} className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white active:scale-95">
                ■ I finished
              </button>
            )}
            <button
              onClick={toggleMic}
              disabled={!running}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold disabled:opacity-40 ${listening ? "border-red-500 bg-red-500/10 text-red-500" : "border-border text-foreground"}`}
            >
              {listening ? "● Listening" : "Filler check"}
            </button>
          </div>
          {micError && <p className="mt-2 text-xs text-amber-600">Filler detection needs Chrome/Edge and mic permission — the timer works everywhere.</p>}
          {verdict && <p className={`mt-3 text-sm font-medium ${verdict.tone === "good" ? "text-emerald-600" : "text-amber-600"}`}>{verdict.msg}</p>}
        </div>

        {/* paragraph budgets */}
        {paragraphs.length > 1 && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Paragraph time budget</p>
            <div className="space-y-1.5">
              {paragraphs.slice(0, 8).map((p) => (
                <div key={p.i} className="flex items-center gap-2 text-xs">
                  <span className="w-8 shrink-0 text-muted-foreground">#{p.i + 1}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.min(100, (p.secs / Math.max(1, idealSecs)) * 100 * (paragraphs.length / 2))}%` }} />
                  </div>
                  <span className="w-12 shrink-0 text-right font-semibold text-foreground">{fmt(p.secs)}</span>
                  <span className="w-14 shrink-0 text-right text-muted-foreground">{p.w}w</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* run history */}
        {runs.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your takes</p>
            {runs.map((r, i) => (
              <div key={i} className="flex justify-between border-b border-border/50 py-1.5 text-xs last:border-0">
                <span className="text-muted-foreground">Take {runs.length - i} — {fmt(r.seconds)}</span>
                <span className={`font-bold ${r.wpm < WPM_MIN ? "text-sky-500" : r.wpm > WPM_MAX ? "text-amber-500" : "text-emerald-600"}`}>{r.wpm} wpm</span>
              </div>
            ))}
          </div>
        )}

        {/* filler words */}
        {transcript && fillerHits.length > 0 && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700">Filler words the mic caught</p>
            <div className="flex flex-wrap gap-2">
              {fillerHits.map((f) => (
                <span key={f.word} className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700">
                  "{f.word}" ×{f.count}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <FaqSection />
    </AppShell>
  );
}

/* minimal structural types so the tool compiles without DOM lib extensions */
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}
interface SpeechEventLike {
  resultIndex: number;
  results: { length: number; [i: number]: { isFinal: boolean; [j: number]: { transcript: string } } };
}
