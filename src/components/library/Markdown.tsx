/**
 * Minimal markdown renderer for AI-generated specs. Handles headings, lists,
 * fenced code blocks, bold and paragraphs — enough for the spec format we ask
 * the model for, with no extra dependency.
 */
import * as React from "react";

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

type Token =
  | { type: "heading"; level: number; text: string }
  | { type: "code"; code: string }
  | { type: "list"; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "paragraph"; text: string };

function parseMarkdown(source: string): Token[] {
  const lines = source.split("\n");
  const tokens: Token[] = [];
  let list: string[] = [];
  let code: string[] | null = null;
  let table: string[][] | null = null;

  const flushTable = () => {
    if (!table || !table.length) {
      table = null;
      return;
    }
    const [header, ...rows] = table;
    tokens.push({ type: "table", header: header ?? [], rows });
    table = null;
  };

  const splitRow = (line: string) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());

  const flushList = () => {
    if (!list.length) return;
    tokens.push({ type: "list", items: list });
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.trim().startsWith("```")) {
      if (code) {
        tokens.push({ type: "code", code: code.join("\n") });
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
      tokens.push({ type: "heading", level, text });
      continue;
    }

    if (/^[-*]\s+/.test(line.trim()) || /^\d+\.\s+/.test(line.trim())) {
      list.push(line.trim().replace(/^([-*]|\d+\.)\s+/, ""));
      continue;
    }

    if (/^\|.*\|/.test(line.trim())) {
      flushList();
      const cells = splitRow(line);
      // skip the |---|---| separator row
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
      table = table ?? [];
      table.push(cells);
      continue;
    }
    flushTable();

    if (!line.trim()) {
      flushList();
      continue;
    }

    flushList();
    tokens.push({ type: "paragraph", text: line });
  }
  flushList();
  flushTable();
  if (code?.length) {
    tokens.push({ type: "code", code: code.join("\n") });
  }
  return tokens;
}

function MarkdownTable({ header, rows }: { header: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th
                key={i}
                className="border-b border-border px-2 py-1.5 font-semibold text-foreground"
              >
                {inline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, i) => (
                <td
                  key={i}
                  className="border-b border-border/50 px-2 py-1.5 align-top text-muted-foreground"
                >
                  {inline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MarkdownList({ items }: { items: string[] }) {
  return (
    <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <li key={i}>{inline(item)}</li>
      ))}
    </ul>
  );
}

function MarkdownCode({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-accent/60 p-3 text-[12px] whitespace-pre-wrap">
      <code>{code}</code>
    </pre>
  );
}

function MarkdownHeading({ level, text }: { level: number; text: string }) {
  return level <= 2 ? (
    <h3 className="mt-4 text-base font-bold text-foreground">{text}</h3>
  ) : (
    <h4 className="mt-3 text-sm font-semibold text-foreground">{text}</h4>
  );
}

function MarkdownParagraph({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground">{inline(text)}</p>;
}

export function Markdown({ source }: { source: string }) {
  const tokens = parseMarkdown(source);
  return (
    <div className="space-y-2">
      {tokens.map((token, i) => {
        switch (token.type) {
          case "table":
            return <MarkdownTable key={`tbl-${i}`} header={token.header} rows={token.rows} />;
          case "list":
            return <MarkdownList key={`ul-${i}`} items={token.items} />;
          case "code":
            return <MarkdownCode key={`code-${i}`} code={token.code} />;
          case "heading":
            return <MarkdownHeading key={`h-${i}`} level={token.level} text={token.text} />;
          case "paragraph":
            return <MarkdownParagraph key={`p-${i}`} text={token.text} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

/** Pulls the first fenced code block out of a spec — that's the Lovable prompt. */
export function extractPrompt(markdown: string) {
  const match = markdown.match(/```[a-z]*\n([\s\S]*?)```/i);
  return match?.[1]?.trim() ?? "";
}
