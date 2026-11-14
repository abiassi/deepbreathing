# Audio lab

Records real breathing sessions from the running web app and measures them. Used for `docs/audio/SOUND-DESIGN-2026-11.md`.

The recording is what the engine sends to the speakers: the tap sits on the `AudioContext` destination, after the master compressor, limiter and trim. Nothing here ships; `tap.init.js` runs only as an `agent-browser` init script.

## Record a clip

1. Start the app with the `verify-deepbreathing` skill: `node .claude/skills/verify-deepbreathing/bin/server.mjs launch`.
2. Start the receiver: `node scripts/audio-lab/receiver.mjs /tmp/audio-lab 4329`.
3. Record: `scripts/audio-lab/capture.sh coherent-proposed '/breathe/coherent?duration=44&sound=guide' 51`.
4. Stop the receiver, then run `.claude/skills/verify-deepbreathing/bin/cleanup.sh`.

The clip starts at the Start Session click and is saved as 32-bit float WAV, so a sample above full scale is visible. Recording is real time: a 51 s clip takes 51 s. Do not edit source files while a clip records; a hot reload restarts the page.

## Measure

```sh
python3 scripts/audio-lab/analyze.py --images /tmp/audio-lab/img --pattern inhale:5.5,exhale:5.5 /tmp/audio-lab/*.wav
```

One JSON line per clip: peaks, EBU R128 loudness, clipped samples, steps, dropouts, band levels. `--images` writes a spectrogram and a waveform. `--pattern` reports how the level moves inside each phase.

## Limits

- `clicks` finds sharp steps. It was checked by injecting faults into a real clip: steps of -40 and -50 dBFS were found 12 of 12 times, -60 dBFS 11 of 12, -70 dBFS 7 of 12. A tick behind a lowpass is band-limited and is not found.
- Loudness is measured, not heard. No number here says whether a sound is pleasant.
- The clips come from headless Chromium. Safari, Firefox and phones are not covered.
