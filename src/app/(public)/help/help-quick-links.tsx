'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const quickLinks = [
  { title: 'How do credits work?', href: '/faq#credits' },
  { title: 'How to use the API?', href: '/sdk#api' },
  { title: 'Billing & subscriptions', href: '/faq#billing' },
  { title: 'Account settings', href: '/dashboard/settings' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function HelpQuickLinks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-secondary-50 dark:bg-secondary-950 py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetric split: stat left, quick links right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: response-time stat as visual anchor */}
          <motion.div
            className="lg:col-span-5"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-6"
            >
              Quick access
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-6xl lg:text-7xl font-black tracking-tight text-secondary-900 dark:text-secondary-100 leading-none mb-4"
            >
              &lt; 24h
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-sm font-semibold uppercase tracking-[0.15em] text-primary-500 mb-3"
            >
              Average response time
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-base text-secondary-500 dark:text-secondary-400 max-w-xs leading-relaxed"
            >
              Most questions are answered the same business day. Check the docs or FAQ for instant answers.
            </motion.p>
          </motion.div>

          {/* Right: quick links as a vertical list with dividers */}
          <motion.div
            className="lg:col-span-7 lg:border-l lg:border-secondary-200 lg:dark:border-secondary-800 lg:pl-16"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-8"
            >
              Common topics
            </motion.p>

            <div className="divide-y divide-secondary-200 dark:divide-secondary-800">
              {quickLinks.map(({ title, href }) => (
                <motion.div key={title} variants={fadeUp}>
                  <Link
                    href={href}
                    className="group flex items-center justify-between py-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-sm"
                  >
                    <span className="text-lg font-medium text-secondary-700 dark:text-secondary-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {title}
                    </span>
                    <ArrowRight
                      className="h-5 w-5 text-secondary-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
                      aria-hidden="true"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
