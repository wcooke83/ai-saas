'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { PublicWikiCard } from '@/components/wiki/PublicWikiCard';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
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

export default function PublicWikiIndexPage() {
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

  return (
    <PageBackground>
      <Header />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-12 pb-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Documentation' }]} />
        </div>
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl">
              <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <H1 className="text-4xl">
              Documentation
            </H1>
          </div>
          <p className="text-lg text-secondary-600 dark:text-secondary-400">
            Guides and tutorials to help you get the most out of VocUI, chatbots, and integrations.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 pb-16">
        {loading && (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {index && (
          <div className="space-y-12">
            {index.categories.map((category) => {
              const IconComponent = (LucideIcons as any)[category.icon] || BookOpen;

              if (category.pages.length === 0) return null;

              return (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <IconComponent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100">
                        {category.title}
                      </h2>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.pages
                      .sort((a, b) => a.order - b.order)
                      .map((page) => (
                        <PublicWikiCard
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

            {index.categories.every((cat) => cat.pages.length === 0) && (
              <div className="text-center py-16">
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
        )}
      </main>

      <Footer />
    </PageBackground>
  );
}
