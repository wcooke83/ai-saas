'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import { MarkdownRenderer } from '@/components/wiki/MarkdownRenderer';
import { Card } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';

interface WikiPageProps {
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

export default function WikiPage({ params }: WikiPageProps) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/wiki"
          className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wiki
        </Link>
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error || 'Page not found'}</p>
        </div>
      </div>
    );
  }

  const CategoryIcon = (LucideIcons as any)[pageData.category.icon] || BookOpen;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/dashboard/wiki"
          className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100"
        >
          Wiki
        </Link>
        <span className="text-secondary-400">/</span>
        <span className="text-secondary-600 dark:text-secondary-400">{pageData.category.title}</span>
        <span className="text-secondary-400">/</span>
        <span className="text-secondary-900 dark:text-secondary-100 font-medium">
          {pageData.frontmatter.title}
        </span>
      </div>

      {/* Back button */}
      <Link
        href="/dashboard/wiki"
        className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Wiki
      </Link>

      {/* Page header */}
      <div className="border-b border-secondary-200 dark:border-secondary-700 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <CategoryIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            {pageData.frontmatter.title}
          </h1>
        </div>
        {pageData.frontmatter.description && (
          <p className="text-lg text-secondary-600 dark:text-secondary-400">
            {pageData.frontmatter.description}
          </p>
        )}
      </div>

      {/* Content */}
      <Card className="p-8">
        <MarkdownRenderer content={pageData.content} />
      </Card>

      {/* Footer navigation */}
      <div className="pt-6 border-t border-secondary-200 dark:border-secondary-700">
        <Link
          href="/dashboard/wiki"
          className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all documentation
        </Link>
      </div>
    </div>
  );
}
