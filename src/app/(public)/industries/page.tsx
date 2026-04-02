import type { Metadata } from 'next';
import type { ElementType } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import {
  Scale, Activity, Home, ShoppingBag, ArrowRight,
  Stethoscope, Smile, Calculator, UtensilsCrossed, Hotel,
  Dumbbell, ShieldCheck, TrendingUp, Building, PawPrint,
  Scissors, Glasses, Pill, Users, UserCheck, Cpu, Layers,
  Megaphone, Globe, BookOpen, Zap, Thermometer, Leaf,
  Wind, Sparkles, Droplets, Car, Wrench, Plane, PartyPopper,
  Camera, GraduationCap, Laptop, Heart, Church, Landmark,
  Key, Banknote, Truck, Factory, ShoppingCart, Waves,
  FileText,
} from 'lucide-react';

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

// ─── Industry Groups ───────────────────────────────────────────────────────────

const groups: { label: string; industries: { icon: ElementType; label: string; href: string; description: string }[] }[] = [
  {
    label: 'Health & Wellness',
    industries: [
      { icon: Activity, label: 'Healthcare', href: '/chatbot-for-healthcare', description: 'Patient FAQ, insurance questions, and appointment booking — 24/7.' },
      { icon: Smile, label: 'Dentists', href: '/chatbot-for-dentists', description: 'Appointment booking, insurance FAQ, and patient preparation guides.' },
      { icon: Stethoscope, label: 'Chiropractors', href: '/chatbot-for-chiropractors', description: 'New patient intake, treatment FAQ, and appointment booking.' },
      { icon: Glasses, label: 'Optometrists', href: '/chatbot-for-optometrists', description: 'Eye exam booking and product FAQ automation.' },
      { icon: Pill, label: 'Pharmacies', href: '/chatbot-for-pharmacies', description: 'Prescription FAQ and refill support for pharmacy customers.' },
      { icon: PawPrint, label: 'Veterinarians', href: '/chatbot-for-veterinarians', description: 'Appointment booking, pet care FAQ, and after-hours triage.' },
      { icon: Heart, label: 'Therapists', href: '/chatbot-for-therapists', description: 'Service FAQ and appointment scheduling for therapy practices.' },
      { icon: Sparkles, label: 'Plastic Surgeons', href: '/chatbot-for-plastic-surgeons', description: 'Procedure FAQ and consultation booking for aesthetic practices.' },
    ],
  },
  {
    label: 'Legal & Finance',
    industries: [
      { icon: Scale, label: 'Law Firms', href: '/chatbot-for-lawyers', description: 'Client intake, practice area FAQ, and consultation booking.' },
      { icon: FileText, label: 'Immigration Lawyers', href: '/chatbot-for-immigration-lawyers', description: 'Visa category FAQ and consultation booking — no legal advice given.' },
      { icon: Calculator, label: 'Accountants', href: '/chatbot-for-accountants', description: 'Tax FAQ and client intake automation.' },
      { icon: Building, label: 'Accountancy Firms', href: '/chatbot-for-accountancy-firms', description: 'Services FAQ and new client intake for accounting practices.' },
      { icon: TrendingUp, label: 'Financial Advisors', href: '/chatbot-for-financial-advisors', description: 'Service FAQ and consultation booking for financial advisers.' },
      { icon: ShieldCheck, label: 'Insurance Agents', href: '/chatbot-for-insurance-agents', description: 'Policy FAQ and quote lead capture for insurance professionals.' },
      { icon: Banknote, label: 'Mortgage Brokers', href: '/chatbot-for-mortgage-brokers', description: 'Rate FAQ and application lead capture for mortgage brokers.' },
      { icon: Banknote, label: 'Mortgage Lenders', href: '/chatbot-for-mortgage-lenders', description: 'Loan FAQ and pre-qualification lead capture for lenders.' },
    ],
  },
  {
    label: 'Hospitality & Food',
    industries: [
      { icon: UtensilsCrossed, label: 'Restaurants', href: '/chatbot-for-restaurants', description: 'Reservations, menus, and hours FAQ for hospitality businesses.' },
      { icon: Hotel, label: 'Hotels', href: '/chatbot-for-hotels', description: 'Booking support and amenities FAQ for hotels and accommodation.' },
      { icon: Plane, label: 'Travel Agencies', href: '/chatbot-for-travel-agencies', description: 'Destination FAQ and booking lead capture for travel professionals.' },
    ],
  },
  {
    label: 'Fitness & Wellness',
    industries: [
      { icon: Dumbbell, label: 'Gyms', href: '/chatbot-for-gyms', description: 'Membership FAQ and class booking for gym businesses.' },
      { icon: Waves, label: 'Fitness Studios', href: '/chatbot-for-fitness-studios', description: 'Class booking and membership FAQ for boutique fitness studios.' },
      { icon: Wind, label: 'Yoga Studios', href: '/chatbot-for-yoga-studios', description: 'Class booking and membership FAQ for yoga studios.' },
      { icon: Users, label: 'Personal Trainers', href: '/chatbot-for-personal-trainers', description: 'Session booking and program FAQ for personal trainers.' },
      { icon: Droplets, label: 'Spas', href: '/chatbot-for-spas', description: 'Treatment booking and pricing FAQ for day spas and wellness centres.' },
      { icon: Scissors, label: 'Salons', href: '/chatbot-for-salons', description: 'Appointment booking and services FAQ for hair and beauty salons.' },
      { icon: PawPrint, label: 'Pet Grooming', href: '/chatbot-for-pet-grooming', description: 'Appointment booking and breed pricing FAQ for grooming salons.' },
    ],
  },
  {
    label: 'Home Services & Trades',
    industries: [
      { icon: Wrench, label: 'Plumbers', href: '/chatbot-for-plumbers', description: 'Emergency booking and service FAQ for plumbing businesses.' },
      { icon: Zap, label: 'Electricians', href: '/chatbot-for-electricians', description: 'Quote requests and services FAQ for electrical contractors.' },
      { icon: Thermometer, label: 'HVAC Companies', href: '/chatbot-for-hvac', description: 'Maintenance booking and emergency support for HVAC businesses.' },
      { icon: Leaf, label: 'Landscapers', href: '/chatbot-for-landscapers', description: 'Quote capture and seasonal services FAQ for landscaping businesses.' },
      { icon: Sparkles, label: 'Cleaning Services', href: '/chatbot-for-cleaning-services', description: 'Booking and pricing FAQ for cleaning and property services.' },
    ],
  },
  {
    label: 'Automotive & Events',
    industries: [
      { icon: Car, label: 'Car Dealerships', href: '/chatbot-for-car-dealerships', description: 'Vehicle FAQ and test drive booking for car dealerships.' },
      { icon: Wrench, label: 'Auto Repair', href: '/chatbot-for-auto-repair', description: 'Service booking and repair FAQ for auto repair shops.' },
      { icon: PartyPopper, label: 'Event Planners', href: '/chatbot-for-event-planners', description: 'Availability FAQ and consultation booking for event planners.' },
      { icon: Heart, label: 'Wedding Venues', href: '/chatbot-for-wedding-venues', description: 'Booking inquiry and packages FAQ for wedding venues.' },
      { icon: Camera, label: 'Photography Studios', href: '/chatbot-for-photography-studios', description: 'Package FAQ and session booking for photography businesses.' },
    ],
  },
  {
    label: 'Business Services & Agencies',
    industries: [
      { icon: UserCheck, label: 'Recruiters', href: '/chatbot-for-recruiters', description: 'Job FAQ and candidate intake automation for recruitment firms.' },
      { icon: UserCheck, label: 'HR Departments', href: '/chatbot-for-hr', description: 'Employee policy FAQ and onboarding support for HR teams.' },
      { icon: Cpu, label: 'IT Support Teams', href: '/chatbot-for-it-support', description: 'Ticket deflection and troubleshooting FAQ for IT teams.' },
      { icon: Layers, label: 'SaaS Companies', href: '/chatbot-for-saas', description: 'Product FAQ and trial lead capture for SaaS businesses.' },
      { icon: Megaphone, label: 'Marketing Agencies', href: '/chatbot-for-marketing-agencies', description: 'Service FAQ and proposal lead capture for marketing agencies.' },
      { icon: Globe, label: 'Web Design Agencies', href: '/chatbot-for-web-design-agencies', description: 'Project scoping and quote lead capture for web agencies.' },
    ],
  },
  {
    label: 'Education & Non-Profit',
    industries: [
      { icon: BookOpen, label: 'Tutoring Centers', href: '/chatbot-for-tutoring-centers', description: 'Subject FAQ and enrollment booking for tutoring businesses.' },
      { icon: GraduationCap, label: 'Universities', href: '/chatbot-for-universities', description: 'Admissions FAQ and course inquiry support for higher education.' },
      { icon: Laptop, label: 'Online Course Creators', href: '/chatbot-for-online-courses', description: 'Course FAQ and enrollment lead capture for e-learning creators.' },
      { icon: Heart, label: 'Non-Profits', href: '/chatbot-for-nonprofits', description: 'Donation FAQ and volunteer intake for charities and non-profits.' },
      { icon: Church, label: 'Churches', href: '/chatbot-for-churches', description: 'Service times FAQ and event registration for faith communities.' },
      { icon: Landmark, label: 'Government Agencies', href: '/chatbot-for-government', description: 'Services FAQ and document request guidance for public bodies.' },
    ],
  },
  {
    label: 'Property & Real Estate',
    industries: [
      { icon: Home, label: 'Real Estate', href: '/chatbot-for-real-estate', description: '24/7 lead capture and viewing bookings for estate agents.' },
      { icon: Key, label: 'Property Managers', href: '/chatbot-for-property-managers', description: 'Tenant FAQ and maintenance request intake for property managers.' },
    ],
  },
  {
    label: 'B2B, Logistics & Industry',
    industries: [
      { icon: ShoppingBag, label: 'E-commerce', href: '/chatbot-for-ecommerce', description: 'Product Q&A and support deflection for online retailers.' },
      { icon: Truck, label: 'Logistics Companies', href: '/chatbot-for-logistics', description: 'Shipment tracking FAQ and quote requests for logistics businesses.' },
      { icon: Factory, label: 'Manufacturers', href: '/chatbot-for-manufacturers', description: 'Product spec FAQ and distributor lead capture for manufacturers.' },
      { icon: ShoppingCart, label: 'Wholesale Suppliers', href: '/chatbot-for-wholesale', description: 'Product FAQ and bulk order lead capture for wholesale businesses.' },
    ],
  },
];

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const allIndustries = groups.flatMap((g) => g.industries);

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

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function IndustriesIndexPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Header />

      <main id="main-content" className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
            <li><Link href="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">Industries</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-14">
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            AI Chatbot Solutions by Industry
          </h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-3xl">
            VocUI works for any business that answers the same questions repeatedly. Train it on your
            documents, URLs, and FAQs — and deploy the same day. Choose your industry below to see
            exactly how VocUI works for you.
          </p>
        </div>

        {/* Industry groups */}
        <div className="space-y-16 mb-20">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="outline" className="text-sm">{group.label}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.industries.map((industry) => {
                  const Icon = industry.icon as ElementType;
                  return (
                    <Link key={industry.href} href={industry.href} className="group block">
                      <Card className="h-full border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200">
                        <CardHeader className="pb-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30 mb-2">
                            <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                          </div>
                          <CardTitle className="text-sm font-semibold leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {industry.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed mb-3">
                            {industry.description}
                          </p>
                          <span className="inline-flex items-center text-xs font-medium text-primary-600 dark:text-primary-400 gap-1 group-hover:gap-2 transition-all">
                            Learn more
                            <ArrowRight className="w-3 h-3" aria-hidden="true" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Generic CTA */}
        <div className="border-t border-secondary-200 dark:border-secondary-700 pt-14">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-3">
            Don&apos;t see your industry?
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-8 max-w-2xl">
            VocUI works for any business that answers the same questions repeatedly. Upload your
            documents or paste in your URLs — your chatbot is trained, embedded, and live in under
            an hour. No developers needed.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Build Your Chatbot Free
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
