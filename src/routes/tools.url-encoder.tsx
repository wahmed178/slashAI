import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/url-encoder")({ component: URLEncoder });

type Param = { key: string; value: string; encoded: boolean };

function URLEncoder() {
  const [input, setInput] = useState("https://example.com/search?q=hello world&lang=en");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const output =
    mode === "encode"
      ? (() => {
          try {
            return encodeURI(input);
          } catch {
            return "Error encoding";
          }
        })()
      : (() => {
          try {
            return decodeURI(input);
          } catch {
            return "Error decoding";
          }
        })();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      /* clipboard blocked — copy button is a convenience, not a requirement */
    }
  };

  /** Break a URL into its readable parts — great for debugging share links. */
  const parts = useMemo<Param[]>(() => {
    try {
      const url = new URL(input);
      return [...url.searchParams.entries()].map(([key, value]) => ({
        key,
        value,
        encoded: /%[0-9a-f]{2}/i.test(value) || value !== decodeURIComponent(value),
      }));
    } catch {
      return [];
    }
  }, [input]);

  const structure = useMemo(() => {
    try {
      const url = new URL(input);
      return { origin: url.origin, path: url.pathname, hash: url.hash, count: parts.length };
    } catch {
      return null;
    }
  }, [input, parts]);

  return (
    <AppShell title="URL Encoder/Decoder">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          🔗 URL Encoder/Decoder
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Encode and decode URLs, with a breakdown of every query parameter.
        </p>
      </header>
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("encode")}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium ${mode === "encode" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium ${mode === "decode" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}
          >
            Decode
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode" ? "Enter URL to encode..." : "Enter encoded URL to decode..."
          }
          className="h-24 w-full rounded-xl border border-border bg-surface p-3 font-mono text-sm focus:outline-none resize-none"
        />
        <div className="relative">
          <pre className="max-h-32 overflow-auto rounded-xl border border-border bg-surface p-3 font-mono text-sm text-foreground whitespace-pre-wrap">
            {output}
          </pre>
          <button
            onClick={copy}
            className="absolute top-2 right-2 text-[10px] text-primary hover:underline"
          >
            Copy
          </button>
        </div>

        {structure && (
          <div className="rounded-xl border border-border bg-surface p-3.5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              URL breakdown
            </p>
            <dl className="space-y-1 font-mono text-[11.5px]">
              <div className="flex gap-2">
                <dt className="w-14 shrink-0 text-muted-foreground">origin</dt>
                <dd className="break-all text-foreground">{structure.origin}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-14 shrink-0 text-muted-foreground">path</dt>
                <dd className="break-all text-foreground">{structure.path || "/"}</dd>
              </div>
              {structure.hash && (
                <div className="flex gap-2">
                  <dt className="w-14 shrink-0 text-muted-foreground">hash</dt>
                  <dd className="break-all text-foreground">{structure.hash}</dd>
                </div>
              )}
            </dl>

            <p className="mb-1.5 mt-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Query parameters ({structure.count})
            </p>
            {parts.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-left text-[11.5px]">
                  <thead>
                    <tr className="bg-surface-elevated text-[10px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-2.5 py-1.5 font-semibold">Key</th>
                      <th className="px-2.5 py-1.5 font-semibold">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map((p, i) => (
                      <tr key={`${p.key}-${i}`} className="border-t border-border">
                        <td className="px-2.5 py-1.5 font-mono font-semibold text-primary">
                          {p.key}
                        </td>
                        <td className="break-all px-2.5 py-1.5 font-mono text-foreground">
                          {p.value}
                          {p.encoded && (
                            <span className="ml-1.5 rounded bg-yellow-500/15 px-1 py-0.5 font-sans text-[9.5px] text-yellow-600">
                              encoded
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[11.5px] text-muted-foreground">
                No query parameters in this URL.
              </p>
            )}
            <p className="mt-2 text-[10.5px] text-muted-foreground">
              Paste a share or tracking link to see exactly what it carries. “Encoded” values
              contain %xx escapes — decode the URL to read them plainly.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
