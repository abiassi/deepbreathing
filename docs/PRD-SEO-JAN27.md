# PRD: SEO Experiments (Jan 27, 2026)

## Overview

Execute 5 SEO experiments identified from GSC analysis and competitive research. Each experiment follows Research → Implementation → Validation phases.

## Success Criteria

All experiments implemented with:
- [ ] Code changes deployed
- [ ] GSC baseline captured (where applicable)
- [ ] SEO-EXPERIMENTS.md updated with implementation details

---

## Experiment 1: Push Top 10 Pages to Top 5

**Goal:** Improve 5 pages from position 7-10 to position ≤5 for featured snippet eligibility

### Phase 1: Research
- [ ] Analyze top 3 competitors for each target keyword
- [ ] Identify content gaps (word count, topics covered, freshness)
- [ ] Check if competitors have structured data we're missing

**Target Pages:**
| Page | Current Position | Primary Query |
|------|------------------|---------------|
| /coherent-breathing-app | 7.5 | coherent breathing app |
| /for/running | 8.0 | breathing exercises for running |
| /breathe/coherent | 8.8 | coherent breathing |
| /for/huberman | 8.9 | huberman breathing |
| /4-7-8-breathing-timer | 9.4 | 4-7-8 breathing timer |

### Phase 2: Implementation
- [ ] Add "Updated January 2026" to page metadata
- [ ] Expand content by 200-300 words with unique insights per page
- [ ] Add comparison tables (vs other techniques) where relevant
- [ ] Strengthen internal linking from higher-traffic pages
- [ ] Add FAQ schema markup if missing

**Files to modify:**
- `src/app/coherent-breathing-app/page.tsx`
- `src/app/for/running/page.tsx`
- `src/app/breathe/coherent/page.tsx`
- `src/app/for/huberman/page.tsx`
- `src/app/4-7-8-breathing-timer/page.tsx`

### Phase 3: Validation
- [ ] Run `pnpm build` - no errors
- [ ] Verify pages render correctly in browser
- [ ] Check structured data with Google Rich Results Test (manual)
- [ ] Update SEO-EXPERIMENTS.md with changes made

---

## Experiment 2: Programmatic Combination Pages (pSEO)

**Goal:** Create 5 long-tail pages targeting specific technique + context combinations

### Phase 1: Research
- [ ] Verify target queries have search volume (use existing keyword data or estimate)
- [ ] Check no existing pages already target these queries
- [ ] Identify which existing pattern page to base each on

**Target Pages:**
| URL | Target Query | Base Pattern |
|-----|--------------|--------------|
| /4-7-8-breathing-for-insomnia | 4-7-8 breathing insomnia | 4-7-8 |
| /box-breathing-before-presentation | breathing before presentation | Box |
| /physiological-sigh-panic-attack | breathing technique panic attack | Physiological Sigh |
| /breathing-exercises-before-surgery | breathing exercises before surgery | Box |
| /breathing-exercises-for-labor | breathing exercises labor | 4-7-8 |

### Phase 2: Implementation
- [ ] Create page component for each URL
- [ ] Write unique intro paragraph (150+ words) targeting specific context
- [ ] Include timer with pre-configured settings for the use case
- [ ] Add internal links to/from main technique page
- [ ] Add appropriate meta title/description

**Files to create:**
- `src/app/4-7-8-breathing-for-insomnia/page.tsx`
- `src/app/box-breathing-before-presentation/page.tsx`
- `src/app/physiological-sigh-panic-attack/page.tsx`
- `src/app/breathing-exercises-before-surgery/page.tsx`
- `src/app/breathing-exercises-for-labor/page.tsx`

### Phase 3: Validation
- [ ] Run `pnpm build` - no errors
- [ ] Verify all 5 pages render with correct timer configurations
- [ ] Check meta tags are unique per page
- [ ] Update SEO-EXPERIMENTS.md with implementation details

---

## Experiment 3: E-E-A-T Enhancement

**Goal:** Add trust signals for YMYL (Your Money Your Life) health content

### Phase 1: Research
- [ ] Review competitor E-E-A-T implementations (Healthline, WebMD author pages)
- [ ] Identify which schema.org types to use (Person, MedicalWebPage, etc.)
- [ ] Decide on review/credentials approach (real person vs editorial team)

### Phase 2: Implementation
- [ ] Create reusable `<ContentCredentials>` component with:
  - "Last updated: [date]" display
  - "Reviewed by: [name], [credentials]" section
  - Link to methodology/about page
