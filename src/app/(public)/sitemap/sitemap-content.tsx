'use client';

import Link from 'next/link';
import { useReducedMotion, motion } from 'framer-motion';
import {
  Home,
  Sparkles,
  DollarSign,
  Plug,
  MessageSquare,
  BookOpen,
  Code2,
  LayoutGrid,
  CalendarDays,
  GitCompareArrows,
  Newspaper,
  Info,
  ArrowRight,
} from 'lucide-react';

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const productLinks = [
  { label: 'Home', href: '/', description: 'Platform overview', icon: Home },
  { label: 'Features', href: '/features', description: 'All platform capabilities', icon: Sparkles },
  { label: 'Pricing', href: '/pricing', description: 'Plans and billing', icon: DollarSign },
  { label: 'Integrations', href: '/integrations', description: 'Connect your tools', icon: Plug },
  { label: 'Slack Chatbot', href: '/slack-chatbot', description: 'Deploy to Slack', icon: MessageSquare },
  { label: 'Knowledge Base Chatbot', href: '/knowledge-base-chatbot', description: 'Train on your own docs', icon: BookOpen },
  { label: 'SDK & API', href: '/sdk', description: 'Developer documentation', icon: Code2 },
  { label: 'Solutions', href: '/solutions', description: 'Chatbot use case hub', icon: LayoutGrid },
  { label: 'Chatbot Booking', href: '/chatbot-booking', description: 'In-chat calendar scheduling', icon: CalendarDays },
];

const industryGroups = [
  {
    heading: 'Healthcare & Wellness',
    links: [
      { label: 'Dentists', href: '/chatbot-for-dentists' },
      { label: 'Healthcare', href: '/chatbot-for-healthcare' },
      { label: 'Chiropractors', href: '/chatbot-for-chiropractors' },
      { label: 'Optometrists', href: '/chatbot-for-optometrists' },
      { label: 'Pharmacies', href: '/chatbot-for-pharmacies' },
      { label: 'Veterinarians', href: '/chatbot-for-veterinarians' },
      { label: 'Therapists', href: '/chatbot-for-therapists' },
      { label: 'Plastic Surgeons', href: '/chatbot-for-plastic-surgeons' },
    ],
  },
  {
    heading: 'Legal & Finance',
    links: [
      { label: 'Law Firms', href: '/chatbot-for-lawyers' },
      { label: 'Immigration Lawyers', href: '/chatbot-for-immigration-lawyers' },
      { label: 'Accountancy Firms', href: '/chatbot-for-accountancy-firms' },
      { label: 'Financial Advisors', href: '/chatbot-for-financial-advisors' },
      { label: 'Insurance Agents', href: '/chatbot-for-insurance-agents' },
      { label: 'Mortgage Brokers', href: '/chatbot-for-mortgage-brokers' },
      { label: 'Mortgage Lenders', href: '/chatbot-for-mortgage-lenders' },
    ],
  },
  {
    heading: 'Hospitality & Leisure',
    links: [
      { label: 'Restaurants', href: '/chatbot-for-restaurants' },
      { label: 'Hotels', href: '/chatbot-for-hotels' },
      { label: 'Travel Agencies', href: '/chatbot-for-travel-agencies' },
      { label: 'Gyms', href: '/chatbot-for-gyms' },
      { label: 'Fitness Studios', href: '/chatbot-for-fitness-studios' },
      { label: 'Yoga Studios', href: '/chatbot-for-yoga-studios' },
      { label: 'Personal Trainers', href: '/chatbot-for-personal-trainers' },
      { label: 'Spas', href: '/chatbot-for-spas' },
    ],
  },
  {
    heading: 'Home & Trades',
    links: [
      { label: 'Plumbers', href: '/chatbot-for-plumbers' },
      { label: 'Electricians', href: '/chatbot-for-electricians' },
      { label: 'HVAC Companies', href: '/chatbot-for-hvac' },
      { label: 'Landscapers', href: '/chatbot-for-landscapers' },
      { label: 'Cleaning Services', href: '/chatbot-for-cleaning-services' },
      { label: 'Salons', href: '/chatbot-for-salons' },
      { label: 'Pet Grooming', href: '/chatbot-for-pet-grooming' },
    ],
  },
  {
    heading: 'Automotive & Property',
    links: [
      { label: 'Car Dealerships', href: '/chatbot-for-car-dealerships' },
      { label: 'Auto Repair', href: '/chatbot-for-auto-repair' },
      { label: 'Real Estate', href: '/chatbot-for-real-estate' },
      { label: 'Property Managers', href: '/chatbot-for-property-managers' },
    ],
  },
  {
    heading: 'Events & Creative',
    links: [
      { label: 'Event Planners', href: '/chatbot-for-event-planners' },
      { label: 'Wedding Venues', href: '/chatbot-for-wedding-venues' },
      { label: 'Photography Studios', href: '/chatbot-for-photography-studios' },
    ],
  },
  {
    heading: 'Business & SaaS',
    links: [
      { label: 'SaaS Companies', href: '/chatbot-for-saas' },
      { label: 'Marketing Agencies', href: '/chatbot-for-marketing-agencies' },
      { label: 'Web Design Agencies', href: '/chatbot-for-web-design-agencies' },
      { label: 'IT Support Teams', href: '/chatbot-for-it-support' },
      { label: 'Recruiters', href: '/chatbot-for-recruiters' },
      { label: 'HR Departments', href: '/chatbot-for-hr' },
      { label: 'Customer Support', href: '/chatbot-for-customer-support' },
      { label: 'Lead Capture', href: '/chatbot-for-lead-capture' },
    ],
  },
  {
    heading: 'Commerce & Logistics',
    links: [
      { label: 'E-commerce', href: '/chatbot-for-ecommerce' },
      { label: 'Wholesale Suppliers', href: '/chatbot-for-wholesale' },
      { label: 'Manufacturers', href: '/chatbot-for-manufacturers' },
      { label: 'Logistics Companies', href: '/chatbot-for-logistics' },
    ],
  },
  {
    heading: 'Education & Non-Profit',
    links: [
      { label: 'Universities', href: '/chatbot-for-universities' },
      { label: 'Tutoring Centers', href: '/chatbot-for-tutoring-centers' },
      { label: 'Online Course Creators', href: '/chatbot-for-online-courses' },
      { label: 'Non-Profits', href: '/chatbot-for-nonprofits' },
      { label: 'Churches', href: '/chatbot-for-churches' },
      { label: 'Government Agencies', href: '/chatbot-for-government' },
    ],
  },
];

