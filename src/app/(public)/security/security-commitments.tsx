'use client';

import { Database, Lock, Trash2, Shield, Server, Bot } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

type CommitmentItem = {
  icon: ElementType;
  number: string;
  title: string;
  body: string;
};

const dataHandling: CommitmentItem[] = [
  {
    icon: Database,
    number: '01',
    title: 'Never used for training',
    body: 'Your knowledge base content, chat conversations, and customer data are never used to train our AI models or shared with third parties for model training.',
  },
  {
    icon: Lock,
    number: '02',
    title: 'Isolated per account',
    body: "Each account's knowledge base and chat data is isolated. Your chatbot cannot access another customer's data.",
  },
  {
    icon: Trash2,
    number: '03',
    title: 'Delete on request',
    body: 'You can delete your chatbot, knowledge sources, and all associated data at any time from your dashboard. Data is purged within 30 days.',
  },
];

const infrastructure: CommitmentItem[] = [
  {
    icon: Shield,
    number: '04',
    title: 'Encryption in transit and at rest',
    body: 'All data transmitted between your visitors and VocUI is encrypted via TLS 1.2+. Data stored in our database is encrypted at rest.',
  },
  {
    icon: Server,
    number: '05',
    title: 'Hosted on Supabase & Vercel',
    body: 'VocUI is built on Supabase (database, auth) and Vercel (hosting) — both SOC 2 Type II certified infrastructure providers.',
  },
  {
    icon: Bot,
    number: '06',
    title: 'AI provider data handling',
    body: 'Chat messages are processed by Anthropic (Claude) and/or OpenAI. Both providers have enterprise data handling agreements and do not use API data for model training by default.',
  },
];

const allCommitments = [...dataHandling, ...infrastructure];

export function SecurityCommitments() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="content" className="w-full bg-secondary-900 py-20 lg:py-28 scroll-mt-20">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial={prefersReducedMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        {/* Full-width pull statement */}
        <motion.p
          variants={fadeUp}
          className="text-3xl lg:text-4xl font-light text-secondary-100 leading-relaxed max-w-4xl mb-16 lg:mb-20"
        >
          We built security in from the first commit — not bolted on after.
          Your data is isolated, encrypted, and always under your control.
        </motion.p>

        {/* Section labels */}
        <motion.div
          variants={fadeUp}
          className="border-t border-secondary-700/50 pt-12 lg:pt-16 mb-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-8">
            Your data &amp; infrastructure
          </p>
        </motion.div>

        {/* Commitment rows */}
        <motion.div
          className="divide-y divide-secondary-700/40"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {allCommitments.map(({ icon: Icon, number, title, body }) => (
            <motion.div
              key={number}
              variants={fadeUp}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-8 lg:py-10 items-start"
            >
              {/* Number + icon */}
              <div className="lg:col-span-2 flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary-500/10">
                  <Icon className="h-4 w-4 text-primary-400" aria-hidden="true" />
                </div>
                <span className="text-xs font-semibold tracking-[0.2em] text-secondary-500">
                  {number}
                </span>
              </div>

              {/* Title */}
              <div className="lg:col-span-4">
                <h3 className="text-xl lg:text-2xl font-bold text-white leading-snug">
                  {title}
                </h3>
              </div>

              {/* Body */}
              <div className="lg:col-span-6">
                <p className="text-base text-secondary-400 leading-relaxed">{body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
