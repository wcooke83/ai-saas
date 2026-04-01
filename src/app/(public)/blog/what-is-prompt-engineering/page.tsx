import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { StyledBulletList } from '@/components/blog/styled-lists';
import { VOCUI_AUTHOR } from '@/lib/seo/jsonld-utils';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'What Is Prompt Engineering? A Practical Introduction | VocUI',
  description:
    'Prompt engineering is the art of writing instructions that get better results from AI. Learn the basics and how to apply them to your business chatbot.',
  openGraph: {
    title: 'What Is Prompt Engineering? A Practical Introduction | VocUI',
    description:
      'Prompt engineering is the art of writing instructions that get better results from AI. Learn the basics and how to apply them to your business chatbot.',
    url: 'https://vocui.com/blog/what-is-prompt-engineering',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is Prompt Engineering? A Practical Introduction | VocUI',
    description:
      'Prompt engineering is the art of writing instructions that get better results from AI. Learn the basics and how to apply them to your business chatbot.',
  },
  alternates: { canonical: 'https://vocui.com/blog/what-is-prompt-engineering' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'What Is Prompt Engineering? A Practical Introduction',
      description:
        'Prompt engineering is the art of writing instructions that get better results from AI. Learn the basics and how to apply them to your business chatbot.',
      url: 'https://vocui.com/blog/what-is-prompt-engineering',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/what-is-prompt-engineering',
      },
      datePublished: '2025-11-19',
      dateModified: '2026-04-01',
      author: VOCUI_AUTHOR,
      publisher: {
        '@type': 'Organization',
        name: 'VocUI',
        url: 'https://vocui.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://vocui.com/icon.png',
        },
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://vocui.com/blog/what-is-prompt-engineering/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is prompt engineering?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Prompt engineering is the practice of writing and refining the instructions you give to an AI model to get better, more consistent results. It applies to any interaction with a large language model — from one-off questions to the system prompts that define how a chatbot behaves. Good prompt engineering produces more accurate, relevant, and appropriately scoped responses.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to be a developer to do prompt engineering?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Prompt engineering is about writing clear instructions in plain language, not writing code. If you can write a clear email explaining what you need, you can write effective prompts. The skill is about being specific, providing context, and stating constraints clearly — all communication skills, not programming skills.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does prompt engineering affect my chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Your chatbot\'s system prompt is the most direct way prompt engineering affects your chatbot. It controls the tone, scope, behavior boundaries, and fallback responses. A well-engineered system prompt produces a chatbot that stays on topic, answers accurately from your knowledge base, declines questions it shouldn\'t answer, and maintains a consistent voice. A poorly written one leads to off-topic responses, hallucinations, and inconsistent behavior.',
          },
        },
        {
          '@type': 'Question',
          name: 'What\u0027s the difference between a prompt and a system prompt?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A prompt is any instruction or question you give to an AI model. A system prompt is a special prompt that runs before every user interaction — it sets the chatbot\'s identity, behavior rules, and constraints. Think of a prompt as a single question and a system prompt as the job description that shapes how the chatbot answers all questions. In VocUI, you configure the system prompt in your chatbot settings and it applies to every conversation.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I hire someone to do prompt engineering for me?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, prompt engineering consulting is a growing field. However, for most business chatbot use cases, you can get excellent results on your own with basic principles: be specific about what the chatbot should and shouldn\'t do, define the tone, set boundaries for topics it should decline, and test with real questions. VocUI provides default system prompts that work well out of the box, and you can refine them over time based on conversation quality.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://vocui.com/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'What Is Prompt Engineering? A Practical Introduction',
          item: 'https://vocui.com/blog/what-is-prompt-engineering',
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function WhatIsPromptEngineeringPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content">
        <div className="container mx-auto px-4 py-10 md:py-16 max-w-3xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400 flex-wrap">
              <li>
                <Link href="/" className="hover:text-primary-500 transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-primary-500 transition-colors">Blog</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-secondary-900 dark:text-secondary-100 font-medium">
                What Is Prompt Engineering?
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Explainer
                </span>
                <time dateTime="2025-11-19" className="text-xs text-secondary-400 dark:text-secondary-500">Nov 19, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">8 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                What Is Prompt Engineering? A Practical Introduction
              </h1>
            </header>

            {/* Featured snippet paragraph */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Prompt engineering is the practice of writing and refining instructions that get
                better, more consistent results from AI models. For chatbot owners, the most
                important application is writing your system prompt — the set of rules that
                controls how your chatbot behaves, what tone it uses, and what boundaries it
                follows.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What prompt engineering is
                </h2>
                <p>
                  Every interaction with a large language model starts with a prompt — the text
                  you send to the model. Prompt engineering is the discipline of crafting those
                  prompts to get the best possible output. It&apos;s the difference between asking
                  &quot;Tell me about our returns&quot; and getting a generic essay versus asking &quot;In one
                  paragraph, summarize our return policy for a customer who wants to return a
                  product within 30 days&quot; and getting a precise, useful response.
                </p>
                <p className="mt-4">
                  The term covers a range of techniques, from simple phrasing improvements to
                  sophisticated strategies like chain-of-thought prompting (asking the model to
                  reason step by step) and few-shot prompting (providing examples of desired
                  input-output pairs). But for most business chatbot applications, the core
                  of prompt engineering is writing clear, specific instructions that tell the
                  model exactly what you want.
                </p>
                <p className="mt-4">
                  Prompt engineering matters because AI models are literal followers of
                  instructions. They don&apos;t infer what you &quot;meant&quot; — they respond to what you
                  said. Vague instructions produce vague results. Specific, well-structured
                  instructions produce focused, accurate results. The quality of your prompt
                  directly determines the quality of the output.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why it matters for chatbot owners
                </h2>
                <p>
                  If you run an AI chatbot, prompt engineering is relevant in one critical place:
                  your{' '}
                  <Link href="/blog/how-to-write-chatbot-system-prompt" className="text-primary-600 dark:text-primary-400 hover:underline">
                    system prompt
                  </Link>
                  . The system prompt is a set of instructions that runs before every user
                  interaction. It defines your chatbot&apos;s personality, scope, behavior rules,
                  and constraints. It&apos;s effectively the &quot;job description&quot; for your chatbot.
                </p>
                <p className="mt-4">
                  A well-engineered system prompt produces a chatbot that stays on topic, answers
                  accurately from your knowledge base, maintains a consistent tone, and handles
                  edge cases gracefully. A poorly written system prompt produces a chatbot that
                  wanders off topic, invents information, and behaves inconsistently.
                </p>
                <p className="mt-4">
                  The good news is that you don&apos;t need a technical background to write a good
                  system prompt. The principles are about clear communication: state who the
                  chatbot is, what it should do, what it should not do, how it should handle
                  uncertainty, and what tone to use. If you can write a clear brief for a
                  human employee, you can write an effective system prompt.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Basic prompt engineering principles
                </h2>
                <p>
                  Several principles apply whether you&apos;re writing a one-off prompt or a chatbot
                  system prompt. These aren&apos;t theoretical — they produce measurably better results
                  in practice.
                </p>
                <StyledBulletList items={[
                  { title: 'Be specific:', description: 'Instead of \u201cbe helpful,\u201d say \u201canswer the user\u2019s question in 1-3 sentences using only the provided context.\u201d Specificity eliminates ambiguity and gives the model clear criteria to follow.' },
                  { title: 'Provide context:', description: 'Tell the model who it is and what situation it\u2019s in. \u201cYou are a customer support assistant for a SaaS company that sells project management software\u201d gives the model a frame of reference that shapes every response.' },
                  { title: 'Define constraints:', description: 'State what the model should not do as clearly as what it should do. \u201cNever discuss competitor products. Never speculate about future features. If you don\u2019t know the answer, say so.\u201d Negative constraints prevent common failure modes.' },
                  { title: 'Use examples:', description: 'If you want a specific output format or tone, show the model an example. \u201cWhen asked about pricing, respond like this: \u2018Our Pro plan is $29/month and includes...\u2019\u201d Examples are often more effective than abstract descriptions.' },
                  { title: 'Iterate:', description: 'No prompt is perfect on the first try. Write a draft, test it with real questions, identify where it fails, and refine. Prompt engineering is an iterative process, not a one-shot task.' },
                ]} />
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Writing better system prompts for your chatbot
                </h2>
                <p>
                  Your{' '}
                  <Link href="/blog/how-to-write-chatbot-system-prompt" className="text-primary-600 dark:text-primary-400 hover:underline">
                    chatbot&apos;s system prompt
                  </Link>{' '}
                  is the single most impactful piece of prompt engineering you&apos;ll do. Here&apos;s a
                  practical structure that works well for most business chatbots:
                </p>
                <p className="mt-4">
                  Start with identity and role: &quot;You are [name], a customer support assistant
                  for [Company]. You help customers with questions about [products/services].&quot;
                  This grounds the chatbot in a specific context and prevents it from trying to
                  be a general-purpose AI assistant.
                </p>
                <p className="mt-4">
                  Add behavior rules: &quot;Answer questions using only the knowledge base content
                  provided. If the answer isn&apos;t in the provided context, say: &apos;I don&apos;t have
                  that information, but you can reach our team at support@company.com.&apos; Never
                  invent pricing, policies, or product features.&quot; These rules prevent
                  hallucination and keep the chatbot within its lane.
                </p>
                <p className="mt-4">
                  Define tone and style: &quot;Be friendly but professional. Keep answers concise —
                  aim for 2-3 sentences unless the question requires more detail. Use the
                  customer&apos;s name if provided.&quot; Tone consistency builds trust and makes the
                  chatbot feel like a natural extension of your brand.
                </p>
                <p className="mt-4">
                  Even with a solid structure, small mistakes in your system prompt — vague
                  instructions, contradictory rules, missing fallback behavior — can undermine
                  chatbot quality. For a detailed breakdown of common mistakes and how to fix
                  them, including templates you can use directly, see our{' '}
                  <Link href="/blog/how-to-write-chatbot-system-prompt" className="text-primary-600 dark:text-primary-400 hover:underline">
                    guide to writing chatbot system prompts
                  </Link>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Tools and resources to learn more
                </h2>
                <p>
                  You don&apos;t need expensive courses to learn prompt engineering. The most effective
                  approach is hands-on experimentation: write prompts, test them, observe the
                  results, and iterate. VocUI makes this easy because you can edit your system
                  prompt and immediately test the results in the built-in chat interface.
                </p>
                <p className="mt-4">
                  Anthropic and OpenAI both publish prompt engineering guides that cover advanced
                  techniques like chain-of-thought prompting, few-shot learning, and structured
                  output formatting. These are worth reading once you&apos;re comfortable with the
                  basics. For chatbot-specific guidance, our{' '}
                  <Link href="/blog/how-to-write-chatbot-system-prompt" className="text-primary-600 dark:text-primary-400 hover:underline">
                    system prompt writing guide
                  </Link>{' '}
                  covers the most common patterns and pitfalls.
                </p>
                <p className="mt-4">
                  The fastest way to build prompt engineering skill is to deploy a chatbot and
                  iterate on it with real user interactions. Reading chat transcripts shows you
                  exactly where your system prompt works and where it needs refinement. Each
                  adjustment teaches you something about how language models interpret instructions.
                </p>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'What is prompt engineering?',
                      a: 'Prompt engineering is the practice of writing and refining the instructions you give to an AI model to get better, more consistent results. It applies to any interaction with a large language model — from one-off questions to the system prompts that define how a chatbot behaves. Good prompt engineering produces more accurate, relevant, and appropriately scoped responses.',
                    },
                    {
                      q: 'Do I need to be a developer to do prompt engineering?',
                      a: 'No. Prompt engineering is about writing clear instructions in plain language, not writing code. If you can write a clear email explaining what you need, you can write effective prompts. The skill is about being specific, providing context, and stating constraints clearly — all communication skills, not programming skills.',
                    },
                    {
                      q: 'How does prompt engineering affect my chatbot?',
                      a: "Your chatbot's system prompt is the most direct way prompt engineering affects your chatbot. It controls the tone, scope, behavior boundaries, and fallback responses. A well-engineered system prompt produces a chatbot that stays on topic, answers accurately from your knowledge base, declines questions it shouldn't answer, and maintains a consistent voice. A poorly written one leads to off-topic responses, hallucinations, and inconsistent behavior.",
                    },
                    {
                      q: 'What\u0027s the difference between a prompt and a system prompt?',
                      a: "A prompt is any instruction or question you give to an AI model. A system prompt is a special prompt that runs before every user interaction — it sets the chatbot's identity, behavior rules, and constraints. Think of a prompt as a single question and a system prompt as the job description that shapes how the chatbot answers all questions. In VocUI, you configure the system prompt in your chatbot settings and it applies to every conversation.",
                    },
                    {
                      q: 'Can I hire someone to do prompt engineering for me?',
                      a: "Yes, prompt engineering consulting is a growing field. However, for most business chatbot use cases, you can get excellent results on your own with basic principles: be specific about what the chatbot should and shouldn't do, define the tone, set boundaries for topics it should decline, and test with real questions. VocUI provides default system prompts that work well out of the box, and you can refine them over time based on conversation quality.",
                    },
                  ].map(({ q, a }) => (
                    <div key={q} className="border-b border-secondary-200 dark:border-secondary-700 pb-6">
                      <dt className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{q}</dt>
                      <dd className="text-secondary-600 dark:text-secondary-400">{a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </article>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-10 text-center text-white shadow-xl shadow-primary-500/20">
            <h2 className="text-2xl font-bold mb-3">See the concepts in action</h2>
            <p className="text-white/80 mb-2">
              Upload a document, ask your chatbot a question, and watch it pull the right answer from your content.
            </p>
            <p className="text-white/60 text-sm mb-8">
              No technical setup. The free plan is enough to try it.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Try it with your own docs
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">No setup fee, no commitment</p>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
