---
name: daily-indexing
description: Submit pending translated pages to Google Search Console and Bing Webmaster Tools for indexing. Reads docs/indexing-queue.md, picks the next pending URLs by priority, submits them via agent-browser against the user's logged-in Chrome, and writes submission dates back to the queue. Run daily while the translated-page indexing backlog clears (~25 days).
---

# Daily indexing submission

This skill submits pending URLs from `docs/indexing-queue.md` to Google Search Console and Bing Webmaster Tools using the user's logged-in Chrome via `agent-browser --auto-connect`.

## Context

- The domain has ~260 translated pages that indexed slowly after a mid-March rollout because the reverse-proxy architecture gives translated URLs only hreflang signal (no internal link signal).
- `/languages` is a new SSR discovery hub that accelerates passive crawling, but manual submission still helps.
- GSC URL Inspection → Request Indexing has a silent ~10-20/day cap. Bing URL Submission has a 10,000/day quota.
- Strategy: submit all pending to Bing in one batch on first run (easy), drip 10/day to GSC paced by priority.

## Prerequisites

- User's main Chrome must be running and authenticated in GSC + Bing Webmaster Tools (check with `agent-browser --auto-connect get url`).
- Must be run from the `/Users/abi/Sites/deepbreathing` working directory so relative paths to `docs/indexing-queue.md` resolve.

## Daily operation

### 1. Read state

```bash
grep -c "^| [1-5] |" docs/indexing-queue.md
```

Parse the queue. Rows have format `| P | URL | GSC | Bing |`. Empty GSC or Bing column = pending for that engine.

### 2. Pick batches

- **GSC batch**: next 10 rows where GSC column is empty, sorted by priority ascending. Be conservative — Google throttles silently past ~15/day.
- **Bing batch**: all rows where Bing column is empty (up to 500 at a time if many). Bing's 10K quota makes this easy.

### 3. Submit to Bing (bulk, first)

Navigate once, paste many URLs:

```bash
agent-browser close 2>&1
agent-browser --auto-connect open "https://www.bing.com/webmasters/submiturl?siteUrl=https://deepbreathingexercises.com/" 2>&1 | tail -2
agent-browser --auto-connect wait --load networkidle
agent-browser --auto-connect wait 3000
```

Then snapshot to find the Submit URLs button, click it, fill the textarea with newline-separated URLs, click Submit.

```bash
agent-browser --auto-connect snapshot -i 2>&1 | grep -iE "Submit URLs|textbox"
# Click the "Submit URLs" button (opens dialog)
agent-browser --auto-connect click @e<N>
agent-browser --auto-connect wait 2000
# Fill the textarea — use fill (not type) for multi-URL paste
agent-browser --auto-connect fill @e<textarea-ref> "$(cat /tmp/bing-batch.txt)"
# Click the Submit button inside the dialog
agent-browser --auto-connect click @e<submit-ref>
agent-browser --auto-connect wait 5000
agent-browser --auto-connect screenshot /tmp/bing-result.png
```

Verify "Success: URL submitted Successfully" in the screenshot before marking submitted.

### 4. Submit to GSC (one-by-one)

GSC URL Inspection doesn't have a bulk mode. Loop through the 10 URLs:

```bash
agent-browser --auto-connect open "https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Adeepbreathingexercises.com"
agent-browser --auto-connect wait --load networkidle
agent-browser --auto-connect wait 3000
```

For each URL:

1. `agent-browser --auto-connect snapshot -i 2>&1 | grep -iE "Inspect any URL"` — find the combobox ref
2. `agent-browser --auto-connect fill @e<combobox-ref> "<URL>"`
3. `agent-browser --auto-connect press Enter`
4. `agent-browser --auto-connect wait 10000` — inspection takes time
5. `agent-browser --auto-connect snapshot -i 2>&1 | grep -iE "Request indexing"` — find the button
6. `agent-browser --auto-connect click @e<request-indexing-ref>`
7. `agent-browser --auto-connect wait 20000` — live-URL test takes ~15s
8. `agent-browser --auto-connect screenshot /tmp/gsc-<N>.png` and confirm "Indexing requested" appears
9. Dismiss dialog: `agent-browser --auto-connect find text "Dismiss" click`
10. Re-snapshot to get fresh refs for next URL

**If GSC shows "Quota exceeded"** — stop the GSC loop immediately. Do NOT mark those URLs as submitted. Resume tomorrow.

### 5. Update the queue file

For each URL successfully submitted, update its row in `docs/indexing-queue.md` by writing today's ISO date (YYYY-MM-DD) into the appropriate column. Use Edit tool with `replace_all: false` and unique row context (the URL is unique, so the full row string is unique).

### 6. Commit the change

```bash
git add docs/indexing-queue.md
git commit -m "Indexing queue: submitted N URLs to GSC, M to Bing ($(date +%Y-%m-%d))"
```

Do NOT push automatically — the user reviews and pushes when appropriate.

### 7. Report

Summarize in 5 lines max:
- GSC submitted count + screenshot of last confirmation
- Bing submitted count + screenshot of confirmation
- How many pending remain per priority bucket
- Any failures and their cause
- Next run time

## Failure modes to watch for

- **Browser session lost / CDP 403** — run `agent-browser close` then retry `--auto-connect`. If still failing, ask the user to restart Chrome.
- **Tab drift** — `agent-browser --auto-connect` sometimes attaches to the wrong tab. Always verify the current URL with `get url` before pasting into forms.
- **GSC quota silent hit** — manifests as the request-indexing dialog not appearing OR as "Quota exceeded" text. Stop and do not mark those URLs submitted.
- **Mass-translate proxy serving translated variant** — the submission should use the canonical translated URL exactly as listed in the queue. Don't let agent-browser auto-rewrite.
- **URL already indexed** — GSC shows "URL is on Google". Still valid to click Request Indexing; mark as submitted.

## Completion

Once the queue has no pending Bing rows and no pending GSC rows, the skill is done. Update `docs/indexing-queue.md` with a closing note at the top ("Drained YYYY-MM-DD") and stop scheduling. Indexing verification happens separately via GSC Coverage report.
