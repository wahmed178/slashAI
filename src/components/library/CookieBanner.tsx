import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "slashai-cookie-consent";

type Consent = "accepted" | "essential";

/**
 * Cookie & local storage consent banner. Shows once until the visitor makes a
 * choice; the preference is persisted in localStorage. SlashAI sets no
 * tracking cookies - everything is functional local storage only - so both
 * options keep the full experience.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      /* storage blocked - do not nag */
    }
  }, []);

  const choose = (value: Consent) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
      // Mirror the choice into a real first-party cookie so tooling can read it.
      document.cookie = `${CONSENT_KEY}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-[calc(56px+env(safe-area-inset-bottom))] z-40 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur-[10px] md:bottom-4 md:left-auto md:right-4 md:max-w-sm md:rounded-xl md:border"
    >
      <div className="flex items-start gap-3">
        <Cookie className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-foreground">Cookies &amp; local storage</p>
          <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
            SlashAI uses only essential local storage (saved commands, theme, quiz progress).
            No tracking, no ads, no third-party cookies.{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy policy
            </Link>
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="min-h-[34px] rounded-md bg-primary px-3.5 text-[12.5px] font-semibold text-background transition-colors hover:bg-primary/90"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => choose("essential")}
              className="min-h-[34px] rounded-md border border-border bg-surface px-3.5 text-[12.5px] font-medium text-foreground transition-colors hover:text-primary"
            >
              Essential only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
