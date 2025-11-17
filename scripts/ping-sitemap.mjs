if (process.env.CI !== "true") {
  console.log("Skipping sitemap ping; CI environment not detected.");
  process.exit(0);
}

const sitemapUrl = process.env.SITEMAP_URL ?? "https://deepbreathingexercises.com/sitemap.xml";
const targets = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
];

async function ping(target) {
  const res = await fetch(target);
  if (!res.ok) {
    throw new Error(`Ping failed for ${target}: ${res.status}`);
  }
  return target;
}

(async () => {
  try {
    await Promise.all(targets.map(ping));
    console.log(`Sitemap pinged successfully: ${sitemapUrl}`);
  } catch (error) {
    console.error("Sitemap ping error", error);
    process.exitCode = 1;
  }
})();
