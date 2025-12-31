import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | AI SaaS Tools',
  description: 'Terms of Service for AI SaaS Tools - the rules governing use of our platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-secondary-950">
      {/* Header */}
      <header className="border-b border-secondary-200 dark:border-secondary-800 bg-white dark:bg-secondary-900 sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">Terms of Service</h1>
        <p className="text-secondary-500 dark:text-secondary-400 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-secondary max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">1. Acceptance of Terms</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              By accessing or using AI SaaS Tools (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">2. Description of Service</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              AI SaaS Tools provides AI-powered productivity tools including, but not limited to:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>AI Email Writer for generating professional emails</li>
              <li>AI Proposal Generator for creating business proposals</li>
              <li>API access for integrating our tools into your applications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">3. Account Registration</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">To access certain features, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">4. Acceptable Use</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">You agree NOT to use the Service to:</p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>Generate content that is illegal, harmful, or violates others&apos; rights</li>
              <li>Spam, harass, or deceive others</li>
              <li>Impersonate any person or entity</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Reverse engineer or copy our technology</li>
              <li>Resell or redistribute our services without permission</li>
              <li>Generate content that promotes violence, hate, or discrimination</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">5. AI-Generated Content</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">Regarding content generated through our Service:</p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>You retain ownership of the content you create using our tools</li>
              <li>You are responsible for reviewing and editing generated content</li>
              <li>AI-generated content may not be perfect and should be verified</li>
              <li>We do not guarantee the accuracy, suitability, or legality of generated content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">6. Subscription and Payments</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">For paid subscriptions:</p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>Fees are billed in advance on a monthly or annual basis</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You can cancel at any time; access continues until period end</li>
              <li>Refunds are provided according to our refund policy</li>
              <li>We may change pricing with 30 days notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">7. Credits and Usage</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">Our credit-based system:</p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>Credits are consumed when you generate content</li>
              <li>Unused credits do not roll over to the next billing period</li>
              <li>Credit limits vary by subscription plan</li>
              <li>We reserve the right to modify credit allocations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">8. API Usage</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">If you use our API:</p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>You must keep your API keys secure and confidential</li>
              <li>Rate limits apply based on your subscription plan</li>
              <li>You may not share API access with unauthorized parties</li>
              <li>We may suspend access for excessive or abusive usage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">9. Intellectual Property</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              All rights, title, and interest in the Service (excluding user content) belong to AI SaaS Tools. You may not copy, modify, or create derivative works from our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">10. Limitation of Liability</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, AI SAAS TOOLS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">11. Disclaimer of Warranties</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">12. Termination</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              We may suspend or terminate your access at any time for violation of these terms. Upon termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">13. Changes to Terms</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">14. Governing Law</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              These terms shall be governed by the laws of the jurisdiction in which AI SaaS Tools is incorporated, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">15. Contact</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              For questions about these Terms of Service, contact us at:
            </p>
            <p className="text-secondary-600 dark:text-secondary-400">
              Email: <a href="mailto:legal@aisaastools.com" className="text-primary-500 hover:underline">legal@aisaastools.com</a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary-200 dark:border-secondary-800 bg-white dark:bg-secondary-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            &copy; {new Date().getFullYear()} AI SaaS Tools. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
