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

## Record one layer alone (a stem)

Add `&labsolo=<stem>` to the target. `stems.init.js` names every sound source from the engine function that created it and leaves every other source unconnected. The master chain stays the real one.

```sh
scripts/audio-lab/capture.sh coherent-tone '/breathe/coherent?duration=24&sound=guide&bed=0&labsolo=tone' 31
```

Stems: `tone`, `air`, `marker`, `chord` (the closing chord), `noisebed`, `drone`, `sub`, `binaural`, `envelope`, `cue`. Several stems can be joined with commas. The capture prints how many sources each stem had and how many were muted; a stem with no sources is an empty recording, not a quiet layer. The bed stems need the bed, so leave `&bed=0` out for them.

## Find a whine, a sweep or a beat

```sh
python3 scripts/audio-lab/whine.py --stop 22.3 /tmp/audio-lab/coherent-tone.wav
```

Per phase, in thirds: level, spectral centroid, the strongest narrow peak and how far it stands over its surroundings, and `whine_db`, the A-weighted level of narrow peaks above 400 Hz. Per clip: the level above 1 and 2 kHz, and the strongest amplitude beat between 3 and 40 Hz. `--stop` ends the reading before the session end, so the closing chord is left out.

## Read the shape of a phase

```sh
python3 scripts/audio-lab/contours.py --mode coherent --plot /tmp/audio-lab/contours.png /tmp/audio-lab/coherent-proposed.wav
```

Pitch, level, brightness and stereo width at 12 points of each phase, and `mirror`: the correlation between the inhale contour and the exhale contour. -1 means the two phases are opposite shapes.

## Compare two versions by eye

```sh
python3 scripts/audio-lab/compare.py --out /tmp/audio-lab/sheet.png "before=/tmp/audio-lab/a.wav" "after=/tmp/audio-lab/b.wav"
```

One spectrogram per clip, on the same time, frequency and colour scale.

`--plot` and `compare.py` need matplotlib.

## Limits

- `clicks` finds sharp steps. It was checked by injecting faults into a real clip: steps of -40 and -50 dBFS were found 12 of 12 times, -60 dBFS 11 of 12, -70 dBFS 7 of 12. A tick behind a lowpass is band-limited and is not found.
- Loudness is measured, not heard. No number here says whether a sound is pleasant.
- `whine_db` follows a thin tone that swells. It was built after a listener heard a mosquito in the first sound guide, and it reads 7 dB lower on the version that replaced it. It has not been checked against a second listener.
- `width_db` in `contours.py` reads the whole mix. In the drone modes the drone orbits the listener and sets the width; the guide's own width is only visible with `&bed=0`.
- The clips come from headless Chromium. Safari, Firefox and phones are not covered.
