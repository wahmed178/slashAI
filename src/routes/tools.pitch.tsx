import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/pitch")({
  component: ElevatorPitchBuilder,
});

function ElevatorPitchBuilder() {
  const [fields, setFields] = useState({
    product: "",
    audience: "",
    problem: "",
    different: "",
    ask: "",
  });
  const [isTiming, setIsTiming] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const update = (k: string, v: string) => setFields((p) => ({ ...p, [k]: v }));

  const pitch = `We built ${fields.product || "[your product]"} for ${fields.audience || "[your audience]"}. ${fields.problem ? `The problem is ${fields.problem}. ` : ""}${fields.different ? `What makes us different is ${fields.different}. ` : ""}${fields.ask || "[Your ask here]"}`;

  const wordCount = pitch.split(/\s+/).filter(Boolean).length;
  const readTimeSeconds = Math.ceil((wordCount / 150) * 60);

  const startTimer = () => {
    setIsTiming(true);
    setTimeLeft(60);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setIsTiming(false); clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const speak = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(pitch);
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <AppShell title="Elevator Pitch Builder">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎤 Elevator Pitch Builder</h1>
        <p className="mt-1 text-sm text-muted-foreground">Build a tight 60-second pitch. Practice with timer and read-aloud.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="space-y-3">
          {([
            ["product", "What does your product do?", "e.g. a free browser-based design tool"],
            ["audience", "Who is it for?", "e.g. indie hackers and solo founders"],
            ["problem", "What problem does it solve?", "e.g. expensive design tools lock out small teams"],
            ["different", "How is it different?", "e.g. zero signup, works offline, free forever"],
            ["ask", "What do you want from the listener?", "e.g. try it today at slashai.app"],
          ] as [string, string, string][]).map(([k, label, placeholder]) => (
            <div key={k}>
              <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
              <input value={(fields as any)[k]} onChange={(e) => update(k, e.target.value)} placeholder={placeholder}
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary/50" />
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground">Your Pitch</p>
            <span className={`text-xs font-medium ${wordCount > 150 ? "text-red-400" : "text-primary"}`}>{wordCount} words · ~{readTimeSeconds}s</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{pitch}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button onClick={speak} className="flex-1 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-foreground hover:bg-surface-elevated transition-colors">🔊 Read Aloud</button>
          <button onClick={startTimer} disabled={isTiming}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">
            {isTiming ? `${timeLeft}s` : "⏱ 60s Timer"}
          </button>
        </div>

        {isTiming && (
          <div className="h-2 rounded-full bg-surface overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${((60 - timeLeft) / 60) * 100}%` }} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
