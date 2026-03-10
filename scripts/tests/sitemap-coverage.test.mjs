import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';

import {
  buildSitemapEntries,
  discoverPageRoutes,
  DEFAULT_EXCLUDED_ROUTES,
  EDGE_PROXY_LOCALE_PREFIXES,
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
    localePrefixes: EDGE_PROXY_LOCALE_PREFIXES,
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

test('sitemap includes translated locale-prefixed URLs when configured', () => {
  const entries = getEntries();
  const actualPathnames = new Set(entries.map((entry) => new URL(entry.url).pathname));

  assert.ok(actualPathnames.has('/es'), 'missing translated home route in sitemap: /es');
  assert.ok(
    actualPathnames.has('/es/breathe/box'),
    'missing translated breathing route in sitemap: /es/breathe/box'
  );
  assert.ok(
    actualPathnames.has('/es/for/anxiety'),
    'missing translated guide route in sitemap: /es/for/anxiety'
  );
});
