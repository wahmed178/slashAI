import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Loader2, Languages } from "lucide-react";

import { cn } from "@/lib/utils";

export const VOICE_LANGS = [
  { code: "en-US", label: "English" },
  { code: "hi-IN", label: "हिन्दी (Hindi)" },
  { code: "ar-SA", label: "العربية (Arabic)" },
  { code: "ur-PK", label: "اردو (Urdu)" },
] as const;

interface Props {
  /** called with the final transcript when speech ends */
  onResult: (text: string) => void;
  /** live interim transcript as the user speaks (optional) */
  onInterim?: (text: string) => void;
  size?: "sm" | "lg";
  className?: string;
}

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

/** Microphone button for every search input — voice search in EN/HI/AR/UR. */
export function VoiceSearchButton({ onResult, onInterim, size = "sm", className }: Props) {
  const supported = typeof window !== "undefined" && getRecognitionCtor() !== null;
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [lang, setLang] = useState<string>("en-US");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  const stop = useCallback(() => {
    setListening(false);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setUnsupported(true);
      setOpen(true);
      return;
    }
    setUnsupported(false);
    setError("");
    setInterim("");
    try {
      const recognition = new Ctor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;
      recognition.onresult = (event: any) => {
        let interimText = "";
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript as string;
          if (event.results[i].isFinal) finalText += transcript;
          else interimText += transcript;
        }
        if (interimText) {
          setInterim(interimText);
          onInterim?.(interimText);
        }
        if (finalText) {
          setInterim("");
          onResult(finalText.trim());
        }
      };
      recognition.onerror = (event: any) => {
        if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
          setError("Microphone permission denied — allow mic access and try again.");
        } else if (event?.error === "no-speech") {
          setError("No speech detected — try again.");
        } else {
          setError("Voice recognition failed — try again.");
        }
        setListening(false);
      };
      recognition.onend = () => {
        setListening(false);
        setInterim("");
        recognitionRef.current = null;
      };
      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
      setOpen(true);
    } catch {
      setError("Could not start voice recognition on this device.");
      setListening(false);
    }
  }, [lang, onResult, onInterim]);

  const toggle = () => {
    if (listening) {
      stop();
      return;
    }
    setOpen((o) => !o);
    start();
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Voice search"
        title="Search by voice"
        onClick={toggle}
        className={cn(
          "flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          size === "lg" ? "size-10" : "size-8",
          listening &&
            "animate-pulse bg-red-500/15 text-red-400 hover:text-red-300 ring-1 ring-red-500/40",
        )}
      >
        {listening ? <Loader2 className={cn("animate-spin", size === "lg" ? "size-5" : "size-4")} /> : <Mic className={size === "lg" ? "size-5" : "size-4"} />}
      </button>

      {open && (
        <div className="panel absolute top-[calc(100%+6px)] right-0 z-50 w-64 overflow-hidden rounded-xl p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-foreground">
              {listening ? "Listening…" : "Voice search"}
            </p>
            <label className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Languages className="size-3.5" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="max-w-[120px] rounded border border-border bg-surface px-1 py-0.5 text-[11px] text-foreground outline-none"
                aria-label="Voice search language"
              >
                {VOICE_LANGS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {listening ? (
            <div className="mt-3">
              {/* waveform — three bouncing bars */}
              <div className="flex h-8 items-center justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-red-400"
                    style={{
                      height: "12px",
                      animation: "voice-wave 0.9s ease-in-out infinite",
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {interim ? `“${interim}”` : "Speak now — say what you want to search"}
              </p>
              <button
                type="button"
                onClick={stop}
                className="mt-3 w-full rounded-lg bg-red-500/90 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-500"
              >
                Stop
              </button>
            </div>
          ) : unsupported ? (
            <p className="mt-3 rounded-lg border border-border bg-surface p-2.5 text-[11px] leading-relaxed text-muted-foreground">
              🎙️ Voice search requires <span className="font-semibold text-foreground">Chrome or Edge</span> browser.
            </p>
          ) : error ? (
            <p className="mt-3 rounded-lg border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.08)] p-2.5 text-[11px] leading-relaxed text-red-300">
              {error}
            </p>
          ) : (
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Tap the mic and say what you're looking for — commands, topics or tasks.
            </p>
          )}

          <style>{`@keyframes voice-wave { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }`}</style>
        </div>
      )}
    </div>
  );
}