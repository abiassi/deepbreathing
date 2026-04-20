import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const HOMEPAGE_HTML = path.join(ROOT, ".next", "server", "app", "index.html");
const LOCALE_ROOTS = [
  { prefix: "/es", label: "Español" },
  { prefix: "/pt", label: "Português" },
  { prefix: "/fr", label: "Français" },
  { prefix: "/de", label: "Deutsch" },
  { prefix: "/ja", label: "日本語" },
];

test("homepage SSR HTML contains crawlable anchor tags to each locale root", () => {
  assert.ok(
    fs.existsSync(HOMEPAGE_HTML),
    "missing build output for homepage (.next/server/app/index.html); run `pnpm build` first"
  );
  const html = fs.readFileSync(HOMEPAGE_HTML, "utf8");
  for (const { prefix } of LOCALE_ROOTS) {
    const anchorPattern = new RegExp(`<a[^>]*href=["']${prefix}["'][^>]*>`);
    assert.match(
      html,
      anchorPattern,
      `homepage HTML should include <a href="${prefix}"> for crawler discovery of translated pages`
    );
  }
});
