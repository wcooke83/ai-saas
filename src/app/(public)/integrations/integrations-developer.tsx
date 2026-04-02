'use client';

import Link from 'next/link';
import { ArrowRight, Code2, CalendarCheck, Terminal, Webhook } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

// ─── Animation ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export function IntegrationsDeveloper() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-4"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Extend &amp; customize
        </motion.p>
        <motion.h2
          className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-16 lg:mb-20 max-w-2xl"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          For developers and power users.
        </motion.h2>

        {/* Asymmetric grid: API/SDK (7 cols) + Booking (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* API / SDK -- prominent left card */}
          <motion.div
            className="lg:col-span-7"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <div className="h-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 p-8 lg:p-10">
              {/* Icon row */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/40">
                  <Code2
                    className="h-6 w-6 text-primary-600 dark:text-primary-400"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] text-primary-500 uppercase">
                    Developer
                  </p>
                  <h3 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
                    API &amp; SDK
                  </h3>
                </div>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="text-base text-secondary-600 dark:text-secondary-400 leading-relaxed mb-8 max-w-lg"
              >
                Build custom integrations with the VocUI REST API, JavaScript
                SDK, and webhook system. Create chatbots programmatically, manage
                knowledge sources, stream responses, and react to conversation
                events in real time.
              </motion.p>

              {/* Capability pills */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: Terminal, label: 'REST API' },
                  { icon: Code2, label: 'JS SDK' },
                  { icon: Webhook, label: 'Webhooks' },
                ].map(({ icon: PillIcon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 text-sm text-secondary-700 dark:text-secondary-300"
                  >
                    <PillIcon className="h-3.5 w-3.5 text-primary-500" aria-hidden="true" />
                    {label}
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Link
                  href="/sdk"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Explore the SDK
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Easy!Appointments -- right card */}
          <motion.div
            className="lg:col-span-5"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <div className="h-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-8 lg:p-10 flex flex-col">
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/40">
                  <CalendarCheck
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] text-green-600 dark:text-green-400 uppercase">
                    Booking
                  </p>
                  <h3 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
                    Easy!Appointments
                  </h3>
                </div>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="text-base text-secondary-600 dark:text-secondary-400 leading-relaxed mb-6"
              >
                Let visitors check availability and book appointments directly
                in the chat window. VocUI connects to your Easy!Appointments
                calendar so customers can self-serve 24/7.
              </motion.p>

              <motion.div variants={fadeUp} className="mb-8">
                <ul className="space-y-3">
                  {[
                    'Real-time availability checks',
                    'In-chat booking confirmation',
                    'Works after business hours',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div
                        className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-secondary-700 dark:text-secondary-300 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Spacer */}
              <div className="flex-1" />

              <motion.div variants={fadeUp}>
                <Link
                  href="/chatbot-booking"
                  className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
                >
                  Learn about booking integration
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
