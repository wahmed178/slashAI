import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Copy, Check, BookOpen, Gamepad2, RotateCcw, Trophy } from "lucide-react";
import { feedback } from "@/lib/play-sound";
import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/tools/regex")({
  head: () => ({ meta: [{ title: "Regex Playground - SlashAI" }] }),
  component: RegexPlayground,
});

const COMMON_PATTERNS: Array<{ name: string; pattern: string; flags: string; desc: string }> = [
  {
    name: "Email",
    pattern: "[\\w.-]+@[\\w.-]+\\.\\w+",
    flags: "gi",
    desc: "Standard email addresses",
  },
  { name: "URL", pattern: "https?:\\/\\/[^\\s]+", flags: "gi", desc: "HTTP/HTTPS URLs" },
  {
    name: "Phone (IN)",
    pattern: "(\\+91[\\s-]?)?[6-9]\\d{9}",
    flags: "g",
    desc: "Indian mobile numbers",
  },
  {
    name: "Date (DD/MM/YYYY)",
    pattern: "\\d{1,2}\\/\\d{1,2}\\/\\d{4}",
    flags: "g",
    desc: "Indian date format",
  },
  {
    name: "IPv4",
    pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b",
    flags: "g",
    desc: "IP addresses",
  },
  { name: "Indian PIN", pattern: "\\b[1-9]\\d{5}\\b", flags: "g", desc: "6-digit PIN codes" },
  { name: "UPI ID", pattern: "[\\w.]+@[\\w]+", flags: "g", desc: "UPI payment IDs" },
  {
    name: "HTML Tag",
    pattern: "<([a-z][a-z0-9]*)\\b[^>]*>(.*?)<\\/\\1>",
    flags: "gi",
    desc: "HTML elements",
  },
  { name: "Hex Color", pattern: "#[0-9a-f]{3,8}", flags: "gi", desc: "HEX color codes" },
  { name: "PAN Card", pattern: "\\b[A-Z]{5}\\d{4}[A-Z]\\b", flags: "g", desc: "Indian PAN format" },
];

const LANG_EXPORTS: Array<{ lang: string; fn: (p: string, f: string) => string }> = [
  { lang: "JavaScript", fn: (p, f) => `new RegExp("${p}", "${f}")` },
  {
    lang: "Python",
    fn: (p, f) => `re.compile(r"${p}"${f.includes("i") ? ", re.IGNORECASE" : ""})`,
  },
  { lang: "PHP", fn: (p, f) => `preg_match_all("/${p}/${f.replace("g", "")}", $text, $matches)` },
  {
    lang: "Java",
    fn: (p, f) => `Pattern.compile("${p}"${f.includes("i") ? ", Pattern.CASE_INSENSITIVE" : ""})`,
  },
  {
    lang: "Go",
    fn: (p, f) => `regexp.${f.includes("i") ? "MustCompile(?i)" : "MustCompile"}("${p}")`,
  },
];

/* ───────────────────────────── regex trainer ─────────────────────────────
   Five mini-challenges. Each is solved by typing a pattern in the sandbox
   itself — highlight feedback and a “cheat sheet” teach while you play. */

interface Challenge {
  brief: string;
  sample: string;
  /** a correct pattern must match these exactly */
  mustMatch: string[];
  /** and none of these */
  mustNotMatch: string[];
  hint: string;
}

const CHALLENGES: Challenge[] = [
  {
    brief: "Match the word “cat” wherever it appears.",
    sample: "The cat sat. concat is a word. category has cat inside. CAT is shouting.",
    mustMatch: ["cat", "cat"],
    mustNotMatch: ["category", "CAT", "concat"],
    hint: "Word boundaries: \\bcat\\b",
  },
  {
    brief: "Match every 4-digit year (like 1998 or 2026).",
    sample: "Born in 1998, launched in 2026, retired in 99, bought 12345 shares.",
    mustMatch: ["1998", "2026"],
    mustNotMatch: ["99", "12345"],
    hint: "Exactly four digits with boundaries: \\b\\d{4}\\b",
  },
  {
    brief: "Match Indian mobile numbers: 10 digits starting with 6-9.",
    sample: "Call 9876543210 or +91 8123456789. Not 1234567890 and not 98765.",
    mustMatch: ["9876543210", "8123456789"],
    mustNotMatch: ["1234567890", "98765"],
    hint: "Class + quantifier + boundary: \\b[6-9]\\d{9}\\b",
  },
  {
    brief: "Match hex colours like #fff or #1a2b3c.",
    sample: "Use #fff for white, #1A2B3C for navy. Not #12345 or hash#abc.",
    mustMatch: ["#fff", "#1A2B3C"],
    mustNotMatch: ["#12345", "hash#abc"],
    hint: "Hash, 3 or 6 hex digits, boundary: \\b#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?\\b",
  },
  {
    brief: "Match words that start with a capital letter (not sentence starts only).",
    sample: "Waseem lives in Hyderabad and works with Rahul on SlashAI.",
    mustMatch: ["Waseem", "Hyderabad", "Rahul", "SlashAI"],
    mustNotMatch: ["lives", "and", "works"],
    hint: "Boundary, uppercase, then letters: \\b[A-Z][a-z]+\\b",
  },
];

