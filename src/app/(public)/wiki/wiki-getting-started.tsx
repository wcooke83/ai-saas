'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface WikiPage {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface WikiGettingStartedProps {
  pages: WikiPage[];
  icon: LucideIcon;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

/**
 * Getting Started section — dark full-bleed panel with numbered horizontal strips.
 * Mirrors the beliefs pattern from /about: numbered rows, accent bar,
 * heading left + description right in an asymmetric grid.
 */
export function WikiGettingStarted({ pages, icon: Icon }: WikiGettingStartedProps) {
  const prefersReducedMotion = useReducedMotion();
  const sorted = [...pages].sort((a, b) => a.order - b.order);

  return (
    <section className="w-full bg-secondary-900 dark:bg-secondary-900 py-20 lg:py-28 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <Icon className="w-5 h-5 text-primary-400" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400">
            Getting Started
          </p>
        </motion.div>

        <motion.p
          className="text-3xl lg:text-4xl font-light text-secondary-100 leading-relaxed max-w-3xl mb-14 lg:mb-18"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Go from zero to a working chatbot in three steps.
        </motion.p>

        {/* Numbered step rows */}
        <motion.div
          className="divide-y divide-secondary-700/50"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {sorted.map((page, i) => {
            const number = String(i + 1).padStart(2, '0');

            return (
              <motion.div key={page.id} variants={fadeUp}>
                <Link
                  href={`/wiki/${page.id}`}
                  className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 py-10 lg:py-14 items-start group"
                >
                  {/* Number + accent bar */}
                  <div className="lg:col-span-2 flex items-center gap-4 lg:flex-col lg:items-start lg:gap-2">
                    <div className="w-8 h-0.5 bg-primary-500" aria-hidden="true" />
                    <span className="text-sm font-semibold tracking-[0.2em] text-primary-500">
                      {number}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="lg:col-span-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight group-hover:text-primary-300 transition-colors">
                      {page.title}
                    </h3>
                  </div>

                  {/* Description + arrow */}
                  <div className="lg:col-span-6 flex items-start justify-between gap-6">
                    <p className="text-base lg:text-lg text-secondary-400 leading-relaxed flex-1">
                      {page.description}
                    </p>
                    <ArrowRight
                      className="w-5 h-5 text-secondary-600 group-hover:text-primary-400 transition-colors flex-shrink-0 mt-1"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
