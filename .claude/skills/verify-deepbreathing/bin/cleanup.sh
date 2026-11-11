#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
skill=.claude/skills/verify-deepbreathing
if [[ -f "$skill/run/browser-session" ]]; then
  AGENT_BROWSER_SESSION="$(cat "$skill/run/browser-session")" agent-browser close
  rm "$skill/run/browser-session"
fi
node "$skill/bin/server.mjs" cleanup
