import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";

export interface Shortcut {
  keys: string;
  description: string;
  action?: () => void;
}

const SHORTCUTS: { keys: string; description: string }[] = [
  { keys: "/", description: "Search commands" },
  { keys: "?", description: "Show this guide" },
  { keys: "G then H", description: "Go to Home" },
  { keys: "G then D", description: "Go to Discover" },
  { keys: "G then T", description: "Go to Trending" },
  { keys: "G then L", description: "Go to Live" },
  { keys: "Escape", description: "Close modal / drawer" },
];

export function KeyboardShortcutsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showGuide, setShowGuide] = useState(false);
  const [pendingG, setPendingG] = useState(false);
  const navigate = useNavigate();

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Escape closes guide
      if (e.key === "Escape") {
        setShowGuide(false);
        setPendingG(false);
        return;
      }

      // ? opens guide
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowGuide(true);
        return;
      }

      // / opens search (navigate to /search)
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        navigate({ to: "/search" });
        return;
      }

      // G + key sequences
      if (pendingG) {
        setPendingG(false);
        const routes: Record<string, string> = {
          h: "/",
          d: "/discover",
          t: "/trending",
          l: "/live",
        };
        const route = routes[e.key.toLowerCase()];
        if (route) {
          e.preventDefault();
          navigate({ to: route as any });
        }
        return;
      }

      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setPendingG(true);
        // Reset after 1 second if no second key
        setTimeout(() => setPendingG(false), 1000);
      }
    },
    [navigate, pendingG],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <>
      {children}
      {showGuide && (
        <ShortcutGuide onClose={() => setShowGuide(false)} />
      )}
    </>
  );
}

function ShortcutGuide({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative mx-4 w-full max-w-sm rounded-2xl border border-[#30363d] bg-[#161b22]/98 p-6 backdrop-blur-xl"
      >
        <h2 className="mb-4 text-sm font-semibold text-[#e6edf3]">
          Keyboard Shortcuts
        </h2>
        <div className="space-y-2.5">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center justify-between">
              <span className="text-[13px] text-[#8b949e]">
                {s.description}
              </span>
              <kbd className="rounded-md border border-[#30363d] bg-[#21262d] px-2 py-0.5 font-mono text-[11px] text-[#8b949e]">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg border border-[#30363d] bg-[#21262d] py-2 text-xs font-medium text-[#8b949e] transition-colors hover:text-[#e6edf3]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
