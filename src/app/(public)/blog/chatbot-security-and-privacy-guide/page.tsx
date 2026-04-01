import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { VOCUI_AUTHOR } from '@/lib/seo/jsonld-utils';
import { ChecklistInfographic } from '@/components/blog/infographics';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Chatbot Security and Privacy: What Business Owners Need to Know | VocUI',
  description:
    'Understand the security and privacy considerations for business chatbots — data storage, encryption, compliance, and what to ask your chatbot provider.',
  openGraph: {
    title: 'Chatbot Security and Privacy: What Business Owners Need to Know | VocUI',
    description:
      'Understand the security and privacy considerations for business chatbots — data storage, encryption, compliance, and what to ask your chatbot provider.',
    url: 'https://vocui.com/blog/chatbot-security-and-privacy-guide',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chatbot Security and Privacy: What Business Owners Need to Know | VocUI',
    description:
      'Understand the security and privacy considerations for business chatbots — data storage, encryption, compliance, and what to ask your chatbot provider.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-security-and-privacy-guide' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Chatbot Security and Privacy: What Business Owners Need to Know',
      description:
        'Understand the security and privacy considerations for business chatbots \u2014 data storage, encryption, compliance, and what to ask your chatbot provider.',
      url: 'https://vocui.com/blog/chatbot-security-and-privacy-guide',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-security-and-privacy-guide',
      },
      datePublished: '2026-03-23',
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
        url: 'https://vocui.com/blog/chatbot-security-and-privacy-guide/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is chatbot data encrypted?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'With a reputable provider, yes. Data should be encrypted both in transit (using TLS/HTTPS) and at rest (using AES-256 or equivalent encryption). This means conversation data is protected while being sent between the visitor\u2019s browser and the server, and also while stored in the database. Always ask your provider to confirm both types of encryption \u2014 some only encrypt data in transit, leaving stored conversations vulnerable.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who can see chat conversations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Only you and authorized members of your team should have access to chat conversations. Your chatbot provider\u2019s support team may have access for debugging purposes, but a good provider will have strict internal access controls and audit logging. Ask about their data access policies and whether they use conversation data for training their own AI models. At VocUI, conversation data belongs to you and is never used to train our models.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is it GDPR compliant?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'GDPR compliance depends on your implementation, not just the chatbot platform. You need to inform visitors that the chatbot collects data (via your privacy policy and cookie consent), provide a way for users to request data deletion, and ensure your chatbot provider stores data in a GDPR-compliant manner. Most reputable chatbot platforms provide the tools for GDPR compliance, but the responsibility for implementing it correctly sits with you as the business owner.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I delete user data?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, you should be able to delete individual chat sessions, all data from a specific user, or all conversation data entirely. This capability is required for GDPR and CCPA compliance. Check that your chatbot provider offers data deletion both through the dashboard interface and via API, so you can handle deletion requests quickly. Also ask about data retention policies \u2014 how long conversation data is stored by default and whether you can customize the retention period.',
          },
        },
        {
          '@type': 'Question',
          name: 'What about HIPAA for healthcare?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'HIPAA compliance adds significant requirements. If your chatbot may handle protected health information (PHI), your chatbot provider must sign a Business Associate Agreement (BAA) and meet HIPAA\u2019s technical safeguards: encryption, access controls, audit logging, and data integrity measures. Most general-purpose chatbot platforms are not HIPAA-compliant out of the box. If you\u2019re in healthcare, ask specifically about HIPAA compliance before deploying a chatbot that might handle patient information.',
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
          name: 'Chatbot Security and Privacy: What Business Owners Need to Know',
          item: 'https://vocui.com/blog/chatbot-security-and-privacy-guide',
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotSecurityAndPrivacyGuidePage() {
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
                Chatbot Security and Privacy Guide
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Best Practice
                </span>
                <time dateTime="2026-03-23" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 23, 2026</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  8 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                Chatbot Security and Privacy: What Business Owners Need to Know
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Deploying a chatbot means handling customer data &mdash; questions they ask,
                information they share, and sometimes personal details. Understanding how that
                data is stored, encrypted, and protected is essential for maintaining customer
                trust and meeting regulatory requirements like GDPR and CCPA.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Chatbot Security Matters
                </h2>
                <p>
                  Every conversation your chatbot has represents a data exchange. Visitors type
                  questions that may include their name, email address, business details, account
                  numbers, or other sensitive information. Even seemingly innocuous questions can
                  contain personally identifiable information (PII) when combined. A question like
                  &quot;I&apos;m John at Acme Corp, can you check my order status?&quot; contains
                  a name, company, and implies an existing customer relationship.
                </p>
                <p className="mt-4">
                  Data breaches erode customer trust faster than almost anything else. If your
                  chatbot conversations are exposed &mdash; either through a security flaw in the
                  platform or inadequate access controls &mdash; the reputational damage can far
                  exceed the technical cost of the breach. Customers expect their interactions
                  with your business to be private, and that expectation extends to AI-powered
                  conversations.
                </p>
                <p className="mt-4">
                  Beyond trust, there are legal implications. Regulations like GDPR in Europe,
                  CCPA in California, and industry-specific rules like HIPAA for healthcare impose
                  specific requirements on how you collect, store, and process personal data. The{' '}
                  <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">NIST AI Risk Management Framework</a>{' '}
                  provides a structured approach for organizations to manage these risks.
                  Non-compliance can result in significant fines. The good news is that choosing a
                  chatbot provider with strong security practices covers most of the technical
                  requirements &mdash; but you still need to understand what to look for.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What Data Chatbots Collect
                </h2>
                <p>
                  A typical chatbot collects several types of data during normal operation.
                  Conversation content is the most obvious &mdash; every message the visitor sends
                  and every response the chatbot generates. This includes any personal information
                  the visitor voluntarily shares during the conversation, such as names, email
                  addresses, phone numbers, or account details.
                </p>
                <p className="mt-4">
                  Beyond conversation content, chatbot platforms typically collect metadata:
                  timestamps, IP addresses, browser information, the page the visitor was on when
                  they started the chat, and session duration. Some platforms also track
                  behavioral data like which pages the visitor viewed before and after the chat.
                  This metadata is useful for analytics but also constitutes personal data under
                  many privacy regulations.
                </p>
                <p className="mt-4">
                  Your knowledge base content is also stored by the chatbot platform. While this
                  is your business information rather than customer data, it may contain
                  proprietary details about your products, pricing strategies, or internal
                  processes that you wouldn&apos;t want exposed. Treat your knowledge base
                  content as confidential business data and ensure your provider protects it
                  accordingly.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How Data Is Stored and Encrypted
                </h2>
                <p>
                  Data encryption happens at two levels: in transit and at rest. Encryption in
                  transit means that data is protected while traveling between the visitor&apos;s
                  browser and the server. This is handled by TLS (the technology behind HTTPS) and
                  should be non-negotiable &mdash; any chatbot platform that doesn&apos;t use
                  HTTPS is not worth considering. Encryption at rest means data is encrypted while
                  stored in the database, using standards like AES-256. The{' '}
                  <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">OWASP Cryptographic Storage Cheat Sheet</a>{' '}
                  is a good reference for evaluating a provider&apos;s encryption practices.
                </p>
                <p className="mt-4">
                  Ask your chatbot provider where data is physically stored. For GDPR compliance,
                  data about European visitors may need to be stored within the EU or in countries
                  with adequate data protection agreements. Major cloud providers (AWS, Google
                  Cloud, Azure) offer region-specific data storage, and reputable chatbot
                  platforms let you choose or at least know which region your data lives in.
                </p>
                <p className="mt-4">
                  Also consider who has access to the encryption keys and the stored data. In a
                  well-designed system, your conversation data is encrypted with keys that only
                  your account controls, and the chatbot provider&apos;s employees cannot read
                  your conversations without explicit authorization. Ask about internal access
                  controls and whether the provider maintains audit logs of who accesses what
                  data and when.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Compliance Considerations
                </h2>
                <p>
                  <strong><a href="https://gdprlocal.com/chatbot-gdpr-compliance/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">GDPR</a></strong> applies if you serve visitors from the European Union.
                  Key requirements include: informing visitors about data collection (via your
                  privacy policy), obtaining consent where required, providing access to collected
                  data upon request, and enabling data deletion (&quot;right to be forgotten&quot;).
                  Your chatbot&apos;s greeting or your website&apos;s cookie consent banner should
                  disclose that conversations are recorded and how the data is used.
                </p>
                <p className="mt-4">
                  <strong>CCPA</strong> applies to California residents and gives them similar
                  rights: knowing what data is collected, requesting deletion, and opting out of
                  data sales. If your chatbot provider uses conversation data to improve their
                  own AI models, this could be considered a &quot;sale&quot; of data under CCPA,
                  which requires explicit consent. Ask your provider directly whether they use
                  your data for model training.
                </p>
                <p className="mt-4">
                  <strong>HIPAA</strong> applies to healthcare organizations handling protected
                  health information (PHI). HIPAA compliance requires a Business Associate
                  Agreement (BAA) with your chatbot provider, technical safeguards like
                  encryption and access controls, and detailed audit logging. Most general-purpose
                  chatbot platforms are not HIPAA-compliant. If you&apos;re in healthcare, verify
                  compliance before deploying. Learn more about chatbots in regulated industries
                  in our{' '}
                  <Link
                    href="/blog/chatbot-for-financial-services"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    financial services chatbot guide
                  </Link>{' '}
                  and our{' '}
                  <Link
                    href="/blog/chatbot-for-insurance"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    insurance chatbot guide
                  </Link>.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Questions to Ask Your Chatbot Provider
                </h2>
                <p>
                  Before choosing a chatbot platform, ask these questions. Where is conversation
                  data stored geographically? Is data encrypted both in transit and at rest? Do
                  you use customer conversation data to train your AI models? Can I delete
                  specific user data or all conversation data? What access controls exist for my
                  team members? Do you offer a BAA for HIPAA compliance? What is your data
                  retention policy? What happens to my data if I cancel my account?
                </p>
                <p className="mt-4">
                  A provider who can answer these questions clearly and completely is one who
                  takes security seriously. Vague answers like &quot;we follow industry best
                  practices&quot; without specifics should raise concerns. You want concrete
                  answers: &quot;Data is stored in AWS us-east-1, encrypted at rest with
                  AES-256, and we do not use customer data for model training.&quot;
                </p>
                <p className="mt-4">
                  Also review the provider&apos;s security page, terms of service, and data
                  processing agreement. These documents should clearly describe their security
                  practices, data handling policies, and your rights as a customer. If these
                  documents are hard to find or vague, that&apos;s a warning sign about the
                  provider&apos;s commitment to security.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Best Practices for Sensitive Industries
                </h2>
                <p>
                  If your business handles sensitive data &mdash; financial information, health
                  records, legal matters, or personal data beyond basic contact details &mdash;
                  take extra precautions with your chatbot deployment. Note that the{' '}
                  <a href="https://artificialintelligenceact.eu/article/50/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">EU AI Act (Article 50)</a>{' '}
                  also requires chatbots to disclose they are AI-powered by August 2026. Configure
                  your system prompt to explicitly instruct the chatbot not to ask for sensitive
                  information:
                  &quot;Never ask for social security numbers, credit card numbers, passwords, or
                  health information.&quot;
                </p>
                <p className="mt-4">
                  Add a disclaimer to your chatbot&apos;s greeting that advises visitors not to
                  share sensitive information in the chat. Something like: &quot;Please don&apos;t
                  share sensitive personal information like account numbers or passwords in this
                  chat. For account-specific questions, please contact us directly at [phone/email].&quot;
                  This sets expectations and reduces the risk of sensitive data entering your
                  conversation logs.
                </p>
                <p className="mt-4">
                  Consider setting shorter data retention periods for conversation logs. If your
                  chatbot primarily handles informational queries, you may not need to keep
                  conversation data for more than 30&ndash;90 days. Shorter retention reduces
                  your risk surface. Review conversations regularly for any sensitive data that
                  visitors shared despite the disclaimer, and delete those records promptly.
                </p>
              </section>

              <ChecklistInfographic
                title="Chatbot Security Checklist"
                items={[
                  'Data encrypted in transit (TLS/HTTPS)',
                  'Data encrypted at rest (AES-256)',
                  'Provider does not use your data for model training',
                  'Row-level data isolation between customers',
                  'Granular team access controls configured',
                  'Privacy policy updated to mention chatbot data collection',
                  'System prompt instructs bot not to request sensitive info',
                  'Data retention policy reviewed and configured',
                  'Visitor disclaimer added to chatbot greeting',
                  'Monthly audit of conversation logs for PII',
                ]}
                completedCount={0}
              />

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How VocUI Handles Security
                </h2>
                <p>
                  VocUI is built on a security-first architecture. All data is encrypted in
                  transit using TLS 1.2+ and encrypted at rest using AES-256. Conversation data
                  is stored in isolated databases with row-level security, meaning your data is
                  logically separated from every other customer&apos;s data. Our infrastructure
                  runs on enterprise-grade cloud providers with SOC 2 certifications.
                </p>
                <p className="mt-4">
                  We do not use your conversation data or knowledge base content to train our AI
                  models. Your data belongs to you. You can export or delete all of your data at
                  any time through the dashboard. We provide granular access controls so you can
                  manage which team members can view conversations, edit knowledge bases, or
                  manage billing.
                </p>
                <p className="mt-4">
                  For businesses with specific compliance needs, we offer custom data retention
                  policies, dedicated infrastructure options, and support for regulatory
                  requirements. Visit our{' '}
                  <Link
                    href="/security"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    security page
                  </Link>{' '}
                  for detailed information about our security practices, or check our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    pricing page
                  </Link>{' '}
                  to see which plans include advanced security features.
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
                      q: 'Is chatbot data encrypted?',
                      a: "With a reputable provider, yes. Data should be encrypted both in transit (using TLS/HTTPS) and at rest (using AES-256 or equivalent encryption). This means conversation data is protected while being sent between the visitor\u2019s browser and the server, and also while stored in the database. Always ask your provider to confirm both types of encryption \u2014 some only encrypt data in transit, leaving stored conversations vulnerable.",
                    },
                    {
                      q: 'Who can see chat conversations?',
                      a: "Only you and authorized members of your team should have access to chat conversations. Your chatbot provider\u2019s support team may have access for debugging purposes, but a good provider will have strict internal access controls and audit logging. Ask about their data access policies and whether they use conversation data for training their own AI models. At VocUI, conversation data belongs to you and is never used to train our models.",
                    },
                    {
                      q: 'Is it GDPR compliant?',
                      a: "GDPR compliance depends on your implementation, not just the chatbot platform. You need to inform visitors that the chatbot collects data (via your privacy policy and cookie consent), provide a way for users to request data deletion, and ensure your chatbot provider stores data in a GDPR-compliant manner. Most reputable chatbot platforms provide the tools for GDPR compliance, but the responsibility for implementing it correctly sits with you as the business owner.",
                    },
                    {
                      q: 'Can I delete user data?',
                      a: "Yes, you should be able to delete individual chat sessions, all data from a specific user, or all conversation data entirely. This capability is required for GDPR and CCPA compliance. Check that your chatbot provider offers data deletion both through the dashboard interface and via API, so you can handle deletion requests quickly. Also ask about data retention policies \u2014 how long conversation data is stored by default and whether you can customize the retention period.",
                    },
                    {
                      q: 'What about HIPAA for healthcare?',
                      a: "HIPAA compliance adds significant requirements. If your chatbot may handle protected health information (PHI), your chatbot provider must sign a Business Associate Agreement (BAA) and meet HIPAA\u2019s technical safeguards: encryption, access controls, audit logging, and data integrity measures. Most general-purpose chatbot platforms are not HIPAA-compliant out of the box. If you\u2019re in healthcare, ask specifically about HIPAA compliance before deploying a chatbot that might handle patient information.",
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
