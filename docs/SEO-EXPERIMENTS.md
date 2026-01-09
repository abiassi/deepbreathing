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

**Baseline (from ~28 days pre-change):**
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

**Measure After:** 2026-01-20 (2 weeks)

**Result:** TBD

**Status:** Waiting

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

**Measure After:** 2026-01-27 (3 weeks - position changes take longer)

**Result:** TBD

**Status:** Waiting

---

### 2026-01-06: FAQ H3 Headings for Featured Snippets

**Hypothesis:** H3 headings are better than `<details><summary>` accordions for featured snippet eligibility

**Baseline:** FAQs rendered as accordions, no featured snippets observed

**Changes Made:**
- Pattern pages: Changed FAQ rendering from `<summary>` to `<h3>`
- Use-case pages: Changed FAQ rendering from `<summary>` to `<h3>`
- FAQs now display as flat Q&A sections

**Measure After:** 2026-01-27 (featured snippets take 3+ weeks)

**Result:** TBD

**Status:** Waiting

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

**Measure After:** 2026-01-27

**Result:** TBD

**Status:** Waiting

---

### 2026-01-09: Coherent Page Differentiation

**Hypothesis:** Differentiating titles between /breathe/coherent (guide intent) and /coherent-breathing-app (tool intent) reduces cannibalization and improves CTR

**Baseline:**
- /breathe/coherent: 318 impressions, position 9.03, 0 clicks
- /coherent-breathing-app: 110 impressions, position 9.64, 0 clicks
- Both titles had similar "stress resilience" framing

**Changes Made:**
| Page | Old Title | New Title |
|------|-----------|-----------|
| /breathe/coherent | "Coherent Breathing: Build Lasting Calm in 5 Min/Day (Free Timer)" | "Coherent Breathing: The Science of 5 Breaths/Min (Free Trainer)" |
| /coherent-breathing-app | "Coherent Breathing App: Train Stress Resilience in 5 Min (Free)" | "Coherent Breathing App (Free) — No Download, Start Instantly" |

**Measure After:** 2026-01-23 (2 weeks)

**Result:** TBD

**Status:** Waiting

---

### 2026-01-09: Physiological Sigh Intent-Targeted Sections

**Hypothesis:** Adding explicit sections for "panic attacks" and "anxiety" helps page rank for those queries and move from position ~13 to ≤10

**Baseline:**
- Position ~13, 989 impressions, 0 clicks
- Page had "Cyclic Sighing" section but no explicit panic/anxiety sections

**Changes Made:**
- Added "Physiological Sigh for Panic Attacks" section (~100 words)
- Added "Physiological Sigh for Anxiety" section (~100 words)

**Measure After:** 2026-01-30 (3 weeks - content changes take longer to index)

**Result:** TBD

**Status:** Waiting

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

**Result:** TBD

**Status:** Waiting

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

**Result:** TBD

**Status:** Waiting

---

## Planned Experiments

(Add planned experiments here before implementation)

---

## Completed Experiments

(Move experiments here after measuring results)

---

## Failed/Abandoned Ideas

(Document what didn't work to avoid re-testing)
