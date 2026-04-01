'use client';

import { FileText, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

type ComplianceRow = {
  number: string;
  word: string;
  icon: ElementType;
  heading: string;
  body: string;
};

const rows: ComplianceRow[] = [
  {
    number: '01',
    word: 'GDPR',
    icon: FileText,
    heading: 'GDPR compliant.',
    body: 'VocUI processes data in compliance with GDPR. As a data processor, we only handle personal data as instructed by you (the data controller). A Data Processing Agreement (DPA) is available on request for Enterprise customers.',
  },
  {
    number: '02',
    word: 'CCPA',
    icon: MapPin,
    heading: 'CCPA compliant.',
    body: 'For California residents, VocUI complies with the California Consumer Privacy Act. We do not sell personal data.',
  },
];

export function SecurityCompliance() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-primary-950 py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-12 lg:mb-16"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Compliance &amp; regulation
        </motion.p>

        {/* Compliance rows */}
        <motion.div
          className="divide-y divide-primary-800/40"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {rows.map(({ number, word, icon: Icon, heading, body }) => (
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
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary-500/10">
                  <Icon className="h-4 w-4 text-primary-400" aria-hidden="true" />
                </div>
                <div className="w-8 h-0.5 bg-primary-500 hidden lg:block" aria-hidden="true" />
                <span className="text-sm font-semibold tracking-[0.2em] text-primary-500">
                  {number}
                </span>
              </div>

              {/* Heading */}
              <div className="lg:col-span-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {heading}
                </h3>
              </div>

              {/* Body */}
              <div className="lg:col-span-5">
                <p className="text-base lg:text-lg text-primary-200/60 leading-relaxed">{body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="mt-12 text-sm text-primary-200/40 border-t border-primary-800/40 pt-8"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          For compliance documentation, DPAs, or security questionnaires, email{' '}
          <a
            href="mailto:security@vocui.com"
            className="text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors"
          >
            security@vocui.com
          </a>
          .
        </motion.p>
      </div>
    </section>
  );
}
