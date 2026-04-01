'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { FileQuestion, Book, History, ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const options = [
  {
    icon: FileQuestion,
    title: 'Browse the FAQ',
    description: 'Covers billing, credits, API, and most common questions.',
    href: '/faq',
  },
  {
    icon: Book,
    title: 'Read the Docs',
    description: 'Setup guides, API reference, and integration tutorials.',
    href: '/sdk',
  },
  {
    icon: History,
    title: 'Check the Changelog',
    description: "Latest features and fixes — your question might already be answered.",
    href: '/changelog',
  },
];

export function ContactSelfService() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-10"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Before you write in
        </motion.p>

        <motion.div
          className="divide-y divide-secondary-200 dark:divide-secondary-700"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {options.map(({ icon: Icon, title, description, href }) => (
            <motion.div key={href} variants={fadeUp}>
              <Link
                href={href}
                className="group flex items-center gap-6 py-7 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
              >
                {/* Icon */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors"
                  style={{ backgroundColor: 'rgba(14, 165, 233, 0.08)' }}
                >
                  <Icon className="h-5 w-5 text-primary-500 group-hover:text-primary-400 transition-colors" aria-hidden="true" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {title}
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                    {description}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight
                  className="h-5 w-5 shrink-0 text-secondary-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
