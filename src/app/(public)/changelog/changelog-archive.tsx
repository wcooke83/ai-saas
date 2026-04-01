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
  visible: { transition: { staggerChildren: 0.1 } },
};

const badgeConfig: Record<BadgeType, { icon: typeof Sparkles; color: string; bg: string }> = {
  New: {
    icon: Sparkles,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  Improved: {
    icon: Zap,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  Fix: {
    icon: Wrench,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
  },
};

interface ChangelogArchiveProps {
  months: ChangelogMonth[];
  entryLinks: Record<string, string>;
}

export function ChangelogArchive({ months, entryLinks }: ChangelogArchiveProps) {
  const prefersReducedMotion = useReducedMotion();

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
            Earlier releases
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-2xl lg:text-3xl font-bold text-secondary-900 dark:text-secondary-100 tracking-tight"
          >
            2025
          </motion.h2>
        </motion.div>

        {/* Months rendered as compact card groups */}
        <div className="space-y-12 lg:space-y-16">
          {months.map((month) => (
            <motion.div
              key={month.month}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              {/* Month label */}
              <motion.h3
                variants={fadeUp}
                className="text-sm font-semibold uppercase tracking-widest text-secondary-500 dark:text-secondary-400 mb-6"
              >
                {month.month}
              </motion.h3>

              {/* Compact entry grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={stagger}
              >
                {month.entries.map((entry) => {
                  const badge = badgeConfig[entry.badge];
                  const Icon = badge.icon;
                  const link = entryLinks[entry.title];

                  return (
                    <motion.div
                      key={entry.title}
                      variants={fadeUp}
                      className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-5 flex flex-col"
                    >
                      {/* Badge row */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${badge.bg} ${badge.color}`}>
                          <Icon className="h-3 w-3" aria-hidden="true" />
                          {entry.badge}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-bold text-secondary-900 dark:text-secondary-100 leading-snug mb-2">
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
                      </h4>

                      {/* Detail */}
                      <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed flex-1">
                        {entry.detail}
                      </p>

                      {/* Link */}
                      {link && (
                        <Link
                          href={link}
                          className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                        >
                          Learn more
                          <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
