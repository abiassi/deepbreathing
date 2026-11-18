import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import ogTranslations from '@/data/og-translations.json';
import { loadOgFonts } from '@/lib/og-fonts';
import { breathingOgImageSpec } from '@/lib/seo/breathing-og-image';
import { findStaticOgImagePath } from '@/lib/seo/og-image';
import { redirectToStaticOgImage } from '@/lib/seo/og-redirect';
import {
  BREATHE_LABELS,
  OG_TITLE_MAX_LENGTH,
  clampOgText,
  normalizeOgLocale,
  renderOgScene,
} from '@/lib/seo/og-scene';

type LocaleMap = Record<string, Record<string, string>>;
const bySlug = (ogTranslations as { bySlug: LocaleMap }).bySlug;

export const runtime = 'edge';

// Legacy URL: breathing pages now link /og/t/<id>.png. English requests
// redirect there; a `lang` from the old proxy still renders here.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { title: enTitle, color } = breathingOgImageSpec(slug);
    const subtitle = 'deepbreathingexercises.com';
    const locale = normalizeOgLocale(request.nextUrl.searchParams.get('lang')) ?? 'en';

    if (locale === 'en') {
      const staticPath = findStaticOgImagePath({ title: enTitle, color });
      if (staticPath) {
        return redirectToStaticOgImage(request, staticPath);
      }
    }

    const localizedTitle =
      locale !== 'en' && bySlug[slug]?.[locale] ? bySlug[slug][locale] : enTitle;
    const title = clampOgText(localizedTitle, OG_TITLE_MAX_LENGTH);

    return new ImageResponse(renderOgScene({ title, subtitle, color, locale }), {
      width: 1200,
      height: 630,
      fonts: await loadOgFonts(
        locale === 'ja'
          ? { jpSubset: `${BREATHE_LABELS.ja}${title}${subtitle}` }
          : undefined,
      ),
      // Keep OG images out of the index without robots-blocking them
      // (Twitterbot honors robots.txt and would drop card images).
      headers: { 'X-Robots-Tag': 'noindex' },
    });
  } catch (e: any) {
    console.error('OG Image generation error:', e);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
