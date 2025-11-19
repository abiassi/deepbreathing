import { breathingPages } from "@/data/breathing-pages";

const siteUrl = "https://deepbreathingexercises.com";

const cacheHeaders = "public, max-age=0, must-revalidate, s-maxage=604800, stale-while-revalidate=86400";

interface UrlEntry {
  loc: string;
  lastmod: string;
  changefreq?: string;
  priority?: string;
}

function generateXml(entries: UrlEntry[]) {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ""}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ""}
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function GET() {
  const lastmod = new Date().toISOString();
  const entries: UrlEntry[] = [
    {
      loc: `${siteUrl}/`,
      lastmod,
      changefreq: "weekly",
      priority: "1.0"
    },
    ...breathingPages.map((page) => ({
      loc: `${siteUrl}/breathe/${page.slug}`,
      lastmod: page.meta.dateModified || lastmod,
      changefreq: "weekly",
      priority: "0.8"
    }))
  ];

  return new Response(generateXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": cacheHeaders
    }
  });
}
