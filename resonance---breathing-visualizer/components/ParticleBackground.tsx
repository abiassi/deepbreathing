import React, { useEffect, useRef } from 'react';
import { BreathingPhase } from '../types';

interface ParticleProps {
  phase: BreathingPhase;
  color: string;
  speedMultiplier: number;
}

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 3 + 1;
    // Base random drift velocity
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.alpha = Math.random() * 0.5 + 0.1;
  }

  // Reset particle to a random position on the screen edges
  resetToEdge(w: number, h: number) {
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    if (edge === 0) { this.x = Math.random() * w; this.y = 0; }
    else if (edge === 1) { this.x = w; this.y = Math.random() * h; }
    else if (edge === 2) { this.x = Math.random() * w; this.y = h; }
    else { this.x = 0; this.y = Math.random() * h; }
    this.alpha = 0; // Fade in
  }

  // Reset particle to a random position near the center
  resetToCenter(w: number, h: number) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 50; // Start slightly off-center
    this.x = w / 2 + Math.cos(angle) * radius;
    this.y = h / 2 + Math.sin(angle) * radius;
    this.alpha = 0; // Fade in
  }

  update(radialSpeed: number, driftSpeed: number, w: number, h: number) {
    // Fade in effect if alpha was reset
    if (this.alpha < 0.5) this.alpha += 0.01;

    const cx = w / 2;
    const cy = h / 2;
    const dx = this.x - cx;
    const dy = this.y - cy;
    const dist = Math.hypot(dx, dy);

    // Apply Radial Velocity (Inward/Outward)
    if (dist > 0.1) {
        const uX = dx / dist;
        const uY = dy / dist;
        this.x += uX * radialSpeed;
        this.y += uY * radialSpeed;
    }

    // Apply Drift Velocity (Random noise)
    this.x += this.speedX * driftSpeed;
    this.y += this.speedY * driftSpeed;

    // --- Boundary & Respawn Logic ---

    // Case 1: Strong Inhale (Sucking in)
    // If particle gets too close to center, respawn at edge
    if (radialSpeed < -1 && dist < 30) {
        this.resetToEdge(w, h);
    }
    // Case 2: Strong Exhale (Blowing out)
    // If particle goes off screen, respawn near center
    else if (radialSpeed > 1 && (this.x < 0 || this.x > w || this.y < 0 || this.y > h)) {
        this.resetToCenter(w, h);
    }
    // Case 3: Idle/Hold (Drift)
    // Standard screen wrapping
    else {
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, colorHex: string) {
    ctx.fillStyle = colorHex + Math.floor(Math.min(this.alpha, 0.6) * 255).toString(16).padStart(2, '0');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const ParticleBackground: React.FC<ParticleProps> = ({ phase, color, speedMultiplier }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  
  // Two speed factors: Radial (In/Out) and Drift (Random Chaos)
  const smoothedRadialSpeedRef = useRef<number>(0);
  const smoothedDriftSpeedRef = useRef<number>(0.2);
  
  // Refs to hold latest props for the animation loop
  const phaseRef = useRef(phase);
  const colorRef = useRef(color);
  const speedMultiplierRef = useRef(speedMultiplier);

  useEffect(() => {
    phaseRef.current = phase;
    colorRef.current = color;
    speedMultiplierRef.current = speedMultiplier;
  }, [phase, color, speedMultiplier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initParticles = () => {
        particles.current = Array.from({ length: 80 }, () => new Particle(canvas.width, canvas.height));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', resize);
    resize(); 

    let animationFrameId: number;

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const currentPhase = phaseRef.current;
      const currentColor = colorRef.current;
      const currentMultiplier = speedMultiplierRef.current;

      // Determine target speeds based on phase
      let targetRadialSpeed = 0;
      let targetDriftSpeed = 0.2;

      if (currentPhase === BreathingPhase.Inhale) {
          // Inhale: Particles move Inward (negative radial speed)
          targetRadialSpeed = -3.5;
          targetDriftSpeed = 0.5; // Slightly more chaos
      } else if (currentPhase === BreathingPhase.Exhale) {
          // Exhale: Particles move Outward (positive radial speed)
          // Reduced from 3.5 to 1.2 (approx 1/3) for gentler exhale
          targetRadialSpeed = 1.2; 
          targetDriftSpeed = 0.5;
      } else if (currentPhase === BreathingPhase.HoldIn || currentPhase === BreathingPhase.HoldOut) {
          // Hold: Suspended
          targetRadialSpeed = 0;
          // Increased from 0.1 to 0.6 so they float/drift more noticeably in space
          targetDriftSpeed = 0.6; 
      } else {
          // Idle
          targetRadialSpeed = 0;
          targetDriftSpeed = 0.3;
      }

      // Apply user speed multiplier to the intensity
      targetRadialSpeed *= currentMultiplier;
      
      // Smoothly interpolate (Lerp) current values towards targets
      // Using 0.05 for a smooth, heavy feel
      smoothedRadialSpeedRef.current += (targetRadialSpeed - smoothedRadialSpeedRef.current) * 0.05;
      smoothedDriftSpeedRef.current += (targetDriftSpeed - smoothedDriftSpeedRef.current) * 0.05;

      particles.current.forEach(p => {
        p.update(smoothedRadialSpeedRef.current, smoothedDriftSpeedRef.current, canvas.width, canvas.height);
        p.draw(ctx, currentColor);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000 opacity-70" 
    />
  );
};

export default ParticleBackground;