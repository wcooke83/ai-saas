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

export function FeaturesCta() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full bg-primary-950 py-24 lg:py-32 overflow-hidden">
      {/* Decorative ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 70% 60%, rgba(14,165,233,0.07) 0%, transparent 55%)',
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetric grid: content left, decorative right */}
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
              Ready to build?
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-8"
            >
              All 12 features. One platform. Free to start.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg text-primary-200/60 leading-relaxed mb-4 max-w-lg"
            >
              Build a chatbot trained on your actual knowledge base — live on your site today, no credit card needed.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-sm text-primary-200/40 leading-relaxed mb-10 max-w-lg"
            >
              Booking, handoff, telemetry, lead capture, ticketing, and more — all from one dashboard.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
              >
                Build Your Chatbot Free
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white/10 text-white font-medium text-lg rounded-sm border border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
              >
                View Pricing
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-sm text-primary-200/40"
            >
              No credit card required &mdash; 14-day money-back guarantee
            </motion.p>
          </motion.div>

          {/* Right: large decorative monogram */}
          <div
            className="lg:col-span-5 hidden lg:flex items-center justify-center"
            aria-hidden="true"
          >
            <span
              className="text-[18rem] font-black leading-none tracking-tighter select-none"
              style={{ color: 'rgba(14, 165, 233, 0.05)' }}
            >
              V
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
