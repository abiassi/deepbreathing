"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { AuroraBackground } from "@/components/magicui/aurora-background";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PatternId = "box" | "relax_4_7_8" | "coherent";

interface PatternPhase {
  label: string;
  instruction: string;
  ratio?: number;
  fixedSeconds?: number;
  scale: number;
}

interface BreathingPattern {
  id: PatternId;
  name: string;
  tagline: string;
  description: string;
  tempo: string;
  strategy: "uniform" | "ratio" | "fixed";
  ratioBase?: number;
  adjustablePace: boolean;
  sliderLabel: string;
  sliderHelp: string;
  paceNote?: string;
  phases: PatternPhase[];
}

const COUNTDOWN_INTERVAL = 100;
const MIN_PACE = 3;
const MAX_PACE = 8;
const PACE_STEP = 0.5;

const PATTERNS: Record<PatternId, BreathingPattern> = {
  box: {
    id: "box",
    name: "Box Breathing",
    tagline: "Steady nervous system reset",
    description: "Even counts on all sides keep things grounded and predictable.",
    tempo: "4-4-4-4",
    strategy: "uniform",
    adjustablePace: true,
    sliderLabel: "Seconds per side",
    sliderHelp: "Inhale, holds, and exhales stay locked to the same count.",
    phases: [
      { label: "Inhale", instruction: "Breathe in deeply through the nose.", ratio: 1, scale: 1 },
      { label: "Hold", instruction: "Pause at the top without tension.", ratio: 1, scale: 0.85 },
      { label: "Exhale", instruction: "Release slowly through the mouth.", ratio: 1, scale: 0.68 },
      { label: "Hold", instruction: "Rest gently with empty lungs.", ratio: 1, scale: 0.82 }
    ]
  },
  relax_4_7_8: {
    id: "relax_4_7_8",
    name: "4-7-8 Relaxation",
    tagline: "Longer exhale for calm",
    description: "Dr. Weil’s cadence: lengthen the hold and exhale to downshift quickly.",
    tempo: "4-7-8",
    strategy: "ratio",
    ratioBase: 4,
    adjustablePace: true,
    sliderLabel: "Base inhale length",
    sliderHelp: "We scale the full pattern from this inhale count.",
    phases: [
      { label: "Inhale", instruction: "Inhale quietly through the nose.", ratio: 4, scale: 1 },
      { label: "Hold", instruction: "Hold softly for seven counts.", ratio: 7, scale: 0.85 },
      { label: "Exhale", instruction: "Exhale with a quiet whoosh.", ratio: 8, scale: 0.6 }
    ]
  },
  coherent: {
    id: "coherent",
    name: "Coherent Breathing",
    tagline: "Smooth 5.5s rhythm",
    description: "Classic HRV training pace—same long inhale and exhale for heart coherence.",
    tempo: "5.5-5.5",
    strategy: "fixed",
    adjustablePace: false,
    sliderLabel: "Pace",
    sliderHelp: "This style stays locked for resonance breathing.",
    paceNote: "Fixed at 5.5 seconds per phase.",
    phases: [
      { label: "Inhale", instruction: "Breathe slowly, counting to five and a half.", fixedSeconds: 5.5, scale: 1 },
      { label: "Exhale", instruction: "Let the air fall out just as slowly.", fixedSeconds: 5.5, scale: 0.65 }
    ]
  }
};

const ORDERED_PATTERNS: PatternId[] = ["box", "relax_4_7_8", "coherent"];

const DEFAULT_PACE_MAP: Record<PatternId, number> = {
  box: 4,
  relax_4_7_8: 4,
  coherent: 5.5
};

const clampSeconds = (value: number) => {
  const clamped = Math.max(MIN_PACE, Math.min(MAX_PACE, value));
  return Math.round(clamped / PACE_STEP) * PACE_STEP;
};

const computePhaseDuration = (pattern: BreathingPattern, phase: PatternPhase, baseSeconds: number) => {
  if (pattern.strategy === "fixed") {
    return phase.fixedSeconds ?? baseSeconds;
  }
  if (pattern.strategy === "ratio") {
    const unit = baseSeconds / (pattern.ratioBase ?? 4);
    return (phase.ratio ?? 1) * unit;
  }
  return (phase.ratio ?? 1) * baseSeconds;
};

