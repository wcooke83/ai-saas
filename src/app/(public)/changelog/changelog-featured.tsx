'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Wrench, Zap } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ChangelogMonth, BadgeType } from './changelog-data';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const badgeConfig: Record<BadgeType, { icon: typeof Sparkles; label: string; color: string; bg: string }> = {
  New: {
    icon: Sparkles,
    label: 'New',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  Improved: {
    icon: Zap,
    label: 'Improved',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  Fix: {
    icon: Wrench,
    label: 'Fix',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
  },
};

interface ChangelogFeaturedProps {
  month: ChangelogMonth;
  entryLinks: Record<string, string>;
}

export function ChangelogFeatured({ month, entryLinks }: ChangelogFeaturedProps) {
  const prefersReducedMotion = useReducedMotion();
  const [featured, ...rest] = month.entries;

  return (
    <section className="w-full bg-secondary-50 dark:bg-secondary-900 py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="mb-12 lg:mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-4"
          >
            Latest
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 tracking-tight"
          >
            {month.month}
          </motion.h2>
        </motion.div>

        {/* Featured entry — full-width card with larger treatment */}
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-8"
        >
          <FeaturedCard entry={featured} link={entryLinks[featured.title]} />
        </motion.div>

        {/* Remaining entries — side-by-side cards */}
        {rest.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {rest.map((entry) => (
              <motion.div key={entry.title} variants={fadeUp}>
                <EntryCard entry={entry} link={entryLinks[entry.title]} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ entry, link }: { entry: ChangelogMonth['entries'][number]; link?: string }) {
  const badge = badgeConfig[entry.badge];
  const Icon = badge.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-8 lg:p-12">
      {/* Decorative gradient accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        <div className="lg:col-span-7">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.bg} ${badge.color}`}>
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {badge.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl lg:text-3xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
            {link ? (
              <Link
                href={link}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {entry.title}
              </Link>
            ) : (
              entry.title
            )}
          </h3>

          {/* Description */}
          <p className="text-base lg:text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed">
            {entry.detail}
          </p>

          {/* Link arrow */}
          {link && (
            <Link
              href={link}
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Learn more
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* Right side — decorative large number */}
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center" aria-hidden="true">
          <span
            className="text-[10rem] font-black leading-none tracking-tighter select-none"
            style={{ color: 'rgba(14, 165, 233, 0.06)' }}
          >
            01
          </span>
        </div>
      </div>
    </div>
  );
}

function EntryCard({ entry, link }: { entry: ChangelogMonth['entries'][number]; link?: string }) {
  const badge = badgeConfig[entry.badge];
  const Icon = badge.icon;

  return (
    <div className="relative rounded-2xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6 lg:p-8 h-full flex flex-col">
      {/* Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.bg} ${badge.color}`}>
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {badge.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-3">
        {link ? (
          <Link
            href={link}
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {entry.title}
          </Link>
        ) : (
          entry.title
        )}
      </h3>

      {/* Description */}
      <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed flex-1">
        {entry.detail}
      </p>

      {/* Link */}
      {link && (
        <Link
          href={link}
          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          Learn more
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
