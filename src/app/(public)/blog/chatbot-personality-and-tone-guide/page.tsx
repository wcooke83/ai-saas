import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'How to Choose the Right Personality and Tone for Your Chatbot | VocUI',
  description:
    'Your chatbot\'s personality affects how customers perceive your brand. Learn how to define the right tone — professional, friendly, or somewhere in between.',
  openGraph: {
    title: 'How to Choose the Right Personality and Tone for Your Chatbot | VocUI',
    description:
      'Your chatbot\'s personality affects how customers perceive your brand. Learn how to define the right tone — professional, friendly, or somewhere in between.',
    url: 'https://vocui.com/blog/chatbot-personality-and-tone-guide',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Choose the Right Personality and Tone for Your Chatbot | VocUI',
    description:
      'Your chatbot\'s personality affects how customers perceive your brand. Learn how to define the right tone — professional, friendly, or somewhere in between.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-personality-and-tone-guide' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Choose the Right Personality and Tone for Your Chatbot',
      description:
        "Your chatbot's personality affects how customers perceive your brand. Learn how to define the right tone \u2014 professional, friendly, or somewhere in between.",
      url: 'https://vocui.com/blog/chatbot-personality-and-tone-guide',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-personality-and-tone-guide',
      },
      datePublished: '2026-04-01',
      dateModified: '2026-04-01',
      author: {
        '@type': 'Person',
        name: 'Will Cooke',
        url: 'https://vocui.com/about',
      },
      publisher: {
        '@type': 'Organization',
        name: 'VocUI',
        url: 'https://vocui.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://vocui.com/icon.png',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: "Can I change my chatbot's personality later?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes, your chatbot\u2019s personality is defined in the system prompt, which you can edit at any time. Changes take effect immediately on new conversations. If you\u2019re not happy with the tone, adjust the system prompt instructions and test again. Most businesses refine their chatbot\u2019s personality several times during the first month as they learn what works best with their audience.",
          },
        },
        {
          '@type': 'Question',
          name: 'Should it be formal or casual?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Match your existing brand voice. If your website, emails, and social media are casual and conversational, your chatbot should be too. If you\u2019re a law firm or financial institution, a more formal tone is appropriate. When in doubt, start slightly more professional than casual \u2014 it\u2019s easier to loosen tone than to recover from a chatbot that feels too flippant for your audience.",
          },
        },
        {
          '@type': 'Question',
          name: 'How do I make it sound human but not deceptive?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Use natural language patterns \u2014 contractions, conversational phrasing, and a warm opening \u2014 while being transparent that it\u2019s an AI. Include a brief disclosure in the greeting like \u201CHi! I\u2019m an AI assistant for [Company].\u201D Visitors appreciate a chatbot that feels natural to talk to without pretending to be a person. Avoid using a human name for the chatbot unless you clearly label it as AI.",
          },
        },
        {
          '@type': 'Question',
          name: 'What if different pages need different tones?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "In most cases, maintain one consistent personality across your site. Visitors who interact with the chatbot on multiple pages expect a consistent experience. If your business genuinely serves very different audiences (for example, a B2B enterprise product and a consumer product), consider using separate chatbots with different system prompts rather than trying to make one chatbot switch personalities based on page context.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does personality affect accuracy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Not directly, but it can affect perceived accuracy. A chatbot with a confident, authoritative tone makes visitors trust the answers more, while an overly casual chatbot might make accurate information seem less reliable. The key is matching personality to the seriousness of the content. For factual questions (pricing, policies, technical details), keep the tone clear and direct. For general conversation, you can be warmer and more relaxed.",
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotPersonalityAndToneGuidePage() {
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
                <Link href="/" className="hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-primary-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-secondary-900 dark:text-secondary-100 font-medium">
                Chatbot Personality and Tone Guide
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Best Practice
                </span>
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  7 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                How to Choose the Right Personality and Tone for Your Chatbot
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Your chatbot&apos;s personality shapes every interaction. A tone that matches your
                brand builds trust and keeps visitors engaged. A mismatched tone &mdash; too
                casual for a law firm, too stiff for a creative agency &mdash; creates friction
                that drives visitors away. The right personality is defined in your system prompt
                and should reflect how your best team member would speak to a customer.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Chatbot Personality Matters
                </h2>
                <p>
                  Visitors form an impression of your brand within seconds of interacting with
                  your chatbot. That impression is shaped not just by the accuracy of the answers
                  but by how those answers are delivered. A chatbot that responds with warmth and
                  clarity feels like a helpful team member. One that responds with cold, robotic
                  phrasing feels like an obstacle between the visitor and the information they
                  need.
                </p>
                <p className="mt-4">
                  Research on conversational AI shows that users rate chatbots with consistent,
                  well-defined personalities as more trustworthy and more helpful than those with
                  generic, default-sounding responses. The personality doesn&apos;t need to be
                  complex &mdash; it just needs to be intentional. A chatbot that consistently
                  communicates in a specific voice feels reliable, while one that shifts between
                  formal and casual randomly feels unpredictable.
                </p>
                <p className="mt-4">
                  For small businesses especially, the chatbot is often the first point of
                  contact. It sets the tone for the entire customer relationship. Getting the
                  personality right means visitors feel welcome, understood, and confident that
                  they&apos;re dealing with a professional business &mdash; all before they ever
                  speak to a human.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Matching Your Brand Voice
                </h2>
                <p>
                  Your chatbot should sound like an extension of your existing brand, not a
                  separate entity. If your website copy is conversational and uses first-person
                  language, your chatbot should too. If your brand is known for being precise and
                  authoritative, the chatbot should reflect that. The simplest way to find the
                  right tone is to read your best marketing emails, your most effective sales
                  conversations, and your top-performing social media posts &mdash; the voice
                  that resonates with your audience is the one your chatbot should use.
                </p>
                <p className="mt-4">
                  Ask yourself: if a customer called your business and spoke to your best
                  employee, how would that conversation sound? That&apos;s the target for your
                  chatbot&apos;s personality. Capture the specific phrases, greetings, and
                  communication style that make your brand recognizable. Include these in your
                  system prompt as examples of how the chatbot should respond.
                </p>
                <p className="mt-4">
                  Consistency matters more than perfection. A chatbot that reliably sounds like
                  your brand &mdash; even if the tone isn&apos;t exactly what you&apos;d choose
                  in every situation &mdash; builds familiarity and trust. Visitors learn what
                  to expect, and that predictability is comfortable. A chatbot that sounds
                  different every time creates cognitive friction that makes the interaction feel
                  unreliable.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Common Personality Archetypes
                </h2>
                <p>
                  <strong>Professional:</strong> Clear, direct, and authoritative. Uses complete
                  sentences, avoids slang, and keeps responses factual. Best for law firms,
                  financial services, healthcare, and B2B companies where visitors expect
                  expertise and precision. Example greeting: &quot;Hello. How can I assist you
                  today?&quot;
                </p>
                <p className="mt-4">
                  <strong>Friendly:</strong> Warm, approachable, and conversational. Uses
                  contractions, asks follow-up questions, and adds a personal touch to
                  responses. Best for retail, hospitality, creative agencies, and consumer-facing
                  businesses. Example greeting: &quot;Hi there! What can I help you with?&quot;
                </p>
                <p className="mt-4">
                  <strong>Witty:</strong> Clever, engaging, and personality-forward. Adds light
                  humor where appropriate, uses creative phrasing, and makes the interaction
                  memorable. Best for brands with a strong personality &mdash; tech startups,
                  entertainment companies, and lifestyle brands. Use sparingly and test
                  carefully: humor that misses feels worse than no humor at all.
                </p>
                <p className="mt-4">
                  <strong>Minimal:</strong> Brief, efficient, and to-the-point. Answers questions
                  with minimal preamble. Best for technical audiences, developer tools, and
                  situations where visitors want information fast without small talk. Example
                  greeting: &quot;Ask me anything about [product].&quot; Choose the archetype
                  closest to your brand, then customize from there. See our{' '}
                  <Link
                    href="/blog/how-to-write-chatbot-system-prompt"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    system prompt guide
                  </Link>{' '}
                  for specific prompt instructions that implement each archetype.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Defining Tone in Your System Prompt
                </h2>
                <p>
                  The system prompt is where personality becomes actionable. Instead of vague
                  instructions like &quot;be friendly,&quot; give specific guidance the AI can
                  follow. Describe the tone explicitly: &quot;Respond in a warm, conversational
                  tone. Use contractions. Keep sentences short. Address the visitor as
                  &apos;you.&apos; Start responses with a brief acknowledgment of the question
                  before answering.&quot;
                </p>
                <p className="mt-4">
                  Include example responses in your system prompt. Show the chatbot what a good
                  answer looks like in your preferred tone. For instance: &quot;When asked about
                  pricing, respond like this: &apos;Great question! Our starter plan is $29/month
                  and includes up to 1,000 conversations. Want me to walk you through what&apos;s
                  included?&apos;&quot; Examples are the most effective way to calibrate tone
                  because the AI learns from patterns in the instructions.
                </p>
                <p className="mt-4">
                  Also define what the chatbot should avoid. If your brand is professional, add
                  instructions like: &quot;Do not use slang, emojis, or exclamation marks. Do
                  not start responses with &apos;Hey!&apos; or &apos;Sure thing!&apos;&quot;
                  Exclusions are as important as inclusions when defining personality &mdash;
                  they prevent the AI from defaulting to generic patterns that don&apos;t match
                  your brand. For deeper guidance on system prompt structure, read our{' '}
                  <Link
                    href="/blog/what-is-a-system-prompt"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    what is a system prompt
                  </Link>{' '}
                  explainer.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What to Avoid
                </h2>
                <p>
                  <strong>Too casual:</strong> A chatbot that uses excessive slang, emojis, or
                  tries too hard to be relatable can feel unprofessional and undermine trust. If
                  a visitor is asking about a serious topic &mdash; pricing, security, or a
                  problem with their order &mdash; a response peppered with &quot;lol&quot; and
                  smiley faces feels dismissive. Casual tone works, but it still needs to respect
                  the gravity of the customer&apos;s question.
                </p>
                <p className="mt-4">
                  <strong>Too robotic:</strong> Responses that read like technical documentation
                  or legal disclaimers create distance between the customer and your brand.
                  Phrases like &quot;Your inquiry has been noted&quot; or &quot;Please be advised
                  that&quot; belong in automated email templates, not conversations. Even
                  professional chatbots should sound like a knowledgeable person, not a form
                  letter.
                </p>
                <p className="mt-4">
                  <strong>Too pushy:</strong> Every response does not need to include a sales
                  pitch. A chatbot that redirects every question to &quot;sign up for a demo&quot;
                  feels manipulative. Answer the visitor&apos;s question fully first. If a
                  natural opportunity to suggest your product arises, take it gently. Visitors
                  convert because the chatbot was genuinely helpful, not because it pressured
                  them. Review our{' '}
                  <Link
                    href="/blog/chatbot-best-practices-for-small-business"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    small business chatbot best practices
                  </Link>{' '}
                  for more guidance on getting the balance right.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Testing Personality with Real Conversations
                </h2>
                <p>
                  The only way to know if your chatbot&apos;s personality works is to test it
                  with real people. Ask colleagues, friends, or early customers to interact with
                  the chatbot and give honest feedback. Ask specific questions: Did it feel
                  natural? Did the tone match our brand? Were there moments that felt off? Did
                  you trust the information? People notice tone mismatches instantly, even if
                  they can&apos;t articulate exactly what feels wrong.
                </p>
                <p className="mt-4">
                  After launch, review conversation logs for tone-related signals. Look for
                  conversations where visitors seem confused, frustrated, or disengage quickly.
                  These may indicate that the tone is creating friction. Also look for
                  conversations where visitors engage enthusiastically &mdash; these show what
                  the chatbot is getting right. Use both signals to refine the system prompt.
                </p>
                <p className="mt-4">
                  Plan to iterate on your chatbot&apos;s personality at least three to four
                  times during the first month. Each round of feedback reveals something new
                  about how visitors perceive the tone and where adjustments are needed. Small
                  changes to the system prompt &mdash; adding an example, removing a
                  restriction, tweaking a phrase &mdash; can significantly shift how the
                  chatbot comes across. Visit our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    pricing page
                  </Link>{' '}
                  to choose a plan and start testing your chatbot&apos;s personality today.
                </p>
              </section>

              {/* FAQ section */}
              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: "Can I change my chatbot's personality later?",
                      a: "Yes, your chatbot\u2019s personality is defined in the system prompt, which you can edit at any time. Changes take effect immediately on new conversations. If you\u2019re not happy with the tone, adjust the system prompt instructions and test again. Most businesses refine their chatbot\u2019s personality several times during the first month as they learn what works best with their audience.",
                    },
                    {
                      q: 'Should it be formal or casual?',
                      a: "Match your existing brand voice. If your website, emails, and social media are casual and conversational, your chatbot should be too. If you\u2019re a law firm or financial institution, a more formal tone is appropriate. When in doubt, start slightly more professional than casual \u2014 it\u2019s easier to loosen tone than to recover from a chatbot that feels too flippant for your audience.",
                    },
                    {
                      q: 'How do I make it sound human but not deceptive?',
                      a: "Use natural language patterns \u2014 contractions, conversational phrasing, and a warm opening \u2014 while being transparent that it\u2019s an AI. Include a brief disclosure in the greeting like \u201CHi! I\u2019m an AI assistant for [Company].\u201D Visitors appreciate a chatbot that feels natural to talk to without pretending to be a person. Avoid using a human name for the chatbot unless you clearly label it as AI.",
                    },
                    {
                      q: 'What if different pages need different tones?',
                      a: "In most cases, maintain one consistent personality across your site. Visitors who interact with the chatbot on multiple pages expect a consistent experience. If your business genuinely serves very different audiences (for example, a B2B enterprise product and a consumer product), consider using separate chatbots with different system prompts rather than trying to make one chatbot switch personalities based on page context.",
                    },
                    {
                      q: 'Does personality affect accuracy?',
                      a: "Not directly, but it can affect perceived accuracy. A chatbot with a confident, authoritative tone makes visitors trust the answers more, while an overly casual chatbot might make accurate information seem less reliable. The key is matching personality to the seriousness of the content. For factual questions (pricing, policies, technical details), keep the tone clear and direct. For general conversation, you can be warmer and more relaxed.",
                    },
                  ].map(({ q, a }) => (
                    <div
                      key={q}
                      className="border-b border-secondary-200 dark:border-secondary-700 pb-6"
                    >
                      <dt className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                        {q}
                      </dt>
                      <dd className="text-secondary-600 dark:text-secondary-400">{a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </article>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-10 text-center text-white shadow-xl shadow-primary-500/20">
            <h2 className="text-2xl font-bold mb-3">Put this into practice -- today</h2>
            <p className="text-white/80 mb-2">
              You have the strategy. VocUI gives you the platform to execute it without writing code.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Your first chatbot is free. Most teams are live in under an hour.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Launch your first chatbot
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">Start building -- your first chatbot is free</p>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
