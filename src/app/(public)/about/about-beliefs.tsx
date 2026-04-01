'use client';

import { motion, useReducedMotion } from 'framer-motion';

const beliefs = [
  {
    number: '01',
    word: 'Speed',
    heading: 'Minutes, not months.',
    body: 'Setup should take minutes — one line of code to embed, no API integrations required.',
  },
  {
    number: '02',
    word: 'Privacy',
    heading: 'Your data stays yours.',
    body: 'We never use your knowledge base content to train our models. Full stop.',
  },
  {
    number: '03',
    word: 'Empathy',
    heading: 'Handoff is a feature.',
    body: 'The best chatbot knows when to bring in a human. Escalation is never a failure.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

export function AboutBeliefs() {
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
          What we believe
        </motion.p>

        {/* Belief rows — stacked horizontal strips with left accent */}
        <motion.div
          className="divide-y divide-primary-800/40"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {beliefs.map(({ number, word, heading, body }) => (
            <motion.div
              key={number}
              variants={fadeUp}
              className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-10 lg:py-14 items-start overflow-hidden"
            >
              {/* Large background word — decorative */}
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[8rem] lg:text-[11rem] font-black leading-none tracking-tighter select-none pointer-events-none"
                style={{ color: 'rgba(14, 165, 233, 0.04)' }}
                aria-hidden="true"
              >
                {word}
              </span>

              {/* Number + accent bar */}
              <div className="lg:col-span-2 flex items-center gap-4 lg:flex-col lg:items-start lg:gap-2">
                <div className="w-8 h-0.5 bg-primary-500" aria-hidden="true" />
                <span className="text-sm font-semibold tracking-[0.2em] text-primary-500">
                  {number}
                </span>
              </div>

              {/* Heading */}
              <div className="lg:col-span-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {heading}
                </h3>
              </div>

              {/* Body */}
              <div className="lg:col-span-5">
                <p className="text-base lg:text-lg text-primary-200/60 leading-relaxed">
                  {body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