const REGEX_CHEATS: Array<[string, string]> = [
  ["\\d", "any digit 0-9"],
  ["\\w", "letter, digit or underscore"],
  ["\\b", "word boundary"],
  ["{3}", "exactly 3 times"],
  ["{2,4}", "2 to 4 times"],
  ["[abc]", "one of a, b or c"],
  ["[a-f0-9]", "hex digit range"],
  ["[^abc]", "anything except a, b, c"],
  ["?", "previous thing is optional"],
  ["|", "either side"],
];

const TRAINER_BEST_KEY = "regex-trainer-best";

function patternIsCorrect(ch: Challenge, source: string, flags: string): boolean {
  try {
    const re = new RegExp(source, flags.includes("g") ? flags : `${flags}g`);
    const hits = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = re.exec(ch.sample)) !== null) {
      hits.add(m[0]);
      if (m.index === re.lastIndex) re.lastIndex++; // avoid zero-length loops
    }
    return ch.mustMatch.every((x) => hits.has(x)) && ch.mustNotMatch.every((x) => !hits.has(x));
  } catch {
    return false;
  }
}

function RegexTrainer() {
  const [round, setRound] = useState(() => Math.floor(Math.random() * CHALLENGES.length));
  const [attempt, setAttempt] = useState("");
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const challenge = CHALLENGES[round]!;
  const correct = attempt.trim().length > 0 && patternIsCorrect(challenge, attempt.trim(), "g");
  const best = getGameBest(TRAINER_BEST_KEY) ?? 0;
  const done = solved.size;

  const celebrate = () => {
    const next = new Set(solved);
    next.add(round);
    setSolved(next);
    if (next.size > best) saveGameBest(TRAINER_BEST_KEY, next.size);
    feedback("success");
  };

  const nextRound = () => {
    setRound((r) => (r + 1) % CHALLENGES.length);
    setAttempt("");
    setShowHint(false);
  };

  return (
    <div className="rounded-[10px] border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Gamepad2 className="size-3.5" /> Regex trainer
        </h3>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Trophy className="size-3 text-yellow-500" /> {done}/{CHALLENGES.length} solved
          {best > 0 && ` · best ${best}`}
        </span>
      </div>

      <p className="mt-2.5 text-[13px] font-medium text-foreground">{challenge.brief}</p>
      <p className="mt-1.5 rounded-lg bg-surface-elevated p-2.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
        {challenge.sample}
      </p>

      <div className="mt-2.5 flex gap-2">
        <input
          value={attempt}
          onChange={(e) => {
            setAttempt(e.target.value);
            if (!correct && patternIsCorrect(challenge, e.target.value.trim(), "g")) celebrate();
          }}
          placeholder="type your pattern…"
          spellCheck={false}
          className="h-9 flex-1 rounded-lg border border-border bg-surface-elevated px-3 font-mono text-[12.5px] text-foreground focus:border-primary/60 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => {
            setSolved(new Set());
            setAttempt("");
          }}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-2.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Reset trainer progress"
        >
          <RotateCcw className="size-3" />
        </button>
      </div>

      {correct ? (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
          <p className="text-[12px] font-semibold text-green-500">
            ✓ Solved — exactly the right matches!
          </p>
          <button
            type="button"
            onClick={nextRound}
            className="text-[11.5px] font-bold text-primary hover:underline"
          >
            Next challenge →
          </button>
        </div>
      ) : attempt.trim() ? (
        <p className="mt-2 rounded-lg bg-surface-elevated px-3 py-2 text-[12px] text-muted-foreground">
          Not yet — check you are matching every highlighted need and none of the traps.{" "}
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="font-semibold text-primary hover:underline"
          >
            Show hint
          </button>
        </p>
      ) : (
        <p className="mt-2 text-[11.5px] text-muted-foreground">
          Type a pattern below to try this challenge{" "}
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="font-semibold text-primary hover:underline"
          >
            (hint)
          </button>
        </p>
      )}

      {showHint && (
        <p className="mt-1.5 rounded-lg bg-primary/10 px-3 py-2 font-mono text-[11.5px] text-primary">
          {challenge.hint}
        </p>
      )}
    </div>
  );
}

