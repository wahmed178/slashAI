import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PDFDocument } from "pdf-lib";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/pdf-merge")({ component: PdfMerge });

interface PdfFile {
  id: string;
  file: File;
  pages: number | null;
  size: number;
}

const fmtSize = (b: number) => (b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

function PdfMerge() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (list: FileList | null) => {
    if (!list?.length) return;
    setError(null);
    const incoming: PdfFile[] = [];
    for (const file of Array.from(list)) {
      if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
        setError(`"${file.name}" is not a PDF.`);
        continue;
      }
      const entry: PdfFile = { id: `${file.name}-${file.size}-${crypto.randomUUID().slice(0, 8)}`, file, pages: null, size: file.size };
      // Page counts are read eagerly so the list is informative before merging.
      try {
        const buf = await file.arrayBuffer();
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
        entry.pages = doc.getPageCount();
      } catch {
        entry.pages = null; // merge will surface the real error if the file is unreadable
      }
      incoming.push(entry);
    }
    if (incoming.length) setFiles((prev) => [...prev, ...incoming]);
  }, []);

  const move = (index: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[index]!;
      next[index] = next[target]!;
      next[target] = tmp;
      return next;
    });
  };

  const merge = async () => {
    if (files.length < 2) {
      setError("Add at least two PDFs to merge.");
      return;
    }
    setBusy(true);
    setError(null);
    setStatus("Merging…");
    try {
      const out = await PDFDocument.create();
      for (const entry of files) {
        const src = await PDFDocument.load(await entry.file.arrayBuffer(), { ignoreEncryption: true });
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setStatus(`Merged ${files.length} files · ${out.getPageCount()} pages`);
    } catch (e) {
      setStatus(null);
      setError(e instanceof Error ? `Merge failed: ${e.message}` : "Merge failed — one of the files may be corrupted or password-protected.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => () => setStatus(null), []);

  return (
    <AppShell title="PDF Merger">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📎 PDF Merger</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Combine PDFs in the exact order you choose. Files never leave your device — the merge happens in your browser.
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-border bg-surface p-8 text-center transition-colors hover:border-primary/50">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              void addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <div className="text-4xl">📄</div>
          <div className="mt-2 font-semibold text-foreground">Add PDF files</div>
          <div className="mt-1 text-xs text-muted-foreground">Select multiple files — order can be changed below</div>
        </label>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={f.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{f.file.name}</div>
                  <div className="text-xs text-muted-foreground">{fmtSize(f.size)}{f.pages !== null ? ` · ${f.pages} pages` : ""}</div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="grid size-8 place-items-center rounded-lg border border-border text-foreground disabled:opacity-30">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === files.length - 1} aria-label="Move down" className="grid size-8 place-items-center rounded-lg border border-border text-foreground disabled:opacity-30">↓</button>
                  <button onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))} aria-label="Remove" className="grid size-8 place-items-center rounded-lg border border-border text-red-400">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => void merge()}
          disabled={busy || files.length < 2}
          className="h-12 w-full rounded-xl bg-primary font-semibold text-background disabled:opacity-40"
        >
          {busy ? "Working…" : `Merge ${files.length || ""} PDFs & download`}
        </button>

        {status && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-400">{status}</div>}

        <FaqSection />
      </div>
    </AppShell>
  );
}
