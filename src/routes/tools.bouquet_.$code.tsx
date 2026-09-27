import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { BouquetArt } from "@/components/library/BouquetArt";
import { playTone } from "@/lib/play-sound";
import { useShortenLink } from "@/components/library/shorten-store";
import { bumpToolClick } from "@/lib/ux";
import { decodeShare, stemSummary, type Bouquet } from "@/lib/bouquet";

/**
 * The share page: one bouquet, one message, nothing else. This is what a
 * shared link opens, so the recipient never has to look at the builder.
 *
 * The file is named `tools.bouquet_.$code.tsx` — the trailing underscore opts
 * the route out of the editor's layout, so the two are siblings. Without it the
 * generator nests this under `/tools/bouquet` and the editor renders as the
 * parent, wrapping the share page in the whole builder.
 */
export const Route = createFileRoute("/tools/bouquet_/$code")({
  head: () => ({
    meta: [
      { title: "Someone sent you a bouquet - SlashAI" },
      { name: "description", content: "A digital flower bouquet, sent to you." },
      // user-generated pages: keep them out of the index
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SharedBouquet,
});

function SharedBouquet() {
  const { code } = Route.useParams();
  const [copied, setCopied] = useState(false);
  const artRef = useRef<HTMLDivElement>(null);
  const shorten = useShortenLink();

  const bouquet = useMemo<Bouquet | null>(() => decodeShare(code), [code]);

  useEffect(() => {
    if (bouquet) bumpToolClick("bouquet");
  }, [bouquet]);

  if (!bouquet) {
    return (
      <AppShell title="Bouquet">
        <div className="mx-auto max-w-md pt-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">This bouquet link looks broken</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The code after <span className="font-mono">/tools/bouquet/</span> could not be read. It
            may have been cut short when it was copied.
          </p>
          <Link
            to="/tools/bouquet"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Build your own bouquet
          </Link>
        </div>
      </AppShell>
    );
  }

  const downloadPng = () => {
    const svg = artRef.current?.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGElement;
    clone.setAttribute("class", "bq-static");
    const xml = new XMLSerializer().serializeToString(clone);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 320 * 3;
      canvas.height = 340 * 3;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "bouquet.png";
        a.click();
        URL.revokeObjectURL(a.href);
      }, "image/png");
      playTone("success");
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
    playTone("copy");
  };

  return (
    <AppShell title="A bouquet for you">
      <div className="mx-auto max-w-lg pt-2 text-center">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {bouquet.from ? `${bouquet.from} sent you` : "Someone sent you"}
        </p>

        <div
          ref={artRef}
          className={`mt-3 overflow-hidden rounded-2xl border border-border p-4 ${
            bouquet.mono ? "bg-white dark:bg-zinc-950" : ""
          }`}
        >
          <BouquetArt bouquet={bouquet} idSuffix="share" />
        </div>

        {bouquet.stems.length > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">{stemSummary(bouquet)}</p>
        )}

        {(bouquet.to || bouquet.message || bouquet.from) && (
          <div className="mt-4 rounded-2xl border border-border bg-surface px-5 py-4">
            {bouquet.to && <p className="text-lg font-bold text-foreground">For {bouquet.to}</p>}
            {bouquet.message && (
              <p className="mt-2 text-base text-muted-foreground">{bouquet.message}</p>
            )}
            {bouquet.from && <p className="mt-2 text-sm text-muted-foreground">— {bouquet.from}</p>}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={copyLink}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {copied ? "Link copied ✓" : "Copy link"}
          </button>
          <button
            onClick={() => shorten.open(window.location.href)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
          >
            Shorten
          </button>
          <button
            onClick={downloadPng}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
          >
            Save image
          </button>
          <Link
            to="/tools/bouquet"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
          >
            Send one back
          </Link>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Made with{" "}
          <a href="/" className="underline hover:text-foreground">
            SlashAI
          </a>{" "}
          · nothing here was uploaded
        </p>
      </div>
    </AppShell>
  );
}
