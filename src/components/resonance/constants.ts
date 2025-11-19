import { BreathingPattern, ModeName } from './types';

export const BREATHING_PATTERNS: Record<ModeName, BreathingPattern> = {
  [ModeName.Box]: {
    name: ModeName.Box,
    description: "Focus & Stress Reduction (4-4-4-4)",
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    color: "#e11d48" // Rose
  },
  [ModeName.Relax]: {
    name: ModeName.Relax,
    description: "Sleep & Deep Relaxation (4-7-8)",
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    color: "#4f46e5" // Indigo
  },
  [ModeName.Coherent]: {
    name: ModeName.Coherent,
    description: "Heart Rate Variability (5.5-5.5)",
    inhale: 5.5,
    holdIn: 0,
    exhale: 5.5,
    holdOut: 0,
    color: "#059669" // Emerald
  },
  [ModeName.Sigh]: {
    name: ModeName.Sigh,
    description: "Panic Reset (Double Inhale)",
    inhale: 2.5,
    inhale2: 1.5,
    holdIn: 0,
    exhale: 6,
    holdOut: 1,
    color: "#0ea5e9" // Sky Blue
  }
};

export const MIN_SPEED_MULTIPLIER = 0.5;
export const MAX_SPEED_MULTIPLIER = 2.0;
export const DEFAULT_SPEED_MULTIPLIER = 1.0;