'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const steps = [
  {
    step: '01',
    word: 'Train',
    title: 'Train on your knowledge base',
    description:
      'Paste URLs to crawl, upload PDFs and DOCX files, or write Q&A pairs directly. Your chatbot is ready to answer questions in minutes, not days.',
  },
  {
    step: '02',
    word: 'Customize',
    title: 'Customize the experience',
    description:
      'Match your brand exactly — colors, fonts, position, dark mode. Add a pre-chat form to capture leads, or configure proactive triggers to start conversations.',
  },
  {
    step: '03',
    word: 'Deploy',
    title: 'Deploy wherever your customers are',
    description:
      'One line of JS for your website, or connect to Slack and Telegram. The REST API and embeddable agent console let you wire it into any existing stack.',
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

export function HomeHowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-6"
          >
            How it works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl lg:text-5xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.1] max-w-2xl"
          >
            From zero to deployed in one afternoon.
          </motion.h2>
        </motion.div>

        {/* Step rows */}
        <motion.div
          className="divide-y divide-secondary-200 dark:divide-secondary-800"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {steps.map(({ step, word, title, description }) => (
            <motion.div
              key={step}
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

              {/* Step number */}
              <div className="lg:col-span-2 flex items-center gap-4 lg:flex-col lg:items-start lg:gap-2">
                <div className="w-8 h-0.5 bg-primary-500" aria-hidden="true" />
                <span className="text-sm font-semibold tracking-[0.2em] text-primary-500">
                  {step}
                </span>
              </div>

              {/* Step title */}
              <div className="lg:col-span-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight">
                  {title}
                </h3>
              </div>

              {/* Step description */}
              <div className="lg:col-span-5">
                <p className="text-base lg:text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 lg:mt-20"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            Start Building Free
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
