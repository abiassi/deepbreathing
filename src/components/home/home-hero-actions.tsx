"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BREATHING_PATTERNS, ModeName } from "@/components/resonance/constants";

const startButtonColor = BREATHING_PATTERNS[ModeName.Box].color;
const startButtonStyle = {
    backgroundColor: startButtonColor,
    boxShadow: `0 12px 36px ${startButtonColor}60`
};

export function HomeHeroActions() {
    const [running, setRunning] = useState(false);

    useEffect(() => {
        const handleRunState = (event: Event) => {
            const custom = event as CustomEvent<{ running: boolean }>;
            setRunning(Boolean(custom.detail?.running));
        };

        window.addEventListener("resonance:run-state", handleRunState);
        return () => window.removeEventListener("resonance:run-state", handleRunState);
    }, []);

    const handleStartSession = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('resonance:start'));
        }
    };

    return (
        <div className={cn(
            "flex flex-wrap gap-4 transition-all duration-500",
            running ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"
        )}>
            <Button
                onClick={handleStartSession}
                type="button"
                size="lg"
                className="shadow-none text-white hover:brightness-105 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-white/70"
                style={startButtonStyle}
            >
                Start session
            </Button>
            <Button asChild variant="outline" size="lg">
                <a href="#mode-picker">Pick a mode</a>
            </Button>
        </div>
    );
}
