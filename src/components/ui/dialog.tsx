'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks';

const MODAL_BORDER_COOKIE_NAME = 'theme-modal-border-enabled';

function getModalBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const match = document.cookie.match(new RegExp(`(^| )${MODAL_BORDER_COOKIE_NAME}=([^;]+)`));
    if (match) {
      return match[2] === 'true';
    }
  } catch (e) {
    console.error('Failed to parse modal border cookie:', e);
  }
  return true; // Default to enabled
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

const DialogContext = React.createContext<{
  onClose: () => void;
} | null>(null);

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ onClose: () => onOpenChange(false) }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
        {/* Content */}
        {children}
      </div>
    </DialogContext.Provider>
  );
}

export function DialogContent({ children, className }: DialogContentProps) {
  const context = React.useContext(DialogContext);
  const [showBorder, setShowBorder] = React.useState(true);
  const { containerRef } = useFocusTrap<HTMLDivElement>({
    isActive: true,
    onEscape: context?.onClose,
    restoreFocus: true,
    autoFocus: true,
  });

  React.useEffect(() => {
    const checkBorderState = () => {
      const attr = document.documentElement.getAttribute('data-modal-border-enabled');
      if (attr !== null) {
        setShowBorder(attr === 'true');
      } else {
        setShowBorder(getModalBorderEnabledFromCookie());
      }
    };

    checkBorderState();

    // Watch for attribute changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-modal-border-enabled') {
          checkBorderState();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-modal-border-enabled'],
    });

    return () => observer.disconnect();
  }, []);

  const borderStyle = showBorder
    ? { borderColor: 'rgb(var(--modal-border))' }
    : { borderColor: 'transparent' };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      className={cn(
        'relative z-50 w-full max-w-lg rounded-xl border p-6 shadow-xl animate-in fade-in-0 zoom-in-95',
        className
      )}
      style={{
        backgroundColor: 'rgb(var(--modal-bg))',
        ...borderStyle,
      }}
    >
      {/* Close button */}
      <button
        onClick={context?.onClose}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-secondary-900"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={cn('text-lg font-semibold leading-none tracking-tight text-secondary-900 dark:text-secondary-100', className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <p className={cn('text-sm text-secondary-500 dark:text-secondary-400', className)}>
      {children}
    </p>
  );
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}>
      {children}
    </div>
  );
}
