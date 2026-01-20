# PRD: SEO Phase 3 - Enhancements for Existing Pages

## Overview

Apply Phase 2 learnings (videos, comparison sections, internal links) to three existing pages that were not touched in Phase 2:
- `/breathe/pursed-lip`
- `/breathe/nadi-shodhana`
- `/for/stress`

## Pages to Enhance

### 1. Pursed-Lip Breathing (`/breathe/pursed-lip`)
- **Current state**: Has related links, has comparison FAQ, missing video
- **Improvements**: Add authoritative video, add link to belly breathing

### 2. Nadi Shodhana (`/breathe/nadi-shodhana`)
- **Current state**: Has related links including pranayama, missing video and comparison section
- **Improvements**: Add authoritative video, add comparison section

### 3. Stress (`/for/stress`)
- **Current state**: Has related use-cases, partial comparison in FAQ, missing video
- **Improvements**: Add authoritative video, add kids link, strengthen comparison FAQ

---

## Implementation Steps

### Step 1: RESEARCH Videos for All 3 Pages
Find authoritative YouTube videos with good production quality and credible sources:

**Pursed-lip**: Look for:
- Respiratory therapist demonstrations
- COPD foundation or hospital-produced content
- Search terms: "pursed lip breathing technique", "COPD breathing exercises"

**Nadi-shodhana**: Look for:
- Yoga instructor demonstrations from reputable channels
- Search terms: "alternate nostril breathing tutorial", "nadi shodhana pranayama"

**Stress**: Look for:
- Huberman Lab physiological sigh explanation (may already be in codebase)
- Stanford research explanations
- Search terms: "physiological sigh Huberman", "cyclic sighing Stanford"

**Deliverable**: Document video IDs, titles, and descriptions for each page.

---

### Step 2: IMPLEMENT Videos with Schema
Add video objects to each page following the existing pattern:

```typescript
video: {
  youtubeId: "VIDEO_ID",
  title: "Video Title",
  description: "Brief description of what the video covers and why it's authoritative."
}
```

Verify build passes after implementation.

---

### Step 3: WRITE Comparison Section Content
Draft comparison content for:

**Nadi-shodhana** (body section):
- "Nadi Shodhana vs Box Breathing" - compare structured relaxation approaches

**Stress** (FAQ):
- Strengthen existing "Why doesn't regular deep breathing work as well?" or add new explicit comparison

**Deliverable**: Draft content ready for implementation.

---

### Step 4: IMPLEMENT Comparison Sections
Add the drafted content to:
- `breathing-pages.ts`: nadi-shodhana body array
- `use-case-pages.ts`: stress faqs array

Verify build passes after implementation.

---

### Step 5: PLAN Internal Link Additions
Identify link additions:

**Pursed-lip** → add to `related` array:
- `belly`: "Master diaphragmatic breathing first—it's the foundation for all breathing techniques including pursed-lip."

**Stress** → add to `relatedUseCases` array:
- `kids`: "Teaching kids to manage stress? Simple breathing games they can use at school or home"

---

### Step 6: IMPLEMENT Internal Links
Add the planned links to:
- `breathing-pages.ts`: pursed-lip related array
- `use-case-pages.ts`: stress relatedUseCases array

Verify build passes after implementation.

---

## Success Criteria

- [ ] All 3 pages have authoritative video embeds with VideoObject schema
- [ ] Nadi-shodhana has comparison section in body
- [ ] Stress page has strengthened comparison content
- [ ] Pursed-lip links to belly breathing
- [ ] Stress page links to kids page
- [ ] Build passes after all changes
- [ ] All videos are accessible/playable

---

## Files to Modify

- `src/data/breathing-pages.ts` (pursed-lip, nadi-shodhana)
- `src/data/use-case-pages.ts` (stress)
