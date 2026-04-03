'use client';

import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const criteria = [
  {
    number: '01',
    word: 'Pricing',
    heading: 'Pricing that makes sense',
    body: 'Is the free plan genuinely usable? Do AI conversations cost extra per message? We break down what each tier unlocks so there are no surprises.',
  },
  {
    number: '02',
    word: 'Training',
    heading: 'Knowledge training',
    body: 'Can you train the chatbot on your own documents, URLs, and PDFs? Or are you stuck with a generic model that doesn\'t know your business?',
  },
  {
    number: '03',
    word: 'Setup',
    heading: 'Time to launch',
    body: 'How quickly can you go live? Some platforms take minutes with no developer needed. Others require onboarding calls or a sales conversation first.',
  },
  {
    number: '04',
    word: 'Deploy',
    heading: 'Where it works',
    body: 'Website widget, Slack, Telegram, or all three? We check every platform\'s deployment options and whether it supports live agent handoff.',
  },
];

export function GuideCriteria() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="criteria"
      aria-label="Chatbot evaluation criteria"
      className="w-full bg-primary-950 py-24 lg:py-32 overflow-hidden scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="mb-12 lg:mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-4"
          >
            Evaluation criteria
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-white mb-3"
          >
            How we evaluate chatbot alternatives
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-lg text-primary-200/80 max-w-2xl"
          >
            Every comparison covers these four areas — so you always have what you need to decide.
          </motion.p>
        </motion.div>

        {/* Criteria rows — horizontal strips with left accent, matching about-beliefs */}
        <motion.div
          className="divide-y divide-primary-800/40"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {criteria.map((item) => (
            <motion.div
              key={item.number}
              variants={fadeUp}
              className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-10 lg:py-14 items-start overflow-hidden"
            >
              {/* Large background word — decorative */}
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[7rem] lg:text-[10rem] font-black leading-none tracking-tighter select-none pointer-events-none"
                style={{ color: 'rgba(14, 165, 233, 0.04)' }}
                aria-hidden="true"
              >
                {item.word}
              </span>

              {/* Number + accent bar */}
              <div className="lg:col-span-2 flex items-center gap-4 lg:flex-col lg:items-start lg:gap-2">
                <div className="w-12 h-0.5 bg-primary-500" aria-hidden="true" />
                <span className="text-sm font-semibold tracking-[0.2em] text-primary-500">
                  {item.number}
                </span>
              </div>

              {/* Heading */}
              <div className="lg:col-span-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {item.heading}
                </h3>
              </div>

              {/* Body */}
              <div className="lg:col-span-6">
                <p className="text-base lg:text-lg text-primary-200/80 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
