# Command catalog

`commands.json` holds the full SlashAI catalog (1,278 records). It is **generated** —
edit the generator, not the JSON.

## Schema

```ts
interface SlashCommand {
  id: string;            // slug of the command, used in the ?cmd= URL param
  command: string;       // "/UpscalePortrait"
  title: string;         // human readable name
  description: string;   // one-line "what it does"
  usage: string;         // detailed "how to use"
  example: string;       // multi-line copy-ready example
  category: string;      // e.g. "Image & Vision"
  subcategory: string;   // e.g. "upscaling"
  tags: string[];
  type: "image" | "text" | "document" | "data" | "coding" | "research"
      | "productivity" | "audio" | "video" | "business" | "learning" | "general";
  difficulty: "easy" | "medium" | "advanced";
  featured: boolean;     // shown on the dashboard
  aliases: string[];
  popularity: number;    // 0-100, used by the "popularity" sort
  addedAt: string;       // YYYY-MM-DD, used by the "newest" sort
}
```

## Adding commands

1. **One-off, hand-written command** — append a tuple to `CURATED` in
   `scripts/generate-commands.mjs`:
   `[command, title, category, subcategory, type, description, usage, example, tags, difficulty, featured]`.
2. **A family of commands** — add a verb (`[Name, subcategory, verbPhrase]`) or an
   object (`[Name, objectPhrase, tags]`) to a category in `CATEGORIES`. Each verb ×
   object pair becomes one command, so one new verb adds six commands.
3. **A whole new category** — append an entry to `CATEGORIES` with `category`,
   `type`, an `icon` name, plus `verbs` and `objects`. Register the icon in
   `src/components/library/icons.tsx` so it renders in the sidebar.

Then regenerate:

```bash
bun scripts/generate-commands.mjs
```

Duplicates are dropped automatically (the generator keys on the lowercased command
string), and `categories.json` is rewritten with the icon/type metadata.

## Moving to a database later

Nothing outside `src/lib/commands.ts` imports the JSON. To move the catalog to an
API or database, keep the exported helpers (`filterCommands`, `suggestions`,
`getCommand`, `relatedCommands`) and swap the `COMMANDS` source for a loader —
the UI does not change.
