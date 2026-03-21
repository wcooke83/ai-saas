'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import { MarkdownRenderer } from '@/components/wiki/MarkdownRenderer';
import { Card } from '@/components/ui/card';
import { H1 } from '@/components/ui/heading';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import * as LucideIcons from 'lucide-react';

interface WikiArticlePageProps {
  params: Promise<{ slug: string }>;
}

interface WikiPageData {
  slug: string;
  content: string;
  frontmatter: {
    title: string;
    description: string;
    category: string;
    order: number;
  };
  pageInfo: {
    id: string;
    title: string;
    description: string;
  };
  category: {
    id: string;
    title: string;
    icon: string;
  };
}

export default function PublicWikiArticlePage({ params }: WikiArticlePageProps) {
  const { slug } = use(params);
  const [pageData, setPageData] = useState<WikiPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPage() {
      try {
        const res = await fetch(`/api/wiki/${slug}`);
        const data = await res.json();

        if (data.success) {
          setPageData(data.data);
        } else {
          setError(data.error || 'Failed to load page');
        }
      } catch (err) {
        setError('Failed to load wiki page');
        console.error('Wiki page error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [slug]);

  return (
    <PageBackground>
      <Header />

      <main className="container mx-auto px-4 pt-12 pb-16">
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}

        {(error || (!loading && !pageData)) && (
          <div className="max-w-3xl mx-auto space-y-4">
            <Link
              href="/wiki"
              className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Link>
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">{error || 'Page not found'}</p>
            </div>
          </div>
        )}

        {pageData && (
          <div>
            {/* Breadcrumbs — full container width */}
            <div className="mb-6">
              <Breadcrumbs
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Documentation', href: '/wiki' },
                  { label: pageData.category.title },
                  { label: pageData.frontmatter.title },
                ]}
              />
            </div>

            {/* Back link */}
            <Link
              href="/wiki"
              className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Link>

          <div className="max-w-4xl mx-auto">
            {/* Page header */}
            <div className="border-b border-secondary-200 dark:border-secondary-700 pb-8 mb-8">
              {(() => {
                const CategoryIcon = (LucideIcons as any)[pageData.category.icon] || BookOpen;
                return (
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl">
                      <CategoryIcon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <H1 className="text-3xl sm:text-4xl">
                      {pageData.frontmatter.title}
                    </H1>
                  </div>
                );
              })()}
              {pageData.frontmatter.description && (
                <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl">
                  {pageData.frontmatter.description}
                </p>
              )}
            </div>

            {/* Content */}
            <Card className="p-6 sm:p-10">
              <MarkdownRenderer content={pageData.content} />
            </Card>

            {/* Footer navigation */}
            <div className="pt-8 border-t border-secondary-200 dark:border-secondary-700 mt-8">
              <Link
                href="/wiki"
                className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to all documentation
              </Link>
            </div>
          </div>
          </div>
        )}
      </main>

      <Footer />
    </PageBackground>
  );
}
