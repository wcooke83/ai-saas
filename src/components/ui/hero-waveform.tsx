'use client';

import { useEffect, useRef } from 'react';

interface HeroWaveformProps {
  className?: string;
  fadeAtBottom?: boolean;
}

interface Pulse {
  x: number;
  y: number;
  elapsed: number;
  lifetime: number;
  hasInner: boolean;
}

const MIN_PULSES = 1;
const MAX_PULSES = 3;

function createPulse(width: number, height: number, elapsed = 0): Pulse {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    elapsed,
    lifetime: 4000 + Math.random() * 2000,
    hasInner: Math.random() < 0.33,
  };
}

function drawRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  maxRadius: number,
) {
  const radius = progress * maxRadius;
  const opacity = 0.12 * (1 - progress);
  const lineWidth = 1 - progress * 0.5;
  if (opacity <= 0 || radius <= 0) return;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(14, 165, 233, ${opacity})`;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

export function HeroWaveform({ className, fadeAtBottom = true }: HeroWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let logicalWidth = 0;
    let logicalHeight = 0;
    let lastTime = 0;
    let pulses: Pulse[] = [];

    function setSize() {
      const dpr = window.devicePixelRatio || 1;
      logicalWidth = canvas!.offsetWidth;
      logicalHeight = canvas!.offsetHeight;
      canvas!.width = logicalWidth * dpr;
      canvas!.height = logicalHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seedPulses() {
      const count = MIN_PULSES + Math.floor(Math.random() * (MAX_PULSES - MIN_PULSES + 1));
      pulses = Array.from({ length: count }, () =>
        createPulse(logicalWidth, logicalHeight, Math.random() * 5000)
      );
    }

    function drawFrame(delta: number) {
      ctx!.clearRect(0, 0, logicalWidth, logicalHeight);
      const maxRadius = Math.min(logicalWidth, logicalHeight) * 0.38;

      for (const pulse of pulses) {
        pulse.elapsed += delta;
        const progress = pulse.elapsed / pulse.lifetime;
        drawRing(ctx!, pulse.x, pulse.y, progress, maxRadius);
        if (pulse.hasInner) {
          const innerProgress = Math.max(0, (pulse.elapsed - 800) / pulse.lifetime);
          drawRing(ctx!, pulse.x, pulse.y, innerProgress, maxRadius * 0.75);
        }
      }

      // replace exhausted pulses
      pulses = pulses.filter(p => p.elapsed < p.lifetime);
      while (pulses.length < MIN_PULSES) {
        pulses.push(createPulse(logicalWidth, logicalHeight));
      }
      if (pulses.length < MAX_PULSES && Math.random() < 0.005) {
        pulses.push(createPulse(logicalWidth, logicalHeight));
      }
    }

    function tick(now: number) {
      const delta = lastTime ? now - lastTime : 0;
      lastTime = now;
      drawFrame(delta);
      rafId = requestAnimationFrame(tick);
    }

    setSize();
    seedPulses();

    const observer = new ResizeObserver(() => {
      setSize();
      if (prefersReduced) drawFrame(0);
    });
    observer.observe(canvas);

    // Scroll-fade: fade the canvas out as the footer enters the viewport
    let scrollCleanup: (() => void) | undefined;
    if (fadeAtBottom) {
      const handleScroll = () => {
        const footerEl = document.querySelector('footer');
        const footerHeight = footerEl?.offsetHeight ?? 200;
        const pageHeight = document.documentElement.scrollHeight;
        const scrollBottom = window.scrollY + window.innerHeight;
        const fadeStart = pageHeight - footerHeight - 200;
        const fadeEnd = pageHeight - footerHeight;
        const opacity = 1 - Math.max(0, Math.min(1, (scrollBottom - fadeStart) / (fadeEnd - fadeStart)));
        canvas!.style.opacity = String(opacity);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // apply correct opacity on mount in case page starts scrolled
      scrollCleanup = () => window.removeEventListener('scroll', handleScroll);
    }

    if (prefersReduced) {
      drawFrame(0);
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      scrollCleanup?.();
    };
  }, [fadeAtBottom]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    />
  );
}
