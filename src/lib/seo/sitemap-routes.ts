import type { MetadataRoute } from "next";

import {
  DEFAULT_EXCLUDED_ROUTES as rawDefaultExcludedRoutes,
  buildSitemapEntries as rawBuildSitemapEntries,
  discoverPageRoutes as rawDiscoverPageRoutes,
} from "./sitemap-routes.mjs";

export type RouteMetaInput = {
  slug: string;
  dateModified?: string | Date | null | undefined;
};

export type BuildSitemapEntriesInput = {
  appDir: string;
  siteUrl: string;
  excludedRoutes?: string[];
  breathingPageMeta?: RouteMetaInput[];
  useCasePageMeta?: RouteMetaInput[];
  now?: Date;
};

export const DEFAULT_EXCLUDED_ROUTES = rawDefaultExcludedRoutes as string[];

export function discoverPageRoutes(appDir: string, excludedRoutes = DEFAULT_EXCLUDED_ROUTES): string[] {
  return rawDiscoverPageRoutes(appDir, excludedRoutes) as string[];
}

export function buildSitemapEntries(input: BuildSitemapEntriesInput): MetadataRoute.Sitemap {
  return rawBuildSitemapEntries(input as any) as MetadataRoute.Sitemap;
}