export function BreathingVisualizer() {
  const [patternId, setPatternId] = useState<PatternId>("box");
  const [patternPace, setPatternPace] = useState<Record<PatternId, number>>(() => ({ ...DEFAULT_PACE_MAP }));
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const countdownRef = useRef<ReturnType<typeof setInterval>>();
  const pattern = PATTERNS[patternId];
  const baseSeconds = patternPace[patternId];
  const computedPhases = useMemo(
    () =>
      pattern.phases.map((phase) => ({
        ...phase,
        duration: computePhaseDuration(pattern, phase, baseSeconds)
      })),
    [pattern, baseSeconds]
  );
  const firstPhaseDuration = computedPhases[0]?.duration ?? baseSeconds;
  const [countdown, setCountdown] = useState(firstPhaseDuration);
  const phaseDurationRef = useRef(firstPhaseDuration);

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
      setCountdown((prev) => {
        if (prev <= 0) return 0;
        const next = Math.max(0, parseFloat((prev - COUNTDOWN_INTERVAL / 1000).toFixed(2)));
        return next;
      });
    }, COUNTDOWN_INTERVAL);
  }, []);

  const beginPhase = useCallback(
    (index: number) => {
      const phase = computedPhases[index];
      if (!phase) return;
      setPhaseIndex(index);
      startCountdown(phase.duration);
    },
    [computedPhases, startCountdown]
  );

  const scheduleCycle = useCallback(() => {
    if (!computedPhases.length) return;
    let accumulated = 0;
    computedPhases.forEach((phase, idx) => {
      const timer = setTimeout(() => beginPhase(idx), accumulated);
      timersRef.current.push(timer);
      accumulated += phase.duration * 1000;
    });
    const loopTimer = setTimeout(() => {
      if (running) scheduleCycle();
    }, accumulated);
    timersRef.current.push(loopTimer);
  }, [beginPhase, computedPhases, running]);

  const resetPhase = useCallback(() => {
    setPhaseIndex(0);
    const initialDuration = computedPhases[0]?.duration ?? baseSeconds;
    phaseDurationRef.current = initialDuration;
    setCountdown(initialDuration);
  }, [baseSeconds, computedPhases]);

  useEffect(() => {
    if (!running) {
      clearTimers();
      resetPhase();
      return;
    }

    clearTimers();
    beginPhase(0);
    scheduleCycle();

    return () => clearTimers();
  }, [beginPhase, clearTimers, resetPhase, running, scheduleCycle]);

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

  const activePhase = computedPhases[phaseIndex]?.label ?? "Inhale";
  const phaseInstruction = computedPhases[phaseIndex]?.instruction ?? pattern.tagline;
  const progress = useMemo(() => {
    const duration = phaseDurationRef.current || 1;
    if (duration === 0) return 0;
    const raw = 1 - countdown / duration;
    if (!Number.isFinite(raw)) return 0;
    return Math.max(0, Math.min(1, raw));
  }, [countdown]);
  const orbScale = computedPhases[phaseIndex]?.scale ?? 1;
  const orbPrompt = running ? "Stay with the cue" : "Tap to start";
  const countdownLabel = useMemo(() => {
    if (countdown <= 0) return "0";
    const decimals = countdown >= 10 ? 0 : 1;
    const formatted = countdown.toFixed(decimals);
    return decimals === 0 ? formatted : formatted.replace(/\.0$/, "");
  }, [countdown]);

  const handleSliderChange = (value: number[]) => {
    if (!pattern.adjustablePace) return;
    const nextValue = clampSeconds(value[0] ?? baseSeconds);
    setPatternPace((prev) => ({ ...prev, [patternId]: nextValue }));
  };

  const handlePatternSelect = (nextPattern: PatternId) => {
    setPatternId(nextPattern);
    setRunning(false);
  };

  const handleToggle = () => {
    setRunning((prev) => {
      if (prev) {
        resetPhase();
        return false;
      }
      return true;
    });
    setSettingsOpen(false);
  };

  const paceDisplay = baseSeconds % 1 === 0 ? baseSeconds.toFixed(0) : baseSeconds.toFixed(1);

  return (
    <AuroraBackground
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden px-6 pb-10 pt-24 text-white sm:px-12"
      backgroundClassName="bg-gradient-to-br from-[#ffb88a] via-[#ff9faa] to-[#f57fb5]"
    >
      <div className="absolute inset-x-6 top-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-3xl border border-white/30 bg-white/10 px-5 py-3 text-white/90 shadow-[0_15px_45px_rgba(0,0,0,0.25)] backdrop-blur">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.45em]">{pattern.name}</p>
          <p className="mt-1 text-base font-semibold">{pattern.tagline}</p>
          <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/80">{pattern.tempo}</p>
        </div>
        <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-11 rounded-full border border-white/30 bg-white/25 px-4 text-white/90 shadow-[0_12px_35px_rgba(0,0,0,0.25)] backdrop-blur transition hover:bg-white/40"
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Session settings
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex h-full max-w-md flex-col gap-6 overflow-y-auto bg-white/95 p-6 text-foreground shadow-2xl dark:bg-slate-950"
          >
            <SheetHeader className="text-left">
              <SheetTitle>Session settings</SheetTitle>
              <SheetDescription>Choose a pattern and dial in the pace.</SheetDescription>
            </SheetHeader>
            <div className="space-y-8">
              <section>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-muted-foreground">Patterns</p>
                <div className="mt-4 grid gap-3">
                  {ORDERED_PATTERNS.map((id) => {
                    const option = PATTERNS[id];
                    const isActive = id === patternId;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handlePatternSelect(id)}
                        className={cn(
                          "w-full rounded-2xl border p-4 text-left transition hover:border-primary/60",
                          isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border/70 bg-background"
                        )}
                        aria-pressed={isActive}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold text-foreground">{option.name}</p>
                            <p className="text-sm text-muted-foreground">{option.tagline}</p>
                          </div>
                          <span className="rounded-full border border-dashed border-primary/40 px-3 py-1 text-xs font-semibold text-primary">
                            {option.tempo}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </section>
              <section>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-muted-foreground">Pace</p>
                <div className="mt-4 rounded-3xl border border-border/70 bg-muted/20 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{pattern.sliderLabel}</p>
                      <p className="text-xs text-muted-foreground">{pattern.sliderHelp}</p>
                    </div>
                    <span className="text-3xl font-bold">{paceDisplay}s</span>
                  </div>
                  <div className="mt-6 px-2">
                    <Slider
                      min={MIN_PACE}
                      max={MAX_PACE}
                      step={PACE_STEP}
                      value={[baseSeconds]}
                      onValueChange={handleSliderChange}
                      disabled={!pattern.adjustablePace}
                      aria-label="Adjust base pacing"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
                    <span>Faster</span>
                    <span>Slower</span>
                  </div>
                  {!pattern.adjustablePace && pattern.paceNote && (
                    <p className="mt-3 text-xs text-muted-foreground">{pattern.paceNote}</p>
                  )}
                </div>
              </section>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-12 px-2 text-center">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.5em] text-white/80 drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
            {pattern.name}
          </p>
          <p className="mt-3 text-lg text-white/90 drop-shadow-[0_12px_35px_rgba(0,0,0,0.45)]">
            {pattern.tagline} • {pattern.tempo}
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
            <span className="text-base font-bold uppercase tracking-[0.4em] text-white/85">{activePhase}</span>
            <span className="mt-2 text-5xl font-black tabular-nums">{countdownLabel}s</span>
          </span>
        </button>
        <p className="max-w-md text-lg text-white/90 drop-shadow-[0_12px_35px_rgba(0,0,0,0.35)]" aria-live="polite">
          {running ? phaseInstruction : pattern.description}
        </p>
      </div>
      <p className="pt-10 text-center text-[0.6rem] uppercase tracking-[0.4em] text-white/80 drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
        Tap orb or press space to {running ? "pause" : "begin"}
      </p>
    </AuroraBackground>
  );
}
