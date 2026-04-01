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

export function HelpHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex flex-col overflow-hidden">
      <div className="relative z-10 flex flex-col flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Help' }]} />

        {/* Main content — lower-left quadrant */}
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
            Support
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.08] mb-8"
          >
            We&apos;re here when you{' '}
            <span className="text-primary-500">need us.</span>
          </motion.h1>

          {/* Supporting text */}
          <motion.p
            variants={fadeUp}
            className="text-lg text-secondary-600 dark:text-secondary-400 max-w-xl leading-relaxed"
          >
            Browse the docs, check the FAQ, or send us a message — we typically respond within one business day.
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
