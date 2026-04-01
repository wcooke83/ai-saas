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

const badgeConfig: Record<BadgeType, { icon: typeof Sparkles; dotColor: string; labelColor: string }> = {
  New: {
    icon: Sparkles,
    dotColor: 'bg-emerald-400',
    labelColor: 'text-emerald-400',
  },
  Improved: {
    icon: Zap,
    dotColor: 'bg-blue-400',
    labelColor: 'text-blue-400',
  },
  Fix: {
    icon: Wrench,
    dotColor: 'bg-amber-400',
    labelColor: 'text-amber-400',
  },
};

interface ChangelogRecentProps {
  months: ChangelogMonth[];
  entryLinks: Record<string, string>;
}

export function ChangelogRecent({ months, entryLinks }: ChangelogRecentProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-primary-950 py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-12 lg:mb-16"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Recent updates
        </motion.p>

        {/* Month groups */}
        <div className="space-y-16 lg:space-y-20">
          {months.map((month) => (
            <motion.div
              key={month.month}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              {/* Month heading */}
              <motion.h2
                variants={fadeUp}
                className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-8 lg:mb-10"
              >
                {month.month}
              </motion.h2>

              {/* Entry rows — horizontal strips */}
              <div className="divide-y divide-primary-800/40">
                {month.entries.map((entry) => {
                  const badge = badgeConfig[entry.badge];
                  const link = entryLinks[entry.title];

                  return (
                    <motion.div
                      key={entry.title}
                      variants={fadeUp}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 py-8 lg:py-10 items-start"
                    >
                      {/* Badge column */}
                      <div className="lg:col-span-2 flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${badge.dotColor} shrink-0`} aria-hidden="true" />
                        <span className={`text-xs font-bold uppercase tracking-wider ${badge.labelColor}`}>
                          {entry.badge}
                        </span>
                      </div>

                      {/* Title column */}
                      <div className="lg:col-span-3">
                        <h3 className="text-lg font-bold text-white leading-tight">
                          {link ? (
                            <Link
                              href={link}
                              className="hover:text-primary-300 transition-colors inline-flex items-center gap-2"
                            >
                              {entry.title}
                              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                            </Link>
                          ) : (
                            entry.title
                          )}
                        </h3>
                      </div>

                      {/* Detail column */}
                      <div className="lg:col-span-7">
                        <p className="text-base text-primary-200/60 leading-relaxed">
                          {entry.detail}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
