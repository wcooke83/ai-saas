'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
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

export function IntegrationsHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pb-28">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Integrations' }]} />

        {/* Asymmetric hero: content left, channel previews right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mt-8 lg:mt-12">
          {/* Left: headline + sub */}
          <motion.div
            className="lg:col-span-7"
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-6"
            >
              Integrations
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.1] mb-6"
            >
              Connect VocUI{' '}
              <span className="text-primary-500">everywhere</span> your
              customers are.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-secondary-600 dark:text-secondary-400 max-w-xl leading-relaxed mb-10"
            >
              One chatbot, trained on your content. Deploy it on your website,
              in Slack, on Telegram, via Facebook Messenger, Instagram DMs, SMS,
              email, or inside WordPress and Shopify -- wherever your
              conversations happen.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Build Your Chatbot Free
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="#channels"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300 font-medium text-lg rounded-sm border border-secondary-300 dark:border-secondary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                View Integrations
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: integration stats */}
          <motion.div
            className="lg:col-span-5"
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={stagger}
          >
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-6 lg:gap-0 lg:divide-y lg:divide-secondary-200 dark:lg:divide-secondary-700">
              {[
                { value: '13+', label: 'Integrations available' },
                { value: '1 line', label: 'Of code to embed' },
                { value: '< 5 min', label: 'To deploy anywhere' },
              ].map(({ value, label }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="lg:py-5 first:lg:pt-0 last:lg:pb-0"
                >
                  <p className="text-3xl lg:text-4xl font-black tracking-tight text-secondary-900 dark:text-secondary-100 leading-none">
                    {value}
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                    {label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
