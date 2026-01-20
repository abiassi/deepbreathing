# PRD: SEO Technique Expansion

## Overview

Expand the breathing technique library with high-opportunity keywords identified via Ahrefs research. All new techniques will be `featured: false` (not shown on homepage "Pick a mode") but will appear in the footer for internal linking and exist as standalone SEO landing pages.

## Architecture (Already Implemented)

- `featured` flag controls homepage visibility
- Footer dynamically lists all techniques
- New techniques follow existing pattern structure

---

## Technique 1: Ujjayi Breathing

### Keyword Data
- **Primary:** "ujjayi breathing" (2,700 vol, difficulty 7 - VERY LOW)
- **Secondary:** "ocean breath", "victorious breath"
- **Traffic potential:** 1,200/month

### Target Audience
- Yoga practitioners
- Meditation enthusiasts
- People wanting focus/grounding

### Pattern Definition
```typescript
ModeName: "Ujjayi"
Timing: 4s inhale, 0s hold, 6s exhale, 0s hold (4-0-6-0)
Color: Ocean blue (#0891b2)
```

### Files to Create/Modify
1. `src/components/resonance/types.ts` - Add `Ujjayi` to ModeName enum
2. `src/components/resonance/constants.ts` - Add UJJAYI pattern definition
3. `packages/engine/src/types.ts` - Add to engine types
4. `packages/engine/src/patterns.ts` - Add to engine patterns
5. `src/data/breathing-pages.ts` - Add full page content
6. `src/app/breathe/ujjayi/page.tsx` - Create route file

### Content Requirements
- Hero: Focus on the "ocean sound" and yoga connection
- Body sections: What it is, How to make the sound, Benefits, When to use
- FAQ: Address throat constriction technique, safety
- HowTo schema: Step-by-step with sound instruction

---

## Technique 2: Breathing for Kids

### Keyword Data
- **Primary:** "breathing exercises for kids" (1,800 vol, difficulty 12 - VERY LOW)
- **Secondary:** "calm down breathing for children", "kids breathing techniques"
- **Traffic potential:** 800/month

### Target Audience
- Parents
- Teachers
- Child therapists

### Implementation Approach
This is a USE-CASE page, not a new technique. Uses existing patterns (likely Box or simple 4-4) with kid-friendly framing.

### Files to Create/Modify
1. `src/data/use-case-pages.ts` - Add "kids" use case content
2. `src/app/for/kids/page.tsx` - Create route file

### Content Requirements
- Hero: Parent/teacher perspective, calming anxious children
- Technique: Simple Box (3-3-3-3) or equal breathing
- Framing: "Smell the flower, blow out the candle" metaphors
- Age-appropriate language for instructions parents can relay
- FAQ: What age? How to make it fun? School applications?

---

## Technique 3: Buteyko Breathing

### Keyword Data
- **Primary:** "buteyko breathing" (2,900 vol, difficulty 36 - LOW)
- **Secondary:** "buteyko method", "nasal breathing exercises"
- **Traffic potential:** 1,000/month

### Target Audience
- People with asthma/respiratory issues
- Nasal breathing advocates
- Performance athletes

### Pattern Definition
```typescript
ModeName: "Buteyko"
Timing: 3s inhale, 0s hold, 3s exhale, 3s hold (3-0-3-3) - light breathing
Color: Sky blue (#38bdf8)
```

### Files to Create/Modify
1. `src/components/resonance/types.ts` - Add `Buteyko` to ModeName enum
2. `src/components/resonance/constants.ts` - Add BUTEYKO pattern definition
3. `packages/engine/src/types.ts` - Add to engine types
4. `packages/engine/src/patterns.ts` - Add to engine patterns
5. `src/data/breathing-pages.ts` - Add full page content
6. `src/app/breathe/buteyko/page.tsx` - Create route file

### Content Requirements
- Hero: Focus on "light, nasal, quiet" breathing philosophy
- Body sections: What it is, The Buteyko method, Control Pause concept, Benefits
- Research: Asthma studies, athletic performance
- FAQ: Difference from other techniques, safety for asthmatics
- Disclaimer: Not a replacement for medical treatment

---

## Technique 4: Belly Breathing / Diaphragmatic Breathing

### Keyword Data
- **Primary:** "belly breathing" (5,600 vol, difficulty 32 - LOW)
- **Secondary:** "diaphragmatic breathing", "deep belly breathing"
- **Traffic potential:** 2,000/month

### Target Audience
- Beginners to breathwork
- Stress relief seekers
- Singers, speakers, athletes

### Pattern Definition
```typescript
ModeName: "Belly"
Timing: 4s inhale, 0s hold, 6s exhale, 0s hold (4-0-6-0)
Color: Warm amber (#f59e0b)
```

