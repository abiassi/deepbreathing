export enum BreathingPhase {
  Inhale = "Inhale",
  Inhale2 = "Inhale (Top up)",
  HoldIn = "Hold In",
  Exhale = "Exhale",
  HoldOut = "Hold Out",
  Idle = "Ready",
}

export enum ModeName {
  Box = "Box Breathing",
  Relax = "4-7-8 Relax",
  Coherent = "Coherent Breathing",
}

export interface BreathingPattern {
  name: ModeName;
  description: string;
  inhale: number;
  inhale2?: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  color: string;
}

export interface PhaseUpdateInput {
  phase: BreathingPhase;
  elapsedMs: number;
  pattern: BreathingPattern;
  speedMultiplier: number;
}

export interface PhaseUpdateResult {
  phase: BreathingPhase;
  phaseDurationMs: number;
  phaseComplete: boolean;
}

export interface PhaseVisualState {
  phase: BreathingPhase;
  progress: number;
  scale: number;
}
