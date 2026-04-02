'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface CategoryNavProps {
  categories: { label: string; anchor: string }[];
}

export function IndustriesCategoryNav({ categories }: CategoryNavProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const handleScroll = useCallback(() => {
    // Show nav after scrolling past the hero
    const trigger = document.getElementById('categories');
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      setIsVisible(rect.top <= 80);
    }

    // Determine which section is in view
    let current = '';
    for (const cat of categories) {
      const el = document.getElementById(cat.anchor);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140) {
          current = cat.anchor;
        }
      }
    }
    setActiveId(current);
  }, [categories]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Scroll active pill into view within the nav (horizontal only)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!activeId || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const activeEl = container.querySelector<HTMLElement>(`[data-anchor="${activeId}"]`);
    if (activeEl) {
      const left = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
      container.scrollTo({ left, behavior: 'smooth' });
    }
  }, [activeId]);

  return (
    <nav
      ref={navRef}
      aria-label="Jump to industry category"
      className={cn(
        'sticky top-16 z-40 w-full transition-all duration-300 border-b border-secondary-200 dark:border-secondary-800 bg-white/90 dark:bg-secondary-950/90 backdrop-blur-md',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2 pointer-events-none'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={scrollContainerRef} className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <a
              key={cat.anchor}
              href={`#${cat.anchor}`}
              data-anchor={cat.anchor}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                activeId === cat.anchor
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'
              )}
            >
              {cat.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
