'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, MessageSquare, Globe } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType } from 'react';

interface Capability {
  icon: ElementType;
  title: string;
  description: string;
  href: string;
  cta: string;
}

const capabilities: Capability[] = [
  {
    icon: BookOpen,
    title: 'Knowledge Base',
    description:
      'Turn your docs, PDFs, and URLs into a chatbot that answers from your actual content -- accurately, with source citations.',
    href: '/knowledge-base-chatbot',
    cta: 'Explore knowledge base',
  },
  {
    icon: MessageSquare,
    title: 'Slack Chatbot',
    description:
      'Deploy your trained chatbot to Slack. Give your team instant answers from internal docs, SOPs, and wikis -- right where they already work.',
    href: '/slack-chatbot',
    cta: 'Explore Slack integration',
  },
  {
    icon: Globe,
    title: 'Website Widget',
    description:
      'Embed a fully customizable chat widget on any website with one line of JavaScript. Brand it, position it, and launch it in minutes.',
    href: '/',
    cta: 'See the widget',
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

export function SolutionsCapabilities() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-primary-950 py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-4"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Deploy anywhere
        </motion.p>
        <motion.h2
          className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-16 lg:mb-20 max-w-2xl"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Built once. Runs everywhere your customers are.
        </motion.h2>

        {/* Three-column strip with dividers */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-primary-800/40 rounded-sm overflow-hidden"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                variants={fadeUp}
                className="bg-primary-950 px-8 py-10 lg:px-10 lg:py-14 flex flex-col"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-900/60 mb-6">
                  <Icon className="h-5 w-5 text-primary-400" aria-hidden="true" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {cap.title}
                </h3>

                <p className="text-sm text-primary-200/60 leading-relaxed flex-1 mb-6">
                  {cap.description}
                </p>

                <Link
                  href={cap.href}
                  className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-950 rounded"
                >
                  {cap.cta}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
