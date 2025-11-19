'use client';

import React, { useMemo } from 'react';
import { BreathingPhase } from '../types';
import { Play, Pause } from 'lucide-react';

interface VisualizerProps {
  phase: BreathingPhase;
  progress: number; // 0 to 1 represents completion of current phase
  scale: number; // 0 to 1 relative scale
  color: string;
  label: string;
  instructions: string;
  isRunning: boolean;
  onClick: () => void;
}

const Visualizer: React.FC<VisualizerProps> = ({ scale, color, label, instructions, phase, isRunning, onClick }) => {
  
  // Dynamic shadow and solid background for "Orb" effect
  const orbStyle = useMemo(() => ({
    boxShadow: `0 0 60px ${color}60, inset 0 0 40px ${color}AA`, // Inner and outer glow
    background: `radial-gradient(circle at 30% 30%, ${color} 0%, ${color}DD 60%, ${color}AA 100%)`, // Solid gradient
  }), [color]);

  // Map scale (0-1) to pixel size or percentage
  const transformStyle = {
    transform: `scale(${0.6 + (scale * 0.4)})`, // Scales from 60% to 100%
    transition: 'transform 100ms linear'
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-80 w-80 md:h-96 md:w-96 z-10">
      {/* Outer Ring (Ghost) - Faint echo of the orb */}
      <div 
        className="absolute w-full h-full rounded-full border opacity-20 transition-colors duration-700 pointer-events-none animate-blob"
        style={{ borderColor: color, transform: 'scale(1.1)', animationDelay: '1s' }}
      />

      {/* Breathing Orb / Main Button */}
      <button 
        onClick={onClick}
        className="group absolute w-full h-full rounded-full transition-all duration-100 ease-linear flex items-center justify-center outline-none cursor-pointer animate-blob animate-hue hover:brightness-110"
        style={{ ...orbStyle, ...transformStyle }}
        aria-label={isRunning ? "Pause Session" : "Start Session"}
      >
        {/* Idle State: Play Icon */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${!isRunning ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
             <Play size={64} className="ml-2 fill-white text-white opacity-90 drop-shadow-md" />
        </div>

        {/* Running State: Text Label */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isRunning ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
             <div className="group-hover:opacity-0 transition-opacity duration-300 flex flex-col items-center">
                <h2 className="text-4xl font-bold tracking-widest uppercase text-white drop-shadow-sm opacity-90">
                  {label}
                </h2>
             </div>
        </div>
        
        {/* Running State: Hover Pause Icon */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isRunning ? 'opacity-0 group-hover:opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <Pause size={56} className="fill-white text-white opacity-90 drop-shadow-md" />
        </div>
      </button>

      {/* Instruction Text */}
      <div className="absolute -bottom-16 text-center w-full pointer-events-none">
          <p className="text-slate-500 font-medium animate-pulse tracking-wide text-lg">{instructions}</p>
      </div>
    </div>
  );
};

export default Visualizer;
