'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if the user prefers reduced motion
 * Returns true if the user has requested reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Returns animation settings based on user preference
 * If reduced motion is preferred, returns minimal/no animation
 */
export function useMotionPreference() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,
    // Animation duration - 0 for reduced motion
    duration: prefersReducedMotion ? 0 : undefined,
    // Transition settings
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { type: 'spring', stiffness: 400, damping: 17 },
    // Hover animation
    whileHover: prefersReducedMotion ? {} : { scale: 1.02 },
    // Tap animation
    whileTap: prefersReducedMotion ? {} : { scale: 0.98 },
    // Fade in animation
    fadeIn: prefersReducedMotion
      ? { initial: {}, animate: {} }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
        },
    // Slide in animation
    slideIn: prefersReducedMotion
      ? { initial: {}, animate: {} }
      : {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
        },
  };
}
