'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOnboarding } from './OnboardingContext';

const STEPS = [
  { number: 1, label: 'Name' },
  { number: 2, label: 'Train' },
  { number: 3, label: 'Test' },
  { number: 4, label: 'Style' },
  { number: 5, label: 'Deploy' },
] as const;

export function OnboardingProgressStepper() {
  const { currentStep, maxCompletedStep, goToStep } = useOnboarding();

  return (
    <nav aria-label="Setup progress" className="mb-8">
      <ol className="flex items-center justify-between gap-1 sm:gap-0">
        {STEPS.map((step, index) => {
          const isCompleted = step.number <= maxCompletedStep;
          const isCurrent = step.number === currentStep;
          const isClickable = isCompleted && !isCurrent;

          return (
            <li
              key={step.number}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <button
                  type="button"
                  onClick={() => isClickable && goToStep(step.number)}
                  disabled={!isClickable}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Step ${step.number}: ${step.label}${isCompleted ? ' (completed)' : ''}${isCurrent ? ' (current)' : ''}`}
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium motion-safe:transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    isCompleted && !isCurrent &&
                      'bg-green-500 text-white cursor-pointer hover:bg-green-600',
                    isCurrent &&
                      'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 ring-2 ring-primary-500',
                    !isCompleted && !isCurrent &&
                      'bg-secondary-100 text-secondary-500 dark:bg-secondary-800 dark:text-secondary-400 cursor-default'
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    step.number
                  )}
                </button>
                {/* Step label -- hidden on very small screens */}
                <span
                  className={cn(
                    'mt-1.5 text-xs font-medium hidden sm:block',
                    isCurrent
                      ? 'text-secondary-900 dark:text-secondary-100'
                      : isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-secondary-400 dark:text-secondary-500'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line between steps -- hidden below sm to prevent layout breakage */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 hidden sm:block sm:mx-4',
                    step.number <= maxCompletedStep
                      ? 'bg-green-500'
                      : 'bg-secondary-200 dark:bg-secondary-700'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
