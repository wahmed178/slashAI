/**
 * Dataset integrity checks for the SlashAI catalog.
 *
 * Used by `bun scripts/validate-catalog.mjs` (CI / pre-commit) and available to the
 * app for a dev-only sanity check. Pure functions — no DOM, no imports of the data
 * itself, so it also works against a future API-backed catalog.
 */

export interface CatalogCommand {
  id: string;
  command: string;
  title: string;
  description: string;
  howToUse: string;
  example: string;
  category: string;
  subcategory: string;
  tags: string[];
  type: string;
  difficulty: string;
  featured: boolean;
  aliases: string[];
  popularity: number;
  addedAt: string;
}

export interface CatalogCategory {
  category: string;
  icon: string;
  type: string;
  subcategories: string[];
}

export interface ValidationIssue {
  level: "error" | "warning";
  code: string;
  message: string;
  ids: string[];
}

export interface ValidationReport {
  total: number;
  categories: number;
  subcategories: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  ok: boolean;
}

const TYPES = new Set([
  "image",
  "text",
  "document",
  "data",
  "coding",
  "research",
  "productivity",
  "audio",
  "video",
  "business",
  "learning",
  "general",
]);
const DIFFICULTIES = new Set(["easy", "medium", "advanced"]);

/** Boilerplate patterns that indicate mechanically repeated filler copy. */
const BOILERPLATE = [
  /use this command to/i,
  /lorem ipsum/i,
  /^todo/i,
  /placeholder/i,
  /provide .* plus any constraints/i,
];

export const normalizeCommandName = (value: string) =>
  value.trim().replace(/\s+/g, "").toLowerCase();

const REQUIRED_FIELDS: (keyof CatalogCommand)[] = [
  "id",
  "command",
  "title",
  "description",
  "howToUse",
  "example",
  "category",
  "subcategory",
  "type",
  "difficulty",
];

const STOP = new Set([
  "the",
  "a",
  "an",
  "of",
  "and",
  "for",
  "in",
  "to",
  "with",
  "your",
  "into",
  "from",
  "on",
  "it",
  "that",
]);

function purposeTokens(cmd: CatalogCommand): Set<string> {
  return new Set(
    `${cmd.title} ${cmd.description}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let shared = 0;
  for (const t of a) if (b.has(t)) shared += 1;
  const union = a.size + b.size - shared;
  return union === 0 ? 0 : shared / union;
}

export function validateCatalog(
  commands: CatalogCommand[],
  categories: CatalogCategory[],
): ValidationReport {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const err = (code: string, message: string, ids: string[] = []) =>
    errors.push({ level: "error", code, message, ids });
  const warn = (code: string, message: string, ids: string[] = []) =>
    warnings.push({ level: "warning", code, message, ids });

  const validCategories = new Map(categories.map((c) => [c.category, new Set(c.subcategories)]));

  const byId = new Map<string, string[]>();
  const byName = new Map<string, string[]>();
  const byAlias = new Map<string, string[]>();
  const byDescription = new Map<string, string[]>();
  const byExample = new Map<string, string[]>();
  const push = (map: Map<string, string[]>, key: string, id: string) => {
    const list = map.get(key);
    if (list) list.push(id);
    else map.set(key, [id]);
  };

  for (const cmd of commands) {
    for (const field of REQUIRED_FIELDS) {
      if (!cmd[field] || String(cmd[field]).trim() === "") {
        err("missing-field", `${cmd.id || "(no id)"} is missing "${field}"`, [cmd.id]);
      }
    }
    if (!cmd.command?.startsWith("/")) {
      err("bad-command", `${cmd.id}: command must start with "/"`, [cmd.id]);
    }
    if (cmd.command !== cmd.command?.trim() || /\s/.test(cmd.command ?? "")) {
      err("whitespace", `${cmd.id}: command contains whitespace`, [cmd.id]);
    }
    if (!TYPES.has(cmd.type)) err("bad-type", `${cmd.id}: unknown type "${cmd.type}"`, [cmd.id]);
    if (!DIFFICULTIES.has(cmd.difficulty)) {
      err("bad-difficulty", `${cmd.id}: unknown difficulty "${cmd.difficulty}"`, [cmd.id]);
    }
    if (!Array.isArray(cmd.tags) || cmd.tags.length === 0) {
      err("no-tags", `${cmd.id}: needs at least one tag`, [cmd.id]);
    }
    const subs = validCategories.get(cmd.category);
    if (!subs) {
      err("bad-category", `${cmd.id}: unknown category "${cmd.category}"`, [cmd.id]);
    } else if (!subs.has(cmd.subcategory)) {
      warn(
        "unlisted-subcategory",
        `${cmd.id}: subcategory "${cmd.subcategory}" is not registered under ${cmd.category}`,
        [cmd.id],
      );
    }
    if (cmd.example && !cmd.example.includes(cmd.command)) {
      warn("example-mismatch", `${cmd.id}: example does not show ${cmd.command}`, [cmd.id]);
    }
    for (const text of [cmd.description, cmd.howToUse, cmd.example]) {
      if (text && BOILERPLATE.some((re) => re.test(text))) {
        warn("boilerplate", `${cmd.id}: contains boilerplate filler copy`, [cmd.id]);
        break;
      }
    }

    push(byId, cmd.id, cmd.id);
    push(byName, normalizeCommandName(cmd.command ?? ""), cmd.id);
    push(byDescription, cmd.description?.trim().toLowerCase() ?? "", cmd.id);
    push(byExample, cmd.example?.trim().toLowerCase() ?? "", cmd.id);
    for (const alias of cmd.aliases ?? []) push(byAlias, normalizeCommandName(alias), cmd.id);
  }

  for (const [id, ids] of byId) if (ids.length > 1) err("duplicate-id", `duplicate id "${id}"`, ids);
  for (const [name, ids] of byName) {
    if (ids.length > 1) err("duplicate-command", `duplicate command name "${name}"`, ids);
  }
  for (const [alias, ids] of byAlias) {
    if (ids.length > 1) err("duplicate-alias", `duplicate alias "${alias}"`, ids);
    if (byName.has(alias)) {
      err("alias-collision", `alias "${alias}" collides with a real command name`, [
        ...ids,
        ...(byName.get(alias) ?? []),
      ]);
    }
  }
  for (const [, ids] of byDescription) {
    if (ids.length > 1) err("duplicate-description", `identical description reused`, ids);
  }
  for (const [, ids] of byExample) {
    if (ids.length > 1) err("duplicate-example", `identical example reused`, ids);
  }

  // near-duplicate purposes, compared only inside the same subcategory bucket
  const buckets = new Map<string, CatalogCommand[]>();
  for (const cmd of commands) {
    const key = `${cmd.category}::${cmd.subcategory}`;
    const list = buckets.get(key);
    if (list) list.push(cmd);
    else buckets.set(key, [cmd]);
  }
  for (const list of buckets.values()) {
    const tokens = list.map(purposeTokens);
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const score = jaccard(tokens[i]!, tokens[j]!);
        if (score >= 0.8) {
          warn(
            "near-duplicate",
            `${list[i]!.command} and ${list[j]!.command} describe nearly the same job (${Math.round(score * 100)}% overlap)`,
            [list[i]!.id, list[j]!.id],
          );
        }
      }
    }
  }

  return {
    total: commands.length,
    categories: validCategories.size,
    subcategories: new Set(commands.map((c) => `${c.category}::${c.subcategory}`)).size,
    errors,
    warnings,
    ok: errors.length === 0,
  };
}
