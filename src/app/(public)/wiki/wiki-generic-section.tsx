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

interface WikiGenericSectionProps {
  title: string;
  description: string;
  pages: WikiPage[];
  icon: LucideIcon;
  /** Alternate background for visual rhythm */
  variant: 'light' | 'dark';
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/**
 * Generic fallback section for any category that doesn't have a
 * specialized treatment. Uses a 3-column card grid with proper
 * animations and the section label pattern.
 */
export function WikiGenericSection({
  title,
  description,
  pages,
  icon: Icon,
  variant,
}: WikiGenericSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const sorted = [...pages].sort((a, b) => a.order - b.order);

  const bgClass =
    variant === 'dark'
      ? 'bg-secondary-900 dark:bg-secondary-900'
      : 'bg-secondary-50 dark:bg-secondary-950';

  const labelColor = variant === 'dark' ? 'text-primary-400' : 'text-primary-500';
  const headingColor =
    variant === 'dark'
      ? 'text-white'
      : 'text-secondary-900 dark:text-secondary-100';
  const bodyColor =
    variant === 'dark'
      ? 'text-secondary-400'
      : 'text-secondary-600 dark:text-secondary-400';

  return (
    <section className={`w-full ${bgClass} py-20 lg:py-28`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-12 lg:mb-16"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <Icon className={`w-5 h-5 ${labelColor}`} />
            <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${labelColor}`}>
              {title}
            </p>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className={`text-2xl lg:text-3xl font-bold ${headingColor} leading-tight mb-3`}
          >
            {title}
          </motion.h2>
          <motion.p variants={fadeUp} className={`text-base ${bodyColor} max-w-2xl`}>
            {description}
          </motion.p>
        </motion.div>

        {/* Card grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {sorted.map((page) => (
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
      </div>
    </section>
  );
}
