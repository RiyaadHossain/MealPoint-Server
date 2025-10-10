/**
 * Converts a string into a URL-friendly slug.
 * Example: "Chicken Biryani (Special)" → "chicken-biryani-special"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces & underscores with hyphens
    .replace(/[\s_]+/g, "-")
    // Remove all non-alphanumeric chars except hyphens
    .replace(/[^a-z0-9-]/g, "")
    // Replace multiple hyphens with a single one
    .replace(/--+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
}
