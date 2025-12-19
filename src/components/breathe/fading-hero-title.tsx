"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface FadingHeroTitleProps {
  label: string;
  title: string;
  subtitle: string;
  className?: string;
  children?: React.ReactNode;
}

export function FadingHeroTitle({ label, title, subtitle, className, children }: FadingHeroTitleProps) {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const handleRunState = (event: Event) => {
      const custom = event as CustomEvent<{ running: boolean }>;
      setRunning(Boolean(custom.detail?.running));
    };

    window.addEventListener("resonance:run-state", handleRunState);
    return () => window.removeEventListener("resonance:run-state", handleRunState);
  }, []);

  return (
    <div
      className={cn(
        "space-y-4 text-foreground drop-shadow-sm transition-all duration-500",
        running ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
        className
      )}
    >
      <p className="text-xs uppercase tracking-[0.35em] text-primary">{label}</p>
      <div>
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
