'use client';

import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function GuideCta() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full overflow-hidden">
      {/* Related guides + industries — tinted bridge strip */}
      <div className="w-full bg-secondary-50 dark:bg-secondary-900 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Sibling guide hubs */}
          <motion.div
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-primary-400 mb-5"
            >
              More guides
            </motion.p>
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  href: '/guides/knowledge-base-chatbot',
                  label: 'Knowledge Base Chatbot Guide',
                  desc: 'Turn your docs, FAQs, and help articles into a chatbot that answers accurately.',
                },
                {
                  href: '/guides/embed-chatbot',
                  label: 'Embed Chatbot Guide',
                  desc: 'Step-by-step instructions for WordPress, Shopify, Squarespace, and custom sites.',
                },
                {
                  href: '/guides/chatbot-alternatives',
                  label: 'Chatbot Alternatives Compared',
                  desc: 'How VocUI stacks up against Chatbase, Tidio, Intercom, Drift, and more.',
                },
              ].map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="group flex flex-col gap-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800/60 p-5 hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                >
                  <span className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {guide.label}
                  </span>
                  <span className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
                    {guide.desc}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 mt-auto group-hover:gap-2 transition-all">
                    View guide
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </motion.div>
          </motion.div>

          {/* Industries link */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-primary-400 whitespace-nowrap">
              Related
            </p>
            <div className="w-12 h-px bg-secondary-300 dark:bg-secondary-600 hidden sm:block" aria-hidden="true" />
            <div>
              <Link
                href="/industries"
                className="group inline-flex items-center gap-2 text-base font-semibold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                VocUI by Industry — All 56 Verticals
                <ExternalLink className="w-4 h-4 text-secondary-400 dark:text-secondary-500 group-hover:text-primary-500 transition-colors" aria-hidden="true" />
              </Link>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1 max-w-lg">
                Explore all 56 industry pages — from healthcare and legal to fitness and e-commerce.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA — full-bleed dark, asymmetric */}
      <div
        className="relative w-full py-24 lg:py-32"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgb(2,132,199) 0%, rgb(8,47,73) 100%)',
        }}
      >
        {/* Decorative ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.06) 0%, transparent 55%)',
          }}
        />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: CTA copy */}
            <motion.div
              className="lg:col-span-7"
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.p
                variants={fadeUp}
                className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200/70 mb-6"
              >
                Get started
              </motion.p>

              <motion.h2
                variants={fadeUp}
                className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
              >
                Build your business chatbot in minutes.
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="text-lg text-white/70 leading-relaxed mb-10 max-w-lg"
              >
                Upload your FAQ, product pages, or policy docs. Your chatbot starts
                answering real customer questions in under 10 minutes — no code needed.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                <Link
                  href="/login?mode=signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-white/90 text-primary-700 font-semibold text-base rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
                >
                  Create Your Chatbot
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white/10 text-white font-medium text-base rounded-sm border border-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
                >
                  Talk to Us
                </Link>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="mt-5 text-sm text-white/40"
              >
                No credit card required. Free plan available.
              </motion.p>
            </motion.div>

            {/* Right: decorative monogram */}
            <div
              className="lg:col-span-5 hidden lg:flex items-center justify-center"
              aria-hidden="true"
            >
              <span
                className="text-[16rem] font-black leading-none tracking-tighter select-none"
                style={{ color: 'rgba(255, 255, 255, 0.06)' }}
              >
                V
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
