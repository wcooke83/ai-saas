'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export function TermsHero() {
  const prefersReducedMotion = useReducedMotion();
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <section className="relative min-h-[40vh] flex flex-col overflow-hidden">
      <div className="relative z-10 flex flex-col flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

        {/* Main content — lower-left anchored */}
        <motion.div
          className="flex flex-col justify-end flex-1 pb-12 lg:pb-16 max-w-4xl"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={stagger}
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-6"
          >
            Legal
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.08] mb-4"
          >
            Terms of Service
          </motion.h1>

          {/* Supporting text */}
          <motion.p
            variants={fadeUp}
            className="text-lg text-secondary-600 dark:text-secondary-400 max-w-xl leading-relaxed mb-2"
          >
            The rules governing your use of VocUI — what you can do, what we promise, and what
            happens if things go wrong.
          </motion.p>

          {/* Last updated subline */}
          <motion.p
            variants={fadeUp}
            className="text-sm text-secondary-400 dark:text-secondary-500 mt-2 mb-8"
          >
            Last updated: {lastUpdated}
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300 font-medium text-lg rounded-sm border border-secondary-300 dark:border-secondary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Questions? Contact Us
            </Link>
          </motion.div>
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
