'use client';

import { useId } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Search, X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface CategoryLink {
  label: string;
  anchor: string;
  count: number;
}

interface IndustriesHeroProps {
  totalCount: number;
  categories: CategoryLink[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCategoryClick?: (anchor: string) => void;
  isSearchActive: boolean;
  resultCount?: number;
}

export function IndustriesHero({
  totalCount,
  categories,
  searchQuery,
  onSearchChange,
  onCategoryClick,
  isSearchActive,
  resultCount,
}: IndustriesHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const searchId = useId();

  return (
    <section
      className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
        isSearchActive ? 'min-h-0' : 'min-h-0 lg:min-h-[calc(100dvh-4rem)]'
      }`}
    >
      <div className="relative z-10 flex flex-col flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Industries' }]} />

        {/* Main content */}
        <motion.div
          className={`flex flex-col justify-end flex-1 ${isSearchActive ? 'pb-8' : 'pb-16 lg:pb-24'}`}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={stagger}
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-6"
          >
            Industry Solutions
          </motion.p>

          {/* Large display number + headline */}
          {!isSearchActive && (
            <motion.div variants={fadeUp} className="mb-8">
              <div className="flex items-baseline gap-4 lg:gap-6 mb-4">
                <span className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-secondary-900 dark:text-secondary-100 leading-none">
                  {totalCount}+
                </span>
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary-400 dark:text-secondary-500 leading-tight">
                  industries
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.12] max-w-3xl">
                One platform.{' '}
                <span className="text-primary-500">Your knowledge. Your chatbot.</span>
              </h1>
            </motion.div>
          )}

          {/* Supporting text */}
          {!isSearchActive && (
            <motion.p
              variants={fadeUp}
              className="text-lg text-secondary-600 dark:text-secondary-400 max-w-xl leading-relaxed mb-8"
            >
              VocUI works for any business that answers the same questions repeatedly. Train it on your
              documents, URLs, and FAQs — and deploy the same day. Choose your industry below.
            </motion.p>
          )}

          {/* Search bar */}
          <motion.div variants={fadeUp} className={`relative mb-10 ${isSearchActive ? '' : 'max-w-md'}`}>
            <label htmlFor={searchId} className="sr-only">
              Search industries
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 dark:text-secondary-500"
              aria-hidden="true"
            />
            <input
              id={searchId}
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search industries\u2026"
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
            {searchQuery.length === 1 && (
              <p className="mt-2 text-xs text-secondary-400 dark:text-secondary-500">
                Type one more character to search…
              </p>
            )}
            {isSearchActive && resultCount !== undefined && (
              <p className="mt-2 text-xs text-secondary-400 dark:text-secondary-500">
                {resultCount === 0
                  ? <>No results for &ldquo;{searchQuery.trim()}&rdquo;</>
                  : <>{resultCount} result{resultCount !== 1 ? 's' : ''} for &ldquo;{searchQuery.trim()}&rdquo;</>
                }
              </p>
            )}
          </motion.div>

          {/* CTA */}
          {!isSearchActive && (
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-16"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Build Your Chatbot Free
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300 font-medium text-lg rounded-sm border border-secondary-300 dark:border-secondary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Browse Industries
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </motion.div>
          )}

          {/* Category pills — visual table of contents */}
          {!isSearchActive && (
            <motion.nav
              variants={fadeUp}
              aria-label="Industry categories"
              className="flex flex-wrap gap-2"
            >
              {categories.map((cat) => (
                <a
                  key={cat.anchor}
                  href={`#${cat.anchor}`}
                  onClick={(e) => {
                    if (onCategoryClick) {
                      e.preventDefault();
                      onCategoryClick(cat.anchor);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  {cat.label}
                  <span className="text-xs text-secondary-400 dark:text-secondary-500">{cat.count}</span>
                </a>
              ))}
            </motion.nav>
          )}
        </motion.div>

        {/* Scroll indicator */}
        {!isSearchActive && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-secondary-400 dark:text-secondary-600"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            aria-hidden="true"
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-secondary-300 dark:to-secondary-700" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
