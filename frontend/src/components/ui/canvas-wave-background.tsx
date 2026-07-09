'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createNoise2D } from 'simplex-noise';
import { cn } from '@/lib/utils';

interface CanvasWaveBackgroundProps {
  className?: string;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  colors?: string[];
  blur?: number;
  opacity?: number;
}

export function CanvasWaveBackground({
  className,
  speed = 0.002,
  amplitude = 50,
  frequency = 0.001,
  colors = ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'],
  blur = 0,
  opacity = 0.5,
}: CanvasWaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const noise2DRef = useRef(createNoise2D());
  const rafIdRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const isReducedMotionRef = useRef(false);

  // Hydration safety
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reduced motion listener
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotionRef.current = mq.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches;
      if (isReducedMotionRef.current && rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
        // Draw one static frame
        drawFrame(0);
      } else if (!isReducedMotionRef.current && !rafIdRef.current) {
        animate();
      }
    };
    mq.addEventListener('change', handleMotionChange);

    let width = 0;
    let height = 0;

    const resize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);
      
      if (isReducedMotionRef.current) {
        drawFrame(0);
      }
    };

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      
      const noise2D = noise2DRef.current;
      const linesCount = colors.length;
      
      for (let i = 0; i < linesCount; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = colors[i]!;
        
        // Draw line across the screen horizontally
        const yOffset = (height / (linesCount + 1)) * (i + 1);
        
        for (let x = 0; x <= width; x += 5) {
          // Add some organic variation to frequency and amplitude based on the line index
          const freq = frequency * (1 + i * 0.2);
          const amp = amplitude * (1 + i * 0.1);
          
          const y = yOffset + noise2D(x * freq, t * speed + i * 100) * amp;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    };

    const animate = () => {
      if (isReducedMotionRef.current) return;
      timeRef.current += 1;
      drawFrame(timeRef.current);
      rafIdRef.current = requestAnimationFrame(animate);
    };

    // Initial setup
    resize();
    window.addEventListener('resize', resize);
    
    if (!isReducedMotionRef.current) {
      animate();
    } else {
      drawFrame(0);
    }

    return () => {
      window.removeEventListener('resize', resize);
      mq.removeEventListener('change', handleMotionChange);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isMounted, speed, amplitude, frequency, colors, blur]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none overflow-hidden", className)}
      style={{
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
}
