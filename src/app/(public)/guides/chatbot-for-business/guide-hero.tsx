'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
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

export function GuideHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* Decorative grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(var(--secondary-200)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--secondary-200)/0.35)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgb(var(--secondary-700)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--secondary-700)/0.25)_1px,transparent_1px)] [background-size:64px_64px]"
        aria-hidden="true"
      />

      {/* Left accent rule */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary-500 via-primary-400 to-transparent"
        aria-hidden="true"
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pb-24">
        <Breadcrumbs
          items={[
            { label: 'Guides', href: '/guides' },
            { label: 'Chatbot for Business' },
          ]}
        />

        <motion.div
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={stagger}
        >
          {/* Left: display heading */}
          <div className="lg:col-span-7">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                Topic Guide
              </span>
              <span className="text-sm text-secondary-400 dark:text-secondary-500">
                12 articles
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.04] mb-6"
            >
              AI Chatbots
              <br />
              for{' '}
              <span className="text-primary-500">Business</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-secondary-600 dark:text-secondary-400 max-w-lg leading-relaxed"
            >
              Your team shouldn&apos;t spend hours answering the same questions
              about pricing, availability, and policies. An AI chatbot trained on
              your content can handle them instantly — so your people focus on
              work that actually needs them.
            </motion.p>
          </div>

          {/* Right: navigation summary */}
          <motion.div variants={fadeUp} className="lg:col-span-5">
            <div className="bg-white/80 dark:bg-secondary-800/60 backdrop-blur-sm border border-secondary-200 dark:border-secondary-700 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-400 dark:text-secondary-500 mb-4">
                In this guide
              </p>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#getting-started"
                    className="group flex items-center gap-3 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <span className="flex-none w-7 h-7 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span className="text-sm font-medium">Best practices to start with</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#industry-guides"
                    className="group flex items-center gap-3 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <span className="flex-none w-7 h-7 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">
                      10
                    </span>
                    <span className="text-sm font-medium">Guides for your industry</span>
                  </Link>
                </li>
              </ul>
              <div className="mt-5 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed">
                  New to chatbots? Start with best practices. Already know your use case? Jump to your industry.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
