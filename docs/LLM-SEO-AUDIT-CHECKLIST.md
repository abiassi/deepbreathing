# LLM SEO Audit Checklist

Audit date: 2026-02-19
Scope: all indexable Next.js routes under `src/app/**/page.tsx` (50 pages)

## How to use this file

- Work top-down by `Priority` (High, then Medium, then Low).
- Mark `Fix Applied` when a row is complete.
- Add initials and notes in `Owner / Notes` so handoffs are seamless.

## Executive Summary

- Total pages audited: **50**
- High-priority gaps: **0**
- Medium-priority gaps: **0**
- Low-priority / no critical gap: **50**

## Completed Since Previous Audit

| Priority | Item | Why it matters | Fix Applied | Owner / Notes |
|---|---|---|---|---|
| High | Automate sitemap route discovery in `src/app/sitemap.ts` via `src/lib/seo/sitemap-routes.mjs` | Prevents manual drift and missed pages. | [x] | Codex: filesystem discovery + route coverage tests added. |
| Medium | Implement explicit OG/Twitter image strategy across all page metadata | Ensures social cards are intentional per route and no page falls back silently. | [x] | Codex: added `createOgImagePath()` + metadata coverage tests. |
| Medium | Add reviewer identity to pattern/use-case content metadata where available | Stronger E-E-A-T signals for health-adjacent content. | [x] | Codex: default reviewer fallback + schema coverage test added. |

## Remaining Sitewide Action Items

| Priority | Item | Why it matters | Fix Applied | Owner / Notes |
|---|---|---|---|---|
| - | None | - | - | - |

## Route-by-Route Checklist

| Route | Page Type | Meta | Canonical | OG/Twitter | OG Image Specific | JSON-LD | Sitemap | Priority | Gap Notes | Fix Applied | Owner / Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | home-layout-meta | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/1-minute-breathing-exercise` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/2-minute-breathing-exercise` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/4-7-8-breathing-for-insomnia` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/4-7-8-breathing-timer` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/5-minute-breathing-exercise` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/about` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/about/methodology` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/box-breathing-app` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/box-breathing-before-presentation` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe/4-7-8` | pattern-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe/belly` | pattern-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe/box` | pattern-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe/breath-of-fire` | pattern-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe/buteyko` | pattern-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe/coherent` | pattern-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe/nadi-shodhana` | pattern-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe/physiological-sigh` | pattern-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe/pursed-lip` | pattern-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe/tummo` | pattern-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe/ujjayi` | pattern-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathe/wim-hof` | pattern-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathing-app` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathing-exercises-before-surgery` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathing-exercises-for-labor` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/breathing-visualizer` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/coherent-breathing-app` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/anxiety` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/athletes` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/focus` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/high-blood-pressure` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/holiday-stress` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/huberman` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/kids` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/lung-capacity` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/meditation` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/panic-attacks` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/pranayama` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/pregnancy` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/public-speaking` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/running` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/singing` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/sleep` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/stress` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/for/travel-anxiety` | usecase-template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/holiday-breathing-exercises` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/physiological-sigh-panic-attack` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |
| `/privacy` | local-page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Low | No critical technical gap identified. | [ ] | |

## High-Priority Missing Sitemap Routes

- None

## What Is Not Fully Automatable

- Dynamic route URL expansion (if/when `[param]` pages are introduced) requires explicit URL source logic.
- Page-level OG creative design and copy tone still require editorial judgment.
- Reviewer identity, medical review claims, and E-E-A-T policy decisions require human governance.

## Source Files Audited

- `src/app/**/page.tsx`
- `src/app/layout.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/data/breathing-pages.ts`
- `src/data/use-case-pages.ts`
- `src/lib/seo/sitemap-routes.mjs`
- `src/lib/seo/og-image.ts`
