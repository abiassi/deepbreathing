import { MetadataRoute } from "next";
import { breathingPages } from "@/data/breathing-pages";

const siteUrl = "https://deepbreathingexercises.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const breathingRoutes = breathingPages.map((page) => ({
    url: `${siteUrl}/breathe/${page.slug}`,
    lastModified: new Date(page.meta.dateModified),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...breathingRoutes,
  ];
}
