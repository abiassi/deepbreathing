'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Volume2, VolumeX, Eye, EyeOff, Activity, Waves, Wind } from 'lucide-react';
import { BreathingPhase, ModeName, AIRecommendation } from './types';
import { BREATHING_PATTERNS, DEFAULT_SPEED_MULTIPLIER } from './constants';
import { AudioService } from './services/audioService';
import ParticleBackground from './components/ParticleBackground';
import Visualizer from './components/Visualizer';
import { modeToBreathingPage } from '@/data/breathing-pages';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const STORAGE_KEYS = {
  STATS: 'resonance_stats',
  SETTINGS: 'resonance_settings'
};

interface ResonanceProps {
  apiKey?: string;
  className?: string;
  defaultMode?: ModeName;
  immersive?: boolean;
}

const toRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Resonance: React.FC<ResonanceProps> = ({ apiKey, className = '', defaultMode, immersive }) => {
  const router = useRouter();
  const pathname = usePathname();

  // --- State ---
  const initialMode = defaultMode ?? ModeName.Box;
  const [activeMode, setActiveMode] = useState<ModeName>(initialMode);
  const [speedMultiplier, setSpeedMultiplier] = useState(DEFAULT_SPEED_MULTIPLIER);
  const [themeColor, setThemeColor] = useState(BREATHING_PATTERNS[initialMode].color);
  const [totalMinutes, setTotalMinutes] = useState(0);

  // Client-side hydration check
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (!defaultMode && parsed.mode) setActiveMode(parsed.mode);
        if (parsed.speed) setSpeedMultiplier(parsed.speed);
        if (!defaultMode && parsed.color) setThemeColor(parsed.color);
    } else if (!defaultMode) {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) setThemeColor("#0d9488"); 
        else if (hour >= 18 || hour < 5) setThemeColor("#ea580c");
    }

    if (defaultMode) {
      setActiveMode(defaultMode);
      setThemeColor(BREATHING_PATTERNS[defaultMode].color);
    }

    const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
    if (savedStats) {
        setTotalMinutes(JSON.parse(savedStats).totalMinutes || 0);
    }
  }, [defaultMode]);

  const [phase, setPhase] = useState<BreathingPhase>(BreathingPhase.Idle);
  const [isRunning, setIsRunning] = useState(false);
  const [muted, setMuted] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  
  // Animation State
  const [scale, setScale] = useState(0); 
  const [instruction, setInstruction] = useState("Ready to start?");
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  // Refs
  const audioServiceRef = useRef<AudioService | null>(null);
  
  const getAudioService = () => {
      if (!audioServiceRef.current) {
          audioServiceRef.current = new AudioService({});
      }
      return audioServiceRef.current;
  };

  const requestRef = useRef<number | null>(null);
  const phaseStartRef = useRef<number>(0);

  useEffect(() => {
    getAudioService().setThemeColor(themeColor);
  }, [themeColor]);
  
  // --- Persistence Effects ---
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
      mode: activeMode,
      speed: speedMultiplier,
      color: themeColor
    }));
  }, [activeMode, speedMultiplier, themeColor, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify({
      totalMinutes
    }));
  }, [totalMinutes, mounted]);

  // --- Haptics Effect ---
  useEffect(() => {
    if (!isRunning || typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;

    // Trigger haptics on phase change
    switch (phase) {
        case BreathingPhase.Inhale:
        case BreathingPhase.Inhale2:
            navigator.vibrate(100); // Short buzz to start
            break;
        case BreathingPhase.HoldIn:
        case BreathingPhase.HoldOut:
             // Heartbeat pattern
            navigator.vibrate([50, 100, 50]); 
            break;
        case BreathingPhase.Exhale:
            navigator.vibrate(200); // Long grounding buzz
            break;
    }
  }, [phase, isRunning]);

  // --- Logic ---

  const currentPattern = BREATHING_PATTERNS[activeMode];

  const handleTogglePlay = () => {
    const audio = getAudioService();
    if (!isRunning) {
      setIsRunning(true);
      setPhase(BreathingPhase.Inhale);
      phaseStartRef.current = performance.now();
      audio.resume();
      
      // Adaptive Audio Logic
      if (activeMode === ModeName.Relax || activeMode === ModeName.Coherent) {
          // Relax/Coherent get Pink Noise (Rain)
          audio.startPinkNoise();
          // Relax gets Delta Waves (Sleep), Coherent gets Alpha
          const hz = activeMode === ModeName.Relax ? 2 : 10;
          audio.startBinaural(hz);
      } else {
          // Others get Drone Synth + Alpha
          audio.startDrone(themeColor);
          audio.startBinaural(10);
      }

      audio.playCue('inhale', themeColor);
      setInstruction("Inhale slowly...");
    } else {
      setIsRunning(false);
      setPhase(BreathingPhase.Idle);
      setInstruction("Paused");
      audio.stopDrone();
      audio.stopPinkNoise();
      audio.stopBinaural();
      setScale(0);
    }
  };

  const handleStop = () => {
    const audio = getAudioService();
    setIsRunning(false);
    setPhase(BreathingPhase.Idle);
    setInstruction("Ready to start?");
    
    if (sessionSeconds > 0) {
      setTotalMinutes(prev => prev + Math.floor(sessionSeconds / 60));
    }
    
    setSessionSeconds(0);
    setScale(0);
    audio.stopDrone();
    audio.stopPinkNoise();
    audio.stopBinaural();
  };

  const handleModeSelect = useCallback(
    (mode: ModeName, options: { navigate?: boolean } = {}) => {
      setActiveMode(mode);
      setAiReasoning(null);

      if (!isRunning) {
        setThemeColor(BREATHING_PATTERNS[mode].color);
      }

      const shouldNavigate = options.navigate ?? true;
      if (shouldNavigate) {
        const page = modeToBreathingPage[mode];
        if (page) {
          const target = `/breathe/${page.slug}`;
          if (pathname !== target) {
            router.push(target);
          }
        }
      }
    },
    [isRunning, pathname, router]
  );

  const handleAIRecommendation = (rec: AIRecommendation) => {
    handleModeSelect(rec.recommendedMode);
    setThemeColor(rec.suggestedColor);
    setSpeedMultiplier(rec.suggestedSpeedMultiplier);
    setAiReasoning(rec.explanation);
    handleStop();
  };

  const toggleMute = () => {
    const newMute = !muted;
    setMuted(newMute);
    getAudioService().toggleMute(newMute);
  };

  // --- The Loop ---
  const animate = useCallback((time: number) => {
    if (!isRunning) return;

    // Update 8D Spatial Audio Position
    const audio = getAudioService();
    audio.updateSpatial(time);

    const pattern = BREATHING_PATTERNS[activeMode];
    const inhaleDur = pattern.inhale * speedMultiplier * 1000;
    const inhale2Dur = (pattern.inhale2 || 0) * speedMultiplier * 1000;
    const holdInDur = pattern.holdIn * speedMultiplier * 1000;
    const exhaleDur = pattern.exhale * speedMultiplier * 1000;
    const holdOutDur = pattern.holdOut * speedMultiplier * 1000;

    const timeSincePhaseStart = time - phaseStartRef.current;

    let currentPhaseDuration = 0;
    let progress = 0;
    let nextPhase = phase;

    // --- State Machine ---

    if (phase === BreathingPhase.Inhale) {
      currentPhaseDuration = inhaleDur;
      progress = Math.min(timeSincePhaseStart / currentPhaseDuration, 1);
      
      // If there is a second inhale, only scale to 75%
      const maxScale = inhale2Dur > 0 ? 0.75 : 1.0;
      setScale(progress * maxScale);

      if (timeSincePhaseStart >= currentPhaseDuration) {
        // Check for Inhale 2 (Double Inhale)
        if (inhale2Dur > 0) {
             nextPhase = BreathingPhase.Inhale2;
             setInstruction("...and again!");
        } else {
             nextPhase = holdInDur > 0 ? BreathingPhase.HoldIn : BreathingPhase.Exhale;
             setInstruction(holdInDur > 0 ? "" : "Exhale...");
             setScale(1);
        }
      }
    } 
    else if (phase === BreathingPhase.Inhale2) {
        currentPhaseDuration = inhale2Dur;
        progress = Math.min(timeSincePhaseStart / currentPhaseDuration, 1);
        // Scale from 0.75 to 1.0
        setScale(0.75 + (progress * 0.25));

        if (timeSincePhaseStart >= currentPhaseDuration) {
            nextPhase = holdInDur > 0 ? BreathingPhase.HoldIn : BreathingPhase.Exhale;
            setInstruction(holdInDur > 0 ? "" : "Exhale fully...");
            setScale(1);
        }
    }
    else if (phase === BreathingPhase.HoldIn) {
      currentPhaseDuration = holdInDur;
      progress = Math.min(timeSincePhaseStart / currentPhaseDuration, 1);
      setScale(1);

      if (timeSincePhaseStart >= currentPhaseDuration) {
        nextPhase = BreathingPhase.Exhale;
        setInstruction("Exhale...");
      }
    } else if (phase === BreathingPhase.Exhale) {
      currentPhaseDuration = exhaleDur;
      progress = Math.min(timeSincePhaseStart / currentPhaseDuration, 1);
      setScale(1 - progress);

      if (timeSincePhaseStart >= currentPhaseDuration) {
        nextPhase = holdOutDur > 0 ? BreathingPhase.HoldOut : BreathingPhase.Inhale;
        setInstruction(holdOutDur > 0 ? "" : "Inhale...");
        setScale(0);
      }
    } else if (phase === BreathingPhase.HoldOut) {
      currentPhaseDuration = holdOutDur;
      progress = Math.min(timeSincePhaseStart / currentPhaseDuration, 1);
      setScale(0);

      if (timeSincePhaseStart >= currentPhaseDuration) {
        nextPhase = BreathingPhase.Inhale;
        setInstruction("Inhale...");
      }
    }

    if (nextPhase !== phase) {
      setPhase(nextPhase);
      phaseStartRef.current = time;
      
      if (nextPhase === BreathingPhase.Inhale || nextPhase === BreathingPhase.Inhale2) audio.playCue('inhale', themeColor);
      else if (nextPhase === BreathingPhase.Exhale) audio.playCue('exhale', themeColor);
      else audio.playCue('hold', themeColor);
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [activeMode, isRunning, phase, speedMultiplier, themeColor]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, animate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setSessionSeconds(s => {
            if ((s + 1) % 60 === 0) {
                setTotalMinutes(tm => tm + 1);
            }
            return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
     if (!isRunning && !aiReasoning) {
        setThemeColor(BREATHING_PATTERNS[activeMode].color);
     }
  }, [activeMode, isRunning, aiReasoning]);

  useEffect(() => {
    if (!immersive || typeof document === 'undefined') return;
    const body = document.body;
    if (isRunning) {
      body.dataset.resonanceImmersive = 'true';
      document.documentElement.style.setProperty('--immersive-color', toRgba(themeColor, 0.3));
    } else {
      delete body.dataset.resonanceImmersive;
      document.documentElement.style.removeProperty('--immersive-color');
    }
    return () => {
      delete body.dataset.resonanceImmersive;
      document.documentElement.style.removeProperty('--immersive-color');
    };
  }, [immersive, isRunning, themeColor]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const event = new CustomEvent('resonance:run-state', { detail: { running: isRunning } });
    window.dispatchEvent(event);
  }, [isRunning]);

  const getPhaseLabel = (p: BreathingPhase) => {
    if (p === BreathingPhase.Idle) return "Ready";
    if (p === BreathingPhase.HoldIn || p === BreathingPhase.HoldOut) return "Hold";
    if (p === BreathingPhase.Inhale2) return "Inhale";
    return p;
  };

  // --- Helper for Stats ---
  const renderStats = () => {
      const p = BREATHING_PATTERNS[activeMode];
      const isRelax = activeMode === ModeName.Relax;
      const waveType = isRelax ? "Delta Waves (2Hz)" : "Alpha Waves (10Hz)";
      const waveDesc = isRelax ? "Deep Sleep" : "Flow State";
      const ambienceType = (activeMode === ModeName.Relax || activeMode === ModeName.Coherent) ? "Pink Noise (Rain)" : "Drone Synth";

      return (
          <div className="mt-4 rounded-lg bg-card/70 p-3 text-xs text-muted-foreground shadow-inner backdrop-blur supports-[backdrop-filter]:bg-card/60 dark:bg-card/30">
              <div className="grid grid-cols-4 gap-2 text-center divide-x divide-border/60">
                  <div>
                    <span className="block font-bold text-card-foreground">{(p.inhale * speedMultiplier).toFixed(1)}s</span>
                    <span className="text-[10px] uppercase tracking-wide">Inhale</span>
                  </div>
                  {p.holdIn > 0 && (
                  <div>
                    <span className="block font-bold text-card-foreground">{(p.holdIn * speedMultiplier).toFixed(1)}s</span>
                    <span className="text-[10px] uppercase tracking-wide">Hold</span>
                  </div>
                  )}
                  <div>
                    <span className="block font-bold text-card-foreground">{(p.exhale * speedMultiplier).toFixed(1)}s</span>
                    <span className="text-[10px] uppercase tracking-wide">Exhale</span>
                  </div>
                  {p.holdOut > 0 && (
                  <div>
                    <span className="block font-bold text-card-foreground">{(p.holdOut * speedMultiplier).toFixed(1)}s</span>
                    <span className="text-[10px] uppercase tracking-wide">Hold</span>
                  </div>
                  )}
              </div>

              <div className="border-t border-border/60 pt-2 space-y-1">
                  <div className="flex items-center gap-2">
                      <Activity size={12} className="text-primary" />
                      <span className="font-semibold text-card-foreground">{waveType}</span>
                      <span className="ml-auto text-muted-foreground">{waveDesc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      {ambienceType.includes("Rain") ? <Wind size={12} className="text-primary" /> : <Waves size={12} className="text-primary" />}
                      <span className="font-medium text-card-foreground">{ambienceType}</span>
                      <span className="ml-auto text-muted-foreground">8D Audio</span>
                  </div>
              </div>
          </div>
      )
  }

  if (!mounted) return null;

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden bg-background transition-colors duration-1000 ${className}`}
      style={{ backgroundColor: isRunning ? `${themeColor}1a` : undefined }}
    >
      
      <ParticleBackground phase={phase} color={themeColor} speedMultiplier={speedMultiplier} />

      <header className="relative z-20 flex justify-end p-6">
        <button
          onClick={() => setControlsOpen(true)}
          className="inline-flex items-center rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-card dark:border-border/40 dark:bg-card/40 dark:text-card-foreground"
        >
          Settings
        </button>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <Visualizer 
            phase={phase}
            scale={scale}
            color={themeColor}
            label={getPhaseLabel(phase)}
            instructions={instruction}
            progress={0} 
            isRunning={isRunning}
            onClick={handleTogglePlay}
        />
      </main>
      
      <Sheet open={controlsOpen} onOpenChange={setControlsOpen}>
        <SheetContent side="right" className="bg-transparent shadow-none outline-none border-0 p-0">
          <div className="fixed right-6 top-20 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-[32px] border border-border/70 bg-background/95 p-7 text-foreground shadow-[0_35px_90px_rgba(15,23,42,0.25)] backdrop-blur-2xl">
          <SheetHeader className="mb-6 text-left">
            <SheetTitle className="text-xl font-semibold text-card-foreground">Settings</SheetTitle>
            <p className="text-sm text-muted-foreground">Adjust modes, pacing, and personalization.</p>
          </SheetHeader>
          <div className="flex-1 space-y-6 overflow-y-auto pb-12">
            <div className="flex flex-col gap-4 rounded-2xl bg-card/70 p-4 shadow-inner dark:bg-card/30">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Session</p>
                <p className="text-3xl font-semibold text-card-foreground tabular-nums">
                  {Math.floor(sessionSeconds / 60)}:{String(sessionSeconds % 60).padStart(2, '0')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={toggleMute}
                  className={`flex flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition ${
                    muted ? 'bg-foreground text-background' : 'bg-card text-card-foreground'
                  }`}
                >
                  {muted ? 'Sound Off' : 'Sound On'}
                </button>
              </div>
            </div>
            {aiReasoning && (
              <div className="rounded-xl border border-border/70 bg-card/70 p-4 text-sm text-card-foreground shadow-sm dark:bg-card/30">
                <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-primary">
                  AI Suggestion
                  <button onClick={() => setAiReasoning(null)} className="text-muted-foreground underline hover:text-primary">
                    Dismiss
                  </button>
                </div>
                {aiReasoning}
              </div>
            )}

            {!isRunning ? (
              <>
                <div className="glass-panel flex flex-wrap justify-between gap-1 rounded-2xl p-2">
                  {Object.values(BREATHING_PATTERNS).map((m) => (
                    <button
                      key={m.name}
                      onClick={() => handleModeSelect(m.name)}
                      className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-all whitespace-nowrap ${
                        activeMode === m.name
                          ? 'bg-card text-card-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-card/60 dark:hover:bg-card/30'
                      }`}
                    >
                      {m.name === ModeName.Sigh ? 'Sigh' : m.name.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 rounded-2xl bg-card/70 p-4 shadow-inner dark:bg-card/30">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pattern</p>
                    <p className="text-base text-card-foreground">{currentPattern.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <span>Speed</span>
                      <span className="text-sm text-card-foreground">{speedMultiplier.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={speedMultiplier}
                      onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground dark:bg-muted/30">
                Pause the session to switch modes or adjust pacing.
              </div>
            )}

            {renderStats()}
          </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Resonance;
