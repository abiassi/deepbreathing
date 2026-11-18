// What an English OG image depends on, and the ID its static file is named by.
// The renderer ignores `subtitle`, so it is not part of the spec. Plain Node
// imports this file from scripts/build-og-registry.mjs, so it has no imports.

export type OgImageSpec = { title: string; color: string };

export const OG_DEFAULT_TITLE = "Deep Breathing Exercises";
// BREATHING_PATTERNS[ModeName.Box].color
export const OG_DEFAULT_COLOR = "#e11d48";

export function normalizeOgImageSpec(title?: string | null, color?: string | null): OgImageSpec {
  const trimmedColor = color?.trim();
  return {
    title: title?.trim() || OG_DEFAULT_TITLE,
    color:
      trimmedColor && /^#?[0-9a-fA-F]{6}$/.test(trimmedColor)
        ? `#${trimmedColor.replace(/^#/, "").toLowerCase()}`
        : OG_DEFAULT_COLOR,
  };
}

// cyrb53: a 53-bit string hash that runs the same in Node, edge and the browser.
export function ogImageId({ title, color }: OgImageSpec): string {
  const input = `${title}\u0000${color}`;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36).padStart(11, "0");
}

export function ogImageStaticPath(id: string) {
  return `/og/t/${id}.png`;
}
