'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getPopularQuestions } from './faq-data';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface FaqPopularProps {
  onSelectQuestion: (categoryId: string, questionId: string) => void;
}

export function FaqPopular({ onSelectQuestion }: FaqPopularProps) {
  const prefersReducedMotion = useReducedMotion();
  const popularQuestions = getPopularQuestions();

  return (
    <section className="w-full bg-secondary-50 dark:bg-secondary-900 py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetric split: label+heading left, cards right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left column: label + heading */}
          <motion.div
            className="lg:col-span-4"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-4"
            >
              Quick answers
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4"
            >
              Most asked questions
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base text-secondary-600 dark:text-secondary-400 leading-relaxed"
            >
              Start here — these four questions cover what most people need to know.
            </motion.p>
          </motion.div>

          {/* Right column: 2x2 card grid */}
          <motion.div
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {popularQuestions.map((q) => {
              const Icon = q.icon;
              return (
                <motion.button
                  key={q.id}
                  variants={fadeUp}
                  onClick={() => onSelectQuestion(q.categoryId, q.id)}
                  className="group relative text-left p-6 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/40">
                      <Icon className="w-5 h-5 text-primary-500" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      {q.categoryTitle}
                    </span>
                  </div>

                  <p className="text-base font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug pr-8">
                    {q.question}
                  </p>

                  <ArrowRight
                    className="absolute bottom-6 right-6 w-4 h-4 text-secondary-300 dark:text-secondary-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200"
                    aria-hidden="true"
                  />
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
