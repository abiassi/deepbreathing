import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_EXCLUDED_ROUTES = [];
export const DEFAULT_LOCALE_PREFIXES = [];
export const EDGE_PROXY_LOCALE_PREFIXES = ['es', 'pt', 'fr', 'de', 'ja'];

function isRouteGroup(segment) {
  return segment.startsWith('(') && segment.endsWith(')');
}

function isParallelSegment(segment) {
  return segment.startsWith('@');
}

function isPrivateSegment(segment) {
  return segment.startsWith('_');
}

function isDynamicSegment(segment) {
  return segment.includes('[') || segment.includes(']');
}

function isNonRoutableSegment(segment) {
  return isRouteGroup(segment) || isParallelSegment(segment) || isPrivateSegment(segment);
}

function normalizeRoute(routeSegments) {
  if (routeSegments.length === 0) return '/';
  return `/${routeSegments.join('/')}`;
}

function normalizeLocalePrefix(prefix) {
  return prefix.replace(/^\/+|\/+$/g, '');
}

function createLocalizedRoute(route, prefix) {
  const localePath = `/${prefix}`;
  return route === '/' ? localePath : `${localePath}${route}`;
}

function stripLocalePrefix(route, localePrefixes) {
  for (const prefix of localePrefixes) {
    const localePath = `/${prefix}`;

    if (route === localePath) {
      return '/';
    }

    if (route.startsWith(`${localePath}/`)) {
      return route.slice(localePath.length);
    }
  }

  return route;
}

export function discoverPageRoutes(appDir, excludedRoutes = DEFAULT_EXCLUDED_ROUTES) {
  const excluded = new Set(excludedRoutes);
  const discovered = new Set();

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (!entry.isFile() || entry.name !== 'page.tsx') {
        continue;
      }

      const relativeDir = path.relative(appDir, path.dirname(fullPath));
      const rawSegments = relativeDir === '' ? [] : relativeDir.split(path.sep);

      if (rawSegments.some(isDynamicSegment)) {
        continue;
      }

      const routeSegments = rawSegments.filter((segment) => !isNonRoutableSegment(segment));

      const route = normalizeRoute(routeSegments);

      if (!excluded.has(route)) {
        discovered.add(route);
      }
    }
  }

  walk(appDir);

  return Array.from(discovered).sort();
}

function createMetaMap(items) {
  const map = new Map();

  for (const item of items) {
    if (!item?.slug || !item?.dateModified) continue;
    map.set(item.slug, new Date(item.dateModified));
  }

  return map;
}

export function buildSitemapEntries({
  appDir,
  siteUrl,
  excludedRoutes = DEFAULT_EXCLUDED_ROUTES,
  localePrefixes = DEFAULT_LOCALE_PREFIXES,
  breathingPageMeta = [],
  useCasePageMeta = [],
  now = new Date(),
}) {
  const routes = discoverPageRoutes(appDir, excludedRoutes);
  const normalizedLocalePrefixes = Array.from(
    new Set(localePrefixes.map(normalizeLocalePrefix).filter(Boolean))
  );
  const breathingMetaBySlug = createMetaMap(breathingPageMeta);
  const useCaseMetaBySlug = createMetaMap(useCasePageMeta);
  const sitemapRoutes = Array.from(
    new Set(
      routes.flatMap((route) => [
        route,
        ...normalizedLocalePrefixes.map((prefix) => createLocalizedRoute(route, prefix)),
      ])
    )
  );

  return sitemapRoutes.map((route) => {
    const canonicalRoute = stripLocalePrefix(route, normalizedLocalePrefixes);

    if (canonicalRoute === '/') {
      return {
        url: `${siteUrl}${route === '/' ? '' : route}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 1,
      };
    }

    const url = `${siteUrl}${route}`;

    if (canonicalRoute === '/breathe' || canonicalRoute === '/for') {
      return {
        url,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      };
    }

    if (canonicalRoute.startsWith('/breathe/')) {
      const slug = canonicalRoute.slice('/breathe/'.length);
      return {
        url,
        lastModified: breathingMetaBySlug.get(slug) ?? now,
        changeFrequency: 'monthly',
        priority: 0.8,
      };
    }

    if (canonicalRoute.startsWith('/for/')) {
      const slug = canonicalRoute.slice('/for/'.length);
      return {
        url,
        lastModified: useCaseMetaBySlug.get(slug) ?? now,
        changeFrequency: 'monthly',
        priority: 0.7,
      };
    }

    return {
      url,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });
}
