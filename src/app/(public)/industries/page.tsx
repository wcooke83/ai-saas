import type { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';

import { IndustriesHero } from './industries-hero';
import { IndustriesCategoryNav } from './industries-category-nav';
import { IndustrySections } from './industries-sections';
import { IndustriesMidCta } from './industries-mid-cta';
import { IndustriesCta } from './industries-cta';

// ─── SEO Metadata ──────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'AI Chatbot Solutions by Industry | VocUI',
  description:
    'VocUI builds AI chatbots trained on your knowledge base — purpose-built for over 50 industries from healthcare and legal to hospitality, retail, and beyond. Same platform, industry-specific results.',
  keywords: [
    'industry chatbot',
    'AI chatbot for business',
    'chatbot for law firms',
    'chatbot for healthcare',
    'chatbot for restaurants',
    'chatbot for dentists',
  ],
  openGraph: {
    title: 'AI Chatbot Solutions by Industry | VocUI',
    description:
      'VocUI builds AI chatbots trained on your knowledge base — purpose-built for over 50 industries. Same platform, industry-specific results.',
    url: 'https://vocui.com/industries',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot Solutions by Industry | VocUI',
    description: 'VocUI builds AI chatbots for over 50 industries — trained on your knowledge base and deployed in minutes.',
  },
  alternates: { canonical: 'https://vocui.com/industries' },
  robots: { index: true, follow: true },
};

// ─── Utility: slugify group labels to URL-safe anchors ─────────────────────────

