import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Sparkles,
  Palette,
  Type,
  Layout,
  MousePointer,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  Code,
  Accessibility,
  Smartphone,
} from 'lucide-react';
import { SDKTabs } from './sdk-tabs';

export const metadata = {
  title: 'SDK & Design System | AI SaaS Tools',
  description: 'Design system documentation, UI components, and development standards.',
};

export default function SDKPage() {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      {/* Header */}
      <header className="border-b border-secondary-200 dark:border-secondary-800 bg-white dark:bg-secondary-900 sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back
            </Link>
            <div className="h-6 w-px bg-secondary-200 dark:bg-secondary-700" />
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary-500" aria-hidden="true" />
              <span className="font-semibold dark:text-secondary-100">SDK & Design System</span>
            </div>
          </div>
          <Badge variant="outline">v1.0.0</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">Design System & Standards</h1>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl">
            Our design system ensures consistency, accessibility, and quality across all components.
            Use this reference when building new features or components.
          </p>
        </div>

        {/* Tabs */}
        <SDKTabs />
      </main>
    </div>
  );
}
