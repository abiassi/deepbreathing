#!/usr/bin/env python3
"""Audio lab whine check. Looks for a thin, rising, buzzing sound in a clip.

Usage:
  python3 scripts/audio-lab/whine.py [--pattern inhale:5.5,exhale:5.5] [--start 0.1] <clip.wav> [...]

Made for stems recorded with `&labsolo=<stem>` (see stems.init.js), so each
layer of the engine can be judged alone. One JSON line per clip.

Whole clip:
  level_db            RMS level of the mono sum
  a_weighted_db       the same after A-weighting: roughly how loud it is to an ear
  above_2k_db         level above 2 kHz
  above_1k_db         level above 1 kHz
  beat                strongest amplitude modulation between 3 and 40 Hz of the
                      200 Hz to 3 kHz band: its rate in Hz and its depth as a
                      share of the mean level. A depth above about 0.15 is heard
                      as a flutter or a buzz. Given for the mono sum and for the
                      left channel: a binaural pair beats only in the sum.

Per phase of the pattern, averaged over whole cycles after the first:
  level_db            level in thirds of the phase (start, middle, end)
  centroid_hz         spectral centroid, 100 Hz to 8 kHz, in thirds
  tone_hz             frequency of the strongest narrow peak above 250 Hz, in thirds
  tone_db             level of that peak, in thirds
  tone_over_floor_db  how far that peak stands over the median of the octave
                      around it. A pure tone reads above 30 dB, noise below 12 dB.
  whine_db            A-weighted level of narrow peaks above 400 Hz, in thirds.
                      This is the number that follows a mosquito sound: a thin
                      tone, high enough to be piercing, that swells.
  sweep_octaves       how far the centroid moves from the first third to the
                      last third, in octaves. A noise band that sweeps reads
                      here; a tone that only gets louder does not.

Needs ffmpeg and numpy.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

SIZE, HOP = 8192, 1024


def db(value: float) -> float:
    return float(20 * np.log10(max(value, 1e-10)))


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


def a_weight(freqs: np.ndarray) -> np.ndarray:
    """A-weighting as a linear gain per frequency (IEC 61672)."""
    f2 = np.maximum(freqs, 1e-6) ** 2
    gain = (12194 ** 2 * f2 ** 2) / ((f2 + 20.6 ** 2) * np.sqrt((f2 + 107.7 ** 2) * (f2 + 737.9 ** 2)) * (f2 + 12194 ** 2))
    return gain * 10 ** (2.0 / 20)


def whole_clip(mono: np.ndarray, rate: int) -> dict:
    window = np.hanning(len(mono))
    spectrum = np.abs(np.fft.rfft(mono * window)) ** 2
    freqs = np.fft.rfftfreq(len(mono), 1 / rate)
    scale = 2 / (np.sum(window ** 2) * len(mono))

    def level(mask: np.ndarray, weight: np.ndarray | None = None) -> float:
        power = spectrum[mask] * (weight[mask] ** 2 if weight is not None else 1)
        return round(db(np.sqrt(np.sum(power) * scale)), 1)

    everything = freqs >= 20
    return {
        "level_db": level(everything),
        "a_weighted_db": level(everything, a_weight(freqs)),
        "above_1k_db": level(freqs >= 1000),
        "above_2k_db": level(freqs >= 2000),
    }


def beat(signal: np.ndarray, rate: int) -> dict:
    """Strongest amplitude modulation, 3 to 40 Hz, of the 200 Hz to 3 kHz band."""
    spectrum = np.fft.fft(signal)
    freqs = np.fft.fftfreq(len(signal), 1 / rate)
    # Analytic signal of the band: keep positive frequencies inside it, doubled.
    spectrum[~((freqs >= 200) & (freqs <= 3000))] = 0
    envelope = np.abs(np.fft.ifft(spectrum * 2))
    step = rate // 400
    usable = len(envelope) // step * step
    slow = envelope[:usable].reshape(-1, step).mean(axis=1)
    mean = slow.mean()
    if mean < 1e-7:
        return {"hz": 0.0, "depth": 0.0}
    # Two-second windows: a beat that keeps its rate adds up, a slow swell does not.
    span = 800
    count = len(slow) // span
    if count == 0:
        return {"hz": 0.0, "depth": 0.0}
    blocks = slow[:count * span].reshape(count, span)
    window = np.hanning(span)
    modulation = np.abs(np.fft.rfft((blocks - blocks.mean(axis=1, keepdims=True)) * window, axis=1)) * 2 / window.sum()
    depth = modulation / np.maximum(blocks.mean(axis=1, keepdims=True), 1e-9)
    # Weight each window by its level, so silence between phases does not count.
    weights = blocks.mean(axis=1) / blocks.mean(axis=1).sum()
    average = (depth * weights[:, None]).sum(axis=0)
    rates = np.fft.rfftfreq(span, 1 / 400)
    band = (rates >= 3) & (rates <= 40)
    best = np.flatnonzero(band)[np.argmax(average[band])]
    return {"hz": round(float(rates[best]), 1), "depth": round(float(average[best]), 3)}


def frames(mono: np.ndarray, rate: int) -> dict:
    count = (len(mono) - SIZE) // HOP
    window = np.hanning(SIZE)
    blocks = np.lib.stride_tricks.sliding_window_view(mono, SIZE)[::HOP][:count]
    power = np.abs(np.fft.rfft(blocks * window, axis=1)) ** 2 * (2 / (np.sum(window ** 2) * SIZE))
    freqs = np.fft.rfftfreq(SIZE, 1 / rate)
    times = (np.arange(count) * HOP + SIZE / 2) / rate

    level = 10 * np.log10(np.maximum(power[:, freqs >= 20].sum(axis=1), 1e-20))
    body = (freqs >= 100) & (freqs < 8000)
    centroid = (power[:, body] * freqs[body]).sum(axis=1) / np.maximum(power[:, body].sum(axis=1), 1e-20)

    # Strongest narrow peak above 250 Hz, and how far it stands over the octave around it.
    upper = np.flatnonzero((freqs >= 250) & (freqs < 6000))
    peak = upper[0] + np.argmax(power[:, upper], axis=1)
    rows = np.arange(count)
    # A Hann window spreads a sine over three bins.
    tone_power = power[rows, peak - 1] + power[rows, peak] + power[rows, peak + 1]
    floor = np.empty(count)
    for row in rows:
        low, high = int(peak[row] / 1.41), int(peak[row] * 1.41)
        floor[row] = np.median(power[row, low:high + 1]) * 3
    tone_db = 10 * np.log10(np.maximum(tone_power, 1e-20))
    over_floor = 10 * np.log10(np.maximum(tone_power, 1e-20) / np.maximum(floor, 1e-20))

    # Whine: A-weighted power of bins that stand 20 dB over their local median, above 400 Hz.
    weight = a_weight(freqs) ** 2
    high = np.flatnonzero((freqs >= 400) & (freqs < 8000))
    reach = 24
    padded = np.pad(power[:, high], ((0, 0), (reach, reach)), mode="edge")
    local = np.median(np.lib.stride_tricks.sliding_window_view(padded, 2 * reach + 1, axis=1), axis=2)
    narrow = power[:, high] > local * 100
    whine = 10 * np.log10(np.maximum((power[:, high] * weight[high] * narrow).sum(axis=1), 1e-20))

    return {"times": times, "level_db": level, "centroid_hz": centroid, "tone_hz": freqs[peak],
            "tone_db": tone_db, "tone_over_floor_db": over_floor, "whine_db": whine}


def by_phase(measured: dict, pattern: list[tuple[str, float]], start: float, stop: float) -> dict:
    times = measured["times"]
    cycle = sum(seconds for _, seconds in pattern)
    collected: dict[str, dict[str, list[list[float]]]] = {}
    offset = start + cycle  # the first cycle fades in
    while offset + cycle <= stop:
        at = offset
        for name, seconds in pattern:
            for key in ("level_db", "centroid_hz", "tone_hz", "tone_db", "tone_over_floor_db", "whine_db"):
                thirds = []
                for index in range(3):
                    inside = (times >= at + seconds * index / 3) & (times < at + seconds * (index + 1) / 3)
                    # Level-like values are averaged as power, so a quiet frame does not drag the mean.
                    values = measured[key][inside]
                    if key.endswith("_db"):
                        thirds.append(float(10 * np.log10(np.mean(10 ** (values / 10)))) if len(values) else float("nan"))
                    else:
                        thirds.append(float(np.median(values)) if len(values) else float("nan"))
                collected.setdefault(name, {}).setdefault(key, []).append(thirds)
            at += seconds
        offset += cycle
    result = {}
    for name, keys in collected.items():
        entry = {"cycles": len(keys["level_db"])}
        for key, runs in keys.items():
            entry[key] = [round(float(v), 1) for v in np.mean(runs, axis=0)]
        first, last = entry["centroid_hz"][0], entry["centroid_hz"][2]
        entry["sweep_octaves"] = round(float(np.log2(max(last, 1) / max(first, 1))), 2)
        result[name] = entry
    return result


def main() -> None:
    args = sys.argv[1:]
    pattern = [("inhale", 5.5), ("exhale", 5.5)]
    start = 0.1
    stop = None
    while args[:1] and args[0].startswith("--"):
        flag, value = args[0], args[1]
        if flag == "--pattern":
            pattern = [(name, float(seconds)) for name, seconds in (part.split(":") for part in value.split(","))]
        elif flag == "--start":
            start = float(value)
        elif flag == "--stop":
            stop = float(value)
        else:
            raise SystemExit(f"unknown flag {flag}")
        args = args[2:]
    if not args:
        raise SystemExit(__doc__)
    for name in args:
        path = Path(name)
        samples, rate = decode(path)
        mono = samples.mean(axis=1)
        end = stop if stop is not None else len(mono) / rate
        result = {"file": path.name, **whole_clip(mono[:int(end * rate)], rate)}
        result["beat"] = {"mono": beat(mono[:int(end * rate)], rate), "left": beat(samples[:int(end * rate), 0], rate)}
        result["phases"] = by_phase(frames(mono, rate), pattern, start, end)
        print(json.dumps(result))


if __name__ == "__main__":
    main()
