import type React from "react";

interface Props {
  text: string;
  query: string;
  className?: string;
}

/** Highlights bracketed placeholders [like this] as amber pills */
export function formatWithBracketPills(text: string): React.ReactNode {
  const regex = /\[[^\]\n]{1,60}\]/g;
  if (!regex.test(text)) return text;
  regex.lastIndex = 0;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span
        key={match.index}
        className="rounded bg-amber-400/20 px-1 py-0.5 text-amber-300 font-mono text-[11px] font-medium"
      >
        {match[0]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

/** Highlights case-insensitive matches of every query term inside `text`. */
export function Highlight({ text, query, className }: Props) {
  const terms = query
    .trim()
    .replace(/^\//, "")
    .split(/\s+/)
    .map((t) => t.toLowerCase())
    .filter((t) => t.length > 1);

  if (terms.length === 0) {
    return <span className={className}>{formatWithBracketPills(text)}</span>;
  }

  const lower = text.toLowerCase();
  const marks: [number, number][] = [];
  for (const term of terms) {
    let from = 0;
    while (marks.length < 30) {
      const found = lower.indexOf(term, from);
      if (found === -1) break;
      marks.push([found, found + term.length]);
      from = found + term.length;
    }
  }
  if (marks.length === 0) {
    return <span className={className}>{formatWithBracketPills(text)}</span>;
  }

  marks.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [start, end] of marks) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }

  const parts: React.ReactNode[] = [];
  let index = 0;
  merged.forEach(([start, end], i) => {
    if (start > index) parts.push(text.slice(index, start));
    parts.push(
      <mark key={i} className="rounded-[3px] bg-primary/25 px-0.5 text-foreground">
        {text.slice(start, end)}
      </mark>,
    );
    index = end;
  });
  if (index < text.length) parts.push(text.slice(index));

  return <span className={className}>{parts}</span>;
}
