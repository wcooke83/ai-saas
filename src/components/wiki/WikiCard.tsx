import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface WikiCardProps {
  id: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function WikiCard({ id, title, description, icon: Icon }: WikiCardProps) {
  return (
    <Link href={`/dashboard/wiki/${id}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
              )}
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <ArrowRight className="w-5 h-5 text-secondary-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
