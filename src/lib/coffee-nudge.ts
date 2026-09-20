/**
 * Smart engagement nudge helper for supporting SlashAI / Buy Me a Coffee.
 *
 * Rules:
 * - Triggers when a user visits for the 3rd or 4th time (session-deduplicated)
 * - AND has copied commands or played games >= 4 times
 * - Dismissible with a 14-day snooze so it never becomes annoying
 * - Never shows on /coffee or /about routes
 */

export const COFFEE_KEYS = {
  visitCount: "slashai_visit_count",
  sessionSeen: "slashai_session_seen",
  actionCount: "slashai_action_count",
  dismissedAt: "slashai_coffee_nudge_dismissed",
} as const;

export const COFFEE_EVENT = "slashai-coffee-nudge-update";

const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

/**
 * Increments the visit count once per browser session.
 */
export function initVisitTracking(): number {
  if (typeof window === "undefined") return 0;
  try {
    const sessionSeen = window.sessionStorage.getItem(COFFEE_KEYS.sessionSeen);
    let count = parseInt(window.localStorage.getItem(COFFEE_KEYS.visitCount) || "0", 10);
    if (Number.isNaN(count) || count < 0) count = 0;

    if (!sessionSeen) {
      count += 1;
      window.sessionStorage.setItem(COFFEE_KEYS.sessionSeen, "1");
      window.localStorage.setItem(COFFEE_KEYS.visitCount, String(count));
    }
    return count;
  } catch {
    return 0;
  }
}

/**
 * Gets current visit count.
 */
export function getVisitCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const v = parseInt(window.localStorage.getItem(COFFEE_KEYS.visitCount) || "0", 10);
    return Number.isNaN(v) ? 0 : v;
  } catch {
    return 0;
  }
}

/**
 * Gets current engagement actions count (copies + games played).
 */
export function getActionCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const v = parseInt(window.localStorage.getItem(COFFEE_KEYS.actionCount) || "0", 10);
    return Number.isNaN(v) ? 0 : v;
  } catch {
    return 0;
  }
}

/**
 * Record a high-value user interaction (copying a command or playing a game).
 */
export function recordEngagementAction(_kind: "command_copy" | "game_play" | "tool_run"): void {
  if (typeof window === "undefined") return;
  try {
    const current = getActionCount();
    const next = current + 1;
    window.localStorage.setItem(COFFEE_KEYS.actionCount, String(next));
    window.dispatchEvent(new CustomEvent(COFFEE_EVENT, { detail: { actionCount: next } }));
  } catch {
    /* safe fallback */
  }
}

/**
 * Checks whether the coffee support nudge should be shown.
 */
export function shouldShowCoffeeNudge(pathname?: string): boolean {
  if (typeof window === "undefined") return false;

  // Don't show on support/about pages
  if (pathname) {
    const clean = pathname.toLowerCase();
    if (clean === "/coffee" || clean === "/about") return false;
  }

  try {
    // Check dismissal
    const dismissed = window.localStorage.getItem(COFFEE_KEYS.dismissedAt);
    if (dismissed) {
      const ts = parseInt(dismissed, 10);
      if (!Number.isNaN(ts) && Date.now() - ts < DISMISS_COOLDOWN_MS) {
        return false;
      }
    }

    const visits = getVisitCount();
    const actions = getActionCount();

    // Trigger on 3rd+ visit and 4+ actions (e.g. copied commands or played games)
    return visits >= 3 && actions >= 4;
  } catch {
    return false;
  }
}

/**
 * Dismiss the nudge for 14 days.
 */
export function dismissCoffeeNudge(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COFFEE_KEYS.dismissedAt, String(Date.now()));
    window.dispatchEvent(new CustomEvent(COFFEE_EVENT, { detail: { dismissed: true } }));
  } catch {
    /* safe fallback */
  }
}
