---
name: verify-deepbreathing
description: Verify the Deep Breathing web app locally after a UI change. Launch an isolated server, drive the home orb, and capture review screenshots.
---

# Verify Deep Breathing web

Run from the checkout root with Node 22, pnpm 10.30.3, installed dependencies, and `agent-browser` with Chromium installed. Run `pnpm install --frozen-lockfile` if needed. The browser uses its own named session and Chromium's autoplay flag so WebAudio runs headlessly. Never attach to an existing browser.

The server listens only on 127.0.0.1:4317. It uses a local database URL and a local-only auth secret, overriding any checkout environment values. Guest breathing does not require a database. The server shares Next's `.next` directory with other servers in this checkout; stop those servers first or use a separate checkout. Do not use Vercel development environment values: they point at production.

Run these commands in order:

```sh
node .claude/skills/verify-deepbreathing/bin/server.mjs launch
node .claude/skills/verify-deepbreathing/bin/server.mjs health
.claude/skills/verify-deepbreathing/bin/drive.sh home
.claude/skills/verify-deepbreathing/bin/drive.sh session
.claude/skills/verify-deepbreathing/bin/cleanup.sh
```

Launch records the process identity and refuses an occupied port or existing run state. Health checks that identity and requires HTTP 200. If launch or a drive fails, run cleanup and inspect `.claude/skills/verify-deepbreathing/run/server.log`. Cleanup closes only the named browser session and the recorded server process group. It preserves evidence. If ownership cannot be established, cleanup refuses to kill the process.

The home driver waits for the hydrated orb. The session driver presses the orb, requires the Pause control, and waits for the visible breathing phase to change. Both screenshots are in the gitignored `evidence/` directory. Review each screenshot and confirm that the state is visible. For other features, exercise the actual user path and verify observable results; these two screenshots do not prove other features. Preserve evidence outside disposable worktrees before delivery. Follow `~/.agents/skills/review-delivery/SKILL.md` for inspection, retention, and links. If unavailable, inspect each image, retain a nonempty copy outside disposable directories, and provide its absolute path.
