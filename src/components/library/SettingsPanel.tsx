import { Moon, Sun, Rows3, Rows4, Keyboard } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/hooks/use-library";

const SHORTCUTS: [string, string][] = [
  ["/  or  Ctrl K", "Focus search"],
  ["Esc", "Clear search / close dialog"],
  ["Enter", "Open highlighted command"],
  ["R", "Random command"],
];

export function SettingsPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { settings, updateSettings } = useLibrary();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Stored on this device — no account needed.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <section>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Theme</p>
            <div className="grid grid-cols-2 gap-2">
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
            </div>
          </section>

          <section>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Density</p>
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
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Results per page</p>
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
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Keyboard className="size-3.5" /> Keyboard shortcuts
            </p>
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
