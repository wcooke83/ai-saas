import { ReactNode } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { H1 } from '@/components/ui/heading';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ToolsHeroProps {
  badge?: string;
  title: ReactNode;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
  /** When true, removes full-viewport height and uses compact padding instead. */
  compact?: boolean;
  cta?: {
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
}

export function ToolsHero({
  badge,
  title,
  description,
  breadcrumbs,
  children,
  compact,
  cta,
}: ToolsHeroProps) {
  return (
    <section className={compact ? "container mx-auto px-4 py-16" : "min-h-[calc(100dvh-4rem)] flex flex-col container mx-auto px-4 py-12"}>
      {breadcrumbs && (
        <div className="mb-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
      <div className={compact ? "text-center" : "flex-1 flex flex-col items-center justify-center text-center -mt-16"}>
      {badge && (
        <Badge className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" aria-hidden="true" />
          {badge}
        </Badge>
      )}
      <H1 className="mb-4">
        {title}
      </H1>
      <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
        {description}
      </p>
      {cta && (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href={cta.primary.href}>
              {cta.primary.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {cta.secondary && (
            <Button size="lg" variant="outline" asChild>
              <Link href={cta.secondary.href}>{cta.secondary.label}</Link>
            </Button>
          )}
        </div>
      )}
      {children}
      </div>
    </section>
  );
}
