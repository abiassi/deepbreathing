import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const LAYOUT_PATH = path.join(ROOT, "src", "app", "layout.tsx");
const CONFIG_PATH = path.join(ROOT, "src", "lib", "analytics", "google-analytics.ts");

test("GA measurement ID is centralized outside the root layout", () => {
  assert.ok(
    fs.existsSync(CONFIG_PATH),
    "missing analytics config module; expected src/lib/analytics/google-analytics.ts"
  );

  const layoutSource = fs.readFileSync(LAYOUT_PATH, "utf8");
  const configSource = fs.readFileSync(CONFIG_PATH, "utf8");

  assert.doesNotMatch(
    layoutSource,
    /\bG-[A-Z0-9]+\b/,
    "root layout should not hardcode a GA measurement ID"
  );

  assert.match(
    configSource,
    /\bG-[A-Z0-9]+\b/,
    "analytics config should define the GA measurement ID"
  );
});
