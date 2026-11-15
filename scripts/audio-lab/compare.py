#!/usr/bin/env python3
"""Audio lab compare. Draws the spectrograms of clips one above the other.

Usage:
  python3 scripts/audio-lab/compare.py --out sheet.png [--from 11 --to 33] [--title text] \
      "label one=clip-one.wav" "label two=clip-two.wav" [...]

Every panel has the same time axis, the same log frequency axis (60 Hz to
8 kHz) and the same colour scale (-100 to -20 dBFS), so two versions of a
sound can be compared by eye. The dashed line marks 2 kHz.

Needs ffmpeg, numpy and matplotlib.
"""
import subprocess
import sys
from pathlib import Path

import numpy as np

SIZE, HOP = 4096, 512


def decode(path: Path) -> tuple[np.ndarray, int]:
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries",
         "stream=sample_rate", "-of", "default=nw=1:nk=1", str(path)],
        check=True, capture_output=True, text=True)
    rate = int(probe.stdout.strip())
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-"],
        check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype="<f4").astype(np.float64), rate


def main() -> None:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    args = sys.argv[1:]
    options = {"--out": None, "--from": "0", "--to": None, "--title": ""}
    while args[:1] and args[0] in options:
        options[args[0]] = args[1]
        args = args[2:]
    if not options["--out"] or not args:
        raise SystemExit(__doc__)
    start = float(options["--from"])

    figure, axes = plt.subplots(len(args), 1, figsize=(13, 3.1 * len(args)), squeeze=False, sharex=True)
    mesh = None
    for axis, item in zip(axes[:, 0], args):
        label, _, name = item.rpartition("=")
        mono, rate = decode(Path(name))
        end = float(options["--to"]) if options["--to"] else len(mono) / rate
        mono = mono[int(start * rate):int(end * rate)]
        window = np.hanning(SIZE)
        frames = np.lib.stride_tricks.sliding_window_view(mono, SIZE)[::HOP]
        # Scaled so that a full-scale sine reads 0 dBFS.
        power = (np.abs(np.fft.rfft(frames * window, axis=1)) * 2 / window.sum()) ** 2
        freqs = np.fft.rfftfreq(SIZE, 1 / rate)
        keep = (freqs >= 60) & (freqs <= 8000)
        times = start + (np.arange(len(frames)) * HOP + SIZE / 2) / rate
        mesh = axis.pcolormesh(times, freqs[keep], 10 * np.log10(np.maximum(power[:, keep].T, 1e-12)),
                               vmin=-100, vmax=-20, cmap="magma", shading="auto", rasterized=True)
        axis.set_yscale("log")
        axis.set_yticks([100, 200, 500, 1000, 2000, 5000])
        axis.set_yticklabels(["100", "200", "500", "1k", "2k", "5k"])
        axis.axhline(2000, color="white", linewidth=0.6, linestyle="--", alpha=0.6)
        axis.set_ylabel("Hz")
        axis.set_title(label, fontsize=10, loc="left")
    axes[-1, 0].set_xlabel("Seconds from the Start Session click")
    if options["--title"]:
        figure.suptitle(options["--title"], fontsize=12)
    figure.tight_layout()
    figure.colorbar(mesh, ax=axes[:, 0].tolist(), label="dBFS", pad=0.01, fraction=0.025)
    figure.savefig(options["--out"], dpi=110)


if __name__ == "__main__":
    main()
