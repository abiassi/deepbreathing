'use client';

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';
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

const VisualizerBase = forwardRef<VisualizerHandle, VisualizerProps>(
  ({ color, label, instructions, isRunning, onClick }, ref) => {
    const orbRef = useRef<HTMLButtonElement>(null);

    const setScale = useCallback((value: number) => {
      if (!orbRef.current) return;
      const scale = 0.6 + value * 0.4;
      orbRef.current.style.transform = `translateZ(0) scale(${scale})`;
      orbRef.current.style.willChange = 'transform';
    }, []);

    useImperativeHandle(ref, () => ({ setScale }), [setScale]);

    useEffect(() => {
      setScale(0);
    }, [setScale]);

    const orbStyle = useMemo(
      () => ({
        boxShadow: `0 0 40px ${color}60, inset 0 0 30px ${color}AA`,
        background: `radial-gradient(circle at 30% 30%, ${color} 0%, ${color}CC 70%, ${color}99 100%)`
      }),
      [color]
    );

    const glowStyle = useMemo(
      () => ({
        background: `radial-gradient(circle at 40% 40%, ${color}55, transparent 65%)`,
        filter: 'blur(32px)'
      }),
      [color]
    );

    const ringStyle = useMemo(
      () => ({
        borderColor: color,
        transform: 'scale(1.08)'
      }),
      [color]
    );

    const transformStyle = {
      transition: 'none',
      animation: 'none'
    };

    return (
      <div className="relative z-10 flex h-80 w-80 flex-col items-center justify-center md:h-96 md:w-96">
        <div className="absolute z-0 h-full w-full rounded-full opacity-30 pointer-events-none animate-blob-slow" style={glowStyle} />
        <div className="absolute z-10 h-full w-full rounded-full border opacity-20 pointer-events-none" style={ringStyle} />

        <button
          ref={orbRef}
          onClick={onClick}
          aria-label={isRunning ? 'Pause Session' : 'Start Session'}
          className="group absolute z-20 flex h-full w-full cursor-pointer items-center justify-center rounded-full outline-none transition-none hover:brightness-110"
          style={{ ...orbStyle, ...transformStyle }}
        >
          <span
            className={`text-xs uppercase tracking-[0.6em] text-white transition-opacity duration-300 ${
              isRunning ? 'opacity-80' : 'opacity-100'
            }`}
          >
            {isRunning ? 'Pause' : label}
          </span>
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

const Visualizer = memo(VisualizerBase);
Visualizer.displayName = 'Visualizer';

export default Visualizer;
