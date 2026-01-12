'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      position="top-right"
      expand={false}
      richColors
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:shadow-lg group-[.toaster]:border group-[.toaster]:rounded-lg ' +
            'group-[.toaster]:bg-[rgb(var(--card-bg))] group-[.toaster]:border-[rgb(var(--card-border))] ' +
            'group-[.toaster]:text-secondary-900 dark:group-[.toaster]:text-secondary-100',
          title: 'group-[.toast]:font-semibold group-[.toast]:text-sm',
          description: 'group-[.toast]:text-secondary-600 dark:group-[.toast]:text-secondary-400 group-[.toast]:text-sm',
          actionButton:
            'group-[.toast]:bg-primary-500 group-[.toast]:text-white group-[.toast]:hover:bg-primary-600 ' +
            'group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium',
          cancelButton:
            'group-[.toast]:bg-secondary-100 group-[.toast]:text-secondary-600 dark:group-[.toast]:bg-secondary-800 ' +
            'dark:group-[.toast]:text-secondary-400 group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 ' +
            'group-[.toast]:text-sm group-[.toast]:font-medium',
          closeButton:
            'group-[.toast]:text-secondary-400 group-[.toast]:hover:text-secondary-600 ' +
            'dark:group-[.toast]:text-secondary-500 dark:group-[.toast]:hover:text-secondary-300',
          // Success toast styling
          success:
            'group-[.toaster]:bg-green-50 dark:group-[.toaster]:bg-green-900/20 ' +
            'group-[.toaster]:border-green-200 dark:group-[.toaster]:border-green-800 ' +
            'group-[.toaster]:text-green-800 dark:group-[.toaster]:text-green-200 ' +
            '[&_[data-icon]]:text-green-500',
          // Error toast styling
          error:
            'group-[.toaster]:bg-red-50 dark:group-[.toaster]:bg-red-900/20 ' +
            'group-[.toaster]:border-red-200 dark:group-[.toaster]:border-red-800 ' +
            'group-[.toaster]:text-red-800 dark:group-[.toaster]:text-red-200 ' +
            '[&_[data-icon]]:text-red-500',
          // Warning toast styling
          warning:
            'group-[.toaster]:bg-amber-50 dark:group-[.toaster]:bg-amber-900/20 ' +
            'group-[.toaster]:border-amber-200 dark:group-[.toaster]:border-amber-800 ' +
            'group-[.toaster]:text-amber-800 dark:group-[.toaster]:text-amber-200 ' +
            '[&_[data-icon]]:text-amber-500',
          // Info toast styling
          info:
            'group-[.toaster]:bg-blue-50 dark:group-[.toaster]:bg-blue-900/20 ' +
            'group-[.toaster]:border-blue-200 dark:group-[.toaster]:border-blue-800 ' +
            'group-[.toaster]:text-blue-800 dark:group-[.toaster]:text-blue-200 ' +
            '[&_[data-icon]]:text-blue-500',
        },
      }}
      {...props}
    />
  );
}
