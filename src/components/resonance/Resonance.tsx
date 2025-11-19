'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Eye, EyeOff, Activity, Waves, Wind } from 'lucide-react';
import { BreathingPhase, ModeName, AIRecommendation } from './types';
import { BREATHING_PATTERNS, DEFAULT_SPEED_MULTIPLIER } from './constants';
import { AudioService } from './services/audioService';
import ParticleBackground from './components/ParticleBackground';
import Visualizer from './components/Visualizer';
import AIAdvisor from './components/AIAdvisor';

const STORAGE_KEYS = {
  STATS: 'resonance_stats',
  SETTINGS: 'resonance_settings'
};

interface ResonanceProps {
  apiKey?: string;
  className?: string;
}

const Resonance: React.FC<ResonanceProps> = ({ apiKey, className = '' }) => {
  // --- State ---
  const [activeMode, setActiveMode] = useState<ModeName>(ModeName.Box);
  const [speedMultiplier, setSpeedMultiplier] = useState(DEFAULT_SPEED_MULTIPLIER);
  const [themeColor, setThemeColor] = useState(BREATHING_PATTERNS[ModeName.Box].color);
  const [totalMinutes, setTotalMinutes] = useState(0);

  // Client-side hydration check
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load Settings from LocalStorage
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.mode) setActiveMode(parsed.mode);
        if (parsed.speed) setSpeedMultiplier(parsed.speed);
        if (parsed.color) setThemeColor(parsed.color);
    } else {
        // Circadian Defaults
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) setThemeColor("#0d9488"); // Morning Teal
        else if (hour >= 18 || hour < 5) setThemeColor("#ea580c"); // Night Amber
    }

    // Load Stats
    const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
    if (savedStats) {
        setTotalMinutes(JSON.parse(savedStats).totalMinutes || 0);
    }
  }, []);

  const [phase, setPhase] = useState<BreathingPhase>(BreathingPhase.Idle);
  const [isRunning, setIsRunning] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [muted, setMuted] = useState(false);
  
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

      audio.playCue('inhale');
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

  const handleAIRecommendation = (rec: AIRecommendation) => {
    setActiveMode(rec.recommendedMode);
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
             setInstruction(holdInDur > 0 ? "Hold breath..." : "Exhale...");
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
            setInstruction(holdInDur > 0 ? "Hold..." : "Exhale fully...");
            setScale(1);
        }
    }
    else if (phase === BreathingPhase.HoldIn) {
      currentPhaseDuration = holdInDur;
      progress = Math.min(timeSincePhaseStart / currentPhaseDuration, 1);
      setScale(1);

      if (timeSincePhaseStart >= currentPhaseDuration) {
        nextPhase = BreathingPhase.Exhale;
        setInstruction("Exhale slowly...");
      }
    } else if (phase === BreathingPhase.Exhale) {
      currentPhaseDuration = exhaleDur;
      progress = Math.min(timeSincePhaseStart / currentPhaseDuration, 1);
      setScale(1 - progress);

      if (timeSincePhaseStart >= currentPhaseDuration) {
        nextPhase = holdOutDur > 0 ? BreathingPhase.HoldOut : BreathingPhase.Inhale;
        setInstruction(holdOutDur > 0 ? "Hold empty..." : "Inhale...");
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
      
      if (nextPhase === BreathingPhase.Inhale || nextPhase === BreathingPhase.Inhale2) audio.playCue('inhale');
      else if (nextPhase === BreathingPhase.Exhale) audio.playCue('exhale');
      else audio.playCue('hold');
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [activeMode, isRunning, phase, speedMultiplier]);

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
          <div className="mt-4 bg-white/50 rounded-lg p-3 text-xs text-slate-600 space-y-3">
              <div className="grid grid-cols-4 gap-2 text-center divide-x divide-slate-300">
                  <div>
                    <span className="block font-bold text-slate-800">{(p.inhale * speedMultiplier).toFixed(1)}s</span>
                    <span className="text-[10px] uppercase tracking-wide opacity-70">Inhale</span>
                  </div>
                  {p.holdIn > 0 && (
                  <div>
                    <span className="block font-bold text-slate-800">{(p.holdIn * speedMultiplier).toFixed(1)}s</span>
                    <span className="text-[10px] uppercase tracking-wide opacity-70">Hold</span>
                  </div>
                  )}
                  <div>
                    <span className="block font-bold text-slate-800">{(p.exhale * speedMultiplier).toFixed(1)}s</span>
                    <span className="text-[10px] uppercase tracking-wide opacity-70">Exhale</span>
                  </div>
                  {p.holdOut > 0 && (
                  <div>
                    <span className="block font-bold text-slate-800">{(p.holdOut * speedMultiplier).toFixed(1)}s</span>
                    <span className="text-[10px] uppercase tracking-wide opacity-70">Hold</span>
                  </div>
                  )}
              </div>

              <div className="border-t border-slate-300/50 pt-2 space-y-1">
                  <div className="flex items-center gap-2">
                      <Activity size={12} className="text-primary" />
                      <span className="font-semibold text-slate-700">{waveType}</span>
                      <span className="text-slate-400 ml-auto">{waveDesc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      {ambienceType.includes("Rain") ? <Wind size={12} className="text-blue-500"/> : <Waves size={12} className="text-indigo-500" />}
                      <span className="font-medium text-slate-700">{ambienceType}</span>
                      <span className="text-slate-400 ml-auto">8D Audio</span>
                  </div>
              </div>
          </div>
      )
  }

  if (!mounted) return null;

  return (
    <div className={`relative w-full h-full flex flex-col overflow-hidden transition-colors duration-1000 ${className}`}
         style={{ backgroundColor: isRunning ? `${themeColor}10` : '#fff7ed' }}>
      
      <ParticleBackground phase={phase} color={themeColor} speedMultiplier={speedMultiplier} />

      <header className={`relative z-20 p-6 flex justify-between items-start transition-opacity duration-500 ${zenMode && isRunning ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Resonance</h1>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
            Mindful Breathing 
            {totalMinutes > 0 && <span className="text-slate-400">• {totalMinutes}m Lifetime</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
            <div className="bg-white/40 rounded-full px-4 py-2 backdrop-blur-sm text-sm font-semibold text-slate-700 shadow-sm border border-white/50 tabular-nums">
                {Math.floor(sessionSeconds / 60)}:{String(sessionSeconds % 60).padStart(2, '0')}
            </div>
            <button 
                onClick={() => setZenMode(!zenMode)}
                className="p-3 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur transition-all text-slate-700 shadow-sm border border-white/50"
                title="Zen Mode"
            >
                {zenMode ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button 
                onClick={toggleMute}
                className="p-3 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur transition-all text-slate-700 shadow-sm border border-white/50"
            >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10">
        
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

        <div className={`mt-12 w-full max-w-md px-6 transition-all duration-700 transform ${zenMode && isRunning ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
            
            {aiReasoning && (
                <div className="mb-6 bg-white/60 backdrop-blur border border-white/60 p-4 rounded-xl text-sm text-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    <span className="font-semibold text-primary block mb-1">AI Suggestion:</span>
                    {aiReasoning}
                    <button 
                        onClick={() => setAiReasoning(null)} 
                        className="text-xs text-slate-400 underline ml-2 hover:text-primary"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-6">
                {!isRunning && (
                    <div className="glass-panel p-1 rounded-xl flex flex-wrap justify-between gap-1">
                        {Object.values(BREATHING_PATTERNS).map((m) => (
                            <button
                                key={m.name}
                                onClick={() => {
                                    setActiveMode(m.name);
                                    setAiReasoning(null); 
                                }}
                                className={`flex-1 py-2 px-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeMode === m.name ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-white/30'}`}
                            >
                                {m.name === ModeName.Sigh ? "Sigh" : m.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                )}

                 {!isRunning && (
                    <div className="space-y-4 px-2">
                         <div className="flex justify-between items-center">
                             <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Pattern</span>
                             <span className="text-sm text-slate-700 font-medium">{currentPattern.description}</span>
                         </div>
                         <div className="flex flex-col gap-2">
                             <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Speed</span>
                                <span className="text-sm text-slate-700 font-medium">{speedMultiplier.toFixed(1)}x</span>
                             </div>
                             <input 
                                type="range" 
                                min="0.5" 
                                max="2.0" 
                                step="0.1" 
                                value={speedMultiplier}
                                onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                             />
                         </div>
                         
                         {renderStats()}
                    </div>
                 )}
            </div>
        </div>
      </main>

      <footer className={`relative z-20 p-6 flex justify-center transition-opacity duration-500 ${zenMode && isRunning ? 'opacity-0' : 'opacity-100'}`}>
        <AIAdvisor onRecommendation={handleAIRecommendation} apiKey={apiKey} />
      </footer>
    </div>
  );
};

export default Resonance;
