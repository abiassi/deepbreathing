# Pattern Page Content Brief

This brief outlines every content input needed to build fully optimized `/breathe/[slug]` pages. Provide one set per breathing pattern so we can wire it into the existing component system and structured data.

## 1. Core Metadata & Identity
- **Slug**: URL-safe identifier (e.g., `box`, `coherent`).
- **Hero title & subtitle**: <80 chars for the hero block; title appears in H1.
- **Meta title**: ≤60 chars, keyword-targeted.
- **Meta description**: 150–160 chars.
- **Open Graph / Twitter**
  - Title (may match meta title)
  - Description (1–2 sentences)
  - Image filename or instructions if we should generate one.
- **Authorship**
  - Author name + credentials (optional)
  - Medical/science reviewer name + credentials (optional)
  - Original publish date & last updated date (ISO format preferred).

## 2. Hero Context
- **Label** (optional override; default “Deep Breathing Exercises”).
- **1–2 sentence intro** (~40–60 words) that immediately explains the technique; used above the fold.

## 3. Long-Form Copy Blocks
Provide prose we can split into headings/paragraphs (~350–500 words total):
1. **What it is**: definition, key mechanics, sensory cues.
2. **Benefits & mechanisms**: include plain-language explanations.
3. **When to use it**: scenarios, dayparts, populations.
4. **When to skip or modify**: contraindications, warning signs.

## 4. Benefit Cards
Three short entries (<30 words each) for the existing cards:
```
- Title
- Description
```

## 5. Practice Notes List
Three tips with `title + description` (1–2 sentences each). Focus on form cues, pacing, comfort adjustments.

## 6. FAQ Entries
- Minimum 3 Q/A pairs; 4–6 preferred.
- Answers ≈80–120 words and may cite studies (“A 2023 RCT…”). These power the onsite accordion and FAQ schema.

## 7. Step-by-Step “How To”
For a dedicated HowTo module and schema:
- **Estimated total time** (e.g., “5 minutes”).
- **Difficulty** (easy/moderate/etc.).
- **Tools** (chair, timer, quiet room, etc.).
- **Supplies/materials** (optional).
- **Steps**: 3–6 ordered steps; each needs `name`, `detailed instruction`, and optional `target duration/count` (e.g., “Inhale through the nose for 4 seconds”).

## 8. Use-Case Tiles
2–3 scenarios with:
- Scenario name (e.g., “Sleep onset”).
- Short description of why this pattern fits (1–2 sentences).
- Recommended dose (time or repetitions) if relevant.

## 9. Research & Safety Section
For evidence/E-E-A-T content:
- 2–4 “study highlight” blurbs (study name or source, population, outcome metric).
- Safety notes / contraindications / modification advice.
- Optional expert quote with attribution.

## 10. Related Pattern Suggestions
For internal linking, share 2 other patterns that complement this one:
```
- Pattern slug
- 1-sentence reason to try it
```

## 11. Structured Data Extras
Any additional data we can surface:
- Suggested keywords or questions to target.
- Synonyms/nicknames for the technique.
- Recommended session frequency (e.g., “Daily, 5 minutes”).

### Submission Template
Use the following JSON-like structure (or a filled spreadsheet) per pattern so we can drop it into `breathing-pages.ts` and future schema generators:
```json
{
  "slug": "",
  "hero": { "title": "", "subtitle": "", "intro": "" },
  "meta": {
    "title": "",
    "description": "",
    "ogTitle": "",
    "ogDescription": "",
    "ogImage": "",
    "twitterTitle": "",
    "twitterDescription": "",
    "author": "",
    "reviewer": "",
    "datePublished": "",
    "dateModified": ""
  },
  "body": [
    { "heading": "What it is", "content": "" },
    { "heading": "Benefits", "content": "" },
    { "heading": "When to use", "content": "" },
    { "heading": "When to skip", "content": "" }
  ],
  "benefits": [{ "title": "", "description": "" }],
  "practiceTips": [{ "title": "", "description": "" }],
  "faqs": [{ "question": "", "answer": "" }],
  "howTo": {
    "totalTime": "",
    "difficulty": "",
    "tools": [],
    "supplies": [],
    "steps": [{ "name": "", "instruction": "", "duration": "" }]
  },
  "useCases": [{ "name": "", "description": "", "dose": "" }],
  "research": {
    "studies": [{ "title": "", "summary": "" }],
    "safety": [""],
    "quotes": [{ "text": "", "attribution": "" }]
  },
  "related": [{ "slug": "", "reason": "" }],
  "keywords": [""],
  "synonyms": [""],
  "frequency": ""
}
```

Fill in as much as possible—missing data falls back to minimal UI but reduces SEO value. Once provided, we’ll integrate it into `breathing-pages.ts`, extend metadata, JSON-LD (`FAQ`, `HowTo`, `Article`, `Breadcrumb`), and the sitemap.
