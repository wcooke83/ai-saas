'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggleSimple } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Code,
  Menu,
  X,
} from 'lucide-react';
import { SDKTabs } from './sdk-tabs';
import { useUISettings } from '@/contexts/ui-settings-context';
import { getMenuGradientEnabledFromCookie } from '@/lib/ui-settings-cookies';

const menuLinks = {
  product: [
    { label: 'Tools', href: '/tools' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'SDK', href: '/sdk' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  resources: [
    { label: 'Help Center', href: '/help' },
    { label: 'FAQ', href: '/faq' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function SDKPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [useMenuGradient, setUseMenuGradient] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { settings } = useUISettings();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Load menu gradient preference and watch for changes
  useEffect(() => {
    const checkMenuGradientState = () => {
      const attr = document.documentElement.getAttribute('data-menu-gradient-enabled');
      if (attr !== null) {
        setUseMenuGradient(attr === 'true');
      } else {
        setUseMenuGradient(getMenuGradientEnabledFromCookie());
      }
    };

    checkMenuGradientState();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-menu-gradient-enabled') {
          checkMenuGradientState();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-menu-gradient-enabled'],
    });

    return () => observer.disconnect();
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Close menu when focus leaves the menu area
  const handleMenuBlur = useCallback((event: React.FocusEvent) => {
    const relatedTarget = event.relatedTarget as Node | null;
    const menuElement = menuRef.current;
    const buttonElement = menuButtonRef.current;

    if (
      menuOpen &&
      relatedTarget &&
      menuElement &&
      !menuElement.contains(relatedTarget) &&
      buttonElement &&
      !buttonElement.contains(relatedTarget)
    ) {
      setMenuOpen(false);
    }
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      {/* Header */}
      <header className="border-b border-secondary-200 dark:border-secondary-800 bg-white dark:bg-secondary-900 sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back
            </Link>
            <div className="h-6 w-px bg-secondary-200 dark:bg-secondary-700" />
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary-500" aria-hidden="true" />
              <span className="font-semibold dark:text-secondary-100">SDK & Design System</span>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <Badge variant="outline">v1.0.0</Badge>

            <ThemeToggleSimple />

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn(
                'p-2 rounded-md transition-colors',
                'text-secondary-600 dark:text-secondary-400',
                'hover:bg-secondary-100 dark:hover:bg-secondary-800',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
              )}
              aria-expanded={menuOpen}
              aria-controls="nav-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Menu - OUTSIDE header to avoid nested backdrop-filter issues */}
      <div
        id="nav-menu"
        ref={menuRef}
        onBlur={handleMenuBlur}
        className={cn(
          'fixed inset-x-0 top-16 bottom-0 z-50 transition-all duration-300 ease-in-out',
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop - just for click-away */}
        <div
          className={cn(
            'absolute inset-0 bg-black/20 dark:bg-black/40 transition-opacity',
            menuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Menu Content - blur applied directly to nav */}
        <nav
          className={cn(
            'relative shadow-lg',
            'transform transition-transform duration-300 ease-in-out',
            'max-h-[calc(100vh-4rem)]',
            menuOpen ? 'translate-y-0' : '-translate-y-4',
            // Apply blur directly to nav panel
            settings.menuBlurEnabled && settings.menuBlurIntensity !== 'none' && `backdrop-blur-${settings.menuBlurIntensity}`
          )}
          style={(() => {
            const opacity = settings.menuBlurUseOpacity ? settings.menuBlurOpacity / 100 : 1;
            const borderStyle = settings.menuBorderEnabled
              ? '1px solid rgb(var(--menu-border))'
              : 'none';

            // With gradient
            if (settings.menuBlurUseGradient || useMenuGradient) {
              return {
                background: `linear-gradient(to bottom, rgb(var(--menu-gradient-from) / ${opacity}), rgb(var(--menu-gradient-to) / ${opacity}))`,
                borderBottom: borderStyle,
              };
            }

            // With background color
            if (settings.menuBlurUseBackgroundColor) {
              return {
                background: `rgb(var(--menu-bg) / ${opacity})`,
                borderBottom: borderStyle,
              };
            }

            // Just blur, no color
            if (settings.menuBlurEnabled) {
              return {
                background: settings.menuBlurUseOpacity
                  ? `rgba(255, 255, 255, ${opacity})`
                  : 'transparent',
                borderBottom: settings.menuBorderEnabled
                  ? '1px solid rgb(var(--menu-border) / 0.3)'
                  : 'none',
              };
            }

            // No blur - solid background
            return {
              background: 'rgb(var(--menu-bg))',
              borderBottom: borderStyle,
            };
          })()}
          aria-label="Main navigation"
        >
          <div className="container mx-auto px-4 py-6 max-w-3xl overflow-y-auto max-h-[calc(100vh-4rem)]">
            {/* Link sections grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {/* Product */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-3 px-2">
                  Product
                </h3>
                <ul className="space-y-1">
                  {menuLinks.product.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'block px-2 py-2 text-sm font-medium rounded-md transition-colors',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                          isActive(link.href)
                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                            : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                        )}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-3 px-2">
                  Resources
                </h3>
                <ul className="space-y-1">
                  {menuLinks.resources.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'block px-2 py-2 text-sm font-medium rounded-md transition-colors',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                          isActive(link.href)
                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                            : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                        )}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-3 px-2">
                  Company
                </h3>
                <ul className="space-y-1">
                  {menuLinks.company.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'block px-2 py-2 text-sm font-medium rounded-md transition-colors',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                          isActive(link.href)
                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                            : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                        )}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-3 px-2">
                  Legal
                </h3>
                <ul className="space-y-1">
                  {menuLinks.legal.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'block px-2 py-2 text-sm font-medium rounded-md transition-colors',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                          isActive(link.href)
                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                            : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                        )}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Menu CTA */}
            <div className="pt-6 mt-6 border-t border-secondary-200 dark:border-secondary-700">
              <Button className="w-full" size="lg" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">Design System & Standards</h1>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl">
            Our design system ensures consistency, accessibility, and quality across all components.
            Use this reference when building new features or components.
          </p>
        </div>

        {/* Tabs */}
        <SDKTabs />
      </main>
    </div>
  );
}
