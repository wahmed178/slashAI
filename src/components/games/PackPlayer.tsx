/**
 * Shared UI bits for the pack player page. Kept in the packs folder so the
 * /play/$slug route stays readable; all styling uses the same tokens as the
 * hand-built games.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";

import { packLevel, seededShuffle, mulberry32, hashSeed, type Pack } from "@/lib/packs/registry";
import { feedback } from "@/lib/play-sound";

/* ── local storage bests ────────────────────────────────────────────── */

const bestKey = (slug: string) => `slash_pack_best_${slug}`;

export function usePackBest(slug: string): [number | null, (score: number) => void] {
  const [best, setBest] = useState<number | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(bestKey(slug));
      if (raw !== null) setBest(Number(raw));
    } catch { /* private mode */ }
  }, [slug]);
  const submit = (score: number) => {
    setBest((prev) => {
      const next = prev === null ? score : Math.max(prev, score);
      try { localStorage.setItem(bestKey(slug), String(next)); } catch { /* ignore */ }
      return next;
    });
  };
  return [best, submit];
}

/* ── result screen + heading, shared by every kind ──────────────────── */

export function PackBest({ slug, suffix = "" }: { slug: string; suffix?: string }) {
  const [best] = usePackBest(slug);
  if (best === null) return null;
  return <p className="text-sm text-muted-foreground">🏆 Your best: {best}{suffix}</p>;
}

export function PackResult({ score, total, onAgain, bestSuffix = "" }: {
  score: number;
  total: number;
  onAgain: () => void;
  bestSuffix?: string;
}) {
  const navigate = useNavigate();
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <div className="text-5xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "🌱"}</div>
      <div>
        <p className="text-2xl font-bold">You scored {score}/{total}</p>
        <p className="mt-1 text-muted-foreground">{pct >= 80 ? "Brilliant!" : pct >= 50 ? "Solid round" : "Practice makes perfect"}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onAgain} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <RotateCcw className="size-4" /> Play again
        </button>
        <Link to="/play" className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">More games</Link>
      </div>
      {bestSuffix && <p className="text-sm text-muted-foreground">{bestSuffix}</p>}
    </div>
  );
}

/* ── quiz runner ────────────────────────────────────────────────────── */

