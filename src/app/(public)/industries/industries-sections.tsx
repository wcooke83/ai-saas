'use client';

import type { ElementType } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Scale, Activity, Home, ShoppingBag,
  Stethoscope, Smile, Calculator, UtensilsCrossed, Hotel,
  Dumbbell, ShieldCheck, TrendingUp, Building, PawPrint,
  Scissors, Glasses, Pill, Users, UserCheck, Cpu, Layers,
  Megaphone, Globe, BookOpen, Zap, Thermometer, Leaf,
  Wind, Sparkles, Droplets, Car, Wrench, Plane, PartyPopper,
  Camera, GraduationCap, Laptop, Heart, Church, Landmark,
  Key, Banknote, Truck, Factory, ShoppingCart, Waves,
  FileText, CircleDot,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

// ─── Icon map: resolve string names to components on the client ───────────────

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

// ─── Animation primitives ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Types ─────────────────────────────────────────────────────────────────────

interface IndustryData {
  iconName: string;
  label: string;
  href: string;
  description: string;
  keywords?: string[];
}

interface Industry {
  icon: ElementType;
  label: string;
  href: string;
  description: string;
}

interface IndustryGroupData {
  label: string;
  anchor: string;
  industries: IndustryData[];
}

interface IndustryGroup {
  label: string;
  anchor: string;
  industries: Industry[];
}

interface IndustrySectionsProps {
  groups: IndustryGroupData[];
}

// ─── Shared sub-components ─────────────────────────────────────────────────────

