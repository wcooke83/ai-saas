'use client';

import Link from 'next/link';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function IndustriesCta() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-primary-950 py-24 lg:py-32 overflow-hidden relative">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: CTA content */}
          <motion.div
            className="lg:col-span-7"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-500/20">
                <MessageSquare className="h-4 w-4 text-primary-400" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400">
                Don&apos;t see your industry?
              </p>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-8"
            >
              VocUI works for{' '}
              <span className="text-primary-400">any business</span>{' '}
              that answers the same questions repeatedly.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg text-primary-200/60 leading-relaxed mb-10 max-w-lg"
            >
              Upload your documents or paste in your URLs. Your chatbot is trained, embedded, and live
              in under an hour. No developers needed, no credit card required.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
              >
                Build Your Chatbot Free
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white/10 text-white font-medium text-lg rounded-sm border border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
              >
                Contact Us
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-sm text-primary-200/40"
            >
              No credit card required. Free plan available.
            </motion.p>
          </motion.div>

          {/* Right: large decorative monogram */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center" aria-hidden="true">
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
