'use client';

import { useState, useCallback, useEffect, type ElementType } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Search, ChevronRight, CircleDot,
  Scale, Activity, Home, ShoppingBag,
  Stethoscope, Smile, Calculator, UtensilsCrossed, Hotel,
  Dumbbell, ShieldCheck, TrendingUp, Building, PawPrint,
  Scissors, Glasses, Pill, Users, UserCheck, Cpu, Layers,
  Megaphone, Globe, BookOpen, Zap, Thermometer, Leaf,
  Wind, Sparkles, Droplets, Car, Wrench, Plane, PartyPopper,
  Camera, GraduationCap, Laptop, Heart, Church, Landmark,
  Key, Banknote, Truck, Factory, ShoppingCart, Waves,
  FileText,
} from 'lucide-react';

import { IndustriesHero } from './industries-hero';
import { IndustriesCategoryNav } from './industries-category-nav';
import { IndustrySections } from './industries-sections';
import { IndustriesMidCta } from './industries-mid-cta';
import { IndustriesCta } from './industries-cta';

// ─── Icon map ────────────────────────────────────────────────────────────────

const iconMap: Record<string, ElementType> = {
  Scale, Activity, Home, ShoppingBag, Stethoscope, Smile, Calculator,
  UtensilsCrossed, Hotel, Dumbbell, ShieldCheck, TrendingUp, Building,
  PawPrint, Scissors, Glasses, Pill, Users, UserCheck, Cpu, Layers,
  Megaphone, Globe, BookOpen, Zap, Thermometer, Leaf, Wind, Sparkles,
  Droplets, Car, Wrench, Plane, PartyPopper, Camera, GraduationCap,
  Laptop, Heart, Church, Landmark, Key, Banknote, Truck, Factory,
  ShoppingCart, Waves, FileText,
};

function resolveIcon(name: string): ElementType {
  return iconMap[name] ?? CircleDot;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface IndustryData {
  iconName: string;
  label: string;
  href: string;
  description: string;
  keywords?: string[];
}

interface GroupData {
  label: string;
  anchor: string;
  industries: IndustryData[];
}

interface CategoryLink {
  label: string;
  anchor: string;
  count: number;
}

interface IndustriesContentProps {
  groups: GroupData[];
  categoryLinks: CategoryLink[];
  totalCount: number;
  midCtaAfter: number;
}

// ─── Highlight helper ────────────────────────────────────────────────────────

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

// ─── Footer CTA ─────────────────────────────────────────────────────────────

function IndustriesFooterCta({ onBrowseClick }: { onBrowseClick?: () => void }) {
  return (
    <div className="mt-16 pt-10 border-t border-secondary-200 dark:border-secondary-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <p className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
            Can&apos;t find your industry?
          </p>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            VocUI works for any business. Build a chatbot trained on your own knowledge base.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {onBrowseClick ? (
            <button
              type="button"
              onClick={onBrowseClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-700 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
            >
              Browse all categories
            </button>
          ) : (
            <a
              href="#categories"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-700 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
            >
              Browse all categories
            </a>
          )}
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
  );
}

// ─── Industry row (search result) ───────────────────────────────────────────

interface IndustryRowProps {
  industry: IndustryData & { categoryLabel: string };
  index: number;
  query: string;
  isVisible: boolean;
}

function IndustryRow({ industry, index, query, isVisible }: IndustryRowProps) {
  const Icon = resolveIcon(industry.iconName);
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
        href={industry.href}
        className="group flex items-start justify-between gap-6 py-5 -mx-4 px-4 sm:-mx-6 sm:px-6 hover:bg-secondary-50/70 dark:hover:bg-secondary-800/25 transition-colors duration-150"
      >
        {/* Left: meta + title + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300">
              {industry.categoryLabel}
            </span>
          </div>
          <h3 className="text-base font-semibold text-secondary-900 dark:text-secondary-100 leading-snug group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-150 mb-1.5">
            <span className="inline-flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" aria-hidden="true" />
              {highlightMatch(industry.label, query)}
            </span>
          </h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed line-clamp-2">
            {highlightMatch(industry.description, query)}
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

// ─── Main content wrapper ───────────────────────────────────────────────────

export function IndustriesContent({
  groups,
  categoryLinks,
  totalCount,
  midCtaAfter,
}: IndustriesContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const searchNeedle = searchQuery.trim().toLowerCase();
  const isSearchActive = searchNeedle.length >= 2;

  // Compute search results
  const searchResults = isSearchActive
    ? groups.flatMap((group) =>
        group.industries
          .filter(
            (ind) =>
              ind.label.toLowerCase().includes(searchNeedle) ||
              ind.description.toLowerCase().includes(searchNeedle) ||
              group.label.toLowerCase().includes(searchNeedle) ||
              (ind.keywords?.some((kw) => kw.toLowerCase().includes(searchNeedle)) ?? false),
          )
          .map((ind) => ({ ...ind, categoryLabel: group.label })),
      )
    : [];

  // CSS staggered fade-in: only animate on first search activation
  useEffect(() => {
    if (isSearchActive && !hasAnimated) {
      setIsVisible(false);
      const t = setTimeout(() => {
        setIsVisible(true);
        setHasAnimated(true);
      }, 30);
      return () => clearTimeout(t);
    }
    if (isSearchActive) {
      setIsVisible(true);
    }
    if (!isSearchActive) {
      setHasAnimated(false);
      setIsVisible(false);
    }
  }, [isSearchActive, hasAnimated]);

  // Handle category pill click: clear search, then scroll to anchor
  const handleCategoryClick = useCallback((anchor: string) => {
    setSearchQuery('');
    // Use requestAnimationFrame to allow state update before scrolling
    requestAnimationFrame(() => {
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }, []);

  // Split groups for mid-CTA insertion
  const firstHalf = groups.slice(0, midCtaAfter);
  const secondHalf = groups.slice(midCtaAfter);

  return (
    <>
      {/* Hero (always visible) */}
      <IndustriesHero
        totalCount={totalCount}
        categories={categoryLinks}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCategoryClick={handleCategoryClick}
        isSearchActive={isSearchActive}
        resultCount={searchResults.length}
      />

      {isSearchActive ? (
        /* ── Search results view ─────────────────────────────────────── */
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {searchResults.length > 0 ? (
            <div
              className="divide-y divide-secondary-100 dark:divide-secondary-800"
            >
              {searchResults.map((ind, i) => (
                <IndustryRow
                  key={ind.href}
                  industry={ind}
                  index={i}
                  query={searchQuery.trim()}
                  isVisible={isVisible}
                />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div
              className="py-16 text-center"
              style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s ease-out' }}
            >
              <Search className="w-10 h-10 mx-auto text-secondary-300 dark:text-secondary-600 mb-4" />
              <p className="text-base font-medium text-secondary-900 dark:text-secondary-100 mb-1">
                No industries found
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Try different keywords or clear the search.
              </p>
            </div>
          )}

          <IndustriesFooterCta onBrowseClick={() => handleCategoryClick(groups[0].anchor)} />
        </div>
      ) : (
        /* ── Default view (category nav + sections + CTAs) ───────────── */
        <>
          <div id="categories">
            <IndustriesCategoryNav
              categories={categoryLinks.map((c) => ({ label: c.label, anchor: c.anchor }))}
            />
          </div>

          <IndustrySections groups={firstHalf} />
          <IndustriesMidCta />
          <IndustrySections groups={secondHalf} />
          <IndustriesCta />

          {/* Footer CTA (default view) */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <IndustriesFooterCta />
          </div>
        </>
      )}
    </>
  );
}
