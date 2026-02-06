import { MetadataRoute } from "next";
import { breathingPages } from "@/data/breathing-pages";
import { useCasePages } from "@/data/use-case-pages";

const siteUrl = "https://deepbreathingexercises.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    {
      url: `${siteUrl}/breathe`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/for`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/breathing-app`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/box-breathing-app`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/4-7-8-breathing-timer`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/coherent-breathing-app`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/breathing-visualizer`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/1-minute-breathing-exercise`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/2-minute-breathing-exercise`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/5-minute-breathing-exercise`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/holiday-breathing-exercises`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

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
    ...staticRoutes,
    ...breathingRoutes,
    ...useCaseRoutes,
  ];
}