const comparisonLinks = [
  { label: 'VocUI vs Intercom', href: '/vs-intercom', description: 'Feature and pricing comparison' },
  { label: 'VocUI vs Tidio', href: '/vs-tidio', description: 'Feature and pricing comparison' },
];

const blogAlternativePosts = [
  { label: 'Top Chatbase Alternatives', href: '/blog/chatbase-alternatives' },
  { label: 'Intercom Alternatives', href: '/blog/intercom-alternatives' },
  { label: '5 Tidio Alternatives', href: '/blog/tidio-alternatives' },
  { label: '5 Freshchat Alternatives', href: '/blog/freshchat-alternatives' },
  { label: '5 Drift Alternatives', href: '/blog/drift-alternatives' },
  { label: '5 Zendesk Chat Alternatives', href: '/blog/zendesk-chat-alternatives' },
];

const blogGroups = [
  {
    heading: 'Topic Guides',
    description: 'Hub pages covering major chatbot topics end-to-end',
    links: [
      { label: 'The Complete Guide to Knowledge Base Chatbots', href: '/guides/knowledge-base-chatbot' },
      { label: 'How to Add a Chatbot to Any Website', href: '/guides/embed-chatbot' },
      { label: 'AI Chatbots for Business: Industry Guide', href: '/guides/chatbot-for-business' },
      { label: 'Best Chatbot Platform Alternatives Compared', href: '/guides/chatbot-alternatives' },
    ],
  },
  {
    heading: 'How-To Guides',
    description: 'Step-by-step instructions for building and deploying chatbots',
    links: [
      { label: 'How to Add a Chatbot to Your Website', href: '/blog/how-to-add-chatbot-to-website' },
      { label: 'How to Train a Chatbot on Your Own Data', href: '/blog/how-to-train-chatbot-on-your-own-data' },
      { label: 'How to Create an FAQ Chatbot in Minutes', href: '/blog/how-to-create-faq-chatbot' },
      { label: 'How to Build an Internal Knowledge Bot', href: '/blog/how-to-build-internal-knowledge-bot' },
      { label: 'How to Embed a Chatbot in WordPress', href: '/blog/how-to-embed-chatbot-in-wordpress' },
      { label: 'How to Embed a Chatbot in Shopify', href: '/blog/how-to-embed-chatbot-in-shopify' },
      { label: 'How to Embed a Chatbot in Squarespace', href: '/blog/how-to-embed-chatbot-in-squarespace' },
      { label: 'How to Embed a Chatbot in Wix', href: '/blog/how-to-embed-chatbot-in-wix' },
      { label: 'How to Write a Chatbot System Prompt', href: '/blog/how-to-write-chatbot-system-prompt' },
      { label: 'How to Set Up a Slack Chatbot for Your Team', href: '/blog/how-to-set-up-slack-chatbot-for-team' },
      { label: 'How to Measure Chatbot ROI', href: '/blog/how-to-measure-chatbot-roi' },
      { label: "How to Improve Your Chatbot's Answer Accuracy", href: '/blog/how-to-improve-chatbot-accuracy' },
      { label: 'How to Reduce Customer Support Tickets with AI', href: '/blog/how-to-reduce-customer-support-tickets' },
    ],
  },
  {
    heading: 'What Is / Explainers',
    description: 'Plain-language explanations of AI and chatbot technology',
    links: [
      { label: 'What Is a Knowledge Base Chatbot?', href: '/blog/what-is-a-knowledge-base-chatbot' },
      { label: 'What Is RAG? Retrieval-Augmented Generation Explained', href: '/blog/what-is-rag-retrieval-augmented-generation' },
      { label: 'What Are Embeddings? A Simple Explanation', href: '/blog/what-are-embeddings-explained-simply' },
      { label: 'What Is a Chatbot Widget and How Does It Work?', href: '/blog/what-is-a-chatbot-widget' },
      { label: "What Is Conversational AI? A Beginner's Guide", href: '/blog/what-is-conversational-ai' },
      { label: 'What Is Vector Search? How AI Chatbots Find Answers', href: '/blog/what-is-vector-search' },
      { label: 'AI Hallucination: What It Is and How to Prevent It', href: '/blog/ai-hallucination-what-it-is-how-to-prevent-it' },
      { label: "Chatbot vs Virtual Assistant: What's the Difference?", href: '/blog/chatbot-vs-virtual-assistant' },
      { label: 'How AI Chatbots Understand Your Questions', href: '/blog/how-ai-chatbots-understand-questions' },
      { label: 'What Is Prompt Engineering?', href: '/blog/what-is-prompt-engineering' },
      { label: 'What Is a System Prompt?', href: '/blog/what-is-a-system-prompt' },
    ],
  },
  {
    heading: 'Strategy, Analytics & ROI',
    description: 'Business cases, metrics, and growth tactics for chatbots',
    links: [
      { label: 'AI Chatbot vs Live Chat: Which Is Right for Your Business?', href: '/blog/ai-chatbot-vs-live-chat' },
      { label: '7 Chatbot Lead Generation Strategies That Work', href: '/blog/chatbot-lead-generation-strategies' },
      { label: 'How Chatbots Improve Website Conversion Rates', href: '/blog/chatbot-conversion-rate-optimization' },
      { label: 'The Hidden Cost of Customer Support Without AI', href: '/blog/cost-of-customer-support-without-ai' },
      { label: 'Why Your Business Needs an After-Hours AI Chatbot', href: '/blog/ai-chatbot-for-after-hours-support' },
      { label: '15 AI Customer Service Statistics Every Business Should Know', href: '/blog/ai-customer-service-statistics' },
      { label: 'The Small Business Guide to AI Automation', href: '/blog/small-business-ai-automation-guide' },
      { label: 'Reduce Employee Onboarding Time with an AI Knowledge Bot', href: '/blog/reduce-employee-onboarding-time-with-ai' },
    ],
  },
  {
    heading: 'Best Practices',
    description: 'Proven approaches to designing, managing, and improving chatbots',
    links: [
      { label: 'Chatbot Best Practices for Small Business Owners', href: '/blog/chatbot-best-practices-for-small-business' },
      { label: 'How to Organize Your Knowledge Base for Better Chatbot Answers', href: '/blog/knowledge-base-content-best-practices' },
      { label: 'How to Choose the Right Personality and Tone for Your Chatbot', href: '/blog/chatbot-personality-and-tone-guide' },
      { label: 'Chatbot Security and Privacy: What Business Owners Need to Know', href: '/blog/chatbot-security-and-privacy-guide' },
      { label: 'Chatbot Analytics: What to Track and Why It Matters', href: '/blog/chatbot-analytics-what-to-track' },
    ],
  },
  {
    heading: 'Industry Use Cases',
    description: 'Real-world chatbot applications by industry',
    links: [
      { label: 'How SaaS Companies Use Chatbots to Improve Onboarding', href: '/blog/chatbot-for-saas-onboarding' },
      { label: 'AI Chatbots for Restaurants', href: '/blog/chatbot-for-restaurants' },
      { label: 'AI Chatbots for Education', href: '/blog/chatbot-for-education' },
      { label: 'AI Chatbots for Financial Services', href: '/blog/chatbot-for-financial-services' },
      { label: 'How Recruiters Use AI Chatbots to Screen Candidates Faster', href: '/blog/chatbot-for-recruitment' },
      { label: 'AI Chatbot for Real Estate', href: '/blog/chatbot-for-real-estate' },
      { label: 'AI Chatbot for Healthcare', href: '/blog/chatbot-for-healthcare' },
      { label: 'AI Chatbot for HR Teams', href: '/blog/chatbot-for-hr' },
      { label: 'AI Chatbot for Plumbers', href: '/blog/chatbot-for-plumbers' },
      { label: 'AI Chatbot for Ecommerce', href: '/blog/chatbot-for-ecommerce' },
      { label: 'AI Chatbot for Hotels', href: '/blog/chatbot-for-hotels' },
      { label: 'AI Chatbots for Nonprofits', href: '/blog/chatbot-for-nonprofits' },
      { label: 'AI Chatbots for Insurance', href: '/blog/chatbot-for-insurance' },
      { label: 'AI Chatbots for Travel Agencies', href: '/blog/chatbot-for-travel-agencies' },
      { label: 'AI Chatbots for Gyms and Fitness Studios', href: '/blog/chatbot-for-fitness-studios' },
      { label: 'AI Chatbots for Accounting Firms', href: '/blog/chatbot-for-accounting-firms' },
    ],
  },
];

