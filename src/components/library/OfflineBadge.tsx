import { CloudOff } from "lucide-react";
import { useOnline } from "@/hooks/use-online";

/** Subtle indicator — only rendered while the device is offline. */
export function OfflineBadge() {
  const online = useOnline();
  if (online) return null;

  return (
    <span
      role="status"
      className="inline-flex items-center gap-1.5 rounded-full border border-chart-3/40 bg-chart-3/10 px-2.5 py-1 text-[11px] font-medium text-chart-3"
    >
      <CloudOff className="size-3.5" aria-hidden />
      Offline — the full library is still available
    </span>
  );
}
