interface Props {
  text: string;
  query: string;
  className?: string;
}

/** Highlights the first few case-insensitive matches of `query` inside `text`. */
export function Highlight({ text, query, className }: Props) {
  const needle = query.trim().replace(/^\//, "");
  if (!needle) return <span className={className}>{text}</span>;

  const lower = text.toLowerCase();
  const target = needle.toLowerCase();
  const parts: React.ReactNode[] = [];
  let index = 0;
  let key = 0;

  while (index < text.length) {
    const found = lower.indexOf(target, index);
    if (found === -1 || key > 20) {
      parts.push(text.slice(index));
      break;
    }
    if (found > index) parts.push(text.slice(index, found));
    parts.push(<mark key={key++}>{text.slice(found, found + target.length)}</mark>);
    index = found + target.length;
  }

  return <span className={className}>{parts}</span>;
}
