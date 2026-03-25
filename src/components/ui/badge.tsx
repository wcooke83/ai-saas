import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-secondary-900',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-500 text-white dark:bg-primary-600',
        secondary: 'border-transparent bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100',
        destructive: 'border-transparent bg-red-500 text-white dark:bg-red-600',
        outline: 'border-secondary-300 dark:border-secondary-400 text-secondary-700 dark:text-secondary-300',
        success: 'border-transparent bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
        warning: 'border-transparent bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
