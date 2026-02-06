if (process.env.CI !== "true") {
  console.log("Skipping sitemap ping; CI environment not detected.");
  process.exit(0);
}

const host = "deepbreathingexercises.com";
const siteUrl = `https://${host}`;
const sitemapUrl = process.env.SITEMAP_URL ?? `${siteUrl}/sitemap.xml`;
const INDEXNOW_KEY = "a3713189855e4e2983f434ab249fcea1";

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

async function fetchSitemapUrls() {
  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap: ${res.status}`);
  }
  const xml = await res.text();
  // Extract <loc> URLs from sitemap XML
  const urls = [];
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function submitIndexNow(urls) {
  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
    urlList: urls.slice(0, 10000) // IndexNow max 10,000 URLs per request
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body)
  });

  // IndexNow returns 200 (OK), 202 (Accepted), or 4xx/5xx on error
  if (res.status >= 400) {
    const text = await res.text().catch(() => "");
    throw new Error(`IndexNow submission failed: ${res.status} ${text}`);
  }

  return { status: res.status, urlCount: urls.length };
}

(async () => {
  // 1. Ping Google & Bing sitemaps
  try {
    await Promise.all(targets.map(ping));
    console.log(`Sitemap pinged successfully: ${sitemapUrl}`);
  } catch (error) {
    console.error("Sitemap ping error", error);
    process.exitCode = 1;
  }

  // 2. Submit all URLs to IndexNow (Bing, Yandex, Naver, Seznam, DuckDuckGo)
  try {
    const urls = await fetchSitemapUrls();
    if (urls.length === 0) {
      console.log("IndexNow: No URLs found in sitemap, skipping.");
      return;
    }
    const result = await submitIndexNow(urls);
    console.log(`IndexNow: Submitted ${result.urlCount} URLs (status ${result.status})`);
  } catch (error) {
    console.error("IndexNow submission error", error);
    // Don't fail the build for IndexNow errors
  }
})();
