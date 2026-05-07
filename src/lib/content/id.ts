import 'server-only';
import { randomBytes } from 'node:crypto';

/**
 * Generates a short, URL-safe, lexicographically-sortable id.
 * Format: <timestamp-base36>-<random-hex>  → e.g. "lqd9wq2c-f3a8b1".
 */
export function generateId(): string {
  const ts = Date.now().toString(36);
  const rand = randomBytes(4).toString('hex');
  return `${ts}-${rand}`;
}

/**
 * Slugify a string into a URL-safe slug, preserving ASCII alphanumerics
 * and converting all other characters to hyphens.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
