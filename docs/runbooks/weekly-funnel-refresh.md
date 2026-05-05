# Weekly Funnel Refresh Runbook

**Cadence:** Every Friday morning.
**Output:** Update [docs/FUNNEL-DASHBOARD.md](../FUNNEL-DASHBOARD.md) with last-7-day numbers; flag any experiments past their measure-after date.
**Scheduled task:** `deepbreathing-weekly-funnel-refresh` (recurring Fri 09:00 ET, see `mcp__scheduled-tasks__list_scheduled_tasks`).

The point of this runbook is reproducibility — same numbers pulled the same way each week. Without this, drift creeps in (different date ranges, wrong GA4 property, missing events) and trend lines lose meaning.

---

## Step 1 — GA4 events report

**GA4 property:** `Deep Breathing Exercises` in DKMT account, ID `527524722` (G-53DLCBMRL3).
**NOT:** the old Abiassi property `G-7GG9WVNBBP` — it's stale Q1 data only.

1. Open GA4: `https://analytics.google.com/analytics/web/#/p527524722/reports/intelligenthome` (Chrome MCP, you're logged in as `amorim.a.ferreira@gmail.com`).
2. If the account picker shows "AMORIM ABIASSI FERREIRA" or any Abiassi property, click the breadcrumb → "All accounts" → DKMT → Deep Breathing Exercises.
3. Navigate: search bar → "events report" → click `Reports > Life cycle > Engagement > Events`.
4. **Date range:** "Last 7 days" for weekly refresh. (Use 28 days for monthly comparisons against the May 5 baseline.)
5. **Add comparison** (top right) → check "Mobile traffic" + "Web traffic" (desktop) → Apply.
6. Capture **Total Users** column for these events:

| Event | Notes |
|---|---|
| `first_visit` | Top-of-funnel; new visitors only |
| `page_viewed_breathing` | Top of breathing-page funnel; deployed Apr 28-29 |
| `breathing_session_start` | Funnel start |
| `breathing_session_pause` | First engagement signal |
| `breathing_session_complete` | End-of-timer signal (only fires when duration set) |
| `breathing_session_stop` | Manual-stop signal (verify it's firing — was unclear May 5) |
| `mode_switch` | Engagement signal — explored techniques |
| `conversion_prompt_shown` | Bottom-of-funnel ask |
| `conversion_signup_completed` | Conversion |
| `signup_user_identified` | One-shot marker (deployed May 5; first appearance gates GA4 user_id setup) |

7. Compute funnel ratios per device (overall, mobile, desktop):
   - start → pause
   - start → complete
   - prompt_shown → signup_completed (the 24% conversion rate)
   - Mobile abandonment = (start - pause - complete) / start

---

## Step 2 — Neon DB sign-up cohort check

Use the `darkmatter-db` skill or fall back to `vercel env pull` from this repo.

```bash
# Preferred: dkmt-cc env (re-login if 403)
eval "$(dkmt-cc env pull deep-breathing --export 2>/dev/null)" && \
  psql "$POSTGRES_URL_NON_POOLING" -f docs/runbooks/sql/cohort-check.sql

# Fallback if dkmt-cc creds stale:
vercel env pull /tmp/dbenv.txt --environment=production && \
  eval "$(grep -E '^(POSTGRES_URL_NON_POOLING|POSTGRES_URL)' /tmp/dbenv.txt | sed 's|^|export |')" && \
  psql "$POSTGRES_URL_NON_POOLING" -f docs/runbooks/sql/cohort-check.sql && \
  rm -f /tmp/dbenv.txt
```

The query returns:
- Total users, last 28d signups, last 7d signups
- Returned-after-day-1 count
- Engaged-minutes distribution (any min, ≥30 min)
- Active-in-last-7d, active-in-last-14d
- Most recent signup details (email domain, device, IP)

**What to look for in the result:**
- New signups since last refresh — are they real Gmail or burner pattern?
- `sessions_completed > 0` for any user (was 0 for all on May 5; should change as the 35e7f0a fix takes effect)
- Did Eugene's `total_minutes` drop dramatically? (would confirm the double-count fix)

---

## Step 3 — GSC + Bing performance pull

For weekly trend, focus on the **active SEO experiments** (currently /breathe/coherent rewrite). Full audits are monthly, not weekly.

```bash
# GSC sync (re-auth via mcp__mass-translate-backend__start_gsc_oauth if expired)
# Replace dates with the last 7 days
mcp__mass-translate-backend__sync_gsc_performance \
  site_url=https://deepbreathingexercises.com/ \
  start_date=YYYY-MM-DD end_date=YYYY-MM-DD

# Then query for /breathe/coherent specifically:
mcp__mass-translate-backend__get_search_performance \
  page_url=https://deepbreathingexercises.com/breathe/coherent \
  start_date=YYYY-MM-DD end_date=YYYY-MM-DD
```

**For per-query data on a specific page:** `mcp__gsc__*` analytics endpoints return 403; use Chrome MCP to navigate GSC Performance UI directly with `?page=!URL` URL param. See `tools-and-data-sources.md` for the URL pattern.

---

## Step 4 — Update FUNNEL-DASHBOARD.md

Open [docs/FUNNEL-DASHBOARD.md](../FUNNEL-DASHBOARD.md) and:

1. Update the "Last refreshed" date.
2. Replace the "Top-line snapshot" table with new numbers.
3. Update the "Trends" section by appending a new column (don't replace prior columns — keep the trend line).
4. Update the "Sign-up cohort quality" section with the latest DB pull.
5. Move any experiment whose measure-after date passed from "Active experiments awaiting measurement" to "Recent results (graduated)" with the verdict.

---

## Step 5 — Check for experiments past their measure-after date

In [PRODUCT-EXPERIMENTS.md](../PRODUCT-EXPERIMENTS.md) and [SEO-EXPERIMENTS.md](../SEO-EXPERIMENTS.md):

1. List all entries with status `🔄 Implemented` and `measure-after` date in the past.
2. For each, pull the relevant metric and apply the **pre-committed success criteria** (no relitigating — if the criteria says "Success if X moves by ≥8pp" and it moved by 5pp, that's ❌ Failed, not ⚪ Inconclusive).
3. Update status, write the result section, mark the change in the dashboard.

---

## Step 6 — Note any anomalies

In the "Known measurement issues" section of FUNNEL-DASHBOARD.md, log:
- New events not previously seen
- Events that disappeared (might be a tracking regression)
- Sudden spikes/drops (>20%) — investigate if real or measurement
- Property migrations (rare but high-impact)

---

## Common gotchas (learned the hard way)

- **GA4 property migration noise:** the Apr 27 → May 5 jump from Abiassi (`G-7GG9WVNBBP`) → DKMT (`G-53DLCBMRL3`) created discontinuity. If you see another big jump, check `src/lib/analytics/google-analytics.ts` for the current measurement ID.
- **GA4 user_property indexing latency:** `signed_up=true` properties take 24-48h to surface in reports. Don't assume the GA4 user identification deploy failed if you check next day.
- **`mcp__gsc__search_analytics` returns 403** for this site — use `mcp__mass-translate-backend__get_search_performance` instead. The mcp__gsc tools work for `list_sites` only.
- **Cloudflare cache + Vercel cache** can serve stale 404s for 1-5 minutes after a redirect deploys. Use `?cb=$(date +%s%N)` cache-buster when verifying.
- **dkmt-cc creds expire ~30 days** — `dkmt-cc login` to refresh, or fall back to `vercel env pull` from any Vercel-linked repo.

---

## SQL queries used

The `docs/runbooks/sql/cohort-check.sql` file (also in this folder) contains the canonical sign-up cohort query. Run with `psql $POSTGRES_URL_NON_POOLING -f` to keep the analysis reproducible.
