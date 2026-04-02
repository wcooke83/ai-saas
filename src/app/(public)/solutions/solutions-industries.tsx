'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

interface IndustryGroup {
  label: string;
  industries: { label: string; href: string }[];
}

const industryGroups: IndustryGroup[] = [
  {
    label: 'Health & Wellness',
    industries: [
      { label: 'Healthcare', href: '/chatbot-for-healthcare' },
      { label: 'Dentists', href: '/chatbot-for-dentists' },
      { label: 'Chiropractors', href: '/chatbot-for-chiropractors' },
      { label: 'Optometrists', href: '/chatbot-for-optometrists' },
      { label: 'Pharmacies', href: '/chatbot-for-pharmacies' },
      { label: 'Veterinarians', href: '/chatbot-for-veterinarians' },
      { label: 'Therapists', href: '/chatbot-for-therapists' },
      { label: 'Plastic Surgeons', href: '/chatbot-for-plastic-surgeons' },
    ],
  },
  {
    label: 'Legal & Finance',
    industries: [
      { label: 'Law Firms', href: '/chatbot-for-lawyers' },
      { label: 'Immigration Lawyers', href: '/chatbot-for-immigration-lawyers' },
      { label: 'Accountants', href: '/chatbot-for-accountants' },
      { label: 'Accountancy Firms', href: '/chatbot-for-accountancy-firms' },
      { label: 'Financial Advisors', href: '/chatbot-for-financial-advisors' },
      { label: 'Insurance Agents', href: '/chatbot-for-insurance-agents' },
      { label: 'Mortgage Brokers', href: '/chatbot-for-mortgage-brokers' },
      { label: 'Mortgage Lenders', href: '/chatbot-for-mortgage-lenders' },
    ],
  },
  {
    label: 'Hospitality & Food',
    industries: [
      { label: 'Restaurants', href: '/chatbot-for-restaurants' },
      { label: 'Hotels', href: '/chatbot-for-hotels' },
      { label: 'Travel Agencies', href: '/chatbot-for-travel-agencies' },
    ],
  },
  {
    label: 'Fitness & Wellness',
    industries: [
      { label: 'Gyms', href: '/chatbot-for-gyms' },
      { label: 'Fitness Studios', href: '/chatbot-for-fitness-studios' },
      { label: 'Yoga Studios', href: '/chatbot-for-yoga-studios' },
      { label: 'Personal Trainers', href: '/chatbot-for-personal-trainers' },
      { label: 'Spas', href: '/chatbot-for-spas' },
      { label: 'Salons', href: '/chatbot-for-salons' },
      { label: 'Pet Grooming', href: '/chatbot-for-pet-grooming' },
    ],
  },
  {
    label: 'Home Services & Trades',
    industries: [
      { label: 'Plumbers', href: '/chatbot-for-plumbers' },
      { label: 'Electricians', href: '/chatbot-for-electricians' },
      { label: 'HVAC Companies', href: '/chatbot-for-hvac' },
      { label: 'Landscapers', href: '/chatbot-for-landscapers' },
      { label: 'Cleaning Services', href: '/chatbot-for-cleaning-services' },
    ],
  },
  {
    label: 'Automotive & Events',
    industries: [
      { label: 'Car Dealerships', href: '/chatbot-for-car-dealerships' },
      { label: 'Auto Repair', href: '/chatbot-for-auto-repair' },
      { label: 'Event Planners', href: '/chatbot-for-event-planners' },
      { label: 'Wedding Venues', href: '/chatbot-for-wedding-venues' },
      { label: 'Photography Studios', href: '/chatbot-for-photography-studios' },
    ],
  },
  {
    label: 'Business Services',
    industries: [
      { label: 'Recruiters', href: '/chatbot-for-recruiters' },
      { label: 'HR Departments', href: '/chatbot-for-hr' },
      { label: 'IT Support Teams', href: '/chatbot-for-it-support' },
      { label: 'SaaS Companies', href: '/chatbot-for-saas' },
      { label: 'Marketing Agencies', href: '/chatbot-for-marketing-agencies' },
      { label: 'Web Design Agencies', href: '/chatbot-for-web-design-agencies' },
    ],
  },
  {
    label: 'Education & Non-Profit',
    industries: [
      { label: 'Tutoring Centers', href: '/chatbot-for-tutoring-centers' },
      { label: 'Universities', href: '/chatbot-for-universities' },
      { label: 'Online Courses', href: '/chatbot-for-online-courses' },
      { label: 'Non-Profits', href: '/chatbot-for-nonprofits' },
      { label: 'Churches', href: '/chatbot-for-churches' },
      { label: 'Government', href: '/chatbot-for-government' },
    ],
  },
  {
    label: 'Property & Real Estate',
    industries: [
      { label: 'Real Estate', href: '/chatbot-for-real-estate' },
      { label: 'Property Managers', href: '/chatbot-for-property-managers' },
    ],
  },
  {
    label: 'E-commerce & Logistics',
    industries: [
      { label: 'E-commerce', href: '/chatbot-for-ecommerce' },
      { label: 'Logistics', href: '/chatbot-for-logistics' },
      { label: 'Manufacturers', href: '/chatbot-for-manufacturers' },
      { label: 'Wholesale', href: '/chatbot-for-wholesale' },
    ],
  },
];

const totalIndustries = industryGroups.reduce(
  (sum, group) => sum + group.industries.length,
  0
);

const INITIAL_VISIBLE_GROUPS = 4;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export function SolutionsIndustries() {
  const prefersReducedMotion = useReducedMotion();
  const [showAll, setShowAll] = useState(false);

  const visibleGroups = showAll
    ? industryGroups
    : industryGroups.slice(0, INITIAL_VISIBLE_GROUPS);

  return (
    <section className="w-full bg-white dark:bg-secondary-950 py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row: label + count on left, browse-all link on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-end mb-16 lg:mb-20">
          <motion.div
            className="lg:col-span-8"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-4"
            >
              {totalIndustries}+ industries
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight"
            >
              Built for your industry.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-lg text-secondary-600 dark:text-secondary-400 mt-4 max-w-2xl"
            >
              VocUI works across every sector where conversations drive business. Same platform, trained on your content, deployed the same day.
            </motion.p>
          </motion.div>

          <motion.div
            className="lg:col-span-4 lg:text-right"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              Browse all industries
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* Industry groups -- categorized pill clouds */}
        <div className="space-y-10">
          <AnimatePresence mode="sync">
            {visibleGroups.map((group) => (
              <motion.div
                key={group.label}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start border-t border-secondary-200 dark:border-secondary-800 pt-8"
              >
                {/* Group label */}
                <div className="lg:col-span-3">
                  <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                    {group.label}
                  </p>
                </div>

                {/* Pills */}
                <div className="lg:col-span-9 flex flex-wrap gap-2.5">
                  {group.industries.map((industry) => (
                    <Link
                      key={industry.href}
                      href={industry.href}
                      className="inline-flex items-center rounded-full border border-secondary-300 dark:border-secondary-600 px-4 py-1.5 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full"
                    >
                      {industry.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show more / show less toggle */}
        {industryGroups.length > INITIAL_VISIBLE_GROUPS && (
          <div className="mt-10 pt-8 border-t border-secondary-200 dark:border-secondary-800">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              {showAll ? (
                <>
                  Show fewer industries
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                </>
              ) : (
                <>
                  Show all {industryGroups.length} industry categories
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
