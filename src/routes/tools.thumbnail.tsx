import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/thumbnail")({
  component: ThumbnailChecker,
});

function ThumbnailChecker() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const extractId = (input: string) => {
    const match = input.match(/(?:youtu\.be\/|v=|\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : "";
  };

  const handleSubmit = () => {
    const id = extractId(url);
    if (id) setVideoId(id);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImg(URL.createObjectURL(file));
      setVideoId("");
    }
  };

  const thumbSrc = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : previewImg;
  const thumbFallback = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  return (
    <AppShell title="Thumbnail Checker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎬 YouTube Thumbnail Checker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preview how your thumbnail looks in YouTube search, homepage, sidebar, mobile, and Twitter.</p>
      </header>

      <div className="mx-auto max-w-3xl space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste YouTube URL..." className="h-10 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary/50" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          <button onClick={handleSubmit} disabled={!extractId(url)} className="rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">Check Thumbnail</button>
        </div>
        <div className="text-center text-xs text-muted-foreground">— or —</div>
        <div className="text-center">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="rounded-xl border border-border bg-surface px-6 py-2.5 text-sm text-foreground hover:bg-surface-elevated transition-colors">Upload Image</button>
        </div>

        {thumbSrc && (
          <div className="space-y-4">
            {/* Context previews */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-3">YouTube Search Result (Small)</p>
              <div className="flex gap-3 items-start">
                <img src={thumbSrc} onError={(e) => { if (thumbFallback) (e.target as HTMLImageElement).src = thumbFallback; }} alt="thumbnail" className="w-[120px] rounded-lg object-cover" />
                <div className="flex-1"><div className="h-3 w-3/4 rounded bg-muted-foreground/20 mb-1" /><div className="h-2 w-1/2 rounded bg-muted-foreground/10 mb-1" /><div className="h-2 w-1/3 rounded bg-muted-foreground/10" /></div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-3">YouTube Homepage (Medium)</p>
              <div className="flex gap-3 items-start">
                <img src={thumbSrc} onError={(e) => { if (thumbFallback) (e.target as HTMLImageElement).src = thumbFallback; }} alt="thumbnail" className="w-[200px] rounded-lg object-cover" />
                <div className="flex-1"><div className="h-3 w-3/4 rounded bg-muted-foreground/20 mb-1" /><div className="h-2 w-2/3 rounded bg-muted-foreground/10 mb-1" /><div className="h-2 w-1/2 rounded bg-muted-foreground/10" /></div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-3">Sidebar (Small, Dark)</p>
              <div className="flex gap-2 items-start">
                <img src={thumbSrc} onError={(e) => { if (thumbFallback) (e.target as HTMLImageElement).src = thumbFallback; }} alt="thumbnail" className="w-[100px] rounded-lg object-cover" />
                <div className="flex-1"><div className="h-2 w-full rounded bg-muted-foreground/20 mb-1" /><div className="h-2 w-2/3 rounded bg-muted-foreground/10" /></div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-3">Mobile YouTube (Full Width)</p>
              <img src={thumbSrc} onError={(e) => { if (thumbFallback) (e.target as HTMLImageElement).src = thumbFallback; }} alt="thumbnail" className="w-full rounded-lg object-cover" />
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-3">Twitter/X Card Preview</p>
              <div className="rounded-lg border border-border overflow-hidden">
                <img src={thumbSrc} onError={(e) => { if (thumbFallback) (e.target as HTMLImageElement).src = thumbFallback; }} alt="thumbnail" className="w-full h-[180px] object-cover" />
                <div className="p-3 bg-surface-elevated"><div className="h-3 w-3/4 rounded bg-muted-foreground/20 mb-1" /><div className="h-2 w-1/2 rounded bg-muted-foreground/10" /></div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-semibold text-primary mb-2">Tips</p>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                <li>• Is the title text readable at small size (120px)?</li>
                <li>• Are faces clearly visible and expressive?</li>
                <li>• Is the contrast strong enough against YouTube's dark/light backgrounds?</li>
                <li>• Does it stand out from competitors in search results?</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
