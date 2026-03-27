import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';

export const metadata = {
  title: 'Privacy Policy | VocUI',
  description: 'Privacy policy for VocUI - how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <PageBackground>
      <Header cta={{ label: 'Sign In', href: '/login' }} />

      <main id="main-content">
      <ToolsHero
        badge="Legal"
        title="Privacy Policy"
        description={`Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
        breadcrumbs={[
          { label: 'Privacy Policy' },
        ]}
      />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">1. Introduction</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              VocUI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-[rgb(var(--text-heading))] mb-2">Personal Information</h3>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              We may collect personal information that you voluntarily provide when you:
            </p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>Create an account (email address, name)</li>
              <li>Subscribe to our services (billing information)</li>
              <li>Contact us for support</li>
              <li>Use our tools (input data for generation)</li>
            </ul>

            <h3 className="text-lg font-medium text-[rgb(var(--text-heading))] mb-2">Automatically Collected Information</h3>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              When you access our services, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>Device information (browser type, operating system)</li>
              <li>Log data (IP address, access times, pages viewed)</li>
              <li>Usage data (features used, generation history)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">3. How We Use Your Information</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
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
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">4. AI-Generated Content and Third-Party AI Providers</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              When you use our tools, your input data is processed to generate content. We want you to know:
            </p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>Your input data is used solely to generate the requested output</li>
              <li>We do not use your input data to train our AI models</li>
              <li>Generated content is stored in your account for your convenience</li>
              <li>You can delete your generation history at any time</li>
            </ul>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              To provide AI-powered features, your input data is transmitted via encrypted API calls to third-party AI providers, including Anthropic (Claude) and OpenAI. These providers process your data solely to generate responses and are contractually prohibited from using your data to train their models. We do not grant these providers persistent access to your data. Please refer to their respective privacy policies for further details on how they handle data received through their APIs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li><strong>AI Providers:</strong> Your tool input data is sent via encrypted API calls to Anthropic and OpenAI to generate AI-powered content (see Section 4)</li>
              <li><strong>Payment Processor:</strong> Billing and payment information is transmitted to Stripe via their secure API for transaction processing. Stripe acts as an independent data controller for payment data. See Stripe&apos;s privacy policy for details.</li>
              <li><strong>Hosting and Infrastructure:</strong> Your data is stored and processed on Supabase (database and authentication) and Vercel (application hosting). These providers access data only as needed to deliver their services under contractual data processing agreements.</li>
              <li><strong>Legal Requirements:</strong> When required by law, regulation, legal process, or enforceable governmental request, or to protect our rights, property, or safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity</li>
              <li><strong>With Your Consent:</strong> When you have given us explicit permission to share your information</li>
            </ul>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              In all cases, data is shared via secure, encrypted connections (TLS/HTTPS). We do not sell your personal information to any third party.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">6. Data Security</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              We implement appropriate technical and organizational measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure data centers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">7. Data Retention</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              We retain your personal information for as long as your account is active or as needed to provide you with our services. Specifically:
            </p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li><strong>Account data:</strong> Retained until you delete your account</li>
              <li><strong>Generation history:</strong> Retained until you manually delete it or close your account</li>
              <li><strong>Chat sessions and messages:</strong> Retained until you delete them or close your account</li>
              <li><strong>Usage and log data:</strong> Retained for up to 12 months for analytics and security purposes</li>
              <li><strong>Billing records:</strong> Retained as required by applicable tax and financial regulations</li>
            </ul>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              Upon account deletion, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., fraud prevention, legal compliance).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">8. International Data Transfers</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              Our services and third-party providers operate in various countries, including the United States. If you are accessing our services from outside the United States, your data may be transferred to, stored, and processed in the United States or other jurisdictions where our service providers maintain facilities.
            </p>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              We ensure that such transfers comply with applicable data protection laws by implementing appropriate safeguards, including standard contractual clauses and data processing agreements with our providers. By using our services, you acknowledge that your data may be transferred internationally.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">9. Your Rights</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">10. Cookies and Tracking Technologies</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              We use cookies and similar technologies to enhance your experience. The types of cookies we use include:
            </p>
            <ul className="list-disc pl-6 text-[rgb(var(--text-primary))] mb-4 space-y-2">
              <li><strong>Essential cookies:</strong> Required for authentication, session management, and core functionality. These cannot be disabled.</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our services so we can improve them.</li>
              <li><strong>Preference cookies:</strong> Remember your settings and preferences (e.g., theme, language).</li>
            </ul>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              You can manage or disable non-essential cookies through your browser settings. Disabling certain cookies may affect the functionality of our services. We do not use cookies for third-party advertising.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">11. Children&apos;s Privacy</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              Our services are not intended for children under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete that information promptly. If you believe a child under 16 has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">12. Changes to This Policy</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">13. Contact Us</h2>
            <p className="text-[rgb(var(--text-primary))] mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-[rgb(var(--text-primary))]">
              Email: <a href="mailto:privacy@vocui.com" className="text-primary-500 hover:underline">privacy@vocui.com</a>
            </p>
          </section>
        </div>
      </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
