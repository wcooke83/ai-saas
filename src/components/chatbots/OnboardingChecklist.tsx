'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  Database,
  Palette,
  Code,
  X,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  href: string;
  icon: React.ElementType;
}

interface OnboardingChecklistProps {
  chatbotId: string;
  hasKnowledgeSources: boolean;
  isPublished: boolean;
  widgetReviewedAt: string | null;
  onboardingStep?: number | null;
}

const DISMISS_KEY_PREFIX = 'chatbot-onboarding-dismissed-';
export const WIDGET_REVIEWED_KEY_PREFIX = 'chatbot-widget-reviewed-';

export function OnboardingChecklist({
  chatbotId,
  hasKnowledgeSources,
  isPublished,
  widgetReviewedAt,
  onboardingStep,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [widgetReviewed, setWidgetReviewed] = useState(!!widgetReviewedAt);

  useEffect(() => {
    const stored = localStorage.getItem(`${DISMISS_KEY_PREFIX}${chatbotId}`);
    setDismissed(stored === 'true');

    // If localStorage says reviewed but server doesn't, sync to server
    const localReviewed = localStorage.getItem(`${WIDGET_REVIEWED_KEY_PREFIX}${chatbotId}`) === 'true';
    if (localReviewed && !widgetReviewedAt) {
      fetch(`/api/chatbots/${chatbotId}/widget-reviewed`, { method: 'POST' }).catch(() => {});
      setWidgetReviewed(true);
    }
  }, [chatbotId, widgetReviewedAt]);

  const steps: OnboardingStep[] = [
    {
      id: 'knowledge',
      label: 'Add Knowledge Sources',
      description: 'Train your chatbot with URLs, documents, or text',
      completed: hasKnowledgeSources,
      href: `/dashboard/chatbots/${chatbotId}/knowledge`,
      icon: Database,
    },
    {
      id: 'widget',
      label: 'Customize Widget',
      description: 'Match colors and branding to your website',
      completed: widgetReviewed,
      href: `/dashboard/chatbots/${chatbotId}/customize`,
      icon: Palette,
    },
    {
      id: 'deploy',
      label: 'Deploy to Website',
      description: 'Test the live preview, publish, and embed on your site',
      completed: isPublished,
      href: `/dashboard/chatbots/${chatbotId}/deploy`,
      icon: Code,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const allComplete = completedCount === steps.length;

  // Hide checklist when wizard is active (onboarding_step is set)
  if (onboardingStep != null || dismissed || allComplete) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(`${DISMISS_KEY_PREFIX}${chatbotId}`, 'true');
    setDismissed(true);
  };

  const progressPercent = (completedCount / steps.length) * 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Getting Started
          </CardTitle>
          <button
            onClick={handleDismiss}
            className="p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors rounded"
            aria-label="Dismiss onboarding checklist"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-secondary-600 dark:text-secondary-400">
              {completedCount} of {steps.length} steps complete
            </span>
            <span className="text-secondary-500 dark:text-secondary-400 font-medium">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full h-2 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {steps.map((step) => (
            <Link
              key={step.id}
              href={step.href}
              className="flex items-center gap-3 p-2.5 -mx-1 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors group"
            >
              {step.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-secondary-300 dark:text-secondary-600 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    step.completed
                      ? 'text-secondary-400 dark:text-secondary-500 line-through'
                      : 'text-secondary-900 dark:text-secondary-100'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                  {step.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
