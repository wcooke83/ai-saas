'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Menu, X, Home, Key, BarChart3, Settings, LogOut, CreditCard, Bot, Shield, ChevronDown, ChevronLeft, ChevronRight, Cpu, FileText, Package, Gift, Coins, ShoppingBag, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggleSimple } from '@/components/ui/theme-toggle';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { LucideIcon } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: { href: string; label: string; icon: LucideIcon }[];
}

const baseNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/chatbots', label: 'Chatbots', icon: Bot },
  { href: '/dashboard/api-keys', label: 'API Keys', icon: Key },
  { href: '/dashboard/usage', label: 'Usage', icon: BarChart3 },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const adminNavItem: NavItem = {
  href: '/admin',
  label: 'Admin',
  icon: Shield,
  children: [
    { href: '/admin', label: 'Overview', icon: Shield },
    { href: '/admin/ai-config', label: 'AI Config', icon: Cpu },
    { href: '/admin/plans', label: 'Plans', icon: Package },
    { href: '/admin/credits', label: 'Credits', icon: Coins },
    { href: '/admin/credit-packages', label: 'Credit Packages', icon: ShoppingBag },
    { href: '/admin/trials', label: 'Trial Links', icon: Gift },
    { href: '/admin/logs', label: 'Logs', icon: FileText },
    { href: '/admin/status', label: 'Status Page', icon: Activity },
  ],
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['/admin']));
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Track desktop breakpoint for aria-hidden
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setSidebarCollapsed(saved === 'true');
    }
  }, []);

  // Toggle sidebar collapsed state
  const toggleSidebarCollapsed = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  // Toggle menu expansion
  const toggleMenu = (href: string) => {
    setExpandedMenus(prev => {
      const next = new Set(prev);
      if (next.has(href)) {
        next.delete(href);
      } else {
        next.add(href);
      }
      return next;
    });
  };

  // Auto-expand admin menu on admin pages
  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setExpandedMenus(prev => new Set([...prev, '/admin']));
    }
  }, [pathname]);

  // Build nav items - always show admin for admin pages
  const navItems = [...baseNavItems, adminNavItem];

  // Focus trap for mobile sidebar
  const { containerRef: sidebarRef } = useFocusTrap<HTMLElement>({
    isActive: sidebarOpen,
    onEscape: () => setSidebarOpen(false),
    restoreFocus: true,
    autoFocus: true,
  });

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--page-bg))' }}>
        <div className="animate-pulse text-secondary-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen [overflow-x:clip]" style={{ backgroundColor: 'rgb(var(--page-bg))' }}>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Skip to main content
      </a>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 border-b border-secondary-200 dark:border-secondary-700 h-16 flex items-center px-4" style={{ backgroundColor: 'rgb(var(--card-bg))' }}>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="ml-4 text-xl font-bold text-primary-600 dark:text-primary-400">
          VocUI
        </Link>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-secondary-900/50"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          'fixed inset-y-0 left-0 z-50 border-r border-secondary-200 dark:border-secondary-700 transform transition-all duration-200 ease-in-out lg:translate-x-0 overflow-hidden',
          sidebarCollapsed ? 'w-16' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ backgroundColor: 'rgb(var(--card-bg))' }}
        aria-label="Sidebar navigation"
        aria-hidden={!isDesktop && !sidebarOpen ? 'true' : undefined}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo */}
          <div className={cn(
            "flex items-center h-16 border-b border-secondary-200 dark:border-secondary-700",
            sidebarCollapsed ? "justify-center px-2" : "justify-between px-6"
          )}>
            <Link
              href="/"
              className="text-xl font-bold text-primary-600 dark:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              {sidebarCollapsed ? 'V' : 'VocUI'}
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User profile section */}
          <div className={cn(
            "py-4 border-b border-secondary-200 dark:border-secondary-700",
            sidebarCollapsed ? "px-2" : "px-4"
          )}>
            <div className={cn(
              "flex items-center",
              sidebarCollapsed ? "justify-center" : "justify-between"
            )}>
              <div className={cn(
                "flex items-center min-w-0",
                sidebarCollapsed ? "justify-center" : "gap-3"
              )}>
                <Tooltip content={sidebarCollapsed ? user?.email : undefined} side="right">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      {user?.email?.[0].toUpperCase()}
                    </span>
                  </div>
                </Tooltip>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                      {user?.email}
                    </p>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && <ThemeToggleSimple />}
            </div>
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden",
            sidebarCollapsed ? "px-2" : "px-4"
          )} aria-label="Main navigation">
            {navItems.map((item) => {
              const isExactActive = pathname === item.href;
              const isInSection = item.href !== '/dashboard' && pathname.startsWith(item.href);
              const isActive = isExactActive || isInSection;
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus.has(item.href);

              return (
                <div key={item.href} className="relative">
                  {hasChildren ? (
                    <>
                      {sidebarCollapsed ? (
                        <Tooltip content={item.label} side="right" wrapperClassName="block">
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center justify-center p-2.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                              isActive
                                ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100'
                            )}
                            aria-current={isExactActive ? 'page' : undefined}
                          >
                            <Icon className="w-5 h-5" aria-hidden="true" />
                          </Link>
                        </Tooltip>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <Link
                              href={item.href}
                              className={cn(
                                'flex-1 flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-l-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                                isActive
                                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100'
                              )}
                              aria-current={isExactActive ? 'page' : undefined}
                            >
                              <Icon className="w-5 h-5" aria-hidden="true" />
                              {item.label}
                            </Link>
                            <button
                              type="button"
                              onClick={() => toggleMenu(item.href)}
                              className={cn(
                                'self-stretch flex items-center px-2 rounded-r-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                                isActive
                                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100'
                              )}
                              aria-expanded={isExpanded}
                              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label}`}
                            >
                              <ChevronDown
                                className={cn(
                                  'w-4 h-4 transition-transform duration-200',
                                  isExpanded && 'rotate-180'
                                )}
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                          {isExpanded && (
                            <div className="ml-4 mt-1 space-y-1 border-l-2 border-secondary-200 dark:border-secondary-700">
                              {item.children!.map((child) => {
                                const isChildActive = pathname === child.href;
                                const ChildIcon = child.icon;
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={cn(
                                      'flex items-center gap-3 px-3 py-2 ml-2 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                                      isChildActive
                                        ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium'
                                        : 'text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100'
                                    )}
                                    aria-current={isChildActive ? 'page' : undefined}
                                  >
                                    <ChildIcon className="w-4 h-4" aria-hidden="true" />
                                    {child.label}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {sidebarCollapsed ? (
                        <Tooltip content={item.label} side="right" wrapperClassName="block">
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center justify-center p-2.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                              isActive
                                ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100'
                            )}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            <Icon className="w-5 h-5" aria-hidden="true" />
                          </Link>
                        </Tooltip>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                            isActive
                              ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border-l-2 border-primary-500 -ml-0.5 pl-[calc(0.75rem+2px)]'
                              : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100'
                          )}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <Icon className="w-5 h-5" aria-hidden="true" />
                          {item.label}
                        </Link>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sign out & collapse section */}
          <div className={cn(
            "border-t border-secondary-200 dark:border-secondary-700",
            sidebarCollapsed ? "p-2" : "p-4"
          )}>
            {sidebarCollapsed ? (
              <Tooltip content="Expand sidebar" side="right" wrapperClassName="block">
                <button
                  type="button"
                  onClick={toggleSidebarCollapsed}
                  className="w-full flex items-center justify-center p-2.5 text-sm text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </Tooltip>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Sign out
                </button>
                <Tooltip content="Collapse sidebar" side="right">
                  <button
                    type="button"
                    onClick={toggleSidebarCollapsed}
                    className="hidden lg:flex items-center p-2 text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Collapse sidebar"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        id="main-content"
        className={cn(
          "pt-16 lg:pt-0 transition-all duration-200 [overflow-x:clip]",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        )}
        tabIndex={-1}
      >
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
