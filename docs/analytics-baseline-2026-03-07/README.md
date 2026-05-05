# Google Analytics Baseline

Captured: 2026-03-07 01:35:01 WET

> ⚠️ **The GA4 property documented in this file is now deprecated.**
> Sometime between Mar 7 and May 5 2026, the `Deep Breathing Exercises` stream
> was migrated from the **Abiassi** account (property `249876215`, measurement ID
> `G-7GG9WVNBBP`) to the **DKMT** account (property `527524722`, measurement ID
> `G-53DLCBMRL3`). The old property still exists but only holds Q1 2026 data.
> **For current GA4 work, use the DKMT property** — see
> [docs/runbooks/tools-and-data-sources.md](../runbooks/tools-and-data-sources.md).
> This file is kept as a historical baseline for the Mar 7 numbers only.

## Scope

This baseline was captured before any Google Analytics property cleanup or migration for `deepbreathingexercises.com`.

The current setup is a shared GA4 property that contains multiple web streams:

- `AMORIM ABIASSI FERREIRA` at `https://abiassi.com`
- `Abiassi Content` at `https://abiassi.com/content`
- `Deep Breathing Exercises` at `https://deepbreathingexercises.com`

## Current GA4 identifiers

- Account name: `Abiassi`
- Property name: `AMORIM ABIASSI FERREIRA`
- Property ID: `249876215`
- Deep Breathing Exercises stream name: `Deep Breathing Exercises`
- Stream URL: `https://deepbreathingexercises.com`
- Stream ID: `13572355401`
- Measurement ID: `G-7GG9WVNBBP`

## Stream status

- `Deep Breathing Exercises` is receiving traffic in the past 48 hours
- `abiassi.com` stream shows no data received in the past 48 hours
- `abiassi.com/content` stream shows no data received in the past 48 hours

## Home snapshot

Source: GA4 Home overview
Date range: `Last 28 days`

- Active users: `433`
- New users: `430`
- Event count: `3.1K`
- Views: `1K`

## Top countries

Source: GA4 Home, Suggested for you
Metric: `Active users by Country ID`
Date range: `Last 90 days`

1. United States: `187`
2. China: `46`
3. Canada: `30`
4. United Kingdom: `25`
5. France: `13`
6. Hong Kong: `13`
7. India: `12`

## Top pages

Source: GA4 Home, Suggested for you
Metric: `Views by Page title and screen class`
Date range: `Last 90 days`

1. `Free Breathing Visualizer: Calm Anxiety in 60 Seconds`: `235`
2. `Box Breathing: Navy SEAL Technique to Stop Anxiety Fast (Free Tool) | Deep Breathing Exercises`: `151`
3. `Free Online Breathing Visualizer (2026) — 10 Techniques, No Download | Deep Breathing Exercises`: `83`
4. `4-7-8 Breathing: Fall Asleep in 2 Minutes (Dr. Weil's Method) | Deep Breathing Exercises`: `67`
5. `Coherent Breathing: The Science of 5 Breaths/Min (Free Trainer) | Deep Breathing Exercises`: `51`
6. `Box Breathing App (Free Online 4-4-4-4 Timer) - No Download | Deep Breathing Exercises`: `48`
7. `Free Breathing App (No Download) — Calm Anxiety, Sleep & Focus | Deep Breathing Exercises`: `43`

## Top acquisition channels

Source: GA4 Home, Suggested for you
Metric: `Sessions by Session default channel group`
Date range: `Last 90 days`

1. Direct: `276`
2. Organic Search: `204`
3. Referral: `84`
4. Unassigned: `39`
5. Organic Social: `11`

## Top first-user source / medium

Source: GA4 Home, Suggested for you
Metric: `Active users by First user source / medium`
Date range: `Last 7 days`

1. `(direct) / (none)`: `52`
2. `bing / organic`: `25`
3. `google / organic`: `17`
4. `chatgpt.com / referral`: `7`
5. `yahoo / organic`: `5`
6. `chatgpt.com / (not set)`: `4`
7. `duckduckgo / organic`: `3`

## Files captured

- `ga-data-streams.png`
- `ga-home.png`

## Notes for migration analysis

- The site is already correctly instrumented with `G-7GG9WVNBBP` in production.
- The main cleanup issue is structural, not implementation: `deepbreathingexercises.com` lives inside a shared GA4 property with unrelated streams.
- Moving to a dedicated property will not migrate historical GA4 data. This baseline should be used as the pre-cutover reference point.
