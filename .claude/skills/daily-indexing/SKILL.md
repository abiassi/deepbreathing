---
name: daily-indexing
description: Submit pending translated pages to Google Search Console and Bing Webmaster Tools for indexing. Reads docs/indexing-queue.md, skips URLs already indexed, picks the next pending URLs by priority, submits via the mass-translate MCP API (preferred) or agent-browser UI (fallback), writes submission dates back, and commits the updated queue. Run daily until the queue drains.
---

# Daily indexing submission

Submits pending URLs from `docs/indexing-queue.md` to Google + Bing and tracks state.

## Context

- The site has ~260 translated pages that indexed slowly after the mid-March rollout. `/languages` is now a crawl hub that accelerates passive indexing, but active submission still helps.
- The queue file has an **Indexed** column (`✓` = already indexed per GSC). NEVER submit a row with `✓` — skip it.
- Two submission channels:
  - **MCP API** (`mass-translate-backend`) — fast, batch. Preferred when OAuth is connected.
  - **agent-browser UI** — fallback. Works today, slower, UI-throttled on GSC side.

## Daily flow

### 1. Check prerequisites

```
mcp__mass-translate-backend__get_site_config
```

Look at `gsc_connected` and `bing_connected`:
- Both true → use MCP API for this run (fast path)
- GSC true, Bing false → MCP for GSC, UI for Bing
- Either false + token refresh failing → UI fallback for both, and note that OAuth re-auth is needed (don't attempt to re-auth automatically; surface this to the user with the URL from `start_gsc_oauth` / `start_bing_oauth`).

### 2. Read queue

Parse `docs/indexing-queue.md` table rows. Each row is `| P | URL | Indexed | GSC | Bing |`.

Filter to **pending** rows per channel:
- GSC pending = `Indexed` empty AND `GSC` empty
- Bing pending = `Indexed` empty AND `Bing` empty

Sort ascending by priority, then URL. Pick the next batch:
- **MCP path**: GSC batch = 50 URLs (Indexing API is generous); Bing batch = 200 URLs (submit in groups of 10 per call, since `submit_urls_bing` caps at 10/call).
- **UI fallback**: GSC = 10; Bing = 50.

### 3. Submit — MCP API path (preferred)

**Google (one URL per call):**
```
for url in gsc_batch:
  mcp__mass-translate-backend__request_indexing(url=url)
```
Treat `success: true` as submitted. On `Google OAuth access token refresh failed` or similar, stop — ask the user to re-auth (`start_gsc_oauth` → visit URL → `complete_gsc_oauth`). Do NOT mark those URLs submitted.

**Bing (up to 10 per call):**
```
for chunk_of_10 in bing_batch:
  mcp__mass-translate-backend__submit_urls_bing(urls=chunk_of_10)
```
On success, mark all URLs in the chunk submitted.

### 4. Submit — agent-browser UI fallback

**Bing** (bulk):
```
agent-browser close
agent-browser --auto-connect open "https://www.bing.com/webmasters/submiturl?siteUrl=https://deepbreathingexercises.com/"
agent-browser --auto-connect wait --load networkidle
agent-browser --auto-connect wait 3000
agent-browser --auto-connect snapshot -i | grep -iE "Submit URLs"
# click Submit URLs button → opens dialog with textarea
agent-browser --auto-connect click @e<button>
agent-browser --auto-connect wait 2000
agent-browser --auto-connect snapshot -i | grep -iE "textbox|Submit"
agent-browser --auto-connect fill @e<textarea> "$(printf '%s\n' <URLs>)"
agent-browser --auto-connect click @e<submit-button>
agent-browser --auto-connect wait 5000
agent-browser --auto-connect screenshot /tmp/bing-result.png
# verify "Success: URL submitted Successfully" appears before marking submitted
```

**GSC** (one URL at a time):
```
agent-browser --auto-connect open "https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Adeepbreathingexercises.com"
agent-browser --auto-connect wait --load networkidle
# for each URL in gsc_batch:
agent-browser --auto-connect snapshot -i | grep -iE "Inspect any URL"
agent-browser --auto-connect fill @e<inspect-combobox> "<URL>"
agent-browser --auto-connect press Enter
agent-browser --auto-connect wait 10000
agent-browser --auto-connect snapshot -i | grep -iE "Request indexing"
agent-browser --auto-connect click @e<request-indexing-button>
agent-browser --auto-connect wait 20000
agent-browser --auto-connect screenshot /tmp/gsc-<N>.png
# confirm "Indexing requested" in screenshot, then dismiss
agent-browser --auto-connect find text "Dismiss" click
# re-snapshot to refresh refs for next URL
```

If GSC shows "Quota exceeded" or the request-indexing dialog doesn't appear: stop GSC loop, do NOT mark those URLs submitted, resume tomorrow.

### 5. Update the queue

For each URL successfully submitted, edit its row in `docs/indexing-queue.md` to write today's date (YYYY-MM-DD) in the appropriate column. Use the Edit tool with the unique full row string.

### 6. Weekly: refresh the Indexed column

Once a week, re-pull the GSC indexed list so the `Indexed` column reflects reality (pages Google has now indexed should be marked `✓` and no longer submitted):

```
agent-browser --auto-connect open "https://search.google.com/search-console/index?resource_id=sc-domain%3Adeepbreathingexercises.com"
# click "View data about indexed pages"
# eval to extract all rows, filter URLs, strip PUA icon chars
```

Then update the `Indexed` column for any URL newly present in the indexed list.

### 7. Commit

```
git add docs/indexing-queue.md
git commit -m "Indexing queue: submitted N URLs to GSC, M to Bing ($(date +%Y-%m-%d))"
```

Do not push — the user reviews and pushes.

### 8. Report back (≤5 lines)

- GSC submitted today (N) + any failures
- Bing submitted today (M) + any failures
- Pending by priority remaining
- Next run time / blockers (e.g., "Bing OAuth needs re-auth")

## Expected runtime

- Via MCP API: ~30 seconds for 50 GSC + 200 Bing.
- Via UI fallback: ~5-8 minutes for 10 GSC + 50 Bing.

## Completion signal

Queue drains when all non-indexed rows have a date in both GSC and Bing columns. At that point, stop daily runs; switch to weekly Indexed-column refresh only. Verify impact via GSC Coverage indexed count trend.
