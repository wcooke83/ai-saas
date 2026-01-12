'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <div
      className="flex items-center gap-1 p-1 rounded-lg border"
      style={{
        backgroundColor: 'rgb(var(--theme-toggle-bg))',
        borderColor: 'rgb(var(--theme-toggle-border))',
      }}
    >
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'p-2 rounded-md transition-colors',
          theme === 'light' && 'shadow-sm'
        )}
        style={{
          backgroundColor: theme === 'light' ? 'rgb(var(--theme-toggle-button-bg))' : 'transparent',
          color: theme === 'light' ? 'rgb(var(--theme-toggle-icon-active))' : 'rgb(var(--theme-toggle-icon))',
        }}
        onMouseEnter={(e) => {
          if (theme !== 'light') {
            e.currentTarget.style.backgroundColor = 'rgb(var(--theme-toggle-button-hover-bg))';
          }
        }}
        onMouseLeave={(e) => {
          if (theme !== 'light') {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'p-2 rounded-md transition-colors',
          theme === 'dark' && 'shadow-sm'
        )}
        style={{
          backgroundColor: theme === 'dark' ? 'rgb(var(--theme-toggle-button-bg))' : 'transparent',
          color: theme === 'dark' ? 'rgb(var(--theme-toggle-icon-active))' : 'rgb(var(--theme-toggle-icon))',
        }}
        onMouseEnter={(e) => {
          if (theme !== 'dark') {
            e.currentTarget.style.backgroundColor = 'rgb(var(--theme-toggle-button-hover-bg))';
          }
        }}
        onMouseLeave={(e) => {
          if (theme !== 'dark') {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn(
          'p-2 rounded-md transition-colors',
          theme === 'system' && 'shadow-sm'
        )}
        style={{
          backgroundColor: theme === 'system' ? 'rgb(var(--theme-toggle-button-bg))' : 'transparent',
          color: theme === 'system' ? 'rgb(var(--theme-toggle-icon-active))' : 'rgb(var(--theme-toggle-icon))',
        }}
        onMouseEnter={(e) => {
          if (theme !== 'system') {
            e.currentTarget.style.backgroundColor = 'rgb(var(--theme-toggle-button-hover-bg))';
          }
        }}
        onMouseLeave={(e) => {
          if (theme !== 'system') {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ThemeToggleSimple() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
