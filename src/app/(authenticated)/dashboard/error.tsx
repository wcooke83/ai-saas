'use client';

import { useRouter } from 'next/navigation';
import { CardErrorFallback } from '@/components/error-boundary';

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
    reset();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CardErrorFallback
        title="Dashboard Error"
        message="Failed to load the dashboard. Please try again."
        onRetry={handleRetry}
      />
    </div>
  );
}
