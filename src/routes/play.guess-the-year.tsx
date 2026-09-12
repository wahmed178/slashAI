import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/guess-the-year")({ component: GuessTheYear });

interface Event {
  text: string;
  year: number;
}

const EVENTS: Event[] = [
  { text: "The first iPhone is unveiled by Steve Jobs", year: 2007 },
  { text: "The Titanic sinks on her maiden voyage", year: 1912 },
  { text: "India gains independence from British rule", year: 1947 },
  { text: "The Berlin Wall falls", year: 1989 },
  { text: "The first human walks on the Moon", year: 1969 },
  { text: "The World Wide Web becomes publicly available", year: 1991 },
  { text: "The Chernobyl disaster occurs", year: 1986 },
  { text: "Pakistan is founded", year: 1947 },
  { text: "Nelson Mandela is released from prison", year: 1990 },
  { text: "The first Harry Potter book is published", year: 1997 },
  { text: "Mount Everest is first summited", year: 1953 },
  { text: "The microwave oven is invented", year: 1946 },
  { text: "Google is founded in a garage", year: 1998 },
  { text: "The Chernobyl sarcophagus is completed", year: 1986 },
  { text: "Bangladesh wins its independence", year: 1971 },
  { text: "The Wright brothers' first powered flight", year: 1903 },
  { text: "The first Star Wars film releases", year: 1977 },
  { text: "Facebook launches to college students", year: 2004 },
  { text: "The Taj Mahal is completed", year: 1653 },
  { text: "Penicillin is discovered by Alexander Fleming", year: 1928 },
  { text: "The Soviet Union dissolves", year: 1991 },
  { text: "Netflix begins streaming in India", year: 2016 },
  { text: "The first ChatGPT release goes viral", year: 2022 },
  { text: "The printing press is invented in Europe", year: 1440 },
  { text: "Dhaka becomes the world's muslin capital", year: 1700 },
  { text: "WhatsApp is acquired by Facebook", year: 2014 },
  { text: "The dawn of the Arab Spring", year: 2010 },
  { text: "Mecca's Grand Mosque expansion completes", year: 1979 },
  { text: "The Kyoto Protocol is adopted", year: 1997 },
  { text: "The first CS:GO Major is held", year: 2013 },
];

function GuessTheYear() {
  const [deck] = useState(() => [...EVENTS].sort(() => Math.random() - 0.5).slice(0, 10));
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<null | { off: number }>(null);
  const [totalOff, setTotalOff] = useState(0);
  const [done, setDone] = useState(false);

  const ev = deck[idx];

  const submit = () => {
    const g = parseInt(guess, 10);
    if (!ev || isNaN(g)) return;
    const off = Math.abs(g - ev.year);
    setResult({ off });
    setTotalOff((t) => t + off);
  };

  const next = () => {
    setResult(null);
    setGuess("");
    if (idx + 1 >= deck.length) setDone(true);
    else setIdx((i) => i + 1);
  };

  const verdict = (off: number) => {
    if (off === 0) return { label: "Bullseye! 🎯", tone: "text-emerald-400" };
    if (off <= 2) return { label: "Unbelievably close 🤏", tone: "text-emerald-400" };
    if (off <= 10) return { label: "Solid guess 👍", tone: "text-primary" };
    if (off <= 40) return { label: "In the right era 😅", tone: "text-yellow-400" };
    return { label: "Way off 😵", tone: "text-red-400" };
  };

  return (
    <AppShell title="Guess the Year">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📅 Guess the Year</h1>
        <p className="mt-1 text-sm text-muted-foreground">10 famous moments - how close can you get to the real year?</p>
      </header>
      <div className="mx-auto max-w-md space-y-5">
        {!done && ev && (
          <>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">Event {idx + 1} of {deck.length}</p>
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-lg font-semibold leading-snug text-foreground">{ev.text}</p>
            </div>
            {!result ? (
              <>
                <input
                  value={guess}
                  onChange={(e) => setGuess(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  inputMode="numeric"
                  placeholder="YYYY"
                  className="h-16 w-full rounded-xl border border-border bg-surface text-center text-3xl font-black tracking-widest text-foreground focus:border-primary focus:outline-none"
                />
                <button onClick={submit} disabled={!guess} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-40">
                  Lock in my guess
                </button>
              </>
            ) : (
              <div className="space-y-3 text-center">
                <div className="rounded-xl border border-border bg-surface p-4">
                  <p className={`text-lg font-black ${verdict(result.off).tone}`}>{verdict(result.off).label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Actual year: <b className="text-foreground">{ev.year}</b> · you were {result.off} {result.off === 1 ? "year" : "years"} off
                  </p>
                </div>
                <button onClick={next} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                  {idx + 1 >= deck.length ? "See my score →" : "Next event →"}
                </button>
              </div>
            )}
          </>
        )}
        {done && (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <p className="text-[13px] uppercase tracking-widest text-muted-foreground">Average miss</p>
              <p className="mt-2 text-5xl font-black text-foreground">{Math.round(totalOff / deck.length)} yrs</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {totalOff / deck.length <= 4 ? "Historian-level memory 📚" : totalOff / deck.length <= 15 ? "Solid sense of time ⏳" : "History is hard 😄"}
              </p>
            </div>
            <button onClick={() => window.location.reload()} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              ↻ Play again
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
