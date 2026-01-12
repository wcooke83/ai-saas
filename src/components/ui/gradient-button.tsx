'use client';

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type GradientType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'purple'
  | 'rainbow'
  | 'sunset'
  | 'ocean';

interface GradientButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  gradient?: GradientType;
  size?: 'default' | 'sm' | 'lg' | 'xl';
  loading?: boolean;
  glowEffect?: boolean;
  children?: ReactNode;
}

const gradients: Record<GradientType, string> = {
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
  secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-800',
  success: 'bg-gradient-to-r from-green-500 to-emerald-600',
  warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  danger: 'bg-gradient-to-r from-red-500 to-rose-600',
  purple: 'bg-gradient-to-r from-purple-500 to-indigo-600',
  rainbow: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500',
  sunset: 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500',
  ocean: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500',
};

const glowColors: Record<GradientType, string> = {
  primary: 'shadow-primary-500/50',
  secondary: 'shadow-secondary-500/50',
  success: 'shadow-green-500/50',
  warning: 'shadow-yellow-500/50',
  danger: 'shadow-red-500/50',
  purple: 'shadow-purple-500/50',
  rainbow: 'shadow-purple-500/50',
  sunset: 'shadow-pink-500/50',
  ocean: 'shadow-blue-500/50',
};

const sizes = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-9 px-3 text-xs',
  lg: 'h-11 px-8 text-base',
  xl: 'h-12 px-10 text-lg',
};

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      className,
      gradient = 'primary',
      size = 'default',
      loading = false,
      glowEffect = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-lg font-medium text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          gradients[gradient],
          sizes[size],
          glowEffect && `shadow-lg hover:shadow-xl ${glowColors[gradient]}`,
          className
        )}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Animated gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0"
          style={{
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <span className="relative flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {children}
        </span>
      </motion.button>
    );
  }
);

GradientButton.displayName = 'GradientButton';

// Animated gradient border button (outline style)
const GradientBorderButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      className,
      gradient = 'primary',
      size = 'default',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Gradient border */}
        <span
          className={cn(
            'absolute inset-0 rounded-lg p-[2px]',
            gradients[gradient]
          )}
        >
          <span className="absolute inset-[2px] rounded-[6px] bg-white dark:bg-secondary-900" />
        </span>

        {/* Content */}
        <span className="relative flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-primary-500" />}
          {children}
        </span>
      </motion.button>
    );
  }
);

GradientBorderButton.displayName = 'GradientBorderButton';

export { GradientButton, GradientBorderButton };