export function QuizRunner({ pack }: { pack: Pack }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // stable per-slug order: same pack always presents the same quiz
  const rows = pack.rows ?? [];
  const ordered = rows; // rows are already seeded at build time; keep order
  const q = ordered[round] ?? ordered[0];
  const options = q ? [q[1], q[2], q[3], q[4]] : [];

  const again = () => {
    setRound(0); setScore(0); setPicked(null); setDone(false);
  };

  if (done) return <PackResult score={score} total={ordered.length} onAgain={again} />;

  const answer = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === q![1]) { setScore((s) => s + 1); feedback("success"); } else { feedback("fail"); }
    window.setTimeout(() => {
      if (round + 1 >= ordered.length) { setDone(true); } else { setRound((r) => r + 1); setPicked(null); }
    }, 650);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {round + 1} / {ordered.length}</span>
        <span>Score {score}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(round / ordered.length) * 100}%` }} />
      </div>
      <p className="text-lg font-medium sm:text-xl">{q![0]}</p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => answer(opt)}
            disabled={!!picked}
            className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors sm:text-base ${
              picked
                ? opt === q![1]
                  ? "border-emerald-500 bg-emerald-500/10 font-medium"
                  : opt === picked
                    ? "border-red-400 bg-red-400/10"
                    : "opacity-60"
                : "hover:border-primary/60 hover:bg-muted"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <PackBest slug={pack.slug} suffix={`/${ordered.length}`} />
    </div>
  );
}

/* ── scramble / hangman runner ──────────────────────────────────────── */

function ScrambleRunner({ pack }: { pack: Pack }) {
  const words = pack.words ?? [];
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  const word = words[idx % words.length] ?? "";
  // fresh deterministic scramble per word instance
  const scrambled = useMemo(
    () => seededShuffle([...word], mulberry32(hashSeed(`${pack.slug}:${word}:${Math.floor(idx / words.length)}`))),
    [pack.slug, word, idx, words.length],
  );

  if (done) return <PackResult score={score} total={words.length} onAgain={() => { setIdx(0); setScore(0); setDone(false); setRevealed(false); }} />;

  const submit = () => {
    if (revealed) return;
    if (guess.trim().toUpperCase() === word) { setScore((s) => s + 1); feedback("success"); }
    else feedback("fail");
    setRevealed(true);
  };
  const next = () => {
    if (idx + 1 >= words.length) setDone(true);
    else { setIdx((i) => i + 1); setGuess(""); setRevealed(false); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Word {idx + 1} / {words.length}</span><span>Score {score}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 py-6">
        {scrambled.map((ch, i) => (
          <span key={`${ch}-${i}`} className="grid size-11 place-items-center rounded-lg border bg-muted text-xl font-bold sm:size-13">{ch}</span>
        ))}
      </div>
      {revealed ? (
        <p className="text-center text-muted-foreground">It was <b className="text-foreground">{word}</b></p>
      ) : (
        <>
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="Type your guess…"
            className="w-full rounded-xl border bg-background px-4 py-3 text-center text-lg outline-none focus:border-primary"
            autoFocus
          />
          <div className="flex justify-center gap-3">
            <button onClick={submit} className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Check</button>
            <button onClick={() => setRevealed(true)} className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">Skip</button>
          </div>
        </>
      )}
      {revealed && (
        <button onClick={next} className="mx-auto rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          {idx + 1 >= words.length ? "Finish" : "Next word →"}
        </button>
      )}
      <PackBest slug={pack.slug} suffix={`/${words.length}`} />
    </div>
  );
}

function HangmanRunner({ pack }: { pack: Pack }) {
  const words = pack.words ?? [];
  const [idx, setIdx] = useState(0);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [misses, setMisses] = useState(0);
  const [wins, setWins] = useState(0);
  const [done, setDone] = useState(false);

  const word = words[idx % words.length] ?? "";
  const letters = [...new Set(word.split(""))];
  const solved = letters.every((l) => guessed.has(l));
  const lost = misses >= 6;

  if (done) return <PackResult score={wins} total={words.length} onAgain={() => { setIdx(0); setGuessed(new Set()); setMisses(0); setWins(0); setDone(false); }} />;

  const guess = (l: string) => {
    if (guessed.has(l) || solved || lost) return;
    const g = new Set(guessed); g.add(l);
    setGuessed(g);
    if (!word.includes(l)) { setMisses((m) => m + 1); feedback("fail"); } else feedback("success");
  };
  const nextWord = () => {
    if (solved) setWins((w) => w + 1);
    if (idx + 1 >= words.length) setDone(true);
    else { setIdx((i) => i + 1); setGuessed(new Set()); setMisses(0); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Word {idx + 1} / {words.length} · Wins {wins}</span>
        <span>{"❤️".repeat(Math.max(0, 6 - misses))}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 py-4">
        {[...word].map((ch, i) => (
          <span key={i} className="grid h-11 w-8 place-items-end border-b-2 border-primary/40 text-center text-xl font-bold">
            {guessed.has(ch) ? ch : ""}
          </span>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">{pack.hint ?? "Guess a letter"}</p>
      <div className="mx-auto grid grid-cols-7 gap-1.5 sm:grid-cols-9">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
          <button
            key={l}
            onClick={() => guess(l)}
            disabled={guessed.has(l) || solved || misses >= 6}
            className="size-9 rounded-md border text-sm font-medium transition-colors hover:bg-muted disabled:opacity-30"
          >
            {l}
          </button>
        ))}
      </div>
      {(solved || misses >= 6) && (
        <div className="text-center">
          <p className="mb-3 text-muted-foreground">
            {solved ? "Nice!" : "Out of guesses —"} it was <b className="text-foreground">{word}</b>
          </p>
          <button onClick={nextWord} className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            {idx + 1 >= words.length ? "Finish" : "Next word →"}
          </button>
        </div>
      )}
      <PackBest slug={pack.slug} suffix={`/${words.length}`} />
    </div>
  );
}

/* ── memory runner ──────────────────────────────────────────────────── */

function MemoryRunner({ pack }: { pack: Pack }) {
  const emojis = pack.emojis ?? [];
  const [round, setRound] = useState(0);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState<number[]>([]);
  const [won, setWon] = useState(false);

  // board: pairs of each emoji, shuffled per round
  const [board, setBoard] = useState<string[]>([]);
  const restart = (fresh = true) => {
    const deck = seededShuffle([...emojis, ...emojis], mulberry32(hashSeed(`${pack.slug}:${round}:${Date.now()}`)));
    setBoard(deck);
    if (fresh) { setMatched(new Set()); setOpen([]); setMoves(0); setWon(false); }
  };
  // build on mount and each new round
  if (board.length === 0) restart(true);

  const flip = (i: number) => {
    if (open.includes(i) || matched.has(i) || open.length >= 2) return;
    const nextOpen = [...open, i];
    setOpen(nextOpen);
    feedback("success");
    if (nextOpen.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextOpen;
      if (board[a!] === board[b!]) {
        const m = new Set(matched); m.add(a!); m.add(b!);
        setMatched(m);
        setOpen([]);
        if (m.size === board.length) setWon(true);
      } else {
        window.setTimeout(() => setOpen([]), 750);
      }
    }
  };

  if (won) return <PackResult score={Math.max(0, board.length / 2 * 2 - moves)} total={board.length / 2 * 2} onAgain={() => { setRound((r) => r + 1); restart(true); }} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Moves {moves}</span><span>Pairs {matched.size / 2}/{emojis.length}</span>
      </div>
      <div className="mx-auto grid grid-cols-4 gap-2 sm:grid-cols-5">
        {board.map((face, i) => (
          <button
            key={i}
            onClick={() => flip(i)}
            className={`grid aspect-square w-16 place-items-center rounded-xl border text-3xl transition-all sm:w-20 ${
              open.includes(i) || matched.has(i) ? "bg-muted" : "bg-primary/10 hover:bg-primary/20"
            }`}
          >
            {open.includes(i) || matched.has(i) ? face : "❔"}
          </button>
        ))}
      </div>
      <PackBest slug={pack.slug} suffix=" pts" />
    </div>
  );
}

/* ── emoji phrase runner ────────────────────────────────────────────── */

function EmojiRunner({ pack }: { pack: Pack }) {
  const phrases = pack.phrases ?? [];
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  const item = phrases[idx % phrases.length] ?? ["", ""];
  if (done) return <PackResult score={score} total={phrases.length} onAgain={() => { setIdx(0); setScore(0); setDone(false); setRevealed(false); }} />;

  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const submit = () => {
    if (norm(guess) === norm(item[1])) { setScore((s) => s + 1); feedback("success"); } else feedback("fail");
    setRevealed(true);
  };
  const next = () => {
    if (idx + 1 >= phrases.length) setDone(true);
    else { setIdx((i) => i + 1); setGuess(""); setRevealed(false); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Puzzle {idx + 1} / {phrases.length}</span><span>Score {score}</span>
      </div>
      <p className="py-6 text-center text-5xl sm:text-6xl">{item[0]}</p>
      {revealed ? (
        <p className="text-center text-muted-foreground">It was <b className="text-foreground">{item[1]}</b></p>
      ) : (
        <>
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="What does it mean?"
            className="w-full rounded-xl border bg-background px-4 py-3 text-center text-lg outline-none focus:border-primary"
            autoFocus
          />
          <div className="flex justify-center gap-3">
            <button onClick={submit} className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Check</button>
            <button onClick={() => setRevealed(true)} className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">Give up</button>
          </div>
        </>
      )}
      {revealed && (
        <button onClick={next} className="mx-auto rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          {idx + 1 >= phrases.length ? "Finish" : "Next →"}
        </button>
      )}
      <PackBest slug={pack.slug} suffix={`/${phrases.length}`} />
    </div>
  );
}

/* ── would-you-rather runner ────────────────────────────────────────── */

function WyrRunner({ pack }: { pack: Pack }) {
  const choices = pack.choices ?? [];
  const [idx, setIdx] = useState(0);
  const [votes, setVotes] = useState<{ a: number; b: number }>({ a: 0, b: 0 });

  const item = choices[idx % choices.length] ?? ["", ""];
  const vote = (side: "a" | "b") => {
    setVotes((v) => ({ a: v.a + (side === "a" ? 1 : 0), b: v.b + (side === "b" ? 1 : 0) }));
    feedback("success");
    setIdx((i) => i + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-center text-sm text-muted-foreground">
        Round {idx + 1} · pass the phone around — majority rules {idx > 0 && `· votes ${votes.a}–${votes.b}`}
      </p>
      <p className="text-center text-xl font-medium sm:text-2xl">Would you rather…</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <button onClick={() => vote("a")} className="rounded-xl border px-4 py-6 text-sm transition-colors hover:border-primary/60 hover:bg-muted sm:text-base">{item[0]}</button>
        <button onClick={() => vote("b")} className="rounded-xl border px-4 py-6 text-sm transition-colors hover:border-primary/60 hover:bg-muted sm:text-base">{item[1]}</button>
      </div>
      {idx >= choices.length && (
        <div className="text-center">
          <p className="mb-3 text-muted-foreground">That's the whole deck — your group voted {votes.a}–{votes.b}</p>
          <button onClick={() => { setIdx(0); setVotes({ a: 0, b: 0 }); }} className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Shuffle again</button>
        </div>
      )}
    </div>
  );
}

/* ── sliding puzzle runner ──────────────────────────────────────────── */

function SlidingRunner({ pack }: { pack: Pack }) {
  const sizes = pack.sizes ?? [3];
  const [size, setSize] = useState(sizes[0]!);
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [dailySeed] = useState(() => new Date().toISOString().slice(0, 10));

  const build = (n: number) => {
    // solvable shuffle: start solved, apply random legal moves
    const arr = [...Array(n * n - 1).keys()].map((x) => x + 1).concat([0]);
    const rng = pack.daily
      ? mulberry32(hashSeed(`${pack.slug}:${dailySeed}`))
      : mulberry32(hashSeed(`${pack.slug}:${Date.now()}`));
    let blank = n * n - 1;
    for (let step = 0; step < n * n * 60; step++) {
      const neighbours = [blank - 1, blank + 1, blank - n, blank + n].filter(
        (b) => b >= 0 && b < n * n && !(Math.abs((b % n) - (blank % n)) !== 1 && Math.abs(b - blank) === 1),
      );
      const pick = neighbours[Math.floor(rng() * neighbours.length)]!;
      [arr[blank], arr[pick]] = [arr[pick]!, arr[blank]!];
      blank = pick;
    }
    setTiles(arr);
    setSize(n); setMoves(0); setWon(false);
  };

  // build on mount
  if (tiles.length === 0) build(size);

  const move = (i: number) => {
    const blank = tiles.indexOf(0);
    const adjacent = (i === blank - 1 && blank % size !== 0) || (i === blank + 1 && i % size !== 0) || i === blank - size || i === blank + size;
    if (!adjacent || won) return;
    const t = [...tiles];
    [t[i], t[blank]] = [t[blank]!, t[i]!];
    setTiles(t); setMoves((m) => m + 1); feedback("success");
    const solved = t.every((v, k) => (k === t.length - 1 ? v === 0 : v === k + 1));
    if (solved) setWon(true);
  };

  if (won) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-5xl">🎉</div>
        <p className="text-2xl font-bold">Solved the {size}×{size} in {moves} moves{pack.daily ? " — see you tomorrow" : ""}</p>
        <div className="flex gap-3">
          <button onClick={() => build(size)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Play again</button>
          <Link to="/play" className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">More games</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>Moves {moves}{pack.daily ? " · today's challenge" : ""}</span>
        <div className="flex gap-1.5">
          {sizes.map((n) => (
            <button key={n} onClick={() => build(n)}
              className={`rounded-md border px-2.5 py-1 ${size === n ? "border-primary bg-primary/10 font-medium" : "hover:bg-muted"}`}>
              {n}×{n}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto grid gap-1.5" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, width: "min(100%, 26rem)" }}>
        {tiles.map((v, i) => (
          <button
            key={i}
            onClick={() => move(i)}
            className={`grid aspect-square place-items-center rounded-lg text-lg font-bold sm:text-2xl ${
              v === 0 ? "opacity-0" : "bg-primary/10 hover:bg-primary/25"
            }`}
          >
            {pack.slug === "sliding-emoji" && v !== 0 ? ["🙂", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑"][v - 1] : v === 0 ? "" : v}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">Tap a tile next to the gap to slide it. Order 1 → {size * size - 1}.</p>
    </div>
  );
}

/* ── public: render the right runner for a pack ─────────────────────── */

export function PackRunner({ pack }: { pack: Pack }) {
  switch (pack.kind) {
    case "quiz": return <QuizRunner key={pack.slug} pack={pack} />;
    case "scramble": return <ScrambleRunner key={pack.slug} pack={pack} />;
    case "hangman": return <HangmanRunner key={pack.slug} pack={pack} />;
    case "memory": return <MemoryRunner key={pack.slug} pack={pack} />;
    case "emoji": return <EmojiRunner key={pack.slug} pack={pack} />;
    case "wouldyourather": return <WyrRunner key={pack.slug} pack={pack} />;
    case "sliding": return <SlidingRunner key={pack.slug} pack={pack} />;
    default: return <p className="text-muted-foreground">Unknown pack kind.</p>;
  }
}

export { packLevel };
