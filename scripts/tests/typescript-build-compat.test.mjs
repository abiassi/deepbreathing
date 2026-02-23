import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";

test("TypeScript compile check passes for production deploy", () => {
  assert.doesNotThrow(() => {
    execSync("pnpm exec tsc --noEmit --pretty false --incremental false", {
      cwd: process.cwd(),
      stdio: "pipe",
    });
  });
});
