'use client';

import Link from 'next/link';
import { ArrowRight, Scale, Activity, Smile, Calculator, UtensilsCrossed, Hotel, Dumbbell, ShieldCheck, TrendingUp, PawPrint, Scissors, UserCheck, Cpu, BookOpen, GraduationCap, Home, Car, Wrench, Sparkles, Church } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

// ─── Animation variants (same pattern as home-cta.tsx) ────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

// ─── Industry pill data ────────────────────────────────────────────────────────

interface Industry {
  icon: LucideIcon;
  label: string;
  href: string;
}

const featured: Industry[] = [
  { icon: Smile,          label: 'Dentists',           href: '/chatbot-for-dentists' },
  { icon: UtensilsCrossed,label: 'Restaurants',         href: '/chatbot-for-restaurants' },
  { icon: Hotel,          label: 'Hotels',              href: '/chatbot-for-hotels' },
  { icon: Scale,          label: 'Law Firms',           href: '/chatbot-for-lawyers' },
  { icon: Calculator,     label: 'Accountancy Firms',   href: '/chatbot-for-accountancy-firms' },
  { icon: Dumbbell,       label: 'Gyms',                href: '/chatbot-for-gyms' },
  { icon: UserCheck,      label: 'HR Departments',      href: '/chatbot-for-hr' },
  { icon: Activity,       label: 'Healthcare',          href: '/chatbot-for-healthcare' },
  { icon: TrendingUp,     label: 'Financial Advisors',  href: '/chatbot-for-financial-advisors' },
  { icon: ShieldCheck,    label: 'Insurance Agents',    href: '/chatbot-for-insurance-agents' },
  { icon: Home,           label: 'Real Estate',         href: '/chatbot-for-real-estate' },
  { icon: Car,            label: 'Car Dealerships',     href: '/chatbot-for-car-dealerships' },
  { icon: Wrench,         label: 'Auto Repair',         href: '/chatbot-for-auto-repair' },
  { icon: Cpu,            label: 'IT Support Teams',    href: '/chatbot-for-it-support' },
  { icon: Sparkles,       label: 'Cleaning Services',   href: '/chatbot-for-cleaning-services' },
  { icon: PawPrint,       label: 'Veterinarians',       href: '/chatbot-for-veterinarians' },
  { icon: Scissors,       label: 'Salons',              href: '/chatbot-for-salons' },
  { icon: BookOpen,       label: 'Tutoring Centers',    href: '/chatbot-for-tutoring-centers' },
  { icon: GraduationCap,  label: 'Universities',        href: '/chatbot-for-universities' },
  { icon: Church,         label: 'Churches',            href: '/chatbot-for-churches' },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export function HomeIndustries() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-white dark:bg-secondary-900 py-24 lg:py-32 overflow-hidden">
      {/* Subtle ambient glow — top-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 40%, rgba(14,165,233,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          className="max-w-2xl mb-14"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-primary-400 mb-5"
          >
            56+ Industries
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary-900 dark:text-white leading-tight mb-5"
          >
            Purpose-built for your industry
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-lg text-secondary-500 dark:text-secondary-400 leading-relaxed"
          >
            One platform, every vertical. VocUI works for any business that answers the same questions
            repeatedly — from solo practitioners to enterprise teams across 56 industries.
          </motion.p>
        </motion.div>

        {/* ── Industry pills ──────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap gap-3 mb-12"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {featured.map(({ icon: Icon, label, href }) => (
            <motion.div key={href} variants={fadeUp}>
              <Link
                href={href}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 text-sm font-medium hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                <Icon
                  className="h-4 w-4 text-secondary-400 dark:text-secondary-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors flex-shrink-0"
                  aria-hidden="true"
                />
                {label}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* ── See all link ─────────────────────────────────────────────────── */}
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-sm"
          >
            See all 56 industries
            <ArrowRight
              className="h-4 w-4 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
