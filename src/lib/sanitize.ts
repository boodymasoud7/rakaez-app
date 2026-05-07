/**
 * HTML sanitizer for Rich Text Editor content.
 * Strips dangerous tags and attributes to prevent XSS attacks.
 */

// Allowed HTML tags (safe for display)
const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'i', 'u', 'strong', 'em', 'strike', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'span', 'div', 'sub', 'sup',
]);

// Allowed attributes per tag
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height']),
  span: new Set(['style']),
  div: new Set(['style', 'dir']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan']),
};

// Safe CSS properties
const SAFE_STYLES = new Set([
  'color', 'background-color', 'font-size', 'font-weight', 'font-style',
  'text-align', 'text-decoration', 'direction', 'margin', 'padding',
]);

/**
 * Sanitize an HTML string by removing dangerous tags and attributes.
 * This is a lightweight sanitizer suitable for rich text content.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Remove script tags and their content
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  clean = clean.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Remove javascript: and data: URIs from href/src
  clean = clean.replace(/(href|src)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '$1=""');
  clean = clean.replace(/(href|src)\s*=\s*(?:"data:[^"]*"|'data:[^']*')/gi, '$1=""');

  // Remove iframe, embed, object tags
  clean = clean.replace(/<(iframe|embed|object|form|input|button)\b[^>]*>(?:.*?<\/\1>)?/gi, '');

  // Remove style tags
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  return clean;
}

/**
 * Sanitize style attribute value, keeping only safe properties
 */
export function sanitizeStyle(style: string): string {
  if (!style) return '';

  return style
    .split(';')
    .filter(rule => {
      const prop = rule.split(':')[0]?.trim().toLowerCase();
      return prop && SAFE_STYLES.has(prop);
    })
    .join(';');
}

/**
 * Check if a URL is safe (not javascript: or data:)
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.trim().toLowerCase();
  return !lower.startsWith('javascript:') && !lower.startsWith('data:') && !lower.startsWith('vbscript:');
}
