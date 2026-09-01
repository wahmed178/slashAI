import { useState, useRef, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/reading")({
  component: SpeedReadingTrainer,
});

function SpeedReadingTrainer() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(300);
  const [fontSize, setFontSize] = useState(48);
  const [isRunning, setIsRunning] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const wordsRef = useRef<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startReading = useCallback(() => {
    if (!text.trim()) return;
    wordsRef.current = text.trim().split(/\s+/);
    setWordIndex(0);
    setProgress(0);
    setIsRunning(true);
    setCurrentWord(wordsRef.current[0] ?? "");
  }, [text]);

  const stopReading = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!isRunning || wordIndex >= wordsRef.current.length) {
      if (isRunning && wordIndex >= wordsRef.current.length) setIsRunning(false);
      return;
    }
    const interval = 60000 / wpm;
    setCurrentWord(wordsRef.current[wordIndex] ?? "");
    setProgress(Math.round((wordIndex / wordsRef.current.length) * 100));
    timerRef.current = setTimeout(() => setWordIndex((i) => i + 1), interval);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isRunning, wordIndex, wpm]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const normalMinutes = wordCount > 0 ? (wordCount / 238).toFixed(1) : "0";
  const speedMinutes = wordCount > 0 ? (wordCount / wpm).toFixed(1) : "0";

  return (
    <AppShell title="Speed Reading Trainer">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📖 Speed Reading Trainer</h1>
        <p className="mt-1 text-sm text-muted-foreground">RSVP technique — flash one word at a time to train your reading speed.</p>
      </header>

      {!isRunning ? (
        <div className="mx-auto max-w-2xl space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type any text here to practice reading..."
            className="h-40 w-full rounded-xl border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Speed: {wpm} WPM</label>
              <input type="range" min={100} max={1000} step={10} value={wpm} onChange={(e) => setWpm(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5"><span>100</span><span>1000</span></div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Font Size: {fontSize}px</label>
              <input type="range" min={24} max={80} step={4} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5"><span>24px</span><span>80px</span></div>
            </div>
          </div>
          {wordCount > 0 && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-surface p-3"><p className="text-lg font-bold text-foreground">{wordCount}</p><p className="text-[10px] text-muted-foreground">Words</p></div>
              <div className="rounded-lg bg-surface p-3"><p className="text-lg font-bold text-foreground">{normalMinutes}m</p><p className="text-[10px] text-muted-foreground">Normal speed</p></div>
              <div className="rounded-lg bg-surface p-3"><p className="text-lg font-bold text-primary">{speedMinutes}m</p><p className="text-[10px] text-muted-foreground">At {wpm} WPM</p></div>
            </div>
          )}
          <button onClick={startReading} disabled={!text.trim()} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40">Start Training</button>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{wordIndex + 1} / {wordsRef.current.length}</span>
            <span>{wpm} WPM</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-surface">
            <span className="font-bold text-foreground transition-all duration-75" style={{ fontSize: `${fontSize}px` }}>{currentWord}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setIsRunning((r) => !r); }} className="flex-1 rounded-xl border border-border bg-surface py-3 text-sm font-medium text-foreground hover:bg-surface-elevated transition-colors">
              {isRunning ? "Pause" : "Resume"}
            </button>
            <button onClick={stopReading} className="flex-1 rounded-xl bg-red-500/10 border border-red-500/20 py-3 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors">Stop</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
