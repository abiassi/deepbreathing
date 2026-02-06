# SEO Experiments Log

Track SEO changes with hypotheses, baselines, and results. Check this before making new SEO changes to avoid re-testing failed ideas.

## How to Use This File

1. **Before making SEO changes:** Check if similar experiments were already run
2. **When making changes:** Log them here with hypothesis and baseline metrics
3. **After 2-3 weeks:** Update with results from GSC data
4. **Status values:** `Waiting` → `Measured` → `Success`/`Failed`/`Inconclusive`

---

## Active Experiments

### 2026-01-06: CTR Title Rewrites (Batch 1)

**Hypothesis:** Benefit-first titles increase CTR vs attribution-first titles

**Baseline (Dec 1 - Jan 5):**
- Overall: 1,887 impressions / 4 clicks = 0.21% CTR
- Working pattern: 4-7-8 timer had 9.68% CTR (benefit-first title)

**Changes Made:**

| Page | Old Title | New Title |
|------|-----------|-----------|
| /breathe/physiological-sigh | "Huberman's Physiological Sigh: Instant Stress Relief (Stanford Study)" | "Calm Down in 30 Seconds: Physiological Sigh (Huberman/Stanford) \| Free" |
| /breathe/coherent | "Increase Your HRV by 50% with Coherent Breathing (5 Min/Day)" | "Coherent Breathing: Build Lasting Calm in 5 Min/Day (Free Timer)" |
| /coherent-breathing-app | "Coherent Breathing App (HRV Breathing) — Free, No Download" | "Coherent Breathing App: Train Stress Resilience in 5 Min (Free)" |
| /for/running | "Stop Side Stitches in 30 Seconds: Physiological Sigh for Runners" | "Stop Side Stitches in 30 Seconds + Recover 2x Faster (Free Timer)" |
| /box-breathing-app | "Box Breathing App (4-4-4-4 Timer) — Free, No Download" | "Box Breathing App: Navy SEAL Calm in 2 Minutes (Free Timer)" |
| Homepage | "Deep Breathing Exercises – Free Breathing Visualizer" | "Free Breathing Visualizer: Calm Anxiety in 60 Seconds" |

**Measured:** 2026-01-20

**Result:** ✅ **6x click growth** (4 → 24 clicks)

| Page | Baseline | After | Change |
|------|----------|-------|--------|
| /4-7-8-breathing-timer | 32 imp, 3 clicks, pos 11.9 | 403 imp, 9 clicks, pos 8.7 | **12x imp, 3x clicks, +3 pos** |
| /breathe/physiological-sigh | 767 imp, 0 clicks, pos 13.7 | 2173 imp, 3 clicks, pos 9.6 | **2.8x imp, first clicks, +4 pos** |
| /breathe/box | 89 imp, 0 clicks, pos 42.8 | 834 imp, 0 clicks, pos 8.9 | **9x imp, +34 positions** |
| /box-breathing-app | 22 imp, 0 clicks, pos 8.5 | 87 imp, 3 clicks, pos 10.4 | **4x imp, first clicks** |
| /breathe/coherent | 285 imp, 0 clicks, pos 9.0 | 567 imp, 3 clicks, pos 8.6 | **2x imp, first clicks** |
| /coherent-breathing-app | 89 imp, 0 clicks, pos 10.0 | 322 imp, 3 clicks, pos 7.6 | **3.6x imp, first clicks, +2 pos** |

**Status:** Success ✅

---

### 2026-01-06: Navy SEAL Content Expansion

**Hypothesis:** Adding substantive Navy SEAL content (not just title mentions) will help rank for Navy SEAL queries currently at positions 60-70

**Baseline:**
- "navy seal breathing" queries: position 60-70
- Box breathing page had Navy SEAL in title but minimal content

**Changes Made:**
- Added "Why Navy SEALs Use Box Breathing" section (~150 words)
- Added FAQ: "Why do Navy SEALs use box breathing?"
- Included Mark Divine attribution and BUD/S training context

**Measured:** 2026-01-27

**Result:** ❌ **Failed** - No position improvement

| Query | Impressions | Position |
|-------|-------------|----------|
| box breathing navy seals | 19 | 66.4 |
| navy seal breathing technique | 16 | 60.2 |
| navy seal box breathing | 7 | 67.7 |
| navy seal breathing | 3 | 67.3 |
| navy seal breathing techniques | 3 | 58.7 |

Positions remain at 60-70. Adding ~150 words wasn't enough to compete with high-authority sites (WebMD, Healthline, military blogs) that dominate these queries.

**Learning:** Content additions alone don't move the needle for competitive branded queries. Need either (a) significantly more comprehensive content, (b) backlinks from authoritative sources, or (c) pivot to less competitive long-tail variants.

**Status:** Failed

---

### 2026-01-06: FAQ H3 Headings for Featured Snippets

**Hypothesis:** H3 headings are better than `<details><summary>` accordions for featured snippet eligibility

**Baseline:** FAQs rendered as accordions, no featured snippets observed

**Changes Made:**
- Pattern pages: Changed FAQ rendering from `<summary>` to `<h3>`
- Use-case pages: Changed FAQ rendering from `<summary>` to `<h3>`
- FAQs now display as flat Q&A sections

**Measured:** 2026-01-27

**Result:** ❌ **Failed** - No featured snippets captured

GSC searchAppearance data shows zero featured snippet appearances for any page. The structural change from accordions to H3 headings did not trigger featured snippet eligibility.

**Learning:** Featured snippets require more than structural HTML changes. Google favors (a) direct question-answer format matching the query exactly, (b) concise 40-60 word answers, (c) pages already ranking in top 5. Our pages averaging position 8-10 may not be eligible yet.

**Status:** Failed

---

### 2026-01-06: Video Embeds for Rich Results

**Hypothesis:** Video embeds with VideoObject schema increase CTR via video thumbnails in SERPs

**Videos Added:**
| Page | Video | Authority |
|------|-------|-----------|
| /breathe/box | Mark Divine box breathing | Navy SEAL Commander |
| /breathe/4-7-8 | Dr. Andrew Weil demonstration | Harvard physician |
| /breathe/coherent | James Nestor "Perfect Breath" | Bestselling author |
| /breathe/physiological-sigh | Already had Huberman video | Stanford neuroscientist |

