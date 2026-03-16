"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "resonance_conversion";

interface ConversionState {
  sessionsOver60s: number;
  settingsChanges: number;
  dismissed: {
    session: boolean;
    settings: boolean;
  };
  convertedAt: string | null;
}

const DEFAULT_STATE: ConversionState = {
  sessionsOver60s: 0,
  settingsChanges: 0,
  dismissed: { session: false, settings: false },
  convertedAt: null,
};

function loadState(): ConversionState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: ConversionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useConversionTriggers(isAuthenticated: boolean) {
  const [state, setState] = useState<ConversionState>(DEFAULT_STATE);
  const [showSessionPrompt, setShowSessionPrompt] = useState(false);
  const [showSettingsNudge, setShowSettingsNudge] = useState(false);

  // Load on mount
  useEffect(() => {
    setState(loadState());
  }, []);

  // Hide everything if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowSessionPrompt(false);
      setShowSettingsNudge(false);
    }
  }, [isAuthenticated]);

  const onSessionComplete = useCallback(
    (sessionSeconds: number) => {
      if (isAuthenticated) return;
      if (sessionSeconds < 60) return;

      setState((prev) => {
        const next = {
          ...prev,
          sessionsOver60s: prev.sessionsOver60s + 1,
        };
        saveState(next);

        // Show on first qualifying session, or every 3rd session if previously dismissed
        const shouldShow = prev.convertedAt === null && !prev.dismissed.session
          ? next.sessionsOver60s >= 1
          : !prev.dismissed.session && next.sessionsOver60s % 3 === 0;

        if (shouldShow) {
          setTimeout(() => setShowSessionPrompt(true), 1500);
        }

        return next;
      });
    },
    [isAuthenticated]
  );

  const onSettingsChange = useCallback(() => {
    if (isAuthenticated) return;

    setState((prev) => {
      const next = {
        ...prev,
        settingsChanges: prev.settingsChanges + 1,
      };
      saveState(next);

      if (
        next.settingsChanges >= 2 &&
        !prev.dismissed.settings &&
        prev.convertedAt === null &&
        !showSessionPrompt // don't show both at once
      ) {
        setShowSettingsNudge(true);
      }

      return next;
    });
  }, [isAuthenticated, showSessionPrompt]);

  const dismissSession = useCallback(() => {
    setShowSessionPrompt(false);
    setState((prev) => {
      const next = { ...prev, dismissed: { ...prev.dismissed, session: true } };
      saveState(next);
      return next;
    });
  }, []);

  const dismissSettings = useCallback(() => {
    setShowSettingsNudge(false);
    setState((prev) => {
      const next = { ...prev, dismissed: { ...prev.dismissed, settings: true } };
      saveState(next);
      return next;
    });
  }, []);

  const markConverted = useCallback(() => {
    setShowSessionPrompt(false);
    setShowSettingsNudge(false);
    setState((prev) => {
      const next = { ...prev, convertedAt: new Date().toISOString() };
      saveState(next);
      return next;
    });
  }, []);

  return {
    showSessionPrompt,
    showSettingsNudge,
    onSessionComplete,
    onSettingsChange,
    dismissSession,
    dismissSettings,
    markConverted,
    setShowSessionPrompt,
  };
}
