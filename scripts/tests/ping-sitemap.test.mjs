import test from "node:test";
import assert from "node:assert/strict";

import { runSitemapPingWorkflow } from "../ping-sitemap-lib.mjs";

const silentLogger = {
  log() {},
  warn() {},
};

test("skips workflow outside CI", async () => {
  let called = 0;
  const fetchImpl = async () => {
    called += 1;
    return { ok: true, status: 200, text: async () => "" };
  };

  const result = await runSitemapPingWorkflow({
    ci: false,
    fetchImpl,
    logger: silentLogger,
  });

  assert.equal(result.skipped, true);
  assert.equal(called, 0);
});

test("does not fail build when search engine sitemap ping fails", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);

    if (url.startsWith("https://www.google.com/ping")) {
      return { ok: false, status: 410, text: async () => "" };
    }

    if (url.startsWith("https://www.bing.com/ping")) {
      return { ok: false, status: 410, text: async () => "" };
    }

    if (url === "https://deepbreathingexercises.com/sitemap.xml") {
      return {
        ok: true,
        status: 200,
        text: async () => "<urlset><url><loc>https://deepbreathingexercises.com/</loc></url></urlset>",
      };
    }

    if (url === "https://api.indexnow.org/indexnow") {
      return { ok: true, status: 202, text: async () => "" };
    }

    throw new Error(`Unexpected URL in mock: ${url}`);
  };

  const result = await runSitemapPingWorkflow({
    ci: true,
    fetchImpl,
    logger: silentLogger,
  });

  assert.equal(result.skipped, false);
  assert.equal(result.pingFailures, 2);
  assert.equal(result.indexNowSubmitted, true);
});
