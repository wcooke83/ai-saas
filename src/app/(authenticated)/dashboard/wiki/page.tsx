'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { WikiCard } from '@/components/wiki/WikiCard';
import { H1 } from '@/components/ui/heading';
import * as LucideIcons from 'lucide-react';

interface WikiPage {
  id: string;
  title: string;
  description: string;
  file: string;
  order: number;
}

interface WikiCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  pages: WikiPage[];
}

interface WikiIndex {
  categories: WikiCategory[];
}

export default function WikiIndexPage() {
  const [index, setIndex] = useState<WikiIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadIndex() {
      try {
        const res = await fetch('/api/wiki/index');
        const data = await res.json();
        
        if (data.success) {
          setIndex(data.data);
        } else {
          setError(data.error || 'Failed to load wiki');
        }
      } catch (err) {
        setError('Failed to load wiki index');
        console.error('Wiki index error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadIndex();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
          <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <H1 variant="dashboard">Documentation Wiki</H1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Learn how to use VocUI features and integrate them into your applications
          </p>
        </div>
      </div>

      {/* Categories */}
      {index?.categories.map((category) => {
        // Get the icon component dynamically
        const IconComponent = (LucideIcons as any)[category.icon] || BookOpen;
        
        // Only show categories that have pages
        if (category.pages.length === 0) return null;

        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <IconComponent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                  {category.title}
                </h2>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.pages
                .sort((a, b) => a.order - b.order)
                .map((page) => (
                  <WikiCard
                    key={page.id}
                    id={page.id}
                    title={page.title}
                    description={page.description}
                    icon={IconComponent}
                  />
                ))}
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {index?.categories.every((cat) => cat.pages.length === 0) && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-secondary-400 mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            No documentation available yet
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            Check back soon for guides and tutorials
          </p>
        </div>
      )}
    </div>
  );
}
