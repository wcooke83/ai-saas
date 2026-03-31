'use client';

import { useRef, useEffect } from 'react';
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { OnboardingProgressStepper } from '@/components/onboarding/OnboardingProgressStepper';
import { CreateStep } from '@/components/onboarding/steps/CreateStep';
import { TrainStep } from '@/components/onboarding/steps/TrainStep';
import { StyleStep } from '@/components/onboarding/steps/StyleStep';
import { DeployStep } from '@/components/onboarding/steps/DeployStep';
import type { Chatbot } from '@/lib/chatbots/types';

const STEP_LABELS: Record<number, string> = {
  1: 'Name your chatbot',
  2: 'Train your chatbot',
  3: 'Style your widget',
  4: 'Deploy your chatbot',
};

interface OnboardingStepClientProps {
  chatbot: Chatbot | null;
  step: number;
}

export function OnboardingStepClient({ chatbot, step }: OnboardingStepClientProps) {
  const stepContentRef = useRef<HTMLDivElement>(null);

  // Focus the step content area when the step changes
  useEffect(() => {
    // Small delay to ensure the DOM has rendered
    const timer = setTimeout(() => {
      stepContentRef.current?.focus({ preventScroll: false });
    }, 100);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <OnboardingProvider initialChatbot={chatbot} initialStep={step}>
      <OnboardingProgressStepper />

      {/* Visually hidden live region for step change announcements */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {`Step ${step} of 4: ${STEP_LABELS[step] ?? ''}`}
      </div>

      {/* Step content wrapper with focus management */}
      <div
        ref={stepContentRef}
        tabIndex={-1}
        className="outline-none"
        role="region"
        aria-label={STEP_LABELS[step] ?? `Step ${step}`}
      >
        <StepContent step={step} />
      </div>
    </OnboardingProvider>
  );
}

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <CreateStep />;
    case 2:
      return <TrainStep />;
    case 3:
      return <StyleStep />;
    case 4:
      return <DeployStep />;
    default:
      return null;
  }
}
