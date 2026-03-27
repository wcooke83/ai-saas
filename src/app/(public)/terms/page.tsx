import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';

export const metadata = {
  title: 'Terms of Service | VocUI',
  description: 'Terms of Service for VocUI - the rules governing use of our platform.',
};

export default function TermsPage() {
  return (
    <PageBackground>
      <Header cta={{ label: 'Sign In', href: '/login' }} />

      <main id="main-content">
      <ToolsHero
        badge="Legal"
        title="Terms of Service"
        description={`Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
        breadcrumbs={[
          { label: 'Terms of Service' },
        ]}
      />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">1. Acceptance of Terms</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              By accessing or using VocUI (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Service. These Terms constitute a legally binding agreement between you and VocUI.
            </p>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              We may update these Terms from time to time. We will notify you of material changes by posting the revised Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after changes are posted constitutes acceptance of the revised Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">2. Description of Service</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              VocUI provides AI-powered productivity tools including, but not limited to:
            </p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>AI Email Writer for generating professional emails</li>
              <li>AI Proposal Generator for creating business proposals</li>
              <li>AI Blog Writer for generating written content</li>
              <li>AI Ad Copy Generator for marketing content</li>
              <li>AI Meeting Notes Summarizer for meeting transcripts</li>
              <li>Custom AI Chatbot Builder with RAG-powered knowledge bases</li>
              <li>API access for integrating our tools into your applications</li>
            </ul>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              Our Service relies on third-party AI providers, including Anthropic (Claude) and OpenAI, to power content generation. The availability and performance of our Service may depend on the availability of these third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">3. Account Registration</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">To access certain features, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your account credentials and not share them with third parties</li>
              <li>Notify us immediately of any unauthorized access or security breach</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              You must be at least 16 years of age to create an account. By creating an account, you represent that you meet this age requirement. Authentication is managed through Supabase, our identity and database provider.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">4. Acceptable Use</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">You agree NOT to use the Service to:</p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>Generate content that is illegal, harmful, threatening, abusive, defamatory, or violates others&apos; rights</li>
              <li>Spam, harass, stalk, or deceive others</li>
              <li>Impersonate any person or entity, or falsely claim affiliation with any person or entity</li>
              <li>Attempt to gain unauthorized access to our systems, networks, or other users&apos; accounts</li>
              <li>Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of our technology</li>
              <li>Resell, sublicense, or redistribute our services without prior written permission</li>
              <li>Generate content that promotes violence, hate speech, discrimination, or exploitation</li>
              <li>Use automated tools (bots, scrapers) to access the Service in a manner that exceeds reasonable use or circumvents rate limits</li>
              <li>Upload malware, viruses, or any other malicious code</li>
              <li>Violate any applicable local, state, national, or international law or regulation</li>
            </ul>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              We reserve the right to investigate and take appropriate action against anyone who violates these provisions, including removing content, suspending or terminating accounts, and reporting violations to law enforcement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">5. AI-Generated Content</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">Regarding content generated through our Service:</p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>You retain ownership of the content you create using our tools, subject to any rights of third parties</li>
              <li>You are solely responsible for reviewing, editing, and verifying all generated content before use</li>
              <li>AI-generated content may contain errors, inaccuracies, or biases and should not be relied upon without human review</li>
              <li>We do not guarantee the accuracy, completeness, suitability, originality, or legality of any generated content</li>
              <li>You are responsible for ensuring that your use of generated content complies with all applicable laws, including intellectual property laws</li>
            </ul>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              Content is generated using AI models provided by Anthropic (Claude) and OpenAI. These providers may have their own terms and acceptable use policies that apply to the generated output. VocUI does not claim ownership of content you generate, but we retain a limited license to store and display it within your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">6. Subscription and Billing</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">For paid subscriptions:</p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>Subscription fees are billed in advance on a monthly or annual basis, depending on the plan you select</li>
              <li>Subscriptions automatically renew at the end of each billing period unless cancelled before the renewal date</li>
              <li>You can cancel your subscription at any time through your account dashboard; access continues until the end of the current billing period</li>
              <li>Refunds are provided at our discretion and in accordance with our refund policy</li>
              <li>We may change subscription pricing with at least 30 days&apos; prior notice; price changes take effect at the start of your next billing period</li>
              <li>Failed payments may result in suspension of your access to paid features</li>
            </ul>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              All payment processing is handled by Stripe, our third-party payment processor. By subscribing, you agree to Stripe&apos;s <a href="https://stripe.com/legal" className="text-primary-500 hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</a>. VocUI does not store your full credit card details; this information is managed securely by Stripe.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">7. Credits and Usage</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">Our credit-based system:</p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>Credits are consumed each time you generate content using our AI tools</li>
              <li>The number of credits consumed per generation varies by tool and AI model tier used</li>
              <li>Unused credits do not roll over to the next billing period unless your plan explicitly states otherwise</li>
              <li>Credit limits and allocations vary by subscription plan</li>
              <li>Additional credit packages may be available for purchase</li>
              <li>We reserve the right to modify credit allocations and consumption rates with reasonable notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">8. API Usage</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">If you use our API:</p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>You must keep your API keys secure, confidential, and not share them with unauthorized parties</li>
              <li>Rate limits apply based on your subscription plan; exceeding rate limits may result in throttled or rejected requests</li>
              <li>You are responsible for all activity that occurs using your API keys</li>
              <li>We may suspend or revoke API access for excessive, abusive, or unauthorized usage</li>
              <li>API access is subject to the same acceptable use policies as the web application</li>
              <li>You must not use the API to build a competing service without prior written consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">9. Custom Chatbots and Knowledge Bases</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              If you use our custom chatbot builder:
            </p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>You are responsible for ensuring you have the right to use any content uploaded as knowledge sources (URLs, PDFs, documents)</li>
              <li>Knowledge base content is processed into embeddings and stored on Supabase for retrieval-augmented generation (RAG)</li>
              <li>You are responsible for the responses your chatbot provides to end users</li>
              <li>Chatbot embed widgets are provided for integration into your websites; you must not use them in a manner that misleads end users about the AI nature of the responses</li>
              <li>We reserve the right to remove chatbots or knowledge sources that violate these Terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">10. Intellectual Property</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              All rights, title, and interest in and to the Service, including its design, code, features, trademarks, and documentation (excluding user-generated content), are and remain the exclusive property of VocUI. You may not copy, modify, distribute, sell, or create derivative works based on the Service without our prior written consent.
            </p>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              By submitting feedback, suggestions, or ideas about the Service, you grant VocUI a non-exclusive, royalty-free, worldwide, perpetual license to use and incorporate that feedback without obligation to you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">11. Third-Party Services</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              Our Service integrates with and relies on the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li><strong>Anthropic (Claude) and OpenAI:</strong> AI model providers that power content generation. Your use is subject to their respective terms of service and acceptable use policies.</li>
              <li><strong>Stripe:</strong> Payment processing for subscriptions and purchases. Stripe&apos;s terms govern payment-related interactions.</li>
              <li><strong>Supabase:</strong> Database, authentication, and vector embedding storage. Data is stored and processed according to Supabase&apos;s terms.</li>
              <li><strong>Vercel:</strong> Application hosting and deployment infrastructure.</li>
            </ul>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              VocUI is not responsible for the availability, performance, or actions of these third-party services. Outages or changes to third-party services may affect the functionality of our Service. We recommend reviewing the terms of service and privacy policies of these providers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">12. Disclaimer of Warranties</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. WE SPECIFICALLY DISCLAIM ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. WE MAKE NO WARRANTY REGARDING THE QUALITY, ACCURACY, TIMELINESS, OR COMPLETENESS OF ANY AI-GENERATED CONTENT.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">13. Limitation of Liability</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VOCUI AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, BUSINESS OPPORTUNITIES, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
            </p>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE EXCEED THE AMOUNT YOU HAVE PAID TO VOCUI IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">14. Indemnification</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              You agree to indemnify, defend, and hold harmless VocUI and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or in connection with: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any rights of a third party; or (d) any content you generate, upload, or distribute through the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">15. Account Termination</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              We may suspend or terminate your account and access to the Service at any time, with or without notice, for conduct that we believe:
            </p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>Violates these Terms or any applicable law</li>
              <li>Is harmful to other users, third parties, or the business interests of VocUI</li>
              <li>Involves fraudulent, abusive, or otherwise inappropriate activity</li>
            </ul>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              Upon termination, your right to use the Service ceases immediately. We may delete your account data within 30 days of termination, except where retention is required by law. Any outstanding fees owed at the time of termination remain your responsibility. You may terminate your account at any time by contacting us or through your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">16. Dispute Resolution</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              In the event of any dispute arising out of or relating to these Terms or the Service, you agree to first attempt to resolve the dispute informally by contacting us at <a href="mailto:legal@vocui.com" className="text-primary-500 hover:underline">legal@vocui.com</a>. We will attempt to resolve the dispute through good-faith negotiation within 30 days.
            </p>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              If the dispute cannot be resolved informally, either party may pursue resolution through binding arbitration administered in accordance with the rules of the American Arbitration Association. The arbitration shall be conducted in English and the arbitrator&apos;s decision shall be final and binding. You agree that any dispute resolution proceedings will be conducted on an individual basis and not as a class action or representative proceeding.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">17. Governing Law</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law principles. Any legal action or proceeding not subject to arbitration shall be brought exclusively in the federal or state courts located in Delaware.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">18. Severability</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              If any provision of these Terms is found to be unenforceable or invalid by a court of competent jurisdiction, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">19. Entire Agreement</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              These Terms, together with our <a href="/privacy" className="text-primary-500 hover:underline">Privacy Policy</a>, constitute the entire agreement between you and VocUI regarding your use of the Service and supersede all prior agreements, understandings, and communications, whether written or oral.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">20. Contact</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              For questions about these Terms of Service, contact us at:
            </p>
            <p className="text-[rgb(var(--text-primary))]">
              Email: <a href="mailto:legal@vocui.com" className="text-primary-500 hover:underline">legal@vocui.com</a>
            </p>
          </section>
        </div>
      </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
