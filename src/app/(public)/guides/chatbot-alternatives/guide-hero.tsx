'use client';

import Link from 'next/link';
import { GitCompareArrows } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface PlatformPill {
  initial: string;
  label: string;
  slug: string;
  color: string;
}

const platforms: PlatformPill[] = [
  { initial: 'C', label: 'Chatbase', slug: 'chatbase-alternatives', color: 'bg-violet-500' },
  { initial: 'T', label: 'Tidio', slug: 'tidio-alternatives', color: 'bg-blue-500' },
  { initial: 'I', label: 'Intercom', slug: 'intercom-alternatives', color: 'bg-indigo-500' },
  { initial: 'D', label: 'Drift', slug: 'drift-alternatives', color: 'bg-amber-500' },
  { initial: 'Z', label: 'Zendesk', slug: 'zendesk-chat-alternatives', color: 'bg-emerald-500' },
  { initial: 'F', label: 'Freshchat', slug: 'freshchat-alternatives', color: 'bg-rose-500' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const pillStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const pillFade = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export function GuideHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-label="Chatbot alternatives overview" className="relative overflow-hidden">
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
            { label: 'Chatbot Alternatives Guide' },
          ]}
        />

        <motion.div
          className="mt-8 max-w-4xl"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={stagger}
        >
          {/* Badge row */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
              <GitCompareArrows className="w-4 h-4" aria-hidden="true" />
              Platform Comparison Guide
            </span>
            <span className="text-sm text-secondary-400 dark:text-secondary-500">
              6 comparisons + 1 strategy guide
            </span>
          </motion.div>

          {/* Display heading — sr-only keyword string for SEO, creative copy visible */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.02] mb-6"
          >
            <span className="sr-only">Chatbot Alternatives Compared: </span>
            Done researching?
            <br />
            <span className="text-primary-500">Pick your platform.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="text-lg lg:text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl leading-relaxed mb-12"
          >
            Pricing, AI features, knowledge training, and setup time compared
            across the six chatbot platforms small businesses evaluate most.
          </motion.p>
        </motion.div>

        {/* Quick-jump platform pills */}
        <motion.div
          className="flex flex-wrap gap-3"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={pillStagger}
        >
          <span className="self-center text-xs font-semibold uppercase tracking-[0.18em] text-secondary-400 dark:text-secondary-500 mr-1">
            Jump to
          </span>
          {platforms.map((platform) => (
            <motion.div key={platform.slug} variants={pillFade}>
              <Link
                href={`/blog/${platform.slug}`}
                aria-label={`Read ${platform.label} alternatives comparison`}
                className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-secondary-800/60 backdrop-blur-sm border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <span
                  className={`flex-none w-7 h-7 rounded-lg ${platform.color} flex items-center justify-center text-xs font-bold text-white`}
                  aria-hidden="true"
                >
                  {platform.initial}
                </span>
                <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  vs. {platform.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