function RegexPlayground() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [testText, setTestText] = useState(
    "Contact us at hello@slashai.dev or support@example.com for help.",
  );
  const [error, setError] = useState("");
  const [copiedLang, setCopiedLang] = useState("");

  const regex = useMemo(() => {
    try {
      const r = new RegExp(pattern, flags);
      setError("");
      return r;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid regular expression");
      return null;
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!regex || !testText) return [];
    const m: Array<{ text: string; index: number }> = [];
    let match;
    const r = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    while ((match = r.exec(testText)) !== null) {
      m.push({ text: match[0], index: match.index });
      if (!flags.includes("g")) break;
    }
    return m;
  }, [regex, pattern, flags, testText]);

  const highlightText = useCallback(() => {
    if (!matches.length || !regex) return testText;
    const parts: Array<{ text: string; highlight: boolean }> = [];
    let lastIdx = 0;
    const r = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    let match;
    while ((match = r.exec(testText)) !== null) {
      if (match.index > lastIdx)
        parts.push({ text: testText.slice(lastIdx, match.index), highlight: false });
      parts.push({ text: match[0], highlight: true });
      lastIdx = match.index + match[0].length;
      if (!flags.includes("g")) break;
    }
    if (lastIdx < testText.length) parts.push({ text: testText.slice(lastIdx), highlight: false });
    return parts;
  }, [matches, regex, pattern, flags, testText]);

  const highlighted = highlightText();

  const copyExport = (lang: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(""), 1500);
  };

  return (
    <AppShell title="Regex Playground">
      <div className="mx-auto max-w-3xl space-y-5 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Regex Playground</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Test regex patterns with live matching, then learn them in the trainer below.
          </p>
        </div>

        <RegexTrainer />

        {/* Pattern input */}
        <div className="flex gap-2">
          <div className="flex flex-1 items-center rounded-[10px] border border-border bg-surface">
            <span className="pl-3 font-mono text-sm text-muted-foreground">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="flex-1 bg-transparent px-1 py-2.5 font-mono text-sm text-foreground focus:outline-none"
              placeholder="regex pattern"
            />
            <span className="pr-1 font-mono text-sm text-muted-foreground">/</span>
            <input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="w-12 bg-transparent px-1 py-2.5 text-center font-mono text-sm text-primary focus:outline-none"
              placeholder="gi"
            />
          </div>
        </div>

        {error && <p className="rounded-lg bg-red/10 px-3 py-2 text-xs text-red">{error}</p>}

        {/* Test text */}
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          className="h-32 w-full resize-none rounded-[10px] border border-border bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          placeholder="Enter test text..."
        />

        {/* Highlighted result */}
        {testText && (
          <div className="rounded-[10px] border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{matches.length}</span> match
                {matches.length !== 1 ? "es" : ""}
              </p>
            </div>
            <p className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {Array.isArray(highlighted)
                ? highlighted.map((part, i) =>
                    part.highlight ? (
                      <mark key={i} className="rounded bg-primary/20 px-0.5 text-primary">
                        {part.text}
                      </mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    ),
                  )
                : highlighted}
            </p>
          </div>
        )}

        {/* Cheat sheet */}
        <div>
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <BookOpen className="size-3.5" /> Cheat sheet
          </h3>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {REGEX_CHEATS.map(([sym, meaning]) => (
              <button
                key={sym}
                onClick={() => setPattern((p) => p + sym)}
                className="flex items-baseline gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-left transition-colors hover:border-primary/40"
                title={`Insert ${sym} into your pattern`}
              >
                <code className="font-mono text-[12px] font-bold text-primary">{sym}</code>
                <span className="text-[11px] text-muted-foreground">{meaning}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Common patterns */}
        <div>
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <BookOpen className="size-3.5" /> Common Patterns
          </h3>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {COMMON_PATTERNS.map((cp) => (
              <button
                key={cp.name}
                onClick={() => {
                  setPattern(cp.pattern);
                  setFlags(cp.flags);
                }}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-left transition-all hover:border-primary/30"
              >
                <p className="text-xs font-semibold text-foreground">{cp.name}</p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                  {cp.pattern}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Export */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Export
          </h3>
          <div className="space-y-1.5">
            {LANG_EXPORTS.map((le) => {
              const code = le.fn(pattern, flags);
              return (
                <button
                  key={le.lang}
                  onClick={() => copyExport(le.lang, code)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 transition-all hover:border-primary/30"
                >
                  <div className="text-left">
                    <p className="text-xs font-medium text-foreground">{le.lang}</p>
                    <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                      {code}
                    </p>
                  </div>
                  {copiedLang === le.lang ? (
                    <Check className="size-3.5 text-green" />
                  ) : (
                    <Copy className="size-3.5 text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