### Files to Create/Modify
1. `src/components/resonance/types.ts` - Add `Belly` to ModeName enum
2. `src/components/resonance/constants.ts` - Add BELLY pattern definition
3. `packages/engine/src/types.ts` - Add to engine types
4. `packages/engine/src/patterns.ts` - Add to engine patterns
5. `src/data/breathing-pages.ts` - Add full page content
6. `src/app/breathe/belly/page.tsx` - Create route file

### Content Requirements
- Hero: "The foundation of all breathwork"
- Body sections: What it is, How to feel your diaphragm, Benefits
- Beginner-friendly framing (this is often the first technique people learn)
- FAQ: Chest vs belly, lying down vs sitting, common mistakes

---

## Technique 5: Pranayama (Hub Page)

### Keyword Data
- **Primary:** "pranayama" (3,000 vol, difficulty 30)
- **Secondary:** "pranayama breathing", "yogic breathing"
- **Traffic potential:** 1,500/month

### Target Audience
- Yoga practitioners
- Spiritual seekers
- People exploring Eastern practices

### Implementation Approach
This is a HUB page linking to specific pranayama techniques (Nadi Shodhana, Ujjayi, etc.). Similar to the Huberman hub page.

### Files to Create/Modify
1. `src/data/use-case-pages.ts` - Add "pranayama" hub page content
2. `src/app/for/pranayama/page.tsx` - Create route file

### Content Requirements
- Overview of pranayama philosophy and history
- Links to specific techniques: Nadi Shodhana, Ujjayi
- Explain different types and their purposes
- FAQ: What is pranayama, how to start, safety

---

## Implementation Order (Recommended)

1. **Ujjayi** - Easiest (difficulty 7), complements existing Nadi Shodhana
2. **Kids** - Use-case page only (no new pattern), underserved niche
3. **Belly** - Highest volume (5.6K), foundational technique
4. **Buteyko** - Unique methodology, good for differentiation
5. **Pranayama Hub** - Connect the yoga techniques together

---

## Definition of Done (Per Technique)

- [ ] Types added to enum (if new pattern)
- [ ] Pattern constants defined (if new pattern)
- [ ] Engine types/patterns updated (if new pattern)
- [ ] Full page content in breathing-pages.ts or use-case-pages.ts
- [ ] Route file created
- [ ] Build passes with no errors
- [ ] Page renders correctly at localhost
- [ ] Schema markup present (HowTo, FAQ, Article)
- [ ] Internal links to related techniques
- [ ] Added to SEO-EXPERIMENTS.md with launch date

---

## Success Metrics

- **2 weeks post-launch:** Pages indexed in GSC
- **4 weeks post-launch:** First impressions appearing
- **8 weeks post-launch:** Clicks and position improvements

Target: +500 monthly organic sessions within 3 months from these 5 additions.

---

## Phase 2: SEO Enhancement (Post-Launch)

After initial pages are live, implement these enhancements to maximize ranking potential.

**Structure:** Research/planning steps are separated from implementation steps to allow focused work on each.

---

### Step 1: PLAN Internal Linking Strategy

Document all internal links to add from existing pages to new pages.

#### Research Task:
Review existing pages and document exact locations for new links.

#### Links to Add:

**To Ujjayi (`/breathe/ujjayi`):**
- From `/breathe/nadi-shodhana` - Add to `related` array with reason: "Another foundational pranayama, often practiced together"
- From `/for/meditation` - Add to `relatedUseCases`: "Ujjayi provides a focal point for meditation"

**To Belly (`/breathe/belly`):**
- From `/breathe/box` - Add to `related`: "Master belly breathing first as the foundation"
- From `/breathe/4-7-8` - Add to `related`: "Diaphragmatic breathing is the base technique"
- From `/breathe/coherent` - Add to `related`: "Start here if you're new to breathwork"
- From `/for/anxiety` - Add to `relatedUseCases`: "New to breathing? Start with belly breathing"

**To Buteyko (`/breathe/buteyko`):**
- From `/breathe/pursed-lip` - Add to `related`: "Another respiratory health technique"
- From `/for/athletes` - Add to `relatedUseCases`: "Buteyko improves nasal breathing efficiency"

**To Kids (`/for/kids`):**
- From `/for/anxiety` - Add to `relatedUseCases`: "Teaching kids to manage anxiety"
- From `/for/sleep` - Add to `relatedUseCases`: "Bedtime breathing routines for children"

**To Pranayama (`/for/pranayama`):**
- From `/breathe/nadi-shodhana` - Add to `relatedUseCases`: "Part of the pranayama tradition"
- From `/breathe/ujjayi` - Add to `relatedUseCases`: "Learn about the full pranayama system"

#### Definition of Done:
- [ ] All link targets documented above
- [ ] Ready for implementation in Step 2

---

### Step 2: IMPLEMENT Internal Links from Existing Pages

Add the internal links documented in Step 1.

