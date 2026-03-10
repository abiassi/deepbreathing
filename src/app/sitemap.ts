import path from "node:path";
import { MetadataRoute } from "next";

import { breathingPages } from "@/data/breathing-pages";
import { useCasePages } from "@/data/use-case-pages";
import { buildSitemapEntries, EDGE_PROXY_LOCALE_PREFIXES } from "@/lib/seo/sitemap-routes";

const siteUrl = "https://deepbreathingexercises.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const appDir = path.join(process.cwd(), "src", "app");

  const entries = buildSitemapEntries({
    appDir,
    siteUrl,
    localePrefixes: EDGE_PROXY_LOCALE_PREFIXES,
    breathingPageMeta: breathingPages.map((page) => ({
      slug: page.slug,
      dateModified: page.meta.dateModified,
    })),
    useCasePageMeta: useCasePages.map((page) => ({
      slug: page.slug,
      dateModified: page.meta.dateModified,
    })),
  });

  return entries as MetadataRoute.Sitemap;
}
