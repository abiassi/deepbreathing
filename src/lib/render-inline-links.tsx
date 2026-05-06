import type { ReactNode } from "react";

/**
 * Render a string with inline `[text](url)` markdown links converted to anchor
 * tags. Everything else is rendered as plain text.
 *
 * Used for body copy in technique and use-case pages so authors can drop
 * peer-reviewed citation hyperlinks directly into the data files (e.g.
 * `breathing-pages.ts`, `use-case-pages.ts`) without a full markdown
 * renderer. Mass-translate's edge proxy preserves URLs in `<a>` tags, so the
 * translated locales pick this up cleanly.
 *
 * Anchor tags open in a new tab with `noopener noreferrer` for safety. Class
 * names match the rest of the site's primary-link styling.
 *
 * Only `[text](url)` is recognized. No nested formatting, no escaping. If you
 * need richer markdown, use a full renderer instead.
 */
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function renderInlineLinks(text: string): ReactNode {
  if (!text || text.indexOf("[") === -1) {
    return text;
  }

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  // Reset regex state in case of cached lastIndex.
  LINK_RE.lastIndex = 0;

  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [, label, url] = match;
    parts.push(
      <a
        key={`link-${key++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
      >
        {label}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
