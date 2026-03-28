import { Rocket, Sparkles, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PageBackground } from '@/components/ui/page-background';

export const metadata = {
  title: 'Coming Soon | VocUI',
  description: 'VocUI is coming soon. We are building something amazing.',
};

export default function ComingSoonPage() {
  return (
    <PageBackground>
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <Badge className="mb-6">In Development</Badge>

        <div className="flex items-center gap-3 mb-6">
          <Rocket className="lucide h-8 w-8 text-primary-500" />
          <Sparkles className="lucide h-8 w-8 text-primary-400" />
          <Zap className="lucide h-8 w-8 text-primary-500" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-[rgb(var(--text-heading))] mb-4">
          This feature is coming soon
        </h1>

        <p className="text-lg text-[rgb(var(--text-primary))] max-w-md mb-8">
          We're working on it and will let you know when it's ready.
        </p>
      </main>
    </PageBackground>
  );
}
