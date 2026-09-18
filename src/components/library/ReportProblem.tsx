import { Flag } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  /** what is being reported, e.g. the command text or tool name */
  subject: string;
  /** extra context included in the mail body, e.g. the page path */
  context?: string;
  className?: string;
}

/**
 * "Something wrong? Report it" — opens the user's mail client with the item
 * already named, so reporting a broken command/tool is one tap.
 */
export function ReportProblem({ subject, context, className }: Props) {
  const body = [
    `Item: ${subject}`,
    context ? `Page: ${context}` : null,
    "",
    "What went wrong:",
    "",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const href = `mailto:hello@slashai.in?subject=${encodeURIComponent(
    `SlashAI report: ${subject}`,
  )}&body=${encodeURIComponent(body)}`;

  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <Flag className="size-3.5" aria-hidden />
      Something wrong? Report it
    </a>
  );
}
