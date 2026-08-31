import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Copy, Check, BookOpen } from "lucide-react";

export const Route = createFileRoute("/tools/regex")({
  head: () => ({ meta: [{ title: "Regex Playground — SlashAI" }] }),
  component: RegexPlayground,
});

const COMMON_PATTERNS: Array<{ name: string; pattern: string; flags: string; desc: string }> = [
  { name: "Email", pattern: "[\\w.-]+@[\\w.-]+\\.\\w+", flags: "gi", desc: "Standard email addresses" },
  { name: "URL", pattern: "https?:\\/\\/[^\\s]+", flags: "gi", desc: "HTTP/HTTPS URLs" },
  { name: "Phone (IN)", pattern: "(\\+91[\\s-]?)?[6-9]\\d{9}", flags: "g", desc: "Indian mobile numbers" },
  { name: "Date (DD/MM/YYYY)", pattern: "\\d{1,2}\\/\\d{1,2}\\/\\d{4}", flags: "g", desc: "Indian date format" },
  { name: "IPv4", pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b", flags: "g", desc: "IP addresses" },
  { name: "Indian PIN", pattern: "\\b[1-9]\\d{5}\\b", flags: "g", desc: "6-digit PIN codes" },
  { name: "UPI ID", pattern: "[\\w.]+@[\\w]+", flags: "g", desc: "UPI payment IDs" },
  { name: "HTML Tag", pattern: "<([a-z][a-z0-9]*)\\b[^>]*>(.*?)<\\/\\1>", flags: "gi", desc: "HTML elements" },
  { name: "Hex Color", pattern: "#[0-9a-f]{3,8}", flags: "gi", desc: "HEX color codes" },
  { name: "PAN Card", pattern: "\\b[A-Z]{5}\\d{4}[A-Z]\\b", flags: "g", desc: "Indian PAN format" },
];

const LANG_EXPORTS: Array<{ lang: string; fn: (p: string, f: string) => string }> = [
  { lang: "JavaScript", fn: (p, f) => `new RegExp("${p}", "${f}")` },
  { lang: "Python", fn: (p, f) => `re.compile(r"${p}"${f.includes("i") ? ", re.IGNORECASE" : ""})` },
  { lang: "PHP", fn: (p, f) => `preg_match_all("/${p}/${f.replace("g", "")}", $text, $matches)` },
  { lang: "Java", fn: (p, f) => `Pattern.compile("${p}"${f.includes("i") ? ", Pattern.CASE_INSENSITIVE" : ""})` },
  { lang: "Go", fn: (p, f) => `regexp.${f.includes("i") ? "MustCompile(?i)" : "MustCompile"}("${p}")` },
];

function RegexPlayground() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [testText, setTestText] = useState("Contact us at hello@slashai.dev or support@example.com for help.");
  const [error, setError] = useState("");
  const [copiedLang, setCopiedLang] = useState("");

  const regex = useMemo(() => {
    try {
      const r = new RegExp(pattern, flags);
      setError("");
      return r;
    } catch (e: any) {
      setError(e.message);
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
      if (match.index > lastIdx) parts.push({ text: testText.slice(lastIdx, match.index), highlight: false });
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
          <p className="mt-1 text-sm text-muted-foreground">Test regex patterns with live matching and export to any language.</p>
        </div>

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
                <span className="font-semibold text-foreground">{matches.length}</span> match{matches.length !== 1 ? "es" : ""}
              </p>
            </div>
            <p className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {Array.isArray(highlighted)
                ? highlighted.map((part, i) =>
                    part.highlight ? (
                      <mark key={i} className="rounded bg-primary/20 px-0.5 text-primary">{part.text}</mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )
                : highlighted}
            </p>
          </div>
        )}

        {/* Common patterns */}
        <div>
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <BookOpen className="size-3.5" /> Common Patterns
          </h3>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {COMMON_PATTERNS.map((cp) => (
              <button
                key={cp.name}
                onClick={() => { setPattern(cp.pattern); setFlags(cp.flags); }}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-left transition-all hover:border-primary/30"
              >
                <p className="text-xs font-semibold text-foreground">{cp.name}</p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">{cp.pattern}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Export */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Export</h3>
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
                    <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">{code}</p>
                  </div>
                  {copiedLang === le.lang ? <Check className="size-3.5 text-green" /> : <Copy className="size-3.5 text-muted-foreground" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