- [ ] Add component to all /breathe/* pages (health content)
- [ ] Create `/about/methodology` page explaining content review process
- [ ] Add Person schema for author/reviewer
- [ ] Add "Sources" section component for research citations

**Files to create:**
- `src/components/ContentCredentials.tsx`
- `src/app/about/methodology/page.tsx`

**Files to modify:**
- All `src/app/breathe/*/page.tsx` files (add ContentCredentials)
- `src/data/breathing-pages.ts` (add lastUpdated, sources fields)

### Phase 3: Validation
- [ ] Run `pnpm build` - no errors
- [ ] Verify ContentCredentials renders on all /breathe/* pages
- [ ] Check Person schema with Google Rich Results Test
- [ ] Update SEO-EXPERIMENTS.md with implementation details

---

## Experiment 4: Voice Search / Conversational Query Optimization

**Goal:** Add question-format headings with direct answers for voice search and AI citations

### Phase 1: Research
- [ ] Identify top 10 conversational queries from GSC data
- [ ] Map each query to the most relevant existing page
- [ ] Write 40-50 word direct answers for each

**Target Queries:**
| Query | Target Page |
|-------|-------------|
| how do I calm down quickly | /breathe/physiological-sigh |
| what is the best breathing technique for anxiety | /for/anxiety |
| how do Navy SEALs breathe | /breathe/box |
| does 4-7-8 breathing really work | /breathe/4-7-8 |
| how to stop a panic attack | /breathe/physiological-sigh |
| breathing exercises for sleep | /for/sleep |

### Phase 2: Implementation
- [ ] Add exact-match question as H2 heading on each target page
- [ ] Add 40-50 word direct answer immediately after H2
- [ ] Use "inverted pyramid" structure (answer first, details after)
- [ ] Add FAQPage schema for question/answer pairs

**Files to modify:**
- `src/app/breathe/physiological-sigh/page.tsx`
- `src/app/for/anxiety/page.tsx`
- `src/app/breathe/box/page.tsx`
- `src/app/breathe/4-7-8/page.tsx`
- `src/app/for/sleep/page.tsx`

### Phase 3: Validation
- [ ] Run `pnpm build` - no errors
- [ ] Verify question H2s appear on pages
- [ ] Check FAQPage schema with Rich Results Test
- [ ] Update SEO-EXPERIMENTS.md with implementation details

---

## Experiment 5: Interactive Tool CTAs in Meta Descriptions

**Goal:** Differentiate from text-only competitors by emphasizing free interactive timer in meta descriptions

### Phase 1: Research
- [ ] Audit current meta descriptions for all /breathe/* and timer pages
- [ ] Identify which pages are missing "free timer" messaging
- [ ] Review competitor meta descriptions for differentiation opportunities

### Phase 2: Implementation
- [ ] Update meta descriptions to follow pattern:
  "Free [technique] breathing timer — [benefit]. Start your guided session now."
- [ ] Ensure descriptions are 150-160 characters (optimal length)
- [ ] Add action words: "Start now", "Try free", "Begin your session"

**Pages to update:**
- All `/breathe/*` pages
- `/4-7-8-breathing-timer`
- `/box-breathing-app`
- `/coherent-breathing-app`
- `/breathing-app`

**Files to modify:**
- `src/data/breathing-pages.ts` (metaDescription fields)
- Individual page metadata where hardcoded

### Phase 3: Validation
- [ ] Run `pnpm build` - no errors
- [ ] Verify meta descriptions in page source (view-source or browser devtools)
- [ ] Check no descriptions exceed 160 characters
- [ ] Update SEO-EXPERIMENTS.md with new descriptions

---

## IMPORTANT: Progress Tracking

**After completing EACH experiment's Implementation phase:**
1. Update `/docs/SEO-EXPERIMENTS.md` with:
   - Status changed from "Planned" to "Implemented"
   - List of files created/modified
   - Exact changes made (new meta descriptions, content added, etc.)
   - Date implemented
2. This allows us to measure results in 2-3 weeks via GSC

---

## Completion Criteria

When ALL of the following are true, output `<promise>SEO EXPERIMENTS COMPLETE</promise>`:

1. All 5 experiments have Implementation phase completed
2. `pnpm build` passes with no errors
3. SEO-EXPERIMENTS.md updated with implementation details for each experiment
4. No TypeScript errors in modified files

## Fail-safes

- **Max iterations:** 30
- **If stuck:** Skip to next experiment, note blocker in SEO-EXPERIMENTS.md
- **If build fails:** Fix TypeScript/build errors before continuing
- **Do NOT:** Modify unrelated files, change core breathing engine logic, or delete existing content

## Notes

- Prioritize experiments 2 and 5 (highest impact, lowest complexity)
- Experiment 3 (E-E-A-T) can use placeholder reviewer name for now
- Check existing code patterns before creating new components
