'use client';

import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function AboutStat() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-secondary-50 dark:bg-secondary-950 py-24 lg:py-32">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial={prefersReducedMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        {/* Three stats in a horizontal strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-secondary-200 dark:bg-secondary-800 rounded-sm overflow-hidden">
          {[
            {
              value: '< 1 hr',
              label: 'Average setup time',
              detail: 'From sign-up to live chatbot',
            },
            {
              value: '0',
              label: 'Developers needed',
              detail: 'One embed snippet, no backend',
            },
            {
              value: '24 / 7',
              label: 'Availability',
              detail: 'Your chatbot never sleeps',
            },
          ].map(({ value, label, detail }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="bg-secondary-50 dark:bg-secondary-950 px-8 py-12 lg:px-12 lg:py-16 flex flex-col gap-3"
            >
              <p
                className="text-5xl lg:text-6xl font-black tracking-tight text-secondary-900 dark:text-secondary-100 leading-none"
              >
                {value}
              </p>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary-500 mt-2">
                {label}
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {detail}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
