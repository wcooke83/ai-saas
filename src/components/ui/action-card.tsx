'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

const ACTION_CARD_GRADIENT_COOKIE_NAME = 'theme-action-card-gradient-enabled';
const ACTION_CARD_BORDER_COOKIE_NAME = 'theme-action-card-border-enabled';

function getActionCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const match = document.cookie.match(new RegExp(`(^| )${ACTION_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
    if (match) {
      return match[2] === 'true';
    }
  } catch (e) {
    console.error('Failed to parse action card gradient cookie:', e);
  }
  return false;
}

function getActionCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const match = document.cookie.match(new RegExp(`(^| )${ACTION_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
    if (match) {
      return match[2] === 'true';
    }
  } catch (e) {
    console.error('Failed to parse action card border cookie:', e);
  }
  return true;
}

export interface ActionCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  showArrow?: boolean;
}

export function ActionCard({
  href,
  icon: Icon,
  title,
  description,
  badge,
  className,
  iconClassName,
  showArrow = true,
}: ActionCardProps) {
  const [useGradient, setUseGradient] = React.useState(false);
  const [showBorder, setShowBorder] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    const checkGradientState = () => {
      const attr = document.documentElement.getAttribute('data-action-card-gradient-enabled');
      if (attr !== null) {
        setUseGradient(attr === 'true');
      } else {
        setUseGradient(getActionCardGradientEnabledFromCookie());
      }
    };

    const checkBorderState = () => {
      const attr = document.documentElement.getAttribute('data-action-card-border-enabled');
      if (attr !== null) {
        setShowBorder(attr === 'true');
      } else {
        setShowBorder(getActionCardBorderEnabledFromCookie());
      }
    };

    checkGradientState();
    checkBorderState();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          if (mutation.attributeName === 'data-action-card-gradient-enabled') {
            checkGradientState();
          }
          if (mutation.attributeName === 'data-action-card-border-enabled') {
            checkBorderState();
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-action-card-gradient-enabled', 'data-action-card-border-enabled'],
    });

    return () => observer.disconnect();
  }, []);

  const backgroundStyle = useGradient
    ? isHovered
      ? { background: 'linear-gradient(to bottom, rgb(var(--action-card-hover-bg-gradient-from)), rgb(var(--action-card-hover-bg-gradient-to)))' }
      : { background: 'linear-gradient(to bottom, rgb(var(--action-card-bg-gradient-from)), rgb(var(--action-card-bg-gradient-to)))' }
    : isHovered
      ? { backgroundColor: 'rgb(var(--action-card-hover-bg))' }
      : { backgroundColor: 'rgb(var(--action-card-bg))' };

  const borderStyle = showBorder
    ? isHovered
      ? { borderColor: 'rgb(var(--action-card-hover-border))' }
      : { borderColor: 'rgb(var(--action-card-border))' }
    : { borderColor: 'transparent' };

  const iconBgStyle = isHovered
    ? { backgroundColor: 'rgb(var(--action-card-icon-hover-bg))' }
    : { backgroundColor: 'rgb(var(--action-card-icon-bg))' };

  const iconColorStyle = isHovered
    ? { color: 'rgb(var(--action-card-icon-hover-color))' }
    : { color: 'rgb(var(--action-card-icon-color))' };

  return (
    <Link
      href={href}
      className={cn(
        'group block border shadow-sm transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        className
      )}
      style={{
        ...backgroundStyle,
        ...borderStyle,
        borderRadius: 'var(--action-card-radius)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 flex items-start gap-4">
        <div
          className={cn(
            'flex-shrink-0 p-2.5 rounded-lg transition-colors duration-200',
            iconClassName
          )}
          style={iconBgStyle}
        >
          <Icon
            className="w-5 h-5 transition-colors duration-200"
            style={iconColorStyle}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className="font-medium transition-colors duration-200"
              style={{ color: 'rgb(var(--action-card-heading))' }}
            >
              {title}
            </h3>
            {badge}
          </div>
          {description && (
            <p
              className="text-sm mt-1 transition-colors duration-200"
              style={{ color: 'rgb(var(--action-card-text-secondary))' }}
            >
              {description}
            </p>
          )}
        </div>
        {showArrow && (
          <ChevronRight
            className="w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:translate-x-0.5"
            style={iconColorStyle}
          />
        )}
      </div>
    </Link>
  );
}

export default ActionCard;
