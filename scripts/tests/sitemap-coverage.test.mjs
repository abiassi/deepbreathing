import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';

import {
  buildSitemapEntries,
  discoverPageRoutes,
  DEFAULT_EXCLUDED_ROUTES,
} from '../../src/lib/seo/sitemap-routes.mjs';

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'src', 'app');
const SITE_URL = 'https://deepbreathingexercises.com';
const FIXED_NOW = new Date('2026-02-19T00:00:00.000Z');

function getEntries() {
  return buildSitemapEntries({
    appDir: APP_DIR,
    siteUrl: SITE_URL,
    excludedRoutes: DEFAULT_EXCLUDED_ROUTES,
    now: FIXED_NOW,
  });
}

test('sitemap covers every discoverable page route', () => {
  const expectedRoutes = discoverPageRoutes(APP_DIR, DEFAULT_EXCLUDED_ROUTES);
  const entries = getEntries();

  const actualPathnames = new Set(entries.map((entry) => new URL(entry.url).pathname));

  for (const route of expectedRoutes) {
    assert.ok(actualPathnames.has(route), `missing route in sitemap: ${route}`);
  }
});

test('sitemap has no duplicate URLs', () => {
  const entries = getEntries();

  const urls = entries.map((entry) => entry.url);
  assert.equal(new Set(urls).size, urls.length, 'sitemap contains duplicate URLs');
});
