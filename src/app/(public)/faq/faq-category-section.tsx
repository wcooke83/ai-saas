'use client';

import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import type { FaqCategory } from './faq-data';

/**
 * Renders a single FAQ category as a full-width section.
 *
 * Alternates between two treatments:
 * - "light" (even index): white/transparent bg, card-based questions
 * - "dark" (odd index): primary-950 bg, horizontal strip rows (like /about beliefs)
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// Distinct icon accent colors per category for the light treatment
const categoryAccentColors: Record<string, string> = {
  credits: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  billing: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  api: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  security: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  tools: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  account: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
};

// Decorative watermark words for the dark treatment
const categoryWatermarks: Record<string, string> = {
  credits: 'Credits',
  billing: 'Billing',
  api: 'API',
  security: 'Shield',
  tools: 'Tools',
  account: 'Account',
};

interface FaqCategorySectionProps {
  category: FaqCategory;
  index: number;
}

export function FaqCategorySection({ category, index }: FaqCategorySectionProps) {
  const isDark = index % 2 === 1;

  if (isDark) {
    return <DarkSection category={category} />;
  }
  return <LightSection category={category} />;
}

/* ─── Light treatment: white bg, asymmetric heading + card grid ─────────────── */

function LightSection({ category }: { category: FaqCategory }) {
  const prefersReducedMotion = useReducedMotion();
  const Icon = category.icon;
  const accentClass =
    categoryAccentColors[category.id] ?? 'bg-primary-50 dark:bg-primary-900/50 text-primary-500';

  return (
    <section
      id={category.id}
      role="tabpanel"
      aria-labelledby={`tab-${category.id}`}
      className="w-full py-20 lg:py-28 scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header: asymmetric 4/8 split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-12 lg:mb-16 items-end">
          <motion.div
            className="lg:col-span-5"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${accentClass}`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary-500 dark:text-secondary-400">
                {category.questions.length} questions
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight"
            >
              {category.title}
            </motion.h2>
          </motion.div>
        </div>

        {/* Questions: 2-column card grid on desktop */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {category.questions.map((q) => (
            <motion.div key={q.id} variants={fadeUp}>
              <QuestionCard
                id={q.id}
                question={q.question}
                answer={q.answer}
                variant="light"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Dark treatment: primary-950, horizontal strip rows ────────────────────── */

function DarkSection({ category }: { category: FaqCategory }) {
  const prefersReducedMotion = useReducedMotion();
  const Icon = category.icon;
  const watermark = categoryWatermarks[category.id] ?? category.title;

  return (
    <section
      id={category.id}
      role="tabpanel"
      aria-labelledby={`tab-${category.id}`}
      className="w-full bg-primary-950 py-24 lg:py-32 scroll-mt-20 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          className="flex items-center gap-3 mb-12 lg:mb-16"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <Icon className="w-5 h-5 text-primary-400" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400">
            {category.title}
          </p>
        </motion.div>

        {/* Horizontal strip rows — like /about beliefs */}
        <motion.div
          className="divide-y divide-primary-800/40"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {category.questions.map((q, qIndex) => (
            <motion.div
              key={q.id}
              id={`question-${q.id}`}
              variants={fadeUp}
              className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-10 lg:py-14 items-start overflow-hidden scroll-mt-24"
            >
              {/* Decorative watermark on last item */}
              {qIndex === category.questions.length - 1 && (
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[8rem] lg:text-[11rem] font-black leading-none tracking-tighter select-none pointer-events-none"
                  style={{ color: 'rgba(14, 165, 233, 0.04)' }}
                  aria-hidden="true"
                >
                  {watermark}
                </span>
              )}

              {/* Number + accent bar */}
              <div className="lg:col-span-1 flex items-center gap-4 lg:flex-col lg:items-start lg:gap-2">
                <div className="w-8 h-0.5 bg-primary-500" aria-hidden="true" />
                <span className="text-sm font-semibold tracking-[0.2em] text-primary-500">
                  {String(qIndex + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Question */}
              <div className="lg:col-span-4">
                <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight">
                  {q.question}
                </h3>
              </div>

              {/* Answer + feedback */}
              <div className="lg:col-span-7">
                <p className="text-base lg:text-lg text-primary-200/60 leading-relaxed mb-4">
                  {q.answer}
                </p>
                <QuestionActions questionId={q.id} variant="dark" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Question card (light sections) ────────────────────────────────────────── */

interface QuestionCardProps {
  id: string;
  question: string;
  answer: string;
  variant: 'light' | 'dark';
}

function QuestionCard({ id, question, answer, variant }: QuestionCardProps) {
  return (
    <div
      id={`question-${id}`}
      className="h-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800/50 p-6 lg:p-8 scroll-mt-24"
    >
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3 leading-snug">
        {question}
      </h3>
      <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed text-[15px] mb-5">
        {answer}
      </p>
      <QuestionActions questionId={id} variant={variant} />
    </div>
  );
}

/* ─── Shared feedback + copy-link row ───────────────────────────────────────── */

function QuestionActions({ questionId, variant }: { questionId: string; variant: 'light' | 'dark' }) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const copyLink = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#${questionId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  }, [questionId]);

  const handleFeedback = useCallback(
    (helpful: boolean) => {
      setFeedbackGiven(true);
      toast.success('Thanks for your feedback!');
      console.log(`Feedback for ${questionId}: ${helpful ? 'helpful' : 'not helpful'}`);
    },
    [questionId]
  );

  const isDark = variant === 'dark';

  return (
    <div
      className={`flex items-center justify-between pt-4 border-t ${
        isDark
          ? 'border-primary-800/30'
          : 'border-secondary-100 dark:border-secondary-700'
      }`}
    >
      <div className="flex items-center gap-3">
        {feedbackGiven ? (
          <span
            className={`text-sm ${
              isDark ? 'text-primary-200/50' : 'text-secondary-500 dark:text-secondary-400'
            }`}
          >
            Thanks for your feedback!
          </span>
        ) : (
          <>
            <span
              className={`text-sm ${
                isDark ? 'text-primary-200/40' : 'text-secondary-500 dark:text-secondary-400'
              }`}
            >
              Helpful?
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleFeedback(true)}
                className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg transition-colors ${
                  isDark
                    ? 'text-primary-200/40 hover:text-green-400 hover:bg-green-900/20'
                    : 'text-secondary-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
                aria-label="Yes, this was helpful"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg transition-colors ${
                  isDark
                    ? 'text-primary-200/40 hover:text-red-400 hover:bg-red-900/20'
                    : 'text-secondary-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
                aria-label="No, this was not helpful"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      <button
        onClick={copyLink}
        className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg transition-colors ${
          isDark
            ? 'text-primary-200/40 hover:text-primary-400 hover:bg-primary-900/30'
            : 'text-secondary-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
        }`}
        aria-label="Copy link to this question"
      >
        <Link2 className="w-4 h-4" />
      </button>
    </div>
  );
}
