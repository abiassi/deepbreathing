"use client";

import React from "react";
import { SignInSheet } from "./sign-in-sheet";

interface SessionCompletePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss: () => void;
  onSuccess: () => void;
  totalMinutes: number;
  sessionSeconds: number;
}

export function SessionCompletePrompt({
  open,
  onOpenChange,
  onDismiss,
  onSuccess,
  totalMinutes,
  sessionSeconds,
}: SessionCompletePromptProps) {
  const sessionMinutes = Math.floor(sessionSeconds / 60);
  const headline =
    sessionMinutes >= 5
      ? `${sessionMinutes} minutes of calm`
      : "Nice session";

  return (
    <SignInSheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onDismiss();
        onOpenChange(isOpen);
      }}
      onSuccess={onSuccess}
      headline={headline}
      subtitle="Save your progress and sync across devices."
      totalMinutes={totalMinutes}
    />
  );
}