**Measured:** 2026-01-27

**Result:** ❌ **Failed** - No video rich results in SERPs

GSC searchAppearance data shows zero video thumbnail appearances. Embedded YouTube videos with VideoObject schema did not generate video rich results.

**Learning:** Video rich results typically go to YouTube directly or sites with self-hosted video. Embedding third-party YouTube videos doesn't transfer video rich result eligibility to the embedding page. Google shows the YouTube result instead.

**Status:** Failed

---

### 2026-01-09: Coherent Page Differentiation

**Hypothesis:** Differentiating titles between /breathe/coherent (guide intent) and /coherent-breathing-app (tool intent) reduces cannibalization and improves CTR

**Baseline (Dec 1 - Jan 5):**
- /breathe/coherent: 285 impressions, position 9.0, 0 clicks
- /coherent-breathing-app: 89 impressions, position 10.0, 0 clicks
- Both titles had similar "stress resilience" framing

**Changes Made:**
| Page | Old Title | New Title |
|------|-----------|-----------|
| /breathe/coherent | "Coherent Breathing: Build Lasting Calm in 5 Min/Day (Free Timer)" | "Coherent Breathing: The Science of 5 Breaths/Min (Free Trainer)" |
| /coherent-breathing-app | "Coherent Breathing App: Train Stress Resilience in 5 Min (Free)" | "Coherent Breathing App (Free) — No Download, Start Instantly" |

**Measured:** 2026-01-20

**Result:** ✅ **Both pages got first clicks ever**

| Page | Baseline | After | Change |
|------|----------|-------|--------|
| /breathe/coherent | 285 imp, 0 clicks, pos 9.0 | 567 imp, 3 clicks, pos 8.6 | **2x imp, first clicks** |
| /coherent-breathing-app | 89 imp, 0 clicks, pos 10.0 | 322 imp, 3 clicks, pos 7.6 | **3.6x imp, first clicks, +2 pos** |

Combined: 374 imp → 889 imp, 0 → 6 clicks

**Status:** Success ✅

---

### 2026-01-09: Physiological Sigh Intent-Targeted Sections

**Hypothesis:** Adding explicit sections for "panic attacks" and "anxiety" helps page rank for those queries and move from position ~13 to ≤10

**Baseline (Dec 1 - Jan 5):**
- Position 13.7, 767 impressions, 0 clicks
- Page had "Cyclic Sighing" section but no explicit panic/anxiety sections

**Changes Made:**
- Added "Physiological Sigh for Panic Attacks" section (~100 words)
- Added "Physiological Sigh for Anxiety" section (~100 words)

**Measured:** 2026-01-20

**Result:** ✅ **Position improved to top 10**

| Metric | Baseline | After | Change |
|--------|----------|-------|--------|
| Position | 13.7 | 9.6 | **+4.1 positions (now in top 10!)** |
| Impressions | 767 | 2173 | **2.8x** |
| Clicks | 0 | 3 | **First clicks** |

**Status:** Success ✅

---

### 2026-01-09: Remove "Loading..." SSR Text

**Hypothesis:** Removing "Loading breathing exercise..." from indexable text improves snippet quality. Google may be extracting this text for snippets since it appears early in SSR output before the H1/intro content.

**Pages Affected:** All visualizer-embedded pages
- `/breathe/*` (all 5 techniques)
- `/for/*` (all 14 use cases)
- `/box-breathing-app`
- `/4-7-8-breathing-timer`

**Changes Made:**
- Removed ALL text nodes from loading state (no text in DOM at all)
- Using CSS spinner with `role="status"` and `aria-label="Loading breathing exercise"` (attribute only)
- No `sr-only` text span - accessibility via aria-label attribute

**Measure After:** 2026-01-23 (2 weeks)

**Measured:** 2026-01-24

**Result:** ⚪ **Inconclusive** - No direct way to measure snippet quality improvement. Would need manual SERP inspection for "Loading..." text in snippets.

**Status:** Inconclusive

---

### 2026-01-09: "Free Online Timer" Title Format Test (Batch)

**Hypothesis:** Titles starting with "Free Online [X] Timer" match SERP winner patterns and compete better against app store results

**Changes Made:**

| Page | Old Title | New Title |
|------|-----------|-----------|
| /4-7-8-breathing-timer | "4-7-8 Breathing Timer: Fall Asleep in 2 Minutes (Free App)" | "Free Online 4-7-8 Breathing Timer — Fall Asleep in 2 Minutes" |
| /box-breathing-app | "Box Breathing App: Navy SEAL Calm in 2 Minutes (Free Timer)" | "Free Online Box Breathing Timer — Navy SEAL Calm (No Download)" |
| /breathe/physiological-sigh | "Calm Down in 30 Seconds: Physiological Sigh (Huberman/Stanford) \| Free" | "Physiological Sigh Timer (Free) — Calm Down in 30 Seconds" |

**Rationale:**
- SERP winner for "4-7-8 breathing timer" is MindfulDevMag with "FREE Online 4-7-8 Breathing Timer"
- "App" queries dominated by App Store/Google Play listings - pivot to "online/timer"
- Leading with "Free Online" matches high-CTR patterns

**Query Clusters to Monitor:**
- 4-7-8: `4-7-8 breathing timer`, `4 7 8 timer`, `online 4-7-8 timer`, `4-7-8 breathing app`
- Box: `box breathing online`, `box breathing timer`, `free box breathing`
- Physiological sigh: `physiological sigh timer`, `physiological sigh practice`

**Measure After:** 2026-01-23 (2 weeks)

**Measured:** 2026-01-24

**Result:** ⚪ **Inconclusive**

| Page | Baseline | After (Jan 10-22) | Change |
|------|----------|-------------------|--------|
| /4-7-8-breathing-timer | 403 imp, 9 clicks, pos 8.7 | 429 imp, 11 clicks, pos 9.6 | +6% imp, +22% clicks, -0.9 pos |
| /box-breathing-app | 87 imp, 3 clicks, pos 10.4 | 98 imp, 2 clicks, pos 12.2 | +13% imp, -33% clicks, -1.8 pos |

