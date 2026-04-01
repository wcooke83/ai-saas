'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface WikiPage {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface WikiFeaturesSectionProps {
  title: string;
  description: string;
  pages: WikiPage[];
  icon: LucideIcon;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/**
 * Features section — light bg, asymmetric card grid.
 * First page gets a large featured card spanning 2 columns.
 * Remaining pages alternate between standard cards and compact list items.
 */
export function WikiFeaturesSection({
  title,
  description,
  pages,
  icon: Icon,
}: WikiFeaturesSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const sorted = [...pages].sort((a, b) => a.order - b.order);

  // Split: featured (first 2), grid cards (next batch), compact list (rest)
  const featured = sorted.slice(0, 2);
  const gridCards = sorted.slice(2, 8);
  const listItems = sorted.slice(8);

  return (
    <section className="w-full bg-secondary-50 dark:bg-secondary-950 py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header — asymmetric split */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-end mb-14 lg:mb-20"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-5 h-5 text-primary-500" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500">
                {title}
              </p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight">
              Deep-dive into every feature.
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <p className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xl">
              {description} — from knowledge bases and widget customization to
              analytics, live handoff, and everything in between.
            </p>
          </motion.div>
        </motion.div>

        {/* Featured cards — large, 2-column layout */}
        {featured.length > 0 && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {featured.map((page) => (
              <motion.div key={page.id} variants={fadeUp}>
                <Link href={`/wiki/${page.id}`} className="group block h-full">
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700">
                    <CardContent className="p-8 lg:p-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <ArrowRight
                          className="w-5 h-5 text-secondary-400 group-hover:text-primary-500 transition-colors"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="text-xl lg:text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-base text-secondary-600 dark:text-secondary-400 leading-relaxed">
                        {page.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Standard card grid — 3 columns */}
        {gridCards.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {gridCards.map((page) => (
              <motion.div key={page.id} variants={fadeUp}>
                <Link href={`/wiki/${page.id}`} className="group block h-full">
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-base font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug flex-1 pr-4">
                          {page.title}
                        </h3>
                        <ArrowRight
                          className="w-4 h-4 text-secondary-400 group-hover:text-primary-500 transition-colors flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed">
                        {page.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Compact list — tight rows for remaining items */}
        {listItems.length > 0 && (
          <motion.div
            className="border border-secondary-200 dark:border-secondary-800 rounded-lg overflow-hidden divide-y divide-secondary-200 dark:divide-secondary-800"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {listItems.map((page) => (
              <motion.div key={page.id} variants={fadeUp}>
                <Link
                  href={`/wiki/${page.id}`}
                  className="group flex items-center justify-between gap-4 px-6 py-5 hover:bg-secondary-100 dark:hover:bg-secondary-900 transition-colors"
                  style={{
                    backgroundColor: 'rgb(var(--card-bg))',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                      {page.title}
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5 truncate">
                      {page.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-secondary-400 group-hover:text-primary-500 transition-colors flex-shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
