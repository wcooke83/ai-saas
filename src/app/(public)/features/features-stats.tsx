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

const stats = [
  {
    value: '12',
    label: 'Core features',
    detail: 'Every capability in one platform',
  },
  {
    value: '5+',
    label: 'Deployment channels',
    detail: 'Widget, iFrame, Slack, Telegram, API',
  },
  {
    value: '< 1 hr',
    label: 'Time to deploy',
    detail: 'From sign-up to live chatbot',
  },
];

export function FeaturesStats() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-secondary-50 dark:bg-secondary-950 py-20 lg:py-28">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial={prefersReducedMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-secondary-200 dark:bg-secondary-800 rounded-sm overflow-hidden">
          {stats.map(({ value, label, detail }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="bg-secondary-50 dark:bg-secondary-950 px-8 py-12 lg:px-12 lg:py-16 flex flex-col gap-3"
            >
              <p className="text-5xl lg:text-6xl font-black tracking-tight text-secondary-900 dark:text-secondary-100 leading-none">
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
