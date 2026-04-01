'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Clock, Lock, Users } from 'lucide-react';

const beliefs = [
  {
    number: '01',
    Icon: Clock,
    heading: 'Minutes, not months.',
    body: 'Setup should take minutes — one line of code to embed, no API integrations required.',
  },
  {
    number: '02',
    Icon: Lock,
    heading: 'Your data stays yours.',
    body: 'We never use your knowledge base content to train our models. Full stop.',
  },
  {
    number: '03',
    Icon: Users,
    heading: 'Handoff is a feature.',
    body: 'The best chatbot knows when to bring in a human. Escalation is never a failure.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

export function AboutBeliefs() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-primary-950 py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400 mb-10"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          What we believe
        </motion.p>

        {/* Belief items */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-primary-800/40"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {beliefs.map(({ number, Icon, heading, body }) => (
            <motion.div
              key={number}
              variants={fadeUp}
              className="bg-primary-950 px-8 py-10 lg:px-10 lg:py-12 flex flex-col gap-6"
            >
              <div className="flex items-start justify-between">
                <span
                  className="text-6xl font-black leading-none tracking-tighter text-primary-800 select-none"
                  aria-hidden="true"
                >
                  {number}
                </span>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500/10 border border-primary-500/20">
                  <Icon className="h-5 w-5 text-primary-400" aria-hidden="true" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white leading-tight">
                  {heading}
                </h3>
                <p className="text-base text-primary-200/70 leading-relaxed">
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
