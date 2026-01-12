'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';
import { forwardRef, ReactNode } from 'react';

interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  hoverEffect?: 'lift' | 'glow' | 'border' | 'none';
  delay?: number;
  children?: ReactNode;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, hoverEffect = 'lift', delay = 0, children, ...props }, ref) => {
    const hoverEffects = {
      lift: {
        hover: { y: -4, boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)' },
        tap: { y: 0, scale: 0.98 },
      },
      glow: {
        hover: { boxShadow: '0 0 30px rgba(14, 165, 233, 0.2)' },
        tap: { scale: 0.98 },
      },
      border: {
        hover: { borderColor: 'rgba(14, 165, 233, 0.5)' },
        tap: { scale: 0.98 },
      },
      none: {
        hover: {},
        tap: {},
      },
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3, ease: 'easeOut' }}
        whileHover={hoverEffects[hoverEffect].hover}
        whileTap={hoverEffects[hoverEffect].tap}
        className={cn('transition-colors', className)}
        {...props}
      >
        <Card className="h-full">{children}</Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

export { AnimatedCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
