import { useState } from "react";
import { CloudOff, X } from "lucide-react";
import { useOnline } from "@/hooks/use-online";

/**
 * Full-width offline notice. Appears the moment the connection drops and
 * auto-hides the moment it returns. Dismissing hides it for this session
 * only — the next disconnect shows it again.
 */
export function OfflineBanner() {
  const online = useOnline();
  const [dismissed, setDismissed] = useState(false);

  if (online || dismissed) return null;

  return (
    <div className="flex items-center gap-3 border-b border-[rgba(210,153,34,0.3)] bg-[rgba(210,153,34,0.1)] px-4 py-2.5 md:px-8">
      <CloudOff className="size-4 shrink-0 text-[#d29922]" aria-hidden />
      <p className="min-w-0 flex-1 text-[12.5px] text-foreground/90">
        📴 You're offline — all 5,635 commands are still available. Live data is paused until you reconnect.
      </p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss offline notice"
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
