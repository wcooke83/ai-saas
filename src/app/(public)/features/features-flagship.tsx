'use client';

import {
  CalendarCheck,
  Users,
  Activity,
  Clock,
  Plug,
  Shield,
  Headphones,
  Code2,
  Gauge,
  BarChart3,
  Search,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────────
 * Data
 * ──────────────────────────────────────────────────────────────────────────── */

interface FlagshipFeature {
  number: string;
  badge: string;
  icon: LucideIcon;
  heading: string;
  body: string;
  bullets: { icon: LucideIcon; text: string }[];
}

const flagshipFeatures: FlagshipFeature[] = [
  {
    number: '01',
    badge: 'In-chat booking',
    icon: CalendarCheck,
    heading: 'Book appointments without leaving the chat',
    body: 'Your chatbot checks real availability and confirms calendar bookings mid-conversation — no redirects, no friction, no follow-up email needed. Connects to Easy!Appointments out of the box.',
    bullets: [
      { icon: Clock, text: 'Real-time availability checks' },
      { icon: Plug, text: 'Easy!Appointments integration' },
      { icon: Shield, text: 'Confirmation & reminder flow built in' },
    ],
  },
  {
    number: '02',
    badge: 'Embeddable agent console',
    icon: Users,
    heading: 'Live agent handoff that fits how your team already works',
    body: 'When a conversation needs a human, agents take over instantly. The agent console embeds in any internal tool via SDK — your team never has to log into a separate platform.',
    bullets: [
      { icon: Headphones, text: 'Instant takeover, zero context loss' },
      { icon: Code2, text: 'SDK embeds into your internal tools' },
      { icon: Shield, text: 'Smart routing by topic or sentiment' },
    ],
  },
  {
    number: '03',
    badge: 'Performance telemetry',
    icon: Activity,
    heading: 'See exactly where every millisecond goes',
    body: 'A Firefox-style waterfall chart breaks your RAG pipeline into 10+ labeled stages — retrieval, rerank, generation, fallback. Find bottlenecks instead of guessing.',
    bullets: [
      { icon: Gauge, text: '10+ labeled pipeline stages' },
      { icon: BarChart3, text: 'Waterfall visualization per request' },
      { icon: Search, text: 'Pinpoint retrieval vs. generation cost' },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * Animations
 * ──────────────────────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const bulletStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

/* ────────────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────────────── */

export function FeaturesFlagship() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="flagship"
      className="w-full bg-secondary-900 dark:bg-secondary-950 py-24 lg:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-6"
          >
            What makes VocUI different
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] max-w-2xl"
          >
            Three capabilities you won&apos;t find anywhere else
          </motion.h2>
        </motion.div>

        {/* Feature deep-dives -- alternating layout */}
        <div className="space-y-0 divide-y divide-secondary-700/30">
          {flagshipFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isReversed = index % 2 !== 0;

            return (
              <motion.div
                key={feature.number}
                className="relative py-16 lg:py-20 overflow-hidden"
                initial={prefersReducedMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={stagger}
              >
                {/* Large background number -- decorative */}
                <span
                  className="absolute -right-4 lg:right-8 top-8 lg:top-12 text-[7rem] lg:text-[12rem] font-black leading-none tracking-tighter select-none pointer-events-none"
                  style={{ color: 'rgba(14, 165, 233, 0.04)' }}
                  aria-hidden="true"
                >
                  {feature.number}
                </span>

                <div
                  className={`relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start ${
                    isReversed ? 'lg:[direction:rtl]' : ''
                  }`}
                >
                  {/* Content side -- 7 cols */}
                  <div className={`lg:col-span-7 ${isReversed ? 'lg:[direction:ltr]' : ''}`}>
                    {/* Number + badge line */}
                    <motion.div
                      variants={fadeUp}
                      className="flex items-center gap-4 mb-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-0.5 bg-primary-500" aria-hidden="true" />
                        <span className="text-sm font-semibold tracking-[0.2em] text-primary-500">
                          {feature.number}
                        </span>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400/70 border border-primary-700/40 px-2.5 py-1 rounded-sm">
                        {feature.badge}
                      </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h3
                      variants={fadeUp}
                      className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-5"
                    >
                      {feature.heading}
                    </motion.h3>

                    {/* Body */}
                    <motion.p
                      variants={fadeUp}
                      className="text-base lg:text-lg text-secondary-400 leading-relaxed mb-8 max-w-lg"
                    >
                      {feature.body}
                    </motion.p>

                    {/* Mini-feature bullets */}
                    <motion.ul
                      className="space-y-3"
                      variants={bulletStagger}
                    >
                      {feature.bullets.map((bullet) => {
                        const BulletIcon = bullet.icon;
                        return (
                          <motion.li
                            key={bullet.text}
                            variants={fadeUp}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-500/10 flex-shrink-0">
                              <BulletIcon className="h-3.5 w-3.5 text-primary-400" aria-hidden="true" />
                            </div>
                            <span className="text-sm text-secondary-300 font-medium">
                              {bullet.text}
                            </span>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  </div>

                  {/* Visual side -- 5 cols: icon showcase area */}
                  <motion.div
                    variants={fadeUp}
                    className={`lg:col-span-5 flex items-center justify-center ${
                      isReversed ? 'lg:[direction:ltr]' : ''
                    }`}
                  >
                    <div className="relative w-full max-w-xs aspect-square flex items-center justify-center">
                      {/* Ambient ring */}
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
                        }}
                        aria-hidden="true"
                      />
                      {/* Outer ring */}
                      <div
                        className="absolute inset-4 rounded-full border border-primary-500/10"
                        aria-hidden="true"
                      />
                      {/* Inner ring */}
                      <div
                        className="absolute inset-12 rounded-full border border-primary-500/[0.06]"
                        aria-hidden="true"
                      />
                      {/* Icon */}
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-500/10 border border-primary-500/20">
                        <Icon className="h-10 w-10 text-primary-400" aria-hidden="true" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
