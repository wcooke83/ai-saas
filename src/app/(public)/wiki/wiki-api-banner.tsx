'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface WikiPage {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface WikiApiBannerProps {
  title: string;
  pages: WikiPage[];
  icon: LucideIcon;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/**
 * API / single-page category — dark full-bleed banner with large icon,
 * asymmetric layout, and a prominent CTA link. Designed for categories
 * that have only 1-2 pages and deserve a distinct visual treatment
 * instead of a card grid.
 */
export function WikiApiBanner({ title, pages, icon: Icon }: WikiApiBannerProps) {
  const prefersReducedMotion = useReducedMotion();
  const sorted = [...pages].sort((a, b) => a.order - b.order);

  return (
    <section className="relative w-full bg-primary-950 py-24 lg:py-32 overflow-hidden">
      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 30% 50%, rgba(14,165,233,0.06) 0%, transparent 55%)',
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {/* Left: decorative icon */}
          <div
            className="lg:col-span-4 hidden lg:flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="relative">
              {/* Large ghost icon */}
              <Icon
                className="w-48 h-48"
                strokeWidth={0.5}
                style={{ color: 'rgba(14, 165, 233, 0.08)' }}
              />
              {/* Smaller solid icon on top */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 bg-primary-900/50 rounded-xl border border-primary-800/30">
                  <Icon className="w-8 h-8 text-primary-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: content */}
          <motion.div className="lg:col-span-8" variants={stagger}>
            <motion.div className="flex items-center gap-3 mb-4 lg:hidden" variants={fadeUp}>
              <div className="p-2 bg-primary-900/50 rounded-lg">
                <Icon className="w-5 h-5 text-primary-400" />
              </div>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-4"
            >
              {title}
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6"
            >
              Build custom integrations.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg text-primary-200/60 leading-relaxed mb-10 max-w-xl"
            >
              Connect your systems programmatically with the VocUI REST API.
              Server-side integrations, custom workflows, and advanced automation.
            </motion.p>

            {/* Page links as prominent CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              {sorted.map((page) => (
                <Link
                  key={page.id}
                  href={`/wiki/${page.id}`}
                  className="inline-flex items-center gap-3 px-6 py-4 bg-primary-900/40 hover:bg-primary-900/70 border border-primary-800/30 hover:border-primary-700/50 rounded-sm text-white transition-all group w-fit"
                >
                  <span className="font-medium">{page.title}</span>
                  <ArrowRight
                    className="w-4 h-4 text-primary-400 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
