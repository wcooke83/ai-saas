import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { H1 } from '@/components/ui/heading';
import { Sparkles } from 'lucide-react';

interface ToolsHeroProps {
  badge?: string;
  title: ReactNode;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
  /** When true, removes full-viewport height and uses compact padding instead. */
  compact?: boolean;
}

export function ToolsHero({
  badge,
  title,
  description,
  breadcrumbs,
  children,
  compact,
}: ToolsHeroProps) {
  return (
    <section className={compact ? "container mx-auto px-4 py-16" : "min-h-[calc(100vh-4rem)] flex flex-col container mx-auto px-4 py-12"}>
      {breadcrumbs && (
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
      <div className={compact ? "text-center" : "flex-1 flex flex-col items-center justify-center text-center"}>
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
      {children}
      </div>
    </section>
  );
}
