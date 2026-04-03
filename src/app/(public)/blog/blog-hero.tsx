'use client';

import Link from 'next/link';
import { ArrowRight, Clock, CalendarDays } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import type { BlogPost } from '@/components/blog/blog-index';

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

// ─── Tag color map (subset needed for featured card) ──────────────────────────

const TAG_BADGE: Record<string, string> = {
  Guide:          'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Use Case':     'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  Strategy:       'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  Explainer:      'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  Comparison:     'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  'Best Practice':'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  'Topic Guide':  'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
};

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Derive the most recent post by datePublished ─────────────────────────────

function getLatestPost(posts: BlogPost[]): BlogPost | null {
  const dated = posts.filter((p) => Boolean(p.datePublished));
  if (dated.length === 0) return null;
  return dated.reduce((latest, post) => {
    return (post.datePublished ?? '') > (latest.datePublished ?? '') ? post : latest;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface BlogHeroProps {
  posts: BlogPost[];
}

export function BlogHero({ posts }: BlogHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const featured = getLatestPost(posts);

  return (
    <section className="relative overflow-hidden">
      {/* Decorative grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(var(--secondary-200)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--secondary-200)/0.35)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgb(var(--secondary-700)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--secondary-700)/0.25)_1px,transparent_1px)] [background-size:64px_64px]"
        aria-hidden="true"
      />

      {/* Left accent rule */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary-500 via-primary-400 to-transparent"
        aria-hidden="true"
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pb-20">
        <Breadcrumbs items={[{ label: 'Blog' }]} />

        <motion.div
          className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={stagger}
        >
          {/* Left: typographic statement */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-5"
            >
              VocUI Blog
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.04] mb-6"
            >
              AI Chatbot
              <br />
              <span className="text-primary-500">Guides</span>
              {' '}&amp;
              <br />
              Strategies
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-secondary-600 dark:text-secondary-400 max-w-md leading-relaxed mb-8"
            >
              Practical guides for small business owners building AI chatbots — no
              technical background required.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 text-base"
              >
                Build Your Chatbot Free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          {/* Right: featured post spotlight — driven by most recent datePublished */}
          {featured && (
            <motion.div variants={fadeUp} className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-400 dark:text-secondary-500 mb-3">
                Latest Post
              </p>
              <Link
                href={`/blog/${featured.slug}`}
                className="group block bg-white/80 dark:bg-secondary-800/60 backdrop-blur-sm border border-secondary-200 dark:border-secondary-700 rounded-2xl p-6 hover:border-primary-300 dark:hover:border-primary-600 transition-all shadow-sm hover:shadow-md"
              >
                {/* Tag + meta */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      TAG_BADGE[featured.tag] ??
                      'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300'
                    }`}
                  >
                    {featured.tag}
                  </span>
                  {featured.datePublished && (
                    <span className="flex items-center gap-1 text-xs text-secondary-400 dark:text-secondary-500">
                      <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                      <time dateTime={featured.datePublished}>
                        {formatDate(featured.datePublished)}
                      </time>
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-secondary-400 dark:text-secondary-500 ml-auto">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {featured.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-3 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {featured.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed mb-5 line-clamp-3">
                  {featured.description}
                </p>

                {/* Read link */}
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all">
                  Read article
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
