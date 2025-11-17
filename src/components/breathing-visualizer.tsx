"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

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

  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    resetPhase();
  };

  const isHolding = activePhase === "Hold";

  return (
    <section className="space-y-10">
      <Card className="border-none bg-gradient-to-br from-card via-card/80 to-background/80 p-6">
        <CardHeader className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3 text-center sm:text-left">
            <CardTitle className="text-balance text-3xl font-semibold text-white">
              Box Breathing Visualizer
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Inhale four counts, hold four, exhale four, hold four. Follow the orb and on-screen prompts, or tap
              spacebar to start and pause.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button className="w-32" onClick={handleStart} disabled={running}>
              {running ? "Running" : "Start"}
            </Button>
            <Button className="w-32" variant="secondary" onClick={handlePause} disabled={!running}>
              Pause
            </Button>
            <Button className="w-28" variant="ghost" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
                <div
                  className="absolute inset-4 rounded-full border border-primary/30"
                  style={{
                    background: `conic-gradient(var(--tw-gradient-stops))`,
                    "--tw-gradient-stops": `${running ? "hsl(var(--primary))" : "rgba(255,255,255,0.15)"} ${Math.max(
                      progress * 100,
                      5
                    )}%, rgba(255,255,255,0.12) ${Math.max(progress * 100, 5)}%`
                  } as CSSProperties}
                />
                <div
                  aria-hidden
                  className="relative h-48 w-48 rounded-full bg-gradient-to-b from-primary/80 via-primary/60 to-primary/40 blur-[1px] transition-transform duration-700 ease-in-out"
                  style={{ transform: `scale(${orbScale})` }}
                />
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                <span className="text-lg font-semibold text-white" aria-live="polite">
                  {activePhase}
                </span>
                <span aria-live="polite">
                  • {countdown}s
                </span>
              </div>
            </div>
            <div className="space-y-8">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 text-sm leading-relaxed text-white/90">
                <p className="font-medium text-white">Why box breathing?</p>
                <p className="text-muted-foreground">
                  This technique balances your autonomic nervous system, lowering heart rate variability and calming the
                  amygdala. Four equal phases keep the experience approachable and repeatable.
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>Follow the orb as it expands and contracts.</li>
                  <li>Use the buttons or spacebar to start and pause.</li>
                  <li>Adjust the pace between 3–8 seconds as you progress.</li>
                </ul>
              </div>
              <div className="space-y-5 rounded-2xl border border-border bg-background/60 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="seconds">Seconds per phase</Label>
                    <p className="text-sm text-muted-foreground">Slow things down as your nervous system settles.</p>
                  </div>
                  <span className="text-2xl font-semibold text-primary">{secondsPerBreath}s</span>
                </div>
                <Slider
                  id="seconds"
                  min={3}
                  max={8}
                  step={1}
                  value={[secondsPerBreath]}
                  onValueChange={handleSliderChange}
                  aria-label="Seconds per phase"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Tap the spacebar or hold down your phone with haptic feedback on to sync your breath with the
                  pulses.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 rounded-2xl border border-border/60 bg-card/80 p-6 text-sm text-muted-foreground">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground/80">Cycle length</p>
                  <p className="text-lg font-semibold text-white">{secondsPerBreath * PHASES.length}s</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground/80">Current phase</p>
                  <p className="text-lg font-semibold text-white">{activePhase}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground/80">Status</p>
                  <p className={cn("text-lg font-semibold", running ? "text-primary" : "text-muted-foreground")}>{
                    running ? "Active" : "Paused"
                  }</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground/80">Hold state</p>
                  <p className="text-lg font-semibold text-white">{isHolding ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
