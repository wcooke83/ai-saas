'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function AboutCta() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full py-24 lg:py-32 overflow-hidden" style={{
      background: 'linear-gradient(135deg, rgb(2,132,199) 0%, rgb(3,105,161) 40%, rgb(8,47,73) 100%)',
    }}>
      {/* Decorative rings */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 50%, rgba(14,165,233,0.15) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(14,165,233,0.08) 0%, transparent 50%)',
        }}
      />

      <motion.div
        className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial={prefersReducedMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <motion.p
          variants={fadeUp}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300 mb-6"
        >
          Get started
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 max-w-2xl mx-auto"
        >
          See what VocUI can do for your business
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-lg text-white/70 mb-10 max-w-xl mx-auto"
        >
          Build a chatbot trained on your own content and deploy it today. Free plan, no credit card
          required.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="xl"
            variant="secondary"
            className="bg-white text-primary-700 hover:bg-primary-50 font-semibold shadow-lg shadow-primary-950/30"
            asChild
          >
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button size="xl" variant="outline-light" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
