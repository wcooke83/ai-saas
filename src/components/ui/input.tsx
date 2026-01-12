import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, style, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-secondary-300 dark:border-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 ring-offset-white dark:ring-offset-secondary-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary-400 dark:placeholder:text-secondary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          // Autofill styling - force background color to match input in all states
          '[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:[-webkit-text-fill-color:#171717]',
          '[&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_white]',
          '[&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_white]',
          '[&:-webkit-autofill:active]:shadow-[inset_0_0_0px_1000px_white]',
          // Dark mode autofill - rgb(12,19,37) is secondary-825
          'dark:[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(12,19,37)] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f5f5f5]',
          'dark:[&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_rgb(12,19,37)]',
          'dark:[&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_rgb(12,19,37)]',
          'dark:[&:-webkit-autofill:active]:shadow-[inset_0_0_0px_1000px_rgb(12,19,37)]',
          className
        )}
        style={{
          backgroundColor: 'rgb(var(--form-element-bg))',
          ...style,
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
