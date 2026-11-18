import { BREATHING_PATTERNS } from "@/components/resonance/constants";
import { ModeName } from "@/components/resonance/types";
import { breathingPageMap } from "@/data/breathing-pages";
import { createOgImagePath } from "@/lib/seo/og-image";
import { type OgImageSpec, normalizeOgImageSpec } from "@/lib/seo/og-image-spec";

// The English image for /breathe/[slug]. Localized pattern pages share it.
export function breathingOgImageSpec(slug: string): OgImageSpec {
  const page = breathingPageMap[slug];
  const pattern = page ? BREATHING_PATTERNS[page.mode] : BREATHING_PATTERNS[ModeName.Box];
  return normalizeOgImageSpec(page?.hero.title || "Interactive Breathing Visualizer", pattern.color);
}

export function createBreathingOgImagePath(slug: string) {
  const { title, color } = breathingOgImageSpec(slug);
  return createOgImagePath(title, { color });
}
