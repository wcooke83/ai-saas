'use client';

import Link from 'next/link';
import {
  ArrowRight,
  UtensilsCrossed,
  GraduationCap,
  Landmark,
  Users,
  Heart,
  Shield,
  Plane,
  Dumbbell,
  Calculator,
  Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface IndustryPost {
  slug: string;
  title: string;
  description: string;
  readTime: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/** Map each slug to an icon + accent color for visual distinction. */
const INDUSTRY_META: Record<string, { icon: LucideIcon; accent: string; accentBg: string }> = {
  'chatbot-for-restaurants':         { icon: UtensilsCrossed, accent: 'text-orange-400',  accentBg: 'bg-orange-400/10' },
  'chatbot-for-education':           { icon: GraduationCap,   accent: 'text-blue-400',    accentBg: 'bg-blue-400/10' },
  'chatbot-for-financial-services':  { icon: Landmark,        accent: 'text-emerald-400', accentBg: 'bg-emerald-400/10' },
  'chatbot-for-recruitment':         { icon: Users,           accent: 'text-violet-400',  accentBg: 'bg-violet-400/10' },
  'chatbot-for-nonprofits':          { icon: Heart,           accent: 'text-rose-400',    accentBg: 'bg-rose-400/10' },
  'chatbot-for-insurance':           { icon: Shield,          accent: 'text-cyan-400',    accentBg: 'bg-cyan-400/10' },
  'chatbot-for-travel-agencies':     { icon: Plane,           accent: 'text-sky-400',     accentBg: 'bg-sky-400/10' },
  'chatbot-for-fitness-studios':     { icon: Dumbbell,        accent: 'text-lime-400',    accentBg: 'bg-lime-400/10' },
  'chatbot-for-accounting-firms':    { icon: Calculator,      accent: 'text-amber-400',   accentBg: 'bg-amber-400/10' },
  'chatbot-for-saas-onboarding':     { icon: Layers,          accent: 'text-indigo-400',  accentBg: 'bg-indigo-400/10' },
};

const DEFAULT_META = { icon: Layers, accent: 'text-primary-400', accentBg: 'bg-primary-400/10' };

export function GuideIndustryGrid({ posts }: { posts: IndustryPost[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="industry-guides"
      className="w-full bg-primary-950 py-24 lg:py-32 overflow-hidden scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="mb-14 lg:mb-20"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-4"
          >
            By industry
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-white mb-3"
          >
            AI Chatbot Guides by Industry
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-lg text-primary-200/60 max-w-2xl"
          >
            Each guide covers the real questions your customers ask — and how to build an AI chatbot that answers them.
          </motion.p>
        </motion.div>

        {/* Grid — 2-col on desktop, 1-col on mobile; gap-px creates subtle dividers */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-primary-800/40 rounded-2xl overflow-hidden"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {posts.map((post, index) => {
            const meta = INDUSTRY_META[post.slug] ?? DEFAULT_META;
            const Icon = meta.icon;
            const num = String(index + 1).padStart(2, '0');

            return (
              <motion.article key={post.slug} variants={fadeUp}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group relative block bg-primary-950 p-8 lg:p-10 h-full hover:bg-primary-900/60 transition-colors"
                >
                  {/* Top row: number + icon */}
                  <div className="flex items-start justify-between mb-6">
                    <span
                      className="text-4xl font-black leading-none tracking-tighter select-none opacity-20 text-primary-400"
                      aria-hidden="true"
                    >
                      {num}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${meta.accentBg}`}
                    >
                      <Icon className={`w-5 h-5 ${meta.accent}`} aria-hidden="true" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-primary-300 transition-colors">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-primary-200/50 leading-relaxed mb-6">
                    {post.description}
                  </p>

                  {/* Footer: read time + arrow */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-primary-200/40">{post.readTime}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-400 group-hover:gap-2 transition-all">
                      Read guide
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
