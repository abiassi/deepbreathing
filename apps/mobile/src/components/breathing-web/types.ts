export enum BreathingPhase {
  Inhale = 'Inhale',
  Inhale2 = 'Inhale (Top up)',
  HoldIn = 'Hold In',
  Exhale = 'Exhale',
  HoldOut = 'Hold Out',
  Idle = 'Ready'
}

// Canonical definition lives in @resonance/domain (single copy shared with
// web and audio); re-exported here so the fork keeps importing './types'.
import { ModeName } from '@resonance/domain';
export { ModeName };

export enum ProtocolPhase {
  Idle = 'Get Ready',
  PowerBreathe = 'Power Breathe',
  RetentionHold = 'Hold',
  RecoveryInhale = 'Recovery Inhale',
  RecoveryHold = 'Recovery Hold',
  RoundComplete = 'Round Complete',
  ProtocolComplete = 'Complete'
}

export interface ProtocolPattern {
  name: string;
  rounds: number;
  powerBreathCount: number;
  powerBreathTiming: { inhale: number; exhale: number };
  retentionHoldMin: number;
  retentionHoldMax: number;
  recoveryTiming: { inhale: number; hold: number };
  roundRestDuration: number;
  color: string;
}

export interface ProtocolState {
  currentRound: number;
  currentBreathIndex: number;
  phase: ProtocolPhase;
  retentionTime: number;
  isUserControlledHold: boolean;
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


export interface SessionStats {
  totalMinutes: number;
  sessionsCompleted: number;
}
