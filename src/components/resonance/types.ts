export enum BreathingPhase {
  Inhale = 'Inhale',
  Inhale2 = 'Inhale (Top up)',
  HoldIn = 'Hold In',
  Exhale = 'Exhale',
  HoldOut = 'Hold Out',
  Idle = 'Ready'
}

export enum ModeName {
  Box = 'Box Breathing',
  Relax = '4-7-8 Relax',
  Coherent = 'Coherent Breathing',
  Sigh = 'Physiological Sigh'
}

export interface BreathingPattern {
  name: ModeName;
  description: string;
  // Duration in seconds for each phase
  inhale: number;
  inhale2?: number; // Optional second inhale for physiological sigh
  holdIn: number;
  exhale: number;
  holdOut: number;
  color: string; // Hex code for the theme
}

export interface AIRecommendation {
  recommendedMode: ModeName;
  explanation: string;
  suggestedColor: string;
  suggestedSpeedMultiplier: number;
}

export interface SessionStats {
  totalMinutes: number;
  sessionsCompleted: number;
}