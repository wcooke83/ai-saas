import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';

export const metadata: Metadata = {
  title: 'Sitemap | VocUI',
  description: 'All pages on vocui.com — product, solutions, resources, and company information.',
  alternates: { canonical: 'https://vocui.com/sitemap' },
  robots: { index: true, follow: true },
};

const sections = [
  {
    heading: 'Product',
    links: [
      { label: 'Home', href: '/', description: 'AI chatbot platform overview' },
      { label: 'Pricing', href: '/pricing', description: 'Plans and pricing' },
      { label: 'SDK & API', href: '/sdk', description: 'Developer documentation and REST API' },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { label: 'Customer Support Chatbot', href: '/chatbot-for-customer-support', description: 'Automate repetitive support tickets' },
      { label: 'Lead Capture Chatbot', href: '/chatbot-for-lead-capture', description: 'Turn website visitors into leads' },
      { label: 'Appointment Booking Chatbot', href: '/chatbot-booking', description: 'In-chat scheduling and calendar booking' },
      { label: 'Knowledge Base Chatbot', href: '/knowledge-base-chatbot', description: 'Train on your own docs and PDFs' },
      { label: 'Slack Chatbot', href: '/slack-chatbot', description: 'Deploy to your Slack workspace' },
    ],
  },
  {
    heading: 'Industries',
    links: [
      { label: 'Chatbot for Law Firms', href: '/chatbot-for-lawyers', description: 'Client intake and legal FAQ automation' },
      { label: 'Chatbot for Healthcare', href: '/chatbot-for-healthcare', description: 'Patient FAQ and appointment booking' },
      { label: 'Chatbot for Real Estate', href: '/chatbot-for-real-estate', description: '24/7 lead capture and viewing bookings' },
      { label: 'Chatbot for E-commerce', href: '/chatbot-for-ecommerce', description: 'Product Q&A and support deflection' },
    ],
  },
  {
    heading: 'Compare',
    links: [
      { label: 'VocUI vs Intercom', href: '/vs-intercom', description: 'Feature and pricing comparison' },
      { label: 'VocUI vs Tidio', href: '/vs-tidio', description: 'Feature and pricing comparison' },
    ],
  },
  {
    heading: 'Blog',
    links: [
      { label: 'Blog', href: '/blog', description: 'Guides and tips for small business owners' },
      { label: 'How to Add a Chatbot to Your Website', href: '/blog/how-to-add-chatbot-to-website', description: 'Step-by-step embed guide, no coding required' },
      { label: 'How to Train a Chatbot on Your Own Data', href: '/blog/how-to-train-chatbot-on-your-own-data', description: 'Upload PDFs, URLs, and docs to your chatbot' },
      { label: '5 Chatbase Alternatives', href: '/blog/chatbase-alternatives', description: 'Compare the top AI chatbot builders' },
      { label: 'How to Reduce Customer Support Tickets', href: '/blog/how-to-reduce-customer-support-tickets', description: 'Deflect repetitive tickets with AI' },
      { label: 'What Is a Knowledge Base Chatbot?', href: '/blog/what-is-a-knowledge-base-chatbot', description: 'How it works and when to use one' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation', href: '/wiki', description: 'Guides and tutorials' },
      { label: 'Help Center', href: '/help', description: 'Support and contact options' },
      { label: 'FAQ', href: '/faq', description: 'Frequently asked questions' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about', description: 'Who we are and why we built VocUI' },
      { label: 'Contact', href: '/contact', description: 'Get in touch with our team' },
      { label: 'Security', href: '/security', description: 'Data handling and compliance' },
      { label: 'Changelog', href: '/changelog', description: 'Recent product updates' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy', description: 'How we handle your data' },
      { label: 'Terms of Service', href: '/terms', description: 'Terms governing use of VocUI' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <PageBackground>
      <Header />

      <main id="main-content">
        <section className="container mx-auto px-4 pt-16 pb-12 max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-[rgb(var(--text-heading))] mb-3">
            Sitemap
          </h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-400">
            All pages on vocui.com.
          </p>
        </section>

        <section className="container mx-auto px-4 pb-20 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary-500 dark:text-secondary-400 mb-4">
                  {section.heading}
                </h2>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex flex-col gap-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                      >
                        <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {link.label}
                        </span>
                        <span className="text-xs text-secondary-500 dark:text-secondary-400">
                          {link.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}
