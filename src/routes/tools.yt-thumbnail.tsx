import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/yt-thumbnail")({ component: YtThumbnail });

interface ThumbVariant {
  key: string;
  label: string;
  file: string;
  note: string;
}

/** Every thumbnail size YouTube generates for a video, largest first. */
const VARIANTS: ThumbVariant[] = [
  { key: "maxres", label: "Max HD 1280×720", file: "maxresdefault.jpg", note: "Full quality — what big channels upload" },
  { key: "sd", label: "Standard 640×480", file: "sddefault.jpg", note: "4:3 with bars, always exists" },
  { key: "hq", label: "High 480×360", file: "hqdefault.jpg", note: "Fallback for every video" },
  { key: "mq", label: "Medium 320×180", file: "mqdefault.jpg", note: "Small preview" },
];

/** Pulls the 11-char video ID out of any YouTube URL shape, or a bare ID. */
export function extractVideoId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return cleanId(url.pathname.slice(1));
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = url.searchParams.get("v");
      if (v) return cleanId(v);
      const m = url.pathname.match(/\/(embed|shorts|live|v)\/([^/?]+)/);
      if (m) return cleanId(m[2] ?? null);
    }
  } catch {
    /* not a URL — fall through */
  }
  return null;
}

function cleanId(s: string | null): string | null {
  const m = s?.match(/[a-zA-Z0-9_-]{11}/);
  return m ? m[0] : null;
}

function YtThumbnail() {
  const [input, setInput] = useState("");
  const [probe, setProbe] = useState<Record<string, boolean>>({});

  const videoId = useMemo(() => extractVideoId(input), [input]);

  // Probe which sizes actually exist for this video (maxres often doesn't).
  const checkVariants = (id: string) => {
    const next: Record<string, boolean> = {};
    let done = 0;
    VARIANTS.forEach((v) => {
      const img = new Image();
      img.onload = () => {
        // YouTube serves a 120x90 grey placeholder for missing sizes.
        next[v.key] = !(img.naturalWidth === 120 && img.naturalHeight === 90);
        done += 1;
        if (done === VARIANTS.length) setProbe({ ...next });
      };
      img.onerror = () => {
        next[v.key] = false;
        done += 1;
        if (done === VARIANTS.length) setProbe({ ...next });
      };
      img.src = `https://i.ytimg.com/vi/${id}/${v.file}`;
    });
    setProbe({});
  };

  const download = async (id: string, file: string) => {
    try {
      const res = await fetch(`https://i.ytimg.com/vi/${id}/${file}`);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${id}-${file}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(`https://i.ytimg.com/vi/${id}/${file}`, "_blank");
    }
  };

  return (
    <AppShell title="YouTube Thumbnail Downloader">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🖼️ YouTube Thumbnail Downloader</h1>
        <p className="mt-1 text-sm text-muted-foreground">Paste any YouTube link to grab the thumbnail in every available resolution.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={() => videoId && checkVariants(videoId)}
            onKeyDown={(e) => e.key === "Enter" && videoId && checkVariants(videoId)}
            placeholder="https://youtube.com/watch?v=… or youtu.be/… or a video ID"
            className="h-12 flex-1 rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {videoId && (
            <button onClick={() => videoId && checkVariants(videoId)} className="h-12 rounded-xl bg-primary px-5 text-sm font-semibold text-background">
              Fetch
            </button>
          )}
        </div>

        {input && !videoId && <p className="text-sm text-red-400">That doesn't look like a YouTube link or video ID.</p>}

        {videoId && (
          <>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <img
                src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`; }}
                alt={`Thumbnail for ${videoId}`}
                className="aspect-video w-full object-cover"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {VARIANTS.map((v) => (
                <div key={v.key} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-foreground">{v.label}</div>
                    <div className="text-xs text-muted-foreground">{v.note}</div>
                  </div>
                  {probe[v.key] === false ? (
                    <span className="text-xs text-muted-foreground">not available</span>
                  ) : (
                    <button
                      onClick={() => void download(videoId, v.file)}
                      className="shrink-0 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                    >
                      Download
                    </button>
                  )}
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Video ID: <code className="rounded bg-surface px-1.5 py-0.5 text-foreground">{videoId}</code>
            </p>
          </>
        )}

        <FaqSection />
      </div>
    </AppShell>
  );
}
