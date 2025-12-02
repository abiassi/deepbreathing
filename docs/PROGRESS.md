# Progress

## 2025-12-02

### Study URLs Added to Breathing Pages
Added PubMed/journal URLs to all 17 academic studies referenced in the breathing technique pages:
- **Box Breathing**: 4 studies (Laborde 2022, Marchant 2025, Steffen 2017, Fincham 2023)
- **4-7-8 Breathing**: 5 studies (Aktaş & İlgin 2023, Vierra 2022, Laborde 2022, Shao 2024, Tsai 2015/Kuula 2020)
- **Coherent Breathing**: 4 studies (Lehrer 2003, Joseph 2005, Steffen 2017, Fincham 2023)
- **Physiological Sigh**: 4 studies (Balban 2023, Hanley 2025, Severs 2022, Li 2016)

Updated `ResearchStudy` interface in `src/data/breathing-pages.ts` to include optional `url` field.

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
- CTAs: Primary "Start practicing now" scrolls to visualizer (#practice), secondary "Learn more" links to /breathe/ pages (SEO interlinking preserved)

### SEO Improvements
- Updated page titles for better CTR: added "Tool" and "Interactive" to differentiate from article-heavy search results
  - Box Breathing Tool (4-4-4-4) - Interactive Visualizer & Guide
  - 4-7-8 Breathing Tool - Interactive Visualizer & Guide
  - Coherent Breathing Tool - Interactive 0.1 Hz Trainer
  - Physiological Sigh Tool - Interactive Timer & Guide
- Added `src/app/sitemap.ts` - auto-generates sitemap.xml with all pages (now includes /for/ routes)
- Added `src/app/robots.ts` - points crawlers to sitemap
