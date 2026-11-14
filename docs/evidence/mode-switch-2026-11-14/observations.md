# Mode switch investigation, 2026-11-14

Local checkout based on `9339d5575110ffe1dbd02f2d0daf0499bc96bc44`. The verification skill launched Next.js on 127.0.0.1:4317 with a local-only database URL. The isolated Chromium session used the audio autoplay flag. GA4 is disabled on localhost, so a `window.gtag` capture recorded calls in sessionStorage. No production analytics were sent. The web app does not use `/api/v1/analytics`; request monitoring found none. That endpoint serves the native app.

Before the change, Settings > Coherent on the home page produced:

```json
["event","mode_switch",{"from":"Box Breathing","to":"Coherent Breathing","origin_path":"/","destination_path":"/breathe/coherent"}]
```

Before the change, Pick a mode > Coherent navigated to `/breathe/coherent` and the capture was `[]`. During a session, Settings showed “Pause the session to switch modes”; the picker was absent.

After the change, the same homepage link produced:

```json
["event","mode_switch",{"from":"Box Breathing","to":"Coherent Breathing","origin_path":"/","destination_path":"/breathe/coherent"}]
```

After the change, starting Coherent and selecting the Box practice link produced:

```json
["event","breathing_session_start",{"mode":"Coherent Breathing","duration":60}]
["event","mode_switch",{"from":"Coherent Breathing","to":"Box Breathing","origin_path":"/breathe/coherent","destination_path":"/breathe/box"}]
["event","breathing_session_end",{"mode":"Coherent Breathing","reason":"paused","seconds_elapsed":10}]
```

The last session-end call appeared twice in the development capture. This investigation does not change session-end tracking. Local calls do not prove GA4 received an event; check the first full week after deployment.

The GA4 Data API report for property 527524722 covered July 16 to November 12, inclusive. Events were sparse, not permanently zero: November 2 and 3 each had one event; November 4–10 had none; November 11 had one and November 12 had two. The daily report uses the property's date and excludes the newest two days. The `customEvent:reason` dimension returned `mode_switched` through August 29 only. Navigation during a session reports `paused`, so that dimension does not independently measure all switches. The raw report is retained in the task attachment directory.

The original `mode_switch` call dates to commit 511cfbe. PR #96 was deployed November 12, after the zero week, and did not remove the call. Vercel's current team returned production deployment records from November 9 onward. That record cannot establish the cause of the gradual decline before November. The 0/203 dashboard figures are separate user counts, not a cohort conversion rate.
