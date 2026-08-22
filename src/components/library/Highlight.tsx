interface Props {
  text: string;
  query: string;
  className?: string;
}

/** Highlights case-insensitive matches of every query term inside `text`. */
export function Highlight({ text, query, className }: Props) {
  const terms = query
    .trim()
    .replace(/^\//, "")
    .split(/\s+/)
    .map((t) => t.toLowerCase())
    .filter((t) => t.length > 1);

  if (terms.length === 0) return <span className={className}>{text}</span>;

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
  if (marks.length === 0) return <span className={className}>{text}</span>;

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
