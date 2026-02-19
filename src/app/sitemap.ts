import path from "node:path";
import { MetadataRoute } from "next";

import { breathingPages } from "@/data/breathing-pages";
import { useCasePages } from "@/data/use-case-pages";
import { buildSitemapEntries } from "@/lib/seo/sitemap-routes.mjs";

const siteUrl = "https://deepbreathingexercises.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const appDir = path.join(process.cwd(), "src", "app");

  return buildSitemapEntries({
    appDir,
    siteUrl,
    breathingPageMeta: breathingPages.map((page) => ({
      slug: page.slug,
      dateModified: page.meta.dateModified,
    })),
    useCasePageMeta: useCasePages.map((page) => ({
      slug: page.slug,
      dateModified: page.meta.dateModified,
    })),
  });
}
