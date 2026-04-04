'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [skipping, setSkipping] = useState(false);

  const handleSkip = async () => {
    setSkipping(true);
    try {
      await fetch('/api/onboarding/skip', { method: 'POST' });
    } catch {
      // Best-effort — navigate regardless
    } finally {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(var(--page-bg))' }}>
      {/* Top bar -- responsive padding for small screens */}
      <header className="h-14 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between px-3 sm:px-6" style={{ backgroundColor: 'rgb(var(--card-bg))' }}>
        <Link
          href="/dashboard"
          className="text-xl font-bold text-primary-600 dark:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
        >
          VocUI
        </Link>
        <button
          type="button"
          onClick={handleSkip}
          disabled={skipping}
          className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {skipping ? 'Saving...' : 'Skip onboarding'}
        </button>
      </header>

      {/* Content -- generous mobile padding, more on sm+ */}
      <main className="mx-auto max-w-3xl px-3 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
