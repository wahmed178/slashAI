/**
 * Clean URL slugs for /explore categories and subcategories.
 *
 * The command catalog stores display names ("Writing & Communication"), which
 * used to be percent-encoded straight into URLs. This module maps them to
 * short, lowercase, hyphenated slugs (/explore/writing-and-communication) in
 * one direction, and resolves any incoming segment - old percent-encoded
 * names included - back to the display name, so old URLs keep working.
 *
 * Kept out of src/lib/seo.ts (root bundle): imports the command catalogue.
 */
import { CATEGORY_TREE } from "./commands";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "ai-agents-and-prompting" -> category node, or null. */
export function categoryBySlug(slug: string) {
  const decoded = decodeURIComponent(slug);
  return (
    CATEGORY_TREE.find((c) => slugify(c.category) === decoded) ??
    CATEGORY_TREE.find((c) => c.category.toLowerCase() === decoded.toLowerCase()) ??
    null
  );
}

/** Resolve any category segment (slug, encoded name or exact name). */
export function resolveCategory(segment: string): string | null {
  const node = categoryBySlug(segment);
  if (node) return node.category;
  return null;
}

/** Resolve any subcategory segment within a resolved category. */
export function resolveSubcategory(category: string, segment: string): string | null {
  const node = CATEGORY_TREE.find((c) => c.category === category);
  if (!node) return null;
  const decoded = decodeURIComponent(segment);
  const target = slugify(decoded);
  const found = node.subcategories.find(
    (s) =>
      slugify(s.subcategory) === target ||
      s.subcategory.toLowerCase() === decoded.toLowerCase(),
  );
  return found ? found.subcategory : null;
}

export function categoryHref(category: string): string {
  return `/explore/${slugify(category)}`;
}

export function subcategoryHref(category: string, subcategory: string): string {
  return `/explore/${slugify(category)}/${slugify(subcategory)}`;
}
