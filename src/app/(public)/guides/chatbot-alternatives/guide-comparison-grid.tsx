'use client';

import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export interface ComparisonPost {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  tag: string;
  startHere?: boolean;
  platformLabel: string;
  platformInitial: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/**
 * Per-platform color system: accent bar, initial badge, and hover states.
 * Each platform gets a distinct color to break visual monotony.
 */
const PLATFORM_COLORS: Record<
  string,
  { accent: string; bg: string; text: string; border: string; hoverBorder: string }
> = {
  C: {
    accent: 'bg-violet-500',
    bg: 'bg-violet-100 dark:bg-violet-900/40',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-t-violet-500 dark:border-t-violet-400',
    hoverBorder: 'hover:border-violet-300 dark:hover:border-violet-500',
  },
  T: {
    accent: 'bg-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-t-blue-500 dark:border-t-blue-400',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-500',
  },
  I: {
    accent: 'bg-indigo-500',
    bg: 'bg-indigo-100 dark:bg-indigo-900/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-t-indigo-500 dark:border-t-indigo-400',
    hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-500',
  },
  D: {
    accent: 'bg-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-t-amber-500 dark:border-t-amber-400',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-500',
  },
  Z: {
    accent: 'bg-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-t-emerald-500 dark:border-t-emerald-400',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-500',
  },
  F: {
    accent: 'bg-rose-500',
    bg: 'bg-rose-100 dark:bg-rose-900/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-t-rose-500 dark:border-t-rose-400',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-500',
  },
};

const DEFAULT_COLOR = {
  accent: 'bg-secondary-500',
  bg: 'bg-secondary-100 dark:bg-secondary-800',
  text: 'text-secondary-600 dark:text-secondary-400',
  border: 'border-t-secondary-500',
  hoverBorder: 'hover:border-primary-300 dark:hover:border-primary-700',
};

export function GuideComparisonGrid({ posts }: { posts: ComparisonPost[] }) {
  const prefersReducedMotion = useReducedMotion();

  const featured = posts.find((p) => p.startHere);
  const rest = posts.filter((p) => !p.startHere);

  return (
    <section
      id="comparisons"
      aria-label="Chatbot platform comparisons"
      className="w-full bg-secondary-50 dark:bg-secondary-900 py-20 lg:py-28 scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="mb-12 lg:mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-primary-400 mb-4"
          >
            Platform comparisons
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-3"
          >
            Best chatbot platform alternatives compared
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl"
          >
            Each guide covers pricing, AI features, and setup — so you can decide in minutes, not weeks.
          </motion.p>
        </motion.div>

        {/* Card grid: featured spans 2 cols, rest are single-col */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {/* Featured card — spans 2 columns on md+ */}
          {featured && (
            <motion.article
              variants={fadeUp}
              className="md:col-span-2 lg:col-span-2"
            >
              <FeaturedCard post={featured} />
            </motion.article>
          )}

          {/* Remaining cards */}
          {rest.map((post) => (
            <motion.article key={post.slug} variants={fadeUp}>
              <CompactCard post={post} />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Featured card ─────────────────────────────────────────────────────────── */

function FeaturedCard({ post }: { post: ComparisonPost }) {
  const colors = PLATFORM_COLORS[post.platformInitial] ?? DEFAULT_COLOR;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative flex flex-col sm:flex-row h-full rounded-2xl border-t-4 ${colors.border} border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800/60 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
    >
      {/* Left: large decorative initial */}
      <div className="relative flex-none w-full sm:w-48 lg:w-56 bg-secondary-50 dark:bg-secondary-800/80 flex items-center justify-center py-6 sm:py-0">
        <span
          className={`text-8xl lg:text-9xl font-black leading-none tracking-tighter select-none ${colors.text} opacity-30 dark:opacity-20`}
          aria-hidden="true"
        >
          {post.platformInitial}
        </span>
        {/* Start here badge */}
        <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
          <Star className="h-3 w-3" aria-hidden="true" />
          Start here
        </span>
      </div>

      {/* Right: content */}
      <div className="flex flex-col flex-1 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`flex-none w-9 h-9 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center text-sm font-bold`}
            aria-hidden="true"
          >
            {post.platformInitial}
          </span>
          <div>
            <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
              vs. {post.platformLabel}
            </p>
            <p className="text-xs text-secondary-400 dark:text-secondary-500">
              {post.readTime}
            </p>
          </div>
        </div>

        <h3 className="text-xl lg:text-2xl font-bold leading-snug text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-3">
          {post.title}
        </h3>

        <p className="flex-1 text-secondary-600 dark:text-secondary-400 leading-relaxed mb-6">
          {post.description}
        </p>

        <div className="mt-auto flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all">
          See full comparison
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}

/* ── Compact card ──────────────────────────────────────────────────────────── */

function CompactCard({ post }: { post: ComparisonPost }) {
  const colors = PLATFORM_COLORS[post.platformInitial] ?? DEFAULT_COLOR;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative flex flex-col h-full rounded-2xl border-t-4 ${colors.border} border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800/60 p-6 lg:p-7 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${colors.hoverBorder}`}
    >
      {/* Large decorative initial — watermark */}
      <span
        className="absolute top-4 right-5 text-7xl font-black leading-none tracking-tighter select-none opacity-[0.05] dark:opacity-[0.04]"
        aria-hidden="true"
      >
        {post.platformInitial}
      </span>

      {/* Platform badge + meta */}
      <div className="relative flex items-center gap-3 mb-5">
        <span
          className={`flex-none w-10 h-10 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center text-sm font-bold`}
          aria-hidden="true"
        >
          {post.platformInitial}
        </span>
        <div>
          <p className="text-xs font-semibold text-secondary-900 dark:text-secondary-100 uppercase tracking-wide">
            vs. {post.platformLabel}
          </p>
          <p className="text-xs text-secondary-400 dark:text-secondary-500">
            {post.readTime}
          </p>
        </div>
      </div>

      {/* Title + description */}
      <h3 className="relative text-lg font-bold leading-snug text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2.5">
        {post.title}
      </h3>

      <p className="relative flex-1 text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed mb-6">
        {post.description}
      </p>

      {/* Read link */}
      <div className="relative mt-auto flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all">
        Read comparison
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </div>
    </Link>
  );
}
