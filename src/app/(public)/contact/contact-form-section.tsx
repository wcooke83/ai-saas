'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Clock, Shield } from 'lucide-react';
import { HelpForm } from '../help/help-form';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const infoRows = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@vocui.com',
    href: 'mailto:support@vocui.com',
  },
  {
    icon: Clock,
    label: 'Response time',
    value: 'Within one business day',
  },
  {
    icon: Shield,
    label: 'Enterprise & DPA',
    value: 'Mention it in your message',
  },
];

export function ContactFormSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-secondary-900 py-20 lg:py-28 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left: context panel — 5 cols */}
          <motion.div
            className="lg:col-span-5"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-5"
            >
              Reach out
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
            >
              We&apos;d love to hear
              <br />
              from you.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-base text-secondary-400 leading-relaxed mb-10"
            >
              Whether you&apos;re evaluating VocUI, running into a snag, or exploring enterprise
              options — drop us a line and we&apos;ll get back to you quickly.
            </motion.p>

            {/* Info rows */}
            <motion.div variants={stagger} className="space-y-5">
              {infoRows.map(({ icon: Icon, label, value, href }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="flex items-start gap-4"
                >
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: 'rgba(14, 165, 233, 0.12)' }}
                  >
                    <Icon className="h-4 w-4 text-primary-400" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-secondary-500 mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm text-primary-400 hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-secondary-300">{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: form — 7 cols */}
          <motion.div
            className="lg:col-span-7"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <div className="bg-primary-950/60 border border-primary-800/30 rounded-xl p-8 text-secondary-100">
              <HelpForm />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
