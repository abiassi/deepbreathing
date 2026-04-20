import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const LANGUAGES_HTML = path.join(ROOT, ".next", "server", "app", "languages.html");
const HOMEPAGE_HTML = path.join(ROOT, ".next", "server", "app", "index.html");
const SITE_URL = "https://deepbreathingexercises.com";
const LOCALE_PREFIXES = ["/es", "/pt", "/fr", "/de", "/ja"];

test("/languages SSR HTML has crawlable anchors to every locale root", () => {
  assert.ok(
    fs.existsSync(LANGUAGES_HTML),
    "missing build output for /languages; run `pnpm build` first"
  );
  const html = fs.readFileSync(LANGUAGES_HTML, "utf8");
  for (const prefix of LOCALE_PREFIXES) {
    const pattern = new RegExp(`<a[^>]*href=["']${SITE_URL}${prefix}["']`);
    assert.match(
      html,
      pattern,
      `/languages should include <a href="${SITE_URL}${prefix}"> for crawler discovery`
    );
  }
  const homeAnchor = new RegExp(`<a[^>]*href=["']${SITE_URL}/["']`);
  assert.match(html, homeAnchor, "/languages should also link to the English homepage");
});

test("/languages SSR HTML contains deep anchors into translated pattern pages", () => {
  const html = fs.readFileSync(LANGUAGES_HTML, "utf8");
  const deepPatterns = [
    `${SITE_URL}/es/breathe/buteyko`,
    `${SITE_URL}/de/breathe/tummo`,
    `${SITE_URL}/ja/breathe/ujjayi`,
  ];
  for (const href of deepPatterns) {
    const pattern = new RegExp(`<a[^>]*href=["']${href.replace(/[.]/g, "\\.")}["']`);
    assert.match(html, pattern, `/languages should deep-link to ${href}`);
  }
});

test("homepage SSR HTML links to /languages as a discoverable crawl entry", () => {
  const html = fs.readFileSync(HOMEPAGE_HTML, "utf8");
  assert.match(
    html,
    /<a[^>]*href=["']\/languages["']/,
    "homepage should expose a visible <a href=\"/languages\"> link for crawlers"
  );
});
