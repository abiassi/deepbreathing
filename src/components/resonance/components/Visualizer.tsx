'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';
import { Play, Pause } from 'lucide-react';
import { BreathingPhase } from '../types';

interface VisualizerProps {
  phase: BreathingPhase;
  progress: number;
  color: string;
  label: string;
  instructions: string;
  isRunning: boolean;
  onClick: () => void;
}

export interface VisualizerHandle {
  setScale: (value: number) => void;
}

const Visualizer = forwardRef<VisualizerHandle, VisualizerProps>(
  ({ color, label, instructions, isRunning, onClick }, ref) => {
    const orbRef = useRef<HTMLButtonElement>(null);

    const setScale = useCallback((value: number) => {
      if (!orbRef.current) return;
      orbRef.current.style.transform = `scale(${0.6 + value * 0.4})`;
    }, []);

    useImperativeHandle(ref, () => ({ setScale }), [setScale]);

    useEffect(() => {
      setScale(0);
    }, [setScale]);

    const orbStyle = useMemo(
      () => ({
        boxShadow: `0 0 60px ${color}60, inset 0 0 40px ${color}AA`,
        background: `radial-gradient(circle at 30% 30%, ${color} 0%, ${color}DD 60%, ${color}AA 100%)`
      }),
      [color]
    );

    const glowStyle = useMemo(
      () => ({
        background: `radial-gradient(circle at 40% 40%, ${color}55, transparent 65%)`,
        filter: 'blur(40px)'
      }),
      [color]
    );

    const ringStyle = useMemo(
      () => ({
        borderColor: color,
        transform: 'scale(1.1)',
        animation: 'morph 25s ease-in-out infinite, hue-rotate 25s linear infinite'
      }),
      [color]
    );

    const transformStyle = {
      transition: isRunning ? 'none' : 'transform 100ms linear',
      animation: 'morph 10s ease-in-out infinite, hue-rotate 10s linear infinite'
    };

    return (
      <div className="relative z-10 flex h-80 w-80 flex-col items-center justify-center md:h-96 md:w-96">
        <div className="absolute z-10 h-full w-full rounded-full border opacity-20 transition-colors duration-700 pointer-events-none" style={ringStyle} />

        <div
          aria-hidden
          className="absolute inset-[-12%] z-0 rounded-full opacity-60 pointer-events-none animate-blob-slow"
          style={glowStyle}
        />

        <button
          ref={orbRef}
          onClick={onClick}
          className={`group absolute z-20 flex h-full w-full cursor-pointer items-center justify-center rounded-full outline-none hover:brightness-110 ${
            isRunning ? '' : 'transition-all duration-100 ease-linear'
          }`}
          style={{ ...orbStyle, ...transformStyle }}
          aria-label={isRunning ? 'Pause Session' : 'Start Session'}
        >
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              !isRunning ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <Play size={64} className="ml-2 fill-white text-white opacity-90 drop-shadow-md" />
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isRunning ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
            }`}
          >
            <div className="flex flex-col items-center transition-opacity duration-300 group-hover:opacity-0">
              <h2 className="text-4xl font-bold uppercase tracking-widest text-white opacity-90 drop-shadow-sm">{label}</h2>
            </div>
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isRunning ? 'scale-100 opacity-0 group-hover:opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <Pause size={56} className="fill-white text-white opacity-90 drop-shadow-md" />
          </div>
        </button>

        {!isRunning && instructions && instructions !== 'Ready to start?' && instructions !== 'Paused' && (
          <div className="pointer-events-none absolute -bottom-16 w-full text-center">
            <p className="text-lg font-medium tracking-wide text-muted-foreground">{instructions}</p>
          </div>
        )}
      </div>
    );
  }
);

export default Visualizer;
