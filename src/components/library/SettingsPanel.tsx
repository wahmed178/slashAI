import { useRef } from "react";
import {
  Moon,
  MoonStar,
  Sun,
  Rows3,
  Rows4,
  Keyboard,
  UserRound,
  Trash2,
  Download,
  Upload,
  Sparkles,
  Info,
  Check,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useLibrary, ACCENTS } from "@/hooks/use-library";
import { CATEGORY_TREE, VERIFIED_TOTAL } from "@/lib/commands";
import { APP_DETAILS, CHANGELOG } from "@/lib/app-meta";
import { cn } from "@/lib/utils";

const SHORTCUTS: [string, string][] = [
  ["/  or  Ctrl K", "Focus search"],
  ["Esc", "Clear search / close dialog"],
  ["Enter", "Open top suggestion"],
  ["R", "Random command"],
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export function SettingsPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const {
    settings,
    updateSettings,
    clearRecents,
    clearSearches,
    recents,
    recentSearches,
    favorites,
    exportBackup,
    importBackup,
    openWhatsNew,
  } = useLibrary();
  const fileRef = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([JSON.stringify(exportBackup(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `slashai-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup file saved");
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const result = importBackup(await file.text());
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Stored on this device — no account needed.</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 px-4 pb-10">
            <section>
              <SectionTitle>Theme</SectionTitle>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={settings.theme === "dark" ? "default" : "outline"}
                  onClick={() => updateSettings({ theme: "dark" })}
                  className="gap-1.5"
                >
                  <Moon className="size-4" /> Dark
                </Button>
                <Button
                  variant={settings.theme === "light" ? "default" : "outline"}
                  onClick={() => updateSettings({ theme: "light" })}
                  className="gap-1.5"
                >
                  <Sun className="size-4" /> Light
                </Button>
                <Button
                  variant={settings.theme === "amoled" ? "default" : "outline"}
                  onClick={() => updateSettings({ theme: "amoled" })}
                  className="gap-1.5"
                >
                  <MoonStar className="size-4" /> AMOLED
                </Button>
              </div>
            </section>

            <section>
              <SectionTitle>Accent colour</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    aria-label={a.label}
                    aria-pressed={settings.accent === a.id}
                    onClick={() => updateSettings({ accent: a.id })}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border-2 transition-transform active:scale-95",
                      settings.accent === a.id ? "border-foreground" : "border-transparent",
                    )}
                    style={{ backgroundColor: a.swatch }}
                  >
                    {settings.accent === a.id && (
                      <Check className="size-4 text-background" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>Density</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={settings.density === "comfortable" ? "default" : "outline"}
                  onClick={() => updateSettings({ density: "comfortable" })}
                  className="gap-1.5"
                >
                  <Rows3 className="size-4" /> Comfortable
                </Button>
                <Button
                  variant={settings.density === "compact" ? "default" : "outline"}
                  onClick={() => updateSettings({ density: "compact" })}
                  className="gap-1.5"
                >
                  <Rows4 className="size-4" /> Compact
                </Button>
              </div>
            </section>

            <section>
              <SectionTitle>
                <Zap className="size-3.5" /> Motion
              </SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={!settings.reducedMotion ? "default" : "outline"}
                  onClick={() => updateSettings({ reducedMotion: false })}
                >
                  Smooth
                </Button>
                <Button
                  variant={settings.reducedMotion ? "default" : "outline"}
                  onClick={() => updateSettings({ reducedMotion: true })}
                >
                  Off
                </Button>
              </div>
            </section>

            <section>
              <SectionTitle>Results per page</SectionTitle>
              <div className="grid grid-cols-3 gap-2">
                {[24, 48, 96].map((n) => (
                  <Button
                    key={n}
                    variant={settings.pageSize === n ? "default" : "outline"}
                    onClick={() => updateSettings({ pageSize: n })}
                  >
                    {n}
                  </Button>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>Backup & restore</SectionTitle>
              <p className="mb-2 text-xs text-muted-foreground">
                Save your {favorites.length} favourite{favorites.length === 1 ? "" : "s"}, history
                and settings to a file, then load it on another device.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="gap-1.5" onClick={download}>
                  <Download className="size-4" /> Backup
                </Button>
                <Button
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="size-4" /> Restore
                </Button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => void onFile(e.target.files?.[0])}
              />
            </section>

            <section>
              <SectionTitle>
                <Sparkles className="size-3.5" /> Updates
              </SectionTitle>
              <div className="space-y-3">
                {CHANGELOG.map((r) => (
                  <div key={r.version} className="panel rounded-xl p-3">
                    <p className="flex items-center justify-between text-sm font-semibold text-foreground">
                      v{r.version}
                      <span className="text-xs font-normal text-muted-foreground">{r.date}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-primary">{r.title}</p>
                    <ul className="mt-2 space-y-1.5">
                      {r.changes.map((c) => (
                        <li
                          key={c}
                          className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="mt-2" onClick={openWhatsNew}>
                Show update popup again
              </Button>
            </section>

            <section>
              <SectionTitle>
                <Keyboard className="size-3.5" /> Keyboard shortcuts
              </SectionTitle>
              <ul className="space-y-1.5">
                {SHORTCUTS.map(([keys, label]) => (
                  <li key={keys} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                      {keys}
                    </kbd>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SectionTitle>Local data</SectionTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={recents.length === 0}
                  onClick={clearRecents}
                >
                  <Trash2 className="size-3.5" /> Clear recents
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={recentSearches.length === 0}
                  onClick={clearSearches}
                >
                  <Trash2 className="size-3.5" /> Clear searches
                </Button>
              </div>
            </section>

            <section>
              <SectionTitle>
                <Info className="size-3.5" /> App details
              </SectionTitle>
              <dl className="panel divide-y divide-border rounded-xl text-sm">
                {[
                  ["App", APP_DETAILS.name],
                  ["Version", `v${APP_DETAILS.version}`],
                  ["Commands", VERIFIED_TOTAL.toLocaleString()],
                  ["Categories", String(CATEGORY_TREE.length)],
                  ["Created by", APP_DETAILS.creator],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-3 py-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">{APP_DETAILS.storage}</p>
            </section>

            <section className="panel rounded-xl p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
                <UserRound className="size-3.5" /> About
              </p>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                Created by {APP_DETAILS.creator}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                SlashAI exists for one reason: AI is most useful when its capabilities are organised
                well enough to reach in a second. {VERIFIED_TOTAL.toLocaleString()} commands across{" "}
                {CATEGORY_TREE.length} categories, each written to be understood and used
                immediately.
              </p>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