const companyLinks = [
  { label: 'About', href: '/about', description: 'Who we are and why we built VocUI' },
  { label: 'Contact', href: '/contact', description: 'Get in touch with our team' },
  { label: 'Changelog', href: '/changelog', description: 'Recent product updates' },
  { label: 'FAQ', href: '/faq', description: 'Frequently asked questions' },
  { label: 'Help Center', href: '/help', description: 'Support and documentation' },
  { label: 'Security', href: '/security', description: 'Data handling and compliance' },
  { label: 'Documentation', href: '/wiki', description: 'Guides and tutorials' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy', description: 'How we handle your data' },
  { label: 'Terms of Service', href: '/terms', description: 'Rules governing use of VocUI' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500 mb-1">
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 mb-2">
      {children}
    </h2>
  );
}

function SectionSubtext({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base text-secondary-600 dark:text-secondary-400 leading-relaxed">
      {children}
    </p>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function SitemapContent() {
  const prefersReduced = useReducedMotion();

  return (
    <main id="main-content" className="relative z-[2]">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-20 max-w-5xl">
        <motion.div
          initial={prefersReduced ? false : 'hidden'}
          animate="visible"
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500 mb-6">
            Every page on vocui.com
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.06] mb-6"
          >
            Sitemap
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-secondary-600 dark:text-secondary-400 max-w-xl leading-relaxed"
          >
            Browse all product pages, industry solutions, comparisons, blog articles, and company information.
          </motion.p>

          {/* Quick-jump nav */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-2 mt-10"
          >
            {[
              { label: 'Product', href: '#product' },
              { label: 'Industries', href: '#industries' },
              { label: 'Compare', href: '#compare' },
              { label: 'Blog', href: '#blog' },
              { label: 'Company', href: '#company' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-full hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                {item.label}
                <ArrowRight className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Product ─────────────────────────────────────────────────────── */}
      <section id="product" className="w-full bg-secondary-50 dark:bg-secondary-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 max-w-5xl">
          <div className="mb-10">
            <SectionLabel>Platform</SectionLabel>
            <SectionHeading>Product</SectionHeading>
            <SectionSubtext>The core VocUI platform — features, pricing, integrations, and developer tools.</SectionSubtext>
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={prefersReduced ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {productLinks.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.href} variants={fadeUp}>
                  <Link
                    href={item.href}
                    className="group flex items-start gap-3 p-4 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-sm hover:border-primary-400 dark:hover:border-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <span className="mt-0.5 flex-shrink-0 text-primary-500">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {item.label}
                      </span>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Industries ──────────────────────────────────────────────────── */}
      <section id="industries" className="w-full bg-primary-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-5xl">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400 mb-1">
              Use Cases
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2">
              Industries
            </h2>
            <p className="text-base text-primary-200/70 leading-relaxed max-w-lg">
              AI chatbot solutions built for specific industries and business types — 55 dedicated pages.
            </p>
            <Link
              href="/industries"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              Browse all industries
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10"
            initial={prefersReduced ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {industryGroups.map((group) => (
              <motion.div key={group.heading} variants={fadeUp}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-3 pb-2 border-b border-primary-800">
                  {group.heading}
                </h3>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-primary-100/80 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Comparisons ─────────────────────────────────────────────────── */}
      <section id="compare" className="w-full bg-secondary-50 dark:bg-secondary-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 max-w-5xl">
          <div className="mb-10">
            <SectionLabel>Comparisons</SectionLabel>
            <SectionHeading>VocUI vs the Alternatives</SectionHeading>
            <SectionSubtext>Side-by-side comparisons with leading chatbot platforms, plus independent blog writeups.</SectionSubtext>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary-500 dark:text-secondary-400 mb-4">
                Comparison Pages
              </h3>
              <ul className="space-y-3">
                {comparisonLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex flex-col gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <GitCompareArrows className="h-3.5 w-3.5 text-primary-500 flex-shrink-0" aria-hidden="true" />
                        {link.label}
                      </span>
                      <span className="pl-[22px] text-xs text-secondary-500 dark:text-secondary-400">
                        {link.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary-500 dark:text-secondary-400 mb-4">
                Alternatives Articles
              </h3>
              <ul className="space-y-2.5">
                {blogAlternativePosts.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog ────────────────────────────────────────────────────────── */}
      <section id="blog" className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-5xl">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <SectionLabel>Resources</SectionLabel>
              <SectionHeading>Blog</SectionHeading>
              <SectionSubtext>
                Guides, explainers, industry use cases, and strategy articles — 65+ posts.
              </SectionSubtext>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-700 rounded-sm hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 flex-shrink-0 self-start sm:self-auto"
            >
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              Browse all posts
            </Link>
          </div>

          <div className="space-y-12">
            {blogGroups.map((group, groupIdx) => (
              <motion.div
                key={group.heading}
                initial={prefersReduced ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
              >
                {/* Group header */}
                <div className="flex items-baseline gap-4 mb-5">
                  <h3 className="text-base font-bold text-secondary-900 dark:text-secondary-100 whitespace-nowrap">
                    {group.heading}
                  </h3>
                  <span className="hidden sm:block flex-1 h-px bg-secondary-200 dark:bg-secondary-700" />
                  <span className="hidden sm:block text-xs text-secondary-400 dark:text-secondary-500 whitespace-nowrap">
                    {group.description}
                  </span>
                </div>

                {/* Links grid */}
                <ul
                  className={`grid grid-cols-1 sm:grid-cols-2 ${group.links.length > 8 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-x-8 gap-y-2.5`}
                >
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-start gap-1.5 text-sm text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded leading-snug"
                      >
                        <span className="mt-[5px] flex-shrink-0 w-1 h-1 rounded-full bg-primary-400 group-hover:bg-primary-500 transition-colors" aria-hidden="true" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {groupIdx < blogGroups.length - 1 && (
                  <div className="mt-10 h-px bg-secondary-100 dark:bg-secondary-800" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company & Legal ─────────────────────────────────────────────── */}
      <section id="company" className="w-full bg-secondary-50 dark:bg-secondary-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 max-w-5xl">
          <div className="mb-10">
            <SectionLabel>VocUI</SectionLabel>
            <SectionHeading>Company</SectionHeading>
            <SectionSubtext>About us, support resources, and legal documentation.</SectionSubtext>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary-500 dark:text-secondary-400 mb-4 flex items-center gap-2">
                <Info className="h-3.5 w-3.5" aria-hidden="true" />
                Company & Resources
              </h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex flex-col gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    >
                      <span className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {link.label}
                      </span>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        {link.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary-500 dark:text-secondary-400 mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex flex-col gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    >
                      <span className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {link.label}
                      </span>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        {link.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
