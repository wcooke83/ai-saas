'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Loader2,
  Check,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  TrendingUp,
  UserPlus,
  Headphones,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/components/onboarding/OnboardingContext';
import { SYSTEM_PROMPT_TEMPLATES } from '@/lib/chatbots/types';
import type { SystemPromptTemplate } from '@/lib/chatbots/types';

const TEMPLATE_ICON_MAP: Record<string, LucideIcon> = {
  MessageCircle,
  HelpCircle,
  TrendingUp,
  UserPlus,
  Headphones,
  Wrench,
};

const WIZARD_TEMPLATE_IDS = [
  'helpful-assistant',
  'customer-support',
  'faq-bot',
  'sales-assistant',
  'lead-generation',
  'technical-support',
];

const WIZARD_TEMPLATES = SYSTEM_PROMPT_TEMPLATES.filter((t) =>
  WIZARD_TEMPLATE_IDS.includes(t.id)
).sort(
  (a, b) => WIZARD_TEMPLATE_IDS.indexOf(a.id) - WIZARD_TEMPLATE_IDS.indexOf(b.id)
);

export function CreateStep() {
  const router = useRouter();
  const { setChatbot } = useOnboarding();
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<SystemPromptTemplate>(
    WIZARD_TEMPLATES[0]
  );
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length >= 1 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/onboarding/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          system_prompt: selectedTemplate.prompt,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error?.message || 'Could not create your chatbot. Please try again.';
        // Surface plan limit errors with a friendlier message
        if (res.status === 403) {
          toast.error(msg, {
            description: 'Visit your account settings to upgrade your plan.',
            duration: 6000,
          });
        } else {
          toast.error(msg);
        }
        return;
      }

      const data = await res.json();
      const chatbot = data.data.chatbot;
      setChatbot(chatbot);
      router.push(`/onboarding/${chatbot.id}/step/2`);
    } catch {
      toast.error('A network error occurred. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Name your chatbot
        </h2>
        <p className="mt-1 text-secondary-500 dark:text-secondary-400">
          You can always change this later.
        </p>
      </div>

      {/* Name input */}
      <div className="space-y-2">
        <Label htmlFor="chatbot-name">Chatbot name</Label>
        <Input
          id="chatbot-name"
          placeholder="e.g. Support Bot"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
        />
        <p className="text-xs text-secondary-500 dark:text-secondary-400">
          This is what your visitors will see.
        </p>
      </div>

      {/* Template selector */}
      <div className="space-y-3">
        <Label>What will your chatbot do?</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WIZARD_TEMPLATES.map((template) => {
            const isSelected = selectedTemplate.id === template.id;
            const IconComponent = template.icon
              ? TEMPLATE_ICON_MAP[template.icon]
              : null;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template)}
                aria-pressed={isSelected}
                className={cn(
                  'relative p-4 text-left rounded-lg border-2 motion-safe:transition-all motion-safe:duration-150',
                  isSelected
                    ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600 hover:shadow-sm'
                )}
                style={
                  !isSelected
                    ? { backgroundColor: 'rgb(var(--card-bg))' }
                    : undefined
                }
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="flex items-start gap-3 pr-6">
                  {IconComponent && (
                    <div
                      className={cn(
                        'p-1.5 rounded-md shrink-0',
                        isSelected
                          ? 'bg-primary-100 dark:bg-primary-800/50'
                          : 'bg-secondary-100 dark:bg-secondary-800'
                      )}
                    >
                      <IconComponent
                        className={cn(
                          'w-4 h-4',
                          isSelected
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-secondary-500 dark:text-secondary-400'
                        )}
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-medium text-sm text-secondary-900 dark:text-secondary-100">
                      {template.name}
                    </span>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button onClick={handleSubmit} disabled={!canSubmit} size="lg" className="w-full sm:w-auto">
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 motion-safe:animate-spin" />
              Creating...
            </>
          ) : (
            <>
              Create chatbot
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
