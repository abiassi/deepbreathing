import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import React from 'react';
import { BREATHING_PATTERNS } from '@/components/resonance/constants';
import { ModeName } from '@/components/resonance/types';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Default to Box Breathing for homepage
    const pattern = BREATHING_PATTERNS[ModeName.Box];
    const color = pattern.color;
    const title = 'Interactive Breathing Visualizer';

    // Convert hex to RGB for use in gradients
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 225, g: 29, b: 72 }; // Default to rose
    };

    const rgb = hexToRgb(color);
    const colorRgba = (alpha: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${colorRgba(0.1)} 0%, ${colorRgba(0.05)} 50%, ${colorRgba(0.1)} 100%)`,
            position: 'relative',
          }}
        >
          {/* Background particles effect */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.3,
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => {
              const size = Math.random() * 4 + 2;
              const x = Math.random() * 1200;
              const y = Math.random() * 630;
              const opacity = Math.random() * 0.5 + 0.2;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    background: color,
                    opacity,
                  }}
                />
              );
            })}
          </div>

          {/* Outer glow ring */}
          <div
            style={{
              position: 'absolute',
              width: 500,
              height: 500,
              borderRadius: '50%',
              border: `2px solid ${colorRgba(0.2)}`,
              transform: 'scale(1.1)',
            }}
          />

          {/* Main orb with gradient */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${color} 0%, ${color}DD 60%, ${color}AA 100%)`,
              boxShadow: `0 0 60px ${colorRgba(0.6)}, inset 0 0 40px ${colorRgba(0.7)}`,
              position: 'relative',
            }}
          >
            {/* Inner glow */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: `radial-gradient(circle at 40% 40%, ${colorRgba(0.55)}, transparent 65%)`,
                filter: 'blur(40px)',
              }}
            />

            {/* Title text */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 42,
                fontWeight: 700,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                lineHeight: 1.1,
                padding: '0 40px',
                zIndex: 10,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {title.split(' ').slice(0, 3).join(' ')}
            </div>
          </div>

          {/* Subtitle */}
          <div
            style={{
              position: 'absolute',
              bottom: 80,
              display: 'flex',
              alignItems: 'center',
              color: color,
              fontSize: 24,
              fontWeight: 500,
              opacity: 0.9,
            }}
          >
            Deep Breathing Exercises
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

