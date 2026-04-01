'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { faqCategories, type FaqQuestion, type FaqCategory } from './faq-data';

interface SearchResult extends FaqQuestion {
  categoryId: string;
  categoryTitle: string;
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
        acc[result.categoryId] = { title: result.categoryTitle, questions: [] };
      }
      acc[result.categoryId].questions.push(result);
      return acc;
    },
    {} as Record<string, { title: string; questions: SearchResult[] }>
  );

  let resultIndex = 0;

  return (
    <div className="space-y-8" role="region" aria-label="Search results">
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease-out',
        }}
      >
        <p className="text-sm text-secondary-600 dark:text-secondary-400" aria-live="polite">
          Found{' '}
          <span className="font-medium text-secondary-900 dark:text-secondary-100">
            {results.length}
          </span>{' '}
          {results.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
        </p>
      </div>

      {Object.entries(groupedResults).map(([categoryId, { title, questions }]) => (
        <div key={categoryId}>
          <h3 className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-[0.15em] mb-4">
            {title}
          </h3>
          <div className="space-y-3">
            {questions.map((q) => {
              const currentIndex = resultIndex++;
              return (
                <button
                  key={q.id}
                  onClick={() => onSelectQuestion(categoryId, q.id)}
                  className="w-full text-left p-5 rounded-lg transition-colors group"
                  style={{
                    backgroundColor: 'rgb(var(--card-bg))',
                    border: '1px solid rgb(var(--card-border))',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                    transition: `opacity 0.3s ease-out ${100 + currentIndex * 50}ms, transform 0.3s ease-out ${100 + currentIndex * 50}ms, background-color 0.2s ease`,
                  }}
                >
                  <p className="font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {highlightMatch(q.question, query)}
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1.5 line-clamp-2">
                    {highlightMatch(q.answer, query)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ))}
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
