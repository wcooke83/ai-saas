'use client';

import {
  Megaphone,
  BarChart3,
  Globe,
  FileText,
  Code2,
  FormInput,
  Ticket,
  Languages,
  Layers,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────────
 * Data -- split into two visual groups for layout variation
 * ──────────────────────────────────────────────────────────────────────────── */

interface PlatformFeature {
  icon: LucideIcon;
  name: string;
  description: string;
}

/** First cluster: Engagement & Intelligence (left-aligned intro + 3x2 grid) */
const engagementFeatures: PlatformFeature[] = [
  {
    icon: Megaphone,
    name: 'Proactive Messaging',
    description:
      '8 trigger types — exit intent, scroll depth, idle, time on page, and custom events. Reach visitors before they leave.',
  },
  {
    icon: BarChart3,
    name: 'Sentiment & Loyalty Scoring',
    description:
      'Per-visitor sentiment tracking with loyalty scores. Know which conversations are high-risk before they escalate.',
  },
  {
    icon: Globe,
    name: 'Multi-Channel Deploy',
    description:
      'JS widget, iFrame, Slack, Telegram, or REST API. One chatbot, every channel where your customers are.',
  },
  {
    icon: FileText,
    name: 'Train on Anything',
    description:
      'URLs (with crawl), PDFs, DOCX, raw text, and Q&A pairs. Live fetch fallback keeps answers current even after training.',
  },
  {
    icon: Code2,
    name: 'Authenticated Context',
    description:
      "Pass user account data into the chatbot at session start. It already knows who it's talking to.",
  },
  {
    icon: FormInput,
    name: 'Lead Capture & Surveys',
    description:
      'Pre-chat forms, post-chat surveys, lead export. Capture and qualify visitors without a separate tool.',
  },
];

/** Second cluster: Operations & Customization (horizontal strip, different form) */
const operationsFeatures: PlatformFeature[] = [
  {
    icon: Ticket,
    name: 'Support Ticketing',
    description:
      'Built-in contact form, ticket creation, and escalation workflows — the full support loop without a third-party helpdesk.',
  },
  {
    icon: Languages,
    name: '20+ Languages',
    description:
      'Full multi-language support with translation validation. Serve international customers without duplicating your knowledge base.',
  },
  {
    icon: Layers,
    name: 'Full Widget Customization',
    description:
      'Colors, fonts, border radius, position, auto-open behavior, and dark mode — styled to match your brand exactly.',
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
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ────────────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────────────── */

export function FeaturesPlatform() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* ── Section 1: Engagement & Intelligence ── 3x2 card grid on light bg ── */}
      <section className="w-full bg-white dark:bg-secondary-900 py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header -- left-aligned for asymmetry */}
          <motion.div
            className="mb-16 lg:mb-20 max-w-2xl"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-6"
            >
              The full platform
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.1] mb-4"
            >
              Everything the platform behind it needs
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed"
            >
              The capabilities your team will actually reach for — without stitching together five separate tools.
            </motion.p>
          </motion.div>

          {/* 3-column card grid */}
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {engagementFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.name}
                  variants={fadeUp}
                  className="group relative bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-5">
                    <Icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg text-secondary-900 dark:text-secondary-100 mb-2">
                    {f.name}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Operations & Customization ── horizontal strip, different form ── */}
      <section className="w-full bg-secondary-50 dark:bg-secondary-800/30 py-20 lg:py-28 border-t border-secondary-200 dark:border-secondary-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {/* Left column: section context */}
            <motion.div
              className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start"
              variants={fadeUp}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-4">
                Operations & polish
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                The details that make it production-ready
              </h3>
              <p className="text-base text-secondary-600 dark:text-secondary-400 leading-relaxed">
                Ticketing, localization, and pixel-perfect styling — the finishing touches that separate a prototype from a product.
              </p>
            </motion.div>

            {/* Right column: stacked feature cards with left accent */}
            <div className="lg:col-span-8 space-y-6">
              {operationsFeatures.map((f, index) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.name}
                    variants={fadeUp}
                    className="relative flex gap-5 items-start bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 pl-8"
                  >
                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-primary-500"
                      style={{ opacity: 1 - index * 0.25 }}
                      aria-hidden="true"
                    />
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-secondary-900 dark:text-secondary-100 mb-1">
                        {f.name}
                      </h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
