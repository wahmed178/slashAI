# Command catalog

`commands.json` and `categories.json` are **generated**. Never edit them by hand.

```
scripts/catalog/part-1..4.mjs   hand-authored category data (verbs, objects, samples)
scripts/generate-commands.mjs   builds src/data/commands.json + categories.json
scripts/validate-catalog.mjs    integrity + duplicate report
src/lib/catalog-validation.ts   the validation rules (shared with any future API)
src/lib/commands.ts             typed access layer: search, filters, taxonomy, widgets
```

## Schema

| field | notes |
| --- | --- |
| `id` | stable, lowercase, unique — used in share URLs `/c/<id>` |
| `command` | must start with `/` and be unique |
| `title`, `description`, `howToUse`, `example` | human copy; must not be boilerplate |
| `category`, `subcategory` | category must exist in `categories.json`; hierarchy is category → subcategory → command |
| `tags`, `type`, `difficulty`, `featured`, `aliases`, `popularity`, `addedAt` | metadata used for filtering and sorting |

## Adding commands

1. **One-off command** — append a row to the `CURATED` array in
   `scripts/generate-commands.mjs`.
2. **A family of commands** — add a verb or object to the relevant category group
   in `scripts/catalog/part-*.mjs`. Every verb needs a phrase, an "ask" and a
   deliverable; every object needs a phrase, tags and a concrete sample, so the
   generated copy stays specific instead of templated.
3. Rebuild and validate:

```bash
bun run catalog:build
bun run catalog:validate          # errors fail the run
bun run catalog:validate --strict # warnings fail too
```

Validation flags duplicate ids, duplicate command names, duplicate aliases,
reused descriptions/examples, boilerplate copy, missing fields, invalid
category/subcategory pairs and near-duplicate purposes (Jaccard similarity).
`src/lib/commands.ts` also de-duplicates at runtime, and the dashboard shows the
verified post-deduplication total.

## Moving to a database later

`src/lib/commands.ts` is the only module that touches the JSON. Swap
`rawCommands` for an API/Supabase query returning the same shape and everything
else (search, filters, widgets, share URLs) keeps working. The same validation
rules in `src/lib/catalog-validation.ts` can run server-side on insert.