#### Files to Modify:
- `src/data/breathing-pages.ts` - Update `related` arrays for: box, 4-7-8, coherent, nadi-shodhana, pursed-lip
- `src/data/use-case-pages.ts` - Update `relatedUseCases` for: anxiety, sleep, meditation, athletes

#### Implementation Notes:
- Add to `related` array: `{ slug: "belly", reason: "Master belly breathing first as the foundation" }`
- Add to `relatedUseCases` array: `{ slug: "kids", teaser: "Teaching kids to manage anxiety" }`

#### Definition of Done:
- [ ] All links from Step 1 implemented
- [ ] Each new page has 2-4 inbound internal links
- [ ] Build passes

---

### Step 3: PLAN Cross-Links Between New Pages

Document links to create between the 5 new pages.

#### Links to Add:

**From Pranayama Hub (`/for/pranayama`):**
- Already links to nadi-shodhana via `relatedTechnique`
- Add `/breathe/ujjayi` to body content or new section

**From Ujjayi (`/breathe/ujjayi`):**
- Add `/for/pranayama` to `relatedUseCases`: "Explore the pranayama tradition"
- Add `/breathe/belly` to `related`: "Foundation technique to master first"

**From Belly (`/breathe/belly`):**
- Add `/breathe/ujjayi` to `related`: "Progress to ujjayi after mastering diaphragm"
- Add `/breathe/buteyko` to `related`: "Another nasal breathing technique"
- Add `/for/kids` to `relatedUseCases`: "Teach belly breathing to children"

**From Buteyko (`/breathe/buteyko`):**
- Add `/breathe/belly` to `related`: "Start with basic diaphragmatic breathing"

**From Kids (`/for/kids`):**
- Add `/breathe/belly` to `relatedUseCases` or body mention
- Add `/for/pranayama` to `relatedUseCases`: "Parents can explore pranayama"

#### Definition of Done:
- [ ] All cross-links documented
- [ ] Ready for implementation in Step 4

---

### Step 4: IMPLEMENT Cross-Links Between New Pages

Add the cross-links documented in Step 3.

#### Files to Modify:
- `src/data/breathing-pages.ts` - Update `related` and `relatedUseCases` for: ujjayi, belly, buteyko
- `src/data/use-case-pages.ts` - Update kids, pranayama pages

#### Definition of Done:
- [ ] All cross-links from Step 3 implemented
- [ ] Each new page links to at least 2 other new pages
- [ ] Build passes

---

### Step 5: RESEARCH Authoritative Videos

Find YouTube videos from recognized experts. Document findings before implementation.

#### Research Criteria:
- **Authority:** Medical professionals, certified yoga instructors, published authors
- **Quality:** Good production, clear instruction, accurate technique
- **Length:** 3-15 minutes ideal
- **Recency:** Prefer videos from last 3 years unless classic

#### Videos to Find:

**Ujjayi Breathing:**
- Search: "ujjayi breathing tutorial", "ocean breath yoga"
- Target authorities: Yoga With Adriene, Yoga Journal, certified Ashtanga teachers
- Ideal: Clear throat constriction demonstration

**Belly/Diaphragmatic Breathing:**
- Search: "diaphragmatic breathing tutorial", "belly breathing doctor"
- Target authorities: Dr. Andrew Weil, pulmonologists, physical therapists
- Ideal: Hand-on-belly demonstration, medical credibility

**Buteyko Breathing:**
- Search: "buteyko breathing tutorial", "Patrick McKeown"
- Target authorities: Patrick McKeown (Buteyko Clinic), certified Buteyko practitioners
- Ideal: Control Pause demonstration, asthma context

**Kids Breathing:**
- Search: "breathing exercises for kids", "calm down breathing children"
- Target authorities: Child psychologists, pediatric therapists, GoNoodle
- Ideal: Kid-friendly, engaging, parent can use with child

**Pranayama Overview:**
- Search: "what is pranayama", "pranayama for beginners"
- Target authorities: B.K.S. Iyengar videos, Yoga Journal, established yoga schools
- Ideal: Overview of multiple techniques, philosophical context

#### Output Format:
Document in this PRD or separate file:
```
**[Technique]**
- Video: "[Title]"
- YouTube ID: xxxxxxxxxxx
- Channel: [Name] (authority type)
- Why chosen: [reason]
- Concerns: [any issues or "None"]
```

#### Definition of Done:
- [ ] 1 video identified per technique (5 total)
- [ ] All videos from authoritative sources
- [ ] No videos with medical misinformation
- [ ] YouTube IDs documented for Step 6

---

### Step 6: IMPLEMENT Videos with Schema Markup

Add video embeds using research from Step 5.

#### Implementation Pattern:

```typescript
// In breathing-pages.ts, add to each page:
video: {
  title: "Video Title Here",
  description: "Brief description of what the video covers",
  youtubeId: "xxxxxxxxxxx"  // 11-character YouTube ID
}
```

