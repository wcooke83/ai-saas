'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Loader2,
  Check,
  Copy,
  ChevronLeft,
  Rocket,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/components/onboarding/OnboardingContext';

export function DeployStep() {
  const {
    chatbotId,
    chatbot,
    setChatbot,
    loading: ctxLoading,
    goToStep,
    completeCurrentStep,
  } = useOnboarding();

  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [completing, setCompleting] = useState(false);

  const isPublished = chatbot?.is_published ?? false;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const embedCode = `<script src="${baseUrl}/widget/sdk.js" data-chatbot-id="${chatbotId}"></script>`;

  const handlePublish = async () => {
    if (!chatbotId) return;
    setPublishing(true);
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/publish`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Could not publish your chatbot. Please try again.');
      const data = await res.json();
      setChatbot(data.data.chatbot);
      toast.success('Chatbot published');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not publish your chatbot. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await completeCurrentStep();
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          You&apos;re ready to go live
        </h2>
        <p className="mt-1 text-secondary-500 dark:text-secondary-400">
          Add your chatbot to your site or connect your channels.
        </p>
      </div>

      {/* Publish section -- aria-live announces state change to screen readers */}
      <div
        className="rounded-lg border border-secondary-200 dark:border-secondary-700 p-6"
        style={{ backgroundColor: 'rgb(var(--card-bg))' }}
        aria-live="polite"
      >
        {isPublished ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium text-secondary-900 dark:text-secondary-100">
                You&apos;re all set. Your chatbot is live.
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Copy the embed code below to add it to your website.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-secondary-100">
                Publish your chatbot
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Publishing makes your chatbot available to visitors on your website.
              </p>
            </div>
            <Button onClick={handlePublish} disabled={publishing} className="w-full sm:w-auto shrink-0">
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 motion-safe:animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Publish Chatbot
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Embed code */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
          Website widget
        </label>
        <p className="text-sm text-secondary-500 dark:text-secondary-400">
          Paste this snippet before the closing{' '}
          <code className="px-1 py-0.5 rounded bg-secondary-100 dark:bg-secondary-800 text-xs font-mono">
            &lt;/body&gt;
          </code>{' '}
          tag on your site.
        </p>
        <div className="relative group">
          <pre
            aria-label="Embed code snippet"
            className={`py-4 px-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-xs sm:text-sm overflow-x-auto font-mono leading-relaxed border border-secondary-800 ${
              !isPublished ? 'opacity-50 select-none' : ''
            }`}
          >
            <code>{embedCode}</code>
          </pre>
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-secondary-800 border-secondary-700 hover:bg-secondary-700 text-secondary-200"
            onClick={handleCopy}
            disabled={!isPublished}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy code
              </>
            )}
          </Button>
        </div>
        {chatbotId && (
          <Link
            href={`/dashboard/chatbots/${chatbotId}/deploy`}
            className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 hover:underline"
          >
            Connect Slack workspace or Telegram
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-3 border-t border-secondary-200 dark:border-secondary-700 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          onClick={() => goToStep(4)}
          disabled={completing || ctxLoading}
          className="self-start"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={handleComplete}
            disabled={completing || ctxLoading}
            className="text-sm text-center text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 motion-safe:transition-colors disabled:opacity-50"
          >
            Skip, I&apos;ll deploy later
          </button>
          <Button onClick={handleComplete} disabled={completing || ctxLoading} size="lg" className="w-full sm:w-auto">
            {completing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 motion-safe:animate-spin" />
                Finishing...
              </>
            ) : (
              <>
                Go to my dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
