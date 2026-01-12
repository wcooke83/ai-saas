'use client';

import { useState, useCallback } from 'react';
import { ThumbsUp, ThumbsDown, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import type { FaqQuestion } from './faq-data';

interface FaqListProps {
  questions: FaqQuestion[];
  categoryId: string;
  showFeedback?: boolean;
}

export function FaqAccordion({
  questions,
  categoryId,
  showFeedback = true,
}: FaqListProps) {
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());

  const copyLink = useCallback((questionId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${questionId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  }, []);

  const handleFeedback = useCallback((questionId: string, helpful: boolean) => {
    setFeedbackGiven((prev) => new Set(prev).add(questionId));
    toast.success('Thanks for your feedback!');
    console.log(`Feedback for ${questionId}: ${helpful ? 'helpful' : 'not helpful'}`);
  }, []);

  return (
    <div className="space-y-4">
      {questions.map((item) => {
        const hasFeedback = feedbackGiven.has(item.id);

        return (
          <div
            key={item.id}
            id={`question-${item.id}`}
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'rgb(var(--card-bg))',
              border: '1px solid rgb(var(--card-border))',
            }}
          >
            {/* Question */}
            <div className="p-5">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-primary-500 text-white">
                  Q
                </span>
                <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 text-base">
                  {item.question}
                </h3>
              </div>
            </div>

            {/* Answer */}
            <div className="px-5 pb-5">
              <div className="pl-10">
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                  {item.answer}
                </p>

                {/* Feedback and actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-800">
                  {showFeedback && (
                    <div className="flex items-center gap-4">
                      {hasFeedback ? (
                        <span className="text-sm text-secondary-500 dark:text-secondary-400">
                          Thanks for your feedback!
                        </span>
                      ) : (
                        <>
                          <span className="text-sm text-secondary-500 dark:text-secondary-400">
                            Was this helpful?
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleFeedback(item.id, true)}
                              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-secondary-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                              aria-label="Yes, this was helpful"
                            >
                              <ThumbsUp className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleFeedback(item.id, false)}
                              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-secondary-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              aria-label="No, this was not helpful"
                            >
                              <ThumbsDown className="w-5 h-5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => copyLink(item.id)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-secondary-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    aria-label="Copy link to this question"
                  >
                    <Link2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
