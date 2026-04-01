'use client';

import Link from 'next/link';
import { ArrowRight, Bot, ChevronDown } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export function HomeHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex items-center overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center w-full">

          {/* Left column */}
          <motion.div
            className="flex flex-col items-start text-left"
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={stagger}
          >
            {/* Eyebrow */}
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-6"
            >
              AI Customer Support, Done Right
            </motion.p>

            {/* H1 */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.08] mb-8"
            >
              Stop answering the same questions twice.{' '}
              <span className="text-primary-500">Your knowledge base</span>{' '}
              becomes a chatbot that handles it.
            </motion.h1>

            {/* Supporting text */}
            <motion.p
              variants={fadeUp}
              className="text-lg text-secondary-600 dark:text-secondary-400 max-w-xl leading-relaxed mb-10"
            >
              VocUI turns your docs, URLs, and FAQs into an AI chatbot that deflects support tickets,
              captures leads, and books appointments — deployed on your site in under an hour.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Build Your Chatbot Free
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300 font-medium text-lg rounded-sm border border-secondary-300 dark:border-secondary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                See Pricing
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.p
              variants={fadeUp}
              className="text-sm text-secondary-500 dark:text-secondary-400"
            >
              No credit card required &mdash; free plan available
            </motion.p>
          </motion.div>

          {/* Right column — chat widget mockup */}
          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          >
            <div className="relative w-full max-w-sm rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Drop shadow layer */}
              <div className="absolute inset-0 rounded-2xl bg-primary-500/10 blur-2xl scale-105" aria-hidden="true" />

              {/* Card */}
              <div className="relative rounded-2xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 shadow-2xl overflow-hidden">

                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 bg-secondary-50 dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
                  <span className="w-3 h-3 rounded-full bg-red-400" aria-hidden="true" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" aria-hidden="true" />
                  <span className="w-3 h-3 rounded-full bg-green-400" aria-hidden="true" />
                  <div className="ml-3 flex-1 h-5 rounded bg-secondary-200 dark:bg-secondary-700 flex items-center px-2">
                    <span className="text-xs text-secondary-400 dark:text-secondary-500 truncate">yoursite.com</span>
                  </div>
                </div>

                {/* Chat widget header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-primary-600">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-none">VocUI Assistant</p>
                    <p className="text-xs text-white/70 mt-0.5">Online &bull; Typically replies instantly</p>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="px-4 py-4 space-y-3 bg-secondary-50 dark:bg-secondary-900/50 min-h-[200px]" role="log" aria-label="Sample chat conversation">
                  {/* Bot message */}
                  <div className="flex gap-2 items-end">
                    <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Bot className="w-3 h-3 text-primary-500" />
                    </div>
                    <div className="bg-primary-500 text-white text-sm rounded-2xl rounded-bl-sm px-3 py-2 max-w-[80%] leading-relaxed shadow-sm">
                      Hi! I&apos;m trained on your knowledge base. How can I help you today?
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 text-sm rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%] leading-relaxed shadow-sm">
                      What&apos;s your refund policy?
                    </div>
                  </div>

                  {/* Bot message */}
                  <div className="flex gap-2 items-end">
                    <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Bot className="w-3 h-3 text-primary-500" />
                    </div>
                    <div className="bg-primary-500 text-white text-sm rounded-2xl rounded-bl-sm px-3 py-2 max-w-[80%] leading-relaxed shadow-sm">
                      We offer a 30-day money-back guarantee on all plans, no questions asked. Want me to start a refund for your account?
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 text-sm rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%] leading-relaxed shadow-sm">
                      Yes please!
                    </div>
                  </div>
                </div>

                {/* Input bar */}
                <div className="flex items-center gap-2 px-3 py-3 border-t border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900">
                  <div className="flex-1 h-8 rounded-full bg-secondary-100 dark:bg-secondary-800 px-3 flex items-center">
                    <span className="text-xs text-secondary-400 dark:text-secondary-500">Type a message…</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-secondary-400 dark:text-secondary-600"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-hidden="true"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-secondary-300 dark:to-secondary-700" />
      </motion.div>
    </section>
  );
}
