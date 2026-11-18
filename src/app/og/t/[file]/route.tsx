import { ImageResponse } from '@vercel/og';
import { loadStaticOgFonts } from '@/lib/og-fonts-static';
import { getRegisteredOgImage, listRegisteredOgImageIds } from '@/lib/seo/og-image';
import { OG_TITLE_MAX_LENGTH, clampOgText, renderOgScene } from '@/lib/seo/og-scene';

// One PNG per entry in src/data/og-images.json, drawn by `next build` and
// served as a static file. Nothing here runs at request time.
export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return listRegisteredOgImageIds().map((id) => ({ file: `${id}.png` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const spec = getRegisteredOgImage(file.replace(/\.png$/, ''));
  if (!spec) {
    return new Response('Not found', { status: 404 });
  }

  const title = clampOgText(spec.title, OG_TITLE_MAX_LENGTH);
  const image = new ImageResponse(renderOgScene({ title, color: spec.color, locale: 'en' }), {
    width: 1200,
    height: 630,
    fonts: await loadStaticOgFonts(title),
  });

  // Buffer the PNG so a render error fails the build instead of prerendering
  // an empty body.
  const png = await image.arrayBuffer();
  if (png.byteLength === 0) {
    throw new Error(`OG image ${file} rendered an empty PNG`);
  }
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      // Keep OG images out of the index without robots-blocking them
      // (Twitterbot honors robots.txt and would drop card images).
      'X-Robots-Tag': 'noindex',
    },
  });
}
