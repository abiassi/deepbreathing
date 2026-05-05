# CTR investigation — 4 high-impression pages

**Date**: 2026-05-05
**Scope**: Diagnose why these four pages, despite high impressions and pos 5–10, bleed clicks. Decide per page: title-rewrite candidate / ranking problem / SERP-feature problem / cannibalization.
**Method**: 90-day GSC query data (pulled via Search Console UI, page filtered, queries dimension) + SerpApi SERP capture for the top query per page (US, desktop).

---

## Executive summary

| Page | 90d imp | 90d clicks | 90d CTR | 90d pos | Top query (imp) | Verdict |
|---|---:|---:|---:|---:|---|---|
| /breathe/physiological-sigh | 8.25K | 5 | 0.06% | 10.1 | "physiological sigh" (265) | **SERP-feature problem** — Top Stories carousel + PAA + YouTube + Huberman/Stanford/NIH dominate. Title rewrite won't help. |
| /breathe/coherent | ~3K* | low | low | ~7 | "coherent breathing breaths per minute" (84) | **Title-rewrite candidate** — we rank pos 5 but title leads with "The Science of"; users want a timer. Reframe tool-page-style. |
| /breathe/box | ~5K* | ~9 | low | ~8 | "mark divine box breathing" (100) | **Performing as expected for SERP** — pos 3 with 3% CTR for the head Navy-SEAL query, behind 2 YouTube videos of Mark Divine himself. Page-level CTR is dragged down by long-tail impressions where we rank pos 20+. **Not** a rewrite candidate. |
| /for/athletes | ~3K* | low | low | ~6 | "physiological sigh lowers heart rate" (10) | **Ranking/authority problem** — pos 9 surrounded by NIH, Stanford, Huberman, Oura. Title is fine ("Faster Athletic Recovery: Physiological Sigh Between Sets"). Skip rewrite. |

*Approximate — page-level totals captured at filter-application time, exact match.

**Net action**: Rewrite **only** /breathe/coherent. The other 3 pages either face SERP features that titles can't fix or are already performing per-position.

---

## /breathe/physiological-sigh — SERP-feature problem

**Top queries** (90d, 0 clicks unless noted):

| Query | Impressions |
|---|---:|
| physiological sigh | 265 |
| cyclic sighing | 35 |
| physiological sighing | 17 |
| "cyclic sighing" "double inhale" balban | 16 |
| physiological sighs | 14 |
| physiological sigh breathing | 11 |
| quick sigh | 9 |
| "physiological sigh" cortisol | 7 |
| sigh breathing | 6 |
| physiological sigh breathing vagus nerve | 5 |

**Top 10 visible** = 385 impressions / 8.25K page total = **4.7%**. The other 95% is anonymized long-tail. There is **no concentrated head term** to optimize for — this is a long-tail discovery page.

**SERP for "physiological sigh"** (top query, 265 imp, pos ~10):
- **Top Stories carousel** with 14 entries, mostly YouTube + Huberman/Oura/Stanford content
- **2 PAA cards** (Stanford Medicine, Physiopedia)
- Pos 1 — YouTube video
- Pos 2 — psychsolutions.ca (Huberman recap)
- Pos 3 — Oura Ring blog
- Pos 4 — YouTube (Huberman)
- Pos 5 — PMC research paper
- Pos 6 — Trauma Research UK
- Pos 7 — Huberman Lab newsletter
- Pos 8–9 — Facebook + Cell Reports
- We are not in top 10 organic.

