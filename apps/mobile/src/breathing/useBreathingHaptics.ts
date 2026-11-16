import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { BreathingPhase } from '.';
import type { SessionStatus } from './useBreathingSession';

const EXHALE_TAP_GAP_MS = 130;
const HOLD_BUZZ_TAPS = 7;
const HOLD_BUZZ_GAP_MS = 40;

const impact = (style: Haptics.ImpactFeedbackStyle) =>
  Haptics.impactAsync(style).catch(() => {
    // haptics unavailable on this device — ignore
  });

interface UseBreathingHapticsInput {
  phase: BreathingPhase;
  status: SessionStatus;
  enabled?: boolean;
}

export function useBreathingHaptics({
  phase,
  status,
  enabled = true,
}: UseBreathingHapticsInput) {
  const lastPhaseRef = useRef<BreathingPhase | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (status === 'idle') {
      lastPhaseRef.current = null;
      return;
    }
    if (status !== 'running') return; // hold ref across pause
    if (phase === lastPhaseRef.current) return;
    // Mark this phase observed BEFORE the `enabled` gate, so toggling haptics
    // back on mid-phase doesn't read a stale ref and fire a spurious tap.
    lastPhaseRef.current = phase;
    if (!enabled) return;

    switch (phase) {
      case BreathingPhase.Inhale:
      case BreathingPhase.Inhale2:
        impact(Haptics.ImpactFeedbackStyle.Light);
        break;
      case BreathingPhase.HoldIn:
      case BreathingPhase.HoldOut: {
        const timers = Array.from({ length: HOLD_BUZZ_TAPS }, (_, i) =>
          setTimeout(
            () => impact(Haptics.ImpactFeedbackStyle.Rigid),
            i * HOLD_BUZZ_GAP_MS
          )
        );
        return () => timers.forEach(clearTimeout);
      }
      case BreathingPhase.Exhale: {
        impact(Haptics.ImpactFeedbackStyle.Medium);
        const t = setTimeout(
          () => impact(Haptics.ImpactFeedbackStyle.Medium),
          EXHALE_TAP_GAP_MS
        );
        return () => clearTimeout(t);
      }
      default:
        break;
    }
  }, [phase, status, enabled]);
}
