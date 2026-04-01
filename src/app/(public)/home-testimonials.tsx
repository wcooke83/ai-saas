'use client';

import { Star, Building2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const testimonials = [
  {
    quote: "We deployed a chatbot trained on our knowledge base in under an hour. It now handles about 70% of support inquiries on its own — without us touching it.",
    author: "J.D.",
    role: "Marketing Director",
    company: "E-commerce brand",
    initials: "JD",
    gradient: "from-primary-400 to-primary-600",
  },
  {
    quote: "Response times went from hours to seconds after we embedded VocUI on our site. Our support team finally has time for the issues that actually need a human.",
    author: "S.C.",
    role: "VP of Customer Success",
    company: "B2B SaaS company",
    initials: "SC",
    gradient: "from-emerald-400 to-emerald-600",
  },
  {
    quote: "I trained it on our docs and FAQs in about 20 minutes. It answers questions more consistently than I did. The Slack integration alone is worth it.",
    author: "M.T.",
    role: "Founder",
    company: "Digital agency",
    initials: "MT",
    gradient: "from-violet-400 to-violet-600",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

export function HomeTestimonials() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-primary-950 py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-6"
          >
            What users say
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-light text-primary-100 leading-relaxed max-w-3xl"
          >
            From solo founders to support teams at scale — VocUI handles the conversation so you don&apos;t have to.
          </motion.p>
        </motion.div>

        {/* Testimonial cards */}
        <motion.div
          className="grid gap-6 md:grid-cols-3"
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.author}
              variants={fadeUp}
              className="bg-primary-900/40 border border-primary-800/30 rounded-xl p-6"
            >
              <div className="flex items-center gap-1 mb-4" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="text-primary-100/80 mb-6 text-sm leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${t.gradient} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <cite className="not-italic">
                    <strong className="text-sm text-primary-100 block">{t.author}</strong>
                    <span className="text-xs text-primary-300">{t.role}</span>
                  </cite>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-primary-400/60" aria-hidden="true" />
                    <span className="text-xs text-primary-300/60">{t.company}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
