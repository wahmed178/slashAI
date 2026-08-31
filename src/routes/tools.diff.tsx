import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Copy, Check } from "lucide-react";

export const Route = createFileRoute("/tools/diff")({
  head: () => ({ meta: [{ title: "Text Diff Checker — SlashAI" }] }),
  component: TextDiff,
});

// Simple Myers-style diff
function diffLines(a: string, b: string) {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const result: Array<{ type: "same" | "added" | "removed"; text: string }> = [];

  // Simple LCS-based diff
  const m = aLines.length, n = bLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if ((aLines[i - 1] ?? "") === (bLines[j - 1] ?? "")) dp[i]![j] = (dp[i - 1]![j - 1] ?? 0) + 1;
      else dp[i]![j] = Math.max(dp[i - 1]![j] ?? 0, dp[i]![j - 1] ?? 0);
    }
  }

  let i = m, j = n;
  const raw: Array<{ type: "same" | "added" | "removed"; text: string }> = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && (aLines[i - 1] ?? "") === (bLines[j - 1] ?? "")) {
      raw.unshift({ type: "same", text: aLines[i - 1] ?? "" });
      i--; j--;
    } else if (j > 0 && (i === 0 || (dp[i]![j - 1] ?? 0) >= (dp[i - 1]![j] ?? 0))) {
      raw.unshift({ type: "added", text: bLines[j - 1] ?? "" });
      j--;
    } else {
      raw.unshift({ type: "removed", text: aLines[i - 1] ?? "" });
      i--;
    }
  }

  return raw;
}

function TextDiff() {
  const [left, setLeft] = useState("The quick brown fox jumps over the lazy dog.\nPack my box with five dozen liquor jugs.\nA journey of a thousand miles.");
  const [right, setRight] = useState("The quick brown fox leaps over the lazy cat.\nPack my box with five dozen liquor jugs.\nA journey of a thousand miles begins with a single step.");
  const [copied, setCopied] = useState(false);

  const diffResult = useMemo(() => diffLines(left, right), [left, right]);

  const stats = useMemo(() => {
    const added = diffResult.filter((d) => d.type === "added").length;
    const removed = diffResult.filter((d) => d.type === "removed").length;
    return { added, removed, same: diffResult.length - added - removed };
  }, [diffResult]);

  const copyDiff = () => {
    const text = diffResult.map((d) => {
      if (d.type === "added") return `+ ${d.text}`;
      if (d.type === "removed") return `- ${d.text}`;
      return `  ${d.text}`;
    }).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell title="Text Diff Checker">
      <div className="mx-auto max-w-5xl space-y-5 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Text Diff Checker</h1>
            <p className="mt-1 text-sm text-muted-foreground">Compare two texts side by side — changes highlighted instantly.</p>
          </div>
          <button onClick={copyDiff} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground transition-all hover:text-foreground">
            {copied ? <Check className="size-3.5 text-green" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy diff"}
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <span className="rounded-lg bg-green/10 px-2.5 py-1 text-xs text-green">+{stats.added} added</span>
          <span className="rounded-lg bg-red/10 px-2.5 py-1 text-xs text-red">-{stats.removed} removed</span>
          <span className="rounded-lg bg-surface px-2.5 py-1 text-xs text-muted-foreground">{stats.same} unchanged</span>
        </div>

        {/* Input boxes */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Original</p>
            <textarea
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              className="h-48 w-full resize-none rounded-[10px] border border-border bg-surface p-3 font-mono text-xs text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              placeholder="Paste original text..."
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Modified</p>
            <textarea
              value={right}
              onChange={(e) => setRight(e.target.value)}
              className="h-48 w-full resize-none rounded-[10px] border border-border bg-surface p-3 font-mono text-xs text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              placeholder="Paste modified text..."
            />
          </div>
        </div>

        {/* Diff output */}
        <div className="rounded-[10px] border border-border bg-surface p-4">
          <p className="mb-3 text-xs font-medium text-muted-foreground">Result</p>
          <div className="font-mono text-xs leading-6">
            {diffResult.map((d, i) => (
              <div
                key={i}
                className={`rounded px-3 ${
                  d.type === "added"
                    ? "bg-green/10 text-green"
                    : d.type === "removed"
                    ? "bg-red/10 text-red"
                    : "text-muted-foreground"
                }`}
              >
                <span className="mr-2 select-none opacity-40">
                  {d.type === "added" ? "+" : d.type === "removed" ? "-" : " "}
                </span>
                {d.text || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
