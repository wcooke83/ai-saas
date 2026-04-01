import Link from 'next/link';

export function MidArticleCta({ message }: { message?: string }) {
  return (
    <div className="my-10 rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <p className="text-secondary-700 dark:text-secondary-300 text-sm flex-1">
        {message || 'Want to try this with your own content? Create a free chatbot in under 5 minutes.'}
      </p>
      <Link
        href="/login?mode=signup"
        className="shrink-0 inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        Try it free
      </Link>
    </div>
  );
}
