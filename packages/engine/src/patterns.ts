import { BreathingPattern, ModeName } from "./types";

export const BREATHING_PATTERNS: Record<ModeName, BreathingPattern> = {
  [ModeName.Box]: {
    name: ModeName.Box,
    description: "Focus & Stress Reduction (4-4-4-4)",
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    color: "#e11d48",
  },
  [ModeName.Relax]: {
    name: ModeName.Relax,
    description: "Sleep & Deep Relaxation (4-7-8)",
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    color: "#4f46e5",
  },
  [ModeName.Coherent]: {
    name: ModeName.Coherent,
    description: "Heart Rate Variability (5.5-5.5)",
    inhale: 5.5,
    holdIn: 0,
    exhale: 5.5,
    holdOut: 0,
    color: "#059669",
  },
};

export const DEFAULT_SPEED_MULTIPLIER = 1.0;
export const MIN_SPEED_MULTIPLIER = 0.5;
export const MAX_SPEED_MULTIPLIER = 2.0;
