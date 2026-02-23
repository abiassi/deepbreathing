import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const HOMEPAGE_HTML = path.join(ROOT, ".next", "server", "app", "index.html");

test("homepage build output keeps crawlable SSR body with H1", () => {
  assert.ok(
    fs.existsSync(HOMEPAGE_HTML),
    "missing build output for homepage (.next/server/app/index.html); run `pnpm build` first"
  );

  const html = fs.readFileSync(HOMEPAGE_HTML, "utf8");

  assert.doesNotMatch(
    html,
    /id="__next_error__"/,
    "homepage deopted to app shell; crawlers may miss body headings"
  );

  assert.match(
    html,
    /<h1[\s>]/i,
    "homepage HTML should include a literal <h1> in server-rendered body markup"
  );
});
