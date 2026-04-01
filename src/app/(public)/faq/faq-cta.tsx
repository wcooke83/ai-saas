'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function FaqCta() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-secondary-900 dark:bg-secondary-950 py-24 lg:py-32 overflow-hidden">
      {/* Decorative glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 30% 50%, rgba(14,165,233,0.06) 0%, transparent 55%)',
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: CTA content */}
          <motion.div
            className="lg:col-span-7"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-6"
            >
              Still have questions?
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-8"
            >
              We&apos;re here to help.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg text-secondary-400 leading-relaxed mb-10 max-w-lg"
            >
              Reach out to our support team and we&apos;ll get back to you within 24 hours. Or
              explore the documentation for API references and integration guides.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/help"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-900"
              >
                Contact Support
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="/sdk"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white/10 text-white font-medium text-lg rounded-sm border border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-900"
              >
                View Docs
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-sm text-secondary-500"
            >
              Email support is available 24/7. Enterprise customers get priority 4-hour response
              times.
            </motion.p>
          </motion.div>

          {/* Right: decorative monogram */}
          <div
            className="lg:col-span-5 hidden lg:flex items-center justify-center"
            aria-hidden="true"
          >
            <span
              className="text-[16rem] font-black leading-none tracking-tighter select-none"
              style={{ color: 'rgba(14, 165, 233, 0.04)' }}
            >
              ?
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
