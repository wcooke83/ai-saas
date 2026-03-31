import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { ArrowRight } from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Blog | VocUI',
  description:
    'Tips, guides, and strategies for small businesses using AI chatbots.',
  openGraph: {
    title: 'Blog | VocUI',
    description: 'Tips, guides, and strategies for small businesses using AI chatbots.',
    url: 'https://vocui.com/blog',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | VocUI',
    description: 'Tips, guides, and strategies for small businesses using AI chatbots.',
  },
  alternates: { canonical: 'https://vocui.com/blog' },
  robots: { index: true, follow: true },
};

// ─── Posts ─────────────────────────────────────────────────────────────────────

const posts = [
  // ─── Original Posts ───────────────────────────────────────────────────────────
  {
    slug: 'how-to-add-chatbot-to-website',
    title: 'How to Add a Chatbot to Your Website (No Coding Required)',
    description: 'Learn how to add a chatbot to your website in minutes — no coding required. Train it on your content, embed one script tag, and go live today.',
    readTime: '7 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-train-chatbot-on-your-own-data',
    title: 'How to Train a Chatbot on Your Own Data',
    description: 'Train an AI chatbot on your own PDFs, URLs, and documents — no ML experience needed. Step-by-step guide to building a knowledge base chatbot with VocUI.',
    readTime: '9 min read',
    tag: 'Guide',
  },
  {
    slug: 'chatbase-alternatives',
    title: '5 Chatbase Alternatives Worth Trying in 2025',
    description: 'Looking for a Chatbase alternative? Compare the top AI chatbot builders on pricing, knowledge base support, Slack integration, and embed options.',
    readTime: '11 min read',
    tag: 'Comparison',
  },
  {
    slug: 'how-to-reduce-customer-support-tickets',
    title: 'How to Reduce Customer Support Tickets with AI',
    description: 'Cut support ticket volume by up to 40% with an AI chatbot that answers questions instantly from your knowledge base — no agent intervention needed.',
    readTime: '9 min read',
    tag: 'Strategy',
  },
  {
    slug: 'what-is-a-knowledge-base-chatbot',
    title: 'What Is a Knowledge Base Chatbot?',
    description: 'A knowledge base chatbot is an AI trained on your own documents, URLs, or PDFs to answer questions instantly. Learn how it works and when to use one.',
    readTime: '7 min read',
    tag: 'Explainer',
  },
  // ─── Batch 1: How-To Guides ──────────────────────────────────────────────────
  {
    slug: 'how-to-create-faq-chatbot',
    title: 'How to Create an FAQ Chatbot in Minutes',
    description: 'Learn how to create an FAQ chatbot that answers common customer questions instantly. No coding required — just upload your FAQs and go live.',
    readTime: '6 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-build-internal-knowledge-bot',
    title: 'How to Build an Internal Knowledge Bot for Your Team',
    description: 'Build an internal knowledge bot that lets your team find answers to HR, policy, and process questions instantly — deployed in Slack or on your intranet.',
    readTime: '8 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-embed-chatbot-in-wordpress',
    title: 'How to Embed a Chatbot in WordPress',
    description: 'Add an AI chatbot to your WordPress site in under 5 minutes. Copy one script tag, paste it into your theme, and start answering visitor questions automatically.',
    readTime: '6 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-embed-chatbot-in-shopify',
    title: 'How to Embed a Chatbot in Shopify',
    description: 'Add an AI chatbot to your Shopify store to answer product questions, shipping inquiries, and return policies — no app install required.',
    readTime: '6 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-write-chatbot-system-prompt',
    title: 'How to Write a Chatbot System Prompt That Actually Works',
    description: "Your chatbot's system prompt controls its personality, accuracy, and boundaries. Learn how to write one that keeps responses helpful, on-brand, and hallucination-free.",
    readTime: '8 min read',
    tag: 'Guide',
  },
  // ─── Batch 2: How-To Guides + Setup ──────────────────────────────────────────
  {
    slug: 'how-to-embed-chatbot-in-squarespace',
    title: 'How to Embed a Chatbot in Squarespace',
    description: 'Add an AI chatbot to your Squarespace website using a simple code injection. No plugins needed — just paste one script and go live.',
    readTime: '6 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-embed-chatbot-in-wix',
    title: 'How to Embed a Chatbot in Wix',
    description: "Embed an AI chatbot on your Wix website in minutes. Use Wix's custom code feature to add a single script tag and start answering questions automatically.",
    readTime: '6 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-measure-chatbot-roi',
    title: 'How to Measure Chatbot ROI for Your Business',
    description: 'Learn how to calculate the return on investment of your AI chatbot — from support ticket deflection to lead conversion and time saved.',
    readTime: '9 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-improve-chatbot-accuracy',
    title: "How to Improve Your Chatbot's Answer Accuracy",
    description: 'Getting vague or wrong answers from your chatbot? Here are practical steps to improve accuracy — from better knowledge sources to smarter system prompts.',
    readTime: '8 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-set-up-slack-chatbot-for-team',
    title: 'How to Set Up a Slack Chatbot for Your Team',
    description: 'Deploy an AI chatbot in Slack that answers team questions from your internal docs, HR policies, and SOPs. Set up takes under 30 minutes.',
    readTime: '7 min read',
    tag: 'Guide',
  },
  // ─── Batch 3: Industry Use Cases ─────────────────────────────────────────────
  {
    slug: 'chatbot-for-saas-onboarding',
    title: 'How SaaS Companies Use Chatbots to Improve Onboarding',
    description: 'SaaS companies use AI chatbots to guide new users through onboarding, answer setup questions, and reduce time-to-value.',
    readTime: '8 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-restaurants',
    title: 'AI Chatbots for Restaurants: Answer Menus, Hours, and Reservations',
    description: 'AI chatbots help restaurants answer questions about menus, hours, reservations, and dietary options — without tying up staff on the phone.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-education',
    title: 'AI Chatbots for Education: Automate Student FAQs',
    description: 'Universities and online course platforms use AI chatbots to answer student questions about enrollment, deadlines, and course content around the clock.',
    readTime: '8 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-financial-services',
    title: 'AI Chatbots for Financial Services and Advisors',
    description: 'Financial advisors and service firms use AI chatbots to answer client questions about services, fees, and processes — while staying compliant.',
    readTime: '8 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-recruitment',
    title: 'How Recruiters Use AI Chatbots to Screen Candidates Faster',
    description: 'Recruitment teams use AI chatbots to answer candidate questions, pre-screen applicants, and reduce time-to-hire — without adding headcount.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  // ─── Batch 4: Industry Use Cases ─────────────────────────────────────────────
  {
    slug: 'chatbot-for-nonprofits',
    title: 'AI Chatbots for Nonprofits: Engage Donors and Volunteers',
    description: 'Nonprofits use AI chatbots to answer donor questions, recruit volunteers, and share program info — without stretching limited staff resources.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-insurance',
    title: 'AI Chatbots for Insurance: Automate Policy Questions',
    description: 'Insurance agencies use AI chatbots to answer policy questions, explain coverage options, and qualify leads — reducing call volume and improving response time.',
    readTime: '8 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-travel-agencies',
    title: 'AI Chatbots for Travel Agencies: Answer Booking Questions 24/7',
    description: 'Travel agencies use AI chatbots to answer destination questions, explain packages, and capture leads around the clock — even outside business hours.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-fitness-studios',
    title: 'AI Chatbots for Gyms and Fitness Studios',
    description: 'Gyms and fitness studios use AI chatbots to answer membership questions, share class schedules, and convert website visitors into members.',
    readTime: '6 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-accounting-firms',
    title: 'AI Chatbots for Accounting Firms: Client Self-Service',
    description: 'Accounting firms use AI chatbots to answer client questions about services, deadlines, and document requirements — freeing up billable hours.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  // ─── Batch 5: Strategy & Business Value ──────────────────────────────────────
  {
    slug: 'ai-chatbot-vs-live-chat',
    title: 'AI Chatbot vs Live Chat: Which Is Right for Your Business?',
    description: 'Comparing AI chatbots and live chat: cost, availability, scalability, and customer satisfaction. Learn which is right for your business — or when to use both.',
    readTime: '9 min read',
    tag: 'Strategy',
  },
  {
    slug: 'chatbot-lead-generation-strategies',
    title: '7 Chatbot Lead Generation Strategies That Work',
    description: 'Seven proven strategies for using AI chatbots to capture leads, qualify prospects, and fill your sales pipeline — without cold calls or forms.',
    readTime: '10 min read',
    tag: 'Strategy',
  },
  {
    slug: 'reduce-employee-onboarding-time-with-ai',
    title: 'Reduce Employee Onboarding Time with an AI Knowledge Bot',
    description: 'New hires ask the same questions every time. An AI knowledge bot trained on your internal docs cuts onboarding time and frees up managers.',
    readTime: '8 min read',
    tag: 'Strategy',
  },
  {
    slug: 'ai-customer-service-statistics',
    title: '15 AI Customer Service Statistics Every Business Should Know',
    description: 'Key statistics on AI in customer service: adoption rates, cost savings, customer preferences, and ROI. Data-driven reasons to add an AI chatbot.',
    readTime: '8 min read',
    tag: 'Strategy',
  },
  {
    slug: 'small-business-ai-automation-guide',
    title: 'The Small Business Guide to AI Automation in 2025',
    description: 'A practical guide to AI automation for small businesses — what to automate first, which tools to use, and how to start without technical skills or a big budget.',
    readTime: '10 min read',
    tag: 'Strategy',
  },
  // ─── Batch 6: Strategy & Business Value ──────────────────────────────────────
  {
    slug: 'chatbot-conversion-rate-optimization',
    title: 'How Chatbots Improve Website Conversion Rates',
    description: 'AI chatbots improve website conversion rates by engaging visitors, answering objections in real time, and guiding prospects toward action.',
    readTime: '8 min read',
    tag: 'Strategy',
  },
  {
    slug: 'cost-of-customer-support-without-ai',
    title: 'The Hidden Cost of Customer Support Without AI',
    description: 'Manual customer support costs more than you think. Calculate the hidden expenses of answering the same questions without AI — and what automation saves.',
    readTime: '7 min read',
    tag: 'Strategy',
  },
  {
    slug: 'ai-chatbot-for-after-hours-support',
    title: 'Why Your Business Needs an After-Hours AI Chatbot',
    description: 'Most customer questions happen outside business hours. An AI chatbot answers them instantly — so you never lose a lead or leave a customer waiting.',
    readTime: '7 min read',
    tag: 'Strategy',
  },
  // ─── Batch 7: Explainers ─────────────────────────────────────────────────────
  {
    slug: 'what-is-rag-retrieval-augmented-generation',
    title: 'What Is RAG? Retrieval-Augmented Generation Explained',
    description: 'RAG (Retrieval-Augmented Generation) is the technique behind knowledge base chatbots. Learn how it works, why it matters, and how it reduces hallucinations.',
    readTime: '9 min read',
    tag: 'Explainer',
  },
  {
    slug: 'what-are-embeddings-explained-simply',
    title: 'What Are Embeddings? A Simple Explanation',
    description: 'Embeddings turn text into numbers that capture meaning. Learn how AI chatbots use embeddings to find relevant answers — explained without jargon.',
    readTime: '7 min read',
    tag: 'Explainer',
  },
  {
    slug: 'what-is-a-chatbot-widget',
    title: 'What Is a Chatbot Widget and How Does It Work?',
    description: 'A chatbot widget is a small chat interface embedded on your website. Learn how it works, what it looks like, and how to add one to your site.',
    readTime: '6 min read',
    tag: 'Explainer',
  },
  {
    slug: 'what-is-conversational-ai',
    title: "What Is Conversational AI? A Beginner's Guide",
    description: 'Conversational AI lets machines understand and respond to human language naturally. Learn what it is, how it works, and how businesses use it today.',
    readTime: '8 min read',
    tag: 'Explainer',
  },
  // ─── Batch 8: Explainers + Technical ─────────────────────────────────────────
  {
    slug: 'what-is-vector-search',
    title: 'What Is Vector Search? How AI Chatbots Find Answers',
    description: 'Vector search finds content by meaning, not keywords. Learn how AI chatbots use vector search to find the most relevant answers from your knowledge base.',
    readTime: '8 min read',
    tag: 'Explainer',
  },
  {
    slug: 'ai-hallucination-what-it-is-how-to-prevent-it',
    title: 'AI Hallucination: What It Is and How to Prevent It',
    description: 'AI hallucination is when a chatbot generates confident but incorrect answers. Learn why it happens and how to prevent it in your business chatbot.',
    readTime: '8 min read',
    tag: 'Explainer',
  },
  {
    slug: 'chatbot-vs-virtual-assistant',
    title: "Chatbot vs Virtual Assistant: What's the Difference?",
    description: 'Chatbots and virtual assistants are often confused. Learn the key differences — from scope and intelligence to cost and use cases — and which one your business needs.',
    readTime: '7 min read',
    tag: 'Explainer',
  },
  {
    slug: 'how-ai-chatbots-understand-questions',
    title: 'How AI Chatbots Understand Your Questions',
    description: 'AI chatbots don\'t just match keywords — they understand meaning. Learn how NLP, embeddings, and LLMs work together to interpret questions.',
    readTime: '7 min read',
    tag: 'Explainer',
  },
  {
    slug: 'what-is-prompt-engineering',
    title: 'What Is Prompt Engineering? A Practical Introduction',
    description: 'Prompt engineering is the art of writing instructions that get better results from AI. Learn the basics and how to apply them to your business chatbot.',
    readTime: '8 min read',
    tag: 'Explainer',
  },
  // ─── Batch 9: Comparisons & Alternatives ─────────────────────────────────────
  {
    slug: 'tidio-alternatives',
    title: '5 Tidio Alternatives for AI-Powered Customer Chat',
    description: 'Looking for a Tidio alternative? Compare five AI-powered chat platforms on pricing, knowledge base support, and ease of use for small businesses.',
    readTime: '10 min read',
    tag: 'Comparison',
  },
  {
    slug: 'intercom-alternatives',
    title: "5 Intercom Alternatives That Won't Break the Budget",
    description: 'Intercom is powerful but expensive. Here are five affordable alternatives with AI chatbot features, knowledge base support, and simple setup.',
    readTime: '10 min read',
    tag: 'Comparison',
  },
  {
    slug: 'drift-alternatives',
    title: '5 Drift Alternatives for Conversational Marketing',
    description: "Drift changed the conversational marketing game, but it's not the only option. Compare five alternatives for lead capture, chat, and AI-powered conversations.",
    readTime: '10 min read',
    tag: 'Comparison',
  },
  {
    slug: 'zendesk-chat-alternatives',
    title: '5 Zendesk Chat Alternatives Worth Considering',
    description: 'Zendesk Chat is reliable but complex and costly. Here are five simpler alternatives with AI chatbot features and better pricing for small businesses.',
    readTime: '10 min read',
    tag: 'Comparison',
  },
  {
    slug: 'freshchat-alternatives',
    title: '5 Freshchat Alternatives for Small Business Support',
    description: 'Freshchat works best within the Freshworks ecosystem. If you need a standalone AI chat solution, here are five alternatives to consider.',
    readTime: '10 min read',
    tag: 'Comparison',
  },
  // ─── Batch 10: Best Practices ────────────────────────────────────────────────
  {
    slug: 'chatbot-best-practices-for-small-business',
    title: 'Chatbot Best Practices for Small Business Owners',
    description: 'Nine practical chatbot best practices for small businesses — from knowledge base setup to system prompts, testing, and ongoing optimization.',
    readTime: '9 min read',
    tag: 'Best Practice',
  },
  {
    slug: 'knowledge-base-content-best-practices',
    title: 'How to Organize Your Knowledge Base for Better Chatbot Answers',
    description: 'The quality of your chatbot answers depends on how you organize your knowledge base. Learn how to structure content for accurate, relevant responses.',
    readTime: '8 min read',
    tag: 'Best Practice',
  },
  {
    slug: 'chatbot-personality-and-tone-guide',
    title: 'How to Choose the Right Personality and Tone for Your Chatbot',
    description: 'Your chatbot\'s personality affects how customers perceive your brand. Learn how to define the right tone — professional, friendly, or somewhere in between.',
    readTime: '7 min read',
    tag: 'Best Practice',
  },
  {
    slug: 'chatbot-security-and-privacy-guide',
    title: 'Chatbot Security and Privacy: What Business Owners Need to Know',
    description: 'Understand the security and privacy considerations for business chatbots — data storage, encryption, compliance, and what to ask your chatbot provider.',
    readTime: '8 min read',
    tag: 'Best Practice',
  },
  {
    slug: 'chatbot-analytics-what-to-track',
    title: 'Chatbot Analytics: What to Track and Why It Matters',
    description: 'Track the right chatbot metrics to improve performance. Learn which analytics matter — from conversation volume and deflection rate to satisfaction and conversion.',
    readTime: '8 min read',
    tag: 'Best Practice',
  },
];

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'VocUI Blog',
  description: 'Tips, guides, and strategies for small businesses using AI chatbots.',
  url: 'https://vocui.com/blog',
  itemListElement: posts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `https://vocui.com/blog/${post.slug}`,
    name: post.title,
  })),
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function BlogIndexPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content" className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
            <li>
              <Link href="/" className="hover:text-primary-500 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">Blog</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-14">
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            VocUI Blog
          </h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-400">
            Practical guides for small business owners building AI chatbots — no technical background required.
          </p>
        </div>

        {/* Post list */}
        <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
          {posts.map((post) => (
            <article key={post.slug} className="py-8 group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    {post.tag}
                  </span>
                  <span className="text-xs text-secondary-400 dark:text-secondary-500">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-3">
                  {post.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 gap-1 group-hover:gap-2 transition-all">
                  Read article
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
