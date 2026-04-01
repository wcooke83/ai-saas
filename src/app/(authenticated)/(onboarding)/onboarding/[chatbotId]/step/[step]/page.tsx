import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OnboardingStepClient } from './OnboardingStepClient';
import type { Chatbot } from '@/lib/chatbots/types';

interface PageProps {
  params: Promise<{ chatbotId: string; step: string }>;
}

export default async function OnboardingStepPage({ params }: PageProps) {
  const { chatbotId, step: stepStr } = await params;
  const step = parseInt(stepStr, 10);

  // Invalid step param -> redirect to onboarding entry instead of 404
  if (isNaN(step) || step < 1 || step > 5) {
    if (chatbotId !== 'new') {
      redirect(`/onboarding/${chatbotId}/step/1`);
    }
    redirect('/onboarding/new/step/1');
  }

  // "new" chatbotId means step 1 with no chatbot yet
  if (chatbotId === 'new') {
    if (step !== 1) {
      redirect('/onboarding/new/step/1');
    }
    return <OnboardingStepClient chatbot={null} step={1} />;
  }

  // Validate UUID format -- redirect to onboarding entry for invalid IDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(chatbotId)) {
    redirect('/onboarding');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Note: onboarding_step column exists in DB but not yet in generated types
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('*')
    .eq('id', chatbotId)
    .eq('user_id', user.id)
    .single() as { data: (Record<string, unknown> & { onboarding_step?: number | null }) | null };

  // Chatbot deleted or doesn't belong to user -> redirect to onboarding entry
  if (!chatbot) {
    redirect('/onboarding');
  }

  // If onboarding is already complete, send to dashboard
  if (chatbot.onboarding_step === null || chatbot.onboarding_step === undefined) {
    redirect(`/dashboard/chatbots/${chatbotId}`);
  }

  // Guard: don't allow jumping ahead of the current onboarding step.
  // Allow navigating to the current step or any completed (earlier) step.
  if (step > chatbot.onboarding_step) {
    redirect(`/onboarding/${chatbotId}/step/${chatbot.onboarding_step}`);
  }

  return <OnboardingStepClient chatbot={chatbot as unknown as Chatbot} step={step} />;
}
