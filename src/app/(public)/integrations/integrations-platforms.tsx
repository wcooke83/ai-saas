'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

// ─── Data ──────────────────────────────────────────────────────────────────────

interface Platform {
  name: string;
  description: string;
  href: string;
  cta: string;
  /** Letters used as a monogram stand-in for the platform logo */
  monogram: string;
}

const platforms: Platform[] = [
  {
    name: 'WordPress',
    description:
      'Add your AI chatbot to any WordPress site. Paste the embed code into a Custom HTML widget, your theme header, or use a simple plugin.',
    href: '/blog/how-to-embed-chatbot-in-wordpress',
    cta: 'Read the WordPress guide',
    monogram: 'WP',
  },
  {
    name: 'Shopify',
    description:
      'Help shoppers find products, answer pre-purchase questions, and reduce cart abandonment with an AI assistant in your Shopify store.',
    href: '/blog/how-to-embed-chatbot-in-shopify',
    cta: 'Read the Shopify guide',
    monogram: 'SH',
  },
  {
    name: 'Squarespace',
    description:
      'Embed VocUI on your Squarespace site using the Code Injection feature. No plugin needed -- just one line of JavaScript.',
    href: '/blog/how-to-embed-chatbot-in-squarespace',
    cta: 'Read the Squarespace guide',
    monogram: 'SQ',
  },
  {
    name: 'Wix',
    description:
      'Add the VocUI widget to your Wix site through the Custom Code settings. Works on any Wix plan that supports header scripts.',
    href: '/blog/how-to-embed-chatbot-in-wix',
    cta: 'Read the Wix guide',
    monogram: 'WX',
  },
];

// ─── Animation ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export function IntegrationsPlatforms() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-primary-950 py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 lg:mb-20">
          <div className="lg:col-span-7">
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-4"
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
            >
              Website platforms
            </motion.p>
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
            >
              One line of code. Any website platform.
            </motion.h2>
            <motion.p
              className="text-lg text-primary-200/70 leading-relaxed max-w-lg"
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
            >
              VocUI works everywhere JavaScript runs. These step-by-step guides
              show you exactly where to paste the embed code on each platform.
            </motion.p>
          </div>

          {/* Right: the code snippet preview */}
          <motion.div
            className="lg:col-span-5 flex items-end"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <div className="w-full rounded-lg bg-primary-900/60 border border-primary-800/50 p-5 font-mono text-sm text-primary-300 leading-relaxed overflow-x-auto">
              <span className="text-primary-500/60">{'<!-- '}</span>
              <span className="text-primary-400/80">One line to add VocUI</span>
              <span className="text-primary-500/60">{' -->'}</span>
              <br />
              <span className="text-primary-500">{'<'}</span>
              <span className="text-blue-400">script</span>{' '}
              <span className="text-primary-300">src</span>
              <span className="text-primary-500">=</span>
              <span className="text-green-400">&quot;vocui.com/widget.js&quot;</span>
              <span className="text-primary-500">{'>'}</span>
              <span className="text-primary-500">{'</'}</span>
              <span className="text-blue-400">script</span>
              <span className="text-primary-500">{'>'}</span>
            </div>
          </motion.div>
        </div>

        {/* Platform cards -- horizontal strip with dividers */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-primary-800/40 rounded-sm overflow-hidden"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {platforms.map((platform) => (
            <motion.div
              key={platform.name}
              variants={fadeUp}
              className="bg-primary-950 px-6 py-8 lg:px-8 lg:py-10 flex flex-col"
            >
              {/* Platform monogram */}
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-900/60 mb-5">
                <span className="text-sm font-bold text-primary-400">
                  {platform.monogram}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                {platform.name}
              </h3>

              <p className="text-sm text-primary-200/60 leading-relaxed flex-1 mb-6">
                {platform.description}
              </p>

              <Link
                href={platform.href}
                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-950 rounded"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                {platform.cta}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
