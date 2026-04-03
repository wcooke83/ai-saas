'use client';

import Link from 'next/link';
import { ArrowRight, Star, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface StrategyPost {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  tag: string;
  startHere?: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const TAG_BADGE: Record<string, string> = {
  'Best Practice': 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  Strategy: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
};

export function GuideGettingStarted({ posts }: { posts: StrategyPost[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="getting-started"
      className="w-full bg-secondary-50 dark:bg-secondary-900 py-20 lg:py-28 scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-primary-400 mb-4"
          >
            Start here
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-3"
          >
            Before You Build: Strategy &amp; Best Practices
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-lg text-secondary-600 dark:text-secondary-400 mb-12 max-w-2xl"
          >
            What to automate first, how to set up your chatbot for success, and mistakes to avoid — regardless of industry.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {posts.map((post) => (
            <motion.article key={post.slug} variants={fadeUp}>
              <Link
                href={`/blog/${post.slug}`}
                className="group relative block h-full rounded-2xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800/60 p-8 hover:border-primary-300 dark:hover:border-primary-600 transition-all shadow-sm hover:shadow-md overflow-hidden"
              >
                {/* Decorative top gradient bar */}
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${
                    post.startHere
                      ? 'bg-gradient-to-r from-primary-400 to-primary-600'
                      : 'bg-gradient-to-r from-amber-400 to-amber-600'
                  }`}
                  aria-hidden="true"
                />

                {/* Tag row */}
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      TAG_BADGE[post.tag] ??
                      'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300'
                    }`}
                  >
                    {post.tag}
                  </span>
                  <span className="text-xs text-secondary-400 dark:text-secondary-500">
                    {post.readTime}
                  </span>
                  {post.startHere && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                      <Star className="w-3 h-3" aria-hidden="true" />
                      Recommended
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 ${
                    post.startHere
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                </div>

                <h3 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-3 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {post.title}
                </h3>

                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-6">
                  {post.description}
                </p>

                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all">
                  Read guide
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
