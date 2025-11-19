# SEO & Content Features

This document lists all SEO and content features currently implemented on deepbreathingexercises.com.

## Meta Tags & Metadata

### Core Metadata (`src/app/layout.tsx`)
- **Title**: Dynamic title with template support
  - Default: "Box Breathing Visualizer – Deep Breathing Exercises"
  - Template: "%s | Deep Breathing Exercises" (for future pages)
- **Description**: "An ultra-simple box breathing visualizer with guided timing, tactile prompts, and accessibility-friendly controls."
- **Metadata Base URL**: `https://deepbreathingexercises.com`
- **Canonical URL**: Set to site URL
- **Robots Meta**: 
  - `index: true`
  - `follow: true`
- **Language**: `lang="en"` on HTML element

## Open Graph & Social Sharing

### Open Graph Tags (`src/app/layout.tsx`)
- **Title**: "Box Breathing Visualizer"
- **Description**: "Inhale 4, hold 4, exhale 4, hold 4—simple on-screen guide."
- **Type**: "website"
- **URL**: Site URL
- **Site Name**: "Deep Breathing Exercises"
- **Image**: 
  - Path: `/og-image.png`
  - Dimensions: 1200x630
  - Alt text: "Box breathing orb expanding against a coral gradient"

### Twitter Card Tags (`src/app/layout.tsx`)
- **Card Type**: `summary_large_image`
- **Title**: "Box Breathing Visualizer"
- **Description**: "Guided 4x4x4x4 breathing visualizer with realtime cues."
- **Creator**: "@deepbreathing"
- **Image**: `/og-image.png`

## Structured Data (JSON-LD)

### Website Schema (`src/app/page.tsx`)
- **Type**: `WebSite`
- **Name**: "Box Breathing Visualizer"
- **URL**: Site URL
- **Description**: "Guided 4x4x4x4 breathing visualizer with tactile cues, slider controls, and accessibility-friendly instructions."
- **SearchAction**: Includes potential search action with query input

### FAQ Schema (`src/app/page.tsx`)
- **Type**: `FAQPage`
- **Questions**: 3 FAQ items with structured Question/Answer format:
  1. "How long should I practice box breathing?"
  2. "When is the best time to use this technique?"
  3. "Can I change the timing?"

### Implementation
- JSON-LD component (`src/components/seo/json-ld.tsx`) renders structured data
- Multiple schemas can be passed as an array

## Sitemap & Robots

### XML Sitemap (`src/app/sitemap.xml/route.ts`)
- **Location**: `/sitemap.xml`
- **Format**: Standard XML sitemap
- **Content**: 
  - Homepage URL with priority 1.0
  - Dynamic `lastmod` timestamp (current date)
  - `changefreq`: weekly
- **Caching**: 
  - Public cache with max-age 0
  - Must-revalidate
  - S-maxage: 604800 (7 days)
  - Stale-while-revalidate: 86400 (1 day)

### Robots.txt (`public/robots.txt`)
- **User-agent**: `*` (all crawlers)
- **Allow**: `/` (all paths)
- **Sitemap**: References sitemap URL

### Sitemap Submission
- **Post-build script** (`scripts/ping-sitemap.mjs`): Automatically pings search engines after build
  - Pings Google: `https://www.google.com/ping?sitemap=...`
  - Pings Bing: `https://www.bing.com/ping?sitemap=...`
  - Runs in CI environment only

## Content Features

### Hero Section (`src/app/page.tsx`)
- **Headline**: "Calm your nervous system in four steady counts"
- **Subheadline**: Descriptive text about the tool's purpose
- **Lead text**: "Deep breathing exercises" with uppercase styling

### Feature Cards
Three-card grid highlighting key features:
1. **Evidence-based**: Information about vagal tone regulation
2. **Thoughtful defaults**: Accessibility and lightweight design
3. **Personal pace**: Customizable cadence (3-8 seconds)

### Practice Cues Section
- **Instructions**: Detailed guidance on how to practice
- **Data points**:
  - Recommended reps: 4–8 cycles
  - Full cycle duration: 16–32s
  - Best moments: Before events, between tasks, bedtime
  - Accessibility: Keyboard, screen readers, light/dark modes

### FAQ Section
- **Format**: Expandable `<details>` elements
- **Content**: 3 questions with detailed answers
- **Styling**: Rounded cards with shadow effects

### Footer
- **Attribution**: Link to creator (abiassi.com)
- **External link handling**: `rel="noopener noreferrer"` for security

## Accessibility Features (SEO Benefits)

### ARIA Labels & Live Regions
- **aria-live="polite"**: Multiple instances for dynamic content updates
  - Phase labels during breathing cycle
  - Countdown timer
  - Instructions
- **aria-pressed**: Button state indicators
- **aria-label**: Descriptive labels for interactive elements
  - "Adjust base pacing" for slider
  - "Toggle breathing cycle" for main button
- **aria-hidden**: Decorative elements marked as hidden from screen readers

### Semantic HTML
- **Proper heading hierarchy**: H1, H2 used appropriately
- **Semantic elements**: `<main>`, `<section>`, `<footer>`, `<details>`, `<summary>`
- **Definition lists**: `<dl>`, `<dt>`, `<dd>` for structured data

### Keyboard Navigation
- **Spacebar shortcut**: Toggle play/pause functionality
- **Focusable elements**: Proper tab order and focus management

## Analytics

### Vercel Analytics (`src/app/layout.tsx`)
- **Implementation**: `@vercel/analytics/next` component
- **Purpose**: Web analytics and performance monitoring

## Technical SEO

### Performance
- **Next.js App Router**: Modern React framework with optimized rendering
- **Font optimization**: Inter font loaded via Next.js font optimization
- **Image optimization**: OG image present in public folder

### URL Structure
- **Clean URLs**: Root domain for main page
- **HTTPS**: Assumed (standard for production)

### Content Quality
- **Unique content**: Original descriptions and copy
- **Keyword optimization**: Natural integration of relevant terms
- **Content length**: Substantial content with multiple sections
- **Readability**: Clear, concise language with proper formatting

## Future SEO Opportunities

Based on the codebase, potential areas for expansion:
- Additional pages (could use title template)
- More structured data types (HowTo, Article, etc.)
- Blog or resource section
- More FAQ items
- Breadcrumb navigation (if multi-page)
- Additional sitemap entries (if multi-page)

