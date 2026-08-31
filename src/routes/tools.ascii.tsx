import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Copy, Check, Download } from "lucide-react";

export const Route = createFileRoute("/tools/ascii")({
  head: () => ({ meta: [{ title: "ASCII Art Generator — SlashAI" }] }),
  component: ASCIIArt,
});

// FIGlet-style ASCII font (simplified block font)
const FONT: Record<string, string[]> = {
  A: ["  █  ", " █ █ ", "█████", "█   █", "█   █"],
  B: ["████ ", "█   █", "████ ", "█   █", "████ "],
  C: [" ████", "█    ", "█    ", "█    ", " ████"],
  D: ["████ ", "█   █", "█   █", "█   █", "████ "],
  E: ["█████", "█    ", "████ ", "█    ", "█████"],
  F: ["█████", "█    ", "████ ", "█    ", "█    "],
  G: [" ████", "█    ", "█  ██", "█   █", " ████"],
  H: ["█   █", "█   █", "█████", "█   █", "█   █"],
  I: ["█████", "  █  ", "  █  ", "  █  ", "█████"],
  J: ["█████", "   █ ", "   █ ", "█  █ ", " ██  "],
  K: ["█   █", "█  █ ", "███  ", "█  █ ", "█   █"],
  L: ["█    ", "█    ", "█    ", "█    ", "█████"],
  M: ["█   █", "██ ██", "█ █ █", "█   █", "█   █"],
  N: ["█   █", "██  █", "█ █ █", "█  ██", "█   █"],
  O: [" ███ ", "█   █", "█   █", "█   █", " ███ "],
  P: ["████ ", "█   █", "████ ", "█    ", "█    "],
  Q: [" ███ ", "█   █", "█ █ █", "█  █ ", " ██ █"],
  R: ["████ ", "█   █", "████ ", "█  █ ", "█   █"],
  S: [" ████", "█    ", " ███ ", "    █", "████ "],
  T: ["█████", "  █  ", "  █  ", "  █  ", "  █  "],
  U: ["█   █", "█   █", "█   █", "█   █", " ███ "],
  V: ["█   █", "█   █", "█   █", " █ █ ", "  █  "],
  W: ["█   █", "█   █", "█ █ █", "██ ██", "█   █"],
  X: ["█   █", " █ █ ", "  █  ", " █ █ ", "█   █"],
  Y: ["█   █", " █ █ ", "  █  ", "  █  ", "  █  "],
  Z: ["█████", "   █ ", "  █  ", " █   ", "█████"],
  " ": ["     ", "     ", "     ", "     ", "     "],
  "0": [" ███ ", "█  ██", "█ █ █", "██  █", " ███ "],
  "1": ["  █  ", " ██  ", "  █  ", "  █  ", "█████"],
  "2": [" ███ ", "█   █", "  ██ ", " █   ", "█████"],
  "3": ["████ ", "    █", " ███ ", "    █", "████ "],
  "4": ["█   █", "█   █", "█████", "    █", "    █"],
  "5": ["█████", "█    ", "████ ", "    █", "████ "],
  "6": [" ████", "█    ", "████ ", "█   █", " ███ "],
  "7": ["█████", "    █", "   █ ", "  █  ", "  █  "],
  "8": [" ███ ", "█   █", " ███ ", "█   █", " ███ "],
  "9": [" ███ ", "█   █", " ████", "    █", "████ "],
};

function textToASCII(text: string): string {
  const upper = text.toUpperCase();
  const lines = ["", "", "", "", ""];
  for (const char of upper) {
    const glyph = FONT[char] ?? FONT[" "] ?? ["     ", "     ", "     ", "     ", "     "];
    for (let i = 0; i < 5; i++) {
      lines[i] += (glyph[i] ?? "     ") + " ";
    }
  }
  return lines.join("\n");
}

function ASCIIArt() {
  const [text, setText] = useState("SLASHAI");
  const [copied, setCopied] = useState(false);

  const ascii = useMemo(() => textToASCII(text), [text]);

  const copy = () => {
    navigator.clipboard.writeText(ascii);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([ascii], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${text.replace(/\s+/g, "_")}.txt`;
    a.click();
  };

  return (
    <AppShell title="ASCII Art Generator">
      <div className="mx-auto max-w-3xl space-y-5 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ASCII Art Generator</h1>
          <p className="mt-1 text-sm text-muted-foreground">Convert text to block ASCII art — perfect for READMEs and terminals.</p>
        </div>

        <input
          value={text}
          onChange={(e) => setText(e.target.value.toUpperCase().slice(0, 20))}
          placeholder="Enter text (max 20 chars)"
          className="h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
        />

        <div className="rounded-[10px] border border-border bg-surface p-4">
          <pre className="overflow-x-auto font-mono text-xs leading-4 text-primary">{ascii}</pre>
        </div>

        <div className="flex justify-center gap-3">
          <button onClick={copy} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground">
            {copied ? <Check className="size-4 text-green" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button onClick={download} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm text-white hover:bg-primary/90">
            <Download className="size-4" /> Download .txt
          </button>
        </div>
      </div>
    </AppShell>
  );
}
