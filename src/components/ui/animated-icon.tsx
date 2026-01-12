'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  hoverEffect?: 'bounce' | 'rotate' | 'scale' | 'shake' | 'pulse';
  isActive?: boolean;
}

const hoverVariants = {
  bounce: {
    rest: { y: 0 },
    hover: { y: [-2, 0, -2, 0], transition: { duration: 0.4 } },
  },
  rotate: {
    rest: { rotate: 0 },
    hover: { rotate: [0, -10, 10, 0], transition: { duration: 0.4 } },
  },
  scale: {
    rest: { scale: 1 },
    hover: { scale: 1.2, transition: { type: 'spring', stiffness: 400, damping: 10 } },
  },
  shake: {
    rest: { x: 0 },
    hover: { x: [-2, 2, -2, 2, 0], transition: { duration: 0.4 } },
  },
  pulse: {
    rest: { scale: 1 },
    hover: { scale: [1, 1.1, 1], transition: { duration: 0.3, repeat: Infinity } },
  },
};

const activeVariants = {
  initial: { scale: 1 },
  active: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.3 }
  },
};

export function AnimatedIcon({
  icon: Icon,
  className,
  hoverEffect = 'bounce',
  isActive = false,
}: AnimatedIconProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate={isActive ? 'active' : 'initial'}
      variants={{
        ...hoverVariants[hoverEffect],
        ...activeVariants,
      }}
      className={cn('inline-flex', className)}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
    </motion.div>
  );
}

// Wrapper for icon with continuous animation
export function PulsingIcon({
  icon: Icon,
  className,
  color = 'text-primary-500',
}: {
  icon: LucideIcon;
  className?: string;
  color?: string;
}) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={cn('inline-flex', className)}
    >
      <Icon className={cn('w-5 h-5', color)} aria-hidden="true" />
    </motion.div>
  );
}

// Icon with loading spinner effect
export function SpinningIcon({
  icon: Icon,
  className,
  duration = 1,
}: {
  icon: LucideIcon;
  className?: string;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={cn('inline-flex', className)}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
    </motion.div>
  );
}
