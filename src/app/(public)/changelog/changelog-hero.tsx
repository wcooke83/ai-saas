'use client';

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

export function ChangelogHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[40vh] flex flex-col overflow-hidden">
      <div className="relative z-10 flex flex-col flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: 'Changelog' }]} />

        <motion.div
          className="flex flex-col justify-end flex-1 pb-12 lg:pb-16 max-w-4xl"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-6"
          >
            Product updates
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.08] mb-8"
          >
            What&apos;s new in{' '}
            <span className="text-primary-500">VocUI</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg text-secondary-600 dark:text-secondary-400 max-w-xl leading-relaxed"
          >
            New features, improvements, and fixes shipped to production. We release updates regularly.
          </motion.p>
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