Query-level: `4-7-8 breathing timer online` performing well (8% CTR, pos 6.6), but box breathing app dropped due to Navy SEAL content expansion affecting /breathe/box page.

**Status:** Inconclusive (confounded by Navy SEAL experiment)

---

## GSC Baseline Snapshot (Dec 1, 2025 - Jan 7, 2026)

**Pulled:** 2026-01-10 via GSC API

### Top Pages by Impressions
| Page | Impressions | Clicks | CTR | Avg Position |
|------|-------------|--------|-----|--------------|
| /breathe/physiological-sigh | 998 | 0 | 0% | 13.2 |
| /breathe/coherent | 324 | 0 | 0% | 9.0 |
| /breathe/box | 163 | 0 | 0% | 29.2 |
| /coherent-breathing-app | 110 | 0 | 0% | 9.6 |
| /for/public-speaking | 70 | 0 | 0% | 49.6 |
| /for/sleep | 49 | 0 | 0% | 72.5 |
| /breathe/4-7-8 | 48 | 0 | 0% | 49.1 |
| / (homepage) | 45 | 1 | 2.2% | 4.2 |
| /4-7-8-breathing-timer | 44 | 3 | 6.8% | 12.0 |
| /for/huberman | 36 | 0 | 0% | 9.4 |

### Top Keywords
| Keyword | Impressions | Clicks | CTR | Position |
|---------|-------------|--------|-----|----------|
| physiological sigh | 43 | 0 | 0% | 69.7 |
| 4-7-8 breathing timer | 17 | 2 | 11.8% | 10.6 |
| box breathing navy seals | 13 | 0 | 0% | 69.8 |
| breathing exercises for public speaking | 12 | 0 | 0% | 71.3 |
| breathing techniques for public speaking | 11 | 0 | 0% | 74.0 |
| public speaking breathing exercises | 10 | 0 | 0% | 66.4 |
| navy seal box breathing | 8 | 0 | 0% | 70.8 |
| navy seal breathing technique | 8 | 0 | 0% | 62.5 |
| 4 7 8 breathing method sleep | 7 | 0 | 0% | 82.0 |
| cyclic sighing | 7 | 0 | 0% | 86.9 |

### Key Insights
- **Best performing:** `/4-7-8-breathing-timer` at 6.8% CTR (validates "Free Online Timer" title format)
- **Biggest opportunity:** Coherent pages at position 9 with 0% CTR - title/description problem
- **High volume, bad position:** "physiological sigh" at position 70 despite 998 page impressions from long-tail variants

---

### 2026-01-10: Synonym Capture for Physiological Sigh

**Hypothesis:** Adding "cyclical breathing" (200 vol, diff 13) and "sigh breathing technique" (30 vol, diff 8) as keywords and natural mentions will capture additional long-tail traffic.

**Baseline:**
- Page impressions: 998
- Position for main keyword: 13.2
- Already ranking for "cyclic sighing" variants

**Changes Made:**
- Added to keywords array: `cyclical breathing`, `cyclical breathing technique`, `sigh breathing technique`
- Added to synonyms array: `cyclical breathing`, `sigh breathing technique`
- Added natural mention in "Cyclic Sighing: The Clinical Term" section: "Some people search for 'cyclical breathing' or 'sigh breathing technique'—these refer to the same pattern."

**Measure After:** 2026-01-24 (2 weeks)

**Measured:** 2026-01-24

**Result:** ❌ **Failed** - Not capturing target synonyms

| Target Keyword | Impressions | Position |
|----------------|-------------|----------|
| "cyclical breathing" | 0 | - |
| "sigh breathing technique" | 1 | 34 |

The synonyms are not being indexed or ranked. May need more prominent placement or dedicated sections rather than just keyword array additions.

**Status:** Failed

---

## GSC Snapshot (Jan 6-27, 2026)

**Pulled:** 2026-01-27 via GSC API

### Top Pages by Impressions
| Page | Impressions | Clicks | CTR | Avg Position |
|------|-------------|--------|-----|--------------|
| /for/huberman | 3,722 | 0 | 0% | 8.9 |
| /breathe/physiological-sigh | 2,977 | 3 | 0.1% | 10.1 |
| /breathe/box | 971 | 0 | 0% | 11.3 |
| /breathe/coherent | 690 | 3 | 0.4% | 8.8 |
| /4-7-8-breathing-timer | 536 | 11 | 2.1% | 9.4 |
| /coherent-breathing-app | 506 | 4 | 0.8% | 7.5 |
| /for/running | 327 | 0 | 0% | 8.0 |
| /breathe/4-7-8 | 153 | 1 | 0.7% | 19.8 |
| /box-breathing-app | 152 | 3 | 2.0% | 11.9 |
| /5-minute-breathing-exercise | 122 | 0 | 0% | 12.1 |

### New Pages (Jan 20 Launch) - Early Indexing
| Page | Impressions | Position | Status |
|------|-------------|----------|--------|
| /breathe/pursed-lip | 81 | 66.6 | Indexing |
| /breathe/ujjayi | 56 | 43.3 | Indexing |
| /for/stress | 28 | **8.6** | ✅ Top 10 |
| /for/kids | 17 | **9.7** | ✅ Top 10 |
| /breathe/nadi-shodhana | 12 | **10.8** | Almost top 10 |
| /breathe/belly | 9 | 27.8 | Early |
| /for/pranayama | 8 | 13.5 | Promising |

### Key Changes from Jan 20
- **Total clicks:** 24 → 29 (+21%)
- **Physiological sigh:** Position 9.6 → 10.1 (slight regression)
- **Coherent app:** Position 7.6 → 7.5 (stable, best position)
- **New pages reaching top 10:** stress, kids (within 1 week!)

---

## GSC Snapshot (Jan 6-20, 2026)

**Pulled:** 2026-01-20 via GSC API

