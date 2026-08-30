import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

interface Shortcut {
  action: string;
  keys: string[];
}

interface Section {
  title: string;
  shortcuts: Shortcut[];
}

const SECTIONS: Section[] = [
  {
    title: "Global",
    shortcuts: [
      { action: "Open search", keys: ["/"] },
      { action: "Show shortcut guide", keys: ["?"] },
      { action: "Go to Home", keys: ["G", "H"] },
      { action: "Go to Discover", keys: ["G", "D"] },
      { action: "Go to Trending", keys: ["G", "T"] },
      { action: "Go to Live", keys: ["G", "L"] },
      { action: "Close / dismiss", keys: ["Esc"] },
    ],
  },
  {
    title: "Search",
    shortcuts: [
      { action: "Open search", keys: ["/"] },
      { action: "Navigate results", keys: ["↑", "↓"] },
      { action: "Select result", keys: ["Enter"] },
      { action: "Clear search", keys: ["Esc"] },
    ],
  },
  {
    title: "Commands",
    shortcuts: [
      { action: "Copy command", keys: ["C"] },
      { action: "Save to favorites", keys: ["S"] },
      { action: "Open command detail", keys: ["Enter"] },
    ],
  },
  {
    title: "Quiz",
    shortcuts: [
      { action: "Next question", keys: ["Space"] },
      { action: "Previous question", keys: ["←"] },
      { action: "End quiz", keys: ["Esc"] },
    ],
  },
];

function KbdKey({ children }: { children: string }) {
  return (
    <kbd className="inline-block rounded border border-border border-b-2 border-b-[#484f58] bg-[#21262d] px-2 py-0.5 font-mono text-[13px] text-foreground">
      {children}
    </kbd>
  );
}

export const Route = createFileRoute("/keyboard")({
  head: () => ({
    meta: [
      { title: "Keyboard Shortcuts — SlashAI" },
      { name: "description", content: "Every keyboard shortcut available across SlashAI." },
    ],
  }),
  component: KeyboardPage,
});

function KeyboardPage() {
  return (
    <AppShell wide title="Shortcuts">
      <div className="mx-auto max-w-2xl py-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Keyboard Shortcuts</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every shortcut available across SlashAI</p>

        <div className="mt-8 space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="mb-3 text-lg font-semibold text-foreground">{section.title}</h2>
              <div className="space-y-1">
                {section.shortcuts.map((s) => (
                  <div
                    key={s.action}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-2.5"
                  >
                    <span className="text-sm text-foreground">{s.action}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((key, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {i > 0 && <span className="text-xs text-muted-foreground">then</span>}
                          <KbdKey>{key}</KbdKey>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <Link to="/about" className="text-sm text-primary hover:underline">About SlashAI →</Link>
          <Link to="/changelog" className="text-sm text-primary hover:underline">Changelog →</Link>
        </div>
      </div>
    </AppShell>
  );
}
