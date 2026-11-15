#!/usr/bin/env python3
"""Audio lab cue prominence. How far each phase marker stands over the voice and the bed.

Usage:
  python3 scripts/audio-lab/cues.py --mode box --marker <marker.wav> --voice <tone.wav> --bed <bed.wav>
  python3 scripts/audio-lab/cues.py --pattern inhale:5.5,exhale:5.5 --marker ... --voice ... --bed ...

The three clips are stems of the same session, recorded with `&labsolo=`:
the markers alone, the voice alone (`tone`, plus `air` in Ujjayi) and the bed
alone. Every clip starts at the Start Session click, so the three line up.

For each marker it reads a window of 0.35 s from the marker's onset: both
notes of a pair, or the loud part of a bell. In that window it reports the
A-weighted level of the marker, of the voice and of the bed, and the two
differences. A-weighting stands in for the ear: a 262 Hz note reads 8.6 dB
lower than its plain level and a 700 Hz note 0.8 dB lower.

Output: one JSON object with every marker, the mean per phase kind, and the
mean over all markers of the session.

Limits: each stem passes the master compressor alone, so a stem is not
compressed as it is in the full mix. The differences compare modes and
versions; they are not the level of a marker inside the mix. `--stop` ends
the reading before the session end (default: 1.5 s before the last sound of
the voice stem).

Needs ffmpeg and numpy.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

WINDOW_SECONDS = 0.35
# Phase lengths at the default speed (src/components/resonance/constants.ts).
MODES = {
    "box": "inhale:4,holdIn:4,exhale:4,holdOut:4",
    "478": "inhale:4,holdIn:7,exhale:8",
    "coherent": "inhale:5.5,exhale:5.5",
    "sigh": "inhale:2.5,inhaleTopUp:1.5,exhale:6,holdOut:1",
    "ujjayi": "inhale:4,exhale:6",
    "belly": "inhale:4,exhale:6",
    "pursed-lip": "inhale:2,exhale:4",
}


def decode(path: Path) -> tuple[np.ndarray, int]:
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries",
         "stream=sample_rate", "-of", "default=nw=1:nk=1", str(path)],
        check=True, capture_output=True, text=True)
    rate = int(probe.stdout.strip())
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "2", "-"],
        check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype="<f4").reshape(-1, 2).astype(np.float64), rate


def db(power: float) -> float:
    return float(10 * np.log10(max(power, 1e-20)))


def a_weight(freqs: np.ndarray) -> np.ndarray:
    """Power gain of the A curve (IEC 61672), 0 dB at 1 kHz."""
    f2 = np.maximum(freqs, 1e-6) ** 2
    gain = (12194.0 ** 2 * f2 ** 2) / (
        (f2 + 20.6 ** 2) * np.sqrt((f2 + 107.7 ** 2) * (f2 + 737.9 ** 2)) * (f2 + 12194.0 ** 2))
    return (gain * 10 ** (2.0 / 20)) ** 2


def window_levels(samples: np.ndarray, rate: int, start: float) -> dict:
    """Plain and A-weighted mean power of both channels in the window, and the strongest frequency."""
    first = max(0, int(start * rate))
    chunk = samples[first:first + int(WINDOW_SECONDS * rate)]
    if len(chunk) < 16:
        return {"plain": -200.0, "a": -200.0, "peak_hz": 0.0}
    freqs = np.fft.rfftfreq(len(chunk), 1 / rate)
    # Parseval: the sum over the one-sided spectrum is the mean power of the chunk.
    spectrum = sum(np.abs(np.fft.rfft(chunk[:, channel])) ** 2 for channel in (0, 1)) / 2
    spectrum = spectrum * 2 / len(chunk) ** 2
    return {
        "plain": db(float(np.sum(spectrum))),
        "a": db(float(np.sum(spectrum * a_weight(freqs)))),
        "peak_hz": float(freqs[int(np.argmax(spectrum))]),
    }


def envelope(samples: np.ndarray, rate: int) -> tuple[np.ndarray, float]:
    """RMS of both channels in 5 ms steps."""
    step = int(rate * 0.005)
    mono = np.mean(samples ** 2, axis=1)
    count = len(mono) // step
    return np.sqrt(mono[:count * step].reshape(count, step).mean(axis=1)), step / rate


def onset_near(env: np.ndarray, step: float, expected: float) -> float | None:
    """The steepest rise of the marker stem within 0.3 s of `expected`."""
    low = max(4, int((expected - 0.3) / step))
    high = min(len(env) - 4, int((expected + 0.3) / step))
    if high <= low:
        return None
    # Rise over 20 ms, measured in level so a marker over a ringing tail still shows.
    rise = np.array([env[i + 3] - env[i - 1] for i in range(low, high)])
    best = int(np.argmax(rise))
    if rise[best] <= 1e-5:
        return None
    return (low + best - 1) * step


def main() -> None:
    args = sys.argv[1:]
    options: dict[str, str] = {}
    while args:
        flag = args.pop(0)
        if not flag.startswith("--") or not args:
            sys.exit(__doc__)
        options[flag[2:]] = args.pop(0)
    spec = MODES.get(options.get("mode", ""), options.get("pattern"))
    if not spec or not all(name in options for name in ("marker", "voice", "bed")):
        sys.exit(__doc__)
    pattern = [(name, float(seconds)) for name, seconds in (part.split(":") for part in spec.split(","))]

    marker, rate = decode(Path(options["marker"]))
    voice, _ = decode(Path(options["voice"]))
    bed, _ = decode(Path(options["bed"]))
    env, step = envelope(marker, rate)
    loud = np.nonzero(env > 10 ** (-70 / 20))[0]
    if not len(loud):
        sys.exit("the marker stem is silent")
    voice_env, _ = envelope(voice, rate)
    voice_loud = np.nonzero(voice_env > 10 ** (-60 / 20))[0]
    stop = float(options["stop"]) if "stop" in options else (voice_loud[-1] * step - 1.5 if len(voice_loud) else len(env) * step)

    events = []
    expected = loud[0] * step
    index = 0
    while expected + WINDOW_SECONDS < stop:
        kind, seconds = pattern[index % len(pattern)]
        onset = onset_near(env, step, expected) if index else expected
        if onset is None:
            # No marker where the pattern expects one: the session has ended.
            break
        levels = {name: window_levels(stem, rate, onset) for name, stem in (("marker", marker), ("voice", voice), ("bed", bed))}
        events.append({
            "kind": kind,
            "at": round(onset, 3),
            "marker_hz": round(levels["marker"]["peak_hz"]),
            "marker_dba": round(levels["marker"]["a"], 1),
            "voice_dba": round(levels["voice"]["a"], 1),
            "bed_dba": round(levels["bed"]["a"], 1),
            "marker_db": round(levels["marker"]["plain"], 1),
            "over_voice_dba": round(levels["marker"]["a"] - levels["voice"]["a"], 1),
            "over_bed_dba": round(levels["marker"]["a"] - levels["bed"]["a"], 1),
            "over_voice_db": round(levels["marker"]["plain"] - levels["voice"]["plain"], 1),
        })
        # Follow the page: the next phase is timed from this onset.
        expected = onset + seconds
        index += 1

    def mean(rows: list[dict], key: str) -> float:
        return round(float(np.mean([row[key] for row in rows])), 1)

    keys = ("marker_dba", "voice_dba", "bed_dba", "over_voice_dba", "over_bed_dba", "over_voice_db")
    by_kind = {
        kind: {"count": len(rows), **{key: mean(rows, key) for key in keys}}
        for kind in dict.fromkeys(name for name, _ in pattern)
        if (rows := [event for event in events if event["kind"] == kind])
    }
    minutes = (events[-1]["at"] - events[0]["at"]) / 60 if len(events) > 1 else 0
    print(json.dumps({
        "marker": Path(options["marker"]).name,
        "markers": len(events),
        "markers_per_minute": round((len(events) - 1) / minutes, 1) if minutes else None,
        "all": {key: mean(events, key) for key in keys},
        "by_kind": by_kind,
        "events": events,
    }))


if __name__ == "__main__":
    main()
