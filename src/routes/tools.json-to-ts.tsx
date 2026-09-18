import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Check, Download, FileCode, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tools/json-to-ts")({
  head: () => ({
    meta: [
      { title: "JSON to TypeScript Converter - SlashAI" },
      {
        name: "description",
        content: "Convert JSON objects into clean, strongly typed TypeScript interfaces in your browser. Free, fast and private.",
      },
    ],
  }),
  component: JsonToTsPage,
});

const DEFAULT_JSON = `{
  "id": "usr_9482",
  "name": "Alex Rivera",
  "email": "alex@example.com",
  "isActive": true,
  "role": "admin",
  "metrics": {
    "loginCount": 42,
    "lastActive": "2026-09-18T12:00:00Z"
  },
  "tags": ["founder", "ai-engineer"],
  "projects": [
    {
      "id": "prj_01",
      "title": "SlashAI Hub",
      "stars": 1280
    }
  ]
}`;

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function generateTypescript(
  jsonString: string,
  rootName: string
): { code: string; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    const interfaces: Map<string, string> = new Map();

    function inferType(val: unknown, keyName: string): string {
      if (val === null) return "unknown | null";
      if (val === undefined) return "undefined";
      if (typeof val === "string") return "string";
      if (typeof val === "number") return "number";
      if (typeof val === "boolean") return "boolean";

      if (Array.isArray(val)) {
        if (val.length === 0) return "unknown[]";
        const itemType = inferType(val[0], `${keyName}Item`);
        return `${itemType}[]`;
      }

      if (typeof val === "object") {
        const interfaceName = toPascalCase(keyName);
        buildInterface(val as Record<string, unknown>, interfaceName);
        return interfaceName;
      }

      return "unknown";
    }

    function buildInterface(obj: Record<string, unknown>, name: string) {
      if (interfaces.has(name)) return;
      const lines: string[] = [];
      lines.push(`export interface ${name} {`);

      for (const [key, value] of Object.entries(obj)) {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
        const typeStr = inferType(value, key);
        lines.push(`  ${safeKey}: ${typeStr};`);
      }

      lines.push("}");
      interfaces.set(name, lines.join("\n"));
    }

    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && typeof parsed[0] === "object" && parsed[0] !== null) {
        buildInterface(parsed[0] as Record<string, unknown>, rootName);
      } else {
        return { code: `export type ${rootName} = ${inferType(parsed, rootName)};` };
      }
    } else if (typeof parsed === "object" && parsed !== null) {
      buildInterface(parsed as Record<string, unknown>, rootName);
    } else {
      return { code: `export type ${rootName} = ${typeof parsed};` };
    }

    return { code: Array.from(interfaces.values()).reverse().join("\n\n") };
  } catch (err) {
    return {
      code: "",
      error: err instanceof Error ? err.message : "Invalid JSON input",
    };
  }
}

function JsonToTsPage() {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const [rootName, setRootName] = useState("RootObject");
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => generateTypescript(jsonInput, rootName || "RootObject"),
    [jsonInput, rootName]
  );

  const handleCopy = async () => {
    if (!result.code) return;
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      toast.success("TypeScript interfaces copied!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard blocked");
    }
  };

  const handleDownload = () => {
    if (!result.code) return;
    const blob = new Blob([result.code], { type: "text/typescript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(rootName || "types").toLowerCase()}.ts`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded .ts file");
  };

  return (
    <AppShell title="JSON to TypeScript">
      <div className="mx-auto max-w-5xl pb-12">
        <header className="page-enter pt-2">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <FileCode className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              JSON to TypeScript
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Convert any JSON payload into clean, formatted TypeScript interfaces. 100% in your browser.
          </p>
        </header>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3">
          <div className="flex items-center gap-2">
            <label htmlFor="root-name" className="text-xs font-semibold text-muted-foreground">
              Root Interface:
            </label>
            <input
              id="root-name"
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
              placeholder="RootObject"
              className="h-8 rounded-lg border border-border bg-surface-elevated px-2.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setJsonInput(DEFAULT_JSON);
                setRootName("RootObject");
              }}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3" /> Reset Sample
            </Button>
            <Button
              size="sm"
              disabled={Boolean(result.error) || !result.code}
              onClick={handleCopy}
              className="h-8 gap-1.5 text-xs"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy TS"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={Boolean(result.error) || !result.code}
              onClick={handleDownload}
              className="h-8 gap-1.5 text-xs"
            >
              <Download className="size-3.5" /> .ts
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {/* JSON Input Column */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>JSON Input</span>
              <span className="text-[11px] text-muted-foreground">Paste your JSON here</span>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              spellCheck={false}
              rows={22}
              className="w-full resize-y rounded-xl border border-border bg-surface p-3 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Paste JSON here..."
            />
          </div>

          {/* TypeScript Output Column */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>Generated TypeScript</span>
              {result.error ? (
                <span className="text-[11px] text-destructive font-medium">Syntax error in JSON</span>
              ) : (
                <span className="text-[11px] text-emerald-400 font-medium">Valid TypeScript</span>
              )}
            </div>

            {result.error ? (
              <div className="flex h-[420px] flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-xs text-destructive">
                <p className="font-semibold">JSON Parse Error</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{result.error}</p>
              </div>
            ) : (
              <pre className="h-[420px] overflow-auto rounded-xl border border-border bg-surface-elevated p-3.5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-primary/95 selection:bg-primary/30">
                {result.code || "// Output will appear here"}
              </pre>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
