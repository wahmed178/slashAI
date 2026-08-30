import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Download, RotateCcw, GripVertical, X } from "lucide-react";

export const Route = createFileRoute("/tools/images-to-pdf")({
  head: () => ({ meta: [{ title: "Images to PDF — SlashAI" }] }),
  component: ImagesToPdf,
});

interface ImgItem { file: File; url: string; }

function ImagesToPdf() {
  const [images, setImages] = useState<ImgItem[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "square">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: ImgItem[] = [];
    for (const f of Array.from(files)) {
      if (f.type.startsWith("image/")) newItems.push({ file: f, url: URL.createObjectURL(f) });
    }
    setImages((prev) => [...prev, ...newItems]);
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const createPDF = async () => {
    if (!images.length) return;
    setCreating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const sizeMap: Record<string, [number, number]> = { a4: [210, 297], letter: [215.9, 279.4], square: [210, 210] };
      const [pw, ph] = sizeMap[pageSize] ?? [210, 297];
      const [w, h] = orientation === "landscape" ? [ph, pw] : [pw, ph];
      const pdf = new jsPDF({ orientation, unit: "mm", format: [w, h] });

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage([w, h], orientation === "landscape" ? "l" : "p");
        const imgData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(images[i]!.file);
        });
        pdf.addImage(imgData, "JPEG", 0, 0, w, h);
      }
      pdf.save("slashai-export.pdf");
    } catch { alert("Failed to create PDF. Try again."); }
    setCreating(false);
  };

  return (
    <AppShell title="Images to PDF" back={{ to: "/tools", label: "SlashKits" }}>
      <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className="mt-4 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-6 text-center transition-colors hover:border-primary/50">
        <span className="text-3xl">{"\u{1F4D5}"}</span>
        <p className="mt-2 text-sm text-foreground">Upload images (JPG, PNG, WebP)</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </div>

      {images.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((img, i) => (
              <div key={i} className="relative rounded-lg border border-border bg-surface p-1">
                <img src={img.url} alt={img.file.name} className="h-20 w-full rounded object-cover" />
                <p className="mt-1 truncate text-[10px] text-muted-foreground">{img.file.name}</p>
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-surface-elevated text-muted-foreground hover:text-red">
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Page size</p>
              <div className="flex gap-1">
                {(["a4", "letter", "square"] as const).map((s) => (
                  <button key={s} type="button" onClick={() => setPageSize(s)}
                    className="min-h-[36px] rounded-lg border px-3 text-xs font-medium capitalize transition-colors"
                    style={{ background: pageSize === s ? "var(--primary)" : "var(--surface-elevated)", borderColor: pageSize === s ? "transparent" : "var(--border)", color: pageSize === s ? "var(--background)" : "var(--muted-foreground)" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Orientation</p>
              <div className="flex gap-1">
                {(["portrait", "landscape"] as const).map((o) => (
                  <button key={o} type="button" onClick={() => setOrientation(o)}
                    className="min-h-[36px] rounded-lg border px-3 text-xs font-medium capitalize transition-colors"
                    style={{ background: orientation === o ? "var(--primary)" : "var(--surface-elevated)", borderColor: orientation === o ? "transparent" : "var(--border)", color: orientation === o ? "var(--background)" : "var(--muted-foreground)" }}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="button" onClick={createPDF} disabled={creating}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            <Download className="size-4" /> {creating ? "Creating PDF…" : `Create PDF (${images.length} images)`}
          </button>
        </div>
      )}
    </AppShell>
  );
}
