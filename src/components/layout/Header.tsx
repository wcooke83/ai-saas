'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggleSimple } from '@/components/ui/theme-toggle';
import { Menu, X } from 'lucide-react';
import { VocUILogo } from '@/components/ui/vocui-logo';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useUISettings } from '@/contexts/ui-settings-context';
import { getMenuGradientEnabledFromCookie, getHeaderGradientEnabledFromCookie } from '@/lib/ui-settings-cookies';

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

const defaultNavItems: NavItem[] = [
  { label: 'Docs', href: '/wiki' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'SDK', href: '/sdk' },
  { label: 'FAQ', href: '/faq' },
];

const menuLinks = {
  product: [
    { label: 'Pricing', href: '/pricing' },
    { label: 'SDK', href: '/sdk' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  resources: [
    { label: 'Documentation', href: '/wiki' },
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

interface HeaderProps {
  /** Custom navigation items - defaults to standard public nav */
  navItems?: NavItem[];
  /** Show the logo/brand - defaults to true */
  showLogo?: boolean;
  /** Custom CTA button config */
  cta?: {
    label: string;
    href: string;
    variant?: 'default' | 'outline' | 'ghost';
  };
  /** Additional CTA for signed-in users */
  secondaryCta?: {
    label: string;
    href: string;
  };
  /** Whether to show theme toggle - defaults to true */
  showThemeToggle?: boolean;
  /** Additional className for the header */
  className?: string;
  /** Transparent mode for hero overlays */
  transparent?: boolean;
}

export function Header({
  navItems = defaultNavItems,
  showLogo = true,
  cta = { label: 'Get Started', href: '/signup' },
  secondaryCta,
  showThemeToggle = true,
  className,
  transparent = false,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [useHeaderGradient, setUseHeaderGradient] = useState(false);
  const [useMenuGradient, setUseMenuGradient] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const { settings, getBackdropBlurClass, getMenuBlurClass } = useUISettings();

  // Load header gradient preference and watch for changes
  useEffect(() => {
    const checkHeaderGradientState = () => {
      const attr = document.documentElement.getAttribute('data-header-gradient-enabled');
      if (attr !== null) {
        setUseHeaderGradient(attr === 'true');
      } else {
        setUseHeaderGradient(getHeaderGradientEnabledFromCookie());
      }
    };

    checkHeaderGradientState();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-header-gradient-enabled') {
          checkHeaderGradientState();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-header-gradient-enabled'],
    });

    return () => observer.disconnect();
  }, []);

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

  // Check auth state
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Handle scroll for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
    // Check if focus is moving outside the menu and menu button
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
    <>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-md focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-200',
          transparent && !scrolled
            ? 'bg-transparent'
            : getBackdropBlurClass(),
          scrolled && 'shadow-sm',
          className
        )}
        style={
          transparent && !scrolled
            ? undefined
            : (() => {
                const opacity = settings.headerBlurUseOpacity ? settings.headerBlurOpacity / 100 : 1;
                const borderStyle = settings.headerBorderEnabled
                  ? '1px solid rgb(var(--header-border))'
                  : 'none';

                // With gradient
                if (settings.headerBlurUseGradient || useHeaderGradient) {
                  return {
                    background: `linear-gradient(to right, rgb(var(--header-gradient-from) / ${opacity}), rgb(var(--header-gradient-to) / ${opacity}))`,
                    borderBottom: borderStyle,
                  };
                }

                // With background color
                if (settings.headerBlurUseBackgroundColor) {
                  return {
                    backgroundColor: `rgb(var(--header-bg) / ${opacity})`,
                    borderBottom: borderStyle,
                  };
                }

                // Just blur, no color
                if (settings.headerBlurEnabled) {
                  return {
                    backgroundColor: settings.headerBlurUseOpacity
                      ? `rgba(255, 255, 255, ${opacity})`
                      : 'transparent',
                    borderBottom: settings.headerBorderEnabled
                      ? '1px solid rgba(128, 128, 128, 0.2)'
                      : 'none',
                  };
                }

                // No blur - solid background
                return {
                  backgroundColor: 'rgb(var(--header-bg))',
                  borderBottom: borderStyle,
                };
              })()
        }
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            {showLogo && (
              <Link
                href="/"
                className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-md"
              >
                <VocUILogo />
                <span className="font-bold text-xl text-secondary-900 dark:text-secondary-100">
                  VocUI
                </span>
              </Link>
            )}

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <Link
                href={isLoggedIn ? '/dashboard' : cta.href}
                className={cn(
                  'text-sm font-medium px-3 py-2 rounded-md transition-colors',
                  'text-secondary-600 dark:text-secondary-400',
                  'hover:text-secondary-900 dark:hover:text-secondary-100',
                  'hover:bg-secondary-100 dark:hover:bg-secondary-800',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
                )}
              >
                {isLoggedIn ? 'Dashboard' : 'Sign In'}
              </Link>

              {showThemeToggle && <ThemeToggleSimple />}

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
          {/* Backdrop - just for click-away, no blur */}
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
                {!isLoggedIn && secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className="block mb-3 px-4 py-3 text-base font-medium text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    {secondaryCta.label}
                  </Link>
                )}
                {isLoggedIn ? (
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" asChild>
                    <Link href={cta.href}>{cta.label}</Link>
                  </Button>
                )}
              </div>
            </div>
          </nav>
        </div>
    </>
  );
}

export default Header;
