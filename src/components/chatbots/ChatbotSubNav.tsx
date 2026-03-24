'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Settings,
  Database,
  Palette,
  Code,
  BarChart3,
  MessageSquare,
  Timer,
  Inbox,
  ClipboardList,
  Brain,
  Flag,
  Headphones,
  ChevronDown,
  LayoutDashboard,
  CalendarDays,
  Ticket,
  FileText,
  BookOpen,
} from 'lucide-react';

const primaryNav = [
  { href: '', label: 'Overview', icon: LayoutDashboard },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/knowledge', label: 'Knowledge', icon: Database },
  { href: '/customize', label: 'Customize', icon: Palette },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/deploy', label: 'Deploy', icon: Code },
];

const secondaryNav = [
  { href: '/conversations', label: 'Agent Console', icon: Headphones },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/performance', label: 'Performance', icon: Timer },
  { href: '/leads', label: 'Leads', icon: Inbox },
  { href: '/surveys', label: 'Surveys', icon: ClipboardList },
  { href: '/sentiment', label: 'Sentiment', icon: Brain },
  { href: '/issues', label: 'Issues', icon: Flag },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/contact', label: 'Contact', icon: FileText },
  { href: '/articles', label: 'Articles', icon: BookOpen },
];

export function ChatbotSubNav({ chatbotId }: { chatbotId: string }) {
  const pathname = usePathname();
  const basePath = `/dashboard/chatbots/${chatbotId}`;
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [moreOpen]);

  // Close on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    const fullPath = `${basePath}${href}`;
    if (href === '') return pathname === fullPath;
    return pathname === fullPath || pathname?.startsWith(`${fullPath}/`);
  };

  const activeSecondary = secondaryNav.find((item) => isActive(item.href));

  const linkClasses = (active: boolean) =>
    cn(
      'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
      active
        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm ring-1 ring-primary-200 dark:ring-primary-800'
        : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-800'
    );

  return (
    <div className="mb-8">
      <nav
        className="flex items-center gap-1 py-3 flex-wrap"
        aria-label="Chatbot navigation"
      >
        {primaryNav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={`${basePath}${href}`}
            className={linkClasses(isActive(href))}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}

        {/* More dropdown */}
        <div className="relative" ref={moreRef}>
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              linkClasses(!!activeSecondary && !moreOpen),
              'cursor-pointer'
            )}
            aria-expanded={moreOpen}
            aria-haspopup="true"
          >
            {activeSecondary ? (
              <>
                <activeSecondary.icon className="w-4 h-4" />
                {activeSecondary.label}
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                More
              </>
            )}
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 ml-0.5 transition-transform',
                moreOpen && 'rotate-180'
              )}
            />
          </button>

          {moreOpen && (
            <div className="absolute top-full left-0 mt-1 w-52 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 shadow-lg z-50 py-1">
              {secondaryNav.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={`${basePath}${href}`}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                    isActive(href)
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                      : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
