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
  title: 'AI Hallucination: What It Is and How to Prevent It | VocUI',
  description:
    'AI hallucination is when a chatbot generates confident but incorrect answers. Learn why it happens and how to prevent it in your business chatbot.',
  openGraph: {
    title: 'AI Hallucination: What It Is and How to Prevent It | VocUI',
    description:
      'AI hallucination is when a chatbot generates confident but incorrect answers. Learn why it happens and how to prevent it in your business chatbot.',
    url: 'https://vocui.com/blog/ai-hallucination-what-it-is-how-to-prevent-it',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Hallucination: What It Is and How to Prevent It | VocUI',
    description:
      'AI hallucination is when a chatbot generates confident but incorrect answers. Learn why it happens and how to prevent it in your business chatbot.',
  },
  alternates: { canonical: 'https://vocui.com/blog/ai-hallucination-what-it-is-how-to-prevent-it' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Hallucination: What It Is and How to Prevent It',
      description:
        'AI hallucination is when a chatbot generates confident but incorrect answers. Learn why it happens and how to prevent it in your business chatbot.',
      url: 'https://vocui.com/blog/ai-hallucination-what-it-is-how-to-prevent-it',
      datePublished: '2025-03-31',
      dateModified: '2025-03-31',
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
          url: 'https://vocui.com/logo.png',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What causes AI hallucinations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'AI hallucinations happen because large language models generate text by predicting the most likely next words, not by looking up verified facts. They are trained on vast text corpora and learn patterns of how information is typically expressed, but they don\'t have a built-in mechanism to distinguish what they "know" to be true from what sounds plausible. When the model lacks specific information or when its training data contains conflicting claims, it may generate confident-sounding text that is factually wrong.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you completely prevent AI hallucinations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No current technique eliminates hallucinations entirely. However, you can reduce them dramatically. Retrieval-augmented generation (RAG) grounds the model in your actual content instead of relying on general knowledge. Strong system prompts that instruct the model to say "I don\'t know" when information isn\'t available further reduce fabrication. Combined, these techniques bring hallucination rates to very low levels for most business use cases.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does RAG help prevent hallucinations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'RAG (Retrieval-Augmented Generation) works by retrieving relevant passages from your knowledge base before the model generates a response. Instead of relying on its general training, the model answers based on the specific content you\'ve provided. This grounds the response in verified information and dramatically reduces the chance of fabricated answers. If no relevant content is found, a well-configured system can tell the user it doesn\'t have that information rather than guessing.',
          },
        },
        {
          '@type': 'Question',
          name: 'What should my system prompt say to prevent hallucinations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Your system prompt should explicitly instruct the model to only answer from the provided context, to say "I don\'t have that information" when the context doesn\'t contain a relevant answer, to never invent product details, pricing, or policies, and to cite or reference the source material when possible. These boundaries give the model clear rules that prevent it from falling back on fabricated responses when it lacks information.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I know if my chatbot is hallucinating?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Review chat transcripts regularly — especially in the first few weeks after deployment. Look for responses that include specific claims (dates, prices, policies) and verify them against your knowledge base. Pay attention to user feedback and complaints about incorrect information. You can also test systematically by asking questions you know the answer to, or asking questions that are deliberately outside your chatbot\'s knowledge to see if it appropriately declines to answer.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AiHallucinationPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
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
                AI Hallucination
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Explainer
                </span>
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">8 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                AI Hallucination: What It Is and How to Prevent It
              </h1>
            </header>

            {/* Featured snippet paragraph */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                AI hallucination is when a language model generates a response that sounds confident
                and plausible but is factually incorrect. It&apos;s one of the biggest risks when deploying
                AI chatbots for business — and one of the most manageable, if you know how to
                address it.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What AI hallucination is
                </h2>
                <p>
                  AI hallucination occurs when a large language model produces text that is
                  factually wrong, internally inconsistent, or entirely fabricated — while
                  presenting it with the same confidence as accurate information. The model
                  doesn&apos;t know it&apos;s wrong. It doesn&apos;t have a concept of &quot;truth&quot; — it generates
                  the most statistically probable next words based on its training data.
                </p>
                <p className="mt-4">
                  The term &quot;hallucination&quot; captures the problem well. Just as a person experiencing
                  a hallucination perceives something that isn&apos;t real, an AI model generates
                  information that doesn&apos;t correspond to reality. A chatbot might confidently state
                  that your company offers a 90-day return policy when your actual policy is 30 days.
                  It might cite a research paper that doesn&apos;t exist. It might invent a product
                  feature you&apos;ve never offered.
                </p>
                <p className="mt-4">
                  For business chatbots, hallucination isn&apos;t just an academic problem. If your
                  customer-facing bot gives incorrect pricing, makes up policies, or provides wrong
                  instructions, it damages trust and can create legal liability. Understanding why
                  hallucination happens is the first step to preventing it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why AI models hallucinate
                </h2>
                <p>
                  Large language models don&apos;t store facts in a database and look them up. They learn
                  statistical patterns from enormous amounts of text during training. When you ask a
                  question, the model generates a response by predicting what words are most likely
                  to follow, based on those patterns. This architecture is what makes LLMs incredibly
                  fluent and versatile — but it&apos;s also what makes them prone to fabrication.
                </p>
                <p className="mt-4">
                  Several factors contribute to hallucination. The model&apos;s training data may contain
                  contradictory information on a topic, so the model has no clear &quot;ground truth.&quot; The
                  model may have limited or outdated information about your specific business. When
                  forced to respond to a question it doesn&apos;t have enough information to answer, the
                  model defaults to generating plausible-sounding text rather than admitting
                  uncertainty.
                </p>
                <p className="mt-4">
                  There&apos;s also a structural incentive toward hallucination: LLMs are trained to be
                  helpful. &quot;I don&apos;t know&quot; feels unhelpful, so the model tends to produce an answer
                  rather than decline. Without explicit constraints, this helpfulness bias leads
                  the model to fill gaps with plausible but unverified claims.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Real-world examples of hallucination
                </h2>
                <p>
                  Hallucination isn&apos;t theoretical — it happens regularly in production systems. A
                  well-known early example involved a legal filing where an attorney used ChatGPT
                  to research case law. The model generated citations to court cases that sounded
                  legitimate but didn&apos;t exist. The attorney submitted them to the court without
                  verification, resulting in sanctions.
                </p>
                <p className="mt-4">
                  In a business chatbot context, hallucination tends to be subtler but equally
                  damaging. A customer asks about pricing and the chatbot invents a discount tier
                  that doesn&apos;t exist. A user asks about delivery timeframes and gets a specific
                  number of days that contradicts the actual shipping policy. An employee asks the
                  internal bot about a procedure and receives steps that sound right but skip a
                  critical compliance requirement.
                </p>
                <p className="mt-4">
                  These examples share a common pattern: the AI generates a response that is
                  linguistically perfect — clear, specific, confident — but factually wrong. The
                  better the model is at producing natural-sounding text, the harder it is for
                  users to detect when it&apos;s hallucinating.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How RAG reduces hallucinations
                </h2>
                <p>
                  <Link href="/blog/what-is-rag-retrieval-augmented-generation" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Retrieval-Augmented Generation (RAG)
                  </Link>{' '}
                  is the single most effective technique for reducing hallucination in business
                  chatbots. Instead of relying on the model&apos;s general knowledge, RAG retrieves
                  specific passages from your knowledge base and provides them to the model as
                  context for generating its response.
                </p>
                <p className="mt-4">
                  This changes the fundamental dynamic. Without RAG, the model has to draw on
                  whatever it learned during training — which may be wrong, outdated, or
                  nonexistent for your specific business. With RAG, the model reads your actual
                  content and answers based on that. It&apos;s the difference between asking someone
                  to answer from memory versus asking them to answer while reading the source
                  document.
                </p>
                <p className="mt-4">
                  RAG doesn&apos;t eliminate hallucination completely. The model can still misinterpret
                  retrieved content, or generate claims that go beyond what the source material
                  states. But it reduces the problem from &quot;the model is guessing from general
                  knowledge&quot; to &quot;the model has the right information and usually uses it correctly.&quot;
                  Research published on{' '}
                  <a href="https://arxiv.org/html/2507.18910v1" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">arXiv</a>{' '}
                  found that a Multi-Agent RAG approach reduced hallucination rates from 15% to
                  just 1.45% across over 6,000 queries. A separate study in{' '}
                  <a href="https://www.mdpi.com/2079-9292/14/21/4227" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">MDPI Electronics</a>{' '}
                  showed that self-reflective RAG lowered hallucinations to 5.8% in clinical
                  decision support systems. Combined with good system prompts, RAG brings
                  hallucination rates down to levels that are acceptable for most business
                  applications.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Writing system prompts that prevent hallucination
                </h2>
                <p>
                  Your{' '}
                  <Link href="/blog/how-to-write-chatbot-system-prompt" className="text-primary-600 dark:text-primary-400 hover:underline">
                    system prompt
                  </Link>{' '}
                  is your primary tool for controlling chatbot behavior, including hallucination.
                  A well-written system prompt sets explicit boundaries that the model follows
                  when generating responses.
                </p>
                <p className="mt-4">
                  Key principles for anti-hallucination system prompts: instruct the model to
                  answer only from the provided context. Tell it explicitly that if the context
                  doesn&apos;t contain enough information, it should say so rather than guess. Prohibit
                  it from inventing product details, pricing, dates, or policies. Tell it to prefer
                  shorter, accurate answers over long, comprehensive ones that might drift into
                  fabrication.
                </p>
                <p className="mt-4">
                  A practical example: &quot;You are a support assistant for [Company]. Answer questions
                  using only the knowledge base content provided. If the answer is not in the
                  provided content, say: &apos;I don&apos;t have that specific information. Please contact
                  our support team at support@company.com.&apos; Never invent pricing, policies, or
                  product features.&quot; This kind of prompt gives the model clear rails. Read our{' '}
                  <Link href="/blog/how-to-improve-chatbot-accuracy" className="text-primary-600 dark:text-primary-400 hover:underline">
                    guide to improving chatbot accuracy
                  </Link>{' '}
                  for more techniques.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Testing and monitoring for hallucinations
                </h2>
                <p>
                  Prevention doesn&apos;t stop at deployment. You need an ongoing process to catch
                  hallucinations that slip through. The most effective approach is a combination
                  of systematic testing before launch and ongoing monitoring after.
                </p>
                <p className="mt-4">
                  Before deployment, test your chatbot with questions you know the correct answers
                  to. Ask about specific prices, dates, policies, and procedures. Verify each
                  response against your source material. Also test edge cases: ask questions that
                  are outside your chatbot&apos;s knowledge and confirm that it declines to answer
                  rather than fabricating a response.
                </p>
                <p className="mt-4">
                  After deployment, review chat transcripts regularly — especially during the first
                  few weeks. Look for responses containing specific claims (numbers, dates, names)
                  and spot-check them against your knowledge base. Pay attention to user feedback.
                  If users report getting wrong information, investigate the specific conversation
                  and adjust your system prompt or knowledge base content accordingly. Over time,
                  your chatbot gets more reliable as you identify and close the gaps.
                </p>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'What causes AI hallucinations?',
                      a: 'AI hallucinations happen because large language models generate text by predicting the most likely next words, not by looking up verified facts. They are trained on vast text corpora and learn patterns of how information is typically expressed, but they don\'t have a built-in mechanism to distinguish what they "know" to be true from what sounds plausible. When the model lacks specific information or when its training data contains conflicting claims, it may generate confident-sounding text that is factually wrong.',
                    },
                    {
                      q: 'Can you completely prevent AI hallucinations?',
                      a: 'No current technique eliminates hallucinations entirely. However, you can reduce them dramatically. Retrieval-augmented generation (RAG) grounds the model in your actual content instead of relying on general knowledge. Strong system prompts that instruct the model to say "I don\'t know" when information isn\'t available further reduce fabrication. Combined, these techniques bring hallucination rates to very low levels for most business use cases.',
                    },
                    {
                      q: 'How does RAG help prevent hallucinations?',
                      a: 'RAG (Retrieval-Augmented Generation) works by retrieving relevant passages from your knowledge base before the model generates a response. Instead of relying on its general training, the model answers based on the specific content you\'ve provided. This grounds the response in verified information and dramatically reduces the chance of fabricated answers. If no relevant content is found, a well-configured system can tell the user it doesn\'t have that information rather than guessing.',
                    },
                    {
                      q: 'What should my system prompt say to prevent hallucinations?',
                      a: 'Your system prompt should explicitly instruct the model to only answer from the provided context, to say "I don\'t have that information" when the context doesn\'t contain a relevant answer, to never invent product details, pricing, or policies, and to cite or reference the source material when possible. These boundaries give the model clear rules that prevent it from falling back on fabricated responses when it lacks information.',
                    },
                    {
                      q: 'How do I know if my chatbot is hallucinating?',
                      a: 'Review chat transcripts regularly — especially in the first few weeks after deployment. Look for responses that include specific claims (dates, prices, policies) and verify them against your knowledge base. Pay attention to user feedback and complaints about incorrect information. You can also test systematically by asking questions you know the answer to, or asking questions that are deliberately outside your chatbot\'s knowledge to see if it appropriately declines to answer.',
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
            <h2 className="text-2xl font-bold mb-3">Now see it in action — with your own content</h2>
            <p className="text-white/80 mb-2">
              You understand how it works. Try it yourself: upload a document, ask a question, and watch your chatbot answer from your knowledge.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free to start. Takes about 2 minutes to see your first answer.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">No setup fee, no commitments</p>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
