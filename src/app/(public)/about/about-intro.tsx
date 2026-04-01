'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

export function AboutIntro() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="content"
      className="w-full bg-secondary-900 py-20 lg:py-28 scroll-mt-20"
    >
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial={prefersReducedMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        {/* Full-width editorial pull sentence */}
        <motion.p
          variants={fadeUp}
          className="text-3xl lg:text-4xl font-light text-secondary-100 leading-relaxed max-w-4xl mb-16 lg:mb-20"
        >
          Upload your docs, paste your URLs, and have a working chatbot live on your site in under
          an hour — no developers required.
        </motion.p>

        {/* Asymmetric split: bold statement left / explanatory right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start border-t border-secondary-700/50 pt-12 lg:pt-16">
          <motion.div variants={fadeUp} className="lg:col-span-5">
            <p className="text-2xl lg:text-3xl font-bold text-white leading-tight">
              Your knowledge.
              <br />
              Instant answers.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-7">
            <p className="text-lg text-secondary-400 leading-relaxed">
              Your chatbot can{' '}
              <Link
                href="/chatbot-for-customer-support"
                className="text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors"
              >
                answer support questions
              </Link>
              , capture leads,{' '}
              <Link
                href="/chatbot-booking"
                className="text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors"
              >
                book appointments
              </Link>
              , and hand off to a human when needed. All from one platform, deployed wherever your
              customers already are.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
