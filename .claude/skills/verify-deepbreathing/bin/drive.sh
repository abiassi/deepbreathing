#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
skill="$PWD/.claude/skills/verify-deepbreathing"
node "$skill/bin/server.mjs" health >/dev/null
mkdir -p "$skill/run" "$skill/evidence"
if [[ ! -f "$skill/run/browser-session" ]]; then
  agent-browser session id --scope worktree --prefix dbe-verify > "$skill/run/browser-session"
fi
export AGENT_BROWSER_SESSION="$(cat "$skill/run/browser-session")"
export AGENT_BROWSER_ARGS=--autoplay-policy=no-user-gesture-required
case "${1:-}" in
  home)
    agent-browser open http://127.0.0.1:4317/ >/dev/null
    agent-browser set viewport 1280 800 >/dev/null
    agent-browser wait '[aria-label="Start Session"]' >/dev/null
    agent-browser screenshot "$skill/evidence/home.png" >/dev/null
    [[ -s "$skill/evidence/home.png" ]]
    echo "home: Start Session visible; screenshot $skill/evidence/home.png"
    ;;
  session)
    agent-browser click '[aria-label="Start Session"]' >/dev/null
    agent-browser wait '[aria-label="Pause Session"]' >/dev/null
    before="$(agent-browser eval 'document.querySelector("h2")?.innerText')"
    changed=''
    for i in {1..15}; do
      agent-browser wait 1000 >/dev/null
      current="$(agent-browser eval 'document.querySelector("h2")?.innerText')"
      if [[ "$current" != "$before" && "$current" != 'null' ]]; then changed="$current"; break; fi
    done
    [[ -n "$changed" ]] || { echo 'Breathing phase did not change' >&2; exit 1; }
    agent-browser is visible '[aria-label="Pause Session"]' | grep -q true
    agent-browser screenshot "$skill/evidence/session-running.png" >/dev/null
    [[ -s "$skill/evidence/session-running.png" ]]
    echo "session: Pause Session visible; phase $before -> $changed"
    echo "screenshot $skill/evidence/session-running.png"
    ;;
  *) echo 'Use home or session' >&2; exit 1 ;;
esac
