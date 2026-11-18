import registry from "@/data/og-images.json";
import {
  OG_DEFAULT_TITLE,
  type OgImageSpec,
  normalizeOgImageSpec,
  ogImageId,
  ogImageStaticPath,
} from "@/lib/seo/og-image-spec";

const ogImages: Record<string, OgImageSpec> = registry.images;

export function getRegisteredOgImage(id: string): OgImageSpec | undefined {
  return Object.hasOwn(ogImages, id) ? ogImages[id] : undefined;
}

export function listRegisteredOgImageIds() {
  return Object.keys(ogImages);
}

// The build prerenders one PNG per entry in src/data/og-images.json
// (`pnpm og:registry` regenerates it). A spec missing from it falls back to
// the /og handler, which renders at request time.
export function findStaticOgImagePath(spec: OgImageSpec): string | null {
  const id = ogImageId(spec);
  return getRegisteredOgImage(id) ? ogImageStaticPath(id) : null;
}

export function createOgImagePath(title: string, options?: { subtitle?: string; color?: string }) {
  const staticPath = findStaticOgImagePath(normalizeOgImageSpec(title, options?.color));
  if (staticPath) {
    return staticPath;
  }

  const params = new URLSearchParams();
  params.set("title", title || OG_DEFAULT_TITLE);

  if (options?.subtitle) {
    params.set("subtitle", options.subtitle);
  }

  if (options?.color) {
    params.set("color", options.color);
  }

  return `/og?${params.toString()}`;
}
