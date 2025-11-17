"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

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
    <section className="relative isolate flex min-h-[90vh] flex-col overflow-hidden rounded-[56px] bg-gradient-to-br from-[#ffb88a] via-[#ff9faa] to-[#f57fb5] px-6 py-10 text-white shadow-[0_40px_80px_rgba(255,143,119,0.35)] sm:px-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-1/2 top-[-20%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-white/20 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-0 h-[22rem] w-[22rem] translate-x-1/3 rounded-full bg-[#ff9d7a]/20 blur-[130px]" />
      </div>
      <div className="relative z-10 flex flex-1 flex-col items-center justify-between gap-8">
        <div className="pt-6 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-white/60">{secondsPerBreath}s cadence</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-white" aria-live="polite">
            {activePhase}
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
              "--tw-gradient-stops": `${running ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)"} ${Math.max(
                progress * 100,
                5
              )}%, rgba(255,255,255,0.2) ${Math.max(progress * 100, 5)}%`
            } as CSSProperties}
          />
          <div
            aria-hidden
            className="relative h-full w-full rounded-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(255,255,255,0.35)_65%,_rgba(255,255,255,0.08))] shadow-[0_35px_90px_rgba(255,255,255,0.35)] transition-transform duration-700 ease-in-out"
            style={{ transform: `scale(${orbScale})` }}
          />
        <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center" aria-live="polite">
          <span className="text-[0.75rem] uppercase tracking-[0.4em] text-white/70">{orbPrompt}</span>
          <span className="mt-2 text-5xl font-semibold tabular-nums text-white">{countdown}s</span>
        </span>
      </button>
        <div className="w-full max-w-xl space-y-5 pb-4 text-center">
          <Label htmlFor="seconds" className="block text-xs uppercase tracking-[0.5em] text-white/70">
            Seconds per phase
          </Label>
          <Slider
            id="seconds"
            min={3}
            max={8}
            step={1}
            value={[secondsPerBreath]}
            onValueChange={handleSliderChange}
            aria-label="Seconds per phase"
          />
          <p className="text-xs uppercase tracking-[0.4em] text-white/55">Tap orb or press space</p>
        </div>
      </div>
    </section>
  );
}
