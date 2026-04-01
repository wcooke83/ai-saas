'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { faqCategories } from './faq-data';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

interface FaqCategoryNavProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export function FaqCategoryNav({ activeCategory, onSelectCategory }: FaqCategoryNavProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="categories"
      className="w-full bg-secondary-900 dark:bg-secondary-950 py-12 lg:py-16 scroll-mt-16 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-8"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Browse by topic
        </motion.p>

        {/* Horizontal scrollable on mobile, grid on desktop */}
        <motion.div
          className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          role="tablist"
          aria-label="FAQ categories"
        >
          {faqCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <motion.button
                key={category.id}
                variants={fadeUp}
                onClick={() => onSelectCategory(category.id)}
                role="tab"
                aria-selected={isActive}
                aria-controls={category.id}
                className={`
                  flex-shrink-0 flex items-center gap-3 px-5 py-4 rounded-lg
                  transition-all duration-200 text-left min-w-[160px] lg:min-w-0
                  ${
                    isActive
                      ? 'bg-primary-500/15 ring-1 ring-primary-500/40 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-secondary-300 hover:text-white'
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-primary-400' : 'text-secondary-500'
                  }`}
                  aria-hidden="true"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-tight">{category.title}</span>
                  <span className="text-xs text-secondary-500 mt-0.5">
                    {category.questions.length} questions
                  </span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
