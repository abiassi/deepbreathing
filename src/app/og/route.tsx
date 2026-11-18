import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import ogTranslations from '@/data/og-translations.json';
import { loadOgFonts } from '@/lib/og-fonts';
import { findStaticOgImagePath } from '@/lib/seo/og-image';
import { normalizeOgImageSpec } from '@/lib/seo/og-image-spec';
import { redirectToStaticOgImage } from '@/lib/seo/og-redirect';
import {
  BREATHE_LABELS,
  OG_TITLE_MAX_LENGTH,
  clampOgText,
  normalizeOgLocale,
  renderOgScene,
} from '@/lib/seo/og-scene';

type LocaleMap = Record<string, Record<string, string>>;
const byTitle = (ogTranslations as { byTitle: LocaleMap }).byTitle;

export const runtime = 'edge';

const DEFAULT_SUBTITLE = 'deepbreathingexercises.com';

// Legacy URL: pages now link /og/t/<id>.png. English requests for a registered
// image redirect there; anything else (a `lang` from the old proxy, or a title
// no page uses any more) still renders here.
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { title: enTitle, color } = normalizeOgImageSpec(
      searchParams.get('title'),
      searchParams.get('color'),
    );
    const requestedSubtitle = searchParams.get('subtitle')?.trim();
    const subtitle = clampOgText(requestedSubtitle || DEFAULT_SUBTITLE, 56);
    const locale = normalizeOgLocale(searchParams.get('lang')) ?? 'en';

    if (locale === 'en') {
      const staticPath = findStaticOgImagePath({ title: enTitle, color });
      if (staticPath) {
        return redirectToStaticOgImage(request, staticPath);
      }
    }

    const localizedTitle =
      locale !== 'en' && byTitle[enTitle]?.[locale] ? byTitle[enTitle][locale] : enTitle;
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
