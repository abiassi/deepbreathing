import { runSitemapPingWorkflow } from "./ping-sitemap-lib.mjs";

await runSitemapPingWorkflow({
  ci: process.env.CI === "true",
  sitemapUrl: process.env.SITEMAP_URL,
});
