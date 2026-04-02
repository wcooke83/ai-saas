'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
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
}

export function IndustriesHero({ totalCount, categories }: IndustriesHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex flex-col overflow-hidden">
      <div className="relative z-10 flex flex-col flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Industries' }]} />

        {/* Main content */}
        <motion.div
          className="flex flex-col justify-end flex-1 pb-16 lg:pb-24"
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

          {/* Supporting text */}
          <motion.p
            variants={fadeUp}
            className="text-lg text-secondary-600 dark:text-secondary-400 max-w-xl leading-relaxed mb-10"
          >
            VocUI works for any business that answers the same questions repeatedly. Train it on your
            documents, URLs, and FAQs — and deploy the same day. Choose your industry below.
          </motion.p>

          {/* CTA */}
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

          {/* Category pills — visual table of contents */}
          <motion.nav
            variants={fadeUp}
            aria-label="Industry categories"
            className="flex flex-wrap gap-2"
          >
            {categories.map((cat) => (
              <a
                key={cat.anchor}
                href={`#${cat.anchor}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {cat.label}
                <span className="text-xs text-secondary-400 dark:text-secondary-500">{cat.count}</span>
              </a>
            ))}
          </motion.nav>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-secondary-400 dark:text-secondary-600"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          aria-hidden="true"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-secondary-300 dark:to-secondary-700" />
        </motion.div>
      </div>
    </section>
  );
}
