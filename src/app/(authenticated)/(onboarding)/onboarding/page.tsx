import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function OnboardingEntryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check for an in-progress onboarding chatbot
  // Note: onboarding_step column exists in DB but not yet in generated types
  const { data: onboardingBots } = await supabase
    .from('chatbots')
    .select('id, onboarding_step')
    .eq('user_id', user.id)
    .not('onboarding_step', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1) as { data: Array<{ id: string; onboarding_step: number }> | null };

  if (onboardingBots && onboardingBots.length > 0) {
    const bot = onboardingBots[0];
    redirect(`/onboarding/${bot.id}/step/${bot.onboarding_step}`);
  }

  // No in-progress onboarding. Check if the user has any chatbots at all.
  const { count } = await supabase
    .from('chatbots')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // User already has chatbots (all with completed onboarding) -- they shouldn't
  // land on the onboarding entry. Send them to the dashboard.
  if (count && count > 0) {
    redirect('/dashboard');
  }

  // New user with 0 chatbots -- show step 1 for a new chatbot
  redirect('/onboarding/new/step/1');
}
