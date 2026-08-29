import { useState, useEffect, useCallback, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play, Pause, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/tools/pomodoro")({
  head: () => ({ meta: [{ title: "Pomodoro Timer — SlashAI" }] }),
  component: Pomodoro,
});

type Mode = "work" | "short" | "long";

function Pomodoro() {
  const [mode, setMode] = useState<Mode>("work");
  const [workMin, setWorkMin] = useState(25);
  const [shortMin, setShortMin] = useState(5);
  const [longMin, setLongMin] = useState(15);
  const [session, setSession] = useState(1);
  const [totalSessions, setTotalSessions] = useState(4);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const intervalRef = useRef<number | null>(null);

  const getDuration = (m: Mode) => m === "work" ? workMin * 60 : m === "short" ? shortMin * 60 : longMin * 60;

  const chime = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      osc.frequency.value = 440;
      osc.connect(ctx.destination);
      osc.start();
      setTimeout(() => osc.stop(), 300);
    } catch { /* ignore */ }
  };

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    const dur = m === "work" ? workMin * 60 : m === "short" ? shortMin * 60 : longMin * 60;
    setSeconds(dur);
    setTotalSeconds(dur);
    setRunning(false);
  }, [workMin, shortMin, longMin]);

  useEffect(() => {
    if (!running) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          chime();
          if (mode === "work") {
            if (session >= totalSessions) { setSession(1); switchMode("long"); }
            else { setSession((p) => p + 1); switchMode("short"); }
          } else { switchMode("work"); }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode, session, totalSessions, switchMode]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pct = totalSeconds > 0 ? ((totalSeconds - seconds) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 70;

  return (
    <AppShell title="Pomodoro Timer" back={{ to: "/tools", label: "SlashKit" }}>
      <div className="mt-4 flex flex-col items-center">
        {/* Mode tabs */}
        <div className="flex gap-2 mb-6">
          {([["work", `${workMin}m Work`], ["short", `${shortMin}m Break`], ["long", `${longMin}m Long`] as const]).map(([m, label]) => (
            <button key={m} type="button" onClick={() => switchMode(m as Mode)}
              className="min-h-[36px] rounded-full border px-4 text-xs font-medium transition-colors"
              style={{ background: mode === m ? "#58a6ff" : "#21262d", borderColor: mode === m ? "transparent" : "#30363d", color: mode === m ? "#0d1117" : "#8b949e" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Timer circle */}
        <div className="relative size-[200px]">
          <svg viewBox="0 0 160 160" className="size-full -rotate-90">
            <circle cx="80" cy="80" r="70" fill="none" stroke="#21262d" strokeWidth="6" />
            <circle cx="80" cy="80" r="70" fill="none" stroke="#58a6ff" strokeWidth="6"
              strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct / 100)}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold font-mono text-foreground">{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">Pomodoro {session} of {totalSessions}</p>

        {/* Controls */}
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={() => setRunning(!running)}
            className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            {running ? <Pause className="size-5" /> : <Play className="size-5" />}
          </button>
          <button type="button" onClick={() => { setRunning(false); switchMode(mode); }}
            className="flex size-12 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground">
            <RotateCcw className="size-5" />
          </button>
        </div>

        {/* Settings */}
        <div className="mt-6 w-full max-w-sm rounded-xl border border-border bg-surface p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Settings</p>
          {([
            { label: "Work", val: workMin, set: setWorkMin, min: 15, max: 60 },
            { label: "Short break", val: shortMin, set: setShortMin, min: 1, max: 15 },
            { label: "Long break", val: longMin, set: setLongMin, min: 10, max: 30 },
          ]).map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{item.label}</span>
              <div className="flex items-center gap-2">
                <input type="range" min={item.min} max={item.max} value={item.val}
                  onChange={(e) => item.set(Number(e.target.value))} className="w-24 accent-[#58a6ff]" />
                <span className="w-8 text-right text-sm font-mono text-primary">{item.val}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