### Top Pages by Impressions
| Page | Impressions | Clicks | CTR | Avg Position |
|------|-------------|--------|-----|--------------|
| /for/huberman | 2722 | 0 | 0% | 8.4 |
| /breathe/physiological-sigh | 2173 | 3 | 0.14% | 9.6 |
| /breathe/box | 834 | 0 | 0% | 8.9 |
| /breathe/coherent | 567 | 3 | 0.53% | 8.6 |
| /4-7-8-breathing-timer | 403 | 9 | 2.2% | 8.7 |
| /coherent-breathing-app | 322 | 3 | 0.93% | 7.6 |
| /for/running | 134 | 0 | 0% | 7.2 |
| /breathe/4-7-8 | 123 | 1 | 0.8% | 14.9 |
| /5-minute-breathing-exercise | 99 | 0 | 0% | 8.9 |
| /box-breathing-app | 87 | 3 | 3.4% | 10.4 |

### Key Changes from Baseline
- **Total clicks:** 4 → 24 (6x growth)
- **Physiological sigh:** Position 13.7 → 9.6 ✅
- **Box breathing guide:** Position 42.8 → 8.9 ✅ (massive jump!)
- **Coherent pages:** 0 → 6 clicks combined ✅

### Anomaly: Huberman Page Spam
- `/for/huberman` has 2,722 impressions but 0 clicks
- All queries are quoted research strings like `"physiological sigh" "fastest" huberman`
- Likely bot traffic or academic research queries, not real search demand
- Action: Monitor but don't optimize for these queries

---

## Planned Experiments

### 2026-01-20: Pursed Lip Breathing Page (NEW)

**Hypothesis:** Low-competition keyword (difficulty 34) will rank quickly and capture respiratory health traffic

**Keyword Data (Ahrefs):**
- "pursed lip breathing": 6.7K volume, 34 difficulty
- Traffic potential: 1,800/month

**Target Audience:** Respiratory health, COPD patients, seniors, athletes (cardio recovery)

**Implementation:**
- Create `/breathe/pursed-lip` pattern page
- Add PURSED_LIP to engine patterns (inhale:nose, exhale:pursed lips, 1:2 ratio)
- Link from /for/high-blood-pressure, /breathe overview

**Measure After:** 2026-02-03 (2 weeks)

**Measured:** 2026-02-03  
**Result:** 205 impressions, 0 clicks, avg position 69.6 (early indexing; far from top 10)  
**Status:** Inconclusive

---

### 2026-01-20: Alternate Nostril Breathing Page (NEW)

**Hypothesis:** Very low competition (difficulty 28) will rank within 1-2 weeks; yoga/meditation crossover appeal

**Keyword Data (Ahrefs):**
- "alternate nostril breathing": 3.3K volume, 28 difficulty (VERY LOW)
- Traffic potential: 1,200/month

**Target Audience:** Yoga practitioners, meditation beginners, focus/energy seekers

**Implementation:**
- Create `/breathe/nadi-shodhana` pattern page
- Add NADI_SHODHANA to engine patterns (alternate nostril technique)
- Link from /for/focus, /for/meditation content

**Measure After:** 2026-02-03 (2 weeks)

**Measured:** 2026-02-03  
**Result:** 36 impressions, 2 clicks, avg position 10.6 (near top 10, early traction)  
**Status:** Inconclusive

**Tuning (2026-02-03):**
- Tightened exact-match intro wording and added a 45-word answer block for snippet eligibility
- Added a concise "Quick Steps" section near the top of the page

---

### 2026-01-20: Breathing for Stress Use-Case Page (NEW)

**Hypothesis:** "Stress" is broader than "anxiety" and captures different intent; will increase coverage for stress-related queries

**Keyword Data (Ahrefs):**
- "breathing exercises for stress": 1K volume, 78 difficulty
- Traffic potential: 800-1.2K/month

**Target Audience:** General stress relief seekers (work stress, daily tension, overwhelm)

**Implementation:**
- Create `/for/stress` use-case page
- Recommend physiological sigh (fastest) + box breathing (sustained calm)
- Differentiate from /for/anxiety (clinical) with everyday stress positioning

**Measure After:** 2026-02-03 (2 weeks)

**Measured:** 2026-02-03  
**Result:** 33 impressions, 0 clicks, avg position 8.3 (top 10 but low impressions)  
**Status:** Inconclusive

**Tuning (2026-02-03):**
- Updated exact-match intro wording and added a 40-60 word answer block for featured snippet eligibility

---

### 2026-01-20: SEO Technique Expansion - Ujjayi Breathing (NEW)

**Hypothesis:** Very low difficulty (7) keyword will rank quickly, complements existing Nadi Shodhana for yoga practitioners

**Keyword Data (Ahrefs):**
- "ujjayi breathing": 2,700 volume, difficulty 7 (VERY LOW)
- Secondary: "ocean breath", "victorious breath"
- Traffic potential: 1,200/month

**Target Audience:** Yoga practitioners, meditation enthusiasts, focus seekers