#### Schema Generated (automatic via pattern-page.tsx):
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Video Title",
  "description": "Description",
  "thumbnailUrl": "https://img.youtube.com/vi/ID/maxresdefault.jpg",
  "uploadDate": "YYYY-MM-DDTHH:MM:SS+00:00",
  "embedUrl": "https://www.youtube.com/embed/ID",
  "contentUrl": "https://www.youtube.com/watch?v=ID"
}
```

#### Files to Modify:
- `src/data/breathing-pages.ts` - Add `video` object to ujjayi, belly, buteyko
- `src/data/use-case-pages.ts` - Add `video` object to kids, pranayama

#### SEO Best Practices:
- Privacy-enhanced embed (`youtube-nocookie.com`) - already in template
- `loading="lazy"` on iframe - already in template
- Video title should support page H1
- Description should include target keyword naturally

#### Definition of Done:
- [ ] Video added to all 5 new pages
- [ ] Build passes
- [ ] VideoObject schema renders (verify in page source)

---

### Step 7: WRITE Comparison Section Content

Draft comparison content for each page before implementation.

#### Content to Write:

**Ujjayi Page - "Ujjayi vs Box Breathing":**
Compare throat constriction focus vs equal intervals. Ujjayi for yoga flow and meditation anchor; Box breathing for acute stress and structure. Both calm the nervous system but serve different purposes. ~100-150 words.

**Belly Page - "Belly Breathing vs Chest Breathing":**
Explain why chest breathing is inefficient and stress-associated. Belly/diaphragmatic breathing is the natural, efficient pattern. Include "how to tell which you're doing" self-test (hand on chest, hand on belly). ~100-150 words.

**Buteyko Page - "Buteyko vs Deep Breathing":**
Address the counterintuitive nature—Buteyko teaches LESS breath, not more. Compare philosophy: most techniques say "breathe deeply," Buteyko says "breathe lightly." Explain when to use each approach. ~100-150 words.

**Kids Page - "Box Breathing vs Balloon Breathing for Kids":**
Compare structured counting (box) vs simple imagery (balloon belly). Age recommendations: balloon/belly buddies for ages 3-5, box counting for ages 6+. Both effective, choose based on child's developmental stage. ~100-150 words.

**Pranayama Page - "Pranayama vs Western Breathing Exercises":**
Compare philosophical frameworks. Pranayama: prana, nadis, chakras, spiritual dimension. Western: nervous system, HRV, clinical outcomes. Techniques often identical, framing differs. Neither is "better"—choose based on personal resonance and goals. ~100-150 words.

#### Definition of Done:
- [ ] All 5 comparison sections drafted
- [ ] Content is factual and helpful (not keyword-stuffed)
- [ ] Ready for implementation in Step 8

---

### Step 8: IMPLEMENT Comparison Sections

Add comparison sections using content from Step 7.

#### Files to Modify:
- `src/data/breathing-pages.ts` - Add to `body` array for: ujjayi, belly, buteyko
- `src/data/use-case-pages.ts` - Add comparison FAQ or body section for: kids, pranayama

#### Implementation Pattern (breathing pages):
```typescript
// Add to body array:
{
  heading: "Ujjayi vs Box Breathing",
  content: "Content from Step 7..."
}
```

#### Implementation Pattern (use-case pages):
Add as new FAQ entry:
```typescript
{
  question: "What's the difference between box breathing and balloon breathing for kids?",
  answer: "Content from Step 7..."
}
```

#### SEO Benefit:
- Captures "X vs Y" search queries
- Provides snippet-ready comparison content
- Differentiates from competitors
- Increases time on page

#### Definition of Done:
- [ ] All 5 comparison sections implemented
- [ ] Build passes

---

## Phase 2 Implementation Order

| Step | Type | Task | Depends On |
|------|------|------|------------|
| 1 | PLAN | Document internal links | - |
| 2 | IMPLEMENT | Add internal links | Step 1 |
| 3 | PLAN | Document cross-links | - |
| 4 | IMPLEMENT | Add cross-links | Step 3 |
| 5 | RESEARCH | Find videos | - |
| 6 | IMPLEMENT | Add videos | Step 5 |
| 7 | WRITE | Draft comparisons | - |
| 8 | IMPLEMENT | Add comparisons | Step 7 |

**Note:** Steps 1, 3, 5, 7 can be done in parallel. Implementation steps must wait for their planning step.

---

## Phase 2 Definition of Done

- [ ] Steps 1-2: Internal links complete
- [ ] Steps 3-4: Cross-links complete
- [ ] Steps 5-6: Videos added with schema
- [ ] Steps 7-8: Comparison sections added
- [ ] Final build passes
- [ ] All new pages have inbound links, cross-links, video, and comparison content
