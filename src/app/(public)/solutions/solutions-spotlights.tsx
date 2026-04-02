'use client';

import Link from 'next/link';
import { ArrowRight, Headphones, UserPlus, CalendarCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType } from 'react';

interface Spotlight {
  icon: ElementType;
  number: string;
  title: string;
  headline: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
}

const spotlights: Spotlight[] = [
  {
    icon: Headphones,
    number: '01',
    title: 'Customer Support',
    headline: 'Deflect 70% of tickets without lifting a finger.',
    description:
      'Train your chatbot on your help docs, FAQs, and SOPs. It answers the repetitive questions your team handles every day -- accurately, instantly, 24/7.',
    bullets: [
      'Answers from your actual content, not hallucinations',
      'Seamless handoff to a human when needed',
      'Works on your website, Slack, or Telegram',
    ],
    href: '/chatbot-for-customer-support',
    cta: 'See support automation',
  },
  {
    icon: UserPlus,
    number: '02',
    title: 'Lead Capture',
    headline: 'Turn every website visitor into a qualified lead.',
    description:
      'Your chatbot engages visitors proactively, qualifies their intent through natural conversation, and collects contact details -- all without a salesperson on standby.',
    bullets: [
      'Proactive greeting triggers based on page or time',
      'Conversational lead qualification',
      'Captures name, email, phone, and custom fields',
    ],
    href: '/chatbot-for-lead-capture',
    cta: 'See lead capture in action',
  },
  {
    icon: CalendarCheck,
    number: '03',
    title: 'Appointment Booking',
    headline: 'Let visitors book directly inside the chat.',
    description:
      'Integrate with your calendar so visitors can check availability and book appointments in the chat window -- at any hour, without back-and-forth emails.',
    bullets: [
      'Real-time availability from your calendar',
      'Automated confirmation and reminders',
      'Works after hours when your phone is off',
    ],
    href: '/chatbot-booking',
    cta: 'See booking in action',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export function SolutionsSpotlights() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="use-cases"
      className="w-full bg-secondary-50 dark:bg-secondary-900 py-24 lg:py-32 scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-4"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Core use cases
        </motion.p>
        <motion.h2
          className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-16 lg:mb-20 max-w-2xl"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Three problems VocUI solves on day one.
        </motion.h2>

        {/* Alternating spotlight rows */}
        <div className="space-y-20 lg:space-y-28">
          {spotlights.map((spotlight, index) => {
            const Icon = spotlight.icon;
            const isReversed = index % 2 === 1;

            return (
              <motion.div
                key={spotlight.number}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
                initial={prefersReducedMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={stagger}
              >
                {/* Content side */}
                <motion.div
                  variants={fadeUp}
                  className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : ''}`}
                >
                  {/* Number + icon row */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/40">
                      <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold tracking-[0.2em] text-primary-500 uppercase">
                        {spotlight.number}
                      </span>
                      <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                        {spotlight.title}
                      </p>
                    </div>
                  </div>

                  {/* Headline */}
                  <h3 className="text-2xl lg:text-3xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                    {spotlight.headline}
                  </h3>

                  {/* Description */}
                  <p className="text-base lg:text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed mb-6">
                    {spotlight.description}
                  </p>

                  {/* CTA link */}
                  <Link
                    href={spotlight.href}
                    className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                  >
                    {spotlight.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </motion.div>

                {/* Bullet side -- acts as the "evidence" column */}
                <motion.div
                  variants={fadeUp}
                  className={`lg:col-span-5 ${isReversed ? 'lg:order-1' : ''}`}
                >
                  <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6 lg:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary-500 dark:text-secondary-400 mb-5">
                      What it does
                    </p>
                    <ul className="space-y-4">
                      {spotlight.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3">
                          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0" aria-hidden="true" />
                          <span className="text-sm text-secondary-700 dark:text-secondary-300 leading-relaxed">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
