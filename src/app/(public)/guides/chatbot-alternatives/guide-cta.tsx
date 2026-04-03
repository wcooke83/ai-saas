'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface RelatedPost {
  slug: string;
  title: string;
  description: string;
  readTime: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function GuideCta({ relatedPosts }: { relatedPosts: RelatedPost[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-label="Build your chatbot" className="w-full overflow-hidden">
      {/* CTA — full-bleed gradient, centered layout */}
      <div
        className="relative w-full py-28 lg:py-36"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgb(2,132,199) 0%, rgb(8,47,73) 100%)',
        }}
      >
        {/* Decorative ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          }}
        />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200/70 mb-6"
            >
              Ready to build?
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              You&apos;ve done the research.
              <br />
              <span className="text-primary-200">Now build your chatbot.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg text-white/70 leading-relaxed mb-10 max-w-xl mx-auto"
            >
              Train a chatbot on your own content, embed it on your site, and
              start answering customer questions today. Free plan, no credit card, no sales call.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-white/90 text-primary-700 font-semibold text-base rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
              >
                Build your chatbot free
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white/10 text-white font-medium text-base rounded-sm border border-white/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
              >
                Compare plans
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-sm text-white/70"
            >
              Free plan included &middot; No credit card required &middot; Live in under 5 minutes
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Related reading — integrated card strip */}
      {relatedPosts.length > 0 && (
        <div className="w-full bg-secondary-50 dark:bg-secondary-900 py-10 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
            >
              <Link
                href={`/blog/${relatedPosts[0].slug}`}
                aria-label={`Read related guide: ${relatedPosts[0].title}`}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-xl bg-white dark:bg-secondary-800/60 border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 hover:shadow-md"
              >
                <span className="flex-none text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-primary-400 whitespace-nowrap">
                  Related reading
                </span>

                <div
                  className="w-px h-8 bg-secondary-200 dark:bg-secondary-700 hidden sm:block flex-none"
                  aria-hidden="true"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {relatedPosts[0].title}
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1 line-clamp-1">
                    {relatedPosts[0].readTime} &mdash; {relatedPosts[0].description}
                  </p>
                </div>

                <ArrowRight
                  className="flex-none w-5 h-5 text-secondary-300 dark:text-secondary-600 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
}
