const siteUrl = "https://deepbreathingexercises.com";

const cacheHeaders = "public, max-age=0, must-revalidate, s-maxage=604800, stale-while-revalidate=86400";

function generateXml(lastmod: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
}

export async function GET() {
  const lastmod = new Date().toISOString();
  return new Response(generateXml(lastmod), {
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": cacheHeaders
    }
  });
}
