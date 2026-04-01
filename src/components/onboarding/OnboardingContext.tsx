'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import type { Chatbot } from '@/lib/chatbots/types';

export interface OnboardingContextType {
  chatbotId: string | null;
  chatbot: Chatbot | null;
  currentStep: number;
  maxCompletedStep: number;
  loading: boolean;
  setChatbot: (c: Chatbot) => void;
  goToStep: (step: number) => void;
  completeCurrentStep: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return ctx;
}

interface OnboardingProviderProps {
  children: ReactNode;
  initialChatbot: Chatbot | null;
  initialStep: number;
}

export function OnboardingProvider({
  children,
  initialChatbot,
  initialStep,
}: OnboardingProviderProps) {
  const router = useRouter();
  const params = useParams();
  const [chatbot, setChatbotState] = useState<Chatbot | null>(initialChatbot);
  const [loading, setLoading] = useState(false);

  const chatbotId = (params.chatbotId as string) || chatbot?.id || null;

  // Derive currentStep from the URL param so browser back/forward updates it.
  // The server component passes initialStep for the first render, but on
  // client-side navigations (popstate / router.push) the URL param is the
  // source of truth.
  const urlStep = params.step ? parseInt(params.step as string, 10) : NaN;
  const currentStep = !isNaN(urlStep) && urlStep >= 1 && urlStep <= 5
    ? urlStep
    : initialStep;

  // maxCompletedStep: steps before the chatbot's current onboarding_step are "completed"
  // e.g. if onboarding_step=3, steps 1 and 2 are completed -> maxCompletedStep=2
  const maxCompletedStep = chatbot?.onboarding_step
    ? chatbot.onboarding_step - 1
    : currentStep;

  const setChatbot = useCallback((c: Chatbot) => {
    setChatbotState(c);
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      if (step < 1 || step > 5) return;
      const id = chatbotId;
      // Guard: can't navigate to a step route with the "new" placeholder ID
      if (!id || id === 'new') return;
      router.push(`/onboarding/${id}/step/${step}`);
    },
    [chatbotId, router]
  );

  const completeCurrentStep = useCallback(async () => {
    if (!chatbotId || chatbotId === 'new') return;
    const nextStep = currentStep >= 5 ? null : currentStep + 1;

    setLoading(true);
    try {
      const res = await fetch(`/api/onboarding/${chatbotId}/step`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: nextStep }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error?.message || 'Failed to save progress. Please try again.';
        toast.error(msg);
        return;
      }

      const data = await res.json();
      if (data.data?.chatbot) {
        setChatbotState(data.data.chatbot);
      }

      if (nextStep === null) {
        // Wizard complete -- redirect to dashboard
        router.push(`/dashboard/chatbots/${chatbotId}`);
      } else {
        router.push(`/onboarding/${chatbotId}/step/${nextStep}`);
      }
    } catch {
      toast.error('A network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [chatbotId, currentStep, router]);

  // Refetch chatbot when chatbotId changes (e.g. navigating between steps)
  useEffect(() => {
    if (!chatbotId || chatbotId === 'new' || chatbot?.id === chatbotId) return;

    let cancelled = false;
    setLoading(true);
    fetch(`/api/chatbots/${chatbotId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.data?.chatbot) {
          setChatbotState(data.data.chatbot);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [chatbotId]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({
      chatbotId,
      chatbot,
      currentStep,
      maxCompletedStep,
      loading,
      setChatbot,
      goToStep,
      completeCurrentStep,
    }),
    [chatbotId, chatbot, currentStep, maxCompletedStep, loading, setChatbot, goToStep, completeCurrentStep]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}
