import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface H1Props {
  children: ReactNode;
  className?: string;
  variant?: 'public' | 'dashboard';
}

const variantStyles = {
  public: 'text-5xl font-bold tracking-tight sm:text-6xl lg:text-8xl',
  dashboard: 'text-2xl font-bold',
};

export function H1({ children, className, variant = 'public' }: H1Props) {
  return (
    <h1 className={cn(
      variantStyles[variant],
      'text-secondary-900 dark:text-secondary-100',
      className
    )}>
      {children}
    </h1>
  );
}
