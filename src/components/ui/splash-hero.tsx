import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';

export interface SplashHeroProps {
  headline: ReactNode;
  supportingText: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  breadcrumbs?: BreadcrumbItem[];
}

export function SplashHero({
  headline,
  supportingText,
  primaryCta,
  secondaryCta,
  breadcrumbs,
}: SplashHeroProps) {
  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex flex-col overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 container mx-auto px-4 py-12">
        {breadcrumbs && (
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center max-w-3xl sm:-mt-16">
          <h1 className="text-6xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.12]">
            {headline}
          </h1>
          <div className="flex flex-col sm:flex-row items-stretch gap-4 my-10 lg:my-12">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-sm transition-colors"
            >
              {primaryCta.label}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300 font-medium text-lg rounded-sm border border-secondary-300 dark:border-secondary-600 transition-colors"
            >
              {secondaryCta.label}
            </Link>
          </div>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-xl leading-relaxed">
            {supportingText}
          </p>
        </div>
      </div>
    </section>
  );
}
