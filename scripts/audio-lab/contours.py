#!/usr/bin/env python3
"""Audio lab contours. Measures how the sound moves inside each breath phase.

Usage:
  python3 scripts/audio-lab/contours.py --mode coherent [--plot out.png] [--label name] <clip.wav> [...]
  python3 scripts/audio-lab/contours.py --pattern inhale:5.5,exhale:5.5 <clip.wav>

--mode takes box, 478, coherent, sigh, ujjayi, belly or pursed-lip and uses
that mode's phase lengths at the default speed.

For each clip and each phase of the pattern it reports four contours, averaged
over whole cycles and sampled at 12 points of phase progress:

  pitch_hz     strongest spectral peak between 200 and 1100 Hz (the guide's tone)
  level_db     level between 250 Hz and 4 kHz
  centroid_hz  spectral centroid between 200 Hz and 6 kHz (brightness)
  width_db     side level minus mid level between 250 Hz and 4 kHz (stereo width)

and a summary per phase:

  change       last quarter minus first quarter of the phase
  peak_at      phase progress (0..1) where the level is highest
  steady       largest swing of the level inside the phase, in dB

For every pair of an inhale and the exhale it also reports `mirror`: the
correlation between the inhale contour and the exhale contour. -1 means the
exhale is the opposite shape of the inhale. +1 means both phases move the same
way, which a listener cannot tell apart.

The clip must start at the Start Session click. The first sound is taken as
the first inhale. Phase timing follows the pattern from there; the page drifts
by up to a frame per phase, so the first cycle is skipped and at most six
cycles are read.

Needs ffmpeg and numpy. --plot also needs matplotlib.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

POINTS = 12
SIZE, HOP = 8192, 1024
FEATURES = ("pitch_hz", "level_db", "centroid_hz", "width_db")
INHALES = ("inhale", "inhaleTopUp")
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


def frames_of(signal: np.ndarray) -> np.ndarray:
    count = (len(signal) - SIZE) // HOP
    return np.lib.stride_tricks.sliding_window_view(signal, SIZE)[::HOP][:count]


def features(samples: np.ndarray, rate: int) -> dict:
    window = np.hanning(SIZE)
    mid = samples.mean(axis=1)
    side = (samples[:, 0] - samples[:, 1]) / 2
    freqs = np.fft.rfftfreq(SIZE, 1 / rate)
    mid_power = np.abs(np.fft.rfft(frames_of(mid) * window, axis=1)) ** 2
    side_power = np.abs(np.fft.rfft(frames_of(side) * window, axis=1)) ** 2
    times = (np.arange(len(mid_power)) * HOP + SIZE / 2) / rate

    body = (freqs >= 250) & (freqs < 4000)
    scale = 2 / (np.sum(window ** 2) * SIZE)
    mid_energy = mid_power[:, body].sum(axis=1) * scale
    side_energy = side_power[:, body].sum(axis=1) * scale
    level = 10 * np.log10(np.maximum(mid_energy + side_energy, 1e-20))
    width = 10 * np.log10(np.maximum(side_energy, 1e-20) / np.maximum(mid_energy, 1e-20))

    bright = (freqs >= 200) & (freqs < 6000)
    total = mid_power + side_power
    centroid = (total[:, bright] * freqs[bright]).sum(axis=1) / np.maximum(total[:, bright].sum(axis=1), 1e-20)

    tone = np.flatnonzero((freqs >= 200) & (freqs < 1100))
    peak = tone[0] + np.argmax(mid_power[:, tone], axis=1)
    peak = np.clip(peak, 1, len(freqs) - 2)
    rows = np.arange(len(mid_power))
    # Parabolic interpolation on the log spectrum: sub-bin pitch.
    low, centre, high = (np.log(np.maximum(mid_power[rows, peak + step], 1e-30)) for step in (-1, 0, 1))
    shift = 0.5 * (low - high) / np.minimum(low - 2 * centre + high, -1e-12)
    pitch = (peak + np.clip(shift, -0.5, 0.5)) * rate / SIZE

    return {"times": times, "pitch_hz": pitch, "level_db": level, "centroid_hz": centroid, "width_db": width}


def first_sound(samples: np.ndarray, rate: int) -> float:
    """Seconds to the first 10 ms block above -66 dBFS: the first inhale."""
    block = rate // 100
    mono = samples.mean(axis=1)
    usable = len(mono) // block * block
    rms = np.sqrt(np.mean(mono[:usable].reshape(-1, block) ** 2, axis=1))
    loud = np.flatnonzero(rms > 10 ** (-66 / 20))
    return float(loud[0] * block / rate) if len(loud) else 0.0


def last_sound(samples: np.ndarray, rate: int) -> float:
    active = np.flatnonzero(np.abs(samples).max(axis=1) > 10 ** (-66 / 20))
    return float(active[-1] / rate) if len(active) else 0.0


def contours(samples: np.ndarray, rate: int, pattern: list[tuple[str, float]], end: float | None) -> dict:
    measured = features(samples, rate)
    times = measured["times"]
    start = first_sound(samples, rate)
    cycle = sum(seconds for _, seconds in pattern)
    # The closing chord and fade follow the session end; leave them out.
    stop = end if end is not None else last_sound(samples, rate) - 5.0
    progress = (np.arange(POINTS) + 0.5) / POINTS

    collected: dict[str, dict[str, list[np.ndarray]]] = {}
    offset = start + cycle  # the first cycle fades in
    cycles = 0
    while offset + cycle <= stop and cycles < 6:
        at = offset
        for name, seconds in pattern:
            if seconds > 0:
                for feature in FEATURES:
                    # Each point is the mean of the frames whose centre falls in its slice.
                    values = []
                    for index in range(POINTS):
                        inside = (times >= at + seconds * index / POINTS) & (times < at + seconds * (index + 1) / POINTS)
                        if not inside.any():
                            inside = np.zeros(len(times), dtype=bool)
                            inside[np.argmin(np.abs(times - (at + seconds * progress[index])))] = True
                        values.append(measured[feature][inside].mean())
                    collected.setdefault(name, {}).setdefault(feature, []).append(np.array(values))
            at += seconds
        offset += cycle
        cycles += 1

    phases = {}
    for name, by_feature in collected.items():
        entry: dict = {"cycles": len(by_feature["level_db"])}
        for feature in FEATURES:
            mean = np.mean(by_feature[feature], axis=0)
            quarter = POINTS // 4
            entry[feature] = {
                "contour": [round(float(v), 1) for v in mean],
                "change": round(float(mean[-quarter:].mean() - mean[:quarter].mean()), 1),
            }
        level = np.array(entry["level_db"]["contour"])
        entry["peak_at"] = round(float(progress[int(np.argmax(level))]), 2)
        entry["steady"] = round(float(level.max() - level.min()), 1)
        pitch = np.array(entry["pitch_hz"]["contour"])
        entry["pitch_change_semitones"] = round(float(12 * np.log2(pitch[-3:].mean() / pitch[:3].mean())), 1)
        phases[name] = entry

    mirror = {}
    if "exhale" in phases:
        for inhale in INHALES:
            if inhale not in phases:
                continue
            mirror[inhale] = {}
            for feature in FEATURES:
                a = np.array(phases[inhale][feature]["contour"])
                b = np.array(phases["exhale"][feature]["contour"])
                spread = a.std() * b.std()
                mirror[inhale][feature] = round(float(np.mean((a - a.mean()) * (b - b.mean())) / spread), 2) if spread > 1e-9 else 0.0
    return {"first_sound_s": round(start, 3), "phases": phases, "mirror_inhale_vs_exhale": mirror}


def plot(results: list[tuple[str, list[tuple[str, float]], dict]], target: Path) -> None:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    titles = {"pitch_hz": "Pitch (Hz)", "level_db": "Level, 250 Hz to 4 kHz (dB)",
              "centroid_hz": "Brightness: centroid (Hz)", "width_db": "Stereo width: side minus mid (dB)"}
    colours = {"inhale": "#2563eb", "inhaleTopUp": "#7c3aed", "holdIn": "#6b7280", "exhale": "#dc2626", "holdOut": "#9ca3af"}
    figure, axes = plt.subplots(len(FEATURES), len(results), figsize=(5.2 * len(results), 2.6 * len(FEATURES)),
                                squeeze=False, sharey="row")
    for column, (label, pattern, result) in enumerate(results):
        for row, feature in enumerate(FEATURES):
            axis = axes[row][column]
            at = 0.0
            for name, seconds in pattern:
                phase = result["phases"].get(name)
                if seconds > 0 and phase:
                    x = at + seconds * (np.arange(POINTS) + 0.5) / POINTS
                    axis.plot(x, phase[feature]["contour"], color=colours.get(name, "#111827"), linewidth=2.2,
                              label=name if row == 0 else None)
                    axis.axvline(at, color="#d1d5db", linewidth=0.8)
                at += seconds
            if feature == "pitch_hz":
                axis.set_yscale("log")
            axis.grid(alpha=0.25)
            if column == 0:
                axis.set_ylabel(titles[feature], fontsize=8)
            if row == 0:
                axis.set_title(label, fontsize=10)
                if axis.get_legend_handles_labels()[0]:
                    axis.legend(fontsize=7, loc="best")
            if row == len(FEATURES) - 1:
                axis.set_xlabel("Seconds into one breath cycle", fontsize=8)
    figure.tight_layout()
    figure.savefig(target, dpi=110)


def main() -> None:
    args = sys.argv[1:]
    pattern = None
    plot_path = None
    labels: list[str] = []
    end = None
    while args[:1] and args[0].startswith("--"):
        flag, value = args[0], args[1]
        if flag == "--mode":
            value = MODES[value]
        if flag in ("--pattern", "--mode"):
            pattern = [(name, float(seconds)) for name, seconds in (part.split(":") for part in value.split(","))]
        elif flag == "--plot":
            plot_path = Path(value)
        elif flag == "--label":
            labels.append(value)
        elif flag == "--end":
            end = float(value)
        else:
            raise SystemExit(f"unknown flag {flag}")
        args = args[2:]
    if not pattern or not args:
        raise SystemExit(__doc__)
    results = []
    for index, name in enumerate(args):
        path = Path(name)
        samples, rate = decode(path)
        result = contours(samples, rate, pattern, end)
        label = labels[index] if index < len(labels) else path.stem
        print(json.dumps({"file": path.name, "label": label, **result}))
        results.append((label, pattern, result))
    if plot_path:
        plot(results, plot_path)


if __name__ == "__main__":
    main()
