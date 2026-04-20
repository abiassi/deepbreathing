import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const HOMEPAGE_HTML = path.join(ROOT, ".next", "server", "app", "index.html");
const CANONICAL = "https://deepbreathingexercises.com";
const LOCALE_PREFIXES = ["/es", "/pt", "/fr", "/de", "/ja"];

test("homepage SSR HTML contains crawlable absolute anchor tags to each locale root", () => {
  assert.ok(
    fs.existsSync(HOMEPAGE_HTML),
    "missing build output for homepage (.next/server/app/index.html); run `pnpm build` first"
  );
  const html = fs.readFileSync(HOMEPAGE_HTML, "utf8");
  for (const prefix of LOCALE_PREFIXES) {
    const anchorPattern = new RegExp(`<a[^>]*href=["']${CANONICAL}${prefix}["'][^>]*>`);
    assert.match(
      html,
      anchorPattern,
      `homepage HTML should include <a href="${CANONICAL}${prefix}"> — absolute URL so mass-translate proxy does not prefix-rewrite`
    );
  }
});
