'use client';

import Link from 'next/link';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function IntegrationsRequest() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-secondary-50 dark:bg-secondary-900 py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/50 px-8 py-10 lg:px-12 lg:py-12"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: icon + message */}
            <motion.div variants={fadeUp} className="lg:col-span-8 flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/50">
                <Lightbulb
                  className="h-6 w-6 text-primary-600 dark:text-primary-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                  Don&apos;t see your platform?
                </h2>
                <p className="text-base text-secondary-600 dark:text-secondary-400 leading-relaxed">
                  We&apos;re always adding new integrations. Tell us which platforms,
                  CRMs, or tools you want VocUI to connect with and we&apos;ll
                  prioritize it.
                </p>
              </div>
            </motion.div>

            {/* Right: CTA */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-4 flex lg:justify-end"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Request an Integration
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
