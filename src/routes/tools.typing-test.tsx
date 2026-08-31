import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw, Trophy, Clock, Target } from "lucide-react";

export const Route = createFileRoute("/tools/typing-test")({
  head: () => ({ meta: [{ title: "Typing Speed Test — SlashAI" }] }),
  component: TypingTest,
});

const TEXTS: Record<string, string[]> = {
  Normal: [
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
    "A journey of a thousand miles begins with a single step. The only way to do great work is to love what you do.",
    "Success is not final and failure is not fatal. It is the courage to continue that counts.",
    "The best time to plant a tree was twenty years ago. The second best time is now.",
    "In the middle of difficulty lies opportunity. Life is what happens when you are busy making other plans.",
  ],
  Code: [
    "const fetchData = async (url: string) => { const res = await fetch(url); return res.json(); }",
    "function binarySearch(arr: number[], target: number): number { let left = 0; let right = arr.length - 1; }",
    "import React, { useState, useEffect } from 'react'; useEffect(() => { document.title = count; }, [count]);",
    "SELECT users.name, orders.total FROM users INNER JOIN orders ON users.id = orders.user_id WHERE orders.total > 100;",
    "for (let i = 0; i < array.length; i++) { if (array[i] === target) { return i; } } return -1;",
  ],
  Commands: [
    "/help — show all available commands and their descriptions for quick reference",
    "/search python — find all commands related to Python programming language",
    "/compare gpt-4 claude — compare two AI models side by side on features",
    "/generate blog post outline about artificial intelligence and its impact on society",
    "/export csv — download your saved commands as a CSV file for offline use",
  ],
  Urdu: [
    "کامیابی محنت کا نتیجہ ہے۔ جو لوگ محنت کرتے ہیں وہ ہمیشہ کامیاب ہوتے ہیں۔",
    "علم حاصل کرنا ہر مسلمان مرد اور عورت کا فرض ہے۔ قرآن مجید میں علم کی تعلیم کی اہمیت بتائی گئی ہے۔",
    "زندگی میں اہدف کی طرف قدم بڑھائیں۔ ہر دن نئی کوشش کریں اور کبی ہار نہ مانیں۔",
    "اردو زبان دنیا کی سب سے خوبصورت زبانوں میں سے ایک ہے۔ اس کا ادب بہت غنی ہے۔",
  ],
};

function TypingTest() {
  const [category, setCategory] = useState("Normal");
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "active" | "done">("idle");
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem("typing_best") || "0"); } catch { return 0; }
  });
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<number>(0);

  const newText = useCallback(() => {
    const pool = TEXTS[category] ?? TEXTS["Normal"] ?? [];
    setText(pool[Math.floor(Math.random() * pool.length)] ?? "");
    setInput("");
    setStatus("idle");
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [category]);

  useEffect(() => { newText(); }, [newText]);

  useEffect(() => {
    if (status !== "active") return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setStatus("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  useEffect(() => {
    if (status === "done" && wpm > best) {
      setBest(wpm);
      try { localStorage.setItem("typing_best", String(wpm)); } catch { /* ignore */ }
    }
  }, [status, wpm, best]);

  const handleInput = (val: string) => {
    if (status === "done") return;
    if (status === "idle") {
      setStatus("active");
      startTimeRef.current = Date.now();
    }
    setInput(val);

    // Calculate stats
    const correctChars = val.split("").filter((c, i) => c === text[i]).length;
    const errCount = val.length - correctChars;
    const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    const currentWpm = elapsed > 0 ? Math.round((val.length / 5) / elapsed) : 0;
    const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;

    setErrors(errCount);
    setWpm(currentWpm);
    setAccuracy(acc);

    if (val.length >= text.length) {
      setStatus("done");
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const renderText = () => {
    return text.split("").map((char, i) => {
      let cls = "text-muted-foreground/40";
      if (i < input.length) {
        cls = input[i] === char ? "text-green" : "text-red underline";
      } else if (i === input.length && status === "active") {
        cls = "bg-primary/20 text-foreground";
      }
      return (
        <span key={i} className={cls}>
          {char}
        </span>
      );
    });
  };

  return (
    <AppShell title="Typing Speed Test">
      <div className="mx-auto max-w-2xl space-y-5 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Typing Speed Test</h1>
            <p className="mt-1 text-sm text-muted-foreground">Test your typing speed — 60 seconds.</p>
          </div>
          <button onClick={newText} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground transition-all hover:text-foreground">
            <RotateCcw className="size-3.5" /> New text
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: <Clock className="size-4" />, label: "Time", value: `${timeLeft}s`, color: timeLeft <= 10 ? "text-red" : "text-foreground" },
            { icon: <Target className="size-4" />, label: "WPM", value: String(wpm), color: "text-primary" },
            { icon: <Target className="size-4" />, label: "Accuracy", value: `${accuracy}%`, color: accuracy >= 90 ? "text-green" : "text-yellow" },
            { icon: <Trophy className="size-4" />, label: "Best", value: `${best} WPM`, color: "text-yellow" },
          ].map((s) => (
            <div key={s.label} className="rounded-[10px] border border-border bg-surface p-3 text-center">
              <div className="mx-auto mb-1 text-muted-foreground">{s.icon}</div>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="flex gap-1.5">
          {Object.keys(TEXTS).map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                category === cat
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Text display */}
        <div className="rounded-[10px] border border-border bg-surface p-5 font-mono text-sm leading-8 tracking-wide">
          {renderText()}
        </div>

        {/* Input */}
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          disabled={status === "done"}
          className="h-24 w-full resize-none rounded-[10px] border border-border bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
          placeholder={status === "done" ? "Test complete! Click 'New text' to try again." : "Start typing here..."}
          autoFocus
        />

        {/* Result */}
        {status === "done" && (
          <div className="rounded-[10px] border border-primary/30 bg-primary/5 p-5 text-center">
            <p className="text-3xl font-bold text-primary">{wpm} WPM</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {accuracy}% accuracy · {errors} error{errors !== 1 ? "s" : ""}
            </p>
            {wpm >= best && wpm > 0 && (
              <p className="mt-2 text-xs text-yellow">🏆 New personal best!</p>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
