'use client';

import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const channels = [
  {
    number: '01',
    word: 'Docs',
    heading: 'Documentation',
    body: 'Step-by-step guides, API reference, and tutorials to get the most out of VocUI.',
    href: '/sdk',
    cta: 'Browse Docs',
    external: false,
  },
  {
    number: '02',
    word: 'FAQ',
    heading: 'Frequently Asked',
    body: 'Quick answers to the most common questions about billing, setup, and features.',
    href: '/faq',
    cta: 'View FAQ',
    external: false,
  },
  {
    number: '03',
    word: 'Team',
    heading: 'Email Support',
    body: 'Get a response from our team within one business day. For urgent issues, include your account email.',
    href: '#contact',
    cta: 'Send a Message',
    external: false,
    highlight: true,
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

export function HelpChannels() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="channels" className="w-full bg-secondary-900 py-20 lg:py-28 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Full-width editorial lead */}
        <motion.p
          className="text-3xl lg:text-4xl font-light text-secondary-100 leading-relaxed max-w-4xl mb-16 lg:mb-20"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Three ways to get the help you need — self-serve when you can, human when you need it.
        </motion.p>

        {/* Channel rows — horizontal strips with left accent, matching AboutBeliefs */}
        <motion.div
          className="divide-y divide-secondary-700/50"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {channels.map(({ number, word, heading, body, href, cta, external, highlight }) => (
            <motion.div
              key={number}
              variants={fadeUp}
              className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-10 lg:py-14 items-center overflow-hidden"
            >
              {/* Large background word — decorative */}
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[8rem] lg:text-[11rem] font-black leading-none tracking-tighter select-none pointer-events-none"
                style={{ color: highlight ? 'rgba(14, 165, 233, 0.06)' : 'rgba(148, 163, 184, 0.04)' }}
                aria-hidden="true"
              >
                {word}
              </span>

              {/* Number + accent bar */}
              <div className="lg:col-span-2 flex items-center gap-4 lg:flex-col lg:items-start lg:gap-2">
                <div
                  className={`w-8 h-0.5 ${highlight ? 'bg-primary-500' : 'bg-secondary-600'}`}
                  aria-hidden="true"
                />
                <span
                  className={`text-sm font-semibold tracking-[0.2em] ${
                    highlight ? 'text-primary-500' : 'text-secondary-500'
                  }`}
                >
                  {number}
                </span>
              </div>

              {/* Heading */}
              <div className="lg:col-span-3">
                <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {heading}
                </h3>
              </div>

              {/* Body */}
              <div className="lg:col-span-4">
                <p className="text-base lg:text-lg text-secondary-400 leading-relaxed">
                  {body}
                </p>
              </div>

              {/* CTA */}
              <div className="lg:col-span-3 flex lg:justify-end">
                <Link
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`inline-flex items-center gap-2 px-6 py-3 font-medium text-sm rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-900 ${
                    highlight
                      ? 'bg-primary-500 hover:bg-primary-600 text-white focus-visible:ring-primary-500'
                      : 'bg-transparent hover:bg-white/10 text-white border border-secondary-600 hover:border-secondary-400 focus-visible:ring-white'
                  }`}
                >
                  {cta}
                  {external ? (
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  )}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
