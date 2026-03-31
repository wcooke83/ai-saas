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
  title: 'AI Chatbots for Gyms and Fitness Studios | VocUI',
  description:
    'Gyms and fitness studios use AI chatbots to answer membership questions, share class schedules, and convert website visitors into members.',
  openGraph: {
    title: 'AI Chatbots for Gyms and Fitness Studios | VocUI',
    description:
      'Gyms and fitness studios use AI chatbots to answer membership questions, share class schedules, and convert website visitors into members.',
    url: 'https://vocui.com/blog/chatbot-for-fitness-studios',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbots for Gyms and Fitness Studios | VocUI',
    description:
      'Gyms and fitness studios use AI chatbots to answer membership questions, share class schedules, and convert website visitors into members.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-fitness-studios' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbots for Gyms and Fitness Studios',
      description:
        'Gyms and fitness studios use AI chatbots to answer membership questions, share class schedules, and convert website visitors into members.',
      url: 'https://vocui.com/blog/chatbot-for-fitness-studios',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-fitness-studios',
      },
      datePublished: '2026-04-01',
      dateModified: '2026-04-01',
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
          url: 'https://vocui.com/icon.png',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can the chatbot help with member retention, not just new signups?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Existing members use the chatbot for schedule questions ("When is the 6 AM HIIT class?"), policy questions ("Can I freeze my membership for a month?"), and facility information ("Do you have towel service?"). By answering these instantly instead of requiring a call or front desk visit, you reduce a common friction point that contributes to cancellations: the feeling that getting simple information is harder than it should be. A member who can check the schedule at 10 PM instead of calling during business hours stays more engaged.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does it work with Mindbody, Gymdesk, or other gym management software?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The chatbot does not directly integrate with gym management platforms like Mindbody, Gymdesk, Zen Planner, or Glofox. However, it works alongside them by answering questions and linking visitors to the right place. When someone asks "Can I book a trial class?" the chatbot explains your trial offer and shares a direct link to your Mindbody booking page or Gymdesk signup form. The visitor arrives at your booking system informed and ready to act, which increases conversion compared to a cold link.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if our pricing is not published online?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Many gyms prefer to discuss pricing in person or over the phone. Configure the chatbot to handle pricing questions by sharing general information about membership tiers and what each includes, then directing the visitor to schedule a tour or call your front desk for specific pricing. For example: "We offer three membership levels: Basic (gym floor access), Plus (gym + classes), and Premium (unlimited everything including personal training credits). For current rates and any promotions, visit us for a free tour or call (555) 123-4567." This keeps the conversation helpful without revealing prices online.',
          },
        },
        {
          '@type': 'Question',
          name: 'How often should I update the class schedule in the chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Update the schedule whenever it changes. If your schedule lives on your website and you link that URL as a knowledge source, re-scrape the URL each time the schedule updates — it takes two minutes. For studios that change schedules weekly or monthly, set a recurring reminder to refresh the knowledge base. An inaccurate schedule is worse than no schedule — a member who shows up for a class that was moved or cancelled will blame the chatbot and lose trust in it.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can it help during the New Year signup rush?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'January is the busiest month for gym signups, and the chatbot handles the surge without additional staffing. Update your knowledge base in late December with current promotions, new member offers, January class additions, and any waitlist policies. The chatbot answers the flood of "How much is a membership?" and "Do you offer a free trial?" questions instantly, freeing your front desk staff to focus on in-person tours, orientations, and creating a great first impression for new members walking through the door.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForFitnessStudiosPage() {
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
                Chatbot for Fitness Studios
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Use Case
                </span>
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  8 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                AI Chatbots for Gyms and Fitness Studios
              </h1>
            </header>

            {/* Featured snippet — question-first opening */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Can a chatbot actually help a gym sign up more members? When the #1 reason
                website visitors leave without joining is unanswered questions — pricing,
                class schedules, trial offers, cancellation policies — the answer is yes.
                A chatbot turns your gym&apos;s website from a static brochure into an
                interactive front desk that works at midnight.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 — the conversion gap */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Gap Between Website Visits and Membership Signups
                </h2>
                <p>
                  Fitness businesses — gyms, yoga studios, CrossFit boxes, Pilates studios,
                  martial arts schools — share a common growth challenge: converting website
                  visitors into members. According to <a href="https://www.keepme.ai/case-studies/north-america-fitness-industry-study/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Keepme</a>, over 50% of gym inquiries go completely unanswered — every missed question is a missed membership. A potential member visits your website, looks at the
                  class schedule, checks the pricing page, and then... leaves. They had a
                  question they couldn&apos;t find the answer to, weren&apos;t sure which
                  membership tier was right for a beginner, or wanted to know if you offer
                  a free trial.
                </p>
                <p className="mt-4">
                  Your front desk staff fields these questions all day via phone, email, and
                  walk-ins. But your website — where most potential members first encounter your
                  business — can&apos;t have a conversation. A chatbot changes that by turning
                  your website into an interactive experience where visitors ask specific
                  questions and get immediate answers. For fitness businesses on tight margins,
                  every visitor who gets their question answered is one more potential member
                  who stays on your site instead of bouncing to the gym down the street.
                </p>
              </section>

              {/* Section 2 — unique: class schedule chatbot example */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What a Class Schedule Conversation Looks Like
                </h2>
                <p>
                  The most common chatbot interaction for a fitness studio is about the
                  schedule. Here&apos;s how it handles a prospect exploring your classes:
                </p>

                {/* Example conversation — unique to fitness post */}
                <div className="mt-6 mb-6 space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-primary-100 dark:bg-primary-900/40 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-800 dark:text-secondary-200">
                        Do you have any yoga classes before work? I need to be done by 7:30 AM.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-800 dark:text-secondary-200">
                        Yes! We have two early morning yoga options: Vinyasa Flow at 6:00 AM
                        (Mon/Wed/Fri, 60 min with Sarah) and Power Yoga at 6:30 AM
                        (Tue/Thu, 45 min with Marcus). Both wrap up in time for a 7:30 start.
                        All classes are included with any membership level. Would you like to
                        try a free class to see which one you prefer?
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary-100 dark:bg-primary-900/40 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-800 dark:text-secondary-200">
                        Yes! How do I sign up for a trial?
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-800 dark:text-secondary-200">
                        Here&apos;s the link to book your free trial class: [booking link].
                        Just bring water and a mat (we have loaners if you need one). Arrive
                        5 minutes early so we can get you set up. See you there!
                      </p>
                    </div>
                  </div>
                </div>

                <p>
                  That conversation took 45 seconds and converted a curious visitor into a
                  trial booking. A static schedule page shows times — a chatbot matches the
                  visitor&apos;s constraints to specific classes, answers the follow-up, and
                  closes the trial signup in one conversation.
                </p>
              </section>

              {/* Section 3 — unique: member retention angle */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Beyond Signups: Using Chatbots for Member Retention
                </h2>
                <p>
                  According to <a href="https://wod.guru/blog/gym-membership-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Wod.guru</a>, 50% of new gym members quit within six months. While the chatbot&apos;s
                  most visible job is converting new signups, its retention impact is equally
                  important. Existing members interact with the chatbot for schedule questions,
                  policy inquiries, and facility information — the same questions that would
                  otherwise require a phone call or front desk visit.
                </p>
                <p className="mt-4">
                  A member checking the schedule at 10 PM decides whether to come tomorrow
                  morning. If they can&apos;t easily confirm the 6 AM class is still on, they
                  might skip it. A member wondering about the freeze policy during a vacation
                  shouldn&apos;t have to wait for business hours to find out. Each of these
                  small friction points, individually minor, compounds into the feeling that
                  your gym is harder to deal with than it should be — and that feeling drives
                  cancellations.
                </p>
                <p className="mt-4">
                  The chatbot eliminates these micro-frictions. Every question answered instantly
                  is one less reason for a member to feel friction with your business. Track
                  which questions existing members ask most to identify retention-relevant
                  content gaps on your website.
                </p>
              </section>

              {/* Section 4 — Mindbody/Gymdesk integration */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Working With Mindbody, Gymdesk, and Zen Planner
                </h2>
                <p>
                  Most fitness studios run their operations through gym management software —
                  Mindbody, Gymdesk, Zen Planner, Glofox, or similar platforms. A VocUI chatbot
                  doesn&apos;t directly integrate with these systems, but it works alongside
                  them by handling the conversation layer that precedes a booking or signup.
                </p>
                <p className="mt-4">
                  When someone asks &quot;Can I try a class before joining?&quot; the chatbot
                  explains your trial offer and provides a direct link to your Mindbody booking
                  page or Gymdesk signup form. The visitor arrives at your booking system
                  informed and ready to act. Configure your system prompt to include the correct
                  booking URLs for trial classes, membership signups, and personal training
                  sessions.
                </p>
                <p className="mt-4">
                  This is more effective than a standalone &quot;Book Now&quot; button because
                  the visitor has already had their questions answered. They know the class time
                  works, they know what to bring, they know the cancellation policy. The chatbot
                  warms the lead before handing them off to your booking system.
                </p>
              </section>

              {/* Section 5 — training content */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What Content to Load and How to Keep It Fresh
                </h2>
                <p>
                  Start with your website: membership options, class descriptions, schedule,
                  trainer bios, hours of operation, and facility information. VocUI scrapes your
                  site automatically. Your class schedule is critical — link to your live
                  schedule page so it stays current, and re-scrape when it changes.
                </p>
                <p className="mt-4">
                  Add policies that prospects ask about: cancellation terms, guest policies,
                  age requirements, and dress codes. Include current promotions so the chatbot
                  mentions them when relevant — a visitor asking about pricing should hear about
                  your new member discount if one is active.
                </p>
                <p className="mt-4">
                  Keep the knowledge base fresh. According to <a href="https://smarthealthclubs.com/blog/100-gym-membership-retention-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Smart Health Clubs</a>, 12% of all new gym memberships start in January — update before the New Year rush,
                  when seasonal schedules change, and when you run new promotions. An outdated
                  schedule or expired promotion erodes trust faster than having no chatbot at
                  all. Most gym owners have their chatbot live in 30-60 minutes. Check our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    pricing page
                  </Link>
                  {' '}to find the right plan for your studio, or see our guide on{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    adding a chatbot to your website
                  </Link>
                  .
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
                      q: 'Can the chatbot help with member retention, not just new signups?',
                      a: "Yes. Existing members use the chatbot for schedule questions (\u201CWhen is the 6 AM HIIT class?\u201D), policy questions (\u201CCan I freeze my membership for a month?\u201D), and facility information (\u201CDo you have towel service?\u201D). By answering these instantly instead of requiring a call or front desk visit, you reduce a common friction point that contributes to cancellations: the feeling that getting simple information is harder than it should be. A member who can check the schedule at 10 PM instead of calling during business hours stays more engaged.",
                    },
                    {
                      q: 'Does it work with Mindbody, Gymdesk, or other gym management software?',
                      a: "The chatbot does not directly integrate with gym management platforms like Mindbody, Gymdesk, Zen Planner, or Glofox. However, it works alongside them by answering questions and linking visitors to the right place. When someone asks \u201CCan I book a trial class?\u201D the chatbot explains your trial offer and shares a direct link to your Mindbody booking page or Gymdesk signup form. The visitor arrives at your booking system informed and ready to act, which increases conversion compared to a cold link.",
                    },
                    {
                      q: 'What if our pricing is not published online?',
                      a: "Many gyms prefer to discuss pricing in person or over the phone. Configure the chatbot to handle pricing questions by sharing general information about membership tiers and what each includes, then directing the visitor to schedule a tour or call your front desk for specific pricing. For example: \u201CWe offer three membership levels: Basic (gym floor access), Plus (gym + classes), and Premium (unlimited everything including personal training credits). For current rates and any promotions, visit us for a free tour or call (555) 123-4567.\u201D This keeps the conversation helpful without revealing prices online.",
                    },
                    {
                      q: 'How often should I update the class schedule in the chatbot?',
                      a: "Update the schedule whenever it changes. If your schedule lives on your website and you link that URL as a knowledge source, re-scrape the URL each time the schedule updates \u2014 it takes two minutes. For studios that change schedules weekly or monthly, set a recurring reminder to refresh the knowledge base. An inaccurate schedule is worse than no schedule \u2014 a member who shows up for a class that was moved or cancelled will blame the chatbot and lose trust in it.",
                    },
                    {
                      q: 'Can it help during the New Year signup rush?',
                      a: "January is the busiest month for gym signups, and the chatbot handles the surge without additional staffing. Update your knowledge base in late December with current promotions, new member offers, January class additions, and any waitlist policies. The chatbot answers the flood of \u201CHow much is a membership?\u201D and \u201CDo you offer a free trial?\u201D questions instantly, freeing your front desk staff to focus on in-person tours, orientations, and creating a great first impression for new members walking through the door.",
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
            <h2 className="text-2xl font-bold mb-3">See how gyms and studios use VocUI</h2>
            <p className="text-white/80 mb-2">
              Upload your class schedules and membership info, train a chatbot, and start converting website visitors into members.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free plan included. Most studios are live in under an hour.
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
            <p className="text-xs text-white/50 mt-4">Join 1,000+ businesses already using VocUI</p>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
