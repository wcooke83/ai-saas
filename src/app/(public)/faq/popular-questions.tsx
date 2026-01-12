'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getPopularQuestions } from './faq-data';

interface PopularQuestionsProps {
  onSelectQuestion: (categoryId: string, questionId: string) => void;
}

export function PopularQuestions({ onSelectQuestion }: PopularQuestionsProps) {
  const popularQuestions = getPopularQuestions();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
          Popular Questions
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {popularQuestions.map((q, index) => {
          const Icon = q.icon;
          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(q.categoryId, q.id)}
              className="text-left"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.35s ease-out ${index * 75}ms, transform 0.35s ease-out ${index * 75}ms`,
              }}
            >
              <Card className="group relative p-4 h-full hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50">
                    <Icon className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  </div>
                </div>
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {q.question}
                </p>
                <ArrowRight
                  className="absolute bottom-4 right-4 w-4 h-4 text-secondary-300 dark:text-secondary-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
                  aria-hidden="true"
                />
              </Card>
            </button>
          );
        })}
      </div>
    </section>
  );
}
