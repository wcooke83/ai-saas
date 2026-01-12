'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const CARD_GRADIENT_COOKIE_NAME = 'theme-card-gradient-enabled';
const CARD_BORDER_COOKIE_NAME = 'theme-card-border-enabled';

function getCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const match = document.cookie.match(new RegExp(`(^| )${CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
    if (match) {
      return match[2] === 'true';
    }
  } catch (e) {
    console.error('Failed to parse card gradient cookie:', e);
  }
  return false; // Default to disabled
}

function getCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const match = document.cookie.match(new RegExp(`(^| )${CARD_BORDER_COOKIE_NAME}=([^;]+)`));
    if (match) {
      return match[2] === 'true';
    }
  } catch (e) {
    console.error('Failed to parse card border cookie:', e);
  }
  return true; // Default to enabled
}

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const [useGradient, setUseGradient] = React.useState(false);
  const [showBorder, setShowBorder] = React.useState(true);

  React.useEffect(() => {
    // Check the data attribute first, then fall back to cookie
    const checkGradientState = () => {
      const attr = document.documentElement.getAttribute('data-card-gradient-enabled');
      if (attr !== null) {
        setUseGradient(attr === 'true');
      } else {
        setUseGradient(getCardGradientEnabledFromCookie());
      }
    };

    const checkBorderState = () => {
      const attr = document.documentElement.getAttribute('data-card-border-enabled');
      if (attr !== null) {
        setShowBorder(attr === 'true');
      } else {
        setShowBorder(getCardBorderEnabledFromCookie());
      }
    };

    checkGradientState();
    checkBorderState();

    // Watch for attribute changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          if (mutation.attributeName === 'data-card-gradient-enabled') {
            checkGradientState();
          }
          if (mutation.attributeName === 'data-card-border-enabled') {
            checkBorderState();
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-card-gradient-enabled', 'data-card-border-enabled'],
    });

    return () => observer.disconnect();
  }, []);

  const backgroundStyle = useGradient
    ? { background: 'linear-gradient(to bottom, rgb(var(--card-gradient-from)), rgb(var(--card-gradient-to)))' }
    : { backgroundColor: 'rgb(var(--card-bg))' };

  const borderStyle = showBorder
    ? { borderColor: 'rgb(var(--card-border))' }
    : { borderColor: 'transparent' };

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border shadow-sm',
        className
      )}
      style={{
        ...backgroundStyle,
        ...borderStyle,
        ...style,
      }}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-secondary-500 dark:text-secondary-200', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
