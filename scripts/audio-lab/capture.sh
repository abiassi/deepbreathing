#!/usr/bin/env bash
# Audio lab capture. Records one real session from the running web app.
#
# Usage: scripts/audio-lab/capture.sh <clip-name> <path-and-query> <seconds>
# Example: scripts/audio-lab/capture.sh coherent-proposed '/breathe/coherent?duration=40&sound=guide' 47
#
# Needs: the verify-deepbreathing server on 127.0.0.1:4317 and
# scripts/audio-lab/receiver.mjs on 127.0.0.1:4329. The clip is saved by the
# receiver as <clip-name>.wav. The recording starts at the Start Session click.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

name="$1"
target="$2"
seconds="$3"
app_port="${AUDIO_LAB_APP_PORT:-4317}"
receiver_port="${AUDIO_LAB_RECEIVER_PORT:-4329}"
skill="$PWD/.claude/skills/verify-deepbreathing"

mkdir -p "$skill/run"
if [[ ! -f "$skill/run/browser-session" ]]; then
  agent-browser session id --scope worktree --prefix dbe-verify > "$skill/run/browser-session"
fi
export AGENT_BROWSER_SESSION="$(cat "$skill/run/browser-session")"
export AGENT_BROWSER_ARGS=--autoplay-policy=no-user-gesture-required
export AGENT_BROWSER_INIT_SCRIPTS="$PWD/scripts/audio-lab/tap.init.js"

agent-browser open "http://127.0.0.1:${app_port}${target}" >/dev/null
agent-browser set viewport 1280 800 >/dev/null
agent-browser wait '[aria-label="Start Session"]' >/dev/null

# The engine creates its AudioContext on the first pointerdown. Trigger that
# early so the tap worklet is loaded before the session starts.
agent-browser eval "window.dispatchEvent(new PointerEvent('pointerdown')); 'unlocked'" >/dev/null
for _ in {1..20}; do
  ready="$(agent-browser eval 'String(window.__dbeTap && window.__dbeTap.ready)')"
  [[ "$ready" == *true* ]] && break
  agent-browser wait 250 >/dev/null
done
[[ "$ready" == *true* ]] || { echo "tap not ready: $(agent-browser eval 'window.__dbeTap && window.__dbeTap.mode')" >&2; exit 1; }

agent-browser eval "document.addEventListener('click', () => window.__dbeTap.reset(), { capture: true, once: true }); 'armed'" >/dev/null
agent-browser click '[aria-label="Start Session"]' >/dev/null
sleep "$seconds"
agent-browser eval "window.__dbeTap.upload('http://127.0.0.1:${receiver_port}/save?name=${name}.wav')"
