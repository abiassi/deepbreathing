#!/usr/bin/env node
// Writes src/data/og-images.json: every OG image the built pages link to.
// `next build` prerenders one /og/t/<id>.png per entry, so a page whose image
// is missing from the registry falls back to the /og handler, which renders
// at request time and costs CPU.
//
//   pnpm exec next build && pnpm og:registry   # regenerate, then rebuild
//   node scripts/build-og-registry.mjs --check  # CI: fail if the registry is stale
//
// It reads og:image, twitter:image and JSON-LD `image` URLs from the
// prerendered HTML in .next/server/app.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { normalizeOgImageSpec, ogImageId } from "../src/lib/seo/og-image-spec.ts";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, ".next", "server", "app");
const REGISTRY = path.join(ROOT, "src", "data", "og-images.json");
// Internal gallery that previews the legacy handlers on purpose.
const IGNORED_PAGES = new Set(["og-preview.html"]);
const check = process.argv.includes("--check");

function walkHtml(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkHtml(full));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function collectJsonImages(node, out) {
  if (Array.isArray(node)) node.forEach((item) => collectJsonImages(item, out));
  else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "image" && typeof value === "string") out.push(value);
      else if (key === "image" && value && typeof value.url === "string") out.push(value.url);
      collectJsonImages(value, out);
    }
  }
}

function imageUrls(html) {
  const urls = [];
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/g)) {
    if (!/(?:property|name)="(?:og:image(?::url|:secure_url)?|twitter:image)"/.test(tag)) continue;
    const content = tag.match(/content="([^"]*)"/);
    if (content) urls.push(decodeHtml(content[1]));
  }
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    collectJsonImages(JSON.parse(json), urls);
  }
  return urls;
}

if (!existsSync(APP_DIR)) {
  console.error("No .next/server/app. Run `pnpm exec next build` first.");
  process.exit(1);
}

const current = JSON.parse(readFileSync(REGISTRY, "utf8")).images;
const images = {};
const problems = [];
const legacyPages = new Map();

for (const file of walkHtml(APP_DIR)) {
  if (IGNORED_PAGES.has(path.basename(file))) continue;
  const page = `/${path.relative(APP_DIR, file).replace(/\.html$/, "")}`;
  for (const raw of imageUrls(readFileSync(file, "utf8"))) {
    const url = new URL(raw, "https://deepbreathingexercises.com");
    const staticId = url.pathname.match(/^\/og\/t\/([0-9a-z]+)\.png$/)?.[1];
    if (staticId) {
      if (current[staticId]) images[staticId] = current[staticId];
      else problems.push(`${page} links ${url.pathname}, which is not in the registry`);
      continue;
    }
    if (url.pathname === "/og") {
      if (url.searchParams.has("lang")) {
        problems.push(`${page} links ${raw}; a \`lang\` image cannot be prerendered`);
        continue;
      }
      const spec = normalizeOgImageSpec(url.searchParams.get("title"), url.searchParams.get("color"));
      images[ogImageId(spec)] = spec;
      legacyPages.set(page, raw);
      continue;
    }
    if (url.pathname.startsWith("/og/")) {
      problems.push(`${page} links ${raw}, which is not a prerendered OG image`);
    }
  }
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}

const sorted = Object.fromEntries(Object.entries(images).sort(([a], [b]) => a.localeCompare(b)));
const next = `${JSON.stringify({ generatedBy: "scripts/build-og-registry.mjs", images: sorted }, null, 2)}\n`;

if (check) {
  if (next !== readFileSync(REGISTRY, "utf8")) {
    const added = Object.keys(sorted).filter((id) => !current[id]);
    const removed = Object.keys(current).filter((id) => !sorted[id]);
    console.error(
      `src/data/og-images.json is stale (${added.length} missing, ${removed.length} unused).\n` +
        [...legacyPages].map(([page, url]) => `  ${page} renders at request time: ${url}`).join("\n") +
        "\nRun `pnpm og:registry` after `next build`, commit src/data/og-images.json, and rebuild.",
    );
    process.exit(1);
  }
  console.log(`OG registry is current: ${Object.keys(sorted).length} static images.`);
} else {
  writeFileSync(REGISTRY, next);
  console.log(`Wrote ${Object.keys(sorted).length} images to src/data/og-images.json.`);
}
