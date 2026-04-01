'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export function AboutIntro() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="content"
      className="w-full bg-secondary-50 dark:bg-secondary-900 py-20 lg:py-28 scroll-mt-20"
    >
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start"
        initial={prefersReducedMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        {/* Left: anchor label */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-3 pt-1"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
            What we do
          </p>
        </motion.div>

        {/* Right: editorial copy */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-9 space-y-6"
        >
          <p className="text-2xl lg:text-3xl font-light text-secondary-800 dark:text-secondary-100 leading-relaxed">
            Upload your docs, paste your URLs, and have a working chatbot live on your site in under
            an hour — no developers required.
          </p>
          <p className="text-lg text-secondary-500 dark:text-secondary-400 leading-relaxed max-w-2xl">
            Your chatbot can{' '}
            <Link
              href="/chatbot-for-customer-support"
              className="text-primary-600 dark:text-primary-400 hover:underline underline-offset-2"
            >
              answer support questions
            </Link>
            , capture leads,{' '}
            <Link
              href="/chatbot-booking"
              className="text-primary-600 dark:text-primary-400 hover:underline underline-offset-2"
            >
              book appointments
            </Link>
            , and hand off to a human when needed. All from one platform, deployed wherever your
            customers already are.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
