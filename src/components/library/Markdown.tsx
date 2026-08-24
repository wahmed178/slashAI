/**
 * Minimal markdown renderer for AI-generated specs. Handles headings, lists,
 * fenced code blocks, bold and paragraphs — enough for the spec format we ask
 * the model for, with no extra dependency.
 */

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={i} className="rounded bg-accent px-1 py-0.5 text-[12px]">
          {part.slice(1, -1)}
        </code>
      );
    return <span key={i}>{part}</span>;
  });
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let code: string[] | null = null;

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
        {list.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.trim().startsWith("```")) {
      if (code) {
        blocks.push(
          <pre
            key={`code-${blocks.length}`}
            className="overflow-x-auto rounded-lg bg-accent/60 p-3 text-[12px] whitespace-pre-wrap"
          >
            <code>{code.join("\n")}</code>
          </pre>,
        );
        code = null;
      } else {
        flushList();
        code = [];
      }
      continue;
    }

    if (code) {
      code.push(raw);
      continue;
    }

    if (/^#{1,3}\s/.test(line)) {
      flushList();
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+\s*/, "");
      blocks.push(
        level <= 2 ? (
          <h3 key={`h-${blocks.length}`} className="mt-4 text-base font-bold text-foreground">
            {text}
          </h3>
        ) : (
          <h4 key={`h-${blocks.length}`} className="mt-3 text-sm font-semibold text-foreground">
            {text}
          </h4>
        ),
      );
      continue;
    }

    if (/^[-*]\s+/.test(line.trim()) || /^\d+\.\s+/.test(line.trim())) {
      list.push(line.trim().replace(/^([-*]|\d+\.)\s+/, ""));
      continue;
    }

    if (!line.trim()) {
      flushList();
      continue;
    }

    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className="text-sm text-muted-foreground">
        {inline(line)}
      </p>,
    );
  }
  flushList();
  if (code?.length)
    blocks.push(
      <pre key="code-tail" className="overflow-x-auto rounded-lg bg-accent/60 p-3 text-[12px] whitespace-pre-wrap">
        <code>{code.join("\n")}</code>
      </pre>,
    );

  return <div className="space-y-2">{blocks}</div>;
}

/** Pulls the first fenced code block out of a spec — that's the Lovable prompt. */
export function extractPrompt(markdown: string) {
  const match = markdown.match(/```[a-z]*\n([\s\S]*?)```/i);
  return match?.[1]?.trim() ?? "";
}
