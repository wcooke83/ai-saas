'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:ring-offset-secondary-900 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-white',
        destructive: 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500',
        outline: 'border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-200',
        // For buttons on dark/colored backgrounds
        'outline-light': 'border border-white bg-transparent text-white hover:bg-white/10',
        secondary: 'bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 hover:bg-secondary-200 dark:hover:bg-secondary-600',
        ghost: 'hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300',
        // For ghost buttons on dark/colored backgrounds
        'ghost-light': 'text-white hover:bg-white/10',
        link: 'text-primary-500 dark:text-primary-400 underline-offset-4 hover:underline',
        success: 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const [isHovered, setIsHovered] = React.useState(false);

    // Get CSS variable-based styles for specific variants
    const getVariantStyles = (): React.CSSProperties => {
      if (variant === 'default' || variant === undefined) {
        return {
          backgroundColor: isHovered
            ? 'rgb(var(--primary-button-hover-bg))'
            : 'rgb(var(--primary-button-bg))',
        };
      }
      if (variant === 'outline') {
        return {
          backgroundColor: isHovered
            ? 'rgb(var(--secondary-button-hover-bg))'
            : 'rgb(var(--secondary-button-bg))',
        };
      }
      return {};
    };

    // Only apply hover handlers for variants that use CSS variables
    const needsHoverHandlers = variant === 'default' || variant === 'outline' || variant === undefined;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{
          ...getVariantStyles(),
          ...style,
        }}
        ref={ref}
        onMouseEnter={(e) => {
          if (needsHoverHandlers) setIsHovered(true);
          props.onMouseEnter?.(e as React.MouseEvent<HTMLButtonElement>);
        }}
        onMouseLeave={(e) => {
          if (needsHoverHandlers) setIsHovered(false);
          props.onMouseLeave?.(e as React.MouseEvent<HTMLButtonElement>);
        }}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
