'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { faqCategories } from './faq-data';

interface CategoryGridProps {
  onSelectCategory?: (categoryId: string) => void;
}

export function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (categoryId: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    // Smooth scroll to category section
    const element = document.getElementById(categoryId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="py-8">
      <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
        Browse by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {faqCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => handleClick(category.id)}
              className="text-left"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.4s ease-out ${index * 50}ms, transform 0.4s ease-out ${index * 50}ms`,
              }}
            >
              <Card className="group p-5 h-full hover:shadow-lg transition-shadow duration-200">
                <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/50 w-fit mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/70 transition-colors">
                  <Icon
                    className="w-6 h-6 text-primary-500 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                  {category.questions.length} questions
                </p>
              </Card>
            </button>
          );
        })}
      </div>
    </section>
  );
}
