import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/shortcut")({
  component: ShortcutCheatsheet,
});

const APPS: Record<string, { shortcuts: { keys: string; desc: string }[] }> = {
  "VS Code": {
    shortcuts: [
      { keys: "Ctrl+P", desc: "Quick open file" },
      { keys: "Ctrl+Shift+P", desc: "Command palette" },
      { keys: "Ctrl+`", desc: "Toggle terminal" },
      { keys: "Ctrl+D", desc: "Select next occurrence" },
      { keys: "Alt+↑/↓", desc: "Move line up/down" },
      { keys: "Ctrl+Shift+K", desc: "Delete line" },
      { keys: "Ctrl+/", desc: "Toggle comment" },
      { keys: "Ctrl+Enter", desc: "Insert line below" },
      { keys: "F12", desc: "Go to definition" },
      { keys: "Shift+Alt+F", desc: "Format document" },
      { keys: "Ctrl+B", desc: "Toggle sidebar" },
      { keys: "Ctrl+\\", desc: "Split editor" },
    ],
  },
  Chrome: {
    shortcuts: [
      { keys: "Ctrl+T", desc: "New tab" },
      { keys: "Ctrl+W", desc: "Close tab" },
      { keys: "Ctrl+Shift+T", desc: "Reopen closed tab" },
      { keys: "Ctrl+L", desc: "Focus address bar" },
      { keys: "Ctrl+Tab", desc: "Next tab" },
      { keys: "Ctrl+Shift+Tab", desc: "Previous tab" },
      { keys: "F12", desc: "Developer tools" },
      { keys: "Ctrl+R", desc: "Reload page" },
      { keys: "Ctrl+Shift+Delete", desc: "Clear browsing data" },
      { keys: "Ctrl+J", desc: "Downloads" },
    ],
  },
  Figma: {
    shortcuts: [
      { keys: "V", desc: "Move tool" },
      { keys: "F", desc: "Frame tool" },
      { keys: "R", desc: "Rectangle" },
      { keys: "O", desc: "Ellipse" },
      { keys: "T", desc: "Text" },
      { keys: "Ctrl+D", desc: "Duplicate" },
      { keys: "Ctrl+G", desc: "Group selection" },
      { keys: "Ctrl+Shift+H", desc: "Show/hide UI" },
      { keys: "Alt+Click", desc: "Pick color" },
      { keys: "Ctrl+\\", desc: "Show/hide layers" },
    ],
  },
  Notion: {
    shortcuts: [
      { keys: "/ ", desc: "Open block menu" },
      { keys: "Ctrl+N", desc: "New page" },
      { keys: "Ctrl+Shift+M", desc: "Add comment" },
      { keys: "Ctrl+E", desc: "Inline code" },
      { keys: "Ctrl+Shift+S", desc: "Strike-through" },
      { keys: "Ctrl+B", desc: "Bold" },
      { keys: "Ctrl+I", desc: "Italic" },
      { keys: "[[]]", desc: "Link to page" },
    ],
  },
  Slack: {
    shortcuts: [
      { keys: "Ctrl+K", desc: "Quick switcher" },
      { keys: "Ctrl+Shift+F", desc: "Search" },
      { keys: "Ctrl+/", desc: "Keyboard shortcuts" },
      { keys: "Ctrl+Shift+Enter", desc: "Edit last message" },
      { keys: "Alt+↑", desc: "Edit message" },
      { keys: "Ctrl+Shift+X", desc: "Toggle sidebar" },
    ],
  },
  "Windows": {
    shortcuts: [
      { keys: "Win+L", desc: "Lock screen" },
      { keys: "Win+D", desc: "Show desktop" },
      { keys: "Win+Tab", desc: "Task view" },
      { keys: "Alt+Tab", desc: "Switch windows" },
      { keys: "Win+Shift+S", desc: "Screenshot" },
      { keys: "Win+E", desc: "File Explorer" },
      { keys: "Win+I", desc: "Settings" },
      { keys: "Win+X", desc: "Power menu" },
    ],
  },
  Mac: {
    shortcuts: [
      { keys: "⌘+Space", desc: "Spotlight search" },
      { keys: "⌘+Tab", desc: "Switch apps" },
      { keys: "⌘+Q", desc: "Quit app" },
      { keys: "⌘+W", desc: "Close window" },
      { keys: "⌘+Shift+4", desc: "Screenshot selection" },
      { keys: "⌘+,", desc: "Preferences" },
      { keys: "⌘+H", desc: "Hide app" },
      { keys: "⌘+M", desc: "Minimize" },
    ],
  },
};

function ShortcutCheatsheet() {
  const [app, setApp] = useState("VS Code");
  const [learned, setLearned] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("slashai.shortcuts.learned") || "[]")); } catch { return new Set(); }
  });

  const toggleLearned = (key: string) => {
    setLearned((prev) => {
      const next = new Set(prev);
      const fullKey = `${app}-${key}`;
      next.has(fullKey) ? next.delete(fullKey) : next.add(fullKey);
      try { localStorage.setItem("slashai.shortcuts.learned", JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const shortcuts = APPS[app]?.shortcuts || [];
  const learnedCount = shortcuts.filter((s) => learned.has(`${app}-${s.keys}`)).length;

  return (
    <AppShell title="Keyboard Shortcuts">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⌨️ Keyboard Shortcut Cheatsheet</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick an app, learn shortcuts, track progress.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {Object.keys(APPS).map((name) => (
            <button key={name} onClick={() => setApp(name)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${app === name ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
              {name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{learnedCount}/{shortcuts.length} learned</span>
          <div className="h-1.5 w-32 rounded-full bg-surface overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${shortcuts.length ? (learnedCount / shortcuts.length) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="space-y-1.5">
          {shortcuts.map((s) => {
            const done = learned.has(`${app}-${s.keys}`);
            return (
              <button key={s.keys} onClick={() => toggleLearned(s.keys)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${done ? "border-primary/30 bg-primary/5" : "border-border bg-surface hover:bg-surface-elevated"}`}>
                <kbd className={`shrink-0 rounded-lg border px-2.5 py-1.5 font-mono text-xs ${done ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-surface-elevated text-foreground"}`}>{s.keys}</kbd>
                <span className={`flex-1 text-sm ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>{s.desc}</span>
                {done && <span className="text-xs text-primary">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
