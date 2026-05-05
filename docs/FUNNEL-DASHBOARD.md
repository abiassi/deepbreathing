# Funnel Dashboard

**Last refreshed:** 2026-05-05
**Refresh cadence:** Weekly (Friday). Runbook: [docs/runbooks/weekly-funnel-refresh.md](runbooks/weekly-funnel-refresh.md)
**Source of truth:** GA4 property `Deep Breathing Exercises` in DKMT account, ID `527524722`, measurement ID `G-53DLCBMRL3`. ⚠️ NOT the old Abiassi property `G-7GG9WVNBBP` (which has stale 2026-Q1 data only).

---

## Top-line snapshot — last 28 days (Apr 7 – May 4, 2026)

### Engagement funnel (unique users)

| Step | Users | % of start | Mobile | Desktop |
|------|---:|---:|---:|---:|
| `first_visit` | 780 | — | 293 | 475 |
| `page_viewed_breathing` | 232* | — | 80 | 147 |
| `breathing_session_start` | **361** | 100% | 140 | 217 |
| `breathing_session_pause` | 150 | 41.6% | 36 | 110 |
| `breathing_session_complete` | 22 | 6.1% | 8 | 14 |
| `mode_switch` | 19 | 5.3% | 8 | 11 |
| `conversion_prompt_shown` | 51 | 14.1% | 22 | 27 |
| `conversion_signup_completed` | 12 | 3.3% of starts / **23.5% of prompt-shown** | 8 | 4 |

*`page_viewed_breathing` deployed Apr 28-29; only ~6 days of data inside this 28d window. Will normalize next refresh.

### Funnel ratios

| | Overall | Mobile | Desktop |
|---|---:|---:|---:|
| start → pause | 41.6% | **25.7%** | 50.7% |
| start → complete | 6.1% | 5.7% | 6.5% |
| Abandonment (no pause, no complete) | — | **74.3%** | 49.3% |

**Mobile vs desktop gap:** Mobile users abandon at 74.3% (vs 49.3% desktop). This is the primary leverage point. The May 5 tap-to-pause hint is the active intervention.

### Sign-up cohort quality (Neon DB, all-time)

| Metric | Count | % |
|---|---:|---:|
| Total users | 17 | — |
| Failed signups (no session row, likely test accounts) | 2 | — |
| **Successful signups** | **15** | 100% |
| Returned after day 1 | 10 | **67%** |
| Logged any minutes | 4 | 27% |
| Logged 30+ minutes | 3 | 20% |
| Active in last 14 days | 7 | 47% |

Top 3 engaged users: eugene (168 min), megan (40 min), matt (37 min). Eugene's 168 may be inflated by the double-counting bug fixed in [35e7f0a](https://github.com/abiassi/deepbreathing/commit/35e7f0a) — re-pull DB on next refresh to verify.

---

## Search engine traffic — last 28 days (Apr 7 – May 4, 2026)

Both engines tracked together because Bing + DuckDuckGo + Yahoo combined ≈ 6× Google traffic for this site (per memory; recheck quarterly). Don't optimize for Google in isolation.

### Bing Webmaster Tools

| Metric | Value |
|---|---:|
| Clicks | 126 |
| Impressions | 4,590 |
| CTR | 2.7% |
| Avg position | 5.3 |

**Top 5 Bing pages by clicks:**

| Page | Clicks | Imp | CTR | Pos |
|---|---:|---:|---:|---:|
| /breathing-visualizer | 37 | 1,527 | 2.4% | 5.5 |
| /breathe/4-7-8 | 15 | 845 | 1.8% | 5.0 |
| /for/high-blood-pressure | 14 | 462 | 3.0% | 5.8 |
| /breathe/box | 11 | 410 | 2.7% | 4.3 |
| /for/huberman | 7 | 122 | 5.7% | 4.3 |

**Notable Bing observations:**
- `/4-7-8-breathing-timer` has 21.2% CTR (7 clicks / 33 imp at pos 3.5) — small volume but ranks well.
- `/fr/breathing-visualizer` has 50% CTR (6/12 at pos 3.2) — only translated page in Bing top 20; French content has unrealized headroom.
- `/breathe/wim-hof` has 232 imp / 1 click (0.4% CTR at pos 4) — head-term impressions but no click-through; investigate title/snippet.

### Google Search Console

Refresh on next pull from `mcp__mass-translate-backend__get_search_performance`. See [docs/seo-audit-2026-05-05.md](seo-audit-2026-05-05.md) for the May 5 GSC snapshot. Per memory: ~445 March clicks, 111K March impressions, avg position 11.5 — Bing converts at higher position (5.3) but lower volume.

### Cross-engine comparisons to watch

- **Translated-page indexing**: Bing has near-zero translated pages indexed (per memory + this snapshot). GSC gets ~10% impressions from translated. If we close that gap, Bing has more upside than Google because Bing indexes faster on signal.
- **CTR by engine**: Bing CTR 2.7% vs Google CTR ~0.5% (May 5 audit) — Bing positions are better and SERP layout has fewer click-killers (no Top Stories carousel, fewer YouTube embeds).

