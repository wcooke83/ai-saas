'use client';

import { Brain, UserCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

type AIPrinciple = {
  icon: ElementType;
  title: string;
  body: string;
};

const principles: AIPrinciple[] = [
  {
    icon: Brain,
    title: 'Grounded in your content',
    body: "VocUI chatbots answer from your knowledge base, not from general training data. When a question isn't covered by your content, the chatbot says so rather than guessing.",
  },
  {
    icon: UserCheck,
    title: 'Human escalation built in',
    body: 'Live agent handoff is a first-class feature, not an afterthought. You can configure escalation triggers so high-risk conversations always reach a human.',
  },
];

export function SecurityAI() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-secondary-50 dark:bg-secondary-950 py-24 lg:py-32 overflow-hidden">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial={prefersReducedMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        {/* Asymmetric layout: large decorative number left, content right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left: decorative anchor */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-4 flex flex-col gap-3"
            aria-hidden="true"
          >
            <p
              className="text-[9rem] lg:text-[12rem] font-black leading-none tracking-tighter text-secondary-200 dark:text-secondary-800 select-none"
            >
              2
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 -mt-4 lg:-mt-8">
              Responsible AI principles
            </p>
          </motion.div>

          {/* Right: principle cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-secondary-200 dark:bg-secondary-800 rounded-sm overflow-hidden">
            {principles.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-secondary-50 dark:bg-secondary-950 px-8 py-10 lg:px-10 lg:py-12 flex flex-col gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary-50 dark:bg-primary-900/30">
                  <Icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 leading-snug">
                  {title}
                </h3>
                <p className="text-base text-secondary-500 dark:text-secondary-400 leading-relaxed">
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