function SectionLabel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.22em] mb-10 lg:mb-12 ${
        dark
          ? 'text-primary-400'
          : 'text-primary-500'
      }`}
    >
      {children}
    </p>
  );
}

function IndustryCard({
  industry,
  className,
  size = 'default',
}: {
  industry: Industry;
  className?: string;
  size?: 'default' | 'large';
}) {
  const Icon = industry.icon;
  const isLarge = size === 'large';

  return (
    <Link href={industry.href} className={`group block ${className ?? ''}`}>
      <div className="h-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 p-6">
        <div
          className={`flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30 mb-4 ${
            isLarge ? 'h-12 w-12' : 'h-9 w-9'
          }`}
        >
          <Icon
            className={`text-primary-600 dark:text-primary-400 ${isLarge ? 'h-6 w-6' : 'h-4 w-4'}`}
            aria-hidden="true"
          />
        </div>
        <h3
          className={`font-semibold leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-secondary-900 dark:text-secondary-100 ${
            isLarge ? 'text-lg mb-2' : 'text-sm mb-1.5'
          }`}
        >
          {industry.label}
        </h3>
        <p
          className={`text-secondary-600 dark:text-secondary-400 leading-relaxed mb-3 ${
            isLarge ? 'text-sm' : 'text-xs'
          }`}
        >
          {industry.description}
        </p>
        <span className="inline-flex items-center text-xs font-medium text-primary-600 dark:text-primary-400 gap-1 group-hover:gap-2 transition-all">
          Learn more
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

// ─── Layout: Featured grid (1 large + rest small) ──────────────────────────────

function LayoutFeaturedGrid({
  group,
  prefersReducedMotion,
}: {
  group: IndustryGroup;
  prefersReducedMotion: boolean | null;
}) {
  const [featured, ...rest] = group.industries;
  return (
    <section
      id={group.anchor}
      className="w-full py-20 lg:py-28 scroll-mt-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>{group.label}</SectionLabel>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Featured card — spans left 5 cols, taller */}
            <motion.div variants={fadeUp} className="lg:col-span-5 lg:row-span-2">
              <IndustryCard industry={featured} size="large" className="h-full" />
            </motion.div>

            {/* Remaining cards — right 7 cols, 2-3 per row */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {rest.map((ind) => (
                <motion.div key={ind.href} variants={fadeUp}>
                  <IndustryCard industry={ind} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Layout: Horizontal rows (professional/tabular) ────────────────────────────

function LayoutHorizontalRows({
  group,
  prefersReducedMotion,
  dark,
}: {
  group: IndustryGroup;
  prefersReducedMotion: boolean | null;
  dark?: boolean;
}) {
  return (
    <section
      id={group.anchor}
      className={`w-full py-20 lg:py-28 scroll-mt-32 ${
        dark
          ? 'bg-secondary-950'
          : 'bg-secondary-50 dark:bg-secondary-900/40'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel dark={dark}>{group.label}</SectionLabel>
          </motion.div>

          <div className={`divide-y ${dark ? 'divide-secondary-800' : 'divide-secondary-200 dark:divide-secondary-700'}`}>
            {group.industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <motion.div key={ind.href} variants={fadeUp}>
                  <Link
                    href={ind.href}
                    className={`group grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 py-6 lg:py-8 items-center transition-colors ${
                      dark
                        ? 'hover:bg-secondary-900/60'
                        : 'hover:bg-white dark:hover:bg-secondary-800/60'
                    } -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-lg`}
                  >
                    {/* Number + Icon */}
                    <div className="sm:col-span-1 flex items-center gap-3 sm:gap-0 sm:flex-col sm:items-start">
                      <span
                        className={`text-xs font-semibold tracking-[0.2em] ${
                          dark ? 'text-secondary-600' : 'text-secondary-400 dark:text-secondary-500'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="hidden sm:flex sm:col-span-1 items-center">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        dark
                          ? 'bg-primary-900/30'
                          : 'bg-primary-50 dark:bg-primary-900/30'
                      }`}>
                        <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="sm:col-span-3">
                      <h3
                        className={`text-base font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors ${
                          dark ? 'text-white' : 'text-secondary-900 dark:text-secondary-100'
                        }`}
                      >
                        {ind.label}
                      </h3>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-6">
                      <p className={`text-sm leading-relaxed ${
                        dark ? 'text-secondary-400' : 'text-secondary-600 dark:text-secondary-400'
                      }`}>
                        {ind.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="sm:col-span-1 flex justify-end">
                      <ArrowRight
                        className={`h-4 w-4 transition-all group-hover:translate-x-1 ${
                          dark
                            ? 'text-secondary-600 group-hover:text-primary-400'
                            : 'text-secondary-400 dark:text-secondary-500 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Layout: Wide cards (3 across, larger) ─────────────────────────────────────

function LayoutWideCards({
  group,
  prefersReducedMotion,
}: {
  group: IndustryGroup;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <section
      id={group.anchor}
      className="w-full py-20 lg:py-28 scroll-mt-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>{group.label}</SectionLabel>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {group.industries.map((ind) => (
              <motion.div key={ind.href} variants={fadeUp}>
                <IndustryCard industry={ind} size="large" className="h-full" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Layout: Compact pill cloud ────────────────────────────────────────────────

function LayoutPillCloud({
  group,
  prefersReducedMotion,
}: {
  group: IndustryGroup;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <section
      id={group.anchor}
      className="w-full bg-primary-50 dark:bg-primary-950/30 py-20 lg:py-28 scroll-mt-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>{group.label}</SectionLabel>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {group.industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <motion.div key={ind.href} variants={fadeUp}>
                  <Link
                    href={ind.href}
                    className="group flex items-center gap-3 p-4 rounded-lg border border-primary-200 dark:border-primary-800/40 bg-white dark:bg-secondary-900/60 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40">
                      <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                        {ind.label}
                      </h3>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                        {ind.description}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-secondary-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all ml-auto" aria-hidden="true" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Layout: Numbered timeline rows ────────────────────────────────────────────

function LayoutNumberedRows({
  group,
  prefersReducedMotion,
}: {
  group: IndustryGroup;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <section
      id={group.anchor}
      className="w-full py-20 lg:py-28 scroll-mt-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>{group.label}</SectionLabel>
          </motion.div>

          <div className="max-w-3xl">
            {group.industries.map((ind, i) => {
              const Icon = ind.icon;
              const isLast = i === group.industries.length - 1;
              return (
                <motion.div key={ind.href} variants={fadeUp} className="relative">
                  <Link
                    href={ind.href}
                    className="group flex gap-5 lg:gap-8"
                  >
                    {/* Timeline spine */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary-300 dark:border-primary-700 bg-white dark:bg-secondary-900 group-hover:border-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/40 transition-colors">
                        <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                      </div>
                      {!isLast && (
                        <div className="w-px flex-1 bg-secondary-200 dark:bg-secondary-700 my-1" aria-hidden="true" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`pb-8 ${isLast ? '' : 'mb-0'}`}>
                      <h3 className="text-base font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
                        {ind.label}
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed mb-2">
                        {ind.description}
                      </p>
                      <span className="inline-flex items-center text-xs font-medium text-primary-600 dark:text-primary-400 gap-1 group-hover:gap-2 transition-all">
                        Learn more
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Layout: Offset alternating cards ──────────────────────────────────────────

function LayoutAlternatingCards({
  group,
  prefersReducedMotion,
}: {
  group: IndustryGroup;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <section
      id={group.anchor}
      className="w-full bg-secondary-50 dark:bg-secondary-900/40 py-20 lg:py-28 scroll-mt-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>{group.label}</SectionLabel>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.industries.map((ind, i) => (
              <motion.div
                key={ind.href}
                variants={fadeUp}
                className={i % 2 === 1 ? 'lg:mt-8' : ''}
              >
                <IndustryCard industry={ind} size="large" className="h-full" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Layout: Standard grid ─────────────────────────────────────────────────────

function LayoutGrid({
  group,
  prefersReducedMotion,
  tinted,
}: {
  group: IndustryGroup;
  prefersReducedMotion: boolean | null;
  tinted?: boolean;
}) {
  return (
    <section
      id={group.anchor}
      className={`w-full py-20 lg:py-28 scroll-mt-32 ${
        tinted ? 'bg-secondary-50 dark:bg-secondary-900/40' : ''
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>{group.label}</SectionLabel>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.industries.map((ind) => (
              <motion.div key={ind.href} variants={fadeUp}>
                <IndustryCard industry={ind} className="h-full" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Layout: Full-width 2-col hero split ───────────────────────────────────────

function LayoutHeroSplit({
  group,
  prefersReducedMotion,
}: {
  group: IndustryGroup;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <section
      id={group.anchor}
      className="w-full py-20 lg:py-28 scroll-mt-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>{group.label}</SectionLabel>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {group.industries.map((ind) => (
              <motion.div key={ind.href} variants={fadeUp}>
                <IndustryCard industry={ind} size="large" className="h-full" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function IndustrySections({ groups: groupsData }: IndustrySectionsProps) {
  const prefersReducedMotion = useReducedMotion();

  // Resolve icon names to actual components
  const groups: IndustryGroup[] = groupsData.map((g) => ({
    ...g,
    industries: g.industries.map((ind) => ({
      icon: resolveIcon(ind.iconName),
      label: ind.label,
      href: ind.href,
      description: ind.description,
    })),
  }));

  // Map each group to a specific layout by label for visual variety.
  // The order here matches the groups array passed from page.tsx.
  const layoutMap: Record<string, string> = {
    'Health & Wellness': 'featured-grid',
    'Legal & Finance': 'horizontal-rows',
    'Hospitality & Food': 'wide-cards',
    'Fitness & Wellness': 'pill-cloud',
    'Home Services & Trades': 'numbered-rows',
    'Automotive & Events': 'alternating-cards',
    'Business Services & Agencies': 'grid',
    'Education & Non-Profit': 'grid-tinted',
    'Property & Real Estate': 'hero-split',
    'B2B, Logistics & Industry': 'horizontal-rows-dark',
  };

  return (
    <>
      {groups.map((group) => {
        const layout = layoutMap[group.label] ?? 'grid';

        switch (layout) {
          case 'featured-grid':
            return (
              <LayoutFeaturedGrid
                key={group.anchor}
                group={group}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
          case 'horizontal-rows':
            return (
              <LayoutHorizontalRows
                key={group.anchor}
                group={group}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
          case 'horizontal-rows-dark':
            return (
              <LayoutHorizontalRows
                key={group.anchor}
                group={group}
                prefersReducedMotion={prefersReducedMotion}
                dark
              />
            );
          case 'wide-cards':
            return (
              <LayoutWideCards
                key={group.anchor}
                group={group}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
          case 'pill-cloud':
            return (
              <LayoutPillCloud
                key={group.anchor}
                group={group}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
          case 'numbered-rows':
            return (
              <LayoutNumberedRows
                key={group.anchor}
                group={group}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
          case 'alternating-cards':
            return (
              <LayoutAlternatingCards
                key={group.anchor}
                group={group}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
          case 'grid-tinted':
            return (
              <LayoutGrid
                key={group.anchor}
                group={group}
                prefersReducedMotion={prefersReducedMotion}
                tinted
              />
            );
          case 'hero-split':
            return (
              <LayoutHeroSplit
                key={group.anchor}
                group={group}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
          default:
            return (
              <LayoutGrid
                key={group.anchor}
                group={group}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
        }
      })}
    </>
  );
}
