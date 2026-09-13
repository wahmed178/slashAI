import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/dangerous-writing")({ component: DangerousWriting });

const PROMPTS = [
  "Write about the last time you felt genuinely surprised.",
  "Describe your morning in exactly 40 words. Go.",
  "What is something you keep postponing? Start explaining why.",
  "The best advice you ever ignored — write it down.",
  "Describe a room you love without naming the room.",
];

function DangerousWriting() {
  const [phase, setPhase] = useState<"idle" | "running" | "lost" | "saved">("idle");
  const [text, setText] = useState("");
  const [left, setLeft] = useState(15);
  const [words, setWords] = useState(0);
  const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]!);
  const timer = useRef<number | null>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // every keystroke resets a 15s fuse; running out deletes the session
  useEffect(() => {
    if (phase !== "running") return;
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer.current!);
          setPhase("lost");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [phase]);

  const start = () => {
    setText("");
    setLeft(15);
    setWords(0);
    setPhase("running");
    requestAnimationFrame(() => areaRef.current?.focus());
  };

  const onChange = (v: string) => {
    setText(v);
    setLeft(15);
    setWords(v.trim() ? v.trim().split(/\s+/).length : 0);
  };

  const save = () => {
    if (timer.current) window.clearInterval(timer.current);
    setPhase("saved");
  };

  const urgent = phase === "running" && left <= 5;
  const meter = useMemo(() => Math.max(0, Math.min(100, (left / 15) * 100)), [left]);

  return (
    <AppShell title="Dangerous Writing" wide>
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">✍️ The Dangerous Writing App</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stop typing for 15 seconds and everything you wrote disappears. Keep moving.
        </p>
      </header>

      {phase === "idle" && (
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-surface p-6 text-center">
          <p className="text-[40px]">⏱️</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Prompt: <span className="font-semibold text-foreground">{prompt}</span>
          </p>
          <button
            onClick={start}
            className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            I'm ready — start the timer
          </button>
        </div>
      )}

      {phase === "running" && (
        <>
          <div className="mx-auto mb-3 flex max-w-3xl items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-elevated">
              <div
                className="h-full rounded-full transition-[width] duration-1000 ease-linear"
                style={{
                  width: `${meter}%`,
                  background: urgent ? "var(--destructive)" : "var(--primary)",
                }}
              />
            </div>
            <span
              className={`w-16 text-right font-mono text-sm font-bold ${urgent ? "animate-pulse text-destructive" : "text-muted-foreground"}`}
            >
              {left}s
            </span>
          </div>
          <textarea
            ref={areaRef}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Don't stop. Don't edit. Just write…"
            className="mx-auto block h-[52vh] max-h-[540px] w-full max-w-3xl resize-none rounded-xl border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
          <div className="mx-auto mt-3 flex max-w-3xl items-center justify-between">
            <p className="text-xs text-muted-foreground">{words} words written</p>
            <button
              onClick={save}
              className="rounded-lg border border-border bg-surface px-4 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Save & stop the timer
            </button>
          </div>
        </>
      )}

      {phase === "lost" && (
        <div className="mx-auto max-w-lg rounded-xl border border-destructive/40 bg-surface p-8 text-center">
          <p className="text-[40px]">💨</p>
          <h2 className="mt-1 text-lg font-bold text-foreground">Everything is gone.</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {words} words, vanished. The page forgives. The timer doesn't.
          </p>
          <button
            onClick={start}
            className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try again
          </button>
        </div>
      )}

      {phase === "saved" && (
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-[40px]">🎉</p>
          <h2 className="mt-1 text-lg font-bold text-foreground">You survived.</h2>
          <p className="mt-1 text-sm text-muted-foreground">{words} words are still yours.</p>
          <textarea
            value={text}
            readOnly
            className="mt-4 h-40 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground"
          />
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(text)}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              Copy
            </button>
            <button
              onClick={start}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              New round
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
