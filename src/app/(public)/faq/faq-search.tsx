'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Command, ChevronRight, ArrowRight, MessageCircle, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { faqCategories, type FaqQuestion, type FaqCategory } from './faq-data';

interface SearchResult extends FaqQuestion {
  categoryId: string;
  categoryTitle: string;
  categoryIcon: LucideIcon;
}

interface FaqSearchProps {
  onSearchResults: (results: SearchResult[], query: string) => void;
  onClear: () => void;
}

export function FaqSearch({ onSearchResults, onClear }: FaqSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }

      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        handleClear();
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        const results = filterFaqs(faqCategories, query);
        onSearchResults(results, query);
      } else {
        onClear();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearchResults, onClear]);

  const handleClear = useCallback(() => {
    setQuery('');
    onClear();
  }, [onClear]);

  return (
    <div className="relative" role="search">
      <div
        className={cn(
          'relative flex items-center rounded-xl border-2 transition-all duration-200',
          isFocused
            ? 'border-primary-500 ring-4 ring-primary-500/20'
            : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600',
          'bg-white dark:bg-secondary-900'
        )}
      >
        <Search
          className="absolute left-4 w-5 h-5 text-secondary-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What do you need help with?"
          className="w-full pl-12 pr-24 py-4 text-base bg-transparent text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none"
          aria-label="Search frequently asked questions"
          aria-describedby="search-hint"
        />
        {query ? (
          <button
            onClick={handleClear}
            className="absolute right-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <div
            className="absolute right-4 flex items-center gap-1 px-2 py-1 rounded-md bg-secondary-100 dark:bg-secondary-800 text-xs text-secondary-500 dark:text-secondary-400"
            aria-hidden="true"
          >
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        )}
      </div>
      <p id="search-hint" className="sr-only">
        Type to search through all FAQ questions and answers. Press Escape to clear.
      </p>
    </div>
  );
}

// Search filter logic
function filterFaqs(
  categories: FaqCategory[],
  query: string
): SearchResult[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  categories.forEach((category) => {
    category.questions.forEach((q) => {
      if (
        q.question.toLowerCase().includes(normalizedQuery) ||
        q.answer.toLowerCase().includes(normalizedQuery)
      ) {
        results.push({
          ...q,
          categoryId: category.id,
          categoryTitle: category.title,
          categoryIcon: category.icon,
        });
      }
    });
  });

  return results;
}

// Search results display
interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onSelectQuestion: (categoryId: string, questionId: string) => void;
}

export function SearchResults({ results, query, onSelectQuestion }: SearchResultsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [results, query]);

  if (!query) return null;

  if (results.length === 0) {
    return (
      <div
        className="text-center py-16"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
        }}
      >
        <Search className="w-12 h-12 mx-auto text-secondary-300 dark:text-secondary-600 mb-4" />
        <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
          No results found
        </h3>
        <p className="text-secondary-500 dark:text-secondary-400 max-w-md mx-auto">
          We couldn&apos;t find any questions matching &quot;{query}&quot;. Try different keywords or{' '}
          <a href="/help" className="text-primary-500 hover:underline">
            contact support
          </a>
          .
        </p>
      </div>
    );
  }

  // Group results by category
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.categoryId]) {
        acc[result.categoryId] = {
          title: result.categoryTitle,
          icon: result.categoryIcon,
          questions: [],
        };
      }
      acc[result.categoryId].questions.push(result);
      return acc;
    },
    {} as Record<string, { title: string; icon: LucideIcon; questions: SearchResult[] }>
  );

  let resultIndex = 0;

  const categoryCount = Object.keys(groupedResults).length;

  return (
    <div role="region" aria-label="Search results">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        className="border-b border-secondary-200 dark:border-secondary-700 pb-8 mb-10"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.2s ease-out' }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500 mb-3">
          Search results
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight" aria-live="polite">
              {results.length} {results.length === 1 ? 'result' : 'results'} for{' '}
              <span className="text-primary-500">&quot;{query}&quot;</span>
            </h2>
            <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
              Found across{' '}
              <span className="font-medium text-secondary-700 dark:text-secondary-300">
                {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
              </span>
              {' '}— click any result to jump directly to that answer.
            </p>
          </div>
        </div>
      </div>

      {/* ── Category groups ──────────────────────────────────────────────────── */}
      <div className="space-y-12">
        {Object.entries(groupedResults).map(([categoryId, { title, icon: CategoryIcon, questions }]) => (
          <div key={categoryId}>

            {/* Category header */}
            <div
              className="flex items-center gap-3 mb-4"
              style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.2s ease-out' }}
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex-shrink-0">
                <CategoryIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-[0.15em]">
                {title}
              </h3>
              <div className="flex-1 h-px bg-secondary-200 dark:bg-secondary-700" aria-hidden="true" />
              <span className="text-xs font-medium text-secondary-400 dark:text-secondary-500 tabular-nums">
                {questions.length} {questions.length === 1 ? 'result' : 'results'}
              </span>
            </div>

            {/* Strip rows */}
            <div className="divide-y divide-secondary-100 dark:divide-secondary-800" role="list">
              {questions.map((q) => {
                const currentIndex = resultIndex++;
                return (
                  <button
                    key={q.id}
                    role="listitem"
                    onClick={() => onSelectQuestion(categoryId, q.id)}
                    className={cn(
                      'group w-full text-left flex items-start justify-between gap-6',
                      'py-6',
                      '-mx-4 px-4 sm:-mx-6 sm:px-6',
                      'hover:bg-secondary-50/70 dark:hover:bg-secondary-800/25',
                      'transition-colors duration-150',
                    )}
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(6px)',
                      transition: `opacity 0.3s ease-out ${80 + currentIndex * 45}ms, transform 0.3s ease-out ${80 + currentIndex * 45}ms`,
                    }}
                  >
                    {/* Left: question + answer */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                          <CategoryIcon className="w-3 h-3" aria-hidden="true" />
                          {q.categoryTitle}
                        </span>
                      </div>
                      <p className="text-base font-semibold leading-snug text-secondary-900 dark:text-secondary-100 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-150 mb-2">
                        {highlightMatch(q.question, query)}
                      </p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400 line-clamp-2 leading-relaxed">
                        {highlightMatch(q.answer, query)}
                      </p>
                    </div>

                    {/* Right: chevron */}
                    <ChevronRight
                      className="w-5 h-5 flex-shrink-0 mt-1 text-secondary-300 dark:text-secondary-600 group-hover:text-primary-500 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all duration-150"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div
        className="mt-16 pt-10 border-t border-secondary-200 dark:border-secondary-700"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.4s ease-out 0.3s' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
              Didn&apos;t find what you were looking for?
            </p>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              Try different keywords, or reach out and we&apos;ll help directly.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="/help"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-700 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Contact support
            </a>
            <a
              href="/faq"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-sm font-medium text-white transition-colors"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              Browse all FAQs
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        className="bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