**Implementation:**
- Created `/breathe/ujjayi` pattern page
- Pattern: 4-0-6-0 (ocean breath timing)
- Color: Ocean blue (#0891b2)
- Content: Ocean sound technique, yoga connection, throat constriction how-to
- Featured: false (SEO page, not homepage picker)

**Measure After:** 2026-02-03 (2 weeks)

**Measured:** 2026-02-03  
**Result:** 119 impressions, 0 clicks, avg position 47.7 (early indexing; not competitive yet)  
**Status:** Inconclusive

---

### 2026-01-20: SEO Technique Expansion - Breathing for Kids (NEW)

**Hypothesis:** Underserved niche with very low difficulty (12) will capture parent/teacher traffic

**Keyword Data (Ahrefs):**
- "breathing exercises for kids": 1,800 volume, difficulty 12 (VERY LOW)
- Secondary: "calm down breathing for children", "kids breathing techniques"
- Traffic potential: 800/month

**Target Audience:** Parents, teachers, child therapists

**Implementation:**
- Created `/for/kids` use-case page
- Uses Box pattern with kid-friendly framing
- "Smell the flower, blow out the candle" metaphors
- Age-appropriate language for parents to relay

**Measure After:** 2026-02-03 (2 weeks)

**Measured:** 2026-02-03  
**Result:** 22 impressions, 0 clicks, avg position 21.3 (early indexing; needs time)  
**Status:** Inconclusive

---

### 2026-01-20: SEO Technique Expansion - Belly Breathing (NEW)

**Hypothesis:** Highest volume keyword (5.6K) with low difficulty (32) captures "beginner breathwork" traffic

**Keyword Data (Ahrefs):**
- "belly breathing": 5,600 volume, difficulty 32 (LOW)
- Secondary: "diaphragmatic breathing", "deep belly breathing"
- Traffic potential: 2,000/month

**Target Audience:** Beginners to breathwork, stress relief seekers, singers/speakers/athletes

**Implementation:**
- Created `/breathe/belly` pattern page
- Pattern: 4-0-6-0 (diaphragmatic foundation)
- Color: Warm amber (#f59e0b)
- Content: Foundation of all breathwork, how to feel diaphragm, beginner-friendly
- Featured: false (SEO page, not homepage picker)

**Measure After:** 2026-02-03 (2 weeks)

**Measured:** 2026-02-03  
**Result:** 15 impressions, 0 clicks, avg position 41.6 (early indexing; not competitive yet)  
**Status:** Inconclusive

---

### 2026-01-20: SEO Technique Expansion - Buteyko Breathing (NEW)

**Hypothesis:** Unique methodology differentiates from competitors, captures respiratory health audience

**Keyword Data (Ahrefs):**
- "buteyko breathing": 2,900 volume, difficulty 36 (LOW)
- Secondary: "buteyko method", "nasal breathing exercises"
- Traffic potential: 1,000/month

**Target Audience:** People with asthma/respiratory issues, nasal breathing advocates, performance athletes

**Implementation:**
- Created `/breathe/buteyko` pattern page
- Pattern: 3-0-3-3 (light breathing philosophy)
- Color: Sky blue (#38bdf8)
- Content: Light/nasal/quiet breathing, Control Pause concept, asthma research
- Medical disclaimer included
- Featured: false (SEO page, not homepage picker)

**Measure After:** 2026-02-03 (2 weeks)

**Measured:** 2026-02-03  
**Result:** No GSC data yet (likely not indexed or below reporting threshold)  
**Status:** Inconclusive

**Indexing update (2026-02-03):**
- GSC index inspection returned "URL unknown to Google"
- Added internal links from /breathe/box, /breathe/physiological-sigh, /coherent-breathing-app, /4-7-8-breathing-timer
- Next: request indexing in GSC UI and recheck in 7-10 days

---

### 2026-01-20: SEO Technique Expansion - Pranayama Hub (NEW)

**Hypothesis:** Hub page captures yoga/spiritual seekers and creates internal linking for related techniques

**Keyword Data (Ahrefs):**
- "pranayama": 3,000 volume, difficulty 30 (LOW)
- Secondary: "pranayama breathing", "yogic breathing"
- Traffic potential: 1,500/month

**Target Audience:** Yoga practitioners, spiritual seekers, Eastern practices explorers

**Implementation:**
- Created `/for/pranayama` hub page
- Links to Nadi Shodhana, Ujjayi techniques
- Content: Pranayama philosophy, history, different types overview
- Differentiates from Western breathwork framing

**Measure After:** 2026-02-03 (2 weeks)

**Measured:** 2026-02-03  
**Result:** 10 impressions, 0 clicks, avg position 12.4 (near top 10, early traction)  
**Status:** Inconclusive

**Tuning (2026-02-03):**
- Updated exact-match intro wording and added a concise answer block mentioning key pranayama techniques

---

## Key Learnings (Jan 2026)

### What Worked ✅
1. **Benefit-first titles** - 6x click growth from rewriting titles to lead with benefits
2. **Intent-targeted sections** - Adding explicit "for panic attacks" / "for anxiety" sections improved position by 4+ spots
3. **Page differentiation** - Distinct titles for guide vs app pages reduced cannibalization
4. **Low-difficulty keywords** - New pages (stress, kids, nadi-shodhana) reaching top 10 within 1 week

### What Failed ❌
1. **Content additions for competitive queries** - 150 words of Navy SEAL content didn't move position 60-70 queries
2. **FAQ structural changes** - H3 headings didn't trigger featured snippets (need top 5 position first)
3. **Embedded video schema** - YouTube embeds don't transfer video rich results to embedding page
4. **Synonym keyword stuffing** - Adding synonyms to keyword arrays without dedicated sections didn't capture traffic

### Strategic Insights
- **Featured snippets require top 5 first** - 99% come from page 1, position 1 has 30.9% chance ([Backlinko](https://backlinko.com/hub/seo/featured-snippets))
- **WebMD/Healthline lost 40%+ visibility** in Dec 2025 update - opportunity window ([PPC.land](https://ppc.land/health-sites-that-once-dominated-seo-just-got-crushed-by-google/))
- **Programmatic SEO works for wellness** - Insight Timer's meditation type pages drove app installs ([Search Engine Land](https://searchengineland.com/guide/programmatic-seo))
- **Target DR < 50 competitors** - If low-DR sites rank top 5, we can compete ([SEOProfy](https://seoprofy.com/blog/healthcare-seo/))
- **Interactive tools differentiate** - Our visualizer is unique vs WebMD's text-only content

---

### 2026-01-27: Push Top 10 Pages to Top 5 (Position Consolidation)

**Hypothesis:** Pages at position 7-10 can reach top 5 with title/content refinements, enabling featured snippet eligibility

**Target Pages (currently position 7-10):**
| Page | Current Position | Impressions |
|------|------------------|-------------|
| /coherent-breathing-app | 7.5 | 506 |
| /for/running | 8.0 | 327 |
| /breathe/coherent | 8.8 | 690 |
| /for/huberman | 8.9 | 3,722 |
| /4-7-8-breathing-timer | 9.4 | 536 |

**Implemented:** 2026-01-27

**Changes Made:**
1. Added "2026" to title tags for freshness signals:
   - `/coherent-breathing-app`: "Coherent Breathing App (Free, 2026) — No Download, Start Instantly"
   - `/4-7-8-breathing-timer`: "Free Online 4-7-8 Breathing Timer (2026) — Fall Asleep in 2 Minutes"
   - `/box-breathing-app`: "Free Online Box Breathing Timer (2026) — Navy SEAL Calm (No Download)"

2. Added "Updated January 2026" visible date to coherent-breathing-app header

3. Updated dateModified in schema for 4-7-8-breathing-timer to "2026-01-27"

4. Added comparison table to coherent-breathing-app (Coherent vs Box vs 4-7-8 vs Physiological Sigh)

5. 4-7-8-breathing-timer already had strong comparison table and internal linking

**Measure After:** 2026-02-10 (2 weeks)

**Status:** Implemented ✅

---

### 2026-02-03: Near-Top-10 Tuning Pass (Answer Blocks + Exact-Match Intros)

**Hypothesis:** Short answer blocks + exact-match intro lines will lift CTR and improve featured snippet eligibility for pages sitting 8–13.

**Changes Made:**
1. Added 40–60 word "Quick answer" blocks:
   - `/4-7-8-breathing-timer`
   - `/box-breathing-app`
   - `/2-minute-breathing-exercise`
2. Added concise answer blocks + intro refresh:
   - `/breathe/box` (voice search Q&A: “What is box breathing?”)
   - `/breathe/physiological-sigh` (voice search Q&A: “What is the physiological sigh?” + title refresh)
3. Running page tuning:
   - `/for/running` intro refreshed + answer block for “stop a side stitch while running”
4. Added targeted query-variant sections on mid‑pack technique pages:
   - `/breathe/pursed-lip` (“for COPD and shortness of breath”)
   - `/breathe/ujjayi` (“steps” quick guide)
   - `/breathe/belly` (“belly vs diaphragmatic breathing”)

**Measure After:** 2026-02-17 (2 weeks)

**Status:** Implemented ✅

---

### 2026-01-27: Programmatic Combination Pages (pSEO)

**Hypothesis:** Creating specific technique + context pages captures long-tail queries competitors ignore

**Pattern:** `[Technique] for [Specific Context]` pages

**Implemented:** 2026-01-27

**Files Created:**
- `src/app/4-7-8-breathing-for-insomnia/page.tsx`
- `src/app/box-breathing-before-presentation/page.tsx`
- `src/app/physiological-sigh-panic-attack/page.tsx`
- `src/app/breathing-exercises-before-surgery/page.tsx`
- `src/app/breathing-exercises-for-labor/page.tsx`

**Pages Created:**
| URL | Target Query | Timer Mode | Word Count |
|-----|--------------|------------|------------|
| /4-7-8-breathing-for-insomnia | "4-7-8 breathing insomnia" | Relax (4-7-8) | ~600 |
| /box-breathing-before-presentation | "breathing before presentation" | Box | ~550 |
| /physiological-sigh-panic-attack | "breathing technique panic attack" | Sigh | ~600 |
| /breathing-exercises-before-surgery | "breathing exercises before surgery" | Box | ~650 |
| /breathing-exercises-for-labor | "breathing exercises labor" | Relax (4-7-8) | ~700 |

**Each page includes:**
- Full-screen breathing visualizer with appropriate mode
- Unique intro paragraph (150+ words)
- Step-by-step protocol for the specific context
- FAQ section with FAQPage schema
- Internal links to main technique page and related guides
- BreadcrumbList and Article schema

**Measure After:** 2026-02-17 (3 weeks for indexing)

**Status:** Implemented ✅

---

### 2026-01-27: E-E-A-T Enhancement

**Hypothesis:** Adding author credentials and research citations improves rankings for health queries (YMYL content)

**Implemented:** 2026-01-27

**Changes Made:**
1. Created `/about/methodology` page explaining:
   - Research standards (peer-reviewed, established protocols, clinical guidelines)
   - Editorial process (4-step: research, creation, review, updates)
   - What we include (citations, safety info, dates, evidence levels)
   - What we don't do (medical advice, overstating claims)
   - Team information

2. Created `ContentCredentials` component (`src/components/seo/content-credentials.tsx`):
   - Reusable component for displaying last updated, author, reviewer
   - Links to methodology page
   - Compact and full variants

3. Updated `/about` page to link to methodology

4. Added Article schema to methodology page with Organization author

**Note:** The ContentCredentials component is available but not yet integrated into pattern/use-case pages. Next step would be adding it to the page templates.

**Measure After:** 2026-02-17 (3 weeks)

**Status:** Implemented ✅

---

### 2026-01-27: Voice Search / Conversational Query Optimization

**Hypothesis:** Question-format headings capture voice search and AI overview citations

**Target Queries:**
- "how do I calm down quickly"
- "what is the best breathing technique for anxiety"
- "how do Navy SEALs breathe"
- "does 4-7-8 breathing really work"
- "how to stop a panic attack"
- "breathing exercises for sleep"

**Implemented:** 2026-01-27

**Changes Made:**
1. Added `VoiceSearchQA` interface to data types (breathing-pages.ts, use-case-pages.ts)
2. Added voice search section to PatternPage component (src/app/breathe/pattern-page.tsx)
3. Added voice search section to UseCasePage component (src/app/for/use-case-page.tsx)
4. Added voiceSearch content to target pages:

| Page | Question H2 | Answer Length |
|------|-------------|---------------|
| /breathe/box | "How do Navy SEALs breathe?" | 52 words |
| /breathe/4-7-8 | "Does 4-7-8 breathing really work?" | 58 words |
| /breathe/physiological-sigh | "How do I calm down quickly?" | 54 words |
| /breathe/physiological-sigh | "How to stop a panic attack?" | 52 words |
| /for/anxiety | "What is the best breathing technique for anxiety?" | 55 words |
| /for/sleep | "What are the best breathing exercises for sleep?" | 55 words |

**Format:** Each voice search Q&A appears prominently near top of content as:
- H2 heading with exact-match question
- 40-60 word direct answer paragraph immediately following
- Styled in glow-card container for visual distinction

**Measure After:** 2026-02-10 (2 weeks)

**Status:** Implemented ✅

---

### 2026-01-27: Interactive Tool CTAs in Meta Descriptions

**Hypothesis:** Emphasizing "free interactive timer" in meta descriptions increases CTR vs text-only competitors

**Current Pattern:** Benefit-focused descriptions
**New Pattern:** "Free [technique] timer — [benefit]. Start your guided session now."

**Implemented:** 2026-01-27

**Files Modified:**
- `src/data/breathing-pages.ts` (10 descriptions)
- `src/app/4-7-8-breathing-timer/page.tsx`
- `src/app/box-breathing-app/page.tsx`
- `src/app/coherent-breathing-app/page.tsx`
- `src/app/breathing-app/page.tsx`

**New Meta Descriptions:**
| Page | New Description |
|------|-----------------|
| /breathe/box | "Free box breathing timer — stop anxiety in 60 seconds with the Navy SEAL 4-4-4-4 technique. No download. Start your guided session now." |
| /breathe/4-7-8 | "Free 4-7-8 breathing timer — fall asleep in 2 minutes with Dr. Weil's technique. No download. Start your guided session now." |
| /breathe/coherent | "Free coherent breathing timer — train HRV and stress resilience in 5 minutes. 5-6 breaths/min pace. Start your guided session now." |
| /breathe/physiological-sigh | "Free physiological sigh timer — calm down in 30 seconds with Stanford's double-inhale technique. Just 1-3 breaths. Start now." |
| /breathe/pursed-lip | "Free pursed lip breathing timer — ease shortness of breath in seconds. Respiratory therapist-approved 2:4 ratio. Start your guided session now." |
| /breathe/nadi-shodhana | "Free alternate nostril breathing timer — balance your nervous system in 5 minutes with Nadi Shodhana. Start your guided session now." |
| /breathe/ujjayi | "Free ujjayi breathing timer — master the yoga 'ocean breath' for deep focus and calm. Step-by-step guide. Start your guided session now." |
| /breathe/belly | "Free belly breathing timer — learn diaphragmatic breathing, the foundation of all breathwork. Reduce stress in minutes. Start your guided session now." |
| /breathe/buteyko | "Free Buteyko breathing timer — light nasal breathing for asthma and respiratory health. Control Pause guide included. Start your session now." |
| /4-7-8-breathing-timer | "Free 4-7-8 breathing timer — fall asleep in 2 minutes with Dr. Weil's technique. No download needed. Start your guided session now." |
| /box-breathing-app | "Free box breathing timer — Navy SEAL 4-4-4-4 technique for focus and calm. No download needed. Start your guided session now." |
| /coherent-breathing-app | "Free coherent breathing timer — train HRV with 5-6 breaths/min pacing. No download, no signup. Start your guided session now." |
| /breathing-app | "Free breathing app — box breathing, 4-7-8, coherent breathing, and physiological sigh timers. No download, no signup. Start your session now." |

**Measure After:** 2026-02-10 (2 weeks)

**Status:** Implemented ✅

---

### 2026-02-06: Huberman / Physiological Sigh Cannibalization Fix

**Hypothesis:** Radically differentiating `/for/huberman` (multi-protocol hub) from `/breathe/physiological-sigh` (single-technique deep-dive) will eliminate keyword cannibalization, increase CTR on both pages, and capture multi-technique Huberman queries the current page misses.

**Baseline (Jan 6-27, 2026):**
| Page | Impressions | Clicks | CTR | Avg Position |
|------|-------------|--------|-----|--------------|
| /for/huberman | 3,722 | 0 | 0% | 8.9 |
| /breathe/physiological-sigh | 2,977 | 3 | 0.1% | 10.1 |

**Problem:** Both pages target "physiological sigh" + Huberman — same technique, same video, overlapping keywords. The Huberman page's impressions are largely bot/academic queries, not real user demand.

**Changes Made:**
1. `/for/huberman` → Rewritten as multi-protocol hub covering 6 techniques (physiological sigh, box, coherent, cyclic hyperventilation, 4-7-8, nasal breathing). New title: "Huberman Breathing Protocols: 6 Techniques for Stress, Sleep & Focus (Free Timers)". Added 8 multi-protocol FAQs, voiceSearch, expanded keywords to ~19 Huberman-branded multi-technique terms.
2. `/breathe/physiological-sigh` → Reduced Huberman branding: removed "Huberman physiological sigh" and "Huberman Lab breathing" from keywords, removed "Huberman sigh" from synonyms, rewrote ogDescription to focus on Stanford, changed FAQ[0] from "Huberman physiological sigh" to "Stanford study" framing, replaced Huberman mentions in body with Stanford research attribution.

**Measure After:** 2026-02-20 (2 weeks)

**Status:** Implemented ✅

---

### 2026-02-06: Disavow Spam Backlinks + Fix /app/ Route

**Hypothesis:** Disavowing ~27 spam/scraper domains prevents any future negative SEO signal. Redirecting /app/ → /breathing-app captures referral traffic from ~10 backlinks (including runtothefinish.com DR 59).

**Baseline:**
- /app/ returns 404 (10 backlinks pointing to dead URL)
- ~27 spam domains in backlink profile (most nofollow, preventive hygiene)

**Changes Made:**
1. **Redirect:** Added permanent 301 redirect `/app/:path*` → `/breathing-app` in `next.config.js`
2. **Disavow file:** Created `docs/disavow.txt` with 27 domains in Google format:
   - 8 SEO spam / link farms (rankyour.website, primeseo.xyz, etc.)
   - 5 Chinese spam cluster (appeared Jan 2026)
   - 14 SEO tool / scraper sites (site-stats.org, aapks.com, etc.)
3. **Manual step required:** Upload `docs/disavow.txt` to [GSC Disavow Tool](https://search.google.com/search-console/disavow-links)

**Notable backlinks to /app/:**
- runtothefinish.com (DR 59, nofollow) — editorial link, anchor: "like this App"
- site-stats.org (DR 51, nofollow)
- yogavideo.us (DR 0, dofollow)

**Measure After:** 2026-02-20 (2 weeks)

**Status:** Implemented ✅

---

### 2026-02-06: Breathing Visualizer Landing Page (NEW)

**Hypothesis:** A dedicated `/breathing-visualizer` page targeting "breathing visualizer online" (beatable competition: xhalr.com, therapistaid.com, calm.com) will rank top 10 within 1 week, given the site's existing authority and proven pattern of new low-difficulty pages hitting top 10 quickly.

**Keyword Data:**
- "breathing visualizer online" — low competition, none of the top results combine education + interactive tool
- Secondary: "breathing visualizer", "online breathing visualizer", "free breathing visualizer"

**Cannibalization Prevention:**
- Homepage title uses "breathing visualizer" as a descriptor (brand entry point)
- New page leads with tool identity + differentiating features (tool-seeking intent)
- Different intent = different content angle

**Implementation:**
- Created `/breathing-visualizer` standalone landing page
- Full-screen Resonance hero with Box breathing default
- Voice search answer block: "What is a breathing visualizer?"
- 2×3 benefit grid (visual pacing, 10 techniques, adjustable speed, no download, any device, audio/haptic)
- 10-technique grid linking to all `/breathe/[slug]` pages
- 3-step HowTo section (Choose → Follow → Adjust)
- 6 FAQs targeting long-tail "breathing visualizer" queries
- Cross-links to `/box-breathing-app`, `/4-7-8-breathing-timer`, `/coherent-breathing-app`, `/breathing-app`
- JSON-LD: BreadcrumbList, SoftwareApplication, FAQPage, HowTo
- Added to sitemap (priority 0.9, weekly)
- Cross-linked from homepage footer (Info column) and `/breathing-app` page

**Measure After:** 2026-02-20 (2 weeks)

**Status:** Implemented ✅

---

### 2026-02-06: Tummo Breathing Page (NEW)

**Hypothesis:** A dedicated `/breathe/tummo` page targeting "tummo breathing" (500 vol, KD 5) will rank top 10 within 1-2 weeks. Tummo is a distinct technique from Wim Hof with low competition — most ranking pages are blog posts without interactive tools.

**Keyword Data:**
- "tummo breathing" — 500 volume, KD 5
- Secondary: "tummo meditation", "inner fire breathing", "g-tummo", "tummo vs wim hof"

**Cannibalization Prevention:**
- /breathe/wim-hof targets "wim hof breathing" (different keyword cluster)
- Tummo page explicitly differentiates from Wim Hof in body content and FAQ
- Different breathing pattern (2-0-1-0 vs 1.5-0-1.5-0)

**Implementation:**
- Created `/breathe/tummo` pattern page with Tummo mode (2-0-1-0, deep red #dc2626)
- Added ModeName.Tummo to engine + component types and patterns
- Full content: g-tummo history, Benson/Kozhevnikov research, tummo vs Wim Hof differentiation
- Hidden from mode picker (like Wim Hof — advanced technique, only visible on its own page)
- Strong safety disclaimer for advanced technique

**Measure After:** 2026-02-20 (2 weeks)

**Status:** Implemented ✅

---

### 2026-02-06: Breath of Fire Page (NEW)

**Hypothesis:** A dedicated `/breathe/breath-of-fire` page targeting "breath of fire" (200 vol, KD 4) will rank top 10 within 1-2 weeks. Yoga practitioners actively search for this — competition is mostly static blog content without interactive tools.

**Keyword Data:**
- "breath of fire" — 200 volume, KD 4
- Secondary: "kapalabhati breathing", "kundalini breathing", "breath of fire technique", "yoga breath of fire"

**Cannibalization Prevention:**
- No existing pages target Kapalabhati/Kundalini breathing keywords
- Distinct from Wim Hof (different tradition, different pattern) and tummo (different speed/intensity)

**Implementation:**
- Created `/breathe/breath-of-fire` pattern page with BreathOfFire mode (0.75-0-0.75-0, hot orange #ea580c)
- Added ModeName.BreathOfFire to engine + component types and patterns
- Full content: Kapalabhati/Kundalini tradition, rapid rhythmic technique, yoga physiology research
- Hidden from mode picker (rapid technique, only visible on its own page)
- Strong safety disclaimer (pregnancy, high BP, seizure disorders)

**Measure After:** 2026-02-20 (2 weeks)

**Status:** Implemented ✅

---

### 2026-02-06: Breathing Exercises for Singing Page (NEW)

**Hypothesis:** A dedicated `/for/singing` page targeting "breathing exercises for singing" (550 vol, KD 1-2) will rank top 10 within 1 week. Extremely low KD with clear informational intent — singers searching for practical breathing exercises.

**Keyword Data:**
- "breathing exercises for singing" — 550 volume, KD 1-2
- Secondary: "breath support for singers", "diaphragmatic breathing singing", "vocal breathing technique", "singing breath control"

**Cannibalization Prevention:**
- No existing pages target singing-related keywords
- Uses Belly Breathing mode (same as /for/athletes uses its own mode) — different audience, different angle

**Implementation:**
- Created `/for/singing` use-case page with Belly Breathing mode
- Content angle: diaphragmatic breath support for vocal technique (appoggio)
- Science sections on subglottic pressure, vocal fold function, parasympathetic activation
- Cross-linked: public-speaking, athletes, focus use cases + belly breathing technique page
- Disclaimer directing to speech-language pathologist for voice disorders

**Measure After:** 2026-02-20 (2 weeks)

**Status:** Implemented ✅

---

### 2026-02-06: Lung Capacity Exercises Page (NEW)

**Hypothesis:** A dedicated `/for/lung-capacity` page targeting "lung capacity exercises" (2,800 vol, KD 5) will rank top 10 within 1-2 weeks. Highest volume opportunity in this batch — competition is mostly generic health articles without interactive tools.

**Keyword Data:**
- "lung capacity exercises" — 2,800 volume, KD 5
- Secondary: "increase lung capacity", "breathing exercises for lung capacity", "lung expansion exercises", "how to increase lung capacity"

**Cannibalization Prevention:**
- No existing pages target lung capacity keywords
- /breathe/pursed-lip targets "pursed lip breathing" (different cluster) — lung capacity page references pursed-lip as complementary
- /for/athletes targets athletic performance, not respiratory health

**Implementation:**
- Created `/for/lung-capacity` use-case page with Belly Breathing mode
- Content angle: rebuilding functional lung capacity through diaphragmatic strengthening
- Science sections on tidal volume, inspiratory muscle training, gas exchange, residual volume
- Progressive program: assess baseline → belly breathing → progressive loading → pursed-lip → walking
- Cross-linked: athletes, running, singing use cases + belly breathing technique page
- Medical disclaimer for respiratory conditions

**Measure After:** 2026-02-20 (2 weeks)

**Status:** Implemented ✅

---

## Completed Experiments

(Move experiments here after measuring results)

---

## Failed/Abandoned Ideas

(Document what didn't work to avoid re-testing)
