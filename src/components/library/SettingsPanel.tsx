import { Moon, Sun, Rows3, Rows4, Keyboard, UserRound, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/hooks/use-library";
import { CATEGORY_TREE, VERIFIED_TOTAL } from "@/lib/commands";

const SHORTCUTS: [string, string][] = [
  ["/  or  Ctrl K", "Focus search"],
  ["Esc", "Clear search / close dialog"],
  ["Enter", "Open top suggestion"],
  ["R", "Random command"],
];

export function SettingsPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { settings, updateSettings, clearRecents, clearSearches, recents, recentSearches } =
    useLibrary();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Settings & About</SheetTitle>
          <SheetDescription>Stored on this device — no account needed.</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 px-4 pb-8">
            <section>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Theme
              </p>
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
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Density
              </p>
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
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Results per page
              </p>
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

            <section>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Local data
              </p>
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

            <section className="panel rounded-xl p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
                <UserRound className="size-3.5" /> About
              </p>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                Created by Waseem Ahmed
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Waseem Ahmed built the SlashAI Command Library out of a simple, practical idea: AI
                is most useful when its capabilities are organised well enough to reach in a second.
                The library reflects a builder's mindset — structure first, then polish, with a
                steady focus on everyday productivity rather than novelty.
              </p>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                This project reflects that approach: {VERIFIED_TOTAL.toLocaleString()} verified
                commands across {CATEGORY_TREE.length} categories, each written to be discoverable,
                understandable, and immediately usable through a short slash command. The care put
                into taxonomy, de-duplication, and copy-ready examples is what makes the library
                feel like a tool rather than a list.
              </p>
              <p className="mt-3 text-xs text-muted-foreground/80">
                Works offline, stores everything locally, and needs no account.
              </p>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
