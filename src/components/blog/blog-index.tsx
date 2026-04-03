'use client';

import { useState, useId, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Database,
  Code2,
  Building2,
  BarChart3,
  ArrowRight,
  ChevronRight,
  Search,
  X,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

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

// ─── Constants ─────────────────────────────────────────────────────────────────

const INITIAL_SHOW_COUNT = 18;

const FILTER_TAGS: FilterTag[] = [
  'All',
  'Guide',
  'Use Case',
  'Strategy',
  'Explainer',
  'Comparison',
  'Best Practice',
];

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// ─── Topic guide config ────────────────────────────────────────────────────────

interface TopicConfig {
  icon: React.ElementType;
  accent: string;
  accentHover: string;
  bg: string;
  border: string;
  num: string;
  href?: string;
}

const TOPIC_CONFIG: Record<string, TopicConfig> = {
  'knowledge-base-chatbot-guide': {
    icon: Database,
    accent: 'text-sky-400',
    accentHover: 'group-hover:text-sky-300',
    bg: 'bg-sky-500/10',
    border: 'group-hover:border-sky-500/50',
    num: '01',
    href: '/guides/knowledge-base-chatbot',
  },
  'embed-chatbot-guide': {
    icon: Code2,
    accent: 'text-emerald-400',
    accentHover: 'group-hover:text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'group-hover:border-emerald-500/50',
    num: '02',
    href: '/guides/embed-chatbot',
  },
  'chatbot-for-business-guide': {
    icon: Building2,
    accent: 'text-amber-400',
    accentHover: 'group-hover:text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'group-hover:border-amber-500/50',
    num: '03',
    href: '/guides/chatbot-for-business',
  },
  'chatbot-alternatives-guide': {
    icon: BarChart3,
    accent: 'text-violet-400',
    accentHover: 'group-hover:text-violet-300',
    bg: 'bg-violet-500/10',
    border: 'group-hover:border-violet-500/50',
    num: '04',
    href: '/guides/chatbot-alternatives',
  },
};

// ─── Tag colors ────────────────────────────────────────────────────────────────

const TAG_STYLES: Record<string, { badge: string; rule: string }> = {
  Guide: {
    badge: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    rule: 'border-l-blue-400',
  },
  'Use Case': {
    badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    rule: 'border-l-emerald-400',
  },
  Strategy: {
    badge: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    rule: 'border-l-amber-400',
  },
  Explainer: {
    badge: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
    rule: 'border-l-violet-400',
  },
  Comparison: {
    badge: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
    rule: 'border-l-cyan-400',
  },
  'Best Practice': {
    badge: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
    rule: 'border-l-rose-400',
  },
  'Topic Guide': {
    badge: 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    rule: 'border-l-primary-400',
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

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

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        className="bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded px-0.5 not-italic"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

// ─── Article strip row ────────────────────────────────────────────────────────

interface ArticleRowProps {
  post: BlogPost;
  index: number;
  query: string;
  isVisible: boolean;
}

function ArticleRow({ post, index, query, isVisible }: ArticleRowProps) {
  const delay = 40 + index * 35;
  return (
    <article
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity 0.28s ease-out ${delay}ms, transform 0.28s ease-out ${delay}ms`,
      }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex items-start justify-between gap-6 py-5 -mx-4 px-4 sm:-mx-6 sm:px-6 hover:bg-secondary-50/70 dark:hover:bg-secondary-800/25 transition-colors duration-150"
      >
        {/* Left: meta + title + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <TagBadge tag={post.tag} />
            {post.datePublished && (
              <time
                dateTime={post.datePublished}
                className="text-xs text-secondary-400 dark:text-secondary-500"
              >
                {formatDate(post.datePublished)}
              </time>
            )}
            <span className="text-xs text-secondary-400 dark:text-secondary-500">
              {post.readTime}
            </span>
          </div>
          <h3 className="text-base font-semibold text-secondary-900 dark:text-secondary-100 leading-snug group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-150 mb-1.5">
            {highlightMatch(post.title, query)}
          </h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed line-clamp-2">
            {highlightMatch(post.description, query)}
          </p>
        </div>

        {/* Right: chevron */}
        <ChevronRight
          className="w-5 h-5 flex-shrink-0 mt-1 text-secondary-300 dark:text-secondary-600 group-hover:text-primary-500 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all duration-150"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}

// ─── Article list ─────────────────────────────────────────────────────────────

interface ArticleListProps {
  posts: BlogPost[];
  query: string;
}

function ArticleList({ posts, query }: ArticleListProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const t = setTimeout(() => setIsVisible(true), 30);
    return () => clearTimeout(t);
  }, [posts, query]);

  if (posts.length === 0) {
    return (
      <div
        className="py-16 text-center"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s ease-out' }}
      >
        <Search className="w-10 h-10 mx-auto text-secondary-300 dark:text-secondary-600 mb-4" />
        <p className="text-base font-medium text-secondary-900 dark:text-secondary-100 mb-1">
          No articles found
        </p>
        <p className="text-sm text-secondary-500 dark:text-secondary-400">
          Try different keywords or clear the search.
        </p>
      </div>
    );
  }

  return (
    <div
      className="divide-y divide-secondary-100 dark:divide-secondary-800"
      role="list"
    >
      {posts.map((post, i) => (
        <ArticleRow
          key={post.slug}
          post={post}
          index={i}
          query={query}
          isVisible={isVisible}
        />
      ))}
    </div>
  );
}

// ─── Topic guide strip (dark section) ─────────────────────────────────────────

function TopicGuideStrip({ guides }: { guides: BlogPost[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="topics"
      className="w-full bg-primary-950 py-16 lg:py-20"
      aria-labelledby="topics-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerGrid}
        >
          <div>
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-3"
            >
              Deep Dives
            </motion.p>
            <motion.h2
              variants={fadeUp}
              id="topics-heading"
              className="text-3xl lg:text-4xl font-bold text-white leading-tight"
            >
              Explore by Topic
            </motion.h2>
          </div>
          <motion.p
            variants={fadeUp}
            className="text-sm text-primary-300/60 sm:pb-1"
          >
            {guides.length} comprehensive guides
          </motion.p>
        </motion.div>

        {/* Guide grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-primary-800/40"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerGrid}
        >
          {guides.map((guide) => {
            const config = TOPIC_CONFIG[guide.slug];
            const Icon = config?.icon ?? Database;
            return (
              <motion.div key={guide.slug} variants={fadeUp}>
                <Link
                  href={config?.href ?? `/blog/${guide.slug}`}
                  className={`group flex flex-col bg-primary-950 p-7 h-full border border-transparent transition-colors ${
                    config?.border ?? 'group-hover:border-primary-600/50'
                  }`}
                >
                  {/* Number + icon row */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`text-4xl font-black tabular-nums leading-none ${
                        config?.accent ?? 'text-primary-400'
                      } opacity-25 group-hover:opacity-40 transition-opacity`}
                      aria-hidden="true"
                    >
                      {config?.num ?? '00'}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        config?.bg ?? 'bg-primary-800/60'
                      }`}
                      aria-hidden="true"
                    >
                      <Icon
                        className={`w-5 h-5 ${config?.accent ?? 'text-primary-400'}`}
                      />
                    </div>
                  </div>

                  <h3
                    className={`text-base font-bold text-white mb-2 leading-snug transition-colors ${
                      config?.accentHover ?? 'group-hover:text-primary-300'
                    }`}
                  >
                    {guide.title}
                  </h3>

                  <p className="text-sm text-primary-300/60 leading-relaxed line-clamp-2 flex-1 mb-5">
                    {guide.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-primary-400/60">
                      {guide.readTime}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        config?.accent ?? 'text-primary-400'
                      } opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      Explore
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}


// ─── Main BlogIndex component ─────────────────────────────────────────────────

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterTag>('All');
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const tabsId = useId();
  const searchId = useId();

  const topicGuides = posts.filter((p) => p.tag === 'Topic Guide');
  const regularPosts = posts.filter((p) => p.tag !== 'Topic Guide');

  // Tag counts across all regular posts (unaffected by search)
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

  // Filter by tag
  const tagFiltered =
    activeFilter === 'All'
      ? regularPosts
      : regularPosts.filter((p) => p.tag === activeFilter);

  // Then filter by search query
  const searchNeedle = query.trim().toLowerCase();
  const filteredPosts =
    searchNeedle.length < 2
      ? tagFiltered
      : tagFiltered.filter(
          (p) =>
            p.title.toLowerCase().includes(searchNeedle) ||
            p.description.toLowerCase().includes(searchNeedle) ||
            p.tag.toLowerCase().includes(searchNeedle),
        );

  const isDefaultView = activeFilter === 'All' && searchNeedle.length < 2;
  const visiblePosts =
    isDefaultView && !showAll ? filteredPosts.slice(0, INITIAL_SHOW_COUNT) : filteredPosts;
  const hasMore =
    isDefaultView && filteredPosts.length > INITIAL_SHOW_COUNT && !showAll;

  const handleFilterChange = useCallback(
    (tag: FilterTag) => {
      setActiveFilter(tag);
      setShowAll(false);
    },
    [],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setShowAll(false);
    },
    [],
  );

  const handleSearchClear = useCallback(() => {
    setQuery('');
  }, []);

  return (
    <>
      {/* ── Topic guide strip — full-bleed dark break ─────────────────── */}
      <TopicGuideStrip guides={topicGuides} />

      {/* ── Articles section — light background ───────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Section label */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-2">
            All Articles
          </p>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {regularPosts.length} articles across {FILTER_TAGS.length - 1} categories
          </p>
        </div>

        {/* ── Filter tabs ──────────────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Filter articles by category"
          id={tabsId}
          className="relative flex gap-0 overflow-x-auto pb-px scrollbar-none mb-6"
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
                onClick={() => handleFilterChange(tag)}
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

        {/* ── Search bar ──────────────────────────────────────────────── */}
        <div className="relative mb-8 max-w-sm">
          <label htmlFor={searchId} className="sr-only">
            Search articles
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 dark:text-secondary-500"
            aria-hidden="true"
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search articles…"
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white dark:bg-secondary-800/60 border border-secondary-200 dark:border-secondary-700 rounded-lg text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={handleSearchClear}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Result count — screen-reader live region */}
        <p
          role="status"
          aria-live="polite"
          className="mb-6 text-xs text-secondary-400 dark:text-secondary-500"
        >
          {searchNeedle.length >= 2 ? (
            <>
              {filteredPosts.length === 0
                ? 'No results'
                : `${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''}`}{' '}
              for &ldquo;{query.trim()}&rdquo;
            </>
          ) : (
            <>
              Showing {visiblePosts.length}
              {hasMore ? ` of ${filteredPosts.length}` : ''} article
              {filteredPosts.length !== 1 ? 's' : ''}
            </>
          )}
        </p>

        {/* ── Article list ──────────────────────────────────────────────── */}
        <ArticleList posts={visiblePosts} query={searchNeedle.length >= 2 ? query.trim() : ''} />

        {/* ── Show all button ───────────────────────────────────────────── */}
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

        {/* ── Footer CTA ───────────────────────────────────────────────── */}
        <div className="mt-16 pt-10 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                Ready to put these guides into practice?
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Build your first AI chatbot in minutes — no technical skills required.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href="#topics"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-700 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
              >
                Browse topic guides
              </a>
              <a
                href="/signup"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-sm font-medium text-white transition-colors"
              >
                Start for free
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
