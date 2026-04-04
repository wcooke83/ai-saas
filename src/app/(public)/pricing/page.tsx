import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import type { SubscriptionPlan } from '@/types/billing';
import PricingClient from './pricing-client';

export const metadata: Metadata = {
  title: 'Pricing | AI Chatbot Plans — Free to $79/mo | VocUI',
  description:
    'VocUI Pro is now $79/mo — down from $149. Build AI chatbots with Slack, Telegram, branding removal, and API access. Start free, no credit card required.',
  openGraph: {
    title: 'Pricing | AI Chatbot Plans — Free to $79/mo | VocUI',
    description:
      'VocUI Pro is now $79/mo — down from $149. Build AI chatbots with Slack, Telegram, branding removal, and API access. Start free, no credit card required.',
    url: 'https://vocui.com/pricing',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | AI Chatbot Plans — Free to $79/mo | VocUI',
    description:
      'VocUI Pro is now $79/mo — down from $149. Build AI chatbots with Slack, Telegram, branding removal, and API access. Start free, no credit card required.',
  },
  alternates: { canonical: 'https://vocui.com/pricing' },
  robots: { index: true, follow: true },
};

export const revalidate = 3600; // revalidate every hour

export default async function PricingPage() {
  let plans: SubscriptionPlan[] = [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .eq('is_hidden', false)
      .order('display_order', { ascending: true });

    plans = (data as SubscriptionPlan[]) ?? [];
  } catch (error) {
    console.error('Error fetching plans:', error);
  }

  return <PricingClient plans={plans} />;
}
