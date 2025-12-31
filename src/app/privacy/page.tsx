import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | AI SaaS Tools',
  description: 'Privacy policy for AI SaaS Tools - how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">Privacy Policy</h1>
        <p className="text-secondary-500 dark:text-secondary-400 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-secondary max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">1. Introduction</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              AI SaaS Tools (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-secondary-800 dark:text-secondary-200 mb-2">Personal Information</h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              We may collect personal information that you voluntarily provide when you:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>Create an account (email address, name)</li>
              <li>Subscribe to our services (billing information)</li>
              <li>Contact us for support</li>
              <li>Use our AI tools (input data for generation)</li>
            </ul>

            <h3 className="text-lg font-medium text-secondary-800 dark:text-secondary-200 mb-2">Automatically Collected Information</h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              When you access our services, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>Device information (browser type, operating system)</li>
              <li>Log data (IP address, access times, pages viewed)</li>
              <li>Usage data (features used, generation history)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">3. How We Use Your Information</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>Provide, operate, and maintain our services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information and updates</li>
              <li>Respond to inquiries and offer support</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Improve our services and develop new features</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">4. AI-Generated Content</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              When you use our AI tools, your input data is processed to generate content. We want you to know:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>Your input data is used solely to generate the requested output</li>
              <li>We do not use your input data to train our AI models</li>
              <li>Generated content is stored in your account for your convenience</li>
              <li>You can delete your generation history at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li><strong>Service Providers:</strong> With third parties that help us operate our services (e.g., payment processors, hosting providers)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you have given us permission to share</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">6. Data Security</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure data centers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">7. Your Rights</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-4 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">8. Cookies</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              We use cookies and similar technologies to enhance your experience. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">9. Changes to This Policy</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">10. Contact Us</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-secondary-600 dark:text-secondary-400">
              Email: <a href="mailto:privacy@aisaastools.com" className="text-primary-500 hover:underline">privacy@aisaastools.com</a>
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
