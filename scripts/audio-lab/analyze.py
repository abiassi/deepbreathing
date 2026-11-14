#!/usr/bin/env python3
"""Audio lab analysis. Measures clips recorded by capture.sh.

Usage: python3 scripts/audio-lab/analyze.py [--images <dir>] [--pattern <p>] <clip.wav> [...]

Reports per clip: sample and true peak, integrated loudness (EBU R128),
loudness range, RMS, clipped samples, steps ("clicks"), dropouts, band
levels, DC offset and stereo correlation.

Limit: "clicks" finds sharp steps in the waveform. A tick that sits behind a
lowpass is band-limited and is not found. A detector for those was tried and
removed: it flagged ordinary drone beating and missed injected ticks. Listen
for them. With --images it also writes a
waveform and a spectrogram PNG per clip.

With --pattern (for example "inhale:5.5,exhale:5.5") it also reports how the
sound moves inside each phase: the change in level and in spectral centroid
from the first third to the last third of the phase, in the 250 Hz to 4 kHz
band a phone speaker reproduces. A phase that reads near 0 dB and 0 Hz gives
a listener nothing to follow. The clip must start at the first inhale.

Needs ffmpeg and numpy.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np

BANDS = [(20, 120), (120, 500), (500, 2000), (2000, 6000), (6000, 20000)]


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


def loudness(path: Path) -> dict:
    out = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", str(path),
         "-af", "ebur128=peak=true", "-f", "null", "-"],
        capture_output=True, text=True).stderr
    summary = out[out.rfind("Summary:"):]

    def grab(label: str) -> float:
        match = re.search(label + r":\s+(-?[\d.]+|-inf)", summary)
        return float(match.group(1)) if match else float("nan")

    return {"lufs": grab("I"), "lra": grab("LRA"), "true_peak_db": grab("Peak")}


def band_levels(mono: np.ndarray, rate: int) -> dict:
    spectrum = np.abs(np.fft.rfft(mono * np.hanning(len(mono)))) ** 2
    freqs = np.fft.rfftfreq(len(mono), 1 / rate)
    # Scale so that a band holding the whole signal reads as its RMS level.
    scale = 2 / (np.sum(np.hanning(len(mono)) ** 2) * len(mono))
    return {
        f"{low}-{high}Hz": round(db(np.sqrt(np.sum(spectrum[(freqs >= low) & (freqs < high)]) * scale)), 1)
        for low, high in BANDS
    }


def click_candidates(mono: np.ndarray, rate: int) -> list[dict]:
    """Discontinuities: a step or a spike in the waveform.

    The fourth difference is a steep high-pass. The engine's tone, air and
    chimes sit below 4 kHz, so they almost vanish in it, while a step of
    height h leaves a spike of about 3h. A sample is a candidate when its
    fourth difference is 12 times the local robust spread (50 ms either
    side) and above 4e-4, which is a step of about -78 dBFS.

    Verified by injection on a real clip: steps of -40, -50 and -60 dBFS, a
    one-sample spike and a 30 % gain jump are all found; the clean clip
    gives none.
    """
    fourth = np.abs(np.diff(mono, n=4))
    if len(fourth) < rate // 4:
        return []
    span = int(0.05 * rate)
    block = 256
    usable = len(fourth) // block * block
    medians = np.median(fourth[:usable].reshape(-1, block), axis=1)
    reach = max(1, span // block)
    padded = np.pad(medians, reach, mode="edge")
    local = np.median(np.lib.stride_tricks.sliding_window_view(padded, 2 * reach + 1), axis=1)
    spread = np.repeat(local, block) * 1.4826 + 1e-9
    excess = fourth[:usable] / spread
    hits = np.flatnonzero((excess > 12) & (fourth[:usable] > 4e-4))
    found: list[dict] = []
    last = -1.0
    for index in hits:
        seconds = (index + 2) / rate
        if seconds - last > 0.02:
            found.append({"t": round(float(seconds), 3),
                          "step_db": round(db(float(fourth[index]) / 3), 1),
                          "over_local": round(float(excess[index]))})
        last = seconds
    return found


def dropouts(mono: np.ndarray, rate: int) -> list[float]:
    """Runs of exact digital silence inside the clip (a capture underrun)."""
    zero = np.abs(mono) == 0
    edges = np.flatnonzero(np.diff(np.concatenate(([0], zero.view(np.int8), [0]))))
    starts, ends = edges[::2], edges[1::2]
    active = np.flatnonzero(~zero)
    if len(active) == 0:
        return []
    first, final = active[0], active[-1]
    return [round(start / rate, 3) for start, end in zip(starts, ends)
            if end - start >= 64 and start > first and end < final]


def phase_motion(mono: np.ndarray, rate: int, pattern: list[tuple[str, float]], skip_seconds: float = 0.45) -> dict:
    """Level and centroid change inside each phase, averaged over whole cycles.

    The first `skip_seconds` of a phase are left out, so a boundary cue (the
    legacy blip, the guide's chime) does not count as motion inside the phase.
    """
    size, hop = 4096, 1024
    count = (len(mono) - size) // hop
    frames = np.lib.stride_tricks.sliding_window_view(mono, size)[::hop][:count]
    spectrum = np.abs(np.fft.rfft(frames * np.hanning(size), axis=1)) ** 2
    freqs = np.fft.rfftfreq(size, 1 / rate)
    band = (freqs >= 250) & (freqs < 4000)
    energy = spectrum[:, band].sum(axis=1)
    level = 10 * np.log10(np.maximum(energy, 1e-20))
    centroid = (spectrum[:, band] * freqs[band]).sum(axis=1) / np.maximum(energy, 1e-20)
    times = (np.arange(count) * hop + size / 2) / rate

    # Whole cycles only, and only while the session is still sounding.
    active = np.flatnonzero(np.abs(mono) > 0)
    end = active[-1] / rate - 3.0 if len(active) else 0
    cycle = sum(seconds for _, seconds in pattern)
    motion: dict[str, list[tuple[float, float]]] = {}
    start = cycle  # skip the first cycle: every layer is still fading in
    while start + cycle <= end:
        offset = start
        for name, seconds in pattern:
            usable = seconds - skip_seconds
            third = usable / 3
            head = (times >= offset + skip_seconds) & (times < offset + skip_seconds + third)
            tail = (times >= offset + seconds - third) & (times < offset + seconds)
            if seconds > 0 and third > 0.1 and head.any() and tail.any():
                motion.setdefault(name, []).append(
                    (float(level[tail].mean() - level[head].mean()),
                     float(centroid[tail].mean() - centroid[head].mean())))
            offset += seconds
        start += cycle
    return {
        name: {"level_change_db": round(float(np.mean([m[0] for m in moves])), 1),
               "centroid_change_hz": round(float(np.mean([m[1] for m in moves]))),
               "cycles": len(moves)}
        for name, moves in motion.items()
    }


def parse_pattern(text: str) -> list[tuple[str, float]]:
    return [(name, float(seconds)) for name, seconds in (part.split(":") for part in text.split(","))]


def analyze(path: Path, pattern: list[tuple[str, float]] | None = None) -> dict:
    samples, rate = decode(path)
    mono = samples.mean(axis=1)
    peak = np.abs(samples).max(axis=0)
    left, right = samples[:, 0], samples[:, 1]
    denominator = np.sqrt(np.sum(left ** 2) * np.sum(right ** 2))
    result = {
        "file": path.name,
        "seconds": round(len(samples) / rate, 2),
        "sample_rate": rate,
        "sample_peak_db": [round(db(peak[0]), 1), round(db(peak[1]), 1)],
        "rms_db": round(db(np.sqrt(np.mean(samples ** 2))), 1),
        "clipped_samples": int(np.sum(np.abs(samples) >= 0.999)),
        "dc_offset": round(float(np.abs(samples.mean(axis=0)).max()), 6),
        "stereo_correlation": round(float(np.sum(left * right) / denominator), 3) if denominator else 0.0,
        "bands_db": band_levels(mono, rate),
        "clicks": click_candidates(mono, rate),
        "dropouts_at": dropouts(mono, rate),
    }
    result.update(loudness(path))
    if pattern:
        result["phase_motion"] = phase_motion(mono, rate, pattern)
    return result


def images(path: Path, directory: Path) -> None:
    directory.mkdir(parents=True, exist_ok=True)
    stem = directory / path.stem
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(path), "-lavfi",
         "showspectrumpic=s=1400x520:legend=1:scale=log:fscale=log:start=40:stop=12000:drange=100",
         f"{stem}.spectrogram.png"], check=True)
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(path), "-lavfi",
         "aformat=channel_layouts=mono,showwavespic=s=1400x260:colors=0x2563eb:scale=lin",
         f"{stem}.waveform.png"], check=True)


def main() -> None:
    args = sys.argv[1:]
    image_dir = None
    pattern = None
    while args[:1] and args[0] in ("--images", "--pattern"):
        if args[0] == "--images":
            image_dir = Path(args[1])
        else:
            pattern = parse_pattern(args[1])
        args = args[2:]
    for name in args:
        path = Path(name)
        print(json.dumps(analyze(path, pattern)))
        if image_dir:
            images(path, image_dir)


if __name__ == "__main__":
    main()
