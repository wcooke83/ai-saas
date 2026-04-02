'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Globe,
  MessageSquare,
  Send,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { ElementType } from 'react';

// ─── Data ──────────────────────────────────────────────────────────────────────

interface FeaturedChannel {
  icon: ElementType;
  name: string;
  tagline: string;
  description: string;
  status: 'available' | 'coming-soon';
  href: string;
  cta: string;
  highlights: string[];
}

const channels: FeaturedChannel[] = [
  {
    icon: Globe,
    name: 'Website Widget',
    tagline: 'Your website, your chatbot',
    description:
      'Embed a fully customizable chat widget on any website with one line of JavaScript. Customize colors, position, greeting message, and behaviour to match your brand.',
    status: 'available',
    href: '/sdk',
    cta: 'View embed docs',
    highlights: [
      'One-line JS embed',
      'Full brand customization',
      'Mobile-responsive',
      'Lead capture built in',
    ],
  },
  {
    icon: MessageSquare,
    name: 'Slack',
    tagline: 'Internal knowledge, instant answers',
    description:
      'Deploy your trained chatbot to any Slack workspace. Your team gets answers from internal docs, SOPs, and wikis -- right where they already work.',
    status: 'available',
    href: '/slack-chatbot',
    cta: 'Explore Slack integration',
    highlights: [
      'Works in channels and DMs',
      'Answers from your docs',
      'Minimal permissions',
      'Setup in minutes',
    ],
  },
  {
    icon: Send,
    name: 'Telegram',
    tagline: 'Meet customers on Telegram',
    description:
      'Connect your AI chatbot to Telegram so customers can get instant answers through their preferred messaging app -- anytime, anywhere.',
    status: 'coming-soon',
    href: '/contact',
    cta: 'Join the waitlist',
    highlights: [
      'Same trained knowledge',
      'Automatic replies 24/7',
      'Rich message support',
      'Easy bot setup',
    ],
  },
];

// ─── Animation ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export function IntegrationsFeatured() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="channels"
      className="w-full bg-secondary-50 dark:bg-secondary-900 py-24 lg:py-32 scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-4"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Deploy channels
        </motion.p>
        <motion.h2
          className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-6 max-w-2xl"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          First-class deployment channels.
        </motion.h2>
        <motion.p
          className="text-lg text-secondary-600 dark:text-secondary-400 max-w-xl leading-relaxed mb-16 lg:mb-20"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          These are the primary ways to deploy your VocUI chatbot. Each channel
          gets a dedicated experience, tailored to the platform.
        </motion.p>

        {/* Featured channel cards -- asymmetric grid: widget card spans 7, Slack + Telegram share 5 */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {/* Widget card -- prominent, spans 7 cols */}
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <ChannelCard channel={channels[0]} variant="large" />
          </motion.div>

          {/* Slack + Telegram -- stacked in 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div variants={fadeUp}>
              <ChannelCard channel={channels[1]} variant="compact" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <ChannelCard channel={channels[2]} variant="compact" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Card Sub-component ────────────────────────────────────────────────────────

function ChannelCard({
  channel,
  variant,
}: {
  channel: FeaturedChannel;
  variant: 'large' | 'compact';
}) {
  const Icon = channel.icon;
  const isLarge = variant === 'large';

  return (
    <div className="h-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 overflow-hidden flex flex-col">
      <div className={isLarge ? 'p-8 lg:p-10 flex flex-col flex-1' : 'p-6 lg:p-8 flex flex-col flex-1'}>
        {/* Icon + status row */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/40">
            <Icon
              className="h-6 w-6 text-primary-600 dark:text-primary-400"
              aria-hidden="true"
            />
          </div>
          <Badge variant={channel.status === 'available' ? 'success' : 'warning'}>
            {channel.status === 'available' ? 'Available' : 'Coming Soon'}
          </Badge>
        </div>

        {/* Title + tagline */}
        <h3
          className={
            isLarge
              ? 'text-2xl lg:text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2'
              : 'text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-1'
          }
        >
          {channel.name}
        </h3>
        <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-4">
          {channel.tagline}
        </p>

        {/* Description */}
        <p
          className={
            isLarge
              ? 'text-base text-secondary-600 dark:text-secondary-400 leading-relaxed mb-8'
              : 'text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed mb-6'
          }
        >
          {channel.description}
        </p>

        {/* Highlights -- only on large variant */}
        {isLarge && (
          <div className="grid grid-cols-2 gap-3 mb-8">
            {channel.highlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-2">
                <div
                  className="h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Spacer to push CTA to bottom */}
        <div className="flex-1" />

        {/* CTA link */}
        <Link
          href={channel.href}
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
        >
          {channel.cta}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
