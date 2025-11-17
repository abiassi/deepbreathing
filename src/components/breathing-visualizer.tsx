"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

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
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
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
        if (running) {
          scheduleCycle(duration);
        }
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

    return () => {
      clearTimers();
    };
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

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const secondsPerBreath = useMemo(() => clampSeconds(seconds), [seconds]);
  const activePhase = PHASES[phaseIndex];
  const progress = useMemo(() => {
    const duration = phaseDurationRef.current || secondsPerBreath;
    return duration === 0 ? 0 : 1 - countdown / duration;
  }, [countdown, secondsPerBreath]);

  const orbScale = activePhase === "Inhale" ? 1 : activePhase === "Exhale" ? 0.65 : 0.82;

  const handleSliderChange = (value: number[]) => {
    const nextValue = clampSeconds(value[0] ?? seconds);
    setSeconds(nextValue);
  };

  const handleToggle = () => {
    setRunning((prev) => !prev);
    if (running) {
      resetPhase();
    }
  };

  return (
    <section className="relative isolate overflow-hidden rounded-[48px] bg-gradient-to-br from-[#ffb88a] via-[#ff9faa] to-[#f57fb5] px-6 py-12 text-white shadow-[0_40px_80px_rgba(255,143,119,0.35)] sm:px-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/40 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 rounded-full bg-[#ff9d7a]/40 blur-[120px]" />
      </div>
      <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col items-center gap-8 text-center">
          <span className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-2 text-[0.65rem] uppercase tracking-[0.4em] text-white/80">
            {running ? "Flow" : "Paused"}
            <span className="text-white/60">{secondsPerBreath}s pace</span>
          </span>
          <div className="relative flex h-[22rem] w-[22rem] items-center justify-center rounded-full bg-white/5 p-6 shadow-[0_40px_80px_rgba(0,0,0,0.25)]">
            <div
              className="absolute inset-6 rounded-full border border-white/20"
              style={{
                background: `conic-gradient(var(--tw-gradient-stops))`,
                "--tw-gradient-stops": `${running ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)"} ${Math.max(
                  progress * 100,
                  5
                )}%, rgba(255,255,255,0.2) ${Math.max(progress * 100, 5)}%`
              } as CSSProperties}
            />
            <div
              aria-hidden
              className="relative h-56 w-56 rounded-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(255,255,255,0.35)_60%,_rgba(255,255,255,0.08))] shadow-[0_25px_65px_rgba(255,255,255,0.35)] transition-transform duration-700 ease-in-out"
              style={{ transform: `scale(${orbScale})` }}
            />
          </div>
          <div className="text-sm uppercase tracking-[0.45em] text-white/75" aria-live="polite">
            {activePhase}
            <span className="ml-3 text-base font-semibold tracking-normal">{countdown}s</span>
          </div>
          <p className="max-w-md text-sm text-white/80">
            Let the orb guide you through inhale, hold, exhale, hold—no extra chrome, just color and cadence.
          </p>
        </div>
        <div className="space-y-7 text-white/90">
          <div className="space-y-2 text-center lg:text-left">
            <p className="text-lg font-medium text-white">Ease in at five seconds.</p>
            <p className="text-base text-white/80">Tap once to begin, again to pause. Space bar works too.</p>
          </div>
          <div className="flex justify-center lg:justify-start">
            <Button className="w-40" onClick={handleToggle}>
              {running ? "Pause flow" : "Start flow"}
            </Button>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="seconds" className="text-white/80">
                  Seconds per phase
                </Label>
                <p className="text-xs text-white/70">Stay between 3–8 seconds. Five is a gentle start.</p>
              </div>
              <span className="text-4xl font-semibold text-white">{secondsPerBreath}s</span>
            </div>
            <Slider
              className="mt-6"
              id="seconds"
              min={3}
              max={8}
              step={1}
                value={[secondsPerBreath]}
                onValueChange={handleSliderChange}
                aria-label="Seconds per phase"
              />
            </div>
        </div>
      </div>
    </section>
  );
}
