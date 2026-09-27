import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";
import { Check, Copy, ExternalLink, Link2, RotateCcw, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { savedSummary, shortenUrl } from "@/lib/shorten";

export const Route = createFileRoute("/tools/link-shortener")({
  head: () => ({
    meta: [
      { title: "Link Shortener - Clean Up Any Link | SlashAI" },
      {
        name: "description",
        content:
          "Shorten any link by removing tracking and campaign junk. Works on your device - no account, no upload, nothing sent anywhere. Paste a link, get a clean one you can copy.",
      },
    ],
  }),
  component: LinkShortener,
});

const SAMPLE =
  "https://www.slashai.in/tools/bouquet?utm_source=whatsapp&utm_medium=social&utm_campaign=flowers&fbclid=abc123";

function LinkShortener() {
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => shortenUrl(value), [value]);
  const hasValue = value.trim().length > 0;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Clipboard blocked by the browser");
    }
  };

  return (
    <AppShell title="Link Shortener">
      <div className="mx-auto max-w-2xl space-y-5 pt-2">
        <header>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Link2 className="size-6 text-primary" aria-hidden />
            Link Shortener
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste any link. Tracking and campaign junk is removed and the link is tidied up — on
            your device. No account, nothing uploaded.
          </p>
        </header>

        {/* input */}
        <div className="rounded-2xl border border-border bg-surface p-4">
          <label htmlFor="link-input" className="text-xs font-semibold text-muted-foreground">
            Link to shorten
          </label>
          <textarea
            id="link-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            spellCheck={false}
            autoComplete="off"
            placeholder="https://example.com/page?utm_source=newsletter&utm_campaign=may&fbclid=xyz"
            className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 font-mono text-[12px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none"
          />

          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setValue(SAMPLE)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <Wand2 className="size-3.5" aria-hidden />
              Try an example
            </button>
            <button
              type="button"
              onClick={() => setValue(window.location.href)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              Use this page
            </button>
            {hasValue && (
              <button
                type="button"
                onClick={() => setValue("")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <RotateCcw className="size-3.5" aria-hidden />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* result */}
        {hasValue && (
          <div
            className={`rounded-2xl border p-4 ${
              result.invalid
                ? "border-destructive/40 bg-destructive/5"
                : result.changed
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-surface"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                result.invalid
                  ? "text-destructive"
                  : result.changed
                    ? "text-primary"
                    : "text-muted-foreground"
              }`}
            >
              {savedSummary(result)}
            </p>

            {result.invalid ? (
              <p className="mt-2 text-xs text-muted-foreground">
                That does not look like a web link. It must start with http:// or https://, or just
                be a domain like example.com.
              </p>
            ) : (
              <>
                {result.removed.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-semibold">Removed: </span>
                    {result.removed.map((p) => (
                      <code
                        key={p}
                        className="mr-1 inline-block rounded bg-background px-1.5 py-0.5 font-mono text-[10px]"
                      >
                        {p}
                      </code>
                    ))}
                  </p>
                )}

                <div className="mt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Short link
                  </p>
                  <p className="mt-1 break-all rounded-lg border border-border bg-background px-3 py-2 font-mono text-[12px] text-foreground">
                    {result.url}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copy(result.url)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    Open it
                  </a>
                </div>
              </>
            )}
          </div>
        )}

        {!hasValue && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <span className="text-3xl" aria-hidden>
              🔗
            </span>
            <p className="mt-2 text-sm font-semibold text-foreground">Paste a link above</p>
            <p className="mt-1 text-xs text-muted-foreground">
              The cleaned link appears here, with the parameters it removed.
            </p>
          </div>
        )}

        {/* explainer */}
        <div className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.06em] text-muted-foreground">
            What it removes
          </h2>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            <li>
              <b className="text-foreground">Campaign parameters</b> — anything starting with{" "}
              <code className="font-mono">utm_</code>, used to track where a share came from.
            </li>
            <li>
              <b className="text-foreground">Ad click ids</b> —{" "}
              <code className="font-mono">fbclid</code>, <code className="font-mono">gclid</code>,{" "}
              <code className="font-mono">msclkid</code>, <code className="font-mono">dclid</code>{" "}
              and friends.
            </li>
            <li>
              <b className="text-foreground">Email and social trackers</b> —{" "}
              <code className="font-mono">mc_cid</code>, <code className="font-mono">igshid</code>,{" "}
              <code className="font-mono">_hsenc</code> and similar.
            </li>
            <li>
              <b className="text-foreground">Clutter in the link itself</b> —{" "}
              <code className="font-mono">www.</code>, the default port, duplicate slashes and a
              trailing slash.
            </li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            It is careful with two things: anything after a <code className="font-mono">#</code> is
            always kept, and parameters that actually mean something (a search query, for example)
            are left alone.
          </p>
        </div>

        <FaqSection />
      </div>
    </AppShell>
  );
}