function toAnchor(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Industry Groups ───────────────────────────────────────────────────────────

const groups: { label: string; industries: { iconName: string; label: string; href: string; description: string }[] }[] = [
  {
    label: 'Health & Wellness',
    industries: [
      { iconName: 'Activity', label: 'Healthcare', href: '/chatbot-for-healthcare', description: 'Patient FAQ, insurance questions, and appointment booking — 24/7.' },
      { iconName: 'Smile', label: 'Dentists', href: '/chatbot-for-dentists', description: 'Appointment booking, insurance FAQ, and patient preparation guides.' },
      { iconName: 'Stethoscope', label: 'Chiropractors', href: '/chatbot-for-chiropractors', description: 'New patient intake, treatment FAQ, and appointment booking.' },
      { iconName: 'Glasses', label: 'Optometrists', href: '/chatbot-for-optometrists', description: 'Eye exam booking and product FAQ automation.' },
      { iconName: 'Pill', label: 'Pharmacies', href: '/chatbot-for-pharmacies', description: 'Prescription FAQ and refill support for pharmacy customers.' },
      { iconName: 'PawPrint', label: 'Veterinarians', href: '/chatbot-for-veterinarians', description: 'Appointment booking, pet care FAQ, and after-hours triage.' },
      { iconName: 'Heart', label: 'Therapists', href: '/chatbot-for-therapists', description: 'Service FAQ and appointment scheduling for therapy practices.' },
      { iconName: 'Sparkles', label: 'Plastic Surgeons', href: '/chatbot-for-plastic-surgeons', description: 'Procedure FAQ and consultation booking for aesthetic practices.' },
    ],
  },
  {
    label: 'Legal & Finance',
    industries: [
      { iconName: 'Scale', label: 'Law Firms', href: '/chatbot-for-lawyers', description: 'Client intake, practice area FAQ, and consultation booking.' },
      { iconName: 'FileText', label: 'Immigration Lawyers', href: '/chatbot-for-immigration-lawyers', description: 'Visa category FAQ and consultation booking — no legal advice given.' },
      { iconName: 'Calculator', label: 'Accountants', href: '/chatbot-for-accountants', description: 'Tax FAQ and client intake automation.' },
      { iconName: 'Building', label: 'Accountancy Firms', href: '/chatbot-for-accountancy-firms', description: 'Services FAQ and new client intake for accounting practices.' },
      { iconName: 'TrendingUp', label: 'Financial Advisors', href: '/chatbot-for-financial-advisors', description: 'Service FAQ and consultation booking for financial advisers.' },
      { iconName: 'ShieldCheck', label: 'Insurance Agents', href: '/chatbot-for-insurance-agents', description: 'Policy FAQ and quote lead capture for insurance professionals.' },
      { iconName: 'Banknote', label: 'Mortgage Brokers', href: '/chatbot-for-mortgage-brokers', description: 'Rate FAQ and application lead capture for mortgage brokers.' },
      { iconName: 'Banknote', label: 'Mortgage Lenders', href: '/chatbot-for-mortgage-lenders', description: 'Loan FAQ and pre-qualification lead capture for lenders.' },
    ],
  },
  {
    label: 'Hospitality & Food',
    industries: [
      { iconName: 'UtensilsCrossed', label: 'Restaurants', href: '/chatbot-for-restaurants', description: 'Reservations, menus, and hours FAQ for hospitality businesses.' },
      { iconName: 'Hotel', label: 'Hotels', href: '/chatbot-for-hotels', description: 'Booking support and amenities FAQ for hotels and accommodation.' },
      { iconName: 'Plane', label: 'Travel Agencies', href: '/chatbot-for-travel-agencies', description: 'Destination FAQ and booking lead capture for travel professionals.' },
    ],
  },
  {
    label: 'Fitness & Wellness',
    industries: [
      { iconName: 'Dumbbell', label: 'Gyms', href: '/chatbot-for-gyms', description: 'Membership FAQ and class booking for gym businesses.' },
      { iconName: 'Waves', label: 'Fitness Studios', href: '/chatbot-for-fitness-studios', description: 'Class booking and membership FAQ for boutique fitness studios.' },
      { iconName: 'Wind', label: 'Yoga Studios', href: '/chatbot-for-yoga-studios', description: 'Class booking and membership FAQ for yoga studios.' },
      { iconName: 'Users', label: 'Personal Trainers', href: '/chatbot-for-personal-trainers', description: 'Session booking and program FAQ for personal trainers.' },
      { iconName: 'Droplets', label: 'Spas', href: '/chatbot-for-spas', description: 'Treatment booking and pricing FAQ for day spas and wellness centres.' },
      { iconName: 'Scissors', label: 'Salons', href: '/chatbot-for-salons', description: 'Appointment booking and services FAQ for hair and beauty salons.' },
      { iconName: 'PawPrint', label: 'Pet Grooming', href: '/chatbot-for-pet-grooming', description: 'Appointment booking and breed pricing FAQ for grooming salons.' },
    ],
  },
  {
    label: 'Home Services & Trades',
    industries: [
      { iconName: 'Wrench', label: 'Plumbers', href: '/chatbot-for-plumbers', description: 'Emergency booking and service FAQ for plumbing businesses.' },
      { iconName: 'Zap', label: 'Electricians', href: '/chatbot-for-electricians', description: 'Quote requests and services FAQ for electrical contractors.' },
      { iconName: 'Thermometer', label: 'HVAC Companies', href: '/chatbot-for-hvac', description: 'Maintenance booking and emergency support for HVAC businesses.' },
      { iconName: 'Leaf', label: 'Landscapers', href: '/chatbot-for-landscapers', description: 'Quote capture and seasonal services FAQ for landscaping businesses.' },
      { iconName: 'Sparkles', label: 'Cleaning Services', href: '/chatbot-for-cleaning-services', description: 'Booking and pricing FAQ for cleaning and property services.' },
    ],
  },
  {
    label: 'Automotive & Events',
    industries: [
      { iconName: 'Car', label: 'Car Dealerships', href: '/chatbot-for-car-dealerships', description: 'Vehicle FAQ and test drive booking for car dealerships.' },
      { iconName: 'Wrench', label: 'Auto Repair', href: '/chatbot-for-auto-repair', description: 'Service booking and repair FAQ for auto repair shops.' },
      { iconName: 'PartyPopper', label: 'Event Planners', href: '/chatbot-for-event-planners', description: 'Availability FAQ and consultation booking for event planners.' },
      { iconName: 'Heart', label: 'Wedding Venues', href: '/chatbot-for-wedding-venues', description: 'Booking inquiry and packages FAQ for wedding venues.' },
      { iconName: 'Camera', label: 'Photography Studios', href: '/chatbot-for-photography-studios', description: 'Package FAQ and session booking for photography businesses.' },
    ],
  },
  {
    label: 'Business Services & Agencies',
    industries: [
      { iconName: 'UserCheck', label: 'Recruiters', href: '/chatbot-for-recruiters', description: 'Job FAQ and candidate intake automation for recruitment firms.' },
      { iconName: 'UserCheck', label: 'HR Departments', href: '/chatbot-for-hr', description: 'Employee policy FAQ and onboarding support for HR teams.' },
      { iconName: 'Cpu', label: 'IT Support Teams', href: '/chatbot-for-it-support', description: 'Ticket deflection and troubleshooting FAQ for IT teams.' },
      { iconName: 'Layers', label: 'SaaS Companies', href: '/chatbot-for-saas', description: 'Product FAQ and trial lead capture for SaaS businesses.' },
      { iconName: 'Megaphone', label: 'Marketing Agencies', href: '/chatbot-for-marketing-agencies', description: 'Service FAQ and proposal lead capture for marketing agencies.' },
      { iconName: 'Globe', label: 'Web Design Agencies', href: '/chatbot-for-web-design-agencies', description: 'Project scoping and quote lead capture for web agencies.' },
    ],
  },
  {
    label: 'Education & Non-Profit',
    industries: [
      { iconName: 'BookOpen', label: 'Tutoring Centers', href: '/chatbot-for-tutoring-centers', description: 'Subject FAQ and enrollment booking for tutoring businesses.' },
      { iconName: 'GraduationCap', label: 'Universities', href: '/chatbot-for-universities', description: 'Admissions FAQ and course inquiry support for higher education.' },
      { iconName: 'Laptop', label: 'Online Course Creators', href: '/chatbot-for-online-courses', description: 'Course FAQ and enrollment lead capture for e-learning creators.' },
      { iconName: 'Heart', label: 'Non-Profits', href: '/chatbot-for-nonprofits', description: 'Donation FAQ and volunteer intake for charities and non-profits.' },
      { iconName: 'Church', label: 'Churches', href: '/chatbot-for-churches', description: 'Service times FAQ and event registration for faith communities.' },
      { iconName: 'Landmark', label: 'Government Agencies', href: '/chatbot-for-government', description: 'Services FAQ and document request guidance for public bodies.' },
    ],
  },
  {
    label: 'Property & Real Estate',
    industries: [
      { iconName: 'Home', label: 'Real Estate', href: '/chatbot-for-real-estate', description: '24/7 lead capture and viewing bookings for estate agents.' },
      { iconName: 'Key', label: 'Property Managers', href: '/chatbot-for-property-managers', description: 'Tenant FAQ and maintenance request intake for property managers.' },
    ],
  },
  {
    label: 'B2B, Logistics & Industry',
    industries: [
      { iconName: 'ShoppingBag', label: 'E-commerce', href: '/chatbot-for-ecommerce', description: 'Product Q&A and support deflection for online retailers.' },
      { iconName: 'Truck', label: 'Logistics Companies', href: '/chatbot-for-logistics', description: 'Shipment tracking FAQ and quote requests for logistics businesses.' },
      { iconName: 'Factory', label: 'Manufacturers', href: '/chatbot-for-manufacturers', description: 'Product spec FAQ and distributor lead capture for manufacturers.' },
      { iconName: 'ShoppingCart', label: 'Wholesale Suppliers', href: '/chatbot-for-wholesale', description: 'Product FAQ and bulk order lead capture for wholesale businesses.' },
    ],
  },
];

// ─── Derived data ──────────────────────────────────────────────────────────────

const allIndustries = groups.flatMap((g) => g.industries);
const totalCount = allIndustries.length;

const groupsWithAnchors = groups.map((g) => ({
  ...g,
  anchor: toAnchor(g.label),
}));

const categoryLinks = groupsWithAnchors.map((g) => ({
  label: g.label,
  anchor: g.anchor,
  count: g.industries.length,
}));

// ─── JSON-LD (preserved for SEO) ──────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'VocUI AI Chatbot Solutions by Industry',
  description: 'Industry-specific AI chatbot solutions built on the VocUI platform — trained on your knowledge base and deployed in minutes.',
  url: 'https://vocui.com/industries',
  itemListElement: allIndustries.map((industry, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `https://vocui.com${industry.href}`,
    name: industry.label,
  })),
};

