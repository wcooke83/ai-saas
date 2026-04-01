'use client';

import { useState, useId } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Code2, Building2, BarChart3, Clock, ArrowRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  tag: string;
  datePublished?: string;
}

type FilterTag =
  | 'All'
  | 'Guide'
  | 'Use Case'
  | 'Strategy'
  | 'Explainer'
  | 'Comparison'
  | 'Best Practice';

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_SHOW_COUNT = 18;
const FEATURED_ROW_COUNT = 3;

const FILTER_TAGS: FilterTag[] = [
  'All',
  'Guide',
  'Use Case',
  'Strategy',
  'Explainer',
  'Comparison',
  'Best Practice',
];

// ─── Topic guide config ───────────────────────────────────────────────────────

interface TopicConfig {
  icon: React.ElementType;
  accent: string;
  iconBg: string;
  borderHover: string;
}

const TOPIC_CONFIG: Record<string, TopicConfig> = {
  'knowledge-base-chatbot-guide': {
    icon: Database,
    accent: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-900/30',
    borderHover: 'hover:border-blue-300 dark:hover:border-blue-600',
  },
  'embed-chatbot-guide': {
    icon: Code2,
    accent: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-600',
  },
  'chatbot-for-business-guide': {
    icon: Building2,
    accent: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-900/30',
    borderHover: 'hover:border-amber-300 dark:hover:border-amber-600',
  },
  'chatbot-alternatives-guide': {
    icon: BarChart3,
    accent: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-50 dark:bg-violet-900/30',
    borderHover: 'hover:border-violet-300 dark:hover:border-violet-600',
  },
};

// ─── Tag colors ───────────────────────────────────────────────────────────────

const TAG_STYLES: Record<string, { badge: string; accent: string }> = {
  Guide: {
    badge: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    accent: 'group-hover:border-l-blue-400',
  },
  'Use Case': {
    badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    accent: 'group-hover:border-l-emerald-400',
  },
  Strategy: {
    badge: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    accent: 'group-hover:border-l-amber-400',
  },
  Explainer: {
    badge: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
    accent: 'group-hover:border-l-violet-400',
  },
  Comparison: {
    badge: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
    accent: 'group-hover:border-l-cyan-400',
  },
  'Best Practice': {
    badge: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
    accent: 'group-hover:border-l-rose-400',
  },
  'Topic Guide': {
    badge: 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    accent: 'group-hover:border-l-primary-400',
  },
};

