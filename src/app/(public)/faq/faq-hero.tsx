'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { FaqSearch } from './faq-search';
import type { FaqQuestion } from './faq-data';

interface SearchResult extends FaqQuestion {
  categoryId: string;
  categoryTitle: string;
}

interface FaqHeroProps {
  onSearchResults: (results: SearchResult[], query: string) => void;
  onClear: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export function FaqHero({ onSearchResults, onClear }: FaqHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex flex-col overflow-hidden">
      <div className="relative z-10 flex flex-col flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: 'FAQ' }]} />

        {/* Main content — lower-left, like /about hero */}
        <motion.div
          className="flex flex-col justify-end flex-1 pb-16 lg:pb-24 max-w-4xl"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={stagger}
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-6"
          >
            Help Center
          </motion.p>

          {/* Display headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.08] mb-8"
          >
            Find your answer.{' '}
            <span className="text-primary-500">Fast.</span>
          </motion.h1>

          {/* Supporting text */}
          <motion.p
            variants={fadeUp}
            className="text-lg text-secondary-600 dark:text-secondary-400 max-w-xl leading-relaxed mb-10"
          >
            Search across credits, billing, API, security, and account questions —
            or browse by category below.
          </motion.p>

          {/* Search bar — prominent placement */}
          <motion.div variants={fadeUp} className="w-full max-w-2xl">
            <FaqSearch onSearchResults={onSearchResults} onClear={onClear} />
          </motion.div>
        </motion.div>

        {/* Scroll-to indicator */}
        <motion.a
          href="#categories"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-secondary-400 dark:text-secondary-600 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          aria-label="Scroll to categories"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-secondary-300 dark:to-secondary-700" />
          <ChevronDown className="w-4 h-4 animate-bounce" aria-hidden="true" />
        </motion.a>
      </div>
    </section>
  );
}
