import { useEffect, useState, useMemo } from "react";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const QUOTES = [
  "Summoning the AI overlords…",
  "Downloading common sense… failed, using AI instead.",
  "Teaching machines to write poetry about your cat…",
  "Loading 1,499 ways to impress your boss.",
  "Calibrating the sarcasm detector…",
  "Asking the AI who built the AI that built it…",
  "Compiling prompts that actually work.",
  "Searching for the meaning of life… try /RootCause.",
  "Generating permission to procrastinate…",
  "Warming up the neural networks…",
  "Pretending this doesn't take time…",
  "Bribing the GPU with electricity…",
  "Converting caffeine into code…",
  "Downloading more RAM… just kidding.",
  "Running on hopes, dreams, and GPUs.",
  "Teaching the AI to be funny… it said no.",
  "Making sure the /Summarize prompt is longer than the original.",
  "Checking if anyone actually reads prompts…",
  "Loading creativity modules…",
  "Translating human thoughts into AI prompts…",
];

interface SplashScreenProps {
  onDone: () => void;
  minDuration?: number;
}

export function SplashScreen({ onDone, minDuration = 2200 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [dots, setDots] = useState("");
  const [exiting, setExiting] = useState(false);

  const randomQuotes = useMemo(() => {
    const shuffled = [...QUOTES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, []);

  // Cycle through random quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % randomQuotes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [randomQuotes.length]);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss after minDuration
  useEffect(() => {
    const timer = setTimeout(() => {
      try { localStorage.setItem("slashai-visited", "true"); } catch {}
      setExiting(true);
      setTimeout(() => onDone(), 400);
    }, minDuration);
    return () => clearTimeout(timer);
  }, [onDone, minDuration]);

  // Early dismiss if splash was already dismissed (safety net)
  useEffect(() => {
    if (!visible) return;
    try {
      if (localStorage.getItem("slashai-visited") === "true") {
        setExiting(true);
        setTimeout(() => onDone(), 200);
      }
    } catch {}
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-400",
        exiting ? "opacity-0 scale-105" : "opacity-100 scale-100",
      )}
    >
      {/* Animated logo */}
      <div className="relative mb-8">
        <div className="animate-spin-slow">
          <span className="flex size-20 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Terminal className="size-10" />
          </span>
        </div>
        {/* Pulsing ring */}
        <div className="absolute inset-0 -m-3 animate-ping rounded-3xl border-2 border-primary/20" />
        <div
          className="absolute inset-0 -m-6 animate-ping rounded-3xl border border-primary/10"
          style={{ animationDelay: "0.3s" }}
        />
      </div>

      {/* App name */}
      <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground animate-fade-in-up">
        SlashAI
      </h1>
      <p
        className="mb-8 text-sm text-muted-foreground animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        Your AI Command Vault
      </p>

      {/* Rotating quotes */}
      <div className="h-12 px-6 text-center">
        <p
          key={quoteIndex}
          className="max-w-xs text-sm text-muted-foreground/80 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {randomQuotes[quoteIndex]}
          {dots}
        </p>
      </div>

      {/* Loading bar */}
      <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-muted">
        <div className="h-full animate-loading-bar rounded-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      </div>
    </div>
  );
}
