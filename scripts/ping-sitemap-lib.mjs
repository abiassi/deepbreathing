const DEFAULT_HOST = "deepbreathingexercises.com";
const DEFAULT_SITE_URL = `https://${DEFAULT_HOST}`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const DEFAULT_INDEXNOW_KEY = "a3713189855e4e2983f434ab249fcea1";

function createPingTargets(sitemapUrl) {
  const encoded = encodeURIComponent(sitemapUrl);
  return [
    `https://www.google.com/ping?sitemap=${encoded}`,
    `https://www.bing.com/ping?sitemap=${encoded}`,
  ];
}

async function pingTarget(fetchImpl, target) {
  const res = await fetchImpl(target);
  if (!res.ok) {
    throw new Error(`Ping failed for ${target}: ${res.status}`);
  }
}

async function fetchSitemapUrls(fetchImpl, sitemapUrl) {
  const res = await fetchImpl(sitemapUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap: ${res.status}`);
  }

  const xml = await res.text();
  const urls = [];
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  let match;

  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

async function submitIndexNow(fetchImpl, { host, key, keyLocation, urlList }) {
  const res = await fetchImpl(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList: urlList.slice(0, 10000),
    }),
  });

  if (res.status >= 400) {
    const text = await res.text().catch(() => "");
    throw new Error(`IndexNow submission failed: ${res.status} ${text}`);
  }

  return res.status;
}

export async function runSitemapPingWorkflow({
  ci = false,
  host = DEFAULT_HOST,
  siteUrl = DEFAULT_SITE_URL,
  sitemapUrl = `${siteUrl}/sitemap.xml`,
  indexNowKey = DEFAULT_INDEXNOW_KEY,
  fetchImpl = fetch,
  logger = console,
} = {}) {
  if (!ci) {
    logger.log("Skipping sitemap ping; CI environment not detected.");
    return {
      skipped: true,
      pingFailures: 0,
      indexNowSubmitted: false,
    };
  }

  const pingTargets = createPingTargets(sitemapUrl);
  let pingFailures = 0;

  await Promise.all(
    pingTargets.map(async (target) => {
      try {
        await pingTarget(fetchImpl, target);
      } catch (error) {
        pingFailures += 1;
        logger.warn("Sitemap ping warning", error);
      }
    })
  );

  let indexNowSubmitted = false;

  try {
    const urls = await fetchSitemapUrls(fetchImpl, sitemapUrl);
    if (urls.length === 0) {
      logger.log("IndexNow: No URLs found in sitemap, skipping.");
    } else {
      const status = await submitIndexNow(fetchImpl, {
        host,
        key: indexNowKey,
        keyLocation: `${siteUrl}/${indexNowKey}.txt`,
        urlList: urls,
      });
      indexNowSubmitted = true;
      logger.log(`IndexNow: Submitted ${urls.length} URLs (status ${status})`);
    }
  } catch (error) {
    logger.warn("IndexNow submission warning", error);
  }

  return {
    skipped: false,
    pingFailures,
    indexNowSubmitted,
  };
}
