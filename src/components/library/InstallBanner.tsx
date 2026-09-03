import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

/**
 * Progressive install prompt. Appears after the 3rd visit (per device),
 * hides forever once dismissed, installed or after the user declines.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const VISIT_KEY = "slashai-visits";
const DISMISS_KEY = "slashai-install-dismissed";
const SEEN_AFTER = 3;

function countVisit(): number {
  try {
    const n = Number(localStorage.getItem(VISIT_KEY) ?? "0") + 1;
    localStorage.setItem(VISIT_KEY, String(n));
    return n;
  } catch {
    return SEEN_AFTER;
  }
}

export function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
      if (window.matchMedia("(display-mode: standalone)").matches) return;
      const seen = countVisit();
      if (seen < SEEN_AFTER) return;
    } catch {
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setHidden(false);
    };
    const onInstalled = () => setHidden(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (hidden || !deferred) return null;

  const install = async () => {
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setHidden(true);
    } catch {
      /* prompt failed — hide to avoid nagging */
    }
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setHidden(true);
  };

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setHidden(true);
  };

  return (
    <div className="flex items-center gap-3 border-b border-[rgba(210,153,34,0.25)] bg-[rgba(210,153,34,0.08)] px-4 py-2.5 md:px-8">
      <Download className="size-4 shrink-0 text-[#d29922]" aria-hidden />
      <p className="min-w-0 flex-1 text-[12.5px] text-foreground/90">
        Add SlashAI to your home screen for full offline access — all 5,635 commands stay available with no connection.
      </p>
      <button
        onClick={install}
        className="shrink-0 rounded-md border border-[rgba(210,153,34,0.45)] bg-[#d29922]/15 px-3 py-1.5 text-[12px] font-semibold text-[#e3b341] transition-colors hover:bg-[#d29922]/25"
      >
        Install
      </button>
      <button onClick={dismiss} aria-label="Dismiss install prompt" className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground">
        <X className="size-4" />
      </button>
    </div>
  );
}
