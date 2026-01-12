'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const GRADIENT_COOKIE_NAME = 'theme-gradient-enabled';

function getGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const match = document.cookie.match(new RegExp(`(^| )${GRADIENT_COOKIE_NAME}=([^;]+)`));
    if (match) {
      return match[2] === 'true';
    }
  } catch (e) {
    console.error('Failed to parse gradient cookie:', e);
  }
  return true; // Default to enabled
}

interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function PageBackground({ children, className }: PageBackgroundProps) {
  const [gradientEnabled, setGradientEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setGradientEnabled(getGradientEnabledFromCookie());

    // Listen for changes to the data-gradient-enabled attribute
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-gradient-enabled') {
          const enabled = document.documentElement.getAttribute('data-gradient-enabled') === 'true';
          console.log('[PageBackground] Detected attribute change, enabled =', enabled);
          setGradientEnabled(enabled);
          break;
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const backgroundStyle = mounted
    ? gradientEnabled
      ? { background: 'linear-gradient(to bottom, rgb(var(--page-gradient-from)), rgb(var(--page-gradient-to)))' }
      : { backgroundColor: 'rgb(var(--page-bg))' }
    : { background: 'linear-gradient(to bottom, rgb(var(--page-gradient-from)), rgb(var(--page-gradient-to)))' };

  return (
    <div className={cn('min-h-screen', className)} style={backgroundStyle}>
      {children}
    </div>
  );
}
