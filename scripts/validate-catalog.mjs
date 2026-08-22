/**
 * Catalog integrity check.
 *
 *   bun scripts/validate-catalog.mjs          # errors fail the run
 *   bun scripts/validate-catalog.mjs --strict # warnings fail too
 *
 * Flags duplicate ids, duplicate command names, duplicate aliases, reused
 * descriptions/examples, boilerplate copy, unknown categories/subcategories and
 * suspiciously similar command purposes.
 */
import commands from "../src/data/commands.json" with { type: "json" };
import categories from "../src/data/categories.json" with { type: "json" };
import { validateCatalog } from "../src/lib/catalog-validation.ts";

const strict = process.argv.includes("--strict");
const report = validateCatalog(commands, categories);

console.log(
  `Catalog: ${report.total} commands · ${report.categories} categories · ${report.subcategories} subcategories`,
);

const show = (issues, label) => {
  if (issues.length === 0) return;
  console.log(`\n${label} (${issues.length}):`);
  for (const issue of issues.slice(0, 40)) console.log(`  [${issue.code}] ${issue.message}`);
  if (issues.length > 40) console.log(`  …and ${issues.length - 40} more`);
};

show(report.errors, "ERRORS");
show(report.warnings, "WARNINGS");

if (report.errors.length === 0 && report.warnings.length === 0) console.log("\nNo issues found.");

if (report.errors.length > 0 || (strict && report.warnings.length > 0)) process.exit(1);
