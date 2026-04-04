'use client';

import { CalendarCheck, Users, Globe, Code2, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const trustSignals = [
  'No credit card required',
  '14-day money-back guarantee',
  'Deploy in under an hour',
  'SOC 2-grade infrastructure',
];

const differentiators = [
  {
    number: '01',
    word: 'Channels',
    icon: Globe,
    badge: 'Multi-channel at $29',
    heading: 'Widget, Slack, and Telegram — included on every Base plan',
    body: 'No competitor offers multi-channel deployment at $29/mo. Deploy your chatbot as a site widget, inside Slack, or on Telegram the moment you sign up — no add-ons, no upgrade required.',
  },
  {
    number: '02',
    word: 'Pricing',
    icon: Code2,
    badge: 'Pro plan at $79',
    heading: 'Branding removal + API access + all channels for $79/mo',
    body: 'White-label your chatbot, connect via REST API, and deploy across every supported channel. Chatbase charges $189 for this. Dante AI charges $400. We charge $79 — and nothing is hidden.',
  },
  {
    number: '03',
    word: 'Booking',
    icon: CalendarCheck,
    badge: 'In-chat booking',
    heading: 'Book appointments without leaving the chat',
    body: 'Your chatbot checks real availability and confirms calendar bookings mid-conversation — no redirects, no friction, no follow-up email needed. Connects to Easy!Appointments out of the box.',
  },
  {
    number: '04',
    word: 'Handoff',
    icon: Users,
    badge: 'Embeddable agent console',
    heading: 'Live agent handoff that fits how your team already works',
    body: 'When a conversation needs a human, agents take over instantly. The agent console embeds in any internal tool via SDK — your team never has to log into a separate platform.',
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

export function HomeFeatures() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* ── Trust Bar ──────────────────────────────────────────────────────── */}
      <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
          >
            {trustSignals.map((signal) => (
              <motion.div
                key={signal}
                variants={fadeUp}
                className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                <span>{signal}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Differentiators ────────────────────────────────────────────────── */}
      <section id="features" className="w-full bg-secondary-900 py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section label */}
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-12 lg:mb-16"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            What makes VocUI different
          </motion.p>

          {/* Feature rows */}
          <motion.div
            className="divide-y divide-secondary-700/40"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {differentiators.map(({ number, word, icon: Icon, badge, heading, body }) => (
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

                {/* Heading + badge */}
                <div className="lg:col-span-4">
                  <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-primary-400/70 border border-primary-700/40 px-2 py-0.5 rounded-sm mb-4">
                    {badge}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                    {heading}
                  </h3>
                </div>

                {/* Body + icon */}
                <div className="lg:col-span-5 flex items-start gap-4">
                  <div className="hidden lg:flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 flex-shrink-0 mt-1">
                    <Icon className="h-5 w-5 text-primary-400" aria-hidden="true" />
                  </div>
                  <p className="text-base lg:text-lg text-secondary-400 leading-relaxed">
                    {body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
