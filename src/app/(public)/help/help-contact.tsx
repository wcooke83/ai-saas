'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { HelpForm } from './help-form';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface HelpContactProps {
  prefilledSubject: string;
}

export function HelpContact({ prefilledSubject }: HelpContactProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="contact" className="w-full bg-primary-950 py-24 lg:py-32 overflow-hidden scroll-mt-20">
      {/* Decorative ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 30% 50%, rgba(14,165,233,0.07) 0%, transparent 55%)',
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetric grid: copy left, form right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: heading + context */}
          <motion.div
            className="lg:col-span-5 lg:sticky lg:top-28"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-6"
            >
              Get in touch
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-8"
            >
              Send us a message.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg text-primary-200/60 leading-relaxed mb-10 max-w-md"
            >
              Can&apos;t find what you&apos;re looking for? Describe your issue and we&apos;ll get back to you within one business day.
            </motion.p>

            {/* Direct email fallback */}
            <motion.p variants={fadeUp} className="text-sm text-primary-200/40">
              Or email us directly at{' '}
              <a
                href="mailto:support@vocui.com"
                className="text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors"
              >
                support@vocui.com
              </a>
            </motion.p>

            {/* Decorative monogram */}
            <div className="hidden lg:block mt-16" aria-hidden="true">
              <span
                className="text-[14rem] font-black leading-none tracking-tighter select-none pointer-events-none"
                style={{ color: 'rgba(14, 165, 233, 0.05)' }}
              >
                ?
              </span>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            className="lg:col-span-7"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <div className="bg-secondary-900/50 border border-secondary-700/50 rounded-sm p-6 sm:p-8 lg:p-10">
              <HelpForm prefilledSubject={prefilledSubject} variant="dark" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