**Diagnosis**: The SERP is owned by (a) Huberman ecosystem content, (b) authority/research sites (PMC, Cell, Stanford, NIH), (c) YouTube/video dominance via Top Stories carousel. Title rewrite cannot move this. The realistic path is content angle differentiation (e.g. a "vs cyclic sighing" comparison, or a cortisol-specific deep dive based on the long-tail queries we're already attracting) — but that is a content-strategy decision, not a title fix.

**Verdict**: **SERP-FEATURE problem. Skip rewrite.**

---

## /breathe/coherent — Title-rewrite candidate (intent mismatch)

**Top queries** (90d, 0 clicks):

| Query | Impressions |
|---|---:|
| coherent breathing breaths per minute | 84 |
| coherent breathing 5-6 breaths per minute | 32 |
| coherent breathing 5 seconds inhale 5 seconds exhale heart rate variability | 30 |
| coherent breathing 5 seconds inhale 5 seconds exhale | 28 |
| coherent breathing | 27 |
| coherent breathing 5 seconds in 5 seconds out heart rate variability | 25 |
| coherent breathing 5-6 seconds inhale exhale | 24 |
| coherent breathing 5 seconds inhale 5 seconds exhale 6 breaths per minute | 19 |
| 5 breaths per minute vs 6 breaths per minute breathing coherence | 14 |
| coherent breathing 5-6 breaths per minute hrv | 13 |

Pattern: every top query is a **timing/configuration refinement** ("X breaths per minute", "5 seconds in 5 seconds out", "for HRV"). The user already knows what coherent breathing is; they want a tool / timer at a specific cadence.

**SERP for "coherent breathing breaths per minute"** (top query, 84 imp):
- **Answer Box** at top: SIU School of Medicine ("5–6 breaths per minute")
- Pos 1, 2 — YouTube **timer videos** ("Coherent Breathing Timer - 6 Breaths Per Minute | With Bells")
- Pos 3 — pubmed
- Pos 4 — makevisible.com (Visible app — direct competitor)
- **Pos 5 — us** (deepbreathingexercises.com/breathe/coherent)
- Pos 6 — YouTube (timer)
- Pos 7 — breathball.com (HRV tool)
- Pos 8–9 — niche content sites
- 2 PAA cards

**Current title**: `Coherent Breathing: The Science of 5 Breaths/Min (Free Trainer)`
**Current description**: `Free coherent breathing timer — train HRV and stress resilience in 5 minutes. 5-6 breaths/min pace. Start your guided session now.`

The description nails the angle. The **title leads with "The Science of"** — an academic frame for users searching with timer/configuration intent. With YouTube timer videos at pos 1/2 and an Answer Box above, our title needs to win the click on tool-utility, not academic credibility.

**Proposed title** (apply Jan 2026 winning pattern → "Free Online [X] Timer" structure for tool pages):

> `Coherent Breathing Timer: 5-6 Breaths Per Minute for HRV (Free)`

- Leads with "Coherent Breathing Timer" — exact-prefix match for the top query "coherent breathing breaths per minute"
- "5-6 Breaths Per Minute" — exact phrase users type, also covers second-most-frequent "coherent breathing 5-6 breaths per minute"
- "for HRV" — covers the heart-rate-variability variants in the long tail
- "(Free)" — tool signal

Description stays as-is (already strong).

**Verdict**: **TITLE-REWRITE candidate. Proceed with P1.5.**

---

## /breathe/box — Performing as expected for current SERP

**Top queries** (90d):

| Query | Imp | Clicks | CTR |
|---|---:|---:|---:|
| mark divine box breathing | 100 | **3** | **3%** |
| mark divine box breathing navy seal | 44 | 0 | 0% |
| box breathing navy seals mark divine | 37 | 0 | 0% |
| box breathing navy seals | 35 | 0 | 0% |
| mark divine breathing exercise navy seal | 30 | 0 | 0% |
| box breathing mark divine | 28 | 0 | 0% |
| "fincham et al. 2023 meta-analysis breathwork" | 22 | 0 | 0% |
| navy seals box breathing | 14 | 0 | 0% |
| navy seal box breathing | 13 | 0 | 0% |

Pattern: Mark Divine / Navy SEAL angle dominates the queries we rank for. Top 10 = 335 imp / 5.1K total = 6.5% (long tail again accounts for the rest).

**SERP for "mark divine box breathing"** (top query, 100 imp, **pos 3 with 3% CTR**):
- Pos 1, 2 — YouTube videos *of Mark Divine himself* (un-beatable for branded query)
- **Pos 3 — us** (deepbreathingexercises.com/breathe/box) — `Box Breathing: Navy SEAL Technique to Stop Anxiety Fast (Free Tool)`
- Pos 4 — Psychology Today
- Pos 5 — TIME magazine
- Pos 6 — Shortform.com
- Pos 7 — Medical News Today
- 2 PAA cards

Position 3 below 2 Mark-Divine YT videos with 3% CTR is **roughly the SERP-position expected baseline**. The page-level 0.18% CTR is misleading because it spreads across 4.8K long-tail impressions where we presumably rank pos 20+ (no clicks expected at those positions either).

The current title already follows the Jan 2026 winning pattern: benefit-first ("Stop Anxiety Fast"), descriptor + tool ("Free Tool"), authority anchor ("Navy SEAL Technique"). No improvement obvious.

**Verdict**: **Not a title-rewrite candidate. Page is performing at SERP-position expectation; long-tail impression dilution is causing the misleading page-level CTR.**

---

## /for/athletes — Ranking/authority problem

**Top queries** (90d, 0 clicks):

| Query | Impressions |
|---|---:|
| physiological sigh lowers heart rate | 10 |
| physiological sigh lower heart rate running | 8 |
| andrew huberman physiological sighs between sets workout | 7 |
| andrew huberman physiological sighs between sets | 5 |
| physiological sigh to lower heart rate while running | 4 |
| physiological sigh heart rate drop bpm | 4 |
| yes | 4 |
| physiological sigh heart rate | 3 |
| andrew huberman physiological sigh between sets | 2 |
| andrew huberman physiological sigh between sets workout | 2 |

Top 10 = 49 imp / ~3K page total = ~1.6%. Even more long-tail-dominant than the others.

**SERP for "physiological sigh lowers heart rate"** (top query, 10 imp):
- Pos 1 — PMC/NIH research paper
- Pos 2 — Cardiology Advisor
- Pos 3 — Instagram reel (Huberman)
- Pos 4 — Oura Ring
- Pos 5 — LinkedIn (Huberman post)
- Pos 6 — Stanford Medicine
- Pos 7 — YouTube (Huberman)
- Pos 8 — stress.org
- **Pos 9 — us** (deepbreathingexercises.com/for/athletes) — `Faster Athletic Recovery: Physiological Sigh Between Sets`
- Pos 10 — theproactiveathlete.ca
- 2 PAA cards

Current title is **already benefit-first and outcome-specific** ("Faster Athletic Recovery"). At pos 9 below NIH + Stanford + 3 Huberman properties, expected CTR is well under 1% — what we observe is consistent with that ranking.

This is a **DR-limited / authority-limited** problem (per memory: site DR collapsed to 0.2 in Nov 2025, recovering). No title rewrite breaks past Huberman+Stanford+NIH.

**Verdict**: **RANKING/AUTHORITY problem. Skip rewrite. Page-level position will improve as DR recovers.**

---

## What this changes for the broader strategy

1. The CTR-bleed pattern across these 4 pages is **not uniform** and not primarily a title problem. The original assumption (write better titles) only fits one of the four.
2. Three pages face problems titles can't fix:
   - SERP-feature dominance (physiological-sigh)
   - Authority-site dominance (athletes)
   - Long-tail impression dilution where we rank pos 20+ (box's page-level CTR)
3. The single title-rewrite candidate (coherent) is an **intent-mismatch** problem — the title frames the page as "the science of" when users want a timer at a specific BPM. The fix is straightforward; expected lift modest given Answer Box + YouTube timer videos above.
4. **Long-tail impressions are not a rewrite-able problem.** When 90%+ of a page's impressions come from anonymized long-tail queries, page-level CTR is a poor signal for title efficacy.

## Measurement plan for the coherent rewrite

- Baseline (90d ending 2026-05-05): page-level CTR 0.04%, pos 7.1, ~3K impressions, top query "coherent breathing breaths per minute" 84 imp / 0 clicks at pos 5.
- After deploy + 2 weeks (~2026-05-19): re-pull. Expect:
  - Top query pos to stay ~5
  - Top query CTR to lift from 0% to 1–3% (still suppressed by Answer Box + timer YT videos)
  - Page-level CTR improvement modest (limited by long-tail dilution)
- After deploy + 4 weeks (~2026-06-02): full evaluation. If CTR doesn't move on top-3 queries, the diagnosis was wrong (likely SERP-feature dominance is even tighter than estimated).
- Log results in docs/SEO-EXPERIMENTS.md.
