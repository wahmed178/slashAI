import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play, Pause, SkipForward, Volume2, VolumeX, Maximize, Minimize, Coffee } from "lucide-react";

export const Route = createFileRoute("/tools/focus")({
  head: () => ({ meta: [{ title: "Deep Work Mode — SlashAI" }] }),
  component: FocusMode,
});

const SOUNDS: Array<{ name: string; icon: string; gen: (ctx: AudioContext) => AudioNode }> = [
  {
    name: "Rain",
    icon: "🌧️",
    gen: (ctx) => {
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;
      source.connect(filter);
      return filter;
    },
  },
  {
    name: "White Noise",
    icon: "📻",
    gen: (ctx) => {
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      return source;
    },
  },
  {
    name: "Café",
    icon: "☕",
    gen: (ctx) => {
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.08;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 400;
      filter.Q.value = 0.5;
      source.connect(filter);
      return filter;
    },
  },
  {
    name: "Forest",
    icon: "🌲",
    gen: (ctx) => {
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate;
        data[i] = (Math.random() * 2 - 1) * 0.05 * (0.5 + 0.5 * Math.sin(t * 0.3));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 200;
      source.connect(filter);
      return filter;
    },
  },
  {
    name: "Lo-fi",
    icon: "🎵",
    gen: (ctx) => {
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate;
        data[i] = (Math.random() * 2 - 1) * 0.12 * (0.6 + 0.4 * Math.sin(t * 0.15));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 600;
      source.connect(filter);
      return filter;
    },
  },
];

function FocusMode() {
  const [task, setTask] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [selectedSound, setSelectedSound] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionLog, setSessionLog] = useState<Array<{ task: string; duration: number; date: string }>>(() => {
    try { return JSON.parse(localStorage.getItem("focus_log") || "[]"); } catch { return []; }
  });
  const timerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioNode | null>(null);

  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          if (mode === "work") {
            // Save session
            const log = [...sessionLog, { task: task || "Focus session", duration: WORK_TIME, date: new Date().toISOString() }];
            setSessionLog(log);
            try { localStorage.setItem("focus_log", JSON.stringify(log.slice(-50))); } catch { /* ignore */ }
            setMode("break");
            setTimeLeft(BREAK_TIME);
          } else {
            setMode("work");
            setIsRunning(false);
            setTimeLeft(WORK_TIME);
          }
          // Chime
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            osc.type = "sine";
            osc.frequency.value = mode === "work" ? 523 : 440;
            osc.connect(ctx.destination);
            osc.start();
            setTimeout(() => { osc.stop(); ctx.close(); }, 500);
          } catch { /* ignore */ }
          return mode === "work" ? BREAK_TIME : WORK_TIME;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, mode, task, sessionLog]);

  const startSound = useCallback((idx: number) => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
      sourceRef.current = null;
    }
    if (selectedSound === idx && !muted) {
      setMuted(true);
      setSelectedSound(null);
      return;
    }
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const sound = SOUNDS[idx];
    if (!sound) return;
    const node = sound.gen(ctx);
    const gain = ctx.createGain();
    gain.gain.value = 0.5;
    node.connect(gain);
    if (ctx.destination) gain.connect(ctx.destination);
    node instanceof AudioBufferSourceNode && node.start();
    sourceRef.current = node;
    setSelectedSound(idx);
    setMuted(false);
  }, [selectedSound, muted]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
    setIsFullscreen(!isFullscreen);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = mode === "work" ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100 : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <AppShell title="Deep Work Mode">
      <div className={`flex flex-col items-center justify-center ${isFullscreen ? "fixed inset-0 z-50 bg-background" : "min-h-[70vh] pt-8"}`}>
        {isFullscreen && (
          <button onClick={toggleFullscreen} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
            <Minimize className="size-5" />
          </button>
        )}

        {/* Mode indicator */}
        <p className={`text-sm font-medium ${mode === "work" ? "text-primary" : "text-green"}`}>
          {mode === "work" ? "🎯 Deep Work" : "☕ Break Time"}
        </p>

        {/* Timer */}
        <div className="my-8 text-center">
          <p className="font-mono text-8xl font-bold text-foreground tabular-nums">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </p>
          {/* Progress bar */}
          <div className="mx-auto mt-4 h-1.5 w-64 overflow-hidden rounded-full bg-surface">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${mode === "work" ? "bg-primary" : "bg-green"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Task */}
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What are you working on?"
          className="w-72 rounded-lg border border-border bg-surface px-4 py-2.5 text-center text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
        />

        {/* Controls */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => { setIsRunning(!isRunning); }}
            className="flex size-12 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-primary/90"
          >
            {isRunning ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
          </button>
          <button
            onClick={() => { setIsRunning(false); setMode("work"); setTimeLeft(WORK_TIME); }}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all hover:text-foreground"
          >
            <SkipForward className="size-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all hover:text-foreground"
          >
            <Maximize className="size-4" />
          </button>
        </div>

        {/* Sound selector */}
        <div className="mt-8 flex items-center gap-3">
          <Volume2 className="size-4 text-muted-foreground" />
          {SOUNDS.map((s, i) => (
            <button
              key={s.name}
              onClick={() => startSound(i)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all ${
                selectedSound === i && !muted
                  ? "border border-primary/30 bg-primary/10 text-primary"
                  : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{s.icon}</span> {s.name}
            </button>
          ))}
        </div>

        {/* Session log */}
        {sessionLog.length > 0 && (
          <div className="mt-8 w-full max-w-sm">
            <p className="mb-2 text-xs text-muted-foreground">Recent sessions ({sessionLog.length})</p>
            <div className="space-y-1">
              {sessionLog.slice(-5).reverse().map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-surface px-3 py-1.5 text-xs">
                  <span className="text-foreground">{s.task}</span>
                  <span className="text-muted-foreground">{Math.floor(s.duration / 60)}m</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
