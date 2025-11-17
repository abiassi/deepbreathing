"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AuroraBackground } from "@/components/magicui/aurora-background";

const PHASES = ["Inhale", "Hold", "Exhale", "Hold"] as const;
const clampSeconds = (value: number) => Math.max(3, Math.min(8, Math.round(value)));

export function BreathingVisualizer() {
  const [seconds, setSeconds] = useState(5);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(seconds);
  const [running, setRunning] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const countdownRef = useRef<ReturnType<typeof setInterval>>();
  const phaseDurationRef = useRef(seconds);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = undefined;
    }
  }, []);

  const startCountdown = useCallback((duration: number) => {
    phaseDurationRef.current = duration;
    setCountdown(duration);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : prev));
    }, 1000);
  }, []);

  const beginPhase = useCallback(
    (index: number, duration: number) => {
      setPhaseIndex(index);
      startCountdown(duration);
    },
    [startCountdown]
  );

  const scheduleCycle = useCallback(
    (duration: number) => {
      const stepMs = duration * 1000;
      PHASES.forEach((_, idx) => {
        const timer = setTimeout(() => beginPhase(idx, duration), idx * stepMs);
        timersRef.current.push(timer);
      });
      const loopTimer = setTimeout(() => {
        if (running) scheduleCycle(duration);
      }, PHASES.length * stepMs);
      timersRef.current.push(loopTimer);
    },
    [beginPhase, running]
  );

  const resetPhase = useCallback(() => {
    setPhaseIndex(0);
    setCountdown(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running) {
      clearTimers();
      resetPhase();
      return;
    }

    clearTimers();
    beginPhase(0, seconds);
    scheduleCycle(seconds);

    return () => clearTimers();
  }, [beginPhase, clearTimers, resetPhase, running, scheduleCycle, seconds]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setRunning((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const secondsPerBreath = useMemo(() => clampSeconds(seconds), [seconds]);
  const activePhase = PHASES[phaseIndex];
  const progress = useMemo(() => {
    const duration = phaseDurationRef.current || secondsPerBreath;
    return duration === 0 ? 0 : 1 - countdown / duration;
  }, [countdown, secondsPerBreath]);

  const orbScale = activePhase === "Inhale" ? 1 : activePhase === "Exhale" ? 0.65 : 0.82;
  const orbPrompt = running ? "Keep pace" : "Tap to start";

  const handleSliderChange = (value: number[]) => {
    const nextValue = clampSeconds(value[0] ?? seconds);
    setSeconds(nextValue);
  };

  const handleToggle = () => {
    setRunning((prev) => {
      if (prev) {
        resetPhase();
        return false;
      }
      return true;
    });
  };

  return (
    <AuroraBackground
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden px-6 pb-10 pt-16 text-white sm:px-12"
      backgroundClassName="bg-gradient-to-br from-[#ffb88a] via-[#ff9faa] to-[#f57fb5]"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-12">
        <div className="text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-white/80 font-bold drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
            {secondsPerBreath}s cadence
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight text-white drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)]" aria-live="polite">
            {orbPrompt}
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={running}
          aria-label="Toggle breathing cycle"
          className="group relative flex aspect-square w-full max-w-[26rem] items-center justify-center rounded-full bg-white/10 p-8 transition-transform duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
        >
          <div
            className="absolute inset-6 rounded-full border border-white/30"
            style={{
              background: `conic-gradient(var(--tw-gradient-stops))`,
              "--tw-gradient-stops": `${running ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"} ${Math.max(
                progress * 100,
                5
              )}%, rgba(255,255,255,0.025) ${Math.max(progress * 100, 5)}%`
            } as CSSProperties}
          />
          <div
            aria-hidden
            className="relative h-full w-full rounded-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(255,255,255,0.35)_65%,_rgba(255,255,255,0.08))] shadow-[0_35px_90px_rgba(255,255,255,0.35)] transition-transform duration-700 ease-in-out"
            style={{ transform: `scale(${orbScale})` }}
          />
          <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center text-white drop-shadow-[0_12px_35px_rgba(0,0,0,0.35)]" aria-live="polite">
            <span className="text-base uppercase tracking-[0.4em] text-white/85 font-bold">{activePhase}</span>
            <span className="mt-2 text-5xl font-black tabular-nums">{countdown}s</span>
          </span>
        </button>
      </div>
      <div className="flex justify-center pb-4 pt-40">
        <div className="w-[min(90vw,24rem)] rounded-3xl border border-white/40 dark:border-white/20 bg-white/85 dark:bg-card/90 p-5 text-center text-foreground shadow-[0_25px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.4)] backdrop-blur">
          <Label htmlFor="seconds" className="text-[0.65rem] uppercase tracking-[0.45em] text-foreground">
            Seconds per phase
          </Label>
          <div className="mt-2">
            <Slider
              id="seconds"
              min={3}
              max={8}
              step={1}
              value={[secondsPerBreath]}
              onValueChange={handleSliderChange}
              aria-label="Seconds per phase"
            />
          </div>
          <p className="mt-2 text-[0.6rem] uppercase tracking-[0.4em] text-foreground">Tap orb or press space</p>
        </div>
      </div>
    </AuroraBackground>
  );
}
