import { MetadataRoute } from "next";
import { breathingPages } from "@/data/breathing-pages";
import { useCasePages } from "@/data/use-case-pages";

const siteUrl = "https://deepbreathingexercises.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const breathingRoutes = breathingPages.map((page) => ({
    url: `${siteUrl}/breathe/${page.slug}`,
    lastModified: new Date(page.meta.dateModified),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const useCaseRoutes = useCasePages.map((page) => ({
    url: `${siteUrl}/for/${page.slug}`,
    lastModified: new Date(page.meta.dateModified),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...breathingRoutes,
    ...useCaseRoutes,
  ];
}
