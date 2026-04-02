'use client';

import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function IndustriesMidCta() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-primary-50 dark:bg-primary-950/40 py-20 lg:py-24">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial={prefersReducedMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: stats strip */}
          <motion.div variants={fadeUp} className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-px bg-primary-200 dark:bg-primary-800/30 rounded-sm overflow-hidden">
              {[
                { value: '< 1 hr', label: 'Setup time' },
                { value: '0', label: 'Developers needed' },
                { value: '24/7', label: 'Availability' },
                { value: '1', label: 'Line embed code' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-primary-50 dark:bg-primary-950/40 px-5 py-6 lg:px-6 lg:py-8"
                >
                  <p className="text-3xl lg:text-4xl font-black tracking-tight text-secondary-900 dark:text-secondary-100 leading-none mb-1">
                    {value}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-600 dark:text-primary-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: CTA text */}
          <motion.div variants={fadeUp} className="lg:col-span-7 lg:pl-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-500/10 dark:bg-primary-400/10">
                <Zap className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-primary-400">
                Works for every industry
              </p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
              Same platform. Your content.{' '}
              <span className="text-primary-500">Industry-specific results.</span>
            </h2>
            <p className="text-base text-secondary-600 dark:text-secondary-400 leading-relaxed mb-8 max-w-lg">
              VocUI doesn&apos;t ship a generic chatbot. It learns your business from the documents and
              URLs you provide, then answers questions the way your team would.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Start Building Free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