---

## Trends since 2026-04-27 baseline

| Metric | Apr 27 (30d) | May 5 (28d) | Δ |
|---|---:|---:|---|
| `breathing_session_start` | 338 | 361 | +6.8% |
| `breathing_session_pause` | 129 | 150 | +16.3% |
| `breathing_session_complete` | 13 | 22 | +69.2% |
| start → pause | 38% | 41.6% | +3.6 pp |
| start → complete | 3.8% | 6.1% | +2.3 pp |
| mobile abandonment | 76% | 74.3% | -1.7 pp |
| desktop abandonment | 53% | 49.3% | -3.7 pp |
| signup completions | 0 | 12 | +12 (auth flow now functional) |

⚠️ Apr 27 baseline was on the old Abiassi GA4 property (`G-7GG9WVNBBP`), May 5 on DKMT (`G-53DLCBMRL3`). Cross-property comparisons are noisy but directionally OK at this granularity.

---

## Active experiments awaiting measurement

| Date shipped | Experiment | Measure-after | Pre-committed criteria summary |
|---|---|---|---|
| 2026-05-05 | [Engaged-minutes tracking fix](PRODUCT-EXPERIMENTS.md#2026-05-05-engaged-minutes-tracking--fix-double-counting--stop-event-sync) | 2026-05-19 read, 2026-06-02 verdict | total_min per user 30-60% lower (de-duplicated); sessions_completed > 0 when min > 0 |
| 2026-05-05 | [GA4 user identification](PRODUCT-EXPERIMENTS.md#2026-05-05-ga4-user-identification-user_id--signed_up-property) | 2026-05-19 | `signed_up=true` user_property visible in GA4; `signup_user_identified` events match login count |
| 2026-05-05 | [Tap-to-pause hint](PRODUCT-EXPERIMENTS.md#2026-05-05-tap-to-pause-hint-inside-orb) | 2026-05-19 | Mobile abandonment ≤66% (-8 pp); ~+12 mobile pauses per 28d |
| 2026-05-05 | [Coherent page title rewrite](SEO-EXPERIMENTS.md#2026-05-05-coherent-page-title-rewrite--timer-intent-match) | 2026-05-19 | Top-3 timer-intent queries lift CTR from 0% to 1-3% |
| 2026-05-05 | [Fix 5 GSC 404s](SEO-EXPERIMENTS.md#2026-05-05-fix-5-gsc-404s--double-locale--sub-path-redirects) | 2026-05-19 | GSC "Not found (404)" count drops from 5 → 0 |

---

## Recent results (graduated)

| Experiment | Status | Key finding |
|---|---|---|
| [Duration chips below orb](PRODUCT-EXPERIMENTS.md#2026-04-27-duration-chips-below-orb) | ✅ Success (measurable metric only) | Visible completion 3.8% → 6.1%; mostly measurement effect, not behavior change |
| [Mobile hero above fold](PRODUCT-EXPERIMENTS.md#2026-04-27-mobile-hero-above-the-fold) | 🟡 Mixed | Mobile abandonment moved -1.7pp, desktop moved more (-3.7pp) — co-shipped with chips |
| [page_viewed_breathing event](PRODUCT-EXPERIMENTS.md#2026-04-27-page_viewed_breathing-event--sessions_completed-sync-fix) | ✅ Event ships, ❌ sessions_completed sync fix superseded | Top-of-funnel signal now exists; sessions_completed still broken until 35e7f0a |

---

## Known measurement issues

- **`sessions_completed = 0` for everyone in the DB**, including users with hundreds of minutes (Eugene). The 2026-05-05 [35e7f0a](https://github.com/abiassi/deepbreathing/commit/35e7f0a) commit should fix going forward; existing users won't be backfilled. Re-check on 2026-05-19.
- **Total-minutes possibly double-counted** for users from before [35e7f0a](https://github.com/abiassi/deepbreathing/commit/35e7f0a). Eugene's 168 min could be ~84. New users from May 5 onward will be reliable.
- **Apr 27 ↔ May 5 cross-property comparison** has GA4 indexing noise. Trends are directionally OK; absolute numbers shouldn't be compared with full confidence across the property migration.
- **No `breathing_session_stop` event count** in the May 5 events report — UX-BACKLOG mentions it should fire when users stop early without timer. Worth grep'ing the codebase to confirm it's wired up.

---

## What this dashboard is FOR (and isn't)

**For:** Knowing the current state of the funnel at a glance. Linking experiments to the metrics they're supposed to move. Catching regressions between weekly refreshes.

**Not for:** One-off investigations (use a date-stamped doc like `ctr-investigation-2026-05-05.md`). Per-page deep dives. Long-form analysis of *why* something is happening.

**When to update:**
- Weekly (Friday) automated refresh — see [runbook](runbooks/weekly-funnel-refresh.md)
- Immediately after a measurement-date verdict in PRODUCT-EXPERIMENTS or SEO-EXPERIMENTS
- Whenever the GA4 property / measurement ID changes (DON'T leave the old one in place)
