'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
  delayDuration?: number;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  className,
  delayDuration = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [mounted, setMounted] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Ensure we only render portal on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const showTooltip = React.useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayDuration);
  }, [delayDuration]);

  const hideTooltip = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  React.useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    // Calculate position based on side (using viewport coordinates)
    switch (side) {
      case 'top':
        x = trigger.left + trigger.width / 2;
        y = trigger.top - tooltip.height - 8;
        break;
      case 'bottom':
        x = trigger.left + trigger.width / 2;
        y = trigger.bottom + 8;
        break;
      case 'left':
        x = trigger.left - tooltip.width - 8;
        y = trigger.top + trigger.height / 2;
        break;
      case 'right':
        x = trigger.right + 8;
        y = trigger.top + trigger.height / 2;
        break;
    }

    // Adjust for alignment
    if (side === 'top' || side === 'bottom') {
      switch (align) {
        case 'start':
          x = trigger.left;
          break;
        case 'center':
          // x is already centered
          x = x - tooltip.width / 2;
          break;
        case 'end':
          x = trigger.right - tooltip.width;
          break;
      }
    } else {
      switch (align) {
        case 'start':
          y = trigger.top;
          break;
        case 'center':
          y = y - tooltip.height / 2;
          break;
        case 'end':
          y = trigger.bottom - tooltip.height;
          break;
      }
    }

    // Keep tooltip within viewport bounds
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltip.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltip.height - padding));

    setPosition({ x, y });
  }, [isVisible, side, align]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltipContent = isVisible && mounted && (
    <div
      ref={tooltipRef}
      role="tooltip"
      className={cn(
        'fixed z-[99999] px-3 py-1.5 text-xs font-medium rounded-md shadow-md',
        'animate-in fade-in-0 zoom-in-95 duration-100',
        'break-words',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        backgroundColor: 'rgb(var(--tooltip-bg, 15 23 42))',
        color: 'rgb(var(--tooltip-text, 248 250 252))',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgb(var(--tooltip-border, 51 65 85))',
        minWidth: 'var(--tooltip-min-width, 12rem)',
        maxWidth: 'var(--tooltip-max-width, 14rem)',
      }}
    >
      {content}
      {/* Arrow - hidden since positioning varies with portal */}
    </div>
  );

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {mounted && typeof document !== 'undefined' && createPortal(tooltipContent, document.body)}
    </div>
  );
}

// Info icon with tooltip - common pattern
interface InfoTooltipProps {
  content: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function InfoTooltip({ content, side = 'top', className }: InfoTooltipProps) {
  return (
    <Tooltip content={content} side={side}>
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center w-4 h-4 rounded-full',
          'text-secondary-400 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-300',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
          'transition-colors',
          className
        )}
        aria-label="More information"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 .75.75 0 011.06 1.06zM10 15a1 1 0 01-1-1v-3a1 1 0 112 0v3a1 1 0 01-1 1z"
            clipRule="evenodd"
          />
          <path d="M10 8.5a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      </button>
    </Tooltip>
  );
}
