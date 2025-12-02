# Progress

## 2025-12-02

### Use Case Landing Pages
Added 4 SEO-optimized "hub & spoke" pages targeting specific user problems:
- `/for/public-speaking` - Box breathing for stage fright (Navy SEAL method)
- `/for/high-blood-pressure` - 4-7-8 breathing for hypertension support (with medical disclaimer)
- `/for/sleep` - 4-7-8 breathing for insomnia ("natural tranquilizer" technique)
- `/for/running` - Physiological sigh for recovery & side stitches

**New files created:**
- `src/data/use-case-pages.ts` - TypeScript interfaces and content for all 4 pages
- `src/app/for/use-case-page.tsx` - Reusable template component (Problem → Solution → Science → How-To → References → FAQ)
- `src/app/for/public-speaking/page.tsx`
- `src/app/for/high-blood-pressure/page.tsx`
- `src/app/for/sleep/page.tsx`
- `src/app/for/running/page.tsx`

**Features:**
- Embedded visualizer on each page (no redirect needed to practice)
- Real scientific citations with URLs (Harvard Health, Cleveland Clinic, PubMed, Sleep Foundation, etc.)
- Strategic cross-linking between /for/ pages based on user intent overlap
- Bidirectional links: /breathe/ pages now link to relevant /for/ pages and vice versa
- Full JSON-LD schemas (FAQPage, HowTo, Article)
- Inline medical disclaimer for blood pressure page

### SEO Improvements
- Updated page titles for better CTR: added "Tool" and "Interactive" to differentiate from article-heavy search results
  - Box Breathing Tool (4-4-4-4) - Interactive Visualizer & Guide
  - 4-7-8 Breathing Tool - Interactive Visualizer & Guide
  - Coherent Breathing Tool - Interactive 0.1 Hz Trainer
  - Physiological Sigh Tool - Interactive Timer & Guide
- Added `src/app/sitemap.ts` - auto-generates sitemap.xml with all pages (now includes /for/ routes)
- Added `src/app/robots.ts` - points crawlers to sitemap
