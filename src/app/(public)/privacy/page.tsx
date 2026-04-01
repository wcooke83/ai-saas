import type { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { HeroWaveform } from '@/components/ui/hero-waveform';
import { PrivacyHero } from './privacy-hero';
import { StyledBulletList } from '@/components/blog/styled-lists';

export const metadata: Metadata = {
  title: 'Privacy Policy | VocUI',
  description: 'Privacy policy for VocUI - how we collect, use, and protect your data.',
  alternates: { canonical: 'https://vocui.com/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <PageBackground>
      <HeroWaveform className="fixed inset-0 z-[1] pointer-events-none" />
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Privacy Policy | VocUI',
            description: 'Privacy policy for VocUI - how we collect, use, and protect your data.',
            url: 'https://vocui.com/privacy',
            publisher: {
              '@type': 'Organization',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
          }),
        }}
      />

      <main id="main-content" className="relative z-[2]">
        <PrivacyHero />

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
              <StyledBulletList items={[
                'Create an account (email address, name)',
                'Subscribe to our services (billing information)',
                'Contact us for support',
                'Use our tools (input data for generation)',
              ]} />

              <h3 className="text-lg font-medium text-[rgb(var(--text-heading))] mb-2">Automatically Collected Information</h3>
              <p className="text-[rgb(var(--text-primary))] mb-4">
                When you access our services, we may automatically collect:
              </p>
              <StyledBulletList items={[
                'Device information (browser type, operating system)',
                'Log data (IP address, access times, pages viewed)',
                'Usage data (features used, generation history)',
              ]} />
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">3. How We Use Your Information</h2>
              <p className="text-[rgb(var(--text-primary))] mb-4">We use the collected information to:</p>
              <StyledBulletList items={[
                'Provide, operate, and maintain our services',
                'Process transactions and send related information',
                'Send administrative information and updates',
                'Respond to inquiries and offer support',
                'Monitor and analyze usage patterns',
                'Improve our services and develop new features',
                'Protect against fraudulent or illegal activity',
              ]} />
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">4. AI-Generated Content and Third-Party AI Providers</h2>
              <p className="text-[rgb(var(--text-primary))] mb-4">
                When you use our tools, your input data is processed to generate content. We want you to know:
              </p>
              <StyledBulletList items={[
                'Your input data is used solely to generate the requested output',
                'We do not use your input data to train our AI models',
                'Generated content is stored in your account for your convenience',
                'You can delete your generation history at any time',
              ]} />
              <p className="text-[rgb(var(--text-primary))] mb-4">
                To provide AI-powered features, your input data is transmitted via encrypted API calls to third-party AI providers, including Anthropic (Claude) and OpenAI. These providers process your data solely to generate responses and are contractually prohibited from using your data to train their models. We do not grant these providers persistent access to your data. Please refer to their respective privacy policies for further details on how they handle data received through their APIs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-[rgb(var(--text-primary))] mb-4">
                We may share your information in the following circumstances:
              </p>
              <StyledBulletList items={[
                { title: 'AI Providers:', description: 'Your tool input data is sent via encrypted API calls to Anthropic and OpenAI to generate AI-powered content (see Section 4)' },
                { title: 'Payment Processor:', description: 'Billing and payment information is transmitted to Stripe via their secure API for transaction processing. Stripe acts as an independent data controller for payment data. See Stripe\u2019s privacy policy for details.' },
                { title: 'Hosting and Infrastructure:', description: 'Your data is stored and processed on Supabase (database and authentication) and Vercel (application hosting). These providers access data only as needed to deliver their services under contractual data processing agreements.' },
                { title: 'Legal Requirements:', description: 'When required by law, regulation, legal process, or enforceable governmental request, or to protect our rights, property, or safety' },
                { title: 'Business Transfers:', description: 'In connection with a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity' },
                { title: 'With Your Consent:', description: 'When you have given us explicit permission to share your information' },
              ]} />
              <p className="text-[rgb(var(--text-primary))] mb-4">
                In all cases, data is shared via secure, encrypted connections (TLS/HTTPS). We do not sell your personal information to any third party.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">6. Data Security</h2>
              <p className="text-[rgb(var(--text-primary))] mb-4">
                We implement appropriate technical and organizational measures to protect your personal information, including:
              </p>
              <StyledBulletList items={[
                'Encryption of data in transit and at rest',
                'Regular security assessments',
                'Access controls and authentication',
                'Secure data centers',
              ]} />
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">7. Data Retention</h2>
              <p className="text-[rgb(var(--text-primary))] mb-4">
                We retain your personal information for as long as your account is active or as needed to provide you with our services. Specifically:
              </p>
              <StyledBulletList items={[
                { title: 'Account data:', description: 'Retained until you delete your account' },
                { title: 'Generation history:', description: 'Retained until you manually delete it or close your account' },
                { title: 'Chat sessions and messages:', description: 'Retained until you delete them or close your account' },
                { title: 'Usage and log data:', description: 'Retained for up to 12 months for analytics and security purposes' },
                { title: 'Billing records:', description: 'Retained as required by applicable tax and financial regulations' },
              ]} />
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
              <StyledBulletList items={[
                'Access your personal information',
                'Correct inaccurate data',
                'Request deletion of your data',
                'Export your data',
                'Opt-out of marketing communications',
              ]} />
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[rgb(var(--text-heading))] mb-4">10. Cookies and Tracking Technologies</h2>
              <p className="text-[rgb(var(--text-primary))] mb-4">
                We use cookies and similar technologies to enhance your experience. The types of cookies we use include:
              </p>
              <StyledBulletList items={[
                { title: 'Essential cookies:', description: 'Required for authentication, session management, and core functionality. These cannot be disabled.' },
                { title: 'Analytics cookies:', description: 'Help us understand how visitors interact with our services so we can improve them.' },
                { title: 'Preference cookies:', description: 'Remember your settings and preferences (e.g., theme, language).' },
              ]} />
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

      <div className="relative z-[2]">
        <Footer />
      </div>
    </PageBackground>
  );
}
