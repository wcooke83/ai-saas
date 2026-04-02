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

export function SolutionsCta() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full overflow-hidden relative" style={{
      background: 'linear-gradient(135deg, rgb(2, 132, 199), rgb(8, 47, 73))',
    }}>
      {/* Decorative ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 70% 60%, rgba(14,165,233,0.12) 0%, transparent 55%)',
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            className="lg:col-span-7"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-300 mb-6"
            >
              Get started
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
            >
              Not sure where to start?
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg text-primary-200/70 leading-relaxed mb-10 max-w-lg"
            >
              The free plan includes everything you need to build and deploy your
              first chatbot. Upload your content, customize the look, embed it on
              your site. No credit card, no developer required.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-primary-50 text-primary-700 font-semibold text-lg rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
              >
                Build Your Chatbot Free
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white/10 text-white font-medium text-lg rounded-sm border border-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
              >
                See Pricing
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-sm text-primary-200/40"
            >
              Free plan available. No credit card required.
            </motion.p>
          </motion.div>

          {/* Decorative monogram */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center" aria-hidden="true">
            <span
              className="text-[16rem] font-black leading-none tracking-tighter select-none"
              style={{ color: 'rgba(255, 255, 255, 0.04)' }}
            >
              V
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