// ─── Determine mid-CTA insertion point (after ~5 groups) ──────────────────────

const MID_CTA_AFTER = 5; // Insert CTA after this many groups

// Split groups into two halves for mid-CTA insertion
const firstHalf = groupsWithAnchors.slice(0, MID_CTA_AFTER);
const secondHalf = groupsWithAnchors.slice(MID_CTA_AFTER);

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function IndustriesIndexPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Header />

      <main id="main-content">
        {/* ── Hero: full viewport, display number, category pills ──────────── */}
        <IndustriesHero
          totalCount={totalCount}
          categories={categoryLinks}
        />

        {/* ── Sticky category nav (appears on scroll) ──────────────────────── */}
        <div id="categories">
          <IndustriesCategoryNav
            categories={categoryLinks.map((c) => ({ label: c.label, anchor: c.anchor }))}
          />
        </div>

        {/* ── First batch of industry sections ─────────────────────────────── */}
        <IndustrySections groups={firstHalf} />

        {/* ── Mid-page CTA interlude ───────────────────────────────────────── */}
        <IndustriesMidCta />

        {/* ── Second batch of industry sections ────────────────────────────── */}
        <IndustrySections groups={secondHalf} />

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <IndustriesCta />
      </main>

      <Footer />
    </PageBackground>
  );
}