function TagBadge({ tag }: { tag: string }) {
  const styles = TAG_STYLES[tag];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles?.badge ??
        'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300'
      }`}
    >
      {tag}
    </span>
  );
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopicTile({ guide }: { guide: BlogPost }) {
  const config = TOPIC_CONFIG[guide.slug];
  const Icon = config?.icon ?? Database;

  return (
    <Link
      href={`/blog/${guide.slug}`}
      className={`group flex flex-col bg-white dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700 rounded-2xl p-6 transition-all ${config?.borderHover ?? 'hover:border-primary-300 dark:hover:border-primary-600'} hover:shadow-md`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${config?.iconBg ?? 'bg-primary-50 dark:bg-primary-900/30'}`}
        aria-hidden="true"
      >
        <Icon className={`w-5 h-5 ${config?.accent ?? 'text-primary-600 dark:text-primary-400'}`} />
      </div>

      <h3
        className={`text-base font-bold text-secondary-900 dark:text-secondary-100 mb-2 leading-snug transition-colors group-hover:${config?.accent?.split(' ')[0] ?? 'text-primary-600'}`}
      >
        {guide.title}
      </h3>

      <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed line-clamp-2 flex-1 mb-4">
        {guide.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-secondary-400 dark:text-secondary-500">
          {guide.readTime}
        </span>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium ${config?.accent ?? 'text-primary-600 dark:text-primary-400'} opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          Explore
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

interface FeaturedCardProps {
  post: BlogPost;
}

function FeaturedCard({ post }: FeaturedCardProps) {
  const styles = TAG_STYLES[post.tag];

  return (
    <article>
      <Link
        href={`/blog/${post.slug}`}
        className={`group block bg-white dark:bg-secondary-800/50 border border-l-4 border-l-transparent border-secondary-200 dark:border-secondary-700 rounded-xl p-6 transition-all hover:shadow-md h-full ${styles?.accent ?? 'group-hover:border-l-primary-400'}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <TagBadge tag={post.tag} />
          {post.datePublished && (
            <time
              dateTime={post.datePublished}
              className="text-xs text-secondary-400 dark:text-secondary-500"
            >
              {formatDate(post.datePublished)}
            </time>
          )}
          <span className="flex items-center gap-1 text-xs text-secondary-400 dark:text-secondary-500 ml-auto">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {post.readTime}
          </span>
        </div>
        <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100 mb-3 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
          {post.description}
        </p>
      </Link>
    </article>
  );
}

interface StandardCardProps {
  post: BlogPost;
}

function StandardCard({ post }: StandardCardProps) {
  const styles = TAG_STYLES[post.tag];

  return (
    <article>
      <Link
        href={`/blog/${post.slug}`}
        className={`group block bg-white dark:bg-secondary-800/50 border border-l-4 border-l-transparent border-secondary-200 dark:border-secondary-700 rounded-xl p-5 transition-all hover:shadow-sm h-full ${styles?.accent ?? 'group-hover:border-l-primary-400'}`}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <TagBadge tag={post.tag} />
          {post.datePublished && (
            <time
              dateTime={post.datePublished}
              className="text-xs text-secondary-400 dark:text-secondary-500"
            >
              {formatDate(post.datePublished)}
            </time>
          )}
          <span className="text-xs text-secondary-400 dark:text-secondary-500 ml-auto">
            {post.readTime}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {post.title}
        </h3>
        <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed line-clamp-2">
          {post.description}
        </p>
      </Link>
    </article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterTag>('All');
  const [showAll, setShowAll] = useState(false);
  const tabsId = useId();

  const topicGuides = posts.filter((p) => p.tag === 'Topic Guide');
  const regularPosts = posts.filter((p) => p.tag !== 'Topic Guide');

  const tagCounts: Record<FilterTag, number> = {
    All: regularPosts.length,
    Guide: 0,
    'Use Case': 0,
    Strategy: 0,
    Explainer: 0,
    Comparison: 0,
    'Best Practice': 0,
  };
  for (const post of regularPosts) {
    if (post.tag in tagCounts) tagCounts[post.tag as FilterTag]++;
  }

  const filteredPosts =
    activeFilter === 'All'
      ? regularPosts
      : regularPosts.filter((p) => p.tag === activeFilter);

  const isAllFilter = activeFilter === 'All';
  const visiblePosts =
    isAllFilter && !showAll ? filteredPosts.slice(0, INITIAL_SHOW_COUNT) : filteredPosts;
  const hasMore =
    isAllFilter && filteredPosts.length > INITIAL_SHOW_COUNT && !showAll;

  const featuredPosts = visiblePosts.slice(0, FEATURED_ROW_COUNT);
  const standardPosts = visiblePosts.slice(FEATURED_ROW_COUNT);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* ── Explore by Topic ───────────────────────────────────────────── */}
      <section aria-labelledby="explore-heading" className="mb-16">
        <div className="flex items-baseline justify-between mb-7">
          <h2
            id="explore-heading"
            className="text-2xl font-bold text-secondary-900 dark:text-secondary-100"
          >
            Explore by Topic
          </h2>
          <span className="text-sm text-secondary-400 dark:text-secondary-500 hidden sm:block">
            {topicGuides.length} topic guides
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topicGuides.map((guide) => (
            <TopicTile key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="border-t border-secondary-200 dark:border-secondary-700/50 mb-10" />

      {/* ── Filter tabs ────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div
          role="tablist"
          aria-label="Filter articles by category"
          id={tabsId}
          className="relative flex gap-0 overflow-x-auto pb-px scrollbar-none"
        >
          {/* Track line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px bg-secondary-200 dark:bg-secondary-700"
            aria-hidden="true"
          />

          {FILTER_TAGS.map((tag) => {
            const isActive = activeFilter === tag;
            return (
              <button
                key={tag}
                role="tab"
                type="button"
                id={`${tabsId}-tab-${tag}`}
                aria-selected={isActive}
                aria-controls={`${tabsId}-panel`}
                onClick={() => {
                  setActiveFilter(tag);
                  setShowAll(false);
                }}
                className={`relative flex-none px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset rounded-t-sm ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
                }`}
              >
                {tag}
                <span
                  className={`ml-1.5 text-xs font-normal tabular-nums ${
                    isActive
                      ? 'text-primary-500 dark:text-primary-500'
                      : 'text-secondary-400 dark:text-secondary-500'
                  }`}
                >
                  {tagCounts[tag]}
                </span>

                {/* Animated underline indicator */}
                {isActive && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <p
          id={`${tabsId}-panel`}
          role="status"
          aria-live="polite"
          className="mt-4 text-xs text-secondary-400 dark:text-secondary-500"
        >
          Showing {visiblePosts.length}
          {hasMore ? ` of ${filteredPosts.length}` : ''} article
          {filteredPosts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Article grid ───────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {/* Featured row — larger cards, full description */}
          {featuredPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              {featuredPosts.map((post) => (
                <FeaturedCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {/* Standard grid */}
          {standardPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {standardPosts.map((post) => (
                <StandardCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {visiblePosts.length === 0 && (
            <p className="py-16 text-center text-secondary-400 dark:text-secondary-500 text-sm">
              No articles in this category yet.
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Show all button ─────────────────────────────────────────────── */}
      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 border border-secondary-300 dark:border-secondary-600 rounded-lg px-6 py-3 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            Show all {filteredPosts.length} articles
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
