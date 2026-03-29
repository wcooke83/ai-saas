import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, Palette, Code } from 'lucide-react';

export function NewUserWelcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 text-center">
      <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-3">
        Welcome to VocUI — let&apos;s build your first chatbot
      </h1>
      <p className="text-secondary-600 dark:text-secondary-400 max-w-lg mb-8">
        You&apos;ll train a chatbot on your own content and deploy it to your website in minutes. Visitors get instant, accurate answers — you get fewer repetitive support requests.
      </p>

      <Button asChild size="lg" className="mb-12">
        <Link href="/dashboard/chatbots/new">
          Create your first chatbot
          <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
        </Link>
      </Button>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm text-secondary-500 dark:text-secondary-400">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center flex-shrink-0">
            <Database className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
          </div>
          <span>1. Train it on your content</span>
        </div>
        <ArrowRight className="w-4 h-4 text-secondary-300 dark:text-secondary-600 hidden sm:block" aria-hidden="true" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center flex-shrink-0">
            <Palette className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
          </div>
          <span>2. Customize the widget</span>
        </div>
        <ArrowRight className="w-4 h-4 text-secondary-300 dark:text-secondary-600 hidden sm:block" aria-hidden="true" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center flex-shrink-0">
            <Code className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
          </div>
          <span>3. Deploy to your site</span>
        </div>
      </div>
    </div>
  );
}
